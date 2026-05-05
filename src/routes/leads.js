const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', (req, res) => {
  const { status, source, assigned_to, search } = req.query;
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params = [];

  if (status)      { query += ' AND status = ?';        params.push(status); }
  if (source)      { query += ' AND lead_source = ?';   params.push(source); }
  if (assigned_to) { query += ' AND assigned_to = ?';   params.push(assigned_to); }
  if (search) {
    query += ' AND (lead_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';
  const leads = db.prepare(query).all(...params);
  res.json(leads);
});

router.get('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  const notes = db.prepare('SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...lead, notes });
});

router.post('/', (req, res) => {
  const { lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value } = req.body;
  if (!lead_name || !company_name || !email)
    return res.status(400).json({ error: 'lead_name, company_name, and email are required.' });

  const result = db.prepare(`
    INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(lead_name, company_name, email, phone || '', lead_source || '', assigned_to || '', status || 'New', deal_value || 0);

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(lead);
});

router.put('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  const { lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value } = req.body;

  db.prepare(`
    UPDATE leads SET
      lead_name = ?, company_name = ?, email = ?, phone = ?,
      lead_source = ?, assigned_to = ?, status = ?, deal_value = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    lead_name ?? lead.lead_name, company_name ?? lead.company_name,
    email ?? lead.email, phone ?? lead.phone,
    lead_source ?? lead.lead_source, assigned_to ?? lead.assigned_to,
    status ?? lead.status, deal_value ?? lead.deal_value,
    req.params.id
  );

  res.json(db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ message: 'Lead deleted successfully.' });
});

module.exports = router;