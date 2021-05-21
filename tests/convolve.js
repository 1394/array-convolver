const {convolve} = require('../index')
const assert = require('assert')

const src = [
  {a: 1, b: 2, c: 31},
  {a: 2, b: 3, c: 32},
  {a: 3, b: 4, c: 33},
  {a: 4, b: 5, c: 34},
  {a: 1, b: 50, c: 31},
]

const res = convolve(src, (row) => {
  return [
    {path: `${row.a}.${row.c}`, handler(val) {return row.b + (val || 0)}}
  ]
})

console.dir(res, {depth: 10})
