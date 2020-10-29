
// 类型别名

// type 会给一个类型起个新名字。 type 有时和 interface 很像，但是可以作用于原始值（基本类型），联合类型，元组以及其它任何你需要手写的类型。

//  对象
type Users = {
    name: string;
    age: number;
}

//  函数
type SetUsers = (name: string, age: number) => void;

//  extends

type Names = {
    name: string;
}

//  &
type Namesr = Names & { age: number };

//  基本数据别名
type MyName = string;

//  联合类型
interface Dog {
    wong();
}
interface Cat {
    miao();
}
type Pet = Dog | Cat

// 具体定义数组每个位置的类型
type PetList = [Dog, Pet]

// 当你想获取一个变量的类型时，使用 typeof
let div = document.createElement('div');
type B = typeof div

type StringOrNumber = string | number;  
type Texts = string | { text: string };  
// type NameLookup = Dictionary<string, Person>;  
type Callback<T> = (data: T) => void;  
type Pair<T> = [T, T];  
type Coordinatesss = Pair<number>;  
type Tree<T> = T | { left: Tree<T>, right: Tree<T> };

type Namev = string; // 基本类型
type NameFun = () => string; // 函数
type NameOrRFun = Namev | NameFun; // 联合类型
function getName(n: NameOrRFun): Namev {   
    if (typeof n === 'string') {
        return n;
    } 
    return n();
}

//同接口一样，类型别名也可以是泛型 - 我们可以添加类型参数并且在别名声明的右侧传入
type Container<T> = { value: T };

type TreeNode<T> = {
    value: T;
    left: TreeNode<T>;    right: TreeNode<T>;
}

// 交叉类型
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
    name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;

