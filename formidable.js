const http = require("http");
const { Storage } = require("@google-cloud/storage");
const formidable = require("formidable");
const fs = require("fs");

const port = process.env.PORT || 8080;

// 配置 GCS
const storage = new Storage({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS), // 從環境變數解析 JSON
});
const bucketName = "uploadfile-storage"; // 請替換為你的 Bucket 名稱

http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        if (err) {
          res.write("Error in file upload: " + err.message);
          res.end();
          return;
        }

        var uploadedFile = files.filetoupload[0];
        var filePath = uploadedFile.filepath;
        var fileName = uploadedFile.originalFilename;

        // 上傳到 Google Cloud Storage
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream();

        // 使用文件流直接上傳
        fs.createReadStream(filePath)
          .pipe(blobStream)
          .on("finish", function () {
            res.write("File uploaded to Google Cloud Storage!");
            res.end();
          })
          .on("error", function (err) {
            res.write("Error uploading to GCS: " + err.message);
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
