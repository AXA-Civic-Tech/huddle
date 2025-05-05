const knex = require("../db/knex");

class Comment {
  constructor({ id, user_id, contents, time, event_id }) {
    this.id = id;
    this.user_id = user_id;
    this.contents = contents;
    this.time = time;
    this.event_id = event_id;
  }

  static async create({ user_id, contents, time = new Date(), event_id }) {
    const query = `
      INSERT INTO comments (
        user_id, contents, time, event_id
      )
      VALUES (?, ?, ?, ?)
      RETURNING *`;

    const result = await knex.raw(query, [
      user_id,
      contents,
      time,
      event_id,
    ]);

    return new Comment(result.rows[0]);
  }

  static async list() {
    const result = await knex.raw(`SELECT * FROM comments`);
    return result.rows.map((row) => new Comment(row));
  }

  static async find(id) {
    const result = await knex.raw(`SELECT * FROM comments WHERE id = ?`, [id]);
    return result.rows[0] ? new Comment(result.rows[0]) : null;
  }

  static async delete(id) {
    return knex("comments").where({ id }).del();
  }

  static async deleteAll() {
    return knex("comments").del();
  }
}

module.exports = Comment;

