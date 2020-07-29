const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const cardsPath = path.join(__dirname, '../data/cards.json');
const cards = JSON.parse(fs.readFileSync(cardsPath, { encoding: 'utf8' }));

router.get('/', (req, res) => {
  res.send(cards);
});

module.exports = router;
