var express = require('express');
var config = require('./config/config.json');
var sql = require('mssql');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var linq = require('linqjs');
var multer = require('multer');
var mailer = require('nodemailer');
var _ = require('lodash');
var fs = require('fs');
var sequelize = require('sequelize');
var path=require('path');

var common = {};
common.express = express;
common.config = config;
common.sql = sql;
common.ejs = ejs;
common.bodyparser = bodyparser;
common.linq = linq;
common.multer = multer;
common.mailer = mailer;
common._ = _;
common.fs = fs;
common.sequelize = sequelize;
common.path=path;

var transporter = common.mailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: config.mailConfig.user,
        pass: config.mailConfig.password
    }
})

common.transporter = transporter;

module.exports = common;