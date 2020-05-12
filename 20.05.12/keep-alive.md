# keep-alive

vue 路由 按需keep-alive

![https://user-gold-cdn.xitu.io/2019/5/19/16acfee7031de2c7?imageslim](https://user-gold-cdn.xitu.io/2019/5/19/16acfee7031de2c7?imageslim)

## situation

一个常见的场景

主页 -->前进 列表页-->前进 详情页，
详情页 -->返回 主页 -->返回 列表页

我们希望，

从 详情页 -->返回 列表页 的时候页面的状态是缓存，不用重新请求数据，提升用户体验。

从 列表页 -->返回 主页 的时候页面，注销掉列表页，以在进入不同的列表页的时候，获取最新的数据。

## task

`keep-alive` 是 `Vue`提供的一个抽象组件，主要用于保留组件状态或避免重新渲染。
![https://user-gold-cdn.xitu.io/2019/5/19/16acff709701145a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2019/5/19/16acff709701145a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

但是`keep-alive`会把其包裹的所有组件都缓存起来。

## action

我们把需求分解成2步来实现

### 1.把需要缓存和不需要缓存的视图组件区分开

思路如下图：

![https://user-gold-cdn.xitu.io/2019/5/19/16acffc9192eb757?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2019/5/19/16acffc9192eb757?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 写2个`router-view`出口

```javascript
<keep-alive>
    <!-- 需要缓存的视图组件 -->
  <router-view v-if="$route.meta.keepAlive">
  </router-view>
</keep-alive>

<!-- 不需要缓存的视图组件 -->
<router-view v-if="!$route.meta.keepAlive">
</router-view>

```
2. 在`Router`里定义好需要缓存的视图组件

```javascript
new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('./views/keep-alive/index.vue'),
            meta: {
                deepth: 0.5
            }
        },
        {
            path: '/list',
            name: 'list',
            component: () => import('./views/keep-alive/list.vue'),
            meta: {
                deepth: 1
                keepAlive: true //需要被缓存
            }
        },
        {
            path: '/detail',
            name: 'detail',
            component: () => import('./views/keep-alive/detail.vue'),
            meta: {
                deepth: 2
            }
        }
    ]
})
```

### 2. 按需keep-alive

![https://user-gold-cdn.xitu.io/2019/5/19/16ad00649bb73773?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2019/5/19/16ad00649bb73773?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

`include`和`exclude`属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：