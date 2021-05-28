class Command {
    constructor(name = '', aliases = [], permission = null) {
        this.name = name;
        this.aliases = aliases;
        this.permission = permission;
    }

    bind(method = () => null) {
        this.method = method;
        return this;
    }

    match(name = '') {
        return this.name === name || this.aliases.filter((alias) => alias === name).length > 0;
    }

    exec(guild = null, channel = null, author = null) {
        if (guild === null || channel === null || author === null) return false;
        const permission = this.permission;
        const meta = { guild, channel };

        if (permission === null || (permission !== null && permission === author)) {
            this.method(meta);
        } else {
            channel.send(`you don't have permission.`);
        }
    }
}

const commands = [
    // ping
    new Command('ping')
        .bind((meta) => {
            meta.channel.send('pong!');
        }),
    // reboot
    new Command('reboot', ['restart', 'reb', 'res'], '444883622936313867')
        .bind((meta) => {
            meta.channel.send('see you next time...').then(() => {
                process.exit();
            })
        }),
];

module.exports = {
    getCommands: () => commands,
};