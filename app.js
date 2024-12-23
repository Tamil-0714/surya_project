const express = require("express");
const session = require("express-session");
const reviewRoute = require("./routes/reviewRoute");
const loginRoute = require("./routes/loginRoute");
const { isLogin, isAlreadyLogin } = require("./middleware/middleware");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(
  session({
    secret: "irunga baai",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", isLogin, (req, res) => {
  const data = {
    title: "AI powered Review analyser",
  };
  res.render("index", data);
});

app.use("/login", isAlreadyLogin, loginRoute);

app.use("/review", isLogin, reviewRoute);

app.get("/about", (req, res) => {
  const data = {
    title: "About Page",
    description: "This is a simple Express app demonstrating EJS templating.",
  };
  res.render("about", data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
