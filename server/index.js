
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000', process.env.REACT_APP_WEBSITE_BASE_URL];

app.options('*', cors());

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
                                         
// middlewares
app.use(bodyParser.json());

app.get('/', (req, res) => res.send({
  status: '200',
  message: 'Server is running!',
}));

app.use('/payment', require('./routes/payment'));

app.listen(port, () => console.log(`server started on port ${port}`));
