const { pool, initDB } = require('./database');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await initDB();

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
  if (existing.rows.length > 0) {
    console.log('Already seeded, skipping.');
    await pool.end();
    return;
  }

  const hash = bcrypt.hashSync('password123', 10);
  await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', ['Admin User', 'admin@example.com', hash]);
  await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', ['Rashmi Silva', 'rashmi@example.com', hash]);

  const leads = [
    ['John Perera', 'TechCorp LK', 'john@techcorp.lk', '+94771234567', 'LinkedIn', 'Rashmi Silva', 'Qualified', 150000],
    ['Amara Fernando', 'StartupHub', 'amara@startuphub.lk', '+94712345678', 'Referral', 'Admin User', 'New', 80000],
    ['Kasun Jayawardena', 'CloudSystems', 'kasun@cloudsys.lk', '+94723456789', 'Website', 'Rashmi Silva', 'Contacted', 220000],
    ['Nimasha Bandara', 'RetailMax', 'nimasha@retailmax.lk', '+94734567890', 'Cold Email', 'Admin User', 'Proposal Sent', 95000],
    ['Dilshan Wijesinghe', 'FinTech LK', 'dilshan@fintechlk.com', '+94745678901', 'Event', 'Rashmi Silva', 'Won', 340000],
    ['Sachini Gunarathne', 'EduSoft', 'sachini@edusoft.lk', '+94756789012', 'LinkedIn', 'Admin User', 'Lost', 60000],
    ['Roshan Mendis', 'AgriTech SL', 'roshan@agritech.lk', '+94767890123', 'Website', 'Rashmi Silva', 'New', 175000],
    ['Dinusha Rathnayake', 'MediCare LK', 'dinusha@medicare.lk', '+94778901234', 'Referral', 'Admin User', 'Contacted', 290000],
  ];

  for (const l of leads) {
    await pool.query(
      'INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      l
    );
  }

  const lead1 = await pool.query('SELECT id FROM leads WHERE email = $1', ['john@techcorp.lk']);
  const lead3 = await pool.query('SELECT id FROM leads WHERE email = $1', ['kasun@cloudsys.lk']);

  await pool.query('INSERT INTO notes (lead_id, content, created_by) VALUES ($1,$2,$3)', [lead1.rows[0].id, 'Called and discussed requirements. Very interested in the enterprise plan.', 'Rashmi Silva']);
  await pool.query('INSERT INTO notes (lead_id, content, created_by) VALUES ($1,$2,$3)', [lead1.rows[0].id, 'Sent proposal document via email. Follow up on Friday.', 'Admin User']);
  await pool.query('INSERT INTO notes (lead_id, content, created_by) VALUES ($1,$2,$3)', [lead3.rows[0].id, 'Demo call scheduled for next Tuesday at 10am.', 'Rashmi Silva']);

  console.log('Seeded successfully.');
  await pool.end();
};

seed();