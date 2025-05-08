const knex = require("../db/knex");

class Post {
  constructor({
    id,
    title,
    description,
    date_created,
    user_id,
    is_issue,
    email,
    phone,
    status,
    images,
    address,
    borough,
    zipcode,
    lat_location,
    long_location,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date_created = date_created;
    this.user_id = user_id;
    this.is_issue = is_issue;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.images = images;
    this.address = address;
    this.borough = borough;
    this.zipcode = zipcode;
    this.lat_location = lat_location;
    this.long_location = long_location;
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
    address = null,
    borough = null,
    zipcode = null,
    lat_location = null,
    long_location = null,
  }) {
    try {
      console.log("Post.create - Processing zipcode:", zipcode);
      
      // Clean the zipcode input (remove hyphen if present)
      let cleanedZipcode = zipcode;
      if (zipcode && typeof zipcode === 'string') {
        cleanedZipcode = zipcode.split('-')[0]; // Take only the first part if hyphenated
      }
      
      console.log("Post.create - Using cleaned zipcode:", cleanedZipcode);
      
      const query = `
        INSERT INTO event (
          title, description, date_created, user_id, is_issue,
          email, phone, status, images, address, borough, zipcode,
          lat_location, long_location
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
        address,
        borough,
        cleanedZipcode,
        lat_location,
        long_location,
      ]);

      return new Post(result.rows[0]);
    } catch (error) {
      console.error("Error in Post.create:", error);
      throw error;
    }
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
    console.log('Post.update called with id:', id, 'and updates:', updates);
    try {
      // Remove fields that don't exist in the database schema
      const cleanedUpdates = { ...updates };
      if ('state' in cleanedUpdates) {
        delete cleanedUpdates.state;
      }
      
      // Handle empty strings for nullable fields
      if (cleanedUpdates.lat_location === '') cleanedUpdates.lat_location = null;
      if (cleanedUpdates.long_location === '') cleanedUpdates.long_location = null;
      
      console.log('Cleaned updates:', cleanedUpdates);
      
      const result = await knex("event")
        .where("id", id)
        .update(cleanedUpdates)
        .returning("*");
      
      console.log('Update result:', result);
      
      if (result && result.length > 0) {
        return new Post(result[0]);
      } else {
        console.log('No rows returned from update, id might not exist');
        return null;
      }
    } catch (error) {
      console.error('Error in Post.update:', error);
      throw error;
    }
  }
}

module.exports = Post;
