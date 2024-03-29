import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import room from './routes/room.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Correct way to get __dirname in ES module

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // Switched to pug as Jade was renamed to Pug

// Middleware
app.use(logger('dev'));
app.use(json()); // Use the imported json function
app.use(urlencoded({ extended: false })); // Use the imported urlencoded function
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/room', room);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
