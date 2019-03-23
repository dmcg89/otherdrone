const express = require('express');

const PORT = process.env.PORT || 3000

const app = express();

const path = require('path');

const http    = require('http');

const flights = require('./controllers/flights')(app)

const faces = require('./controllers/faces')(app);

const arDrone = require('ar-drone');

// const client = arDrone.createClient({ip: '172.30.1.35'});

const client = arDrone.createClient();

// require('ar-drone-png-stream')(client, { port: 8000 });

// client.on('navdata', console.log);

const autonomy = require('ardrone-autonomy')
const mission = autonomy.createMission()

app.use(express.static('public'));

app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT, function () {
  console.log(`App Listening on ${PORT}`);
});
