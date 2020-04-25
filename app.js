const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

//Module to handle POST and GET requests to external Servers
const https = require('https');

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

  //POSTing a data to the Mailchimp server via their API
  //https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/#Parameters
  //For PATCH, PUT, and POST requests, you may need to include a request body in JSON format.
  //https://mailchimp.com/developer/reference/lists/#post_/lists/-list_id-

  //Request Body Parameters in the form of JSON
  const body_data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }],
  };
  const body_data_json = JSON.stringify(body_data);

  //Request path parameter requires the List Id
  //ListID
  //9bf82f3e4a
  const url = "https://us8.api.mailchimp.com/3.0/lists/9bf82f3e4a";

  //Perform POST request to Mailchimp server using https module
  //https://nodejs.org/api/https.html#https_https_request_options_callback
  //Mailchimp API Keys
  //234d8624d2285b246cfe0b33384cde47-us8
  const options = {
    method: "POST",
    auth: "cm:234d8624d2285b246cfe0b33384cde47-us8"
  }

  //Create the request object
  const requestToMcserver = https.request(url, options, function(mcResponse) {

    if (mcResponse.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    //Check for any "data" that we are sent back from the Mailchimp Server
    // mcResponse.on("data", function(data) {
    //   console.log(JSON.parse(data));
    // });
  });

  //Write the request body to send to Mailchimp server
  requestToMcserver.write(body_data_json);

  //Signify end of request
  requestToMcserver.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});







//Set our server application to listen to port 3000
//If hosting by heroku, update it to process.env.PORT or OR it so that heroku can change it on the fly on their end
//and it can also run locally
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started and running on port 3000.");
});