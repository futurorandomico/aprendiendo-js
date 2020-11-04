// const re = /<.*?>/
// const test = '<foo><bar>new</bar></foo>'

const re = /[a-z0-9\.\_\-]+@[a-z0-9\.\_\-]+(\.[a-z0-9]{2,})+/gi
const test = 'seba.arena@rand-omico.com'

// console.log(test.replace(re, '$1 2019'))
console.log(test.match(re))
