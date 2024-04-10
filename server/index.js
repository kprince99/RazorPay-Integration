
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.REACT_APP_WEBSITE_BASE_URL,
  credentials: true,
  method : ['GET', 'POST'],
}
app.use(cors(corsOptions));
                                         
// middlewares
app.use(express.json());

app.get('/', (req, res) => res.send({
  status: '200',
  message: 'Server is running!',
}));

app.get('/options', async (req, res) => {
  res.json({ 
    status: '200', 
    message: 'Testing options only (for refrence)!' });
});

app.use('/payment', require('./routes/payment'));

app.listen(port, () => console.log(`server started on port ${port}`));
