<!--
 * @Author: tangKa
 * @Date: 2020-05-11 13:57:32
 * @LastEditors: tangKa
 * @LastEditTime: 2020-05-11 14:00:52
 * @Description: file content
 -->

# Vue nextTick 机制

## 背景

我们先来看一段 Vue 的执行代码；

```javascript
export default {
    data () {
        return {
            msg: 0
        }
    }
    mounted () {
    this.msg = 1
    this.msg = 2
  },
  watch: {
    msg () {
      console.log(this.msg)
    }
  }
}
```

执行这段代码，我们猜测会依次打印：1、2、3。但是实际效果中，只会输出一次：3.


## queueWatcher

我们定义`watch`监听`msg`,实际上会被Vue这样调用`vm.$watch(keyOrFn,handle,options)`.`$watch`是我们初始化的时候，为`vm`绑定的一个函数，用于创建`Watcher`对象。那么我们看看`Watcher`中是如何处理`handler`的；

```javascript
this.deep = this.user = this.lazy = this.sync = false
...
  update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
...

```

初始设定`this.deep=this.user=this.lazy=this.sync=false`,也就是当触发`update`更新的时候，会去执行queueWatcher方法：

```javascript
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false
...
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

```
 
这里面的`nextTick(flushSchedulerQueue)`中的`flushSchedulerQueue`函数其实就是`watcher`的视图更新:

``` javascript
function flushSchedulerQueue () {
  flushing = true
  let watcher, id
  ...
 for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
    ...
  }
}
```

另外，关于`waiting`变量，这是很重要的一个标志位，它保证`flushSchedulerQueue`回调只允许被置入`callbacks`一次。
接下来我们来看看`nextTick`函数，在说`nexTick`之前，需要你对`Event Loop、microTask、macroTask`有一定的了解，Vue nextTick 也是主要用到了这些基础原理。

``` javascript
export const nextTick = (function () {
  const callbacks = []
  let pending = false
  let timerFunc

  function nextTickHandler () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  // An asynchronous deferring mechanism.
  // In pre 2.4, we used to use microtasks (Promise/MutationObserver)
  // but microtasks actually has too high a priority and fires in between
  // supposedly sequential events (e.g. #4521, #6690) or even between
  // bubbling of the same event (#6566). Technically setImmediate should be
  // the ideal choice, but it's not available everywhere; and the only polyfill
  // that consistently queues the callback after all DOM events triggered in the
  // same loop is by using MessageChannel.
  /* istanbul ignore if */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => {
      setImmediate(nextTickHandler)
    }
  } else if (typeof MessageChannel !== 'undefined' && (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === '[object MessageChannelConstructor]'
  )) {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = nextTickHandler
    timerFunc = () => {
      port.postMessage(1)
    }
  } else
  /* istanbul ignore next */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    // use microtask in non-DOM environments, e.g. Weex
    const p = Promise.resolve()
    timerFunc = () => {
      p.then(nextTickHandler)
    }
  } else {
    // fallback to setTimeout
    timerFunc = () => {
      setTimeout(nextTickHandler, 0)
    }
  }

  return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
})()

```

首先Vue通过`callback`数组来模拟事件队列，事件队里的事件，通过`nextTickHandler`方法来执行调用，而何事进行执行，是由`timerFunc`来决定的。我们来看一下`timeFunc`的定义：



microTask: nextTick, Promise, 微服务

macroTask: setTimeout, setInterval 宏服务