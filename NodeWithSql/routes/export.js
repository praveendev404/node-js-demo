// // var _ = require('lodash');
// var userservice = require("../services/userservice.js");
// var validatehelper = require("../helpers/validatehelper.js");
// var common = require("../common.js");
// var router = common.express.Router();
// var pdf = require("html-pdf");
// var fs = require("fs");

// router.post("/api1/export/pdf", function(req, res) {
//   var html = fs.readFileSync("D:/iq_report.html", "utf8");
//   pdf.create(html, options).toStream((err, stream) => {
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=orgchart-${new Date().valueOf()}.pdf`
//     );
//     res.setHeader("Content-type", "application/pdf");
//     stream.pipe(res);
//   });
// });
