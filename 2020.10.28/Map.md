
#  Map

Map 是一个类对象；

Object是键值对的集合（Hash结构），但是传统上的之恩用字符串当作键。

Map数据结构。他类似Object 也是键值对的集合。但“键”的范围不限于字符串。各种类型的值（包括对象）都可以当作键。也就是说。Map结构提供了一种`值-值`的对应，

``` js
const m = new Map();
const o = {p: 'p'};

m.set(o, 'content');
m.get(o);   // 'content'

m.has(o);   //true
m.delete(o) //true
m.has(o)    //false

```

作为构造函数，Map也可以接受一个数组作为参数。改数组的成员是一个个表示键值对的数组。

``` js
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);

map.size    //2
map.has('name') //true

map.get('name') //'张三'

map.has('title')   // true

```

`Map`构造函数接受数组作为参数，实际上执行的是下面的算法。

``` js
const items = [
    ['name', '张三'],
    ['title', 'Author']
];

const map = new Map();

items.forEach(
    ([key, value]) => map.set(key, value)
)
```

键为引用类型时，只有内存地址相同时。才会视为同一个键。
否则为两个键。


## 方法和属性

1. map.size  Map结构的成员总和

2. Map.prototype.set(key, value) 可以为链式结构

3. Map.prototype.get(key)

4. Map.prototype.has(key) 没有undefined

5. Map.prototype.delete(key) 成功为true

6. Map.prototype.clear()  `clear`方法清除所有成员

7. Map.prototype.keys() 键的集合 //类数组

8. Map.prototype.values() 值得集合

9. Map.prototype.entries() 

``` js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

map[Symbol.iterator] === map.entries

```

``` js
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});

const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);

```
forEach有两个参数


Map 转化为 JSON 时

要小心

``` js
function mapToArrayJson(map) {
  return JSON.stringify([...map]);
}

let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
mapToArrayJson(myMap)
// '[[true,7],[{"foo":3},["abc"]]]'
```