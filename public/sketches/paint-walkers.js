let walker

let walkers = []
function setup() {
  createCanvas(640, 360)
  walker = new Walker()
  background(255)
  frameRate(60)

  for (let i = 0; i < 10; i++) {
    walkers.push(new Walker())
  }
}

function draw() {
  walker.walk()
  walker.display()

  for (let j = 0; j < walkers.length; j++) {
    walkers[j].walk()
    walkers[j].display()
  }
}

class Walker {
  constructor() {
    this.position = createVector(width / 2, height / 2)
    this.noff = createVector(random(1000), random(1000))
    this.lifecycle = 120
  }

  display() {
    if (this.lifecycle > 0) {
      fill(random(0, 255), random(0, 255), random(0, 255))
      noStroke()

      const size = 12
      const sizeMappedToLifecycle = map(this.lifecycle, 0, 200, 0, size) * 10
      ellipse(this.position.x, this.position.y, sizeMappedToLifecycle, sizeMappedToLifecycle)
    }
  }

  walk() {
    this.lifecycle -= 2

    if (this.lifecycle > 0) {
      this.position.x = map(noise(this.noff.x), 0, 1, 0, width)
      this.position.y = map(noise(this.noff.y), 0, 1, 0, height)
      this.noff.add(0.01, 0.01, 0)
    }
  }
}
