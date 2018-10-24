var common = require('../common.js');
var app = common.express();


exports.getUser = function (username, done) {
    common.sql.connect(common.dbConfig, function (err) {
        if (err) console.log("Connection issue : " + err);
        var request = new common.sql.Request();
        request.input('username', common.sql.VarChar, username);
        request.query('select * from dbo.Users where StatusTypeId=1 and username=@username', function (err, response) {
            common.sql.close();
            if (err) {
                console.log(err);
                common.logger.error.write(err);
            }
            done(response.recordset[0]);

        })
    })
}


