var Sequelize = require('sequelize');
const config = require('./config/config.json');


//Working for local database
const sequelize = new Sequelize(config.dbConfig2.database, config.dbConfig2.user, config.dbConfig2.password, {
    //host: config.dbConfig.server,
    dialect: 'mssql',
    operatorsAliases: false,
    dialectOptions: {
        encrypt: false,
        host: config.dbConfig2.server,
        port:50787
    }

});

// const sequelize = new Sequelize("NodeDemo", "testuser", "testUse6", {
//     port:50787,
//     host: "192.168.1.6\\DEVINST",
//     dialect: 'mssql',
//     operatorsAliases: false,
//     //instanceName:"SQLEXPRESS",
//     dialectOptions: {
//         encrypt: false,
//     },
//     define: {
//         timestamps: false
//     } 

// });

// const Article = sequelize.define("article", {
//     title: Sequelize.STRING,
//     content: Sequelize.STRING
// });

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
