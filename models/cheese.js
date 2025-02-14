const mongoose = require("mongoose");


const fruitSchema = new mongoose.Schema({
  name: String,
  isStinky: Boolean,
});
