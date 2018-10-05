let express = require("express");
let app = express();
let PORT = 8080;
let cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser());

const bodyParser = require("body-parser");


// Generate random string function
function generateRandomString(digits) {
  //Solution from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var string = '';
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < digits; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  return string;
};
console.log(generateRandomString(6));
// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// define url database with short url/long url key value pairs
let urlDatabase = {
  "BnfXle": "http://www.facebook.com",
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// add user database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
// get registration page request
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  // return registration page w/ empty form
  res.render("registration", templateVars);
});

// request to post data to /register
app.post("/register", (req, res) => {
  // req.body={email:____, password: ____}
  // let shortUrl = req.params.id;
  // urlDatabase[shortUrl] = req.body.newURL;
  // console.log(req.params.body); = UNDEFINED
  // console.log(req.body.email); = EMAIL
  let email = req.body.email;
  let password = req.body.password;
  let randomId = generateRandomString(6);
  // conditional statement for handling registration errors
  for (let property in users) {
    if (email === users[property].email) {
      res.status(400).send("Email already assigned to a User ID.");
      return
    }
  }
  if (!email || !password) {
    res.status(400).send("Please enter email and password")
    return
  }
  // adding randomId to users object
  users[randomId] = {
    id: randomId,
    email: email,
    password: password
  };
  console.log(users);

  // set cookies
  res.cookie("user_id", randomId);
  res.redirect("/urls")
})

// // redirect request
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  // redirect to long URL
  res.redirect(longURL);

});
// add route for /urls page
app.get("/urls", (req, res) => {
  // pass URL data to template
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
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
// handle logout request
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls")
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
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
  res.send("Hello!!");
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