# meetingRoom-system-backend

> 校园会议室管理系统,采用node.js的Express框架搭建,采用MySQL数据库存储数据

## 目录结构
- bin ——www：用来开启服务器的脚本 
- config： 数据库配置
- modules: 各个模块的后端逻辑处理（接收请求参数、返回响应内容）
- node_modules:依赖包 
- public:（暂不使用）
- routes：各个模块的路由链接，通过next给modules里逻辑处理


  —— index.js: 进行路由拦截并校验token的有效性
- tool:工具函数

  —— json.js: 处理后端接口返回的参数形式
  
  —— keyValue.js:键值对

  —— method.js: 公共函数（时间处理函数）

  —— pool.js:创建连接池

  —— poolextend.js:通过数据库参数配置数据库

  —— sql.js:项目中数据库查询语句

- views 

   ——index.ejs：主页的模板文件 

   ——error.ejs：主页的模板文件 
- .gitignore  git创建仓库时忽略的文件
- app.js：项目入口文件
- package.json: 项目包管理文件
- README.md: 项目说明文件

## 环境准备
node（版本不限）

## 部署

1、完成数据库配置

- 根目录下config/mysql.js文件填写数据库联接配置

2、安装依赖
- npm config set registry https://registry.npm.taobao.org
- npm install

3、开放端口
- 代码默认3000

4、运行命令
- npm run start
- 执行命令后，通过端口3000即可访问

5、以下为docker部署的Dockerfile文件内容，可供参考

```bash
FROM node:10

# 指定工作目录
WORKDIR /data/js

# 将 package.json 拷贝到工作目录
COPY package.json .

# 安装 npm 依赖
RUN npm config set registry https://registry.npm.taobao.org && npm install

# 拷贝源代码
COPY . .

# 开放 3000 端口
EXPOSE 3000

# 设置镜像运行命令
ENTRYPOINT ["npm", "run"]
CMD ["start"]
```

## 数据库
- 参见数据库文档






