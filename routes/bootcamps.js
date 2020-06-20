const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('fetch all bootcamps');
});

router.get('/:id', (req, res) => {
  res.send('get a single bootcamp');
});

router.post('/', (req, res) => {
  res.send('create new bootcamp');
});

router.put('/:id', (req, res) => {
  res.send('update a single bootcamp');
});

router.delete('/:id', (req, res) => {
  res.send('delete a single bootcamp');
});

module.exports = router;
