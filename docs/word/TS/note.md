# TypeScript

类型静态检查：
在代码执行之前，发现代码的错误或者不合理的地方，减少运行时异常出现的几率，其核心就是**静态类型检查**，简而言之就是把**运行时错误前置**

## 命名行编译

全局安装TypeScript `npm i typescript -g`

使用命令编译 `tsc demo.ts`

## 自动化编译

第一步：创建一个TS编译控制文件

```
tsc --init
```

> 此时工程会生成一个tsconfig.json配置文件，其中包含了很多编译时的配置
>
> 其默认JS编译版本是ES7，可以手动更改为其他版本

第二步：监视目录中的`.ts`文件变化

```
tsc --watch
```

第三步：小优化，当编译出现错误时不生成`.js`文件

```
tsc --noEmitOnError --watch
```

> 备注：当然也可以通过修该tsconfig.json中的noEmitOnError配置（把对应配置项解开即可）

## 类型声明

```ts
// 限制函数参数和返回值类型
function count(x:number,y:number):number{
    return x+y
}
// 多传或者少传都不行
count(1)
count(2,3)
count(1,2,4)
```

### 字面量类型

实际开发很少用

```ts
let a:'你好' // a的值只能为字符串‘你好’
let b:100 //b的值只能为数字100

a='欢迎' // 警告：不能将类型‘欢迎’分配给类型‘你好’
b=233 // ...
```

### 类型推断

TS会根据代码，进行类型推导，例如：

```ts
let d = 99
d = true // error
```

> 注意：类型推断不是万能的，复杂类型推断容易出问题，尽量还是明确类型声明！

## 类型总览

| JavaScript数据类型                          |
| ------------------------------------------- |
| string                                      |
| number                                      |
| boolean                                     |
| null                                        |
| undefined                                   |
| bigint                                      |
| symbol                                      |
| object (包含Array，function，Date，Error等) |

| Typescript数据类型 |
| ------------------ |
| 所有JavaScript类型 |
| any                |
| unknown            |
| never              |
| void               |
| tuple              |
| enum               |
| 自定义类型         |
| type               |
| interface          |

### 大与小

```ts
String - string
```

不能将类型`String`分配给类型`string`

`string`是基元，但是`String`是**包装对象**，如有可能首选使用`string`

**基本字符串**

**字符串包装对象**

```ts
let str1:string // 官方推荐写法
str1 = new String('Hellow') // Error

let str2:String 
str2 = new String('Hello')// 既可以写字符串原始类型，也可以写包装对象
```

**总结：**`String`对内存不友好，根本没有必要写包装对象，就是**闲得慌**

```ts
// 这种写法完全没有必要!!!
let n = new Number(0)
console.log(n.valueOf)
```

**注意点**：在JavaScript中的这些内置构造函数：Number,String,Boolean,它们用于创建对应的包装对象，在日常开发时**很少使用**，在TS中也是同理，所以在TS中进行类型声明的时候，通常都是小写的number，string，boolean

**了解包装对象**：

**原始类型**：如number，string，在JavaScript中简单的数据类型，它们在内存中占用空间少，处理速度快

**包装对象**：如Number，String，时复杂类型，在内存中占用更多空间，在日常开发中很少由开发人员自己创建包装对象

**自动装箱**：JavaScript在必要时会自动将**原始类型包装成对象**，以便调用**方法或属性**

```js
// 原始类型字符串
let str = 'hello';

// 当访问str.length时，JavaScript引擎做了以下工作：
let size = (function() {
  // 1. 自动装箱：创建一个临时的String对象包装原始字符串
  let tempStringObject = new String(str);

  // 2. 访问String对象的length属性
  let lengthValue = tempStringObject.length;

  // 3. 销毁临时对象，返回长度值
  // （JavaScript引擎自动处理对象销毁，开发者无感知）
  return lengthValue;
})();

console.log(size); // 输出: 5
```

## 常用类型

### any

TypeScript=JavaScript  ???

`any`和含义是：任意类型，一旦将变量类型设置为any，那就意味着**放弃了**对该变量的类型检查

**注意点：**`any`类型的变量，可以赋值给**任意类型的变量**，即会**破坏其他类型**

### unknown

unknown的含义是：**未知类型**

可以理解为一个类型安全的any，**不会破坏其他类型**(不可以赋值给其他类型)，适用于：不确定数据的具体类型 

unknown会强制开发者在使用之前进行类型检查，从而提供更强的类型检查

