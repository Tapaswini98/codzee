import { app } from './app.js';
import { PORT } from './config.js';

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
