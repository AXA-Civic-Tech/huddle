const knex = require("../db/knex");

class Post {
  constructor({
    id,
    title,
    description,
    date_created,
    user_id,
    is_issue,
    address,
    lat_location,
    long_location,
    borough,
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
    this.address = address; 
    this.lat_location = lat_location;
    this.long_location = long_location;
    this.borough = borough;
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
    email = null,
    phone = null,
    status = "active",
    images = null,
    lat_location = null,
    long_location = null,
    address = null,
    borough = null, 
    zipcode = null
  }) {
    const query = `
      INSERT INTO event (
        title, description, date_created, user_id, is_issue, email, phone, status, images, lat_location, long_location, address, borough, zipcode
        email, phone, status, images
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *`;

    const result = await knex.raw(query, [
      title,
      description,
      date_created,
      user_id,
      is_issue,
      email,
      phone,
      status,
      images,
      lat_location,
      long_location,
      address,
      borough,
      zipcode
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
}

module.exports = Post;
