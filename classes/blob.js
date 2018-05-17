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
						this.hp += 10
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