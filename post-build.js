const fs = require("fs");

const path = "build/index.html";

fs.readFile(path, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/<script /g, '<script type="text/javascript" ');

  fs.writeFile(path, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
