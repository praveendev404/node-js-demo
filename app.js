var common = require('./common.js');
var app = common.express();
var employee = require('./routes/employee.js');
var emp2 = require('./routes/emp.js');
var port = process.env.PORT || 8000;

var db = require('./models');

var employeeDto = db.Employee;

app.get('/', function (req, res) {

    res.send("Welcome to node js application");
})

app.set('view engine', 'ejs');

// var server = app.listen(8000, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     loadashProp();

//     empDto.findOne().then(emp => {
//         console.log("Details are" + emp);
//     }).catch(err => {
//         console.log("Error at " + err);
//     })

//     console.log("node js application author name is %s %s", host, port);
// })


db.connection.sync().then(() => {
    app.listen(8000, function () {
        console.log("app started with sequelize models");
    })
}).catch(err => {
    console.log(" Error occured " + err);
})

app.use(employee);
app.use(emp2);

function pageLoadMessage() {
    console.log("Hi this is default function on page load");
}

function loadashProp() {
    console.log(common._.chunk(['1', '2', '3', '4'], 2));
}