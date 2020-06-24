const Command = require('../../lib/structures/Command');
const constants = require('../../constants');

class Balup extends Command {
  constructor(client) {
    super(client, {
      name: 'balup',
      permLevel: 'User',
      description: 'Add to a user\'s balance.'
    });
  }

  async run(message, args, level) {
    const adminRole = message.guild.roles.cache.get(constants.adminRole);
    if (!message.member.roles.cache.has(adminRole.id)) {
      return message.channel.send(`You don't have permission to run this command.`);
    };

    if (!args[0] || !args[1]) {
      return message.channel.send(`You didn't provide enough arguments.`);
    };

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) {
      return message.channel.send(`Invalid user.`);
    };

    const userData = global.economy.ensure(user.user.id, global.defaultEconomyData);
    userData.user = user.user.id;
    global.economy.set(user.user.id, userData);

    if (isNaN(args[1])) {
      return message.channel.send(`Given amount is not a number.`);
    };

    const amount = parseInt(args[1]);
    userData.balance = userData.balance + amount;
    global.economy.set(user.user.id, userData);

    message.channel.send(`Successfully added coins to <@${user.user.id}>.`)
  }
}

module.exports = Balup;