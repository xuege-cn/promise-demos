const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(new Error('发生了错误'))
    }, 3000)
})

const p2 = new Promise((resolve) => {
    setTimeout(() => {
        resolve(p1)
    }, 1000)
})

p2.then(result => console.log(result)).catch(e => console.log(e))