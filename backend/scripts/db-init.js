const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { execSync } = require('child_process');

const url = process.env.DATABASE_URL;
if (!url) {
    console.error('ERROR: DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
}

const schema = path.resolve(__dirname, '../src/db/schema.sql');
console.log(`Running schema against: ${url}`);

execSync(`psql "${url}" -f "${schema}"`, { stdio: 'inherit' });
