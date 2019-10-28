const Promise = (function(){
    const PENDING = 'PENDING';
    const FULFILLED = 'FULFILLED';
    const REJECTED = 'REJECTED';
    
    const timeoutFn = fn => context => ret => setTimeout(fn.bind(context, ret), 0);
    const resolveBridgePromise = bridgePromise => resolve => reject => {
        let resolvePromise;
        let called = false;
        return resolvePromise = ret => {
            if (bridgePromise === ret) {
                return reject(new TypeError('Circular reference'));
            }
            
            if(ret instanceof Promise){
                ret.then(res => resolve(res));
            }else if(ret != null && (typeof ret === 'object' || typeof ret === 'function')){
                try{
                    let then = ret.then;
                    if(typeof then === 'function'){
                        then.call(ret, y => {
                            if (called) return;
                            called = true;
                            resolvePromise(y);
                        }, error => {
                            if (called) return;
                            called = true;
                            reject(error);
                        })
                    }else{
                        resolve(ret);
                    }
                }catch(e){
                    if (called) return;
                    called = true;
                    reject(e);
                }
            }else{
                resolve(ret);
            }
        }
    }

    class Promise{
        constructor(fn){
            this.status = PENDING;
            this.onFulfilledCallbacks = [];
            this.onRejectedCallbacks = [];
            this.ret = '';
            this.error = '';


            let reject = timeoutFn(this._rejected)(this);
            try {
                fn(timeoutFn(this._fulfilled)(this), reject);
            } catch (e) {
                reject(e);
            }
        }

        _fulfilled(ret){
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.ret = ret;
                for(let i = this.onFulfilledCallbacks.length; i > 0; i--){
                    let ONFULFILLED = this.onFulfilledCallbacks.shift();
                    ONFULFILLED(ret);
                }
            }
        }

        _rejected(error){
            if(this.status === PENDING){
                this.status = REJECTED;
                this.error = error;
                for(let i = this.onRejectedCallbacks.length; i > 0; i--){
                    let ONREJECTED = this.onRejectedCallbacks.shift();
                    ONREJECTED(error)
                }
            }
        }

        then(ONFULFILLED, ONREJECTED){
            let self = this, bridgePromise;

            ONFULFILLED = typeof ONFULFILLED === "function" ? ONFULFILLED : value => value;
            ONREJECTED = typeof ONREJECTED === "function" ? ONREJECTED : error => { throw error };

            return bridgePromise = new Promise((resolve, reject) => {
                let _promise;
                let resolvePromise = resolveBridgePromise(bridgePromise)(resolve)(reject);
                try{
                    switch(self.status){
                        case PENDING:
                            self.onFulfilledCallbacks.push(ret => {
                                resolvePromise(ONFULFILLED && ONFULFILLED(ret))
                            })
                            self.onRejectedCallbacks.push(ret => {
                                resolvePromise(ONREJECTED && ONREJECTED(ret));
                            });
                            break;
                        case FULFILLED:
                            _promise = ONFULFILLED && ONFULFILLED(self.ret);
                            break;
                        case REJECTED:
                            _promise = ONREJECTED && ONREJECTED(self.ret);
                            break;
                    }
                    
                    self.status != PENDING && resolvePromise(_promise);
                }catch(e){
                    ONREJECTED(e)
                }
            });
        }

        catch(onRejected){
            return this.then(null, onRejected);
        }
    }

    return Promise;
})();

Promise.deferred = function() {
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
try {
    module.exports = Promise
} catch (e) {}


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