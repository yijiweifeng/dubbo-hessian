/**
 * Created by cc on 16/8/11.
 */
'use strict';
import url from 'url';
import events from 'events';
import fs from 'fs';
import domain from 'domain';
import querystring from 'querystring';


import zookeeper from 'node-zookeeper-client';
import parser from 'java-class-parser-generics';
import hessian from 'hessian-proxy-garbled';

import tool from './toolkit.js';

require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

let str = '', vider = 'providers';
let readDir = tool.P(fs.readdir);
let parser2 = tool.P(parser);

export default class extends events.EventEmitter {
    /**
     * @param json对象，key的含义如下:
     *  name（app标识）,
     *  zk(注册中心地址 ip:port
     *  host 本机IP
     *  dubbo_version(展示到注册中心的消费者dubbo版本,默认2.8.4),
     *  service_version(服务版本,默认为任意版本,不为空时在ZK中心只获取指定版本的服务),
     *  service_group = 'dubbo'(服务分组,默认dubbo,这也是dubbo服务端在不指定分组时的默认分组)
     *  strictString = true(是否过滤所有提交字符串中的script/frame等)
     *  host(固定调用的服务器地址ip,不传表示调用任意地址,例如 10.0.0.1表示只调用10.0.0.1上的服务)
     *  username zk用户名
     *  password zk密码
     */
    constructor({name = 'node-client', zk,host = 'node-host', connectTimeout = 1000, retries = 3, dubbo_version = '2.8.4', service_version = false, service_group = 'dubbo', strictString = true, ip = false, username = '', password = ''} = {}) {
        if (!zk) {
            throw '必须定义zk地址!';
        }
        if (fs.existsSync('./interface') === false) {
            throw 'interface目录不存在!';
        }
        super();
        this.client = zookeeper.createClient(zk, {
            connectTimeout: connectTimeout,
            retries: retries
        });
        this.name = name;
        this.dubbo_version = dubbo_version;
        this.service_version = service_version;
        this.service_group = service_group;
        this.strictString = strictString;
        this.ip = ip;
        this.clientHost = host;
        this.username = username;
        this.password = password;
        this.init();
    }

