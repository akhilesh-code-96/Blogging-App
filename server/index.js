import express from "express";
import router from "./routers/api.js";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blogging-app-frontend-chi.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

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
  mongoose.connect(process.env.MONGO_URL);
  console.log(`running at http://localhost/${PORT}`);
});
