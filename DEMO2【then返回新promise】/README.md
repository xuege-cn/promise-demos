### 问题场景：
在then里面返回new Promise

#### then的时候是否返回this？

-> then的时候返回this有个问题：
三个then都会打印出 1

因为第二个then返回的是新promise，并不会改变当前promise的ret，所以都是 1 

-> 【怎么解决这个问题？】
在then里面再使用一个promise，来解决这个问题。

分为两种情况：
* 当前promise已为FULFILLED或者REJECTED状态：这时候是直接执行ONFULFILLED的，所以直接取结果判断是否为promise，开始执行，执行完成之后把结果给then里面的promise resolve调用，不为promise，则直接使用then里面的promise resolve调用
* 当前promise还是PENDING状态，会维护到callbacks数组里面，那么数组调用成功之后判断结果是否为promise，此操作跟上面一样