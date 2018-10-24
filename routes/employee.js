var common = require('../common.js');
var router = common.express.Router();
var app = common.express();
var bodyParser = common.bodyparser;
var upload = common.multer();
var sequilize = common.sequilize;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
let connectionPool = new common.sql.ConnectionPool(common.config.development);

router.get('/api/employee/getEmployees', function (req, res, next) {
    common.sql.connect(common.config.development, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        var query = 'select * from Employee';
        var request = new common.sql.Request();
        request.query(query, function (err, respo) {
            common.sql.close();
            if (err) console.log(err);
            res.send(respo);
            //res.download('D:/Ganesh/Angular and node Practice Examples/nodejsexample/businesscard.pdf');
        })
    })
})

router.get('/api/employee/addemployee', function (req, res, next) {
    const list = [1, 2, 3, 4, 5];
    const notHello = list.where(function (a) { return a > 4 });
    let employee = { Name: "", Mobile: "", Salary: "", Email: "", Department: "" };
    res.render('employee', { employee: employee });
})

router.get('/api/employee/addemployee/:id', function (req, res, next) {
    let employee = {};
    var query = "select * from Employee where EmployeeId=" + req.params.id;
    new common.sql.ConnectionPool(common.config.development).connect().then(pool => {
        return pool.request().query(query)
    }).then(result => {
        employee = result.recordsets[0];
        common.sql.close();
        res.render('employee', { employee: employee[0] });
    }).catch(err => {
        res.status(500).send({ message: "${err}" })
        common.sql.close();
    })
})

//More than one query with transactions
router.post('/api/employee/addemployee', urlencodedParser, function (req, res, next) {
    var employee = req.body;
    employee.Salary = parseFloat(employee.Salary);

    var query = "insert into Employee (Name,Mobile,Email,Salary) values('" + employee.Name + "','" + employee.Mobile + "','" + employee.Email + "','" + employee.Salary + "') ";

    var query2 = " insert into EmployeeDepartments (EmployeeId,Department) values((select EmployeeId from Employee where Name='" + employee.Name + "' and Mobile='" + employee.Mobile + "' and Email='" + employee.Email + "' and Salary='" + employee.Salary + "'),'" + employee.Department + "') ";

    var query3 = "delete from Employee where EmployeeId=19";

    connectionPool.connect().then(function (pool) {
        const transaction = new common.sql.Transaction(pool);
        transaction.begin(err => {
            var request = new common.sql.Request(transaction);
            request.query(query + query2, function (err, respo) {
                if (err) {
                    console.log(err);
                    transaction.rollback(err => {
                        if (err) console.log("Error at transaction rollback")
                    });
                    pool.close();
                    res.send(err);
                }
                else {
                    transaction.commit();
                    res.send(respo);
                }
            })
        })
    }).catch(err => {
        res.status(500).send({ message: err })
    });
})


//Creating table from here it self and adding bulk data
router.get('/api/employee/bulkinsert', function (req, res, next) {
    const tempTable = new common.sql.Table('TempTable');
    tempTable.create = true;
    tempTable.columns.add('Id', common.sql.Int, { nullable: false, primary: true });
    tempTable.columns.add('Name', common.sql.VarChar(50), { nullable: false });
    tempTable.rows.add(1, 'Ganesh');
    tempTable.rows.add(2, 'Naresh');
    tempTable.rows.add(3, 'Harish');
    connectionPool.connect().then(function (pool) {
        var transaction = new common.sql.Transaction(pool);
        transaction.begin(err => {
            var request = new common.sql.Request(transaction);
            request.bulk(tempTable, function (err, respo) {
                if (err) {
                    console.log(err);
                    transaction.rollback();
                    pool.close();
                    res.send(err);
                }
                else {
                    transaction.commit();
                    pool.close();
                    res.send(respo);
                }
            })
        })
    }).catch(err => {
        console.log(err);
        res.send(err);
    })

})

router.get('/api/employee/getDepartmentWiseEmployees', function (req, res, next) {
    var query = "select * from Employee";
    var query2 = "select * from EmployeeDepartments";
    connectionPool.connect().then(function (pool) {
        pool.query(query, function (err, respo) {
            if (err) {
                console.log("Error at query1");
                pool.close();
                res.send("Error at query1" + err);
            }
            else {
                employee = respo.recordset;
                pool.query(query2, function (err, respo) {
                    if (err) {
                        console.log("Error at query2");
                        pool.close();
                        res.send("Error at query2" + err);
                    }
                    else {
                        employeeDepts = respo.recordset;
                        pool.close();
                        var finalData = employee.innerJoin(employeeDepts,
                            function (e) { return e.EmployeeId },
                            function (ed) { return ed.EmployeeId },
                            function (e, ed) { return { EmployeeId: e.EmployeeId, Name: e.Name, Mobile: e.Mobile, Email: e.Email, Department: ed.Department } });
                        finalData = finalData.groupBy(function (f) { f.Department })
                        res.send(finalData);
                    }
                })
            }
        })

    }).catch(err => {
        console.log(err);
        res.send(err);
    })
})

router.post('/api/employee/saveFile', upload.single('avatar'), function (req, res, next) {
    var file = req;
    var newPath = "D:/Ganesh/Angular and node Practice Examples/nodejsexample/uploads/";
    var buf = new Buffer("Testing data");
    common.fs.readFile(newPath, buf, function (err, respo) {

    })
})

router.get('/api/employee/sendmail', function (req, res, next) {
    common.transporter.sendMail(common.config.mailOptions, function (err, respo) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            console.log(respo);
            res.send(respo);
        }
    })
})

router.get('/api/employee/sequilizetest', function (req, res, next) {
    user.findAll().then(users => {
        console.log(users)
    }).catch(err => {
        console.log("Error at sequilizetest function" + err);
    })
})
module.exports = router;