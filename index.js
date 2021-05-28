const { exec } = require('child_process');
const Discord = require('discord.js');
const Command = require('./command.js');

const client = new Discord.Client();
let startedFlag = false;

const config = {
    textChannel: 'your_id_here',
    voiceChannel: 'your_id_here',
};

client.on('message', (message) => {
    const mentions = message.mentions.users;
    if (mentions.size > 0 && mentions.get('847470544798351380')) {
        const commandName = message.content.split(' ')[1];
        console.log('Executed the command:', commandName);

        const guild = message.channel.guild;
        const channel = message.channel;
        const author = message.author.id;

        for (let command of Command.getCommands()) {
            if (command.match(commandName)) {
                command.exec(guild, channel, author);
                break;
            }
        }
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    // let usersCount = null;
    const guild = client.guilds.cache.get(newState.guild.id);
    const userInfo = guild.members.cache.get(newState.id).user;
    const usersCount = guild.channels.cache.get(config.voiceChannel).members.size;
    console.log();

    if (newState.channelID === null) {
        if (oldState.channelID !== config.voiceChannel) return false;
        console.log('⚡ Disconnected');
        guild.channels.cache.get(config.textChannel).send(`:wave: \`${userInfo.username}\` has left.`);
    } else {
        if (newState.channelID !== config.voiceChannel) {
            if (oldState.channelID === config.voiceChannel) {
                console.log('⚡ Disconnected');
                guild.channels.cache.get(config.textChannel).send(`:wave: \`${userInfo.username}\` has left.`);
            }
        } else {
            if (oldState.channelID !== newState.channelID && newState.channelID === config.voiceChannel) {
                console.log('🔥 Connected');
                guild.channels.cache.get(config.textChannel).send(`:raised_hands: \`${userInfo.username}\` has joined!`);
            } else {
                ['serverDeaf', 'serverMute', 'selfDeaf', 'selfMute', 'selfVideo', 'streaming'].map((key) => {
                    if (oldState[key] !== newState[key] && oldState[key] !== null && newState[key] !== null) {
                        console.log(`⚙ Property \`${key}\` changed to ${newState[key]}`);
                        guild.channels.cache.get(config.textChannel).send(`:gear: \`${userInfo.username}\` has changed \`${key}\``);
                    }
                });    
            }
        }
    }

    console.log(`  user: ${userInfo.username}#${userInfo.discriminator}`);
    console.log(`  time: ${new Date().getTime()}`);
    console.log(`  users: ${usersCount}`);

    if (usersCount >= 2 && !startedFlag) {
        guild.channels.cache.get(config.textChannel).send(`:fire: Started at \`${new Date}\``);
        startedFlag = true
    }

    if (usersCount === 0 && startedFlag) {
        guild.channels.cache.get(config.textChannel).send(`:zap: Ended at \`${new Date}\``);
        startedFlag = false
    }
});

client.on('ready', () => {
    console.log('OK');
});

client.login(process.env.VC_BOT_TOKEN);
