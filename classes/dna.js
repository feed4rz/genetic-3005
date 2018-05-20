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