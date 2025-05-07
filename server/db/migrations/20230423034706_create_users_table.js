/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema

    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique();
      table.string("username").notNullable().unique();
      table.string("password_hash").notNullable();
    })

    .createTable("event", function (table) {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamp("date_created").defaultTo(knex.fn.now());
      table.boolean("is_issue").notNullable();
      table.string("images"); // cloudinary setup as stretch
      table.string("title").notNullable();
      table.decimal("lat_location", 10, 7).nullable();
      table.decimal("long_location", 10, 7).nullable();
      table.string("address").nullable();
      table.string("borough").notNullable();
      table.string("zipcode").notNullable();
      table.string("email").nullable();
      table.string("phone").nullable();
      table.string("status").notNullable();
      table.string("description").notNullable();
    })

    .createTable("comments", function (table) {
      table.increments("id").primary();
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("event")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("contents").notNullable();
      table.timestamp("time").defaultTo(knex.fn.now());
    })

    .createTable("upvote", function (table) {
      table.increments("id").primary();
      table
        .integer("event_id")
        .unsigned()
        .references("id")
        .inTable("event")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.timestamp("favorited_time").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("upvote")
    .dropTableIfExists("comments")
    .dropTableIfExists("event")
    .dropTableIfExists("users");
};
