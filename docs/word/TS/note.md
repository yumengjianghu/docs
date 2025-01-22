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