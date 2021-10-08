const client = require('./index');

async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username 
      FROM users;
    `);
  
    return rows;
  }
  
  
  async function createUser({ username, password }) {
    try {
      const { rows } = await client.query(`
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password]);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(id) {
    try {
      const { rows: [ user ] } = await client.query(`
        SELECT *
        FROM users
        WHERE id='${ id }';
      `);
  
      return user;
    } catch (error) {
      throw error;
    }
  }
  

  async function getUserByUsername (username) {
    try {
      const { rows: [user] } = await client.query(`
        SELECT *
        FROM users
        WHERE username =$1;
      `,[username]);
      return user;
    } catch (error) {
      throw error;
    }
  }
// testing 123

  module.exports = {
      getAllUsers,
      createUser, 
      getUserById, 
      getUserByUsername
  }