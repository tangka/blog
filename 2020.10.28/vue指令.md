
主要是自定义组件

简单 举例 一个自定义组件来 熟悉

## 需求

图片懒加载， 用自定义组件来实现

## v-imgLazy

使用 IntersectionObserver API 

```
IntersectionObserver 对象的observe() 方法向IntersectionObserver对象监听的目标集合添加一个元素。一个监听者有一组阈值和一个根， 但是可以监视多个目标元素，以查看这些目标元素可见区域的变化。

```
简单来说可以监听dom元素进出可视区域，并且可以控制具体的变化。

*directive/directives* 用来创建注册一个自定义 指令

`directive/imgLazy.js`

``` js
// 引入默认图片
import baseImg from '@/assets/logo.png';

let timer = null;
// 创建一个监听器
let observer = new IntersectionObserver((entries)=>{  
    // entries是所有被监听对象的集合  
    entries.forEach(entry =>{    
        if(entry.isIntersecting || entry.intersectionRatio>0){      
            // 当被监听元素到临界值且未加载图片时触发。      
            !entry.target.isLoaded  && showImage(entry.target,entry.target.data_src)
        }  
    })
})
function showImage(el,imgSrc){  
    const img = new Image();  
    img.src = imgSrc;  
    img.onload = ()=>{    
        el.src = imgSrc;   
        el.isLoaded = true;  
    }
}
export default {  
    // 这里用inserted和bind都行，因为IntersectionObserver时异步的，以防意外还是用inserted好一点  
    // inserted和bind的区别在于inserted时元素已经插入页面，能够直接获取到dom元素的位置信息。  
    inserted(el,binding,vnode) {    
        clearTimeout(timer)    
        // 初始化时展示默认图片    
        el.src = baseImg;    
        // 将需要加载的图片地址绑定在dom上    
        el.data_src = binding.value;    
        observer.observe(el);    
        // 防抖，这里在组件卸载的时候停止监听    
        const vm = vnode.context;    
        timer = setTimeout(() => {      
            vm.$on('hook:beforeDestroy', 
                () => {        
                    observer.disconnect();      
                }
            )    
        }, 20);  
    },  
    
    // 图片更新触发  
    update(el,binding){    
        el.isLoaded = false;    
        el.data_src = binding.value;  
    },  
    
    // unbind不太好，会执行多次，改进一下用组件的beforeDestroy卸载  
    // unbind(){  
    //   
    // 停止监听  
    //   observer.disconnect();  
    // }}
```

## main.js中使用，注册全局指令

``` js
import imgLazy from '@/directive/imgLazy.js'
Vue.directive('imgLazy', imgLazy)

```

## 在组件中定义directives使用，给当前组件注册指令

``` js
import imgLazy from '@/directive/imgLazy.js'
export default {  
    // ...  
    directives: {    
        imgLazy: imgLazy,  
    },
}

```

## 组件中使用

``` vue
<template>  
<div class='container'>    
<div v-for="(item,index) in imgSrc" :key="index" >      
<img v-imgLazy="item" >   
 </div>  
</div>
</template>
<script>import imgLazy from '@/directive/imgLazy.js'
export default {  
    directives: {    
        imgLazy: imgLazy,  
    },  
    data(){    
        return {      
            imgSrc:[        
                "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2396395246,715775841&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=224866248,765861809&fm=26&gp=0.jpg",        
                "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2670715487,1547868437&fm=26&gp=0.jpg",        
                "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2988957523,3295751190&fm=26&gp=0.jpg",        
                "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2698110318,782174384&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1102788601,953675482&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1091405991,859863778&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2396395246,715775841&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=224866248,765861809&fm=26&gp=0.jpg",        
                "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2670715487,1547868437&fm=26&gp=0.jpg",        
                "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2988957523,3295751190&fm=26&gp=0.jpg",        
                "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2698110318,782174384&fm=26&gp=0.jpg",        
                "https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1102788601,953675482&fm=26&gp=0.jpg",        
                "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2004055534,3969071219&fm=26&gp=0.jpg",      ]  
        }  
    }
}
</script>
<style lang="scss" scoped>
img{  width: 200px;  height: 200px;}
</style>
```

## 注册指令的钩子函数

- bind: 只调用一次，指令第一次绑定到元素时调用。这里进行一次性的初始化设置

- inserted: 被绑定元素插入父节点时调用（仅仅保证父节点存在，但不一定已被插入文档中）

- update: 所在组件的VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 。

- componentUpdated: 指令所在组件的VNode及其子VNode全部更新后调用

- unbind: 只调用一次，指令与元素解绑时调用

钩子函数的参数

- el: 指令所绑定的元素，可以用来直接操作 DOM，就是放置指令的那个元素。

- binding: 一个对象，里面包含了几个属性。
    - name：指令名，不包括 v- 前缀。
    - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
    - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
    - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
    - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
    - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。


```
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
Vue.directive('demo', { 
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' +
      'value: '      + s(binding.value) + '<br>' +
      'expression: ' + s(binding.expression) + '<br>' +
      'argument: '   + s(binding.arg) + '<br>' +
      'modifiers: '  + s(binding.modifiers) + '<br>' +
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})
```