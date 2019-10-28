const Promise = (function(){
    const PENDING = 'PENDING';
    const FULFILLED = 'FULFILLED';
    const REJECTED = 'REJECTED';

    class Promise{
        constructor(fn){
            this.status = PENDING;
            this.callbacks = [];
            this.ret = '';

            setTimeout(() => {
                fn(this._fulfilled.bind(this), this._rejected.bind(this))
            }, 0)
        }

        _fulfilled(ret){
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.ret = ret;
                for(let i = this.callbacks.length; i > 0; i--){
                    let callback = this.callbacks.shift();
                    callback.ONFULFILLED && callback.ONFULFILLED(ret)
                }
            }
        }

        _rejected(){
            if(this.status === PENDING){
                this.status = REJECTED;
                for(let i = this.callbacks.length; i > 0; i--){
                    let callback = this.callbacks.shift();
                    callback.ONREJECTED && callback.ONREJECTED(ret)
                }
            }
        }

        then(ONFULFILLED, ONREJECTED){
            let _propmise;

            switch(this.status){
                case PENDING:
                    this.callbacks.push({
                        ONFULFILLED,
                        ONREJECTED
                    })
                    break;
                case FULFILLED:
                    _propmise = ONFULFILLED && ONFULFILLED(this.ret);
                    break;
                case REJECTED:
                    _propmise = ONREJECTED && ONREJECTED(this.ret);
                    break;
            }

            return _propmise || this;
        }
    }

    return Promise
})()


// 测试代码
const promise = new Promise(resolve => {
    setTimeout(() => {
        resolve(1)
    }, 1000)
})

// 测试PENDING状态变更之后，就不再改变
// promise._fulfilled(123)

promise.then(res => {
    console.log('结果1：' + res)
}).then(res => {
    console.log('结果2：' + res)
})

promise.then(res => {
    console.log('结果3：' + res)
})

setTimeout(() => {
    promise.then(res => {
        console.log('结果4：' + res)
    })
}, 2000)