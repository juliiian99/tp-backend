var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var jugadoresRouter = require('./routes/jugador');
var paisRouter = require('./routes/pais');

var app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

const errorHandler = (error, req, res, next) => {
  res.status(500).send(`Something wrong ${error.message}`)
};

app.use('/jugadores', jugadoresRouter);
app.use('/paises', paisRouter);
app.use(errorHandler);

module.exports = app;
