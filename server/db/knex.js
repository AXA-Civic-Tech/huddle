const configFile = require('../knexfile');

const env = process.env.NODE_ENV || 'development';

console.log('==> [DEBUG] .env', process.env);
console.log('==> [DEBUG] NODE_ENV:', process.env.NODE_ENV);
console.log('==> [DEBUG] PG_CONNECTION_STRING:', process.env.PG_CONNECTION_STRING ? '[SET]' : '[NOT SET]');
console.log('==> [DEBUG] PG_HOST:', process.env.PG_HOST);
console.log('==> [DEBUG] PG_USER:', process.env.PG_USER);
console.log('==> [DEBUG] PG_DB:', process.env.PG_DB);
console.log('==> [DEBUG] knexfile keys:', Object.keys(configFile));
console.log('==> [DEBUG] knexfile[env]:', configFile[env]);

const config = configFile[env];
if (!config) {
  throw new Error(`[DEBUG] Knex config for env "${env}" is undefined!`);
}
if (!config.client) {
  throw new Error(`[DEBUG] Knex config for env "${env}" is missing "client" property!`);
}
if (!config.connection) {
  throw new Error(`[DEBUG] Knex config for env "${env}" is missing "connection" property!`);
}

module.exports = require('knex')(config);