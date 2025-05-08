'use strict';

const mongoose = require('mongoose');
const os = require('os'); // os module to get system information
const process = require('process'); // process module to get process information
const MONITORING_INTERVAL = 5000;

const countConnect = () => {
    const numberConnect = mongoose.connections.length;
    console.log("Number of connections: ", numberConnect);
}

const checkOverload = () => {
    setInterval(() => {
        const numberConnect = mongoose.connections.length;
        const numCores = os.cpus().length; // number of CPU cores
        const memoryUsage = process.memoryUsage().rss; // memory usage of the process
        //example maximum number of connections based on CPU cores in this local machine
        const maxConnections = numCores * 5; // 5 connections per core

        console.log('Active connection', numberConnect)
        console.log('Memory usage: ', memoryUsage / 1024 / 1024, 'MB');
        if (numberConnect > maxConnections) {
            console.log("Connection overload!!! ", numberConnect);
        }
    }, MONITORING_INTERVAL);
}

module.exports = {
    countConnect,
    checkOverload,
};