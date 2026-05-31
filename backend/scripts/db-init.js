const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('ERROR: DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
const schema = fs.readFileSync(path.resolve(__dirname, '../src/db/schema.sql'), 'utf8');

pool.connect()
  .then(client => {
    console.log(`Running schema against: ${url}`);
    return client.query(schema).then(() => {
      console.log('Schema applied successfully.');
      client.release();
    });
  })
  .catch(err => {
    console.error('Schema error:', err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
