const fs = require('fs')

let text = ''

const blob = fs.readFileSync('./classes/blob.js')
const dna = fs.readFileSync('./classes/dna.js')
const gene = fs.readFileSync('./classes/gene.js')
const game = fs.readFileSync('./classes/game.js')
const renderer = fs.readFileSync('./classes/renderer.js')
const entity = fs.readFileSync('./classes/entity.js')
const wall = fs.readFileSync('./classes/wall.js')
const food = fs.readFileSync('./classes/food.js')
const poison = fs.readFileSync('./classes/poison.js')

text += renderer + '\n' + entity + '\n' + blob + '\n' + wall + '\n' + food + '\n' + poison + '\n' + dna + '\n' + gene + '\n' + game

fs.writeFileSync('build.js', text)