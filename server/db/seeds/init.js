const User = require('../../models/User');

/**
 * @param { import("knex").Knex } 
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex('users').del();

 
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  await User.create('cool_cat', '1234', {
    email: 'coolcat@example.com',
    first_name: 'Cool',
    last_name: 'Cat'
  });

  await User.create('l33t-guy', '1234', {
    email: 'leet@example.com',
    first_name: 'Leet',
    last_name: 'Guy'
  });

  await User.create('wowow', '1234', {
    email: 'wowow@example.com',
    first_name: 'Wo',
    last_name: 'Wow'
  });
};
