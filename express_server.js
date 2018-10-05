const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(cookieParser());

// body parser
app.use(bodyParser.urlencoded({
  extended: true
}));

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

// ************** ROUTES ****************
app.get("/", (req, res) => {
  res.send("Hello!!");
});

// add route for /urls page
app.get("/urls", (req, res) => {
  // pass URL data to template
  let templateVars = {
    urls: urlDatabase,
    user_id: users[req.cookies["user_id"]]
  };
  // look in views folder for view
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: users[req.cookies["user_id"]]
  }
  res.render("urls_new", templateVars);
});

// add new route to urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: users[req.cookies["user_id"]],
  };
  res.render("urls_show", templateVars);
});

// redirect request
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  // redirect to long URL
  res.redirect(longURL);
});

// get registration page request
app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.cookies["user_id"]
  }
  // return registration page w/ empty form
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("ok");
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
  // grab email and password inputs from user
  let inputEmail = req.body.email;
  let inputPassword = req.body.password;
  // loop thru each property in users object
  let user;
  for (let property in users) {
    // check if email exists
    if (inputEmail === users[property].email) {
      user = users[property];
    }
  }
  if (user) {
    // check if passwords match
    if (inputPassword === user.password) {
      res.cookie("user_id", user.id);
      // redirect to /urls page after
      res.redirect("/urls")
      // if password no match, too bad
    } else {
      res.status(403).send("add msg l88888r")
      return
    }
    // if email doesnt exist, too bad
  } else {
    res.status(403).send("add msg l8r")
    return
  }

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
  let userID = generateRandomString(6);
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
  // adding userID to users object
  users[userID] = {
    id: userID,
    email: email,
    password: password
  };
  console.log(users);
  // set cookies
  res.cookie("user_id", userID);
  res.redirect("/urls")
})

// handle logout request
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
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