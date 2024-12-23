const express = require("express");
const bcrypt = require("bcrypt");
const { fetchReiviews } = require("../fucntioons/functions");
const { validateAdmin } = require("../database/db");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { style: undefined });
});

router.post("/", async (req, res) => {
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

module.exports = router;
