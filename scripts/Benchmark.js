// const SOURCE = [
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',
//     'hello', 'hi', 'bye', 'die',
//     'die', 'bye', 'hi', 'hello',

// ];


// var LOOKUP = {
//     "ahello": function (v) {
//         return (v + "\n\n" + "hi");
//     },
//     "ahi": function (v) {
//         return (v + "\n\n" + "hello");
//     },
//     "abye": function (v) {
//         return (v + "\n\n" + "no");
//     },
//     "adie": function (v) {
//         return (v + "\n\n" + "you shot me");
//     },

//     "bhello": function (v) {
//         return (v + "\n\n" + "hi");
//     },
//     "bhi": function (v) {
//         return (v + "\n\n" + "hello");
//     },
//     "bbye": function (v) {
//         return (v + "\n\n" + "no");
//     },
//     "bdie": function (v) {
//         return (v + "\n\n" + "you shot me");
//     },

//     "hello": function (v) {
//         return (v + "\n\n" + "hi");
//     },
//     "hi": function (v) {
//         return (v + "\n\n" + "hello");
//     },
//     "bye": function (v) {
//         return (v + "\n\n" + "no");
//     },
//     "die": function (v) {
//         return (v + "\n\n" + "you shot me");
//     },
// };

// function testLookup(value) {
//     return LOOKUP[value](value);
// }

// function testSwitch(value) {
//     switch (value) {
//         case "ahello":
//             return (value + "\n\n" + "hi");
//         case "ahi":
//             return (value + "\n\n" + "hello");
//         case "abye":
//             return (value + "\n\n" + "no");
//         case "adie":
//             return (value + "\n\n" + "you shot me");
//         case "bhello":
//             return (value + "\n\n" + "hi");
//         case "bhi":
//             return (value + "\n\n" + "hello");
//         case "bbye":
//             return (value + "\n\n" + "no");
//         case "bdie":
//             return (value + "\n\n" + "you shot me");
//         case "hello":
//             return (value + "\n\n" + "hi");
//         case "hi":
//             return (value + "\n\n" + "hello");
//         case "bye":
//             return (value + "\n\n" + "no");
//         case "die":
//             return (value + "\n\n" + "you shot me");
//     }
// }

// console.time("Switch");
// for (let i = 0; i < 1000000; i++) {
//     SOURCE.map(testSwitch);
// }
// console.timeEnd("Switch");

// console.time("Lookup");
// for (let i = 0; i < 1000000; i++) {
//     SOURCE.map(testLookup);
// }
// console.timeEnd("Lookup");