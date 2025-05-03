const knex = require('../db/knex');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

class User {
  #passwordHash = null;

  constructor({ id, username, password_hash, email, first_name, last_name }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.#passwordHash = password_hash;
  }
  

  isValidPassword = async (password) => {
    return await bcrypt.compare(password, this.#passwordHash);
  }

  static async create(username, password, { email = null, first_name = null, last_name = null } = {}) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  
    const query = `
      INSERT INTO users (username, password_hash, email, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *`;
    const result = await knex.raw(query, [username, passwordHash, email, first_name, last_name]);
  
    const rawUserData = result.rows[0];
    return new User(rawUserData);
  }  

  static async list() {
    const query = `SELECT * FROM users`;
    const result = await knex.raw(query);
    return result.rows.map((rawUserData) => new User(rawUserData));
  }


  static async find(id) {
    const query = `SELECT * FROM users WHERE id = ?`;
    const result = await knex.raw(query, [id]);
    const rawUserData = result.rows[0];
    return rawUserData ? new User(rawUserData) : null;
  }


  // Same as above but uses the username to find the user
  static async findByUsername(username) {
    console.log('findByUsername called with username:', username);
    try {
      // Using explicit table and column names
      const user = await knex('users')
        .select('*')
        .where('username', '=', username)
        .first();
      
        console.log('Connected to database:', knex.client.config.connection);

      console.log('Knex query result:', user);
      if (!user) {
        console.log('No user found with username:', username);
        // Let's also check what users exist
        const allUsers = await knex('users').select('username');
        console.log('All existing usernames:', allUsers.map(u => u.username));
      }
      const dbName = await knex.raw('SELECT current_database()');
      console.log('Connected to database:', dbName.rows[0].current_database);
      return user ? new User(user) : null;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      return null;
    }
  }

  // Updates the user that matches the given id with a new username.
  // Returns the modified user, using the constructor to hide the passwordHash. 
  static async update(id, username) {
    const query = `
      UPDATE users
      SET username=?
      WHERE id=?
      RETURNING *
    `
    const result = await knex.raw(query, [username, id])
    const rawUpdatedUser = result.rows[0];
    return rawUpdatedUser ? new User(rawUpdatedUser) : null;
  };

  static async deleteAll() {
    return knex('users').del()
  }
}

module.exports = User;
