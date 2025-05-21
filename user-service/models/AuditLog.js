const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class AuditLog {
  /**
   * Create a new audit log entry.
   * @param {string} userId - UUID of the user (can be null for anonymous actions)
   * @param {string} action - Action performed (e.g., 'LOGIN', 'PASSWORD_RESET')
   * @param {object} metadata - Optional additional data about the action
   */
  static async create(userId, action, metadata = {}) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = `
        INSERT INTO audit_logs (user_id, action, metadata)
        VALUES ($1, $2, $3)
      `;
      const values = [userId, action, metadata];

      await client.query(query, values);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error writing audit log:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all audit logs for a specific user.
   * @param {string} userId - UUID of the user
   */
  static async getLogsByUser(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get recent audit logs (for admin view)
   * @param {number} limit - Number of logs to retrieve
   */
  static async getRecentLogs(limit = 50) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching recent audit logs:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = AuditLog;
