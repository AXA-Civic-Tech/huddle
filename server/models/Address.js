const knex = require("../db/knex");

class Address {
  constructor({ id, lat_location, long_location, address, borough }) {
    this.id = id;
    this.lat_location = lat_location;
    this.long_location = long_location;
    this.address = address;
    this.borough = borough;
  }

  static async create({ lat_location, long_location, address, borough }) {
    const query = `
      INSERT INTO address (
        lat_location, long_location, address, borough
      )
      VALUES (?, ?, ?, ?)
      RETURNING *`;

    const result = await knex.raw(query, [
      lat_location,
      long_location,
      address,
      borough,
    ]);

    return new Address(result.rows[0]);
  }

  static async list() {
    const result = await knex.raw(`SELECT * FROM address`);
    return result.rows.map((row) => new Address(row));
  }

  static async find(id) {
    const result = await knex.raw(`SELECT * FROM address WHERE id = ?`, [id]);
    return result.rows[0] ? new Address(result.rows[0]) : null;
  }

  static async delete(id) {
    return knex("address").where({ id }).del();
  }
}

module.exports = Address;
