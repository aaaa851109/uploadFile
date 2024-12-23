let http = require("http");
const formidable = require("formidable");
const { Storage } = require("@google-cloud/storage");
const port = process.env.PORT || 8080;

// 配置 Google Cloud Storage (GCS)
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // 環境變數中提供 JSON 憑證內容
});
const bucketName = "uploadfile-storage"; // 替換為你的 Bucket 名稱

http
  .createServer(function (req, res) {
    if (req.url == "/fileupload" && req.method.toLowerCase() === "post") {
      const form = new formidable.IncomingForm();

      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error parsing the file upload.");
          console.error("Error parsing form:", err);
          return;
        }

        // 獲取上傳文件的信息
        const uploadedFile = files.filetoupload[0];
        const oldpath = uploadedFile.filepath;
        const filename = uploadedFile.originalFilename;

        try {
          // 上傳到 GCS
          await storage.bucket(bucketName).upload(oldpath, {
            destination: filename, // GCS 中的目標文件名
          });

          console.log(`File ${filename} uploaded to ${bucketName}.`);

          // 回應成功訊息
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end(
            `File ${filename} successfully uploaded to Google Cloud Storage!`
          );
        } catch (uploadErr) {
          console.error("Error uploading to GCS:", uploadErr);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error uploading to Google Cloud Storage.");
        }
      });
    } else {
      // 文件上傳表單
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="/fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      res.end();
    }
  })
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
