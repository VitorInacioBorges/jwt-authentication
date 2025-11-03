// configures dotenv, try to connect to mongodb database and initiates the server on port desired

import dotenv from "dotenv";
import app from "./app.js";
import connect from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/users_api"
    );
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error trying to connect to the database", error);
    process.exit(1);
  }
})();
