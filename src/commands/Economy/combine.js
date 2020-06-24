const Command = require('../../lib/structures/Command');

const constants = require('../../constants');
const Discord = require('discord.js');

class Combine extends Command {
  constructor(client) {
    super(client, {
      name: 'combine',
      permLevel: 'User',
      description: 'Combine cards into better ones.'
    });
  }

  async run(message, args, level) {
    const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    userData.user = message.author.id;
    global.economy.set(message.author.id, userData);
    if (userData.cards.length === 0) {
      return message.channel.send('You have no cards to combine right now.');
    };

    if (isNaN(args[0]) || isNaN(args[1])) {
      return message.channel.send('Invalid index for a card or you didn\'t provide an index. Use !cards to see what number card you would like to cash in.');
    };

    const indexOne = parseInt(args[0]) - 1;
    const indexTwo = parseInt(args[1]) - 1;
    if ((indexOne < 0 || indexOne >= userData.cards.length) || (indexTwo < 0 || indexTwo >= userData.cards.length)) {
      return message.channel.send(`Couldn't find card with that number.`);
    };

    const firstCard = userData.cards[indexOne];
    const secondCard = userData.cards[indexTwo];

    if (firstCard.tier !== secondCard.tier) {
      return message.channel.send('You can only combine cards that have the same tier!');
    };

    // Combined successfully
    function a () { 
      userData.cards.splice(indexOne, 1);
      userData.cards.splice(indexTwo, 1);

      const newTier = firstCard.tier + 1;
      const newValue = randomIntFromInterval(constants.valueData[newTier].min, constants.valueData[newTier].max);
      userData.cards.push({
        tier: newTier,
        value: newValue
      })
      global.economy.set(message.author.id, userData);

      const successEmbed = new Discord.MessageEmbed()
        .setTitle('New Card Combined')
        .addField('**Tier**', newTier, true)
        .addField('**Value**', newValue + ' coins', true)
        
      message.channel.send(`You have successfully combined the two cards!`, successEmbed)
    };

    // Lost Cards
    function b () { 
      userData.cards.splice(indexOne, 1);
      userData.cards.splice(indexTwo - 1, 1);
      global.economy.set(message.author.id, userData);

      const failEmbed = new Discord.MessageEmbed()
        .setTitle('Card Combining')
        .addField(`**First Card**`, `Number: ${indexOne + 1}\nTier: ${firstCard.tier} | Value: ${firstCard.value} coin(s)`, true)
        .addField(`**Second Card**`, `Number: ${indexTwo + 1}\nTier: ${secondCard.tier} | Value: ${secondCard.value} coin(s)`, true)
        .addField(`**Result**`, `Sadly you lost both cards...`);

      message.channel.send(failEmbed)
    };

    randexec(a, b, firstCard);

    function randexec(a, b, cardOne)
    {

      var probas = []
      switch (cardOne.tier) {
        case 1:
          probas = [ 90, 5 ];
          break;
        case 2:
          probas = [ 90, 6 ];
          break;
        case 3:
          probas = [ 90, 7 ];
          break;
        case 4:
          probas = [ 90, 8 ];
          break;
        case 5:
          probas = [ 90, 10 ];
          break;
      }

      var funcs = [ a, b ];

      var ar = [];
      var i,sum = 0;

      for (i=0 ; i<probas.length-1 ; i++)
      {
        sum += (probas[i] / 100.0);
        ar[i] = sum;
      }

      var r = Math.random();

      for (i=0 ; i<ar.length && r>=ar[i] ; i++) ;

      return (funcs[i])();
    }
  }
}

module.exports = Combine;

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
