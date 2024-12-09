import express from "express";
import router from "./routers/api.js";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = 3000;
const app = express();

// application-level middleware.
app.use(express.static("public"));
app.use(
  session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  })
);
app.use(express.json());

// api middleware.
app.use("/api", router);

app.listen(PORT, () => {
  mongoose.connect(process.env.MONGO_URI);
  console.log(`running at http://localhost/${PORT}`);
});
