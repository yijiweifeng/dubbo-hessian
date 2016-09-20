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

let str = '',
    vider = 'providers';
let readDir = tool.P(fs.readdir);
let parser2 = tool.P(parser);

let Adubbo = false;

export default class Dubbo extends events.EventEmitter {
    constructor({name = 'node_client', zk, host = 'node-host', connectTimeout = 1000, retries = 3, dubbo_version = '2.8.4', service_version = false, service_group = 'dubbo', strictString = true, ip = false, username = '', password = '', data} = {}) {
        if (!zk) {
            throw '必须定义zk地址!';
        }
        if (fs.existsSync('./interface') === false) {
            throw 'interface目录不存在!';
        }
        super();
        this._client = zookeeper.createClient(zk, {
            connectTimeout: connectTimeout,
            retries: retries
        });
        this._connectTimeout = connectTimeout;
        this._name = name;
        this._service_version = dubbo_version;
        this._service_version = service_version;
        this._service_group = service_group;
        this._strictString = strictString;
        this._ip = ip;
        this._clientHost = host;
        this._username = username;
        this._password = password;
        this._data = data;
        this._init();
    }

    static one(param) {
        if (Adubbo === false) {
            Adubbo = new Dubbo(param);
        }
        return this;
    }

    static on(event, fn) {
        if (Adubbo !== false) {
            Adubbo.on(event, fn)
        }
        return this;
    }

    static get service() {
        if (Adubbo !== false) return Adubbo._service;
    }

    static get domain() {
        if (Adubbo !== false) return Adubbo._domains;
    }

    static invoke(clzName, methodName, args,host){
        if (Adubbo !== false) return Adubbo._invoke(clzName, methodName, args,host);
    }

    static election(arr) {
        if (Adubbo !== false) return Adubbo._election(arr);
    }

    async _readFile(type = 0) {
        if(type < 2){
            let domains = await readDir('./interface/domain');
            this._domains = {};
            domains.forEach((ele, index) => domains[index] = `./interface/domain/${ele}`);
            domains = await parser2(domains);
            Object.keys(domains).forEach(clzName => {
                let fns = {};
                let name = clzName.substr(clzName.lastIndexOf('.') + 1);
                domains[clzName].methods.forEach((method) => {
                    var regs = /^get(\w*)/.exec(method.name);
                    if (regs !== null) {
                        var type = method.ret, fn;
                        switch (type) {
                            case 'java.lang.String':
                                fn = (value) => {
                                    if (value === null || value === undefined || value === 'null') {
                                        return null;
                                    }
                                    return tool.stringSafeChange(this._strictString, value + str);
                                };
                                break;
                            case 'int':
                            case 'float':
                            case 'double':
                            case 'long':
                                fn = (value) => {
                                    if (value === '' || value === undefined || value === null) {
                                        return 0;
                                    }
                                    return +value;
                                };
                                break;
                            case 'java.lang.Integer':
                            case 'java.lang.Double':
                            case 'java.lang.Float':
                            case 'java.lang.Long':
                            case 'java.lang.Number':
                                fn = (value) => {
                                    if (value === '' || value === undefined || value === null) {
                                        return null;
                                    }
                                    return +value;
                                };
                                break;
                            case 'java.math.BigDecimal':
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
                            case 'boolean':
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
                            case 'java.lang.Boolean':
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
                            default:
                                fn = value => value;
                                break;
                        }
                        fns[tool.firstLowCase(regs[1])] = fn;
                    }
                });
                this._domains[clzName] = fns;
                this._domains[name] = () => this._dataCheck(false, clzName);
            });
        }

        if(type !== 1){
            let services = await readDir('./interface/service');
            this._service = {};
            services.forEach((ele, index) => services[index] = `./interface/service/${ele}`);
            services = await parser2(services);
            Object.keys(services).forEach(clzName => {
                let methods = {};
                let name = clzName.substr(clzName.lastIndexOf('.') + 1);
                services[clzName].methods.forEach((method) => {
                    let fns = [];
                    method.args.forEach((el) => {
                        switch (el) {
                            case 'java.lang.String':
                                fns.push((value) => {
                                    if (value === null || value === undefined || value === 'null') {
                                        return null;
                                    }
                                    return tool.stringSafeChange(this._strictString,value + str);
                                });
                                break;
                            case 'int':
                            case 'float':
                            case 'double':
                            case 'long':
                                fns.push(value => +value);
                                break;
                            case 'java.lang.Integer':
                            case 'java.lang.Double':
                            case 'java.lang.Float':
                            case 'java.lang.Long':
                            case 'java.lang.Number':
                                fns.push((value) => {
                                    if (value !== null && value !== undefined && value !== '') {
                                        return +value;
                                    }
                                    return null;
                                });
                                break;
                            case 'java.math.BigDecimal':
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
                            case 'java.lang.Boolean':
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
                            default:
                                var type_, isArray = false;
                                if (el.indexOf('java.util.List') === -1) {
                                    type_ = el;
                                } else {
                                    type_ = el.match(/<(.*)>/);
                                    isArray = true;
                                    type_ !== null && (type_ = type_[1]);
                                }
                                if (this._domains[type_] !== undefined) {
                                    if (isArray === true) {
                                        fns.push((value) => {
                                            if (value !== null && value !== undefined) {
                                                value.forEach((valuei,i) => {
                                                    if (valuei !== null && valuei !== undefined) {
                                                        value[i] = this._dataCheck(valuei, type_);
                                                    }
                                                })
                                            }
                                            return value;
                                        });
                                    } else {
                                        fns.push((value) => {
                                            if (value !== null && value !== undefined) {
                                                value = this._dataCheck(value, type_);
                                            }
                                            return value;
                                        });
                                    }
                                } else {
                                    fns.push(value => value);
                                }
                                break;
                        }
                    });
                    methods[method.name] = async(...args) => {
                        if (args.length !== this._service[name][method.name].check.length) {
                            this.emit('error', {
                                host: null,
                                className: clzName,
                                methodName: method.name,
                                param: args,
                                time: 0,
                                error: `调用${clzName}/${method.name}参数不符,期望${this._service[name][method.name].check.length}个,传了${args.length}个!`
                            });
                            throw {
                                stata: 101006,
                                message: `调用${clzName}/${method.name}参数不符,期望${this._service[name][method.name].check.length}个,传了${args.length}个!`,
                                error: `调用${clzName}/${method.name}参数不符,期望${this._service[name][method.name].check.length}个,传了${args.length}个!`
                            };
                        }
                        args.forEach((value, index) => {
                            args[index] = this._service[name][method.name].check[index](value);
                        });
                        return await this._invoke(clzName, method.name, args);
                    };
                    methods[method.name].check = fns;
                });
                this._service[name] = methods;
                if (this._host[clzName]) {
                    this.emit(name, this._host[clzName]);
                }
            });
        }

        if(type === 0){
            this._file_finished = true;
            this._finish_call();
        }
    }

