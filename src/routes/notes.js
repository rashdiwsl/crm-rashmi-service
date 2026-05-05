const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/leads/:lead_id/notes', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Note content is required.' });

  const lead = db.prepare('SELECT id FROM leads WHERE id = ?').get(req.params.lead_id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  const result = db.prepare(
    'INSERT INTO notes (lead_id, content, created_by) VALUES (?, ?, ?)'
  ).run(req.params.lead_id, content, req.user.name);

  res.status(201).json(db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/notes/:id', (req, res) => {
  const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found.' });
  db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Note deleted.' });
});

module.exports = router;