const Command = require('../../lib/structures/Command');
const Discord = require('discord.js');

class Trade extends Command {
  constructor(client) {
    super(client, {
      name: 'trade',
      permLevel: 'User',
      description: 'Trade cards with a user.'
    });
  }

  async run(message, args, level) {
    const firstUserData = global.economy.ensure(message.author.id, global.defaultEconomyData);
    firstUserData.user = message.author.id;
    global.economy.set(message.author.id, firstUserData);

    if (!args[0]) {
      return message.channel.send('You did not provide a user to trade with.')
    }

    const user = message.mentions.users.first() || this.client.users.cache.get(args[0]);
    if (!user) {
      return message.channel.send(`Invalid user.`)
    }

    var firstUsersCard, secondUsersCard;

    const filter = m => m.author.id === message.author.id;

    message.channel.send('Which card would you like to trade? (Provide the number of the card)')

    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
      .then(async collected => {
        const content = collected.first().content;
        if (isNaN(content)) {
          return message.channel.send(`Not a valid number.`)
        }

        if ((parseInt(content) < 0 || parseInt(content) >= firstUserData.cards.length)) {
          return message.channel.send(`Couldn't find card with that number.`);
        };

        firstUsersCard = firstUserData.cards[parseInt(content) - 1];

        message.channel.send(`I have sent a trade request to that user.`)

        const offerCardEmbed = new Discord.MessageEmbed()
          .setTitle('Card')
          .addField('**Tier**', firstUserData.cards[parseInt(content) - 1].tier, true)
          .addField('**Value**', firstUserData.cards[parseInt(content) - 1].value + ' coins', true)

        const confirmationMsg = await user.send(`${message.author.tag} has sent you a trade request, would you like to accept? They are offering:`, offerCardEmbed);
        await confirmationMsg.react('✅');
        await confirmationMsg.react('❌');

        const filter = (reaction, ruser) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && !ruser.bot

        confirmationMsg.awaitReactions(filter, { max: 1, errors: ['time'] })
          .then(async collected => {
            switch (collected.first()._emoji.name) {
              case '✅':
                const filter = m => m.author.id === user.id

                const userMsg = await user.send('Which card would you like to trade? (Provide the number of the card)')

                const secondUserData = global.economy.ensure(user.id, global.defaultEconomyData);
                secondUserData.user = user.id;
                global.economy.set(user.id, secondUserData);

                userMsg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                  .then(async collected => {
                    const content = collected.first().content;
                    if (isNaN(content)) {
                      return user.send(`Not a valid number.`)
                    }

                    if ((parseInt(content) < 0 || parseInt(content) >= secondUserData.cards.length)) {
                      return user.send(`Couldn't find card with that number.`);
                    };

                    secondUsersCard = secondUserData.cards[parseInt(content) - 1];

                    user.send(`You have offered your card.`)

                    const offerCardEmbed = new Discord.MessageEmbed()
                      .setTitle('Card')
                      .addField('**Tier**', secondUserData.cards[parseInt(content) - 1].tier, true)
                      .addField('**Value**', secondUserData.cards[parseInt(content) - 1].value + ' coins', true)

                    const confirmationMsg = await message.author.send(`${message.author.tag} has offered their card, would you like to complete the trade? They are offering:`, offerCardEmbed);
                    await confirmationMsg.react('✅');
                    await confirmationMsg.react('❌');

                    const filter = (reaction, ruser) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && !ruser.bot

                    confirmationMsg.awaitReactions(filter, { max: 1, errors: ['time'] })
                      .then(async collected => { 
                        switch (collected.first()._emoji.name) {
                          case '✅':
                            firstUserData.cards.push(secondUsersCard);
                            firstUserData.cards.splice(firstUserData.cards.indexOf(firstUsersCard), 1);
                            global.economy.set(message.author.id, firstUserData);
                            secondUserData.cards.push(firstUsersCard);
                            secondUserData.cards.splice(secondUserData.cards.indexOf(secondUsersCard), 1)
                            global.economy.set(user.id, secondUserData);

                            user.send('The trade has been complete!')
                            message.author.send('The trade has been complete!')
                            break;
                          case '❌':
                            message.author.send('You have not confirmed the trade.')
                            user.send(`${message.author.tag} did not confirm the trade.`)
                            break;
                        }
                      })
                      .catch(() => false);
                  })
                  .catch(() => false);
                break;
              case '❌':
                user.send('You have denied the trade request.');
                message.author.send(`${user.tag} has denied your trade request.`);
                return
                break;
            }
          })
          .catch(() => false);
      })
      .catch(() => false);
  }
}

module.exports = Trade;