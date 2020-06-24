const Command = require('../../lib/structures/Command');
const constants = require('../../constants');
const Discord = require('discord.js');

class Redeem extends Command {
  constructor(client) {
    super(client, {
      name: 'redeem',
      permLevel: 'User',
      description: 'Redeem premium coins.'
    });
  }

  async run(message, args, level) {
    const premiumRole = message.guild.roles.cache.get(constants.premiumRole);
    if (!message.member.roles.cache.has(premiumRole.id)) {
      return message.channel.send(`You don't have permission to run this command.`);
    };

    if (global.premiumCooldowns.has(message.author.id)) {
      return message.channel.send(`Your redeem cooldown has not expired yet, try again later!`);
    };

    const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    userData.user = message.author.id;
    global.economy.set(message.author.id, userData);

    userData.balance = userData.balance + 50;
    global.economy.set(message.author.id, userData);

    const newCardTier = randomIntFromInterval(2, 4);
    const newCardValue = randomIntFromInterval(constants.valueData[newCardTier].min, constants.valueData[newCardTier].max);

    userData.cards.push({
      tier: newCardTier,
      value: newCardValue
    });
    global.economy.set(message.author.id, userData);

    const cardEmbed = new Discord.MessageEmbed()
      .setTitle('New Card')
      .addField(`**Tier**`, newCardTier, true)
      .addField(`**Value**`, newCardValue + ' coins', true);

    message.channel.send(`You have redeemed 50 coins and recieved a new card:`, cardEmbed);

    global.premiumCooldowns.set(message.author.id, true);
    setTimeout(function() {
      global.premiumCooldowns.delete(message.author.id);
      message.author.send('Your premium cooldown has expired.')
    }, 86400000)
  }
}

module.exports = Redeem;

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
