import express, { Request, Response } from 'express';
const router = express.Router();

//index
router.get('/', (req: Request, res: Response) => {
  res.redirect('/api');
});

module.exports = router;
