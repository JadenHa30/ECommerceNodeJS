'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb://localhost:27017/ecommerce';
const { countConnect } = require('../helpers/check.connect');

class Database { //Singleton class to ensure only one instance of the database connection is created
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    mongoose.connect(connectString, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB connected', countConnect());
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;