# 项目创建

```
# 全局安装脚手加
cnpm install express-generator -g
# 使用ejs模板引擎来创建node项目
express --view=ejs node-fullapi
cd node-fullapi
cnpm install
npm start
```
默认运行：http://localhost:3000

# MVC
M   V   VM   前后端分离
M   V   C  前后端不分离(数据+视图，发生在后端)

改端口，在 /bin/www 文件中

# 数据库连接

cnpm install mongoose -S
创建数据库连接，参考 /model/connect.js文件
NPM仓库文档：https://www.npmjs.com/package/mongoose
中文文档：http://mongoosejs.net/docs/index.html
