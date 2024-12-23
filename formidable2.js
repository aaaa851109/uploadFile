let http = require("http");
var formidable = require("formidable");
var fs = require("fs");

// 確保 uploads 目錄存在
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

http
  .createServer(function (req, res) {
    // 顯示上傳表單
    if (req.url == "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      ); // 因為form action="fileupload" 點擊submit後 網址後加上fileupload
      res.write('<input type="file" name="myTempStorage"><br>'); // 自訂formidable 的暫存桶名稱
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }

    // 處理檔案上傳
    if (req.url == "/fileupload") {
      var form = new formidable.IncomingForm();
      // 是用來建立一個表單解析器，用於處理 HTTP 請求中的檔案上傳和表單數據。
      form.uploadDir = "./uploads"; // 設定上傳目錄
      form.keepExtensions = true; // 保留檔案副檔名

      form.parse(req, function (err, fields, files) {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Error in file upload");
          res.end();
          return;
        }

        console.log(files); // 檢查上傳的檔案資訊

        // 檢查檔案是否成功上傳
        if (!files.myTempStorage || !files.myTempStorage[0]) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.write("No file uploaded");
          res.end();
          return;
        }

        // 取得檔案的舊路徑和新路徑
        var oldpath = files.myTempStorage[0].filepath;
        // 與w3school不同 早期版本每個檔案的資訊是單一物件，
        // 新版檔案資訊統一存放為陣列形 需用files.myTempStorage[0]取第一個檔案
        var newpath = "./uploads/" + files.myTempStorage[0].originalFilename;
        // ./uploads/  最後加上/才進入指定資料夾，否則還是父資料夾。
        console.log(oldpath);
        console.log(newpath);

        // 確保檔案路徑有效，移動檔案
        fs.rename(oldpath, newpath, function (err) {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Error moving the file");
            res.end();
            return;
          }
          res.write("File uploaded and moved to " + newpath);
          res.end();
        });
      });
    }
  })
  .listen(8080, () => {
    console.log("Server running at http://localhost:8080/");
  });
