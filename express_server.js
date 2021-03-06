const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require('cookie-session')
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
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

function urlsForUser(id) {
  let userUrlDatabase = {};
  for (let key in urlDatabase) {
    if (id === urlDatabase[key].userID) {
      userUrlDatabase[key] = urlDatabase[key]
    }
  }
  return userUrlDatabase;
};
// define url database with short url,long url key value pairs,userID
let urlDatabase = {
  "BnfXle": {
    longURL: "http://www.facebook.com",
    userID: "userRandomID"
  },
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "user2RandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};
// add user database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: bcrypt.hashSync("dishwasher-funk", 10)
  }
};
// ************** ROUTES ****************
app.get("/", (req, res) => {
  res.redirect("/urls");
});
// add route to /urls page
app.get("/urls", (req, res) => {
  // pass URL database to template
  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    user_id: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});
// route to urls/new page
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: users[req.session.user_id]
  }
  // if user exists and is logged in
  if (users[req.session.user_id]) {
    //render urls_new page
    res.render("urls_new", templateVars);
  } else {
    // otherwise direct to login page
    res.render("login");
  }
});
// add new route to urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user_id: users[req.session.user_id],
  };
  // if userID entered exists in database
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    // render URLs
    res.render("urls_show", templateVars);
  } else if (!req.session.user_id) {
    // otherwise prompt login
    res.send("Please login first")
  } else {
    // if URL does not belong to user send message
    res.send("This is not your URL.")
  }
});
// redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// route to registration page
app.get("/register", (req, res) => {
  let templateVars = {
    user_id: req.session.user_id
  }
  // return registration page w/ empty form
  res.render("registration", templateVars);
});
// route to login page
app.get("/login", (req, res) => {
  res.render("login");
});
// render urls/new page when create new button pressed
app.get("/urls/new", (res, req) => {
  res.render("/urls/new")
});
// handles submitted new URLs from urls/new
app.post("/urls", (req, res) => {
  //grab long URL
  let longURL = req.body.longURL;
  let shortURL = generateRandomString(6);
  // attempted terniary operator successfully to ensure each new longURL contains http://
  let validURL = longURL.match('http://') ? longURL : "http://" + longURL;
  urlDatabase[shortURL] = {
    longURL: validURL,
    userID: req.session.user_id
  }
  res.redirect("/urls");
});

// // handle delete form
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session.user_id) {
    delete urlDatabase[req.params.id]
    res.redirect("/urls");
  }
})
// handle update button
app.post("/urls/:id/update", (req, res) => {
  let shortUrl = req.params.id;
  if (urlDatabase[req.params.id].userID === req.session.user_id) {
    let longURL = req.body.newURL;
    let validURL = longURL.match('http://') ? longURL : "http://" + longURL;
    urlDatabase[shortUrl].longURL = validURL;
    res.redirect("/urls")
  } else {
    res.status(403).send("FORBIDDEN.");
  }
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
    if (bcrypt.compareSync(inputPassword, user.hashedPassword)) {
      req.session.user_id = user.id;
      // redirect to /urls page after
      res.redirect("/urls")
      // if password don't match return error
    } else {
      res.status(403).send("incorrect password!")
      return
    }
    // if email doesnt exist, return error message
  } else {
    res.status(403).send("non-existent email entered!")
    return
  }
});
// request to post data to /register
app.post("/register", (req, res) => {
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
    hashedPassword: bcrypt.hashSync(password, 10)
  };
  // set cookies
  req.session.user_id = userID
  res.redirect("/urls")
})
// handle logout request
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls")
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {});