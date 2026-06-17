import "dotenv/config.js";
import app from "./app.js";

const port = 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});