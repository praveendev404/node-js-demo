var common = require('../common.js');
var fs = common.fs;
var basename = common.path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var sequelize = require('sequelize');
common.config = common.config[env];

var db = {};

if (common.config.use_env_variable) {
    var connection = new sequelize(process.env[common.config.use_env_variable], common.config)
} else {
    var connection = new sequelize(common.config.database, common.config.user, common.config.password, common.config);
}


fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    var model = connection['import'](common.path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
})

db.connection = connection;
db.sequelize = sequelize;

module.exports = db;
