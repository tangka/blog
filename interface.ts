
// 一个对象
interface User {
    name: string;
    age: number;
}

//一个函数
interface SetUser {
    (name: string, age: number): void;
}

// extend 拓展
interface Name {
    name: string;
}

interface User extends Name {
    age: number;
}

type Phone = {
    name: string;
}

interface IPhone extends Phone {
    color: string;
}

// 申明合并

interface People {
    name: string;
    age: number;
}

interface People {
    sex: string;
}

// 可选属性
interface Config {
    color?: string;
}

// 只读属性
interface Point {
    readonly x: number;
}

//  任意属性
interface Person {
    name: string;
    age?: number;
    [propName: string]: any;
}

// let p: Person = {
//     name: 'a'
// };

// let c: Person = {
//     a: 's',
//     name: 's',
// }

//  索引类型： 针对数组
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ['bOB'];

// 类 类型接口
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
}

// extends和implements
/* 
extends 是来创建一个类的子类
是继承个类，继承之后可以使用父类的方法。也可以重写父类的方法

implements 实现 是面向对象中的一个重要概念。一般来讲，
一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，
这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现。这个特性大大提高了面向对象的灵活性

*/
