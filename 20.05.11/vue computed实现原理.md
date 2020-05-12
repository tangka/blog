# Vue中computed实现原理

## 基本介绍

``` javascript
<div id="app">
    <p>{{fullName}}</p>
</div>
new Vue({
    data: {
        firstName: 'Xiao',
        lastName: 'Ming'
    },
    computed: {
        fullName: function () {
            return this.firstName + ' ' + this.lastName
        }
    }
})
```

Vue 中我们不需要在 template 里面直接计算 `{{this.firstName + ' ' + this.lastName}}`，因为在模版中放入太多声明式的逻辑会让模板本身过重，尤其当在页面中使用大量复杂的逻辑表达式处理数据时，会对页面的可维护性造成很大的影响，而 `computed` 的设计初衷也正是用于解决此类问题。