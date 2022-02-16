/*
server created by using example from https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/
https://nodejs.org/api/http.html
 */
const http = require('http');

let id = 1;

let status = {
};

let indicators = [
  {id: id++, name: 'Ninth Vulture'},
  {id: id++, name: 'Barbaric Pluto'},
  {id: id++, name: 'Dead Windshield'},
  {id: id++, name: 'New Weather'},
  {id: id++, name: 'Beacon Nitrogen'},
  {id: id++, name: 'Sienna Scoreboard'},
  {id: id++, name: 'Meaningful Trombone'},
  {id: id++, name: 'Neptune Lone'},
  {id: id++, name: 'Minimum Fox'},
  {id: id++, name: 'Wooden Lama'},
  {id: id++, name: 'Nitrogen Solid'},
];

let additionalIndicators = [
  {id: id++, name: 'Stormy Subtle Anaconda'},
  {id: id++, name: 'Strong Wrench'},
  {id: id++, name: 'Small Subdivision'},
  {id: id++, name: 'Mysterious Eyelid'},
  {id: id++, name: 'Lucky Backpack'},
  {id: id++, name: 'Lost Needless Beta'},
  {id: id++, name: 'Late Compass'},
  {id: id++, name: 'Long Modern Warehouse'},
  {id: id++, name: 'Rich Shower'}
];

const requestListener = function (req, res) {
  const id = getId(req);
  let result;
  if (isNewIndicatorRequired() && additionalIndicators.length > 0) {
    indicators.push(additionalIndicators.pop());
  }
  if (id) {
    result = getIndicator(id);
  } else {
    result = indicators;
  }
  if (result) {
    res.writeHead(200)
    res.end(JSON.stringify(result));
  } else {
    res.writeHead(404)
    res.end(req.url + ' not found');
  }
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

function getIndicator(id) {
  let indicator = indicators.find(i => i.id === id);
  if (indicator) {
    const statusOfIndicator = getIndicatorStatus(id);
    indicator = { ...indicator, status: statusOfIndicator};
  }
  return indicator;
}

function getIndicatorStatus(id) {
  let statusOfIndicator = status[id];
  if (!statusOfIndicator) {
    statusOfIndicator = [];
    status[id] = statusOfIndicator;
    addInitialRandomStatus(statusOfIndicator);
  }
  if (isNewStatusRequired()) {
    addRandomStatus(statusOfIndicator);
  }
  return statusOfIndicator;
}

function addInitialRandomStatus(status) {
  const statusCount = getRandomNumber(1, 10);
  for (let i = 0; i < statusCount; i++) {
    addRandomStatus(status)
  }
}

function addRandomStatus(status) {
  status.push({
    time: getRandomDate(status),
    status: getRandomStatus()
  });
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomStatus() {
  return Math.random() < 0.05 ? 'NOK' : Math.random() < 0.05 ? 'UNKNOWN' : 'OK';
}

function getRandomDate(status) {
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;
  const oneMonth = 31 * oneDay;
  let minDateMs = Date.now() - oneMonth;
  if (status && status.length > 0) {
    minDateMs = status[status.length - 1].time.getTime();
  }
  return new Date(minDateMs + getRandomNumber(oneHour, oneDay));
}

function isNewIndicatorRequired() {
  return Math.random() < 0.03;
}

function isNewStatusRequired() {
  return Math.random() < 0.5;
}
const server = http.createServer(requestListener);
server.listen(8080);
