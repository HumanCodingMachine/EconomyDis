const Command = require('../../lib/structures/Command');
const Discord = require('discord.js');

class Cards extends Command {
  constructor(client) {
    super(client, {
      name: 'cards',
      permLevel: 'User',
      description: 'See your current cards.'
    });
  }

  async run(message, args, level) {
    const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    userData.user = message.author.id;
    global.economy.set(message.author.id, userData);
    if (userData.cards.length === 0) {
      const generationMsg = await message.channel.send(`Generating cards for you...`);
      for (var i = 0; i < 5; i++) {
        userData.cards.push({
          tier: 1,
          value: randomIntFromInterval(1, 10)
        });
      };
      global.economy.set(message.author.id, userData);
      generationMsg.edit('Done!');

      const mapped = userData.cards.map(card => `${userData.cards.indexOf(card) + 1}. Tier ${card.tier} Card | Value: ${card.value} coins`)
      const cardsEmbed = new Discord.MessageEmbed()
        .setDescription(`**Your current cards are:**\n\n${mapped.join('\n')}`);

      message.channel.send(cardsEmbed);
    } else {
      const mapped = userData.cards.map(card => `${userData.cards.indexOf(card) + 1}. Tier ${card.tier} Card | Value: ${card.value} coins`)
      const cardsEmbed = new Discord.MessageEmbed()
        .setDescription(`**Your current cards are:**\n\n${mapped.join('\n')}`);

      message.channel.send(cardsEmbed);
    }
  }
}

module.exports = Cards;

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
