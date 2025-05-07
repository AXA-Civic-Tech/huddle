/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('event', function(table) {
    table.string('address');
    table.string('city');
    table.string('borough');
    table.string('state');
    table.string('zipcode');
    table.decimal('lat_location', 10, 7);
    table.decimal('long_location', 10, 7);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('event', function(table) {
    table.dropColumn('address');
    table.dropColumn('city');
    table.dropColumn('borough');
    table.dropColumn('state');
    table.dropColumn('zipcode');
    table.dropColumn('lat_location');
    table.dropColumn('long_location');
  });
};
