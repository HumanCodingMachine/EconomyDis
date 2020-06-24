const Command = require('../../lib/structures/Command');

class Cash extends Command {
  constructor(client) {
    super(client, {
      name: 'cash',
      permLevel: 'User',
      description: 'Cash in your cards.'
    });
  }

  async run(message, args, level) {
    const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    userData.user = message.author.id;
    global.economy.set(message.author.id, userData);
    if (userData.cards.length === 0) {
      return message.channel.send('You have no cards to cash in right now.');
    };

    if (isNaN(args[0])) {
      return message.channel.send('Invalid index for a card or you didn\'t provide an index. Use !cards to see what number card you would like to cash in.');
    };

    const index = parseInt(args[0]) - 1;
    if (index < 0 || index >= userData.cards.length) {
      return message.channel.send(`Couldn't find card with that number.`);
    };

    const cashedCard = userData.cards[index];
    userData.cards.splice(index, 1);
    userData.balance = userData.balance + cashedCard.value;

    global.economy.set(message.author.id, userData);

    message.channel.send(`You have cashed in card number \`${index + 1}.\` which is a \`Tier ${cashedCard.tier} card\` and you have recieved \`${cashedCard.value} coin(s)\` for it.`)
  }
}

module.exports = Cash;