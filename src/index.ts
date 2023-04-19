import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});
