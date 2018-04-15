
function Fire() {
  this.initPos = createVector(x, y);
  this.vel = createVector(0, 0);
  // Maximum distance of firing
  this.strength = createVector(50, 50);

  this.update = function() {
    var fire =
    //var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
    newvel.div(50);
    //newvel.setMag(3);
    newvel.limit(3);
    this.vel.lerp(newvel, 0.2);
    this.pos.add(this.vel);
  }

  this.constrain = function() {
    fire.pos.x = constrain(fire.pos.x, -width / 2, width / 2);
    fire.pos.y = constrain(fire.pos.y, -height / 2, height / 2);
  }

  this.show = function() {
    fill('rgb(0,255,0)');
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}
