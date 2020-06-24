const path = require('path');

const permLevels = require('../modules/Permissions');

module.exports.permlevel = function(client, message) {
  let permlvl = 0;

  const permOrder = Array.from(permLevels).slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
};

module.exports.loadCommand = function(client, commandPath, commandName) {
  try {
    const props = new(require(`${commandPath}${path.sep}${commandName}`))(client);
    props.conf.location = commandPath;
    if (props.init) {
      props.init(client);
    }
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
    return false;
  } catch (e) {
    return client.logger.error(`Unable to load command ${commandName}: ${e}`);
  }
};

module.exports.unloadCommand = async function(client, commandPath, commandName) {
  let command;
  if (client.commands.has(commandName)) {
    command = client.commands.get(commandName);
  } else if (client.aliases.has(commandName)) {
    command = client.commands.get(client.aliases.get(commandName));
  }
  if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

  if (command.shutdown) {
    await command.shutdown(client);
  }
  delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
  return false;
};

module.exports.reloadEvent = function(client, eventPath, eventName) {
  delete require.cache[require.resolve(`${eventPath}${path.sep}${eventName}.js`)];
  const event = new(require(`${eventPath}${path.sep}${eventName}.js`))(client);
  client.on(eventName, (...args) => event.run(...args));
  delete require.cache[require.resolve(`${eventPath}${path.sep}${eventName}.js`)];
};

module.exports.reloadModule = function(modulePath, moduleName) {
  delete require.cache[require.resolve(`${process.cwd()}${path.sep}${modulePath}${path.sep}${moduleName}.js`)];
  require(`${process.cwd()}${path.sep}${modulePath}${path.sep}${moduleName}.js`);
};