const Event = require('../lib/structures/Event');
const { permlevel } = require('../util/functions');

const moment = require('moment');

const constants = require('../constants');

class Message extends Event {
  constructor(client) {
    super(client, {
      name: 'message'
    });
  }

  async run(message) {
    if (message.author.bot) return;

    let prefix = constants.prefix;
    
    const level = permlevel(this.client, message);
    message.author.permLevel = level;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = await this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;

    if (cmd.conf.disabled) {
      return;
    }

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');


    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    
    this.client.logger.command(`[${moment(message.createdAt).format('h:mm:ss')}] ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

    cmd.run(message, args, level).catch(error => {
      console.log(error);
      message.channel.send(error);
    });
  }
}

module.exports = Message;