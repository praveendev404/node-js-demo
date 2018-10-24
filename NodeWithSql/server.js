
var cors = require('cors');
var common = require('./common.js');
var authenticationservice = require('./services/authenticationservice.js');
var app = common.express();
app.use(cors());
app.use('/uploads', common.express.static('uploads'));
var user = require('./routes/user.js');
var logger = require('./helpers/loggerhelper.js');
// app.use(common.logger('dev'));
app.use(require('express-domain-middleware'));

app.use(common.bodyParser.json({
    limit: '10mb'
}));




app.use(common.bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}))
process.on('uncaughtException', function (err) {
    console.log(err);
});

app.all('/api/*', function (req, res, next) {
    next();
    // var token = req.headers.authorization;
    // logger.info.write("-----Came to authentication-----");
    // common.jwt.verify(token,common.configFile.secretKey, function (err, decoded) {
    //     if (err) {
    //         // console.log(err);
    //         logger.error.write(err);
    //     //    res.send("Authentication failed.");
    //         return errorHandler("Authentication Error", req, res, null);
    //     }
    //     else {
    //         common.currentUser = decoded;
    //         next();
    //     }
    // });
});

app.post('/token', function (req, res) {
    try {
        authenticationservice.getUser(req.body.username, function (user) {
            if (!user) {
                return errorHandler("User not exist", req, res, null);
            }
            if (user.Password != req.body.password)
                return errorHandler("Password not matched", req, res, null);
            res.status(201).send({
                id_token: createToken(user)
            });
        })
    }
    catch (err) {
        logger.error.write(err);
        return errorHandler(err, req, res, null)
    }
});

function createToken(user) {
    var claims = user;
    claims.RoleId = 1;
    claims.UserTypeId = 1;
    // claims.SessionId = getGuid;
    return common.jwt.sign(common._.omit(claims, 'password'), common.configFile.secretKey, {
        expiresIn: 60 * 60 * 5
    });
}

app.use(user);
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}


function getGuid() {
    // then to call it, plus stitch in '4' in the third group
    return guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}


function errorHandler(err, req, res, next) {
    res.status(500);
    if (err.hasOwnProperty('message')) {
        res.status(500).send({
            StatusCode: 200,
            Status: 'Error',
            Result: {
                Message: err.message
            }
        })
    }
    else {
        res.status(500).send({
            StatusCode: 500,
            Status: 'Error',
            Result: {
                Message: err
            }
        })
    }
}

module.exports = app;



// var http=require('http');
// var port=process.env.port ||3000;

// http.createServer(function(req,res){
//         res.writeHead(200,{'content-type':'text/plain'});
//         res.end("Hello World");
// }).listen(port);