
var randomID = require("random-id");
var d3 = require("d3-random");


var blobs = [];
var bullets = [];

// Blob class
function Blob(id, x, y, r) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
}

// Bullet class
function Bullet(id, x, y, r, rc, gc, bc) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.r = r;
  this.rc = rc;
  this.gc = gc;
  this.bc = bc;
}

var express = require('express');
var app = express();


// Set up the server
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

setInterval(heartbeat, 45);



// Update clients with new data
function heartbeat() {
  // Updating bullets
  bullet = new Bullet(randomID(10,"aA0!"),
    d3.randomUniform(-1400, 700)(),
    d3.randomUniform(-1400, 700)(),
    d3.randomUniform(2, 6)(),
    d3.randomUniform(0, 200)(),
    d3.randomUniform(0, 200)(),
    d3.randomUniform(0, 200)()
  );

  bullets.push(bullet);

  // Deleting bullets one by one after reaching a threshold
  if(bullets.length > 400) {
    bullets.splice(0, 100);
  }
  // Updating blobs and bullets
  io.sockets.emit('heartbeat', blobs, bullets);
  //io.sockets.emit('getBullet', bullets);
}


// This is run for each individual user that connects
io.sockets.on('connection',
  function(socket) {
    console.log("We have a new client: " + socket.id);

    socket.on('start',
      function(data) {
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob = new Blob(socket.id, data.x, data.y, data.r);
        blobs.push(blob);
      }
    );

    // Update user data
    socket.on('updateBlob',
      function(data) {
        var blob;
        for (var i = 0; i < blobs.length; i++) {
          if (socket.id == blobs[i].id) {
            blob = blobs[i];
          }
        }
           blob.x = data.x;
           blob.y = data.y;
           blob.r = data.r;

      }
    );

    // Update bullets data
    socket.on('updateBullet',
      function(data) {
        var bullet;
        for(var i = 0; i < bullets.length; i++) {
          // Delete bullet
          if(data == bullets[i].id) {
            bullets.splice(i, 1);
          }
        }
      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
      console.log("id " + socket.id);
      for(var  i = 0; i < blobs.length; i++) {
        if(blobs[i].id == socket.id) {
          // remove user with its data
          console.log("popped::::::::::::::: ----> " + blobs[i].id);
          blobs.splice(i, 1);
        }
      }
    });
  }
);
