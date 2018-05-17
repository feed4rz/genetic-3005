class DNA {
	constructor(genes = []) {
		this.genes = genes
		this.pointer = 0

		if(this.genes.length == 0) this.generateGenes()
	}

	generateGenes(amount = 50) {
		this.genes = []

		for(let i = 0; i < amount; i++) {
			const gene = new Gene()

			gene.mutate()

			this.genes.push(gene)
		}
	}

	mutate() {
		const rnd = Math.floor(Math.random() * this.genes.length - 2)
		this.genes[rnd].mutate()
	}

	getCurrentGene() {
		const gene = this.genes[this.pointer]

		this.pointer++
		if(this.pointer == this.genes.length) this.pointer = 0

		return gene
	}
}