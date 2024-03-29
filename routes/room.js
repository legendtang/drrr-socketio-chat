import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('room', { title: 'Dollars' }); // Corrected typo from 'Dollas' to 'Dollars'
});

export default router;
