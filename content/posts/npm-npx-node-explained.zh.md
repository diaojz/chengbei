# npm、npx、Node.js 到底是什么？把终端里那些相似命令一次讲清

刚开始跟着 AI 写代码，最容易遇到的障碍，往往是一串看起来差不多的命令。

上一句是 `npm install`，下一句变成 `npx create-vite`，接着又是 `npm run dev`。教程还让你安装 Node.js、提交 lock 文件，却提醒你别提交 node_modules。

它们都跟 JavaScript 项目有关，但各自负责不同的事。理解这些分工后，你就能看懂 AI 准备做什么，也更容易找到报错发生在哪一步。

> 本文于 2026-10-19 核对 Node.js 官方资料及 npm CLI v11 文档。命令选项、下载确认和安装脚本策略可能随版本变化；示例用于解释行为，不代表已经在你的电脑上执行。

## 一、先认识这几位：谁负责运行，谁负责安装

| 名称 | 负责什么 | 可以怎样理解 |
|---|---|---|
| JavaScript | 编程语言 | 写程序使用的语言 |
| Node.js | 在浏览器之外运行 JavaScript 的运行时 | 执行程序的环境 |
| npm | 管理依赖、运行脚本、发布包的命令行工具，也对应 npm 包生态与服务 | 项目的工具管理员 |
| npx | 执行 npm 包提供的命令；现代版本基于 `npm exec` | 找到一个工具并运行 |
| npm registry | 保存和分发包的注册表服务 | 下载包的来源 |

浏览器能运行 JavaScript，Node.js 也能，但它们提供的环境不同。浏览器有网页 DOM，Node.js 则能提供文件系统等能力。安装 Node.js，并不等于安装了一个浏览器。

常见的 Node.js 安装方式通常会一起提供 npm 和 npx；具体取决于安装渠道。可以用下面三条命令检查当前终端能找到什么：

```bash
node --version
npm --version
npx --version
```

这是三个命令的版本，不要求版本号一致。若提示 `command not found`，先检查安装与 PATH，也就是终端寻找可执行程序的路径，别急着修改项目源码。

## 二、包、依赖、命令：为什么名字不一定一样

**包（package）** 是发布和安装的单位。项目需要某个包，就把它列为 **依赖（dependency）**。

包里可以有供程序调用的代码，也可以提供终端命令，还可以两者都有。

例如：

- `lodash` 常用于代码中的数据处理，不意味着安装后就有一个日常可用的 `lodash` 终端命令。
- `typescript` 是包名，它提供的编译命令叫 `tsc`。
- `vite` 既是包名，也提供同名命令。

所以，“装了一个包”和“得到一个同名命令”不能画等号。包通过 `package.json` 的 `bin` 字段声明可执行入口。

这也是下面这条命令容易写错的原因：

```bash
npx --package typescript tsc --version
```

这里的意思是：“使用 `typescript` 这个包提供的环境，执行 `tsc --version`。”不要因为命令叫 `tsc`，就随手把 `npx tsc` 当成指定 TypeScript 包的等价写法；npm 上的同名包不一定是你想要的工具。

## 三、npm install、npm run、npx：三种动作

### 1. npm install：把依赖准备好

在已有项目目录执行：

```bash
npm install
```

npm 会结合 `package.json` 和已有 lock 文件解析并安装依赖。lock 文件与声明相符时可以使用锁定版本；不相符时，`npm install` 可能更新 lock 文件。

如果要给项目添加包，则指定包名：

```bash
npm install lodash
npm install -D typescript
```

普通安装默认保存为 `dependencies`；`-D` 是 `--save-dev`，保存为 `devDependencies`，常用于构建、检查、测试等开发工具。

这里有个容易误会的地方：**devDependency 不等于“部署时绝对用不到”。** 如果服务器要现场构建前端，构建步骤仍可能需要 Vite 或 TypeScript。关键是部署流程在哪里构建、运行时需要什么。

### 2. npm run：执行这个项目定义的脚本

