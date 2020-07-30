const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(usersPath, { encoding: 'utf8' }));

router.get('/', (req, res) => {
  const reader = fs.createReadStream(usersPath, { encoding: 'utf8' });
  reader.on('error', () => {
    res.status(500).send({ Error: 'Reading error' });
  });
  reader.on('open', () => {
    res.writeHead(200, { 'Content-type': 'application/json; charset=utf-8' });
    reader.pipe(res);
  });
});

router.get('/:id', ((req, res) => {
  const user = users.find((item) => item._id === req.params.id);
  if (!user) {
    res.status(404).send({ message: 'Нет пользователя с таким id' });
  } else {
    res.send(user);
  }
}));

module.exports = router;
