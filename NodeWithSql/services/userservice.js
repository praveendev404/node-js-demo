var common = require('../common.js');
var app = common.express();

// exports.getUsers = function (req, callback) {
//     common.sql.connect(common.dbConfig, function (err) {
//         if (err) console.log(err);
//         // create Request object
//         var request = new common.sql.Request();
//         // query to the database and get the records
//         return request.query('select * from dbo.users', function (err, recordset) {
//             common.sql.close();
//             if (err) {
//                 console.log(err)
//                 return callback(new Error(err));
//             }
//             // send records as a response
//             console.log(recordset.recordset);
//             // res.send(recordset.recordset);
//             return callback(recordset.recordset);
//         });
//     });

// exports.user={
//     getUser:function(){

//     }
// }

exports.getUsers = function (req, callback) {
    common.sql.connect(common.dbConfig, function (err) {
        if (err) console.log(err);
        // create Request object
        var request = new common.sql.Request();
        request.input('PageSize', common.sql.Int, req.body.PageSize);
        request.input('PageNo', common.sql.Int, req.body.PageNo);
        request.output('TotalRecords', common.sql.Int);
      request.execute("GetUsers").then(function (recordSet) {
            console.log(recordSet);
            common.sql.close();
            return callback(null,recordSet.recordset,recordSet.output.TotalRecords);
        }).catch(function (err) {
            console.log(err);
            common.sql.close();
            return callback(new Error(err));
        });
    });
}// }

exports.deleteUser = function (req, callback) {
    common.sql.connect(common.dbConfig, function (err) {
        if (err) console.log(err);
        var request = new common.sql.Request();
        request.input('UserId', req.params.id);
      request.execute("DeleteUser").then(function (recordSet) {
            console.log(recordSet);
            common.sql.close();
            // res.send("user deleted successfully.");
            return callback(null, recordSet);
        }).catch(function (err) {
            console.log(err);
            common.sql.close();
            return callback(new Error(err));
        });
    });
}
exports.addUser = function (user, callback) {
    common.sql.connect(common.dbConfig, function (err) {
        if (err) console.log(err);
        var request = new common.sql.Request();
        mapParams(request, user);
        request.execute("AddUsers").then(function (recordSet) {
            console.log(recordSet);
            common.sql.close();
            return callback(null, recordSet);
        }).catch(function (err) {
            console.log(err);
            common.sql.close();
            return callback(new Error(err));
        });
    });
}
function mapParams(request, user) {
    request.input('UserId', user.UserId);
    request.input('Firstname', common.sql.VarChar, user.FirstName);
    request.input('LastName', common.sql.VarChar, user.LastName);
    request.input('Username', common.sql.VarChar, user.UserName);
    request.input('Email', common.sql.VarChar, user.Email);
    request.input('MobileNo', common.sql.VarChar, user.MobileNo);
    request.input('Password', common.sql.VarChar, user.Password);
    request.input('CreatedBy', common.sql.VarChar, user.CreatedBy);
    request.input('CreatedDate', common.sql.VarChar, user.CreatedDate);
}
// module.exports = userService;
