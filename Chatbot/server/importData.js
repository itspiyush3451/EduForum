const fs = require('fs');
const pool = require('./db');

const data = JSON.parse(fs.readFileSync('./collegeData.json', 'utf8'));

async function importData() {
  try {
    // Insert Admissions
    for (const entry of data.admissions) {
      await pool.query(
        'INSERT INTO admissions (program, criteria, process) VALUES ($1, $2, $3)',
        [entry.program, entry.criteria, entry.process]
      );
    }

    // Insert Fees
    for (const entry of data.fees) {
      await pool.query(
        'INSERT INTO fees (program, annual_fee, additional_fees) VALUES ($1, $2, $3)',
        [entry.program, entry.annual_fee, entry.additional_fees]
      );
    }

    console.log('✅ Data imported successfully!');
  } catch (err) {
    console.error('❌ Error importing data:', err);
  } finally {
    pool.end();
  }
}

importData();
