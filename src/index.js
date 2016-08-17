/**
 * Created by cc on 16/8/11.
 */
'use strict';

import zookeeper from 'node-zookeeper-client';
import parser from 'java-class-parser';
import fs from 'fs';
import tool from './toolkit.js';
require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');
let str = '';

export default class {
    /**
     * @param json,key
     *  name（app标识）,
     *  zk(注册中心地址 ip:port),
     *  dubbo_version(展示到注册中心的dubbo版本,默认2.8.4),
     *  service_version(服务版本,默认为任意版本),
     *  service_group = 'dubbo'(服务分组,默认dubbo)
     *  strictString = true(是否过滤所有提交字符串中的script/frame等)
     */
    constructor({name, zk, connectTimeout = 1000, retries = 3, dubbo_version = '2.8.4', service_version, service_group = 'dubbo', strictString = true} = {}) {
        this.client = zookeeper.createClient(zk, connectTimeout, retries);
        this.name = name;
        this.dubbo_version = dubbo_version;
        this.service_version = service_version;
        this.service_group = service_group;
        this.strictString = strictString;
        this.client.once('connected', () => {
            this._init();
        });
    }

    async _init() {
        let readdir = tool.P(fs.readdir);
        let parser2 = tool.P(parser);
        let domains = await readdir('./interface/domain');
        let self = this;
        this.domains = {};
        this.services = {};
        domains.forEach((ele, index) => {
            domains[index] = "./interface/domain/" + ele;
        });
        domains = await parser2(domains);
        domains.keys.forEach((clzName) => {
            let fns = {};
            domains[clzName].methods.forEach((method) => {
                var regs = /^get(\w*)/.exec(method.name);
                if (regs !== null) {
                    var type = method.ret, fn;
                    switch (type) {
                        case "java.lang.String" :
                            fn = (value) => {
                                if (value === null || value === undefined || value === "null") {
                                    return null;
                                }
                                return tool.stringSafeChange(this.strictString, value + str);
                            };
                            break;
                        case "int" :
                        case "float" :
                        case "double" :
                        case "long" :
                            fn = (value) => {
                                if (value === "" || value === undefined || value === null) {
                                    return 0;
                                }
                                return +value;
                            };
                            break;
                        case "java.lang.Integer" :
                        case "java.lang.Double" :
                        case "java.lang.Float" :
                        case "java.lang.Long" :
                        case "java.lang.Number" :
                            fn = (value) => {
                                if (value === "" || value === undefined || value === null) {
                                    return null;
                                }
                                return +value;
                            };
                            break;
                        case "java.math.BigDecimal" :
                            fn = (value) => {
                                if (value === "" || value === undefined || value === null) {
                                    return null;
                                } else if (typeof value === "object") {
                                    if (value.value === "" || value.value === undefined || value.value === null) return null;
                                    else return {value: +value.value}
                                } else {
                                    return {value: +value}
                                }
                            };
                            break;
                        case "boolean" :
                            fn = (value) => {
                                if (value === "" || value === undefined || value === null) {
                                    return false;
                                } else if (typeof value === "string") {
                                    return value === "true";
                                } else {
                                    return value
                                }
                            };
                            break;
                        case "java.lang.Boolean" :
                            fn = (value) => {
                                if (value === "" || value === undefined) {
                                    return null;
                                } else if (typeof value === "string") {
                                    return value === "true";
                                } else {
                                    return value
                                }
                            };
                            break;
                        default :
                            fn = (value)  => {
                                return value;
                            };
                            break;
                    }
                    fns[tool.firstLowCase(regs[1])] = fn;
                }
            });
            this.domains[clzName] = fns;
        });
        domains = await readdir('./interface/service');
        domains.forEach((ele, index) => {
            domains[index] = "./interface/service/" + ele;
        });
        domains = await parser2(domains);
        domains.keys.forEach((clzName) => {
            domains[clzName].methods.forEach((method) => {
                let name = clzName.substr(clzName.lastIndexOf(".") + 1),fns = [];
                method.args.forEach((el) => {
                    switch (el) {
                        case "java.lang.String" :
                            fns.push( (value) => {
                                if (value === null || value === undefined || value === "null") {
                                    return null;
                                }
                                return tool.stringSafeChange(value + str);
                            });
                            break;
                        case "int" :
                        case "float" :
                        case "double" :
                        case "long" :
                            fns.push((value) => {
                                return +value;
                            });
                            break;
                        case "java.lang.Integer" :
                        case "java.lang.Double" :
                        case "java.lang.Float" :
                        case "java.lang.Long" :
                        case "java.lang.Number" :
                            fns.push((value) => {
                                if (value !== null && value !== undefined && value !== "") {
                                    return +value;
                                }
                                return null;
                            });
                            break;
                        case "java.math.BigDecimal" :
                            fns.push( (value) => {
                                if (value === "" || value === undefined || value === null) {
                                    return null;
                                } else if (typeof value === "object") {
                                    if (value.value === "" || value.value === undefined || value.value === null) return null;
                                    else return {value: +value.value}
                                } else {
                                    return {value: +value}
                                }
                            });
                            break;
                        case "java.lang.Boolean" :
                            fns.push((value) => {
                                if (value === "" || value === undefined) {
                                    return null;
                                } else if (typeof value === "string") {
                                    return value === "true";
                                } else {
                                    return value
                                }
                            });
                            break;
                        default :
                            var type_, isArray = false;
                            if (el.indexOf("java.util.List") === -1) {
                                type_ = el;
                            } else {
                                type_ = el.match(/<(.*)>/);
                                isArray = true;
                                type_ !== null && (type_ = type_[1]);
                            }
                            if (domains.indexOf(type_) > -1) {
                                if (isArray === true) {
                                    fns.push( (value) => {
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
                                            value = tool.dataCheck(value,type_);
                                        }
                                        return value;
                                    });
                                }
                            } else {
                                fns.push( (value) => {
                                    return value;
                                });
                            }
                            break;
                    }
                });
                this.services[name][method.name] = function () {
                    var args = Array.from(arguments);
                    return new Promise((resolve, reject) => {
                        if (args.length !== self.services[name][method.name].check.length) {
                            return reject({
                                error: "请求:" + clzName + "." + method.name + "时参数不符!",
                                message: "请求:" + clzName + "." + method.name + "时参数不符!",
                                state: 101005
                            });
                        }
                        args.forEach((value, index) => {
                            args[index] = self.services[name][method.name].check[index](value);
                        });
                        self.invoke(name, method.name, args).then((data) => {
                            resolve(data);
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                };
                this.services[name][method.name].check = fns;
            });
        });
    }

    async invoke() {

    }


}


// client = zookeeper.createClient("101.200.218.24:2181", {
//     connectTimeout: 1000,
//     retries: 3
// });
//
//
// var to = function () {
//     var service = "com.alibaba.dubbo.monitor.MonitorService";
//     var parameters = "parameters";
//     var result = "result";
//     var address = "10.0.0.17";
//     var registry = "registry";
//     var application = "application";
//     var username = "username";
//     var statistics = "statistics";
//     var collected = "collected";
//     var routes = "routes";
//     var overrides = "overrides";
//     var alived = "alived";
//     var expired = "expired";
//     return "consumer://" +
//         address
//         + "/" +
//         service
//         + "?category=consumers&check=false&dubbo=0.0.1-SNAPSHOT-executable&interface=" +
//         service
//         + "&pid=18175×tamp=1470913660519";
// };
//
// client.once('connected', function () {
//     client.create(
//         "/dubbo/com.alibaba.dubbo.monitor.MonitorService/consumers/10.0.0.179",
//         new Buffer(to()),
//         zookeeper.CreateMode.EPHEMERAL,
//         function (error, path) {
//             if (error) {
//                 console.log(error.stack);
//                 return;
//             }
//
//             console.log('Node: %s is created.', path);
//         }
//     );
//     return;
//     client.mkdirp("/dubbo/com.alibaba.dubbo.monitor.MonitorService/consumers/10.0.0.177", function (error, path) {
//         if (error) {
//             console.log(error.stack);
//             return;
//         }
//         console.log('Node: %s is created.', path);
//     });
//     return;
//     var obj = {"/": {}};
//     var fn = function (p, o) {
//         client.getChildren(p, function (error, children, stats) {
//             children.forEach(function (ele) {
//                 if (p === "/") {
//                     o[p + decodeURIComponent(ele)] = {};
//                     fn(p + ele, o[p + ele]);
//                 } else {
//                     o[p + "/" + decodeURIComponent(ele)] = {};
//                     fn(p + "/" + ele, o[p + "/" + ele]);
//                 }
//             });
//             return obj;
//         });
//     };
//     setTimeout(function () {
//         var tt = {};
//         for (var i in obj["/"]["/dubbo"]) {
//             if (isnotempty(obj["/"]["/dubbo"][i][i + "/providers"])) {
//                 tt[i] = (obj["/"]["/dubbo"][i]);
//             }
//         }
//         console.log(JSON.stringify(tt));
//     }, 30 * 1000);
//     fn("/", obj["/"]);
// });
//
//
// client.connect();