/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema

    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('email').notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('password').notNullable();
      table.string('username').notNullable();
    })

    .createTable('address', function(table) {
      table.increments('id').primary();
      table.decimal('lat_location', 10, 7).notNullable();
      table.decimal('long_location', 10, 7).notNullable();
      table.string('address').notNullable();
      table.string('borough').notNullable();
    })

    .createTable('event', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.timestamp('date_created').defaultTo(knex.fn.now());
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('is_issue').notNullable();
      table.integer('address_id').unsigned().references('id').inTable('address').onDelete('SET NULL');
      table.string('email');
      table.string('phone');
      table.string('status');
      table.string('images'); // cloudinary setup as stretch
    })


    .createTable('comments', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('contents').notNullable();
      table.timestamp('time').defaultTo(knex.fn.now());
      table.integer('event_id').unsigned().references('id').inTable('event').onDelete('CASCADE');
    })

    .createTable('favorites', function(table) {
      table.increments('id').primary();
      table.integer('event_id').unsigned().unique().references('id').inTable('event').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('favorited_time').defaultTo(knex.fn.now());
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('favorites')
    .dropTableIfExists('comments')
    .dropTableIfExists('event')
    .dropTableIfExists('address')
    .dropTableIfExists('users');
};