假设 `package.json` 里写着：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

那么：

```bash
npm run dev
npm run build
npm run preview
```

分别执行对应的脚本。`dev`、`build`、`preview` 是项目作者起的名字，含义要看实际内容。

**不是每个项目都有 `npm run dev`，也不是每个 build 都在做同一件事。** 不带脚本名运行 `npm run`，可以查看当前项目列出的脚本。

npm 运行脚本时会把本地工具目录 `node_modules/.bin` 加入命令搜索路径。因此脚本里直接写 `vite`，通常就能找到项目安装的 Vite，无需全局安装。

给脚本传参数时，常见写法是：

```bash
npm run dev -- --port 5173
```

前面的 `--` 用来把后续参数交给脚本中的命令。这里传给的是 Vite；它是否支持该选项，要查工具本身的说明。

### 3. npx：找到工具并执行

```bash
npx create-vite@latest
```

这类写法适合运行项目生成器，或偶尔使用的命令行工具。

现代 npx 基于 `npm exec`。请求的包如果能匹配项目已有依赖，就可以使用本地版本；如果本地没有匹配的包，则可能下载到 npm 缓存目录，再把工具加入此次执行环境。

**npx 并不是“什么都不安装”，而是通常不把临时工具加入你的项目依赖或全局安装目录。** 缓存也不等于运行后立即删除，下次可能复用。

需要下载时，交互终端通常会询问；选项、非交互环境和版本会影响确认行为。`-y` / `--yes` 可以跳过下载确认，但它不会让包变得更可信。

下面两种命令的目的相近：

```bash
npx eslint .
npm exec -- eslint .
```

它们的参数解析有区别，不能对复杂命令只做机械替换。需要明确指定包和命令时，可以这样写：

```bash
npm exec --package typescript -- tsc --version
```

还要注意：`@latest` 是包发布者维护的 dist-tag，表示该标签当前指向的版本。它方便尝鲜，但下个月运行可能得到不同版本。正式协作时，应结合明确版本、项目依赖和 lock 文件管理工具版本。

## 四、三个文件和目录：清单、安装结果、版本记录

打开一个常见的 npm 项目，你会看到：

```text
my-project/
├── package.json
├── package-lock.json
└── node_modules/
```

| 文件或目录 | 保存什么 | 一般是否提交 Git |
|---|---|---|
| `package.json` | 项目元信息、脚本、依赖与版本要求 | 是 |
| `package-lock.json` | 解析后的依赖树、具体版本及相关元数据 | npm 项目通常提交 |
| `node_modules/` | 安装后实际使用的依赖文件 | 通常不提交 |

例如，`package.json` 可以声明一个允许更新的版本范围，lock 文件记录当前解析出的具体结果。

有了 lock 文件，团队和部署环境就更容易安装一致的依赖。不过，**依赖树一致也不等于整个运行环境完全相同**：Node.js 版本、操作系统、CPU 架构、安装选项和外部服务依然可能影响结果。

这也解释了为什么 `node_modules` 通常不进 Git：依赖应通过声明和 lock 文件重建，不需要把整个安装目录搬进仓库。

## 五、npm install 和 npm ci：什么时候选哪个

开发中新增依赖，用 `npm install` 很自然。部署和持续集成中，更常见的是：

```bash
npm ci
```

它要求已有 `package-lock.json` 或 npm 支持的 shrinkwrap 文件，并且与 `package.json` 的依赖声明一致；不一致时会报错，而不是帮你改好。

它还会先移除已有 `node_modules`，再进行干净安装，并且不会改写 `package.json` 或 lock 文件。

| 你的目的 | 通常选什么 |
|---|---|
| 第一次准备一个尚未生成 lock 的项目 | `npm install` |
| 添加或调整项目依赖 | `npm install 包名` |
| 根据已提交 lock 做干净安装 | `npm ci` |
| lock 与声明不一致，正在处理依赖变更 | 查明原因，用 `npm install` 更新并评审差异 |

