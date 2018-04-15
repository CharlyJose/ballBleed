

var socket;

var blob;
var bullet;

var start = 0;

var calledStart = 0;

var blobs = [];
var bullets = [];

var zoom = 1;

// Reconnects the server with same old data
function callStart(data) {
  socket.emit('start', data);
  calledStart = 1;
}



function setup() {
  createCanvas(1400, 700);
  frameRate(1000);
  // console.log("frameRate();"  + frameRate() );


  // Start a socket connection to the server
  socket = io.connect('http://localhost:3000', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity
  });

  socket.on('connection', function() {
    console.log("Connected to server");
  });

  socket.on('disconnect', function() {
    console.log("Disconnected from server");
  });

  // My blob created
  blob = new Blob(random(width), random(height), random(8, 20));

  // Make a little object with  and y
  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('start', data);
  calledStart = 1;

  // Continously updating with server data
  socket.on('heartbeat',
    function(data1, data2) {
      blobs = data1;
      bullets = data2;
    }
  );
}



function draw() {
  background('#c5d5cb');
  frameRate(1000);

  // Scaling
  translate(width / 2, height / 2);
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);


  // Show blobs
  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    if (id.substring(2, id.length) !== socket.id) {
      // Blue is enemy
      fill(0, 0, 255);
      noStroke();
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);
      // id color
      fill(0);
      textAlign(CENTER);
      textSize(4);
      text(blobs[i].id + "\n( " + blobs[i].x + " ," + blobs[i].y + " ) " + "\n[" + blobs[i].r + "]", blobs[i].x, blobs[i].y + blobs[i].r*1.3);
    }

/*
    // Get/eat blobs
    var blobPos = createVector(blobs[i].x, blobs[i].y);
    var blobR = blobs[i].r;
    if (blob.eats(blobPos, blobR)) {
      blobs.splice(i, 1);
      console.log("eat" + i);

    }
*/

}

/*
    // Eat blobs
    if (blob.eats(blobs[i])) {
      blobs.splice(i, 1);
    }
*/


  // Show bullets
  for (var i = bullets.length - 1; i >= 0; i--) {
    fill(bullets[i].rc, bullets[i].gc, bullets[i].bc);
    noStroke();
    ellipse(bullets[i].x, bullets[i].y, bullets[i].r, bullets[i].r);

    // Get/Eat bullets
    var bulletPos = createVector(bullets[i].x, bullets[i].y);
    var bulletR = bullets[i].r;
    if (blob.eats(bulletPos, bulletR)) {
      socket.emit('updateBullet', bullets[i].id);
      //bullets.splice(i, 1);
    }
  }



/*
  for(var i = blobs.length - 1; i >= 0; i--) {   // On eating food
    //blobs[i].show();
    blob.show();
    if(blob.eats(blobs[i])) {
      console.log('Eat: ' + blob.id);
      blobs.splice(i, 1);
    }
  }
*/


  blob.show();

  // Move blob on mouse click
  if (mouseIsPressed) {
    blob.update();
  }
  blob.constrain();


  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };

  if(calledStart == 1) {
    socket.emit('updateBlob', data);
  }
  else
    callStart(data);
}

// fire on pressing spacebar
function keyPressed() {
  if(keyCode === 32)  {
    fire.update();
    console.log("SPACEBAR");
  }
}
