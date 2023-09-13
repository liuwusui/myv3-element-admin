// let res = [
//   {
//     "4": {
//       "doc_count_error_upper_bound": 0,
//       "sum_other_doc_count": 2,
//       "buckets": [
//         {
//           "key": "238",
//           "doc_count": 1
//         },
//         {
//           "key": "322",
//           "doc_count": 1
//         },
//         {
//           "key": "356",
//           "doc_count": 1
//         },
//         {
//           "key": "430",
//           "doc_count": 1
//         },
//         {
//           "key": "453",
//           "doc_count": 1
//         },
//         {
//           "key": "521",
//           "doc_count": 1
//         },
//         {
//           "key": "548",
//           "doc_count": 1
//         },
//         {
//           "key": "567",
//           "doc_count": 1
//         },
//         {
//           "key": "598",
//           "doc_count": 1
//         },
//         {
//           "key": "602",
//           "doc_count": 1
//         }
//       ]
//     },
//     "key": "2022",
//     "doc_count": 12
//   },
//   {
//     "4": {
//       "doc_count_error_upper_bound": 0,
//       "sum_other_doc_count": 0,
//       "buckets": [
//         {
//           "key": "1325",
//           "doc_count": 1
//         },
//         {
//           "key": "217",
//           "doc_count": 1
//         },
//         {
//           "key": "298",
//           "doc_count": 1
//         },
//         {
//           "key": "487",
//           "doc_count": 1
//         },
//         {
//           "key": "604",
//           "doc_count": 1
//         },
//         {
//           "key": "878",
//           "doc_count": 1
//         },
//         {
//           "key": "916",
//           "doc_count": 1
//         }
//       ]
//     },
//     "key": "2023",
//     "doc_count": 7
//   }
// ]

// // 想要结果
// // arr=[
// //   {
// //     type:2022,
// //     value:XXX // value的值对应key=2022时  4.buckets.key的值的总和
// //   },
// //   {
// //     type:2023,
// //     value:XXX
// //   }
// // ]

// let arr = res.map(item => {
//   let sum = item["4"].buckets.reduce((total, bucket) => total + parseInt(bucket.key), 0);
//   return {
//     type: item.key,
//     value: sum
//   };
// });

// console.log(arr);

// function dominantIndex(nums) {
//   let arr = nums
//   arr.sort((a,b)=>{
//       return b-a
//   })
//   console.log(arr);
//   console.log(nums);
//   if(arr[0]>=arr[1]*2){
//       return nums.indexOf(arr[0])
//   }else{
//       return -1
//   }
// };

// dominantIndex([3,6,1,0])

let obj = {
  0:'name',
  1:'jack',
  2:'age'
}
console.log(Array.from(obj));
console.log(Array.from('hello'));
// let x = 1;
// let y = 2;

// [x, y] = [y, x];

// console.log(x,y);   // 2,1

// console.log(String.fromCharCode(0x20BB7)); // ஷ
let a = 'world'
// console.log(a.includes('l')) //true
// console.log(a.repeat(5));

// console.log('aabbcc'.replaceAll('b', '_'));

let budget = 1_000_000_000_000;
console.log(budget === 10 ** 12); // true

let num = 12_345;

console.log(num); // 12345
console.log(num.toString()); // 12345

Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
// console.log(Math.trunc(true)); //1

// console.log(Math.cbrt('8'));


function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

console.log(add(2, 5, 3)); // 10
