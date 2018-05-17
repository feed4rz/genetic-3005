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