## 环境

* 启动数据库服务`mongod --dbpath "D:\mongo\data"`
* 项目启动：`npm start`
* 使用 Robo3T 可视化工具操作数据库
* 使用 Postman 测试接口


## 接口文档

* POST /user/regist 注册
* POST /user/login  登录
* GET /user/getAllUsers  获取所有用户

* POST /upload/img  图片上传

* POST /article/create 创建与编辑


#### 一、JD接口文档

登录：/user/login
    入参: username, password
    方法: POST

注册：/user/regist
    入参: username, password, password2
    方法: POST


添加商品：/jd/addGood
    方法：POST
    入参：
        img: String,   // 图片
        name: String,  // 商品名称
        desc: String,  // 商品描述
        price: Number, // 价格
        cate: String,  // 品类
        hot: Boolean,  // 是否推荐

获取首页推荐商品：/jd/getHotGoodList
    方法：GET
    入参：
        hot: Boolean  必填, 传true时返回热销推荐的产品，如果不传或false就返回所有商品
        page: Number  必填，用于实现分页功能
        size: Number  非必填

获取全部品类：/jd/getAllCates
    方法：GET
    入参：无

基于品类进行筛选：/jd/getCateGoodList
    方法：GET
    入参：
        cate: String  品类的英文字段

获取商品详情：/jd/getGoodDetail
    方法：GET
    入参：
        good_id: String  商品id



添加到购物车：/jd/addToCart
    方法：POST
    入参：
        num: Number      选填，购买数量
        good_id: String  商品id

获取购物车列表：/jd/getCartList
    方法：GET
    入参：无

更改购物车中的商品数量：/jd/updateCartNum
    方法：POST
    入参：
        num: Number     新的数量
        id: String      购物车id

删除购物车中的商品：/jd/deleteToCart
    方法：GET
    入参：
        id: String      购物车id

提交购物：/jd/submitToCart
    方法：POST
    入参：
        goods: String  商品id字符串，多个商品id要用英式;进行连接。

