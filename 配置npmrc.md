只考虑 Windows 的话，最简单稳定方案如下。

---

# 1. 设置 Windows 环境变量（一次即可）

打开 CMD 执行：

```cmd
setx NODE_AUTH_TOKEN "npm_xxxxxxxxx"
```

打开PowerShell：

```powershell
[System.Environment]::SetEnvironmentVariable(
  "NODE_AUTH_TOKEN",
  "你的_npm_token",
  "User"
)
```

执行完后：

```txt
关闭当前终端
重新打开 CMD / PowerShell / VSCode
```

因为：

```txt
setx 不会更新当前窗口
```

---

---

# 2. 验证是否成功

CMD：

```cmd
echo %NODE_AUTH_TOKEN%
```

PowerShell：

```powershell
echo $env:NODE_AUTH_TOKEN
```

如果能输出 token，就配置成功。

---

# 3. 配置用户 `.npmrc`

文件位置：

```txt
C:\Users\你的用户名\.npmrc
```

内容：

```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
```

---

# 4. package.json

你只需要：

```json
{
  "scripts": {
    "release": "changeset publish"
  }
}
```

---

# 4. 发布

直接：

```cmd
pnpm release
```

或者：

```cmd
pnpm changeset publish
```

即可。

# 5. 你的最终结构

## Windows 环境变量

```txt
NODE_AUTH_TOKEN=npm_xxx
```

---

## `C:\Users\你\.npmrc`

```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
```

---

## package.json

```json
{
  "scripts": {
    "release": "changeset publish"
  }
}
```

---
