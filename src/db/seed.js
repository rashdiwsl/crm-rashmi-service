const db = require('./database');
const bcrypt = require('bcryptjs');

const seed = () => {
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@example.com');
  if (existingUser) {
    console.log('Already seeded, skipping.');
    return;
  }

  const hash = bcrypt.hashSync('password123', 10);
  db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Admin User', 'admin@example.com', hash);
  db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Rashmi Silva', 'rashmi@example.com', hash);

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

  const stmt = db.prepare(`
    INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  leads.forEach(l => stmt.run(...l));

  db.prepare(`INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)`).run(1, 'Called and discussed requirements. Very interested in the enterprise plan.', 'Rashmi Silva');
  db.prepare(`INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)`).run(1, 'Sent proposal document via email. Follow up on Friday.', 'Admin User');
  db.prepare(`INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)`).run(3, 'Demo call scheduled for next Tuesday at 10am.', 'Rashmi Silva');

  console.log('Seeded successfully.');
};

seed();