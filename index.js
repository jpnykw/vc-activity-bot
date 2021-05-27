const Discord = require('discord.js');
const client = new Discord.Client();
let startedFlag = false;

const config = {
    textChannel: 'your_id_here',
    voiceChannel: 'your_id_here',
};

client.on('message', (message) => {
    if (message.content.includes('<@!847470544798351380>')) {
        // const author_id = message.author.id
        // console.log(message.author)
        // console.log(message.guild.channels.cache)
        // console.log(message.member.voice.channelID)

        const currentId = message.member.voice.channelID; // get voice channel's ID the user currently in
        // const voiceState = new Discord.VoiceState(message.guild)
        if (currentId !== null) {
            message.channel.send(`You are currently in ${message.guild.channels.cache.get(currentId).name}`);
        }
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
    const guild = client.guilds.cache.get(newState.guild.id);
    const usersCount = guild.channels.cache.get(newState.channelID === null ? oldState.channelID : newState.channelID).members.size;
    const userInfo = guild.members.cache.get(newState.id).user;
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
                console.log(`  user: ${userInfo.username}#${userInfo.discriminator}`);
                console.log(`  time: ${new Date().getTime()}`);
                console.log(`  users: ${usersCount}`);
            }
            return false;
        }
        let propertyDiff = 0;

        ['serverDeaf', 'serverMute', 'selfDeaf', 'selfMute', 'selfVideo', 'streaming'].map((key) => {
            if (oldState[key] !== newState[key] && oldState[key] !== null && newState[key] !== null) {
                console.log(`⚙ Property \`${key}\` changed to ${newState[key]}`);
                propertyDiff = propertyDiff + 1;
            }
        })

        if (propertyDiff === 0) {
            console.log('🔥 Connected');
            guild.channels.cache.get(config.textChannel).send(`:raised_hands: \`${userInfo.username}\` has joined!`);
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
})

client.on('ready', () => {
    console.log('OK!');
})

client.login(process.env.VC_BOT_TOKEN);
