# vue组件间的双向绑定

## v-model

父子组件的自定义双向`v-model`;

``` vue
<!-- children.vue -->
<template>
    <h1>{{ msg }}</h1>
</template>
<script>

export default{
    model:{
        prop:'msg',//这个字段，是指父组件设置 v-model 时，将变量值传给子组件的 msg
        event:'parent-event'//这个字段，是指父组件监听 parent-event 事件
    },
    props:{
        msg:String //此处必须定义和model的prop相同的props，因为v-model会传值给子组件
    },
    mounted(){
    //这里模拟异步将msg传到父组件v-model，实现双向控制
        setTimeout(_=>{
            let some = '3秒后出现的某个值';//子组件自己的某个值
            this.$emit('parent-event',some);
            //将这个值通过 emit 触发parent-event，将some传递给父组件的v-model绑定的变量
        },3000);
    }
}
</script>

```

``` vue
<!-- parent.vue -->
<template>
    <children v-model="parentMsg"></children>
</template>
<script>
import children from 'xx';
export default{
    components: {
        children,
    },
    data(){
        return{
            parentMsg:'test'
        }
    },
    watch:{
        parentMsg(newV,oldV){
            console.log(newV,oldV);
            //三秒后控制台会输出
            //'3秒后出现的某个值','test'
        }
    }
}
</script>

```

## .sycn 修饰符

``` vue
<!-- children.vue -->
<template>
    <h1>{{ msg }}</h1>
</template>
<script>

export default{
    props: {
        msg: String
    },
    mounted() {
    //这里模拟异步将msg传到父组件v-model，实现双向控制
        setTimeout(()=>{
            let some = '3秒后出现的某个值';//子组件自己的某个值
            this.$emit('update:msg',some);
            //将这个值通过 emit
            //update为固定字段，通过冒号连接双向绑定的msg，将some传递给父组件的v-model绑定的变量
        }, 3000);
    }
}
</script>

```

``` vue
<!-- parent.vue -->
<template>
    <children :msg.sync="parentMsg"></children>
    <!-- 此处只需在平时常用的单向传值上加上.sync修饰符 -->
</template>
<script>
import children from 'xx';
export default{
    components: {
        children
    },
    data(){
        return{
            parentMsg:'test'
        }
    },
    watch:{
        parentMsg(newV,oldV){
            console.log(newV,oldV);
            //三秒后控制台会输出
            //'3秒后出现的某个值','test'
        }
    }
}
</script>

```

## vue3 中

.sycn 这种方式被废弃

替换为 v-model: ;

子组件触发 还是要通过 `$emit('update:',)`