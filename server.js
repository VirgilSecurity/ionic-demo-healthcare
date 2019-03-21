const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const { Saml20 } = require('saml');

dotenv.config();

console.log(process.env.PRIVATE_KEY);

const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/assertion', (req, res) => {
  res.send(200, { not_assertion: true });
});

app.listen(8080);