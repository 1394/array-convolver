// const {convolve} = require('../index')
// const assert = require('assert')

// const testData = require('./convolve_data.json')
// console.log('*'.repeat(10), 'testData', '*'.repeat(10))
// console.dir(testData, {depth: 10})
// console.log('*'.repeat(10), 'testData', '*'.repeat(10))

// const test = convolve(testData, (row) => {
//   return [
//     {path: [row.ym, 'ym'], handler: () => row.ym},
//     {path: [row.ym, 'total'], handler: (val = 0) => parseInt(row.itemTotal) + val},
//     {path: [row.ym, 'protos', row.protoName, 'protoname'], handler: () => row.protoName},
//     {path: [row.ym, 'protos', row.protoName, 'total'], handler: (val = 0) => parseInt(row.itemTotal) + val},
//     {path: [row.ym, 'protos', row.protoName, 'items'], handler: (items = []) => {items.push(row); return items}},
//   ]
// })

// console.log('*'.repeat(10), 'result', '*'.repeat(10))
// console.dir(test, {depth: 10})
// console.log('*'.repeat(10), 'result', '*'.repeat(10))
