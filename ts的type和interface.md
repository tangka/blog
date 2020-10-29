
`type 只是一个类型别名，并不会产生类型`。所以其实 type 和 interface 其实不是同一个概念;

## interface 

1. 语法不同 
2. 可以用于基础的数据类型

``` ts
// primitive
type Name = string;

// object
type PartialPointX = { y: number };
type PartialPointY = { X: number };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple 元组
type Tuple = [number, string];

// dom 


```

type 不能被实现联合类型 implements

3. type 能使用 in 关键字生成映射类型

``` ts
type Keys = "firstname" | "username"

type DudeType = {
  [key in Keys]: string
}

const test: DudeType = {
  firstname: "Pawel",
  username: "Grzybek"
}
```
interface 和 type 很像，很多场景，两者都能使用。但也有细微的差别：
- 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
- 同名合并：interface 支持，type 不支持。
- 计算属性：type 支持, interface 不支持。总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。是一对互帮互助的好兄弟。