'use strict';
var util = require('util');
var request = require('request')
var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
module.exports = app; // for testing

const pug = require('pug');
const path = require('path');



var config = {
 appRoot: __dirname // required config
};

// Set Jade as the default view enging
app.set('view engine', 'pug');
app.set('views', './api/views');
app.use(express.static('public'));


SwaggerExpress.create(config, function(err, swaggerExpress) {
 if (err) {
  console.log(err);
  throw err;
}

 // install middleware
 swaggerExpress.register(app);

  // app.get('/', (req, res, next) => {
  //   // Fetch all the books from database
  //   const listPage = pug.compileFile(path.join(__dirname, 'api', 'views', 'list.pug'));

  //   res.set('Content-Type', 'text/html');

  //   // Render a set of data
  //   res.send(listPage({
  //     books: []
  //   }));
  // });


  var port = process.env.PORT || 8888;
  app.listen(port);

 console.log('try this:\ncurl http://127.0.0.1:' + port);
});
