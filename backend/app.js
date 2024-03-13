const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./src/routes');
const ApiError = require('./src/api-error');
const cookieParser = require('cookie-parser');
// const { checkUser } = require('./src/middleware/auth.middleware');

const app = express();

// middleware
// app.use(morgan('dev'));
// app.use(cors());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
// app.use(express.json());

// app.get('*', checkUser);
app.use(router);

// Handle 404 response

app.use((req, res, next) => {
  return next(new ApiError(404, 'Resource not found.'));
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// define error-handling middleware last, after other app.use() and routes calls

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error.',
  });
});

module.exports = app;