    /**
     * 读取class
     */
    async readFile() {
        let self = this;
        let domains = await readDir('./interface/domain');
        this.domains = {};
        this.dubbo = {};
        domains.forEach((ele, index) => {
            domains[index] = `./interface/domain/${ele}`;
        });
        domains = await parser2(domains);
        for(let clzName in domains){
            let fns = {};
            domains[clzName].methods.forEach((method) => {
                var regs = /^get(\w*)/.exec(method.name);
                if (regs !== null) {
                    var type = method.ret, fn;
                    switch (type) {
                        case 'java.lang.String' :
                            fn = (value) => {
                                if (value === null || value === undefined || value === 'null') {
                                    return null;
                                }
                                return tool.stringSafeChange(this.strictString, value + str);
                            };
                            break;
                        case 'int' :
                        case 'float' :
                        case 'double' :
                        case 'long' :
                            fn = (value) => {
                                if (value === '' || value === undefined || value === null) {
                                    return 0;
                                }
                                return +value;
                            };
                            break;
                        case 'java.lang.Integer' :
                        case 'java.lang.Double' :
                        case 'java.lang.Float' :
                        case 'java.lang.Long' :
                        case 'java.lang.Number' :
                            fn = (value) => {
                                if (value === '' || value === undefined || value === null) {
                                    return null;
                                }
                                return +value;
                            };
                            break;
                        case 'java.math.BigDecimal' :
                            fn = (value) => {
                                if (value === '' || value === undefined || value === null) {
                                    return null;
                                } else if (typeof value === 'object') {
                                    if (value.value === '' || value.value === undefined || value.value === null) return null;
                                    else return {value: +value.value}
                                } else {
                                    return {value: +value}
                                }
                            };
                            break;
                        case 'boolean' :
                            fn = (value) => {
                                if (value === '' || value === undefined || value === null) {
                                    return false;
                                } else if (typeof value === 'string') {
                                    return value === 'true';
                                } else {
                                    return value
                                }
                            };
                            break;
                        case 'java.lang.Boolean' :
                            fn = (value) => {
                                if (value === '' || value === undefined) {
                                    return null;
                                } else if (typeof value === 'string') {
                                    return value === 'true';
                                } else {
                                    return value
                                }
                            };
                            break;
                        default :
                            fn = (value) => {
                                return value;
                            };
                            break;
                    }
                    fns[tool.firstLowCase(regs[1])] = fn;
                }
            });
            this.domains[clzName] = fns;
        }
        domains = await readDir('./interface/service');
        domains.forEach((ele, index) => {
            domains[index] = `./interface/service/${ele}`;
        });
        domains = await parser2(domains);
        for(let clzName in domains){
            let name = clzName.substr(clzName.lastIndexOf('.') + 1);
            this.dubbo[name] = {};
            domains[clzName].methods.forEach((method) => {
                let fns = [];
                method.args.forEach((el) => {
                    switch (el) {
                        case 'java.lang.String' :
                            fns.push((value) => {
                                if (value === null || value === undefined || value === 'null') {
                                    return null;
                                }
                                return tool.stringSafeChange(value + str);
                            });
                            break;
                        case 'int' :
                        case 'float' :
                        case 'double' :
                        case 'long' :
                            fns.push((value) => {
                                return +value;
                            });
                            break;
                        case 'java.lang.Integer' :
                        case 'java.lang.Double' :
                        case 'java.lang.Float' :
                        case 'java.lang.Long' :
                        case 'java.lang.Number' :
                            fns.push((value) => {
                                if (value !== null && value !== undefined && value !== '') {
                                    return +value;
                                }
                                return null;
                            });
                            break;
                        case 'java.math.BigDecimal' :
                            fns.push((value) => {
                                if (value === '' || value === undefined || value === null) {
                                    return null;
                                } else if (typeof value === 'object') {
                                    if (value.value === '' || value.value === undefined || value.value === null) return null;
                                    else return {value: +value.value}
                                } else {
                                    return {value: +value}
                                }
                            });
                            break;
                        case 'java.lang.Boolean' :
                            fns.push((value) => {
                                if (value === '' || value === undefined) {
                                    return null;
                                } else if (typeof value === 'string') {
                                    return value === 'true';
                                } else {
                                    return value
                                }
                            });
                            break;
                        default :
                            var type_, isArray = false;
                            if (el.indexOf('java.util.List') === -1) {
                                type_ = el;
                            } else {
                                type_ = el.match(/<(.*)>/);
                                isArray = true;
                                type_ !== null && (type_ = type_[1]);
                            }
                            if (this.domains[type_] !== undefined) {
                                if (isArray === true) {
                                    fns.push((value) => {
                                        if (value !== null && value !== undefined) {
                                            for (var i = 0; i < value.length; i++) {
                                                if (value[i] !== null && value[i] !== undefined) {
                                                    value[i] = tool.dataCheck(value[i], type_);
                                                }
                                            }
                                        }
                                        return value;
                                    });
                                } else {
                                    fns.push((value) => {
                                        if (value !== null && value !== undefined) {
                                            value = this.dataCheck(value, type_);
                                        }
                                        return value;
                                    });
                                }
                            } else {
                                fns.push((value) => {
                                    return value;
                                });
                            }
                            break;
                    }
                });
                this.dubbo[name][method.name] = async function () {
                    var args = Array.from(arguments);
                    if (args.length !== self.dubbo[name][method.name].check.length) {
                        throw {
                            error: `请求${clzName}.${method.name}时参数不符,class定义了${self.dubbo[name][method.name].check.length}个,传了${args.length}个!`,
                            message: `请求${clzName}.${method.name}时参数不符,class定义了${self.dubbo[name][method.name].check.length}个,传了${args.length}个!`,
                            state: 101005
                        };
                    }
                    args.forEach((value, index) => {
                        args[index] = self.dubbo[name][method.name].check[index](value);
                    });
                    return await self.invoke(clzName, method.name, args);
                };
                this.dubbo[name][method.name].check = fns;
            });
        }
        this.file_finished = true;
        this.finish_call();
    }

