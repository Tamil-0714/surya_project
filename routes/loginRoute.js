import express from "express";
import bcrypt from "bcrypt";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import { fileURLToPath } from 'url';
// import path from 'path';
// import { fetchReviews } from "../fucntioons/functions.js";
import { validateAdmin } from "../database/db.js";
const loginRoute = express.Router();
// console.log(path.resolve(__dirname, '../functions/functions.js'));

loginRoute.get("/", (req, res) => {
  res.render("login", { style: undefined });
});

loginRoute.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username.trim() || !password.trim()) {
    return res.render("login", { style: "border: 2px solid red;" });
  }

  const rows = await validateAdmin(username);

  if (!rows || !rows[0]) {
    return res.render("login", { style: "border: 2px solid red;" });
  }

  bcrypt.compare(password, rows[0].password, (err, result) => {
    if (err || !result) {
      return res.render("login", { style: "border: 2px solid red;" });
    }

    req.session.user = { username, role: "admin" };
    res.redirect("/");
  });
});

export { loginRoute };
