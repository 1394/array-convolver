// const {convolve, reduceby} = require('../groupby')

// const testData = require('./convolve_data.json')

// const res = convolve(testData, {
//   groupby: 'ym',
//   sort: (a,b) => {
//     if (a === b) {
//       return 0
//     }
//     return a > b ? 1 : -1
//   },
//   assemble: (key, values) => {
//     return {
//       text: key,
//       children: values,
//       total: reduceby(values, (acc, el) => acc + parseInt(el.total), 0),
//     }
//   },
//   values: {
//     groupby: 'protoId',
//     to: 'items',
//     assemble: (key, values) => {
//       const {protoName} = values[0]
//       return {
//         text: protoName,
//         proto_id: key,
//         total: reduceby(values, (acc, el) => acc + parseInt(el.itemTotal), 0),
//         qty: reduceby(values, (acc, el) => acc + el.value, 0),
//         children: values,
//       }
//     }
//   },
// })

// console.log('*'.repeat(10), 'result', '*'.repeat(10))
// console.dir(res, {depth: 10})
// console.log('*'.repeat(10), 'result', '*'.repeat(10))
