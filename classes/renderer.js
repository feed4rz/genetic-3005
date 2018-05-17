class Renderer {
  constructor(canvas, frames = 60) {
    if(!canvas) throw 'No canvas has been passed'

    /* Canvas */
    this.ctx = canvas.getContext('2d')

    /* Size */
    this.width = canvas.width
    this.height = canvas.height

    /* Rendering */
    this.frames = frames

    /* Entities */
    this.entities = []

    setInterval(() => {
      this.tick()
    }, 1000 / this.frames)
  }

  /* 1 frame */
  tick() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.entities.forEach(entity => { entity.tick() })
  }
}