    async _readNode(node) {
        if (node === undefined) {
            let children = await this._getChildren(`/${this._service_group}`, () => this._readNode());
            children.forEach(child => this._readNode(child));
            this._node_finished = true;
            this._finish_call();
            this.emit('node');
        } else {
            let hosts = [];
            if (this._version[node] === undefined) {
                this._version[node] = [];
            }
            let services = await this._getChildren(`/${this._service_group}/${node}/${vider}`, () => this._readNode(node));
            let consumer = this._consumer();
            let name = node.substr(node.lastIndexOf('.') + 1);
            consumer.query.interface = node;
            consumer.host = `${this._clientHost}/${node}`;
            consumer.query.timestamp = consumer.query['×tamp'] = (new Date()).getTime();
            consumer.query.version = consumer.query.revision = this._service_version || str;
            services.forEach((service) => {
                service = decodeURIComponent(service);
                let ser_param = querystring.parse(service);
                if (this._service_version !== false && (ser_param['default.version'] || ser_param['version']) !== this._service_version) return;
                let ser_host = url.parse(service);
                if (this._ip !== false && ser_host.hostname !== this._ip) return;
                hosts.findIndex(h => h === ser_host.host) === -1 && hosts.push(ser_host.host);
                let version = ser_param['default.version'] || ser_param['version'];
                if (this._version[node].indexOf(version) === -1) {
                    this._version[node].push(consumer.query.version = consumer.query.revision = version);
                    this._addNode(`/${this._service_group}/${node}/consumers/${encodeURIComponent(url.format(consumer))}`);
                }
            });
            this._host[node] = hosts;
            if (this._service[name]) {
                this.emit(name, this._host[node]);
            }
            this.emit('node-' + name, this._host[node]);
        }
    }

    _finish_call() {
        if (this._file_finished === true && this._node_finished === true && this._called === false) {
            this._called = true;
            this.emit('all');
        }
    }

    _consumer() {
        return {
            protocol: 'consumer',
            slashes: 'true',
            host: str,
            query: {
                application: this._name,
                category: 'consumers',
                'default.timeout': this._connectTimeout,
                check: 'false',
                dubbo: this._service_version,
                interface: str,
                revision: str,
                version: str,
                side: 'consumer',
                timestamp: str
            }
        };
    }

