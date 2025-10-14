const { PG_CONNECTION_STRING, PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

const connectionString =
  PG_CONNECTION_STRING ||
  `postgresql://${PG_USER}:${PG_PASSWORD || ''}@${PG_HOST}:${PG_PORT || 5432}/${PG_DB}`;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: PG_HOST || '127.0.0.1',
      user: PG_USER || 'postgres',
      password: PG_PASSWORD || '',
      database: PG_DB || 'huddle_dev',
    },
    migrations: { directory: './db/migrations' },
    seeds: { directory: './db/seeds' },
  },

  production: {
    client: 'pg',
    connection: connectionString,
    migrations: { directory: '/app/server/db/migrations' },
    seeds: { directory: '/app/server/db/seeds' },
  },
};
