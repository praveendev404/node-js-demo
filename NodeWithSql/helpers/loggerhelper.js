var fs = require('fs');
var common = require('../common.js');
// var morgan = require('morgan');
var logger = {};
logger.info = fs.createWriteStream(common.path.join("logs", 'info.log'), { flags: 'a' })
logger.error = fs.createWriteStream(common.path.join("logs", 'error.log'), { flags: 'a' })
logger.warning = fs.createWriteStream(common.path.join("logs", 'warning.log'), { flags: 'a' })
logger.success = fs.createWriteStream(common.path.join("logs", 'success.log'), { flags: 'a' })



module.exports = logger;