    _init() {
        this._host = {};
        this._version = {};
        this._domains = {};
        this._service = {};
        this._called = false;
        this._client.once('connected', () => {
            this._getChildren = tool.P(this._client.getChildren, this._client);
            this._exists = tool.P(this._client.exists, this._client);
            this._createNode = tool.P(this._client.create, this._client);
            this._readNode();
        }).once('disconnected', () => {
        });

        fs.watch('./interface/domain', () => this._readFile(1));
        fs.watch('./interface/service', () => this._readFile(2));
        this._readFile();
        this._client.connect();
    }

    async _addNode(node) {
        let stat = await this._exists(node);
        if (stat) return;
        this._createNode(node, 1);
    }

    _election(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    _invoke(clzName, methodName, args,host) {
        return new Promise((resolve,reject) => {
            let begin = +new Date();
            if (this._host[clzName] === undefined || this._host[clzName].length === 0) {
                this.emit('error', {
                    host: null,
                    className: clzName,
                    methodName: methodName,
                    param: args,
                    time: 0,
                    error: `${clzName}/${methodName}zk中找不到对应的服务节点`
                });
                throw {
                    message: `${clzName}/${methodName}zk中找不到对应的服务节点`,
                    error: `${clzName}/${methodName}zk中找不到对应的服务节点`,
                    state: 101002
                };
            }
            if(host === undefined){
                host = this._election(this._host[clzName]);
            }
            let domain_ = domain.create();
            domain_.on('error', (err) => {
                if (err.code && err.code.toString() === 'ECONNREFUSED') {
                    let end = +new Date();
                    this.emit('error', {
                        host: host,
                        className: clzName,
                        methodName: methodName,
                        param: args,
                        time: end - begin,
                        error: `${host}/${clzName}/${methodName}连接失败!`
                    });
                    reject({
                        message: `${host}/${clzName}/${methodName}连接失败!`,
                        error: `${host}/${clzName}/${methodName}连接失败!`,
                        state: 101005
                    });
                } else {
                    let end = +new Date();
                    this.emit('error', {
                        host: host,
                        className: clzName,
                        methodName: methodName,
                        param: args,
                        time: end - begin,
                        error: `${host}/${clzName}/${methodName}发生未知异常:${JSON.stringify(err)}!`
                    });
                    reject({
                        message: `${host}/${clzName}/${methodName}发生未知异常:${JSON.stringify(err)}!`,
                        error: `${host}/${clzName}/${methodName}发生未知异常:${JSON.stringify(err)}!`,
                        state: 101004
                    });
                }
            });
            domain_.run(() => {
                var proxy = new hessian.Proxy(`http://${host}/${clzName}`, this._username, this._password, proxy);
                proxy.invoke(methodName, args, (err, reply) => {
                    if (reply && reply.fault === true) {
                        let end = +new Date();
                        this.emit('error', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: end - begin,
                            error: `${host}/${clzName}/${methodName}发生故障!`
                        });
                        reject({
                            message: `${host}/${clzName}/${methodName}发生故障${JSON.stringify(reply)}!`,
                            error: `${host}/${clzName}/${methodName}发生故障${JSON.stringify(reply)}!`,
                            state: 101004
                        });
                    } else if (err) {
                        let end = +new Date();
                        this.emit('error', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: end - begin,
                            error: `${host}/${clzName}/${methodName}发生异常${JSON.stringify(err)}!`
                        });
                        reject({
                            message: `${host}/${clzName}/${methodName}发生异常${JSON.stringify(err)}!`,
                            error: `${host}/${clzName}/${methodName}发生异常${JSON.stringify(err)}!`,
                            state: 101004
                        });
                    } else {
                        let end = +new Date();
                        this.emit('data', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: end - begin,
                            data: reply
                        });
                        if (this._data) {
                            try{
                                resolve(this._data(reply));
                            }catch(error){
                                this.emit('error', {
                                    host: host,
                                    className: clzName,
                                    methodName: methodName,
                                    param: args,
                                    time: end - begin,
                                    error: `${host}/${clzName}/${methodName}发生异常${JSON.stringify(error)}!`
                                });
                                reject(error);
                            }
                        } else {
                            resolve(reply);
                        }
                    }
                });
            });
        });
    }

    _dataCheck(domain, fullName) {
        let fn = this._domains[fullName];
        var pre = {};
        if (domain === false) {
            Object.keys(fn).forEach(i => pre[i] = fn[i](''))
        } else {
            Object.keys(domain).forEach(i => fn.hasOwnProperty(i) && (pre[i] = fn[i](domain[i])))
        }
        pre.__type__ = fullName;
        return pre;
    }
}
module.exports = exports.default;