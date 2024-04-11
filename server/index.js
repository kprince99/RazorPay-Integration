
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.REACT_APP_WEBSITE_BASE_URL,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
                                         
// middlewares
app.use(bodyParser.json());

app.get('/', (req, res) => res.send({
  status: '200',
  message: 'Server is running!',
}));

app.use('/payment', require('./routes/payment'));

app.listen(port, () => console.log(`server started on port ${port}`));
