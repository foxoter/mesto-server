const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '../data/cards.json');

router.get('/', (req, res) => {
  const reader = fs.createReadStream(cardsPath, { encoding: 'utf8' });
  reader.on('error', () => {
    res.status(500).send({ Error: 'Reading error' });
  });
  reader.on('open', () => {
    res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
    reader.pipe(res);
  });
});

module.exports = router;
