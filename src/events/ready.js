const Event = require('../lib/structures/Event');
const { version } = require('../../package.json');

// const { execSync } = require('child_process');
// const { MessageEmbed } = require('discord.js');

class Ready extends Event {
  constructor(client) {
    super(client, {
      name: 'ready'
    });
  }
  
  async run() {
    // const revision = execSync('git rev-parse --short HEAD').toString().split('\n')[0];
    
    // const embed = new MessageEmbed()
    //   .setTitle('Connected to Gateway')
    //   .setAuthor('Discord Logger', 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png')
    //   .setDescription(`Connected\nSession ID ${this.client.ws.shards.first().sessionID}\nRevision ${revision}\nVersion ${version}`)
    //   .setFooter('Partyblob Logger')
    //   .setTimestamp();

    // await this.client.channels.fetch('574784425624076293').then(c => {
    //   c.send({ embed })
    // })

    this.client.logger.login(`Version ${version} | Logged in as ${this.client.user.username}`);
  }
}

module.exports = Ready;