
function Blob(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0, 0);

  this.update = function() {
    var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(50);
    newvel.limit(3);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }

  this.position = function() {
    return this.pos;
  }

  this.eats = function(otherPos, otherR) {
    var d = p5.Vector.dist(this.pos, otherPos);
    if (d < this.r + otherR) {
      var sum = PI * this.r * this.r + PI * otherR * otherR;
      this.r = sqrt(sum / PI);
      //this.r += other.r;
      return true;
    } else {
      return false;
    }
  }

  this.constrain = function() {
    blob.pos.x = constrain(blob.pos.x, -width / 2, width / 2);
    blob.pos.y = constrain(blob.pos.y, -height / 2, height / 2);
  }

  this.show = function() {
    fill('rgb(0,255,0)');
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
