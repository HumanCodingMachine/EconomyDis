const Command = require('../../lib/structures/Command');
const constants = require('../../constants');

class Place extends Command {
  constructor(client) {
    super(client, {
      name: 'place',
      permLevel: 'User',
      description: 'See your place on the leaderboard'
    });
  }

  async run(message, args, level) {
    if (args[0] === 'me') {
      const userData = global.economy.ensure(message.author.id, global.defaultEconomyData);
      userData.user = message.author.id;
      global.economy.set(message.author.id, userData);
      const sorted = global.economy.array().sort((a, b) => b.balance - a.balance);

      var index;

      sorted.forEach(i => {
        if (i.user === message.author.id) {
          index = sorted.indexOf(i);
        };
      });
      
      const finalIndex = index + 1;
      message.channel.send(`You are currently placed *#${finalIndex}*.`) 
    } else {
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);

      if (!user) {
        return message.channel.send('Invalid user.')
      }

      const userData = global.economy.ensure(user.user.id, global.defaultEconomyData);
      userData.user = user.user.id;
      global.economy.set(user.user.id, userData);
      const sorted = global.economy.array().sort((a, b) => b.balance - a.balance);

      var index;

      sorted.forEach(i => {
        if (i.user === user.user.id) {
          index = sorted.indexOf(i);
        };
      });
      
      const finalIndex = index + 1;
      message.channel.send(`They are currently placed *#${finalIndex}*.`)
    }
  }
}

module.exports = Place;