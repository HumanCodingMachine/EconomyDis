const Command = require('../../lib/structures/Command');

class Balance extends Command {
  constructor(client) {
    super(client, {
      name: 'balance',
      permLevel: 'User',
      description: 'See your current balance.',
      aliases: ['bal']
    });
  }

  async run(message, args, level) {
    const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    userData.user = message.author.id;
    global.economy.set(message.author.id, userData);
    message.channel.send(`Your current balance is: ${userData.balance} coins.`);
  }
}

module.exports = Balance;