如果生成 lock 时使用了影响依赖树的选项，`npm ci` 也需要兼容的配置。不要把 CI 失败后的第一反应变成“删除 lock 再试”；那可能顺带改变大量依赖版本。

## 六、全局、本地、临时执行：选谁才合适

```bash
# 安装到当前项目，作为开发依赖
npm install -D typescript

# 全局安装，安装位置由 npm 配置决定
npm install -g typescript

# 为这次命令找到并使用 TypeScript 包
npx --package typescript tsc --version
```

全局安装的工具适合个人经常使用的 CLI，但“全局”不等于整台电脑所有用户、所有 Node.js 环境共用同一份。换一个 Node.js 安装或版本管理环境，工具位置与可见性可能变化；安装了也可能因为 PATH 没配好而找不到。

对于项目构建工具，优先使用项目本地依赖和脚本，方便团队共享版本。对于一次性的项目生成器，npx 很方便。对于每天都用的个人工具，再考虑全局安装。

你还会见到 pnpm、Yarn、Bun。pnpm 和 Yarn 也能管理 JavaScript 依赖、运行脚本；Bun 同时提供运行时、包管理器等工具。它们有相似功能，但版本、选项和 lock 格式各有差异。

**进入已有项目时，先看 README、`package.json` 中的 `packageManager` 字段（若存在），以及 lock 文件。** 看到 `pnpm-lock.yaml` 或 `yarn.lock`，先按项目约定操作，不要立刻运行 npm 并额外生成第二种 lock 文件。多个 lock 并存时，查清项目真正使用的工具。

## 七、把一个项目从零跑起来，命令就串起来了

下面是一个 Vite 项目示例，假设你愿意下载并执行官方 `create-vite` 工具；具体交互和 Node.js 要求以当前工具为准：

```bash
# 生成项目文件，选择框架和模板
npx create-vite@latest my-demo

# 进入生成的项目目录
cd my-demo

# 如果生成器尚未安装依赖，再执行这一步
npm install

# 启动开发服务
npm run dev
```

第一步运行生成器；第二步切换目录；第三步准备依赖；第四步执行项目脚本。它们做的是四件事。

生成器可能询问是否立即安装或启动，如果已经完成，就不必机械重复。开发服务启动后，打开终端实际输出的地址；端口被占用时，工具可能选择其他端口。

准备生产发布时，通常先执行 `npm run build`，再部署生成的文件。`npm run preview` 在这个示例里用于本地预览构建结果，**不代表网站已经上线**，也不应直接当作生产服务方案。

最后，把常见报错放回对应环节：

| 现象 | 先检查什么 |
|---|---|
| `node` / `npm` 找不到 | 安装、当前 shell 与 PATH |
| 找不到 `package.json` | 是否进入了正确的项目目录 |
| `Missing script: dev` | `package.json` 是否真的定义了 `dev` |
| 安装依赖时失败 | 日志里的 registry、网络、版本与依赖冲突信息 |
| `npm ci` 提示 lock 不一致 | 声明与 lock 是否同步，安装配置是否一致 |
| `npx` 不能确定要运行哪个命令 | 包是否提供可执行入口，包名与命令名是否不同 |

看懂命令的用途后，再让 AI 排障，问题描述就会具体得多：“依赖还没安装成功”，和“依赖已安装，但 dev 脚本启动失败”，需要检查的东西并不相同。

## 官方资料

- [Node.js 与浏览器的区别](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)
- [npm exec / npx：本地匹配、缓存安装与参数区别](https://docs.npmjs.com/cli/v11/commands/npm-exec)
- [npm install：安装与保存依赖](https://docs.npmjs.com/cli/v11/commands/npm-install)
- [npm run：运行项目脚本](https://docs.npmjs.com/cli/v11/commands/npm-run)
- [npm ci：基于 lock 的干净安装](https://docs.npmjs.com/cli/v11/commands/npm-ci)
- [package.json：scripts、bin 与依赖声明](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- [package-lock.json：记录实际依赖树](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json)