```ts
let a:unknown
a = 'hello'
let x:string

x = a // error

//解决方案
//第一种
if(typeof a === 'string'){
    x = a
}
//第二种(断言)
x = a as string
//第三种(断言)
x = <string>a
```

读取any类型数据的任何属性都不会报错，而unknown正好相反

```ts
let a:any='hello'
a.toUpperCase() // 无警告

let a:unknown='hello'
a.toUpperCase() // 警告,a的类型为未知
(a as string).toUpperCase() // 解决方案
```

### never

never的含义是：任何值都不是，简而言之就是**不能有值**，undefined,null,'',0都不行！

几乎不用never去限制变量，因为没有意义

作用：用于限制函数返回类型的

```ts
// 限制throwError函数不需要有任何返回值，任何值都不行，像undeifned、null都不行
function demo():never{
    throw new Error('程序运行异常！')
}
//函数只有两种结果
// 1.不能够顺利的调用结束,如果一个js顺利调用了函数，必然会返回一个undefined
// 2. 函数抛出错误
//说白了就是不能结束或者不能正常结束
```

never一般是TS主动推断出来的

```ts
// 指定a的类型为string
let a: string
// 给a设置一个值
a = 'hello'

if (typeof a === 'string') {
  console.log(a.toUpperCase())
} else {
  console.log(a) // TypeScript会推断出此处的a是never，因为没有任何一个值符合此处的逻辑
}
```

### void

`void`的含义是空，即：函数不返回任何值，调用者也不应依赖其返回值进行**任何操作**！

`void`通常用于函数返回值声明

```ts
function logMessage(msg:string):void{
  console.log(msg)
}
logMessage('你好')
```

**注意：**编码者没有编写`return`指定函数返回值，所以`logMessage`函数是没有**显式返回值**的，但会有一个**隐式返回值** ，是`undefined`，虽然函数返回类型为`void`，但也是可以接受`undefined`的，简单记：`undefined`**是**`void`**可以接受的一种空。**



以下写法均符合规范:

```ts
// 无警告
function logMessage(msg:string):void{
  console.log(msg)
}

// 无警告
function logMessage(msg:string):void{
  console.log(msg)
  return;
}

// 无警告
function logMessage(msg:string):void{
  console.log(msg)
  return undefined
}
```

**返回值类型为**`void`**的函数，调用者不应该依赖其返回值进行任何操作！**!!!!!!

<div style="color: red;font-weight: bold;text-decoration: underline;">不应该依赖其返回值进行任何操作！</div>

```ts
function logMessage(msg:string):void{
  console.log(msg)
}

let result = logMessage('你好')

if(result){ // 此行报错：无法测试 "void" 类型的表达式的真实性
  console.log('logMessage有返回值')
}

//-----------------------------------------
function logMessage(msg:string):undefined{
  console.log(msg)
}

let result = logMessage('你好')

if(result){ // 此行无警告
  console.log('logMessage有返回值')
}
```

**理解 void 与 undefined**

- `void`是一个广泛的概念，用来表达“空”，而 `undefined` 则是这种“空”的具体实现。
- 因此可以说 `undefined`是`void`能接受的一种“空”的状态。
- 也可以理解为：`void`包含`undefined`，但`void`所表达的语义超越了`undefined`，`void`是一种意图上的约定，而不仅仅是特定值的限制。  

**总结：**

如果一个函数返回类型为`void`，那么：

1. **从语法上讲**：函数是可以返回`undefined`的，至于显式返回，还是隐式返回，这无所谓！
2. **从语义上讲**：函数调用者不应关心函数返回的值，也不应依赖返回值进行任何操作！即使我们知道它返回了`undefined`。

### object

关于`object`与`Object`，直接说结论：实际开发中用的相对较少，因为范围太大了。

#### object（小写）

`object`（小写）的含义是：所有**非原始类型**，可存储：对象、函数、数组等，由于限制的范围**比较宽泛**，在实际开发中使用的**相对较少**。

```ts
let a:object //a的值可以是任何【非原始类型】，包括：对象、函数、数组等

// 以下代码，是将【非原始类型】赋给a，所以均符合要求
a = {}
a = {name:'张三'}
a = [1,3,5,7,9]
a = function(){}
a = new String('123')
class Person {}
a = new Person()

// 以下代码，是将【原始类型】赋给a，有警告
a = 1         // 警告：不能将类型“number”分配给类型“object”
a = true      // 警告：不能将类型“boolean”分配给类型“object”
a = '你好'    // 警告：不能将类型“string”分配给类型“object” 
a = null      // 警告：不能将类型“null”分配给类型“object”
a = undefined // 警告：不能将类型“undefined”分配给类型“object”
```

