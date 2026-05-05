const router = require('express').Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', (req, res) => {
  const total       = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const newLeads    = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'New'").get().count;
  const qualified   = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Qualified'").get().count;
  const won         = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Won'").get().count;
  const lost        = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Lost'").get().count;
  const totalValue  = db.prepare('SELECT COALESCE(SUM(deal_value), 0) as total FROM leads').get().total;
  const wonValue    = db.prepare("SELECT COALESCE(SUM(deal_value), 0) as total FROM leads WHERE status = 'Won'").get().total;

  res.json({ total, newLeads, qualified, won, lost, totalValue, wonValue });
});

module.exports = router;