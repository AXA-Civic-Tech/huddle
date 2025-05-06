const knex = require("../db/knex");

class Post {
  constructor({
    id,
    title,
    description,
    date_created,
    user_id,
    is_issue,
    address_id,
    email,
    phone,
    status,
    images,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date_created = date_created;
    this.user_id = user_id;
    this.is_issue = is_issue;
    this.address_id = address_id;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.images = images;
  }

  static async create({
    title,
    description,
    date_created = new Date(),
    user_id,
    is_issue = false,
    address_id = null,
    email = null,
    phone = null,
    status = "active",
    images = null,
  }) {
    const query = `
      INSERT INTO event (
        title, description, date_created, user_id, is_issue, address_id,
        email, phone, status, images
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *`;

    const result = await knex.raw(query, [
      title,
      description,
      date_created,
      user_id,
      is_issue,
      address_id,
      email,
      phone,
      status,
      images,
    ]);

    return new Post(result.rows[0]);
  }

  static async list() {
    const result = await knex.raw(`SELECT * FROM event`);
    return result.rows.map((row) => new Post(row));
  }

  static async find(id) {
    const result = await knex.raw(`SELECT * FROM event WHERE id = ?`, [id]);
    return result.rows[0] ? new Post(result.rows[0]) : null;
  }

  static async deleteAll() {
    return knex("event").del();
  }

  static async update(id, updates) {
    const result = await knex("event")
      .where("id", id)
      .update(updates)
      .returning("*");
    return result[0] ? new Post(result[0]) : null;
  }
}

module.exports = Post;
