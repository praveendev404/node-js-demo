// var _ = require('lodash');
var userservice = require('../services/userservice.js');
var validatehelper = require('../helpers/validatehelper.js');
var common = require('../common.js');
var router = common.express.Router();
var app = common.express();
app.use(common.fileUpload());
// app.use(_);


var storage = common.multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, common.configFile.upload_path)
    },
    filename: function (req, file, cb) {
        cb(null, common.uuid.v1() + "_" + file.originalname);
    }
});
var upload = common.multer({ storage: storage });
// var upload=multer({dest:`${common.configFile.upload_path}`});
router.post('/api/user/getusers', function (req, res) {
    userservice.getUsers(req, function (error, result, totalrecords) {
        if (error) return next(error)
        var response = {};
        response.Result = result;
        response.TotalRecords = totalrecords;
        res.status(200).send({
            StatusCode: 200,
            Status: 'success',
            Result:response
        });
    });
});

router.get('/api/user/deleteuser/:id', function (req, res, next) {
    userservice.deleteUser(req, function (error, result) {
        if (error) return  res.status(500).send({
            StatusCode: 500,
            Status: 'error',
            Result: {
                Message: errors
            }
        });
        res.status(200).send({
            StatusCode: 200,
            Status: 'success',
            Result: {
                Message: ""
            }
        });
    })
});

router.get('/api/user/getuserById/:id', function (req, res, next) {
    // var userId=  common.currentUser.UserId;
    req.body.PageSize = 10000;
    req.body.PageNo = 0;
    userservice.getUsers(req, function (error, result, totalrecords) {
        if (error) return next(error)
        var response = {};
        var filterdData = common._.filter(result, { "UserId": parseInt(req.params.id) });
        response.Result = filterdData[0];
        response.TotalRecords = totalrecords;
        res.send(response);
    });
});

router.post('/api/user/adduser', function (req, res, next) {
    var errors = common.validate(req.body, validatehelper.user, { format: "flat" });
    if (errors && errors.length > 0) {
        res.status(400).send({
            StatusCode: 400,
            Status: 'error',
            Result: {
                Message: errors
            }
        });
    }
    else {
        var user = req.body;
        user.CreatedBy = common.currentUser.UserId;
        user.CreatedDate = new Date().toJSON();
        userservice.addUser(user, function (error, result) {
            if (error)
                return res.status(400).send({
                    StatusCode: 400,
                    Status: 'error',
                    Result: {
                        Message: error
                    }
                });
            return res.status(200).send({
                StatusCode: 200,
                Status: 'success',
                Result: {
                    Message: 'User added successfully.'
                }
            });
        })
    }

});

router.post('/user/adduser', function (req, res, next) {
    var errors = common.validate(req.body, validatehelper.user, { format: "flat" });
    // if (errors && errors.length > 0) {
    //     res.send(errors);
    // }
    // else {
    var user = req.body;
    user.CreatedBy = 1;
    user.CreatedDate = new Date().toJSON();
    userservice.addUser(user, function (error, result) {
        if (error) return next(error);
        res.status(200).send({
            StatusCode: 200,
            Status: 'success',
            Result: {
                Message: "User registered successfully."
            }
        })
        // res.send("User added successfully.");
    })
    // }

});

router.post('/api/user/profile', upload.single('avatar'), async (req, res) => {
    console.log("came");
    try {
        var files = req.file;
        // var col = "";
        //var data = col.insert(req.file);

        // db.saveDatabase();
        // res.send({ id: data.$loki, fileName: data.filename, originalName: data.originalname });
    } catch (err) {
        res.sendStatus(400);
    }
})


router.post('/api/user/upload', upload.array('images', 10), function (req, res) {

    // if (!test.hasOwnProperty('File') || test.File.trim().length == 0) {
    //    // errorHandler("File not found", null, res);
    // }
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    res.send('File uploaded!');
});

//Read image
router.get('/api/user/getimage', function (req, res) {

    res.send("http://localhost:4000/uploads/7a04da80-7f80-11e8-80f7-9b1b6314d0da_Tulips.jpg");

})

router.get('/api/user/sendmail', function (req, res) {
    common.transporter.sendMail(common.configFile.mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send("Error occured");
        } else {
            console.log('Email sent: ' + info.response);
            res.send("Mail sent successfully");
        }
    });

})



module.exports = router;