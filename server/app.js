const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const router = require('./routes/articles');


const app = express();
app.use(bodyParse.json());

mongoose.connect(process.env.dbURI);
mongoose.connection.once('open', ()=>{
  console.log('connected to db');
});


// routes
app.use(router);

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})