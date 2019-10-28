function fn([cur, next], result){
    [cur, next] = [next, cur + next];
    if(next < 1000){
        result.push(next);
        fn([cur, next], result)
    }
}

let result = [1]
fn([0, 1], result)
console.log(result)