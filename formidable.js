// formidable模組 讓使用者將文件上傳到您的電腦

let http = require("http");
var formidable = require("formidable");
const port = process.env.PORT || 8080;
// //第一步 -- 建立表單
// http
//   .createServer(function (req, res) {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.write(
//       '<form action="fileupload" method="post" enctype="multipart/form-data">'
//     );
//     res.write('<input type="file" name="filetoupload"><br>');
//     res.write('<input type="submit">');
//     res.write("</form>");
//     return res.end();
//   })
//   .listen(8080);

// // 第二步 -- 解析上傳的文件
// http.createServer(function (req, res) {
//     if (req.url == '/fileupload') {
//       var form = new formidable.IncomingForm();
//       form.parse(req, function (err, fields, files) {
//         res.write('File uploaded');
//         res.end();
//       });
//     } else {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//       res.write('<input type="file" name="filetoupload"><br>');
//       res.write('<input type="submit">');
//       res.write('</form>');
//       return res.end();
//     }
//   }).listen(8080);

// // 第三步 -- 儲存文件
var fs = require("fs");

http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload[0].filepath;
        var newpath = "./uploads/" + files.filetoupload[0].originalFilename;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.write("File uploaded and moved!");
          res.end();
        });
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }
  })
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
