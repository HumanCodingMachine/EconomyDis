const Command = require('../../lib/structures/Command');

const constants = require('../../constants');
const Discord = require('discord.js');

class Help extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Help Menu')
      .setThumbnail(this.client.user.avatarURL())
      .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL())
      .setDescription(`\`${constants.prefix}balance\` - Shows your current balance.\n\`${constants.prefix}balup @User\` - Adds coins to someone's balance (Admin only)\n\`${constants.prefix}cards\` - Shows the cards you currently have.\n\`${constants.prefix}cash <card>\` - Converts a selected card into coins.\n\`${constants.prefix}combine <card 1> <card 2>\` - Combines two cards together to make a better one.\n\`${constants.prefix}give @User\` - Give somebody coins from your own balance.\n\`${constants.prefix}leaderboard\` - Shows the Top 10 highest balance users in the server.\n\`${constants.prefix}place me/${constants.prefix}place @User\` - Shows where the user is placed on the leaderboard.\n\`${constants.prefix}redeem\` - Redeem 50 coins and a card every day (Premium only)\n\`${constants.prefix}trade @User\` - Trade cards with a user.\n\`${constants.prefix}battle @User\` - Battles a user with cards.`)
    
    message.channel.send(helpEmbed);
  }
}

module.exports = Help;