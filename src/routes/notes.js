const router = require('express').Router();
const { pool } = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/leads/:lead_id/notes', async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Note content is required.' });

  try {
    const lead = await pool.query('SELECT id FROM leads WHERE id = $1', [req.params.lead_id]);
    if (lead.rows.length === 0) return res.status(404).json({ error: 'Lead not found.' });

    const result = await pool.query(
      'INSERT INTO notes (lead_id, content, created_by) VALUES ($1,$2,$3) RETURNING *',
      [req.params.lead_id, content, req.user.name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await pool.query('SELECT * FROM notes WHERE id = $1', [req.params.id]);
    if (note.rows.length === 0) return res.status(404).json({ error: 'Note not found.' });
    await pool.query('DELETE FROM notes WHERE id = $1', [req.params.id]);
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;