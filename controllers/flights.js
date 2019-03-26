const express = require('express');

const app = express();

module.exports =  function (app) {

const arDrone = require('ar-drone');
//
const client = arDrone.createClient({ip: '172.30.1.35'});
// const client = arDrone.createClient();

app.get('/takeoff', function(req, res) {
  client.takeoff();
  client.calibrate(0);
  console.log("Drone Taking Off");
  res.json({ name: 'takeoff' }) // Maybe we need a response ???
});

// This router is sending a command to the drone
// to land
app.get('/land', function(req, res) {
 client.stop(0);
 client.land();
 console.log("Drone Landing");
 res.send({ name: 'land' })
});

// This router is sending a command to the drone
// to calibrate. Causes the drone to fully
// rotate and balance
app.get('/calibrate', function(req, res) {
 client.calibrate(0);
 console.log("Drone Calibrating");
 res.send({ name: 'calibrate' })
});

 app.get('/flip', function(req, res) {
  // client.animate('flipBehind', 1000)
  client.animate('flipAhead', 250);
  // client.animate('turnaroundGodown', 1000);
    console.log("flip")
  res.send({ name: 'flip' })
  });


 // This router is sending a command to the drone
// to cancel all existing commands. Important if
// turning clockwise and you want to stop for
// example
app.get('/hover', function(req, res) {
 client.stop();
 console.log("Hover");
 res.send({ name: 'hover' })
 });

// Photo route
//required for photos
const fs = require('fs');

app.get('/photos', function(req, res) {
   console.log("Drone Taking Pictures");
   var pngStream = client.getPngStream();
   var period = 2000; // Save a frame every 2000 ms.
   var lastFrameTime = 0;
   pngStream
     .on('error', console.log)
     .on('data', function(pngBuffer) {
        var now = (new Date()).getTime();
        if (now - lastFrameTime > period) {
           lastFrameTime = now;
           fs.writeFile('./public/DroneImage.png', pngBuffer, function(err) {
           if (err) {
             console.log("Error saving PNG: " + err);
           }
          //  else {
          //    console.log("Saved Frame");
          // }
      });
     }
  });
 });

// This router is sending a command to the drone
// to turn clockwise
app.get('/clockwise', function(req, res) {
 client.clockwise(0.5);
 console.log("Drone Turning Clockwise");
 res.send({ name: 'clockwise' })
});

app.get('/counterclockwise', function(req, res) {
 client.counterClockwise(0.5);
 console.log("Drone Turning counter-clockwise");
 res.send({ name: 'clockwise' })
});

app.get('/up', function(req, res) {
 client.up(.1);
 console.log("drone moving up");
 res.send({ name: 'up' })

});

app.get('/down', function(req, res) {
 client.down(.1);
 console.log("Drone moving down");
 res.send({ name: 'down' })
});

app.get('/forward', function(req, res) {
 client.front(0.2);
 console.log("Drone moving forward");
 res.send({ name: 'forward' })
});

app.get('/backward', function(req, res) {
 client.back(0.2);
 console.log("Drone moving backward");
 res.send({ name: 'backward' })
});

app.get('/left', function(req, res) {
 client.left(0.2);
 console.log("Drone Turning left");
 res.send({ name: 'left' })
});

app.get('/right', function(req, res) {
 client.right(0.2);
 console.log("Drone Turning right");
 res.send({ name: 'right' })
});

app.get('/stop', function(req, res) {
 client.stop();
 console.log("stop");
 res.send({ name: 'stop' })
});

app.get('/reset', function(req, res) {
 client.disableEmergency();
 console.log("reset emergency landing");
 res.send({ name: 'reset emergency landing' })
});

}
