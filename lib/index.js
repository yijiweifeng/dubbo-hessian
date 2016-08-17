/**
 * Created by cc on 16/8/11.
 */
'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _nodeZookeeperClient = require('node-zookeeper-client');

var _nodeZookeeperClient2 = _interopRequireDefault(_nodeZookeeperClient);

var _javaClassParser = require('java-class-parser');

var _javaClassParser2 = _interopRequireDefault(_javaClassParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _toolkit = require('./toolkit.js');

var _toolkit2 = _interopRequireDefault(_toolkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var _class = function () {
    /**
     * @param json,key
     *  name（app标识）,
     *  zk(注册中心地址 ip:port),
     *  dubbo_version(展示到注册中心的dubbo版本,默认2.8.4),
     *  service_version(服务版本,默认为任意版本),
     *  service_group = 'dubbo'(服务分组,默认dubbo)
     *  strictString = true(是否过滤所有提交字符串中的script/frame等)
     */
    function _class() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var name = _ref.name;
        var zk = _ref.zk;
        var _ref$connectTimeout = _ref.connectTimeout;
        var connectTimeout = _ref$connectTimeout === undefined ? 1000 : _ref$connectTimeout;
        var _ref$retries = _ref.retries;
        var retries = _ref$retries === undefined ? 3 : _ref$retries;
        var _ref$dubbo_version = _ref.dubbo_version;
        var dubbo_version = _ref$dubbo_version === undefined ? '2.8.4' : _ref$dubbo_version;
        var service_version = _ref.service_version;
        var _ref$service_group = _ref.service_group;
        var service_group = _ref$service_group === undefined ? 'dubbo' : _ref$service_group;
        var _ref$strictString = _ref.strictString;
        var strictString = _ref$strictString === undefined ? true : _ref$strictString;
        (0, _classCallCheck3.default)(this, _class);

        this.client = _nodeZookeeperClient2.default.createClient(zk, connectTimeout, retries);
        this.name = name;
        this.dubbo_version = dubbo_version;
        this.service_version = service_version;
        this.service_group = service_group;
        this.strictString = strictString;
        this.client.once('connected', function () {});
    }

    _class.prototype._init = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
            var _this = this;

            var readdir, parser2, domains;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            readdir = _toolkit2.default.P(_fs2.default.readdir);
                            parser2 = _toolkit2.default.P(_javaClassParser2.default);
                            _context.next = 4;
                            return readdir('./interface/domain');

                        case 4:
                            domains = _context.sent;

                            this.domains = [];
                            this.domainFn = [];
                            this.dubboFace = [];
                            this.dubboMethods = [];
                            this.dubboMethodsArgsCheckFn = [];
                            domains.forEach(function (ele, index) {
                                domains[index] = "./interface/domain/" + ele;
                            });
                            _context.next = 13;
                            return parser2(domains);

                        case 13:
                            domains = _context.sent;

                            domains.keys.forEach(function (clzName) {
                                domains.push(clzName);
                                var name = clzName.substr(clzName.lastIndexOf(".") + 1);
                                var fns = {};
                                domains[clzName].methods.forEach(function (method) {
                                    var regs = /^get(\w*)/.exec(method.name);
                                    if (regs !== null) {
                                        var type = method.ret,
                                            fn;
                                        switch (type) {
                                            case "java.lang.String":
                                                fn = function fn(value) {
                                                    if (value === null || value === undefined || value === "null") {
                                                        return null;
                                                    }
                                                    return _toolkit2.default.stringSafeChange(this.strictString, value + str);
                                                };
                                                break;
                                            case "int":
                                            case "float":
                                            case "double":
                                            case "long":
                                                fn = function fn(value) {
                                                    if (value === "" || value === undefined || value === null) {
                                                        return 0;
                                                    }
                                                    return +value;
                                                };
                                                break;
                                            case "java.lang.Integer":
                                            case "java.lang.Double":
                                            case "java.lang.Float":
                                            case "java.lang.Long":
                                            case "java.lang.Number":
                                                fn = function fn(value) {
                                                    if (value === "" || value === undefined || value === null) {
                                                        return null;
                                                    }
                                                    return +value;
                                                };
                                                break;
                                            case "java.math.BigDecimal":
                                                fn = function fn(value) {
                                                    if (value === "" || value === undefined || value === null) {
                                                        return null;
                                                    } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === "object") {
                                                        if (value.value === "" || value.value === undefined || value.value === null) return null;else return { value: +value.value };
                                                    } else {
                                                        return { value: +value };
                                                    }
                                                };
                                                break;
                                            case "boolean":
                                                fn = function fn(value) {
                                                    if (value === "" || value === undefined || value === null) {
                                                        return false;
                                                    } else if (typeof value === "string") {
                                                        return value === "true";
                                                    } else {
                                                        return value;
                                                    }
                                                };
                                                break;
                                            case "java.lang.Boolean":
                                                fn = function fn(value) {
                                                    if (value === "" || value === undefined) {
                                                        return null;
                                                    } else if (typeof value === "string") {
                                                        return value === "true";
                                                    } else {
                                                        return value;
                                                    }
                                                };
                                                break;
                                            default:
                                                fn = function fn(value) {
                                                    return value;
                                                };
                                                break;
                                        }
                                        fns[_toolkit2.default.firstLowCase(regs[1])] = fn;
                                    }
                                });
                                _this.domainFn.push(fns);
                                _this.domainFn[name] = _this.domainFn[domainFn.length - 1];
                                _this.domains[name] = clzName;
                            });
                            _context.next = 17;
                            return readdir('./interface/service');

                        case 17:
                            domains = _context.sent;

                            domains.forEach(function (ele, index) {
                                domains[index] = "./interface/service/" + ele;
                            });
                            _context.next = 21;
                            return parser2(domains);

                        case 21:
                            domains = _context.sent;

                            domains.keys.forEach(function (clzName) {
                                var name = clzName.substr(clzName.lastIndexOf(".") + 1);
                                _this.dubboFace[name] = clzName;
                                _this.dubboMethods[name] = {};
                                _this.dubboMethodsArgsCheckFn[name] = {};
                                domains[clzName].methods.forEach(function (method) {
                                    var fns = [],
                                        names = name;
                                    method.args.forEach(function (el) {
                                        switch (el) {
                                            case "java.lang.String":
                                                fns.push(function (value) {
                                                    if (value === null || value === undefined || value === "null") {
                                                        return null;
                                                    }
                                                    return _toolkit2.default.stringSafeChange(value + str);
                                                });
                                                break;
                                            case "int":
                                            case "float":
                                            case "double":
                                            case "long":
                                                fns.push(function (value) {
                                                    return +value;
                                                });
                                                break;
                                            case "java.lang.Integer":
                                            case "java.lang.Double":
                                            case "java.lang.Float":
                                            case "java.lang.Long":
                                            case "java.lang.Number":
                                                fns.push(function (value) {
                                                    if (value !== null && value !== undefined && value !== "") {
                                                        return +value;
                                                    }
                                                    return null;
                                                });
                                                break;
                                            case "java.math.BigDecimal":
                                                fns.push(function (value) {
                                                    if (value === "" || value === undefined || value === null) {
                                                        return null;
                                                    } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === "object") {
                                                        if (value.value === "" || value.value === undefined || value.value === null) return null;else return { value: +value.value };
                                                    } else {
                                                        return { value: +value };
                                                    }
                                                });
                                                break;
                                            case "java.lang.Boolean":
                                                fns.push(function (value) {
                                                    if (value === "" || value === undefined) {
                                                        return null;
                                                    } else if (typeof value === "string") {
                                                        return value === "true";
                                                    } else {
                                                        return value;
                                                    }
                                                });
                                                break;
                                            default:
                                                var type_,
                                                    isArray = false;
                                                if (el.indexOf("java.util.List") === -1) {
                                                    type_ = el;
                                                } else {
                                                    type_ = el.match(/<(.*)>/);
                                                    isArray = true;
                                                    type_ !== null && (type_ = type_[1]);
                                                }
                                                if (domains.indexOf(type_) > -1) {
                                                    if (isArray === true) {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                for (var i = 0; i < value.length; i++) {
                                                                    if (value[i] !== null && value[i] !== undefined) {
                                                                        value[i] = dataCheck(value[i], null, type_);
                                                                    }
                                                                }
                                                            }
                                                            return value;
                                                        });
                                                    } else {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                value = dataCheck(value, null, type_);
                                                            }
                                                            return value;
                                                        });
                                                    }
                                                } else {
                                                    fns.push(function (value) {
                                                        return value;
                                                    });
                                                }
                                                break;
                                        }
                                    });
                                    _this.dubboMethodsArgsCheckFn[names][method.name] = fns;
                                    var that = _this;
                                    _this.dubboMethods[names][method.name] = function () {
                                        var args = (0, _from2.default)(arguments);
                                        return new _promise2.default(function (resolve, reject) {
                                            if (args.length !== that.dubboMethodsArgsCheckFn[names][method.name].length) {
                                                reject("请求:" + names + "." + method.name + "时参数不符!");
                                                return;
                                            }
                                            args.forEach(function (value, index) {
                                                args[index] = that.dubboMethodsArgsCheckFn[names][method.name][index](value);
                                            });
                                            that.invoke(names, method.name, args).then(function (data) {
                                                resolve(data);
                                            }).catch(function (err) {
                                                reject(err);
                                            });
                                        });
                                    };
                                });
                            });

                        case 23:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function _init() {
            return _ref2.apply(this, arguments);
        }

        return _init;
    }();

    return _class;
}();

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


exports.default = _class;
//# sourceMappingURL=index.js.map