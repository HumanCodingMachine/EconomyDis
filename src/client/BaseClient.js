require('dotenv').config();

const { Client, Collection } = require('discord.js');

require('../util/Prototypes');

class Deadpool extends Client {
  constructor(options) {
    super(options);
    
    this.logger = require('../modules/Logger');

    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();

    this.wait = require('util').promisify(setTimeout);
  }
}

module.exports = Deadpool;