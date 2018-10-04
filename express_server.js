let express = require("express");
let app = express();
let PORT = 8080;
let cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(cookieParser())

const bodyParser = require("body-parser");

// Generate random string function
function generateRandomString(digits) {
  //Solution from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var string = '';
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < digits; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return string;
}
console.log(generateRandomString(6));


app.use(bodyParser.urlencoded({
  extended: true
}));

let urlDatabase = {
  "BnfXle": "http://www.facebook.com",
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// redirect request
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  // redirect to long URL
  res.redirect(longURL);

});
// add new route handler for "/urls"
app.get("/urls", (req, res) => {
  // passing URL data to template
  let templateVars = {
    urls: urlDatabase
  };
  // look in views folder for view
  res.render("urls_index", templateVars);

});
// // handle delete form in urls_index.ejs
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls");
})
// handle update button
app.post("/urls/:id/update", (req, res) => {

  let shortUrl = req.params.id;
  urlDatabase[shortUrl] = req.body.newURL;
  res.redirect("/urls");
})
// handle login request
app.post("/login", (req, res) => {
  // set cookie to be called username to value submitted
  res.cookie("username", req.body.username);
  // redirect to /urls page after
  res.redirect("/urls")
});

// app.get("/login",(req,res)=>{

// });

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("ok");
});
// add new route to urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
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

// let urlDatabase = req.body.longURL;