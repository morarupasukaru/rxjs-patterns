/*
server created by using example from https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/
https://nodejs.org/api/http.html
 */
const http = require('http');
const fs = require('fs');
var path = require('path');
var bookPath = path.join(__dirname, 'pg103.txt');

const lines = [];
const pageSize = 100;

fs.readFile(bookPath, 'utf8' , (err, data) => {
  if (err) {
    console.error(err);
    return
  }
  let nb = 1;
  data.split('\r\n').forEach(text => {
    lines.push({nb, text});
    nb++;
  });
  console.log(lines)
});

const requestListener = function (req, res) {
  res.writeHead(200);
  const searchParam = '?search=';
  const index = req.url.indexOf(searchParam)
  let result = lines;
  if (index !== -1) {
    const searchValue = req.url.slice(index + searchParam.length).toLowerCase();
    let count = 1;
    if (searchValue) {
      result = lines.filter((line) => line.text.toLowerCase().indexOf(searchValue) !== -1 && count++ < pageSize);
    }
  }
  res.end(JSON.stringify(result));
}

const server = http.createServer(requestListener);
server.listen(8080);
