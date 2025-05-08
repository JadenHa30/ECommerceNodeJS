'use strict';

const mongoose = require('mongoose');
const countConnect = () => {
    const numberConnect = mongoose.connections.length;
    console.log("Number of connections: ", numberConnect);
}

module.exports = {
    countConnect
};