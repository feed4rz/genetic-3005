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