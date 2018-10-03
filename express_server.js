let express = require("express");
let app = express();
let PORT = 8080;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

let urlDatabase = {
  "bxVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// add new route handler for "/urls"
app.get("/urls", (req, res) => {
  // passing URL data to template
  let templateVars = {
    urls: urlDatabase
  };
  // look in views folder for view
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// add new route to urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    // shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});