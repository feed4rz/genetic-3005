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
class Entity {
  constructor(renderer, texture_path, x = 0, y = 0, w = 0, h = 0, a = 0, r = 0, g = 0, b = 0, o = 1) {
    if(!(renderer instanceof Renderer)) throw 'Please, pass valid Renderer class'

    /* Canvas */
    this.renderer = renderer

    /* Entity id */
    this.id = `${Date.now().toString(16)}${Math.random().toString(16)}`

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

class Blob extends Entity {
	constructor(game, x = 0, y = 0, dna = new DNA()) {
		super(game.renderer, null, x, y, 15, 15, 0, 0, 1, 0)

		this.game = game

		this.dna = dna

		this.hp = 100

		this.angle = 0

		this.game.blobs.push(this)
	}

	recolor() {
		this.color.r = (1 - (this.hp / 100)) * 255
		this.color.g = (this.hp / 100) * 255
	}

	move(gene) {
		switch(gene.move){
			case 1:
				this.x -= 15
				this.y -= 15
				break
			case 2:
				this.y -= 15
				break
			case 3:
				this.x += 15
				this.y -= 15
				break
			case 4:
				this.x += 15
				break
			case 5:
				this.x += 15
				this.y += 15
				break
			case 6:
				this.y += 15
				break
			case 7:
				this.x -= 15
				this.y += 15
				break
			case 8:
				this.x -= 15
				break
		}
	}

	check(gene) {
		let result = gene.type != 4 ? false : true

		let x = this.x
		let y = this.y

		switch(gene.check){
			case 1:
				this.x -= 15
				this.y -= 15
				break
			case 2:
				this.y -= 15
				break
			case 3:
				this.x += 15
				this.y -= 15
				break
			case 4:
				this.x += 15
				break
			case 5:
				this.x += 15
				this.y += 15
				break
			case 6:
				this.y += 15
				break
			case 7:
				this.x -= 15
				this.y += 15
				break
			case 8:
				this.x -= 15
				break
		}
		if(gene.type == 1) {
			for(let i = 0; i < this.game.food.length; i++) {
				const w = this.game.food[i]

				if(w.x == x && w.y == y) {
					result = true
					console.log(this, 'food gene true', gene)
					break
				}
			}
		} else if(gene.type == 2) {
			for(let i = 0; i < this.game.poison.length; i++) {
				const w = this.game.poison[i]

				if(w.x == x && w.y == y) {
					result = true
					console.log(this, 'poison gene true', gene)
					break
				}
			}
		} else if(gene.type == 3) {
			for(let i = 0; i < this.game.walls.length; i++) {
				const w = this.game.walls[i]

				if(w.x == x && w.y == y) {
					result = true
					console.log(this, 'wall gene true', gene)
					break
				}
			}
		} else {
			for(let i = 0; i < this.game.walls.length; i++) {
				const w = this.game.walls[i]

				if(w.x == x && w.y == y) {
					result = false
					console.log(this, 'empty gene false', gene)
					break
				}
			}
		}
	}

	checkCollision() {
		for(let i = 0; i < this.game.objects.length; i++) {
				const o = this.game.objects[i]

				if(o.x == this.x && o.y == this.y) {
					if(o instanceof Wall) {
						this.kill(0)
						break
					}
					if(o instanceof Food) {
						o.removeSelf()
						this.hp += 30
						break
					}
					if(o instanceof Poison) {
						o.removeSelf()
						this.hp -= 10
						break
					}
				}
			}
	}

	kill(reason) {
		const reasons = ['wall', 'starving']
		console.log(this, 'just fucking died because of', reasons[reason])

		this.removeSelf()
	}

	step() {
		const gene = this.dna.getCurrentGene()

		if(this.check(gene)) this.move(gene)

		this.recolor()

		this.checkCollision()

		this.hp--

		if(this.hp <= 0) this.kill(1)
	}

	removeSelf() {
		this.remove()

		const index = this.game.blobs.indexOf(this)

    this.game.blobs.splice(index, 1)
	}
}
class Wall extends Entity{
	constructor(game, x = 0, y = 0) {
		super(game.renderer, null, x, y, 15, 15)

		this.game = game

		this.game.walls.push(this)
		this.game.objects.push(this)
	}

	removeSelf() {
		this.remove()

		let index = this.game.walls.indexOf(this)

    this.game.walls.splice(index, 1)

    index = this.game.objects.indexOf(this)

    this.game.objects.splice(index, 1)
	}
}
class Food extends Entity{
	constructor(game, x = 0, y = 0) {
		super(game.renderer, null, x, y, 15, 15, 0, 0, 0, 255)

		this.game = game

		this.game.food.push(this)
		this.game.objects.push(this)
	}

	removeSelf() {
		this.remove()

		let index = this.game.food.indexOf(this)

    this.game.food.splice(index, 1)

    index = this.game.objects.indexOf(this)

    this.game.objects.splice(index, 1)
	}
}
class Poison extends Entity{
	constructor(game, x = 0, y = 0) {
		super(game.renderer, null, x, y, 15, 15, 0, 101, 67, 33)

		this.game = game

		this.game.poison.push(this)
		this.game.objects.push(this)
	}

	removeSelf() {
		this.remove()

		let index = this.game.poison.indexOf(this)

    this.game.poison.splice(index, 1)

    index = this.game.objects.indexOf(this)

    this.game.objects.splice(index, 1)
	}
}
class DNA {
	constructor(genes = [], generation = 1) {
		this.genes = genes
		this.pointer = 0

		this.generation = 0

		if(this.genes.length == 0) this._generateGenes()
	}

	_generateGenes(amount = 50) {
		this.genes = []
		let id_string = ''

		for(let i = 0; i < amount; i++) {
			const gene = new Gene()

			gene.mutate()

			id_string += `${gene.check}${gene.type}${gene.move}`

			this.genes.push(gene)
		}

		this.id = MD5(id_string)
	}

	mutate() {
		const rnd = Math.floor(Math.random() * this.genes.length)
		this.genes[rnd].mutate()

		let id_string = ''

		for(let i = 0; i < this.genes.length; i++) {
			const g = this.genes[i]

			id_string += `${g.check}${g.type}${g.move}`
		}

		this.generation = 0

		this.id = MD5(id_string)
	}

	getCurrentGene() {
		const gene = this.genes[this.pointer]

		this.pointer++
		if(this.pointer == this.genes.length) this.pointer = 0

		return gene
	}
}
class Gene {
	constructor(check = 1, type = 4, move = 1) {
		this.check = check
		this.type = type
		this.move = move
	}

	mutate() {
		this.check = Math.ceil(Math.random() * 8)
		this.type = Math.ceil(Math.random() * 4)
		this.move = Math.ceil(Math.random() * 8)
	}
}
class Game {
	constructor(renderer, step_interval = 50) {
		this.renderer = renderer

		this.blobs = []
		this.walls = []
		this.food = []
		this.poison = []
		this.objects = []

		this.population = 36
		this.top = 6

		this.generation = 0

		this.step_interval = step_interval
		this.interval = null
	}

	init(population = 36, top = 6) {
		this.population = population
		this.top = 6

		for(let i = 0; i < this.top; i++) {
			new Blob(this, this._getRandomInt(1, 49) * 15, this._getRandomInt(1, 49) * 15)
		}

		this._stage()
	}

	_step() {
		if(this.blobs.length == this.top) return this._stage()

		for(let i = 0; i < this.blobs.length; i++) {
			if(this.blobs.length == this.top) {
				this._stage()
				break
			}

			this.blobs[i].step()
		}
	}

	_stage() {
		if(this.interval) clearInterval(this.interval)

		this._populate()
		this._generateMap()

		this.interval = setInterval(() => {
	    this._step()
	  }, this.step_interval)
	}

	_populate() {
		for(let i = 0; i < this.top; i++) {
			this.blobs[i].dna.generation++

			const b = this.blobs[i]

			document.getElementById(`dna-${i}`).innerText = `${b.dna.id} - ${b.dna.generation}`

			for(let j = 0; j < this.top; j++) {
				const dna = new DNA()
				new Blob(this, this._getRandomInt(1, 49) * 15, this._getRandomInt(1, 49) * 15, Object.assign(dna, b.dna))
			}

			this.blobs[i].hp = 100
			this.blobs[i].x = this._getRandomInt(1, 49) * 15
			this.blobs[i].y = this._getRandomInt(1, 49) * 15
			this.blobs[i].dna.mutate()
		}

		this.generation++

		document.getElementById('generation').innerText = this.generation
	}

	_generateMap() {
		let temp_objects = [].concat(this.objects)

		console.log('about to remove', this.objects.length, 'objects')
		for(let i = 0; i < temp_objects.length; i++) {
			temp_objects[i].removeSelf()
		}
		console.log(this.objects.length, 'objects left')

		for(let i = 0; i < 150; i++) {
	    new Food(this, this._getRandomInt(1, 49) * 15, this._getRandomInt(1, 49) * 15)
	  }

	  for(let i = 0; i < 50; i++) {
	    new Poison(this, this._getRandomInt(1, 49) * 15, this._getRandomInt(1, 49) * 15)
	    new Wall(this, i*15, 0)
	    new Wall(this, 0, i*15)
	    new Wall(this, i*15, 735)
	    new Wall(this, 735, i*15)
	  }
	}
	
	_getRandomInt(min, max) {
	  min = Math.ceil(min)
	  max = Math.floor(max)
	  return Math.floor(Math.random() * (max - min)) + min
	}
}