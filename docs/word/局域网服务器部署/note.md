# 局域网服务器部署

## 准备

一个可以运行的Node.js的服务器，例如一下的Express 服务器

```js
// server.js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, this is a Node.js server running on the LAN!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

**运行以下命令启动服务器：**

```js
node server.js
```

**此时，服务器会在 `http://localhost:3000` 上运行，但只能在本地访问。**

## 获取本机的局域网 IP 地址

为了让其他设备访问你的服务器，你需要知道本机在局域网中的 IP 地址。

1. 打开命令提示符（按 `Win + R`，输入 `cmd`，然后按回车）。

2. 输入以下命令：

   ```
   ipconfig
   ```

3. 找到 `IPv4 地址`，通常是 `192.168.x.x` 或 `10.x.x.x`。

## 修改 Node.js 服务器监听地址

默认情况下，Node.js 服务器只监听 `localhost`（即 `127.0.0.1`），这意味着它只能从本机访问。为了让服务器监听局域网中的所有请求，需要将监听地址改为 `0.0.0.0`。

**修改 `server.js` 文件：**

```js
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
```

**重新启动服务器**

## 允许防火墙通过端口

如果你的操作系统启用了防火墙，需要确保防火墙允许外部设备访问服务器的端口（例如 `3000`）。

**在 Windows 上允许端口**

1. 打开“控制面板” -> “系统和安全” -> “Windows Defender 防火墙” -> “高级设置”。
2. 选择“入站规则” -> “新建规则”。
3. 选择“端口”，点击“下一步”。
4. 选择“TCP”，并输入端口号 `3000`，点击“下一步”。
5. 选择“允许连接”，点击“下一步”。
6. 为规则命名（例如 `Node.js Server`），点击“完成”。

## 在局域网中访问服务器

现在，其他设备可以通过你的局域网 IP 地址和端口号访问服务器。

例如，如果你的 IP 地址是 `192.168.1.100`，端口号是 `3000`，其他设备可以在浏览器中访问：

```js
http://192.168.1.100:3000
```

## 使用工具测试局域网访问

你可以使用手机或其他电脑，连接到同一个局域网，然后通过浏览器访问服务器的 IP 地址和端口号，确保服务可以正常访问。