#特性
1. 通过hessian协议调用dubbo服务，同时使用zookeeper client来订阅服务通知
2. 调用java服务时，自动修正方法参数类型和类的属性。
3. 使用Promise模式

# 安装
`npm install dubbo-hessian --save`


# 使用
1. 安装JDK，配置环境变量,确保javap命令正常使用
2. 在项目根目录创建文件夹 ： interface，将希望调用的java 接口class复制到 interface/service 目录,将涉及到的实体类class复制到 interface/domain
3. 在项目入口文件中，初始化dubbo:
``` javascript
var dubbo = require("dubbo-hessian");
dubbo.init("zookeeper服务地址");
```
4. 项目中任意文件中,直接调用:
``` javascript
var dubbo = require("dubbo-hessian");
dubbo.接口名.方法名(参数1,参数2..).then(function(data){

}).catch(function(data){

});
```
注：接口名首字母大写,即与java 接口class的文件名一致