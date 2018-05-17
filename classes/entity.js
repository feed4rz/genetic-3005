class Entity {
  constructor(renderer, texture_path, x = 0, y = 0, w = 0, h = 0, a = 0, r = 0, g = 0, b = 0, o = 1) {
    if(!(renderer instanceof Renderer)) throw 'Please, pass valid Renderer class'

    /* Canvas */
    this.renderer = renderer

    /* Entity id */
    this.id = Date.now()

    /* Entity position */
    this.x = x
    this.y = y
    this.a = a

    /* Entity color */
    this.color = { r, g, b, o }

    /* Rectangular texture */
    if(texture_path) {
      this.texture = new Image()
      this.texture.src = texture_path
    } else {
      this.texture = null
    }

    /* Rectangular size */
    this.w = w
    this.h = h

    /* Self push */
    this.renderer.entities.push(this)
  }

  addTexture(texture_path) {
    if(!texture_path) throw 'Please, provide valid texture path'

    this.texture = new Image()
      this.texture.src = texture_path
  }

  tick() {
    this.renderer.ctx.save()

    this.renderer.ctx.translate(this.x + this.w / 2, this.y + this.h / 2)

    this.renderer.ctx.rotate(this.a / 180 * Math.PI)

    this.renderer.ctx.translate(-this.w / 2, -this.h / 2)

    if(this.texture) {
      this.renderer.ctx.drawImage(this.texture, 0, 0, this.w, this.h)
    } else {
      const { r, g, b, o } = this.color
      this.renderer.ctx.fillStyle = `rgba(${r},${g},${b},${o})`
      this.renderer.ctx.fillRect(0, 0, this.w, this.h)
    }

    this.renderer.ctx.restore()
  }

  remove() {
    const index = this.renderer.entities.indexOf(this)

    this.renderer.entities.splice(index, 1)
  }
}