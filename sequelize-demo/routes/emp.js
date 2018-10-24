var common = require('../common.js');
var router = common.express.Router();
var db = require('../models');
var emp = db.Employee;

router.get('/api/emp/addemp', function (req, res, next) {
    var employee = {
        EmpName: 'Ganesh',
        Salary: 10000,
        Address: 'Hyderabad',
        EmployeeDepartment: [{
            Department: 'SE'
        }]
    };
    db.connection.transaction(function (t) {
        return emp.create(employee, {
            include: [db.EmployeeDepartment]
        }, { transaction: t })
    }).then((emp) => {
        console.log("Employee added" + emp);
    }).catch(err => {
        console.error("Failed to add" + err);
    })
})

router.get('/api/emp/updateemp', function (req, res, next) {
    emp.update(
        {
            Address: 'SanathNagar', EmployeeDepartment: [{
                Designation: 'HRE'
            }]
        }, {
            where: {
                EmpId: 17
            }

        }, {
            include: [db.EmployeeDepartment]
        }).then(suc => {
            console.log(suc);
        }).catch(err => {
            console.error(err);
        });
})

module.exports = router;