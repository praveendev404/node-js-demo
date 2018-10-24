
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var sql = require('mssql');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
var validate = require('validate.js');
var multer = require('multer');
var uuid = require('uuid');
var mailer = require("nodemailer");

var configFile = require("./config.json");



var common = {};
common.express = express;
common.path = path;
common.logger = logger;
common.bodyParser = bodyParser;
common.sql = sql;
common._ = _;
common.jwt = jwt;
common.dbConfig = configFile.dbConfig;
common.currentUser = {};
common.validate = validate;
common.configFile = configFile;
common.fileUpload = fileUpload;
common.uuid = uuid;
common.mailer = mailer;
common.multer = multer;

var transporter = common.mailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: configFile.mailConfig.user,
        pass: configFile.mailConfig.password
    }
});
common.transporter = transporter;
// module.exports = _;
module.exports = common;
