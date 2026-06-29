import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import addressRouter from "./routes/address.routes.js";

import cors from "cors";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";

// Deploye section
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173","https://snitch-project-zuqv.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))


app.use(passport.initialize());
passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://snitch-project-zuqv.onrender.com/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));


/*app.get("/", (req, res) => {
  res.status(200).json({
      message: "Server is running"
  })
});*/


app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);



app.use(express.static("./public"));

app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "./public/index.html"));
})

    

export default app