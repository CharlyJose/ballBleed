

function Bullet(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;

  this.constrain = function() {
    // blob.pos.x = constrain(blob.pos.x, -1400, 1400);
    // blob.pos.y = constrain(blob.pos.y, -700, 700);

    blob.pos.x = constrain(blob.pos.x, -width / 2, width / 2);
    blob.pos.y = constrain(blob.pos.y, -height / 2, height / 2);
  }

  this.show = function() {
    fill('#fae');   // Bullets color
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
