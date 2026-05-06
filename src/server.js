require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db/database');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/leads',     require('./routes/leads'));
app.use('/api',           require('./routes/notes'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => res.json({ message: 'CRM Service running.' }));

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});