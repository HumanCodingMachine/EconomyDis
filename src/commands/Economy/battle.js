const Command = require('../../lib/structures/Command');
const constants = require('../../constants');

class Battle extends Command {
  constructor(client) {
    super(client, {
      name: 'battle',
      permLevel: 'User',
      description: 'Battle someone with 3 cards.'
    });
  }

  async run(message, args, level) {
    if (!args[0]) {
      return message.channel.send(`You didn't provide enough arguments.`);
    };

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) {
      return message.channel.send(`Invalid user.`);
    };

    const secondUserData = global.economy.ensure(user.user.id, global.defaultEconomyData);
    secondUserData.user = user.user.id;
    global.economy.set(user.user.id, secondUserData);

    const firstUserData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    firstUserData.user = message.author.id;
    global.economy.set(message.author.id, firstUserData);

    const firstUsersBattleCards = [];
    const secondUsersBattleCards = [];

    message.channel.send('With what cards would you like to battle? (Choose 3 and separate numbers with a space)')

    const filter = m => m.author.id === message.author.id;
    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
      .then(collected => {
        const numbers = collected.first().content.split(' ');
        if (numbers.length < 3) {
          return message.channel.send('You did not provide enough cards.');
        };

        numbers.forEach(num => {
          if (isNaN(num) || !firstUserData.cards[num - 1]) {
            return message.channel.send(`${num} is not a valid number or you don't have a card with that number.`);
          };
          firstUsersBattleCards.push(firstUserData.cards[num - 1]);
        });

        message.channel.send(`<@${message.author.id}> You have chosen your cards.`);

        message.channel.send(`<@${user.id}> What cards would you like to battle with? (Choose 3 and separate numbers with a space)`)
        
        const filter = m => m.author.id === user.user.id;
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
          .then(collected => {
            const numbers = collected.first().content.split(' ');
            if (numbers.length < 3) {
              return message.channel.send('You did not provide enough cards.');
            };

            numbers.forEach(num => {
              if (isNaN(num) || !secondUserData.cards[num - 1]) {
                return message.channel.send(`${num} is not a valid number or you don't have a card with that number.`);
              };
              secondUsersBattleCards.push(secondUserData.cards[num - 1]);
            });

            message.channel.send(`<@${message.author.id}> You have chosen your cards.`);

            message.channel.send(`Battle between <@${message.author.id}> and <@${user.id}> has started!\n${message.author.tag} is first up to roll! (Run !roll)`)

            var currentTurn = message.author.id;
            var firstHP = 3;
            var secondHP = 3;
            var firstRolledResult = 0;
            var secondRolledResult = 0;

            const filter = m => (m.content.toLowerCase() === '!roll') && (m.author.id === message.author.id || m.author.id === user.user.id);
            const collector = message.channel.createMessageCollector(filter);

            collector.on('collect', (m) => {
              if (currentTurn !== m.author.id) {
                return message.channel.send(`<@${m.author.id}> Please wait! It's not your turn right now.`);
              };

              const diceRoll = randomIntFromInterval(1, 6);
              message.channel.send(`<@${m.author.id}> has rolled ${diceRoll}!`);

              if (m.author.id === message.author.id) {
                firstRolledResult = diceRoll;
                currentTurn = user.user.id;
              } else {
                secondRolledResult = diceRoll;
                currentTurn = message.author.id;
              }

              if (firstRolledResult !== 0 && secondRolledResult !== 0) {
                if (firstRolledResult >= secondRolledResult) {
                  secondHP = secondHP - 1;
                  message.channel.send(`<@${message.author.id}> won this round and the opponent lost 1 HP!`)
                } else if (secondRolledResult >= firstRolledResult) {
                  firstHP = firstHP - 1;
                  message.channel.send(`<@${user.user.id}> won this round and the opponent lost 1 HP!`)
                }
                firstRolledResult = 0;
                secondRolledResult = 0;
              }

              if (firstHP === 0 || secondHP === 0) {
                return collector.stop();
              };

              if (m.author.id === message.author.id) {
                message.channel.send(`<@${currentTurn}> Your turn, run !roll.`)
              } else {
                message.channel.send(`<@${currentTurn}> Your turn, run !roll.`)
              }
            })

            collector.on('end', () => {
              var lostUser, winUser;
              if (firstHP === 0) {
                lostUser = message.author.id;
                winUser = user.user.id;
              } else if (secondHP === 0) {
                lostUser = user.user.id;
                winUser = message.author.id;
              }
              message.channel.send(`The battle has ended! <@${winUser}> has won the battle and <@${lostUser}> lost, winner has claimed the cards into their inventory.`)

              console.log(lostUser, winUser)

              if (lostUser === message.author.id && winUser === user.user.id) {
                firstUsersBattleCards.forEach(card => {
                  firstUserData.cards.splice(firstUserData.cards.indexOf(card), 1);
                  secondUserData.cards.push(card);
                });
                global.economy.set(message.author.id, firstUserData);
                global.economy.set(user.user.id, secondUserData);
              } else if (lostUser === user.user.id && winUser === message.author.id) {
                secondUsersBattleCards.forEach(card => {
                  secondUserData.cards.splice(secondUserData.cards.indexOf(card), 1);
                  firstUserData.cards.push(card);
                });
                global.economy.set(message.author.id, firstUserData);
                global.economy.set(user.user.id, secondUserData);
              }
            })
          })
          .catch(() => false);
      })
      .catch(() => false);
  }
}

module.exports = Battle;

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
