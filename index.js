const BaseClient = require('./src/client/BaseClient');
const init = require('./src/client/Init');
const createLogger = require('./src/client/GlobalLogger');

global.premiumCooldowns = new Map();

const Enmap = require('enmap');

const economy = new Enmap({
  name: "economy",
  autoFetch: true,
  fetchAll: true
});

global.economy = economy;
global.defaultEconomyData = {
  balance: 0,
  cards: [],
  user: null
}

const client = new BaseClient({
  fetchAllMembers: true,
  partials: ['MESSAGE', 'CHANNEL']
});

global.bot = client;

process.on('uncaughtException', (err, origin) => {
  console.log(err)
});

process.on('unhandledRejection', (err, origin) => {
  console.log(err)
});

if (process.env.NODE_ENV === 'development') {
  init(client, process.env.DEV_TOKEN).catch(e => console.log(e));
  createLogger(client);
} else {
  init(client, process.env.PROD_TOKEN).catch(e => console.log(e));
  createLogger(client);
}