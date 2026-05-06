const router = require('express').Router();
const { pool } = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const total     = await pool.query('SELECT COUNT(*) FROM leads');
    const newLeads  = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'New'");
    const qualified = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'Qualified'");
    const won       = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'Won'");
    const lost      = await pool.query("SELECT COUNT(*) FROM leads WHERE status = 'Lost'");
    const totalVal  = await pool.query('SELECT COALESCE(SUM(deal_value),0) as total FROM leads');
    const wonVal    = await pool.query("SELECT COALESCE(SUM(deal_value),0) as total FROM leads WHERE status = 'Won'");

    res.json({
      total: parseInt(total.rows[0].count),
      newLeads: parseInt(newLeads.rows[0].count),
      qualified: parseInt(qualified.rows[0].count),
      won: parseInt(won.rows[0].count),
      lost: parseInt(lost.rows[0].count),
      totalValue: parseFloat(totalVal.rows[0].total),
      wonValue: parseFloat(wonVal.rows[0].total),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;