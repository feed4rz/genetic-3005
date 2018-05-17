class Game {
	constructor(renderer) {
		this.renderer = renderer

		this.blobs = []
		this.walls = []
		this.food = []
		this.poison = []
		this.objects = []
	}

	step() {
		for(let i = 0; i < this.blobs.length; i++) {
			this.blobs[i].step()
		}
	}
}