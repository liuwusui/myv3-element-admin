// let arr = [
//   { id: 1, parent_id: 0, name: '有来技术' },
//   { id: 2, parent_id: 1, name: '研发部门' },
//   { id: 3, parent_id: 1, name: '测试部门' }
// ]
// // 标记！！！ 9.15
// function buildTree(arr) {
//   const map = {} // 使用map来存储每个节点的引用

//   // 创建根节点数组，即parent_id为0的节点
//   const root = arr.filter((item) => item.parent_id === 0)

//   // 遍历arr数组，将每个节点添加到map中
//   arr.forEach((item) => {
//     item.children = [] // 添加一个children属性，用于存储子节点
//     map[item.id] = item // 使用节点的id作为键，将节点存储在map中
//   })

//   // 遍历arr数组，将每个节点添加到其父节点的children数组中
//   arr.forEach((item) => {
//     if (item.parent_id !== 0) {
//       const parent = map[item.parent_id]
//       parent.children.push(item)
//     }
//   })

//   return root.map((item) => ({
//     value: item.id,
//     label: item.name,
//     children: item.children
//   }))
// }

// console.log(buildTree(arr))

// function getExpirationDate(year, month, day) {
//   // TODO

//   return [year, month, day];
// }

let setA = new Set([1, 2, 3, 4, 5, 6])
let setB = new Set([5, 6, 7, 8, 9, 0])

let unionSet = new Set([...setA, ...setB])
console.log(unionSet)
