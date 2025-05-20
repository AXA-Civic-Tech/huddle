/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//chained table migrations to add constraint logic
exports.up = async function (knex) {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique();
    table.string("username").notNullable().unique();
    table.string("password_hash").notNullable();
  });

  await knex.schema.createTable("event", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.boolean("is_issue").notNullable();
    table.specificType("images", "TEXT[]"); // define array column (no check here)
    table.string("title").notNullable();
    table.decimal("lat_location", 10, 7).nullable();
    table.decimal("long_location", 10, 7).nullable();
    table.string("address").nullable();
    table.string("borough").notNullable();
    table.string("zipcode").notNullable();
    table.string("email").nullable();
    table.string("phone").nullable();
    table.boolean("status").notNullable();
    table.string("description").notNullable();
  });

  // Add the constraint after the column creation so that only 5 images can be added
  await knex.raw(`
    ALTER TABLE event
    ADD CONSTRAINT images_max_5 CHECK (array_length(images, 1) <= 5);
  `);

  await knex.schema.createTable("comments", function (table) {
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
  });

  await knex.schema.createTable("upvote", function (table) {
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