#### Object（大写）

官方描述：所有可以调用Object方法的类型

简单回忆：除了undefined和null的任何值

由于限制的范围实在**太大了**！！！所以实际开发使用**频率极低**

```ts
let b:Object //b的值必须是Object的实例对象（除去undefined和null的任何值）

// 以下代码，均无警告，因为给a赋的值，都是Object的实例对象
b = {}
b = {name:'张三'}
b = [1,3,5,7,9]
b = function(){}
b = new String('123')
class Person {}
b = new Person()
b = 1  			// 1不是Object的实例对象，但其包装对象是Object的实例
b = true  	// truue不是Object的实例对象，但其包装对象是Object的实例
b = '你好'	// “你好”不是Object的实例对象，但其包装对象是Object的实例

// 以下代码均有警告
b = null      // 警告：不能将类型“null”分配给类型“Object”
b = undefined // 警告：不能将类型“undefined”分配给类型“Object”
```

#### 声明对象类型

实际开发中，限制一般对象，通常有以下集中形式：

```ts
// 限制person1对象必须有name属性，age为可选属性
let person1: { name: string, age?: number }

// 含义同上，也能用分号做分隔
let person2: { name: string; age?: number }

// 含义同上，也能用换行做分隔
let person3: {
  name: string
  age?: number
}

// 如下赋值均可以
person1 = {name:'李四',age:18}
person2 = {name:'张三'}
person3 = {name:'王五'}

// 如下赋值不合法，因为person3的类型限制中，没有对gender属性的说明
person3 = {name:'王五',gender:'男'}
```

#### 索引签名：

允许定义对象可以具有**任意数量的属性**，这些属性的**键**和**类型**是可变的，常用于：

描述类型不确定的属性，（具有动态属性的对象）

 <div style="color: green;font-weight: bold;text-decoration: underline;">限制person对象必须有name属性，可选age属性但值必须是数字，同时可以有任意数量、任意类型的其他属性</div>

```ts
let person: {
  name: string
  age?: number
  [key: string]: any // 索引签名，完全可以不用key这个单词，换成其他的也可以
}

// 赋值合法
person = {
  name:'张三',
  age:18,
  gender:'男' 
}
```

#### 声明函数类型

```ts
let count: (a: number, b: number) => number

count = function (x, y) {
  return x + y 
}
```

备注：

- typescript中的`=>`在函数类型声明时表示**函数类型**，描述其参数类型和**返回类型**
- JavaScript中的`=>`是一种定义函数的语法，是具体的函数的实现，箭头函数
- 函数类型声明还可以使用：**接口，自定义类型**等方式。

#### 声明数组类型

```ts
let arr1: string[] 
let arr2: Array<string>

arr1 = ['a','b','c']
arr2 = ['hello','world']
```

**备注：**上述代码中的`Array<string>`属于泛型

注意：小写变量类型只针对**string,number,boolean**，Array及其他还是大写

### tuple

元组（tuple）是一种特殊的**数组类型，**可以存储**固定数量**的元素，并且每个元素的**类型是已知**的且**可以不同**，元组用于精确描述一组值的类型，`?`表示可选元素

```ts
// 第一个元素必须是 string 类型，第二个元素必须是 number 类型。
let arr1: [string,number]
```

```ts
// 第一个元素必须是 number 类型，第二个元素是可选的，如果存在，必须是 boolean 类型。
let arr2: [number,boolean?]
```

```ts
// 第一个元素必须是 number 类型，后面的元素可以是任意数量的 string 类型
let arr3: [number,...string[]]
```

```ts
// 可以赋值
arr1 = ['hello',123]
arr2 = [100,false]
arr2 = [200]
arr3 = [100,'hello','world']
arr3 = [100]

// 不可以赋值，arr1声明时是两个元素，赋值的是三个
arr1 = ['hello',123,false]
```

### enum

枚举（enum）可以定义**一组命名常量**，它能增强代码的**可读性**，也让代码**更好维护**

如下代码的功能是：根据调用`walk`时传入的不同参数，执行不同的逻辑，存在的问题是调用`walk`时传参时**没有任何提示**，编码者很容易写错字符串内容；并且用于判断逻辑的`up`、`down`、`left`、`right`是**连续且相关的一组值**，那此时就特别适合使用 枚举enum