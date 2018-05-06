const Discord  = require('discord.js');
const client   = new Discord.Client();

const config   = require('./config.js');
const commands = require('./commands.js');
const prefix   = config.discord.prefix;

// Ready Event //
client.on('ready', () => {
    client.generateInvite(8).then(invite => {
        console.log(`Illusion Music Bot Ready! - Logged in as ${client.user.username} - Current prefix is: ${config.discord.prefix}\nInvite link: ${invite}\nCreated by Tetrabyte#4866 (@TheTetrabyte)`);
        client.user.setPresence({ status: `online`, activity: { name: `Illusion Music Bot v1.0` } });
    });
});

// Error Event //
client.on('error', err => { console.log(`Error, please report this on the github - ${err}`); });

// Disconnect Event //
client.on(`disconnected`, () => { console.log(`It seems we've disconnected from discord and can't reconnect, please try restarting the bot and check your credentials`); });

// Message Event //
client.on(`message`, msg => {
    // Checks for the message event //
    if (!msg.guild) return; // Ignore anything that is not a guild.
    if (msg.author == client.user) return; // Ignore self.
    if (msg.author.bot) return; // Ignore other bots.
    if (!msg.content.startsWith(prefix)) return; // Ignore anything without starting with the prefix.

    // Command handler variables //
    let lc = msg.content.toLowerCase();
    let params = msg.content.split(prefix)[1].split(/[ ]+/);
    let raw = msg.content.split(" ").splice(1).join(" ");
    let clean = msg.cleanContent.split(" ").splice(1).join(" ");
    let cmd = lc.split(prefix.toLowerCase()).slice(1).join('').split(' ')[0];

    // Check for the command and run it if exists //
    if (commands[cmd]) {
        if (!msg.channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])) return msg.channel.send(`The bot does not have permissions to send embeds, I will not be able to proceed with this command.\n\nPlease give me Embed Links permissions.`);
        console.log(`${msg.author.tag} used command ${commands[cmd].name} in ${msg.guild.name}/${msg.channel.name} - Content: ${msg.content}`);
        commands[cmd].trigger({ client, msg, params, raw, clean });
    }

    // Eval //
    if (config.discord.admins.includes(msg.author.id)) {
        if (msg.content.startsWith(prefix + 'eval')) {
            let content = msg.content.split('eval ')[1];

            try {
                let evalResp = eval(content);

                let embed = {
                    author: { name: client.user.username, icon_url: client.user.avatarURL() },
                    footer: { text: `Evaluation` },
                    timestamp: new Date(),
                    color: 127000,

                    fields: [
                        { name: '➡ Input', value: '```\n' + content + '\n```' },
                        { name: '➡ Output', value: '```\n' + evalResp + '\n```' }
                    ]
                };

                msg.channel.send({ embed: embed });
            } catch (e) {
                let embed = {
                    author: { name: client.user.username, icon_url: client.user.avatarURL() },
                    footer: { text: `Evaluation` },
                    timestamp: new Date(),
                    color: 16711680,

                    fields: [
                        { name: '➡ Input', value: '```\n' + content + '\n```' },
                        { name: '➡ Output', value: '```\n' + e + '\n```' }
                    ]
                };

                msg.channel.send({ embed: embed });
            }
        }
    }
});

// Login to the client //
client.login(config.discord.token);
