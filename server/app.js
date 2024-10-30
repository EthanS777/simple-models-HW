// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');

// import our router.js file to handle the MVC routes
const router = require('./router.js');

// MONGODB address to connect to.
// process.env.MONGODB_URI is the variable created by Heroku from
// your Config Vars in the Heroku Dashboard > Settings > Config Vars section.
// otherwise fallback to localhost.
// The string after mongodb://localhost is the database name. It can be anything you want.
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/SimpleModelsHW';

// call mongoose's connect function and pass in the url.
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// call express to get an Express MVC server object
const app = express();

// app.use tells express to use different options
// This option tells express to use /assets in a URL path as a static mirror to our client folder
app.use('/assets', express.static(path.resolve(`${__dirname}/../client/`)));

// Call compression and tell the app to use it
app.use(compression());

// parse form POST requests as application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json body requests.
app.use(bodyParser.json());

// app.set sets one of the express config options
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');

// set the views path to the template directory
// (not shown in this example but needed for express to work)
app.set('views', `${__dirname}/../views`);

// call favicon with the favicon path and tell the app to use it
app.use(favicon(`${__dirname}/../client/img/favicon.png`));

// pass our app to our router object to map the routes
router(app);

// Tell the app to listen on the specified port
app.listen(port, (err) => {
  // if the app fails, throw the err
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
