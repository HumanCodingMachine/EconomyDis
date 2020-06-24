const Command = require('../../lib/structures/Command');

const Discord = require('discord.js');

class Leaderboard extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      permLevel: 'User',
      description: 'Displays the total leaderboard of top balances.'
    });
  }

  async run(message, args, level) {
    const sorted = global.economy.array().sort((a, b) => b.balance - a.balance);
    const top10 = sorted.splice(0, 10);

    const embed = new Discord.MessageEmbed()
      .setTitle("Leaderboard")
      .setDescription("Top 10 users with highest balances.")
    for(const data of top10) {
      embed.addField(this.client.users.cache.get(data.user).tag, `${data.balance} coins`);
    }
    return message.channel.send({embed});
  }
}

module.exports = Leaderboard;