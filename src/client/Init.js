const { loadCommand } = require('../util/functions');
const permLevels = require('../modules/Permissions');

const klaw = require('klaw');
const path = require('path');

const init = async function(client, token) {
  
  const commandList = [];
  klaw('./src/commands').on('data', item => {
    const { dir, name, ext } = path.parse(item.path);
    if (!ext || ext !== '.js') return;
    const response = loadCommand(client, dir, `${name}${ext}`);
    commandList.push(name);
    if (response) console.log(response);
  }).on('end', () => {
    client.logger.load(`Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.logger.error(error));

  const eventList = [];
  klaw('./src/events').on('data', item => {
    const { dir, name, ext } = path.parse(item.path);
    if (!ext || ext !== '.js') return;
    const eventName = name.split('.')[0];
    try {
      const event = new(require(`${dir}${path.sep}${name}${ext}`))(client);
      eventList.push(event);
      event.conf.location = dir;
      client.events.set(event.conf.name, event);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${dir}${path.sep}${name}${ext}`)];
    } catch (error) {
      client.logger.error(`Error loading event ${name}: ${error}`);
    }
  }).on('end', () => {
    client.logger.load(`Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.logger.error(error));

  // const structureList = [];
  // klaw('./src/lib/extenders').on('data', item => {
  //   const { dir, name, ext } = path.parse(item.path);
  //   if (!ext || ext !== '.js') return;
  //   try {
  //     const structure = require(`${dir}${path.sep}${name}${ext}`);
  //     structureList.push(structure);
  //   } catch (error) {
  //     client.logger.error(`Error loading structure ${name}: ${error}`);
  //   }
  // }).on('end', () => {
  //   client.logger.load(`Loaded a total of ${structureList.length} structures.`);
  // }).on('error', (error) => client.logger.error(error));

  client.levelCache = {};
  for (let i = 0; i < Array.from(permLevels).length; i++) {
    const thisLevel = Array.from(permLevels)[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(token);
};

module.exports = init;