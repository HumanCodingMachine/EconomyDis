const Winston = require('winston');

const createLogger = async function(client) {
  client.logger.debug('Initializing Winston logger.');
  global.logger = Winston.createLogger({
    level: 'debug',
    format: Winston.format.combine(
      Winston.format.timestamp({
        format: 'MMMM Do YYYY HH:mm:ss'
      }),
      Winston.format.printf(info =>
        `[${info.level.toUpperCase()}] ${info.timestamp}: ${info.message}`
      )),

    transports: [
      new Winston.transports.File({
        filename: 'bot.log',
        colorize: true
      })
    ]
  });
};

module.exports = createLogger;