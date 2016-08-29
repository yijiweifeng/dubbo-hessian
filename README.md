#特性
1. 通过hessian协议调用dubbo服务，同时使用zookeeper client来订阅服务通知，注冊消費者
2. 通过读取java.class来初始化接口、方法、实体类,调用java服务时，自动修正方法参数类型和类的属性。
3. 使用Promise模式
4. zookeeper发生变化时，自动通知客户端并触发对应的事件

# 安装
`npm install dubbo-client-zookeeper-hessian --save`


# 使用前提
1. 安装JDK，配置环境变量,确保javap命令正常使用;
2. 在项目根目录创建文件夹 ： interface，将希望调用的java 接口class复制到 interface/service 目录,将涉及到的实体类class复制到 interface/domain


# 如何试用
## 初始化

``` javascript

 let dubbo = require('dubbo-client-zookeeper-hessian');
 /**      初始化参数是json对象，key的含义如下:
   *      name（app标识）,
   *      zk(注册中心地址 ip:port
   *      host 本机IP
   *      dubbo_version(展示到注册中心的消费者dubbo版本,默认2.8.4),
   *      service_version(服务版本,默认为任意版本,不为空时在ZK中心只获取指定版本的服务),
   *      service_group = '_service'(服务分组,默认dubbo,这也是dubbo服务端在不指定分组时的默认分组)
   *      strictString = true(是否过滤所有提交字符串中的script/frame等)
   *      host(固定调用的服务器地址ip,不传表示调用任意地址,例如 10.0.0.1表示只调用10.0.0.1上的服务)
   *      username zk用户名
   *      password zk密码
   *      data 数据处理方法,如果不传则将服务端返回的数据原生不动返回,该方法将接收一个参数，即服务器返回的数据；允许直接throw异常
   */
 dubbo.one(参数);

```

## 调用java方法

```javascript
    //ApplicationService=接口名称,getList=方法名称
    dubbo.service.ApplicationService.getList(1,10).then(data => {
        //接收到的数据
    }).catch(error => {
        //触发的异常
    })
```
## 参数自动修正

hessian协议要求方法的参数必须一致，例如参数定义为int，如果传字符串肯定报错，本工具可以自动修正类型以防错误
```javascript
    //自动将 '1' 修正 为 1
    dubbo.service.ApplicationService.getList('1',10).then(data => {
        //接收到的数据
    }).catch(error => {
        //触发的异常
    })

    //自动将 '1' 修正 为 1
    dubbo.service.PriceService.insert({
        price : '20', //如果定义的实体类属性为int，则自动修正为int，如果定义的类型为Float或者BigDecimal，则自动修正为对应的类型
        name : '第一个价格'
    }).then(data => {
        //接收到的数据
    }).catch(error => {
        //触发的异常
    })
```

## 读取数据
1. Float和BigDecimal从java传过来后,数据变为 {value : 数字}
2. java的Map将转换为js的Map，不能直接对象.属性,而是对象.get('属性')

## 新建一个实体类
可以通过`dubbo.domain.对象名()` 得到一个空的对象，对象的属性都是默认值，例如字符串=一个空的字符串，数字=0

## 事件调用

``` javascript
let dubbo = require('dubbo-client-zookeeper-hessian');
dubbo.on('事件名',() => {

});
```
事件列表
|名称        | 含义   |  参数  |
| --------   | -----:  | :----:  |
|all|接口全部读取完毕同时都已订阅zookeeper时触发|无|
|接口名称|该接口读取完毕并订阅zookeeper时触发|读取到的服务器列表|
|data|接收到服务器数据时触发|json对象，key包含host（服务器地址），className（接口名），methodName（方法名），param（参数），time（耗时），data（数据）|
|error|发生异常时触发|json对象，key包含host（服务器地址），className（接口名），methodName（方法名），param（参数），time（耗时），error（错误）|

## 错误信息
错误信息都是一个json对象，key的含义：
state=错误编码和message=错误消息
内置的错误码：
101006 参数不符
101002 找不到节点
101005 连接失败
101004 服务端异常