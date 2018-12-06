require('dotenv').config()
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('./util/cors')
const bodyParser = require('body-parser')

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');

const app = express();

const PORT = process.env.PORT || 3000
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-mkoaq.mongodb.net/wishared`


app.use(bodyParser.json()); // application/json
// I'm going to use multer-s3 to upload images in this project!

app.use(cors);

app.use('/home', homeRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
