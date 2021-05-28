class Command {
    constructor(name = '', aliases = []) {
        this.name = name;
        this.aliases = aliases;
    }

    bind(method = () => null) {
        this.method = method;
        return this;
    }

    match(name = '') {
        return this.name === name || this.aliases.filter((alias) => alias === name).length > 0;
    }

    run(guild = null, channel = null) {
        if (guild === null || channel === null) return false;
        const meta = { guild, channel };
        this.method(meta);
    }
}

const commands = [
    // ping
    new Command('ping')
        .bind((meta) => {
            meta.guild.channels.cache.get(meta.channel.id).send('pong!');
        }),
    // random
    new Command('random', ['rnd'])
        .bind((meta) => {
            const result = Math.random();
            meta.guild.channels.cache.get(meta.channel.id).send(result);
        }),
    // reboot
    new Command('reboot', ['restart', 'reb', 'res'])
        .bind((_) => {
            process.exit();
        }),
];

module.exports = {
    getCommands: () => commands,
};