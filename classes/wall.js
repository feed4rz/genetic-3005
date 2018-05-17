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