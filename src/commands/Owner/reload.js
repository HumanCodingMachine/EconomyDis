const Command = require('../../lib/structures/Command');
const { loadCommand, unloadCommand, reloadEvent } = require('../../util/functions');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    if (!args || args.size < 1) return message.respond('You must supply a command or an event to reload.');
    const module = args.join(' ');
    const command = this.client.commands.get(module) || this.client.commands.get(this.client.aliases.get(module));
    if (command) {
      let response = await unloadCommand(this.client, command.conf.location, command.help.name);
      if (response) return message.reply(`Error Unloading: ${response}`);

      response = loadCommand(this.client, command.conf.location, command.help.name);
      if (response) return message.reply(`Error loading: ${response}`);
      return message.reply(`The module \`${command.help.name}\` was reloaded.`);
    }

    if (!command) {
      const event = this.client.events.get(module);
      if (!event) {
        return message.respond(`The module \`${module}\` is neither a command, a command alias, or an event. Please check your spelling and try again.`);
      }
      const response = await reloadEvent(this.client, event.conf.location, event.conf.name);
      if (response) return message.reply(`Error Unloading: ${response}`);
      
      return message.reply(`The event \`${event.conf.name}\` was reloaded.`, 'checkmark');
    }
  }
}

module.exports = Reload;