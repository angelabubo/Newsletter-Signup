const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//Create and initialize an Node Express app
const app = express();

//To serve static files (like css images) to client
//use express.static middleware function in express
//to define the root folder that contains the files to serve
app.use(express.static("public")); //public contains css and img folder

//Use the body parser for our server msapplication
app.use(bodyParser.urlencoded({
  extended: true
}));

//Get and Post - ROOT ROUTE
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;
  console.log(email);
});









//Set our server application to listen to port 3000
app.listen(3000, function() {
  console.log("Server started and running on port 3000.");
});