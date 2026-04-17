const { v4: uuidv4 } = require('uuid');

class Prompt {
  constructor(pool) {
    this.pool = pool;
  }

  async create(title, content, complexity) {
    const id = uuidv4();
    const createdAt = new Date();
    const query = `
      INSERT INTO prompts (id, title, content, complexity, created_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [id, title, content, complexity, createdAt];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAll() {
    const query = `
      SELECT id, title, complexity, created_at
      FROM prompts
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getById(id) {
    const query = 'SELECT * FROM prompts WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async deleteById(id) {
    const query = 'DELETE FROM prompts WHERE id = $1 RETURNING id, title';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Prompt;
