const knex = require("../db/knex");

class Upvote {
  constructor({ id, user_id, event_id, favorited_time }) {
    this.id = id;
    this.user_id = user_id;
    this.event_id = event_id;
    this.favorited_time = favorited_time;
  }

  static async create({ user_id, event_id, favorited_time = new Date() }) {
    const query = `
      INSERT INTO upvote (
        user_id, event_id, favorited_time
      )
      VALUES (?, ?, ?)
      RETURNING *`;

    const result = await knex.raw(query, [
      user_id,
      event_id,
      favorited_time,
    ]);

    return new Upvote(result.rows[0]);
  }

  static async list() {
    const result = await knex.raw(`SELECT * FROM upvote`);
    return result.rows.map((row) => new Upvote(row));
  }

  static async find(id) {
    const result = await knex.raw(`SELECT * FROM upvote WHERE id = ?`, [id]);
    return result.rows[0] ? new Upvote(result.rows[0]) : null;
  }

  static async delete(id) {
    return knex("upvote").where({ id }).del();
  }
}

module.exports = Upvote;

