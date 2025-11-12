import { app } from "./app";
import { env } from "./config/env";

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`HTTP server running on port ${port}`);
});