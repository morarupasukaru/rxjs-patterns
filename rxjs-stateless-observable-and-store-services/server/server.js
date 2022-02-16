/*
server created by using example from https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/
https://nodejs.org/api/http.html
 */
const http = require('http');

let id = 1;

let items = [
  {id: id++, quantity: 1, description: 'Bread'},
  {id: id++, quantity: 4, description: 'Bottles of milk'},
  {id: id++, quantity: 1, description: 'kg of potatoes'}
];

const requestListener = function (req, res) {
  res.writeHead(200)
  const id = getId(req);
  if (req.method === 'PUT' || req.method === 'POST') {
    addOrUpdate(id, req, res);
  } else if (req.method === 'DELETE') {
    deleteItem(id);
    res.end(JSON.stringify(items));
  } else {
    res.end(JSON.stringify(items));
  }
}

function addOrUpdate(id, req, res) {
  let body = '';
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    body = JSON.parse(body);
    if (req.method === 'PUT') {
      updateItem(id, body);
    } else {
      addItem(body);
    }
    res.end(JSON.stringify(items));
  });
}

function getId(req) {
  let id = null;
  const index = req.url.lastIndexOf('/');
  if (index !== -1) {
    id = Number(req.url.substring(index + 1));
    if (Number.isNaN(id)) {
      id = null;
    }
  }
  return id;
}

function updateItem(id, item) {
  if (id && item) {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items = items.slice();
      items[index] = { ... item, id: id };
    }
  }
}

function addItem(item) {
  if (item) {
    console.log('item', item);
    item = { ... item, id: id++ };
    items.push(item);
  }
}

function deleteItem(id) {
  if (id) {
    items = items.filter(item => item.id !== id);
  }
}


const server = http.createServer(requestListener);
server.listen(8080);
