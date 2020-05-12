<!--
 * @Author: tangKa
 * @Date: 2020-05-11 09:36:57
 * @LastEditors: tangKa
 * @LastEditTime: 2020-05-11 09:38:16
 * @Description: file content
 -->

# Promise的实现

## 简介

- Promise对象用于延迟(deferred) 计算和异步(asynchronous)。一个Promise对象代表着一个还未完成，但预计将来完成的操作。Promise对象是一个返回值的代理，这个返回值在promise对象创建时未必已知。它允许你为异步操作的成功或失败指定处理方法。这使得异步方法可以像同步方法那样返回值：异步方法会返回一个包含了原返回值的prosime对象来替换原返回值。

## 解决了什么问题及怎么使用

```javascript
// 一个简单的示例 执行一个动画A，执行完之后再去执行另一个动画B
setTimeout(function(){
    //A动画
    console.log('A');
    setTimeout(function() {
        //B动画
        console.log('B');
    },300)
},300);
// 这里只有两个动画，如果有更多呢，就会看到一堆函数缩进
```

不难想象，如果依次有很多个动画，就会出现多重嵌套。代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理。

因为多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数，可能都要跟着修改。这种情况就称为`回调函数地狱“（callback hell）`。

Promise对象就是为了解决这个问题而提出的。它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用。 

浏览器实现方式：可以在支持Promise的版本上运行

```javascript
var p = new Promise(function (resolve, reject) {
    setTimeout(function () {
        // A动画
        console.log('A');
        resolve();
    }, 300);
});

p.then(function () {
    setTimeout(function () {
        // B动画
        console.log('B');
    }, 300);
});
```
promise会让代码变得更容易维护，像写同步代码一样写异步代码。

## promise原理

其实，promise就是三个状态，利用观察者模式的编程思想，只需要通过特定书写方式注册对应状态的事件处理函数，然后更新状态，调用注册过的处理函数即可，

这个特定方式就是then, done,fail, always...等方法，更新状态就是resolve，reject方法。
实现代码：

```javascript
/**
 * Promise类实现原理
 * 构造函数传入一个function，有两个参数，resolve：成功回调; reject：失败回调
 * state: 状态存储 [PENDING-进行中 RESOLVED-成功 REJECTED-失败]
 * doneList: 成功处理函数列表
 * failList: 失败处理函数列表
 * done: 注册成功处理函数
 * fail: 注册失败处理函数
 * then: 同时注册成功和失败处理函数
 * always: 一个处理函数注册到成功和失败
 * resolve: 更新state为：RESOLVED，并且执行成功处理队列
 * reject: 更新state为：REJECTED，并且执行失败处理队列
**/

class PromiseNew {
  constructor(fn) {
    this.state = 'PENDING';
    this.doneList = [];
    this.failList = [];
    fn(this.resolve.bind(this), this.reject.bind(this));
  }

  // 注册成功处理函数
  done(handle) {
    if (typeof handle === 'function') {
      this.doneList.push(handle);
    } else {
      throw new Error('缺少回调函数');
    }
    return this;
  }

  // 注册失败处理函数
  fail(handle) {
    if (typeof handle === 'function') {
      this.failList.push(handle);
    } else {
      throw new Error('缺少回调函数');
    }
    return this;
  }

  // 同时注册成功和失败处理函数
  then(success, fail) {
    this.done(success || function () { }).fail(fail || function () { });
    return this;
  }

  // 一个处理函数注册到成功和失败
  always(handle) {
    this.done(handle || function () { }).fail(handle || function () { });
    return this;
  }

  // 更新state为：RESOLVED，并且执行成功处理队列
  resolve() {
    this.state = 'RESOLVED';
    let args = Array.prototype.slice.call(arguments);
    setTimeout(function () {
      this.doneList.forEach((item, key, arr) => {
        item.apply(null, args);
        arr.shift();
      });
    }.bind(this), 200);
  }

  // 更新state为：REJECTED，并且执行失败处理队列
  reject() {
    this.state = 'REJECTED';
    let args = Array.prototype.slice.call(arguments);
    setTimeout(function () {
      this.failList.forEach((item, key, arr) => {
        item.apply(null, args);
        arr.shift();
      });
    }.bind(this), 200);
  }
}

// 下面一波骚操作
new PromiseNew((resolve, reject) => {
  resolve('hello world');
  // reject('you are err');
}).done((res) => {
  console.log(res);
}).fail((res) => {
  console.log(res);
})
```