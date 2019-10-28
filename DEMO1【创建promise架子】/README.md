### ⚠️实现promise的几个注意点

#### promise支持同步和异步
这就需要在constructor的时候使用setTimeout让_fulfilled和_rejected的执行在同步then之后


#### promise的三种状态 PENDING | FULFILLED | REJECTED
定义三种常量
```
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';
```


#### promise状态一旦改变就会凝固，不会再变
这要求执行_fulfilled和_refject的时候，需要执行status是否为PENDING的检测


#### promise状态改变，再添加then也会立即执行
这个规则定义了如何实现then，以及then的三种状态处理：
* PENDING：我的做法是先把他们维护到队列，等到resolve时统一处理
* FULFILLED：直接执行ONFULFILLED
* REJECTED：直接执行ONREJECTED
