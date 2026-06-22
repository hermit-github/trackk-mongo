import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
