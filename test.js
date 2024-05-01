function calculateScore(arr) {
  let total = 0;

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];

    if (num % 2 === 0) {
      // Add 1 point for every even number
      total += 1;
    } else {
      // Add 3 points for every odd number except number 5 add 5 point
      total += num === 5 ? 5 : 3;
    }
  }
  return total;
}

// test case 1:
const dummyArray = [1, 2, 3, 4, 5];
const result = calculateScore(dummyArray);
console.log("Total Score for case 1 :", result);

// test case 2:
const dummyArray2 = [17, 19, 21];
const result2 = calculateScore(dummyArray2);
console.log("Total Score for case 2 :", result2);

// test case 3:
const dummyArray3 = [5, 5, 5];
const result3 = calculateScore(dummyArray3);
console.log("Total Score for case 3 :", result3);


// const App = (props) => {
//     const [counter, setCouner] = usestate(0)
//     useEffect(() => {
//         console.log('Hello')
//         setCouner(1)
//     }, [props.visible]);
//     return <div>{counter}</div>
// }