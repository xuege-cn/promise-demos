const Promise = (function(){
    const PENDING = 'PENDING';
    const FULFILLED = 'FULFILLED';
    const REJECTED = 'REJECTED';
    
    const timeoutFn = fn => context => ret => setTimeout(fn.bind(context, ret), 0);
    const _promiseThen = promise => resolve => ret => {
        if(promise && promise instanceof Promise){
            promise.then(res => {
                resolve(res);
            });
        }else{
            resolve(ret);
        }
    }

    class Promise{
        constructor(fn){
            this.status = PENDING;
            this.callbacks = [];
            this.ret = '';

            fn(timeoutFn(this._fulfilled)(this), timeoutFn(this._rejected)(this))
        }

        _fulfilled(ret){
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.ret = ret;
                for(let i = this.callbacks.length; i > 0; i--){
                    let { ONFULFILLED, resolve } = this.callbacks.shift();
                    _promiseThen(
                        ONFULFILLED && ONFULFILLED(ret)
                    )(resolve)(ret);
                }
            }
        }

        _rejected(ret){
            if(this.status === PENDING){
                this.status = REJECTED;
                this.ret = ret;
                for(let i = this.callbacks.length; i > 0; i--){
                    let { ONREJECTED, resolve } = this.callbacks.shift();
                    _promiseThen(
                        ONREJECTED && ONREJECTED(ret)
                    )(resolve)(ret);
                }
            }
        }

        then(ONFULFILLED, ONREJECTED){
            let self = this, _promise;
            return new Promise(resolve => {
                let _promise;
                switch(self.status){
                    case PENDING:
                        self.callbacks.push({
                            ONFULFILLED,
                            ONREJECTED,
                            resolve
                        })
                        break;
                    case FULFILLED:
                        _promise = ONFULFILLED && ONFULFILLED(self.ret);
                        break;
                    case REJECTED:
                        _promise = ONREJECTED && ONREJECTED(self.ret);
                        break;
                }
                
                self.status != PENDING && _promiseThen(_promise)(resolve)(self.ret);
            });
        }
    }

    return Promise;
})();


// 测试代码
const promise = new Promise(resolve => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});

promise.then(res => {
    console.log('结果1：' + res);
    return new Promise((resolve, rejected) => {
        resolve(2);
    })
}).then(res => {
    console.log('结果2：' + res);
    return new Promise((resolve, rejected) => {
        resolve(3);
    })
}).then(res => {
    console.log('结果3：' + res);
})

setTimeout(() => {
    promise.then(res => {
        console.log('结果11：' + res);
        return new Promise((resolve, rejected) => {
            resolve(2);
        })
    }).then(res => {
        console.log('结果22：' + res);
        return new Promise((resolve, rejected) => {
            resolve(3);
        })
    }).then(res => {
        console.log('结果33：' + res);
    })
}, 2000)