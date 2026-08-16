const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const shelterRoutes = require('./routes/shelterRoutes');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/shelters', shelterRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
