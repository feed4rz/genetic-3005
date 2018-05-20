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