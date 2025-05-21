const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class User {
  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO users (id, name, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, created_at`,
        [id, name, email, hashedPassword]
      );

      const user = rows[0];

      // Assign default role 'user'
      await client.query(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT $1, id FROM roles WHERE name = 'user'`,
        [id]
      );

      await client.query('COMMIT');
      return user;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT u.*, array_agg(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email]
    );
    return rows[0];
  }

  static async markEmailVerified(userId) {
    await pool.query(
      'UPDATE users SET email_verified = TRUE WHERE id = $1',
      [userId]
    );
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );
  }

  static async getRoles(userId) {
    const { rows } = await pool.query(
      `SELECT r.name FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return rows.map(row => row.name);
  }

  static async updateRoles(userId, roleNames) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

      const { rows: roleRows } = await client.query(
        `SELECT id FROM roles WHERE name = ANY($1::text[])`,
        [roleNames]
      );

      const insertPromises = roleRows.map(role =>
        client.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
          [userId, role.id]
        )
      );

      await Promise.all(insertPromises);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = User;