    /**
     * 读取节点
     */
    async readNode() {
        let host_ = {};
        let children = await this.getChildren(`/${this.service_group}`, () => {
            this.readNode();
        });
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            host_[node] = [];
            let services = await this.getChildren(`/${this.service_group}/${node}/${vider}`);
            this.consumer.query.interface = node;
            this.consumer.host = `${this.clientHost}/${node}`;
            this.consumer.query.timestamp = this.consumer.query['×tamp'] = (new Date()).getTime();
            this.consumer.query.version = this.consumer.query.revision = this.service_version || str;
            let versions = [];
            services.forEach((service) => {
                service = decodeURIComponent(service);
                let ser_param = querystring.parse(service);
                if (this.service_version !== false && (ser_param['default.version'] || ser_param['version']) !== this.service_version) return;
                let ser_host = url.parse(service);
                if (this.ip !== false && ser_host.hostname !== this.ip) return;
                host_[node].push(ser_host.host);
                let version = ser_param['default.version'] || ser_param['version'];
                if(versions.indexOf(version) === -1){
                    versions.push(this.consumer.query.version = this.consumer.query.revision = version);
                    this.addNode(`/${this.service_group}/${node}/consumers/${encodeURIComponent(url.format(this.consumer))}`);
                }
            });
        }
        this.node_finished = true;
        this.host = host_;
        this.finish_call();
    }

    /**
     * 成功回调
     */
    finish_call() {
        if (this.file_finished === true && this.node_finished === true && this.called === false) {
            this.called = true;
            this.emit('success');
        }
    }

    init() {
        this.host = {};
        this.called = false;
        this.client.once('connected', () => {
            this.consumer = {
                protocol: 'consumer',
                slashes: 'true',
                host: str,
                query: {
                    application: this.name,
                    category: 'consumers',
                    'default.timeout' : this.connectTimeout,
                    check: 'false',
                    dubbo: this.dubbo_version,
                    interface: str,
                    revision: str,
                    version: str,
                    side: 'consumer',
                    timestamp: str
                }
            };
            this.getChildren = tool.P(this.client.getChildren, this.client);
            this.exists = tool.P(this.client.exists, this.client);
            this.createNode = tool.P(this.client.create, this.client);
            this.readNode();
        }).once('disconnected', () => {
            this.host = {};
        });
        fs.watch('./interface', this.readFile);
        this.readFile();
        this.client.connect();
    }

    /**
     * 添加节点
     * @param node
     */
    async addNode(node) {
        let stat = await this.exists(node);
        if (stat) return;
        this.createNode(node, 1);
    }

    /**
     * 随机算法
     * @param length
     * @returns {number}
     */
    random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * 执行方法
     * @param clzName
     * @param methodName
     * @param args
     * @returns {Promise}
     */
    invoke(clzName, methodName, args) {
        return new Promise((resolve, reject) => {
            if (this.host[clzName] === undefined || this.host[clzName].length === 0) {
                throw {
                    error: `zk中找不到${clzName}对应的服务节点`,
                    message: `zk中找不到${clzName}对应的服务节点`,
                    state: 101003
                };
            }
            let host = this.random(this.host[clzName]);
            let domain_ = domain.create();
            domain_.on('error', (err) => {
                throw {
                    error: err,
                    message: err,
                    state: 101003
                };
                if (err.code && err.code.toString() === 'ECONNREFUSED') {
                    throw {
                        error: `连接${host}/${clzName}失败!`,
                        message: `连接${host}/${clzName}失败!`,
                        state: 101002
                    };
                } else {
                    throw {
                        error: `${clzName}发生错误 ${err.code}`,
                        message: `${clzName}发生错误 ${err.code}`,
                        state: 101005
                    };
                }
            });
            domain_.run(() => {
                var proxy = new hessian.Proxy(`http://${host}/${clzName}`, this.username, this.password, proxy);
                proxy.invoke(methodName, args, (err, reply) => {
                    if (reply && reply.fault === true) {
                        reject({
                            message: `${clzName}/${methodName}发生异常!`,
                            error: `${clzName}/${methodName}发生异常!`,
                            state: 101004
                        });
                    } else if (err) {
                        reject({
                            message: `${clzName}/${methodName}发生异常：${JSON.stringify(err)}`,
                            error: `${clzName}/${methodName}发生异常：${JSON.stringify(err)}`,
                            state: 101004
                        });
                    } else if (reply.status > 0) {
                        reject({
                            message: reply.data,
                            error: reply.data,
                            state: reply.status
                        });
                    } else {
                        resolve(reply.hasOwnProperty('data') ? reply.data : reply);
                    }
                });
            });
        });
    }

    dataCheck(domain,fullName) {
        let fn = this.domains[fullName];
        var pre = {};
        for (var i in domain) {
            if (fn.hasOwnProperty(i)) {
                pre[i] = fn[i](domain[i]);
            }
        }
        pre.__type__ = fullName;
        return pre;
    }
};

module.exports = exports.default;