# Vue 路由守卫

有的时候，我们需要通过路由来进行一些操作，比如最常见的登录权限验证，当用户满足条件时，才能让其进入导航，否则就取消跳转，并跳到登录页面让其登录。

为此我们有很多种方法可以植入路由的导航过程：**全局的，单个路由独享的，或者组件级的**

## 全局守卫

vue-router 全局有三个守卫：

1. router.beforeEach 全局前置守卫 进入路由之前
2. router.beforeResolve 全局解析守卫（2.5.0+）在 beforeRouteEnter 调用之后调用
3. route.afterEach 全局后置钩子 进入路由之后

```javascript
// main.js 入口文件
import router from "./router"; // 引入路由
router.beforeEach((to, from, next) => {
  next();
});
router.beforeResolve((to, from, next) => {
  next();
});
router.afterEach((to, from) => {
  console.log("afterEach 全局后置钩子");
});
```

**to,from,next 这三个参数：**

to 和 from 是**将要进入和将要离开的路由对象**，路由对象指的是平时通过 this.\$route 获取到的路由对象。

**next:Function** 这个参数是个函数，且**必须调用，否则不能进入路由**（页面空白）

- next() 进入该路由

- next(false)取消进入路由，url 地址重置为 from 路由地址（也就是将要离开的路由地址）

```
我们可以这样跳转：next('path地址')或者next({path:''})或者next({name:''})
  且允许设置诸如 replace: true、name: 'home' 之类的选项
  以及你用在router-link或router.push的对象选项。
```

## 路由独享守卫

如果你不想全局配置守卫的话，你可以为某些路由单独配置守卫：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: "/foo",
      component: Foo,
      beforeEnter: (to, from, next) => {
        // 参数用法什么的都一样,调用顺序在全局前置守卫后面，所以不会被全局守卫覆盖
        // ...
      },
    },
  ],
});
```

## 路由组件内的守卫

1. beforeRouteEnter 进入路由前
2. beforeRouteUpdate(2.2) 路由复用同一组件时
3. beforeRouteLeave 离开当前路由前

```javascript
  beforeRouteEnter (to, from, next) {
    // 在路由独享守卫后调用 不！能！获取组件实例 `this`，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用 可以访问组件实例 `this`
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用，可以访问组件实例 `this`
  }
```

**beforeRouteEnter 访问 this**

因为钩子在组件实例还没被创建的时候调用，所以不能获取组件实例`this`,可以通过传一个回调给 `next`来访问组件实例

但是`回调的执行时机在mounted后面`，所以在我看来这里对 this 的访问意义不太大，可以放在`created`或者`mounted`里面。

```javascript
    beforeRouteEnter (to, from, next) {
    console.log('在路由独享守卫后调用');
      next(vm => {
        // 通过 `vm` 访问组件实例`this` 执行回调的时机在mounted后面，
      })
    }
```

**beforeRouteLeave**

导航离开该组件的对应路由是调用，我们用它来禁止用户离开，比如还未保存草稿，或者在用户离开前，将`setInterval`销毁，防止离开之后，定时器还在调用。

```javascript
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}

```

## 关于钩子函数的知识

**路由钩子函数的错误捕获**

如果我们在全局守卫/路由独享守卫/组件路由守卫的钩子函数中有错误，可以这样捕获：

```javascript
router.onError((callback) => {
  // 2.4.0新增 并不常用，了解一下就可以了
  console.log(callback, "callback");
});
```

**跳转死循环，页面永远空白**

来看一段伪代码：

```javascript
router.beforeEach((to, from, next) => {
  if (登录) {
    next();
  } else {
    next({ name: "login" });
  }
});
```

看逻辑貌似是对的，但是当我们跳转到`login`之后，因为此时还是未登录状态，所以会一直跳转到`login`然后死循环，页面一直是空白的，所以：我们需要把判断条件稍微改一下。

```javascript
if (登录 || to.name === "login") {
  next();
} else {
  next({ name: "login" });
} // 登录，或者将要前往login页面的时候，就允许进入路由
```

**全局后置钩子的跳转**

文档中提到因为 router.afterEach 不接受`next`函数所以也不会改变导航本身，意思就是只能当成一个钩子来使用，但是我自己在试的时候发现，我们可以通过这种形式来实现跳转：

```javascript
// main.js 入口文件
import router from "./router"; // 引入路由
router.afterEach((to, from) => {
  if (未登录 && to.name !== "login") {
    router.push({ name: "login" }); // 跳转login
  }
});
```

**完整的路由导航解析流程（不包括其他生命周期）**

1. 触发进入其他路由。
2. 调用要离开路由的组件守卫：`beforeRouteLeave`
3. 调用全局前置守卫：`beforeEach`
4. 在重用的组件里调用：`beforeRouteUpdate`
5. 调用路由独享守卫：`beforeEnter`
6. 解析异步路由组件。
7. 在将要进入的路由组件中调用 `beforeRouteEnter`
8. 调用全局解析守卫`beforeResolve`
9. 导航被确认
10. 调用全局后置钩子的`afterEach`钩子
11. 触发DOM更新（mounted）。
12. 执行`beforeRouteEnter`守卫中传给 next 的回调函数

