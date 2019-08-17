var cors = require("cors");
var common = require("./common.js");
var pdf = require("html-pdf");
var fs = require("fs");
var path = require("path");
var authenticationservice = require("./services/authenticationservice.js");
var app = common.express();
app.use(cors());
app.use("/uploads", common.express.static("uploads"));
var exportPdf = require("./routes/export.js");
var user = require("./routes/user.js");
var logger = require("./helpers/loggerhelper.js");
// app.use(common.logger('dev'));
app.use(require("express-domain-middleware"));

app.use(
  common.bodyParser.json({
    limit: "10mb"
  })
);

app.use(
  common.bodyParser.urlencoded({
    limit: "10mb",
    extended: true
  })
);
process.on("uncaughtException", function(err) {
  console.log(err);
});

app.all("/api/*", function(req, res, next) {
  next();
  var token = req.headers.authorization;
  logger.info.write("-----Came to authentication-----");
  common.jwt.verify(token, common.configFile.secretKey, function(err, decoded) {
    if (err) {
      // console.log(err);
      logger.error.write(err);
      //    res.send("Authentication failed.");
      return errorHandler("Authentication Error", req, res, null);
    } else {
      common.currentUser = decoded;
      next();
    }
  });
});

app.post("/token", function(req, res) {
  try {
    authenticationservice.getUser(req.body.username, function(user) {
      if (!user) {
        return errorHandler("User not exist", req, res, null);
      }
      if (user.Password != req.body.password)
        return errorHandler("Password not matched", req, res, null);
      res.status(201).send({
        id_token: createToken(user)
      });
    });
  } catch (err) {
    logger.error.write(err);
    return errorHandler(err, req, res, null);
  }
});

function createToken(user) {
  var claims = user;
  claims.RoleId = 1;
  claims.UserTypeId = 1;
  // claims.SessionId = getGuid;
  return common.jwt.sign(
    common._.omit(claims, "password"),
    common.configFile.secretKey,
    {
      expiresIn: 60 * 60 * 5
    }
  );
}

app.use(user);
// app.use(exportPdf);
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function getGuid() {
  // then to call it, plus stitch in '4' in the third group
  return (guid = (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase());
}

function errorHandler(err, req, res, next) {
  res.status(500);
  if (err.hasOwnProperty("message")) {
    res.status(500).send({
      StatusCode: 200,
      Status: "Error",
      Result: {
        Message: err.message
      }
    });
  } else {
    res.status(500).send({
      StatusCode: 500,
      Status: "Error",
      Result: {
        Message: err
      }
    });
  }
}

app.post("/pdf", function(req, res) {
  try {
    console.log("pdf");
    var imgSrc = __dirname + "/iq.png";
    imgSrc = path.normalize(imgSrc);
    // var html = fs.readFileSync("D:/iq_report.html", "utf8");
    var options = {
      format: "Letter",
      header: {
        height: "45mm",
        contents:
          '<div style="text-align: right;">aaaaaaa<img src=' +
          imgSrc +
          ' /><img alt="App Logo" width="200" height="200" src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDJGRUMwRENDRjdFMTFFODhCOENGQTlBRkI1NUU4REUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDJGRUMwRERDRjdFMTFFODhCOENGQTlBRkI1NUU4REUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MkZFQzBEQUNGN0UxMUU4OEI4Q0ZBOUFGQjU1RThERSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0MkZFQzBEQkNGN0UxMUU4OEI4Q0ZBOUFGQjU1RThERSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvZ+OIwAABiwSURBVHja7F0LlBTl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"></div>'
      },
      footer: {
        height: "28mm",
        contents: {
          default: `<div style="float:left;width:95%"><div style="text-align:center">
           <div>INFO QUEST BACKGROUND CHECKS PVT LTD</div>
           <div>Subishi Plaza, 1-111/3/C Suite 401, Hanuman Nagar,</div>
           <div>Kondapur, Hyderabad, Telangana 500084</div> 
           <img src="file://https://login.iqbc.in/assets/images/128-x-128.png">
           </div></div>
           <div style="float:right;width:5%"><br/><br/><span style="color: #444;">{{page}}</span>/<span>{{pages}}</span></div>`
        }
      }
    };
    // pdf.create(req.body.html, options).toFile("./test.pdf", function(err, res) {
    //   if (err) return console.log(err);
    //   console.log(res); // { filename: '/app/businesscard.pdf' }
    // });
    pdf.create(req.body.html, options).toStream((err, stream) => {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=orgchart-${new Date().valueOf()}.pdf`
      );
      res.setHeader("Content-type", "application/pdf");
      stream.pipe(res);
    });
  } catch (err) {
    logger.error.write(err);
    return errorHandler(err, req, res, null);
  }
});

module.exports = app;

// var http=require('http');
// var port=process.env.port ||3000;

// http.createServer(function(req,res){
//         res.writeHead(200,{'content-type':'text/plain'});
//         res.end("Hello World");
// }).listen(port);
