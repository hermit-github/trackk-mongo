import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "3000",
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  tokenSecret:process.env.JWT_SECRET || "thisisasecret"
};