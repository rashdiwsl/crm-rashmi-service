const router = require('express').Router();
const { pool } = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const { status, source, assigned_to, search } = req.query;
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params = [];
  let i = 1;

  if (status)      { query += ` AND status = $${i++}`;        params.push(status); }
  if (source)      { query += ` AND lead_source = $${i++}`;   params.push(source); }
  if (assigned_to) { query += ` AND assigned_to = $${i++}`;   params.push(assigned_to); }
  if (search) {
    query += ` AND (lead_name ILIKE $${i} OR company_name ILIKE $${i+1} OR email ILIKE $${i+2})`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    i += 3;
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lead = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (lead.rows.length === 0) return res.status(404).json({ error: 'Lead not found.' });
    const notes = await pool.query('SELECT * FROM notes WHERE lead_id = $1 ORDER BY created_at DESC', [req.params.id]);
    res.json({ ...lead.rows[0], notes: notes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

router.post('/', async (req, res) => {
  const { lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value } = req.body;
  if (!lead_name || !company_name || !email)
    return res.status(400).json({ error: 'lead_name, company_name, and email are required.' });

  try {
    const result = await pool.query(
      `INSERT INTO leads (lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [lead_name, company_name, email, phone || '', lead_source || '', assigned_to || '', status || 'New', deal_value || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Lead not found.' });
    const lead = existing.rows[0];

    const { lead_name, company_name, email, phone, lead_source, assigned_to, status, deal_value } = req.body;

    const result = await pool.query(
      `UPDATE leads SET
        lead_name=$1, company_name=$2, email=$3, phone=$4,
        lead_source=$5, assigned_to=$6, status=$7, deal_value=$8,
        updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 RETURNING *`,
      [
        lead_name ?? lead.lead_name,
        company_name ?? lead.company_name,
        email ?? lead.email,
        phone ?? lead.phone,
        lead_source ?? lead.lead_source,
        assigned_to ?? lead.assigned_to,
        status ?? lead.status,
        deal_value ?? lead.deal_value,
        req.params.id
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Lead not found.' });
    await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id]);
    res.json({ message: 'Lead deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;