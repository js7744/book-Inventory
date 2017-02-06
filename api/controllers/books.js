'use strict';
const http = require('http');
const path = require('path');
const util = require('util');

const bodyParser = require('body-parser');
const express = require('express')
const pg = require('pg');
const pug = require('pug');
const request = require('request')


const app = express();
const config = {
 user: 'jatin',
 database: 'jatin',
 password: 'parmar',
 host: '127.0.0.1',
};

module.exports = {
  list: list,
  create: create,
  renderCreate: renderCreate,
  get: get,
  update: update,
  remove: remove,
  sell: sell,
  buy: buy,
  home: home,
};

// Helpers
// executeQuery(query, params, callback)
// executeQuery(query, callback)
function executeQuery(query, params, callback) {
  var client = new pg.Client(config);

  if (typeof(params) === 'function') {
    callback = params;
    params = [];
  }

  client.connect(function (error) {
    if (error) {
      return callback(error);
    }

    console.log('Executing query: ', query, params);
    client.query(query, params, callback);
  });
}


// Controller handlers
function list (req, res, next) {
  // Fetch all the books from database
  const query = 'SELECT id, bookname, authorname, isbn, year, price, quantity, publisher FROM book order by id;';
  executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    // Render a set of data
    res.render('list', {
      book: book.rows
    });
  });
}

function renderCreate (req, res, next) {
  res.render('create');
}

function home (req, res, next) {
  res.render('home');
}

function create (req, res, next) {

  // Inserting data into the database
  const query = "INSERT INTO book (bookname, authorname, isbn, year, price, quantity, publisher ) VALUES ('"+ req.body.bookname +"','"+ req.body.authorname +"',"+ req.body.isbn +","+ req.body.year +","+ req.body.price +","+ req.body.quantity +",'"+ req.body.publisher +"')";
  executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    const query = 'SELECT id, bookname, authorname, isbn, year, price, quantity, publisher FROM book;';
    executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    // Render a set of data
    res.redirect("/list");
    // res.render('list', {
    //   book: book.rows
    // });
  });
});
}

function get (req, res, next) {
  // TODO: From query
  var id = req.swagger.params.bookId.value;
  const query = "SELECT id, bookname, authorname, isbn, year, price, quantity, publisher FROM book WHERE id = "+ id +" order by id;";
  executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }
  res.render('update', {
    book: book.rows[0]
  });
 });
}
function update (req, res, next) {

  // Update data into databse
  var id = req.swagger.params.bookId.value;
  const query = "UPDATE book SET bookname = '" + req.body.bookname + "', isbn = '" + req.body.isbn + "', year = '" + req.body.year + "', price = '" + req.body.price + "', quantity = '" + req.body.quantity + "', publisher='" + req.body.publisher + "' WHERE id = '" + id + "'";
  executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    const query = 'SELECT id, bookname, authorname, isbn, year, price, quantity, publisher FROM book;';
    executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    // Render a set of data
    res.redirect("/list");
    // res.render('list', {
    //   book: book.rows
    // });
  });
});

}

function remove (req, res, next) {
  // Remove data from database

  var id = req.swagger.params.bookId.value;
  const query = "DELETE FROM book WHERE id = '" + id + "'";
  executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    const query = 'SELECT id, bookname, authorname, isbn, year, price, quantity, publisher FROM book;';
    executeQuery(query, (error, book) => {
    if (error) {
      return next(error);
    }

    // Render a set of data
    res.redirect("/list");
    // res.render('list', {
    //   book: book.rows
    // });
  });
});

var fetchid = req.swagger.params.bookId.value;
console.log(fetchid)
}

function buy (req, res, next) {
  var fetchid = req.swagger.params.bookId.value;
  var query = 'SELECT quantity FROM book;';
  executeQuery(query, (error, books) => {
    if (error) {
      return next(error);
    }
    const query = `UPDATE book SET quantity=quantity+1 WHERE id = ${fetchid}`;
    executeQuery(query, (error, updatedBooks) => {
      if (error) {
        return next(error);
      }
      res.redirect("/list");
    });
  })
}

function sell(req, res, next) {

  var fetchid = req.swagger.params.bookId.value;
  var query = 'SELECT quantity FROM book;';
  executeQuery(query, (error, books) => {
    if (error) {
      return next(error);
    }
    const query = `UPDATE book SET quantity=quantity-1 WHERE id = ${fetchid}`;
    executeQuery(query, (error, updatedBooks) => {
      if (error) {
        return next(error);
      }
      res.redirect('/list');
    });
  })
}

