
# Symbol

## 概念

1. 在对象中，属性名都是字符串；属性名冲突不会报错，而是会进行直接覆盖；容易`造成冲突`；

2. `Symbol`数据类型很好的解决了对象属性名冲突；

3. `Symbol`表示独一无二的值，它是原始数据类型。 不能用New;

4. 现在js有7种数据类型，`Number(数字)、String、Boolean、null、undefined、Object、Symbol`

## 基本用法

Symbol 函数不能用new命令。因为Symbol 是 原始数据类型，不是对象。可以接受一个字符串作为参数，为新创建的 Symbol 提供描述，用来显示在控制台或者字符串的时候用。  `只是描述`


``` ts
let name = Symbol('name')
console.log(name)   // Symbol(name)
console.log(typeof name)    //  'symbol'
```

### 特点
1. Symbol 函数栈不能用 new, Symbol 为原始数据类型，不是对象；

2. Symbol 是独一无二的。参数只是描述作用；

3. Symbol 不能进行隐式转换；

4. Symbol 可以进行显示转换；

String()    .toString()
5. 不能转数字
直接报错

6. 可以转布尔值 
为true

7. 不能通过 localStorage储存

## 应用场景

1. 作为对象属性名

不能用 . 要用[]

可以用Object.defineProperty

``` ts
let sy = Symbol();

// 写法1

let syObject = {};
syObject[sy] = 'symbol';

// 写法2

syObject = {
    [sy]: 'symbol'
};

// 写法3

Object.defineProperty(syObject, sy, {value: 'symbol'});

```

2. Symbol 值作为属性名，该属性是公有属性。只是不会出现在 for...in,for...of,Object.keys(),Object.getOwnPropertyNames().
如果要读取到一个对象的 Symbol 属性，可以通过Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 取到。

getOwnPropertyNames 迭代 可枚举和不可枚举两种属性

Reflect.ownKeys();
Object.getOwnPropertySymbols() //专门取得 Symbol 类型

``` ts
    let sy = Symbol();
    let syObject = {
        a: 1,
    };
    syObject[sy] = 'symbol';
    console.log(syObject)   // {Symbol(): 'symbol'};

    Object.keys(syObject) // ['a']

    Object.getOwnPropertyNames(syObject) // ['a']

    Reflect.ownKeys(syObject)   //['a',Symbol()]

    Object.getOwnPropertySymbols(syObject)   //['a',Symbol()]
```

## 定义一个常量

能保证此常量不被重复定义

# Symbol的方法

1. Symbol.for()

用于：作用将描述相同的Symbol变量指向同一个Symbol值；

``` js
let a1 = Symbol.for('a');
let a2 = Symbol.for('a');
a1 === a2; // true
typeof a1; // "symbol"
typeof a2; // "symbol"

let a3 = Symbol('a');
a1 === a3 // fasle
```

Symbol()和 Symbol.for() 相同点

    1. 他们定义的值的类型都是“symbol”;

不同点

    1. Symbol()定义的值每次都是新建， 即使描述相同值也不相等；

    2. Symbol.for()定义的值会先检查给定的描述是否已经存在，如果不存在才会新建一个值，并把这个值登记在全局环境中供搜索，Symbol.for()定义相同描述的值时会被搜索到，描述相同则他们就是同一个值。

2. Symbol.keyFor()

作用：用来检测该字符参数作为名称的Symbol值是否已被登记,返回一个已登记的 Symbol 类型值的 key

``` js
let a1 = Symbol.for('a');
Symbol.keyFor(a1);  //'a'

let a2 = Symbol('a');
Symbol.keyFor(a2);  //undefined

```

被Symbol.for()登记过，则会返回该描述字段

否则 `undefined`;

# Symbol的属性

1. Symbol.prototype.description

`description`用于返回Symbol数据的描述

``` js
// Symbol()定义的数据

let a = Symbol('abc');
a.description   //'abc'
Symbol.keyFor(a);   // undefined

//  Symbol.for()定义的数据
let a1 = Symbol('abc');
a1.description   //'abc'
Symbol.keyFor(a1);   // 'abc'

// 未指定描述的数据
let a2 = Symbol();
a2.description  // undefined

```

`description`属性和`Symbol.keyFor()`方法的区别是： `description`能返回所有Symbol类型数据的描述，而`Symbol.keyFor()`只能返回Symbol.for()在全局注册过的描述