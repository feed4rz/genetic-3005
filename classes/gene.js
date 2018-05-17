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