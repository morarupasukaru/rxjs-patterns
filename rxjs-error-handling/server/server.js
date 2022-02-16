/*
server created by using example from https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/
https://nodejs.org/api/http.html
 */
const http = require('http');

const URL_SUCCESS = 'success';
const URL_ERROR = 'error';
const URL_N_ERRORS_THAN_SUCCESS = 'n-errors-then-success';

const COUNT_N_ERRORS = 3;

let nErrorThanSuccessResults = {
}

const requestListener = function (req, res) {
  setTimeout(() => {
    handleRequest(req, res);
  }, 500);
}

function handleRequest(req, res) {
  const id = getId(req);
  console.log(req.url, id);
  if (req.url.indexOf(URL_N_ERRORS_THAN_SUCCESS) !== -1 && id) {
    let countError = nErrorThanSuccessResults[id];
    if (countError === undefined) {
      countError = COUNT_N_ERRORS;
      nErrorThanSuccessResults[id] = countError;
    } else {
      countError--;
      nErrorThanSuccessResults[id] = countError;
    }
    if (countError === 0) {
      res.writeHead(200)
      console.log(req.url + ' - OK - countError: ' + countError);
      res.end('OK');
      delete nErrorThanSuccessResults[id];
    } else {
      res.writeHead(500)
      console.log(req.url + ' - NOK - countError: ' + countError);
      res.end('NOK');
    }

  } else if (req.url.indexOf(URL_ERROR) !== -1) {
    res.writeHead(500)
    res.end('NOK');

  } else if (req.url.indexOf(URL_SUCCESS) !== -1) {
    res.writeHead(200)
    res.end('OK');

  } else {
    res.writeHead(404)
    res.end(req.url + ' not found');
  }
}

function getId(req) {
  let id = null;
  const index = req.url.lastIndexOf('/');
  if (index !== -1) {
    id = req.url.substring(index + 1);
  }
  return id;
}

const server = http.createServer(requestListener);
server.listen(8080);
