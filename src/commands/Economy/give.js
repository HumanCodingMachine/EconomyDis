const Command = require('../../lib/structures/Command');
const constants = require('../../constants');

class Give extends Command {
  constructor(client) {
    super(client, {
      name: 'give',
      permLevel: 'User',
      description: 'Give someone else coins.'
    });
  }

  async run(message, args, level) {
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

    const selfuserData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    selfuserData.user = message.author.id;
    global.economy.set(message.author.id, selfuserData);

    const amount = parseInt(args[1]);

    if (amount > selfuserData.balance || amount < 0) {
      return message.channel.send('Invalid amount.')
    }

    userData.balance = userData.balance + amount;
    global.economy.set(user.user.id, userData);

    selfuserData.balance = selfuserData.balance - amount;
    global.economy.set(message.author.id, selfuserData);

    message.channel.send(`Successfully gave ${amount} coins to <@${user.user.id}>.`)
  }
}

module.exports = Give;