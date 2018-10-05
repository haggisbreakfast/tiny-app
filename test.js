
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
for (var property in users) {
  console.log(property)
}

// var string1 = "";
// var object1 = {a: 1, b: 2, c: 3};

// for (var property1 in object1) {
//   string1 += object1[property1];
// }