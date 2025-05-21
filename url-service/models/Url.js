const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/db');

class Url {
  static async create({ originalUrl, shortCode, userId = null, expiresAt = null }) {
    const id = uuidv4();
    console.log(`Creating URL with ID: ${id}, Original URL: ${originalUrl}, Short Code: ${shortCode}, User ID: ${userId}, Expires At: ${expiresAt}`);
    const result = await query(
      `INSERT INTO urls(id, original_url, short_code, user_id, expires_at)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [id, originalUrl, shortCode, userId, expiresAt]
    );
    return result.rows[0];
  }

  static async incrementClicks(value,shortCode) {
    await query(
      'UPDATE urls SET clicks = $1 WHERE short_code = $2',
      [value, shortCode]
    );
  }
  

  static async findByShortCode(shortCode) {
    console.log(`Finding URL with Short Code: ${shortCode}`);
    const result = await query(
      `SELECT * FROM urls
       WHERE short_code = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
      [shortCode]
    );
    console.log(`Found URL: ${JSON.stringify(result.rows[0])}`);
    return result.rows[0];
  }

  static async deleteByShortCode(shortCode) {
    await query(
      `DELETE FROM urls WHERE short_code = $1`,
      [shortCode]
    );
  }

  static async updateByShortCode(shortCode, { originalUrl, expiresAt }) {
    const result = await query(
      `UPDATE urls
       SET original_url = COALESCE($1, original_url),
           expires_at = COALESCE($2, expires_at)
       WHERE short_code = $3
       RETURNING *`,
      [originalUrl, expiresAt, shortCode]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await query(
      `SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findAll() {

     const { rows } = await query('SELECT * FROM urls ORDER BY created_at DESC');

    const formatted = rows.map(row => ({
      id: row.id,
      originalUrl: row.original_url,
      shortUrl: `${process.env.BASE_URL}/${row.short_code}`,
      clicks: row.clicks,
      createdAt: new Date(row.created_at).toLocaleString(),
      expiresAt: row.expires_at ? new Date(row.expires_at).toLocaleString() : null,
    }));
    return formatted;
  }
}

module.exports = Url;
