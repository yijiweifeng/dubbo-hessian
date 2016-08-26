/**
 * Created by cc on 16/8/11.
 */
'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _domain = require('domain');

var _domain2 = _interopRequireDefault(_domain);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _nodeZookeeperClient = require('node-zookeeper-client');

var _nodeZookeeperClient2 = _interopRequireDefault(_nodeZookeeperClient);

var _javaClassParserGenerics = require('java-class-parser-generics');

var _javaClassParserGenerics2 = _interopRequireDefault(_javaClassParserGenerics);

var _hessianProxyGarbled = require('hessian-proxy-garbled');

var _hessianProxyGarbled2 = _interopRequireDefault(_hessianProxyGarbled);

var _toolkit = require('./toolkit.js');

var _toolkit2 = _interopRequireDefault(_toolkit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var str = '',
    vider = 'providers';
var readDir = _toolkit2.default.P(_fs2.default.readdir);
var parser2 = _toolkit2.default.P(_javaClassParserGenerics2.default);

var _class = function (_events$EventEmitter) {
    (0, _inherits3.default)(_class, _events$EventEmitter);

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
    function _class() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var _ref$name = _ref.name;
        var name = _ref$name === undefined ? 'node-client' : _ref$name;
        var zk = _ref.zk;
        var _ref$host = _ref.host;
        var host = _ref$host === undefined ? 'node-host' : _ref$host;
        var _ref$connectTimeout = _ref.connectTimeout;
        var connectTimeout = _ref$connectTimeout === undefined ? 1000 : _ref$connectTimeout;
        var _ref$retries = _ref.retries;
        var retries = _ref$retries === undefined ? 3 : _ref$retries;
        var _ref$dubbo_version = _ref.dubbo_version;
        var dubbo_version = _ref$dubbo_version === undefined ? '2.8.4' : _ref$dubbo_version;
        var _ref$service_version = _ref.service_version;
        var service_version = _ref$service_version === undefined ? false : _ref$service_version;
        var _ref$service_group = _ref.service_group;
        var service_group = _ref$service_group === undefined ? 'dubbo' : _ref$service_group;
        var _ref$strictString = _ref.strictString;
        var strictString = _ref$strictString === undefined ? true : _ref$strictString;
        var _ref$ip = _ref.ip;
        var ip = _ref$ip === undefined ? false : _ref$ip;
        var _ref$username = _ref.username;
        var username = _ref$username === undefined ? '' : _ref$username;
        var _ref$password = _ref.password;
        var password = _ref$password === undefined ? '' : _ref$password;
        (0, _classCallCheck3.default)(this, _class);

        if (!zk) {
            throw '必须定义zk地址!';
        }
        if (_fs2.default.existsSync('./interface') === false) {
            throw 'interface目录不存在!';
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _events$EventEmitter.call(this));

        _this.client = _nodeZookeeperClient2.default.createClient(zk, {
            connectTimeout: connectTimeout,
            retries: retries
        });
        _this.name = name;
        _this.dubbo_version = dubbo_version;
        _this.service_version = service_version;
        _this.service_group = service_group;
        _this.strictString = strictString;
        _this.ip = ip;
        _this.clientHost = host;
        _this.username = username;
        _this.password = password;
        _this.init();
        return _this;
    }

    /**
     * 读取class
     */


    _class.prototype.readFile = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            var _this2 = this;

            var self, domains, _loop, clzName, _loop2, _clzName;

            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            self = this;
                            _context2.next = 3;
                            return readDir('./interface/domain');

                        case 3:
                            domains = _context2.sent;

                            this.domains = {};
                            this.dubbo = {};
                            domains.forEach(function (ele, index) {
                                domains[index] = './interface/domain/' + ele;
                            });
                            _context2.next = 9;
                            return parser2(domains);

                        case 9:
                            domains = _context2.sent;

                            _loop = function _loop(clzName) {
                                var fns = {};
                                domains[clzName].methods.forEach(function (method) {
                                    var regs = /^get(\w*)/.exec(method.name);
                                    if (regs !== null) {
                                        var type = method.ret,
                                            fn;
                                        switch (type) {
                                            case 'java.lang.String':
                                                fn = function fn(value) {
                                                    if (value === null || value === undefined || value === 'null') {
                                                        return null;
                                                    }
                                                    return _toolkit2.default.stringSafeChange(_this2.strictString, value + str);
                                                };
                                                break;
                                            case 'int':
                                            case 'float':
                                            case 'double':
                                            case 'long':
                                                fn = function fn(value) {
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
                                                fn = function fn(value) {
                                                    if (value === '' || value === undefined || value === null) {
                                                        return null;
                                                    }
                                                    return +value;
                                                };
                                                break;
                                            case 'java.math.BigDecimal':
                                                fn = function fn(value) {
                                                    if (value === '' || value === undefined || value === null) {
                                                        return null;
                                                    } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
                                                        if (value.value === '' || value.value === undefined || value.value === null) return null;else return { value: +value.value };
                                                    } else {
                                                        return { value: +value };
                                                    }
                                                };
                                                break;
                                            case 'boolean':
                                                fn = function fn(value) {
                                                    if (value === '' || value === undefined || value === null) {
                                                        return false;
                                                    } else if (typeof value === 'string') {
                                                        return value === 'true';
                                                    } else {
                                                        return value;
                                                    }
                                                };
                                                break;
                                            case 'java.lang.Boolean':
                                                fn = function fn(value) {
                                                    if (value === '' || value === undefined) {
                                                        return null;
                                                    } else if (typeof value === 'string') {
                                                        return value === 'true';
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
                                _this2.domains[clzName] = fns;
                            };

                            for (clzName in domains) {
                                _loop(clzName);
                            }
                            _context2.next = 14;
                            return readDir('./interface/service');

                        case 14:
                            domains = _context2.sent;

                            domains.forEach(function (ele, index) {
                                domains[index] = './interface/service/' + ele;
                            });
                            _context2.next = 18;
                            return parser2(domains);

                        case 18:
                            domains = _context2.sent;

                            _loop2 = function _loop2(_clzName) {
                                var name = _clzName.substr(_clzName.lastIndexOf('.') + 1);
                                _this2.dubbo[name] = {};
                                domains[_clzName].methods.forEach(function (method) {
                                    var fns = [];
                                    method.args.forEach(function (el) {
                                        switch (el) {
                                            case 'java.lang.String':
                                                fns.push(function (value) {
                                                    if (value === null || value === undefined || value === 'null') {
                                                        return null;
                                                    }
                                                    return _toolkit2.default.stringSafeChange(value + str);
                                                });
                                                break;
                                            case 'int':
                                            case 'float':
                                            case 'double':
                                            case 'long':
                                                fns.push(function (value) {
                                                    return +value;
                                                });
                                                break;
                                            case 'java.lang.Integer':
                                            case 'java.lang.Double':
                                            case 'java.lang.Float':
                                            case 'java.lang.Long':
                                            case 'java.lang.Number':
                                                fns.push(function (value) {
                                                    if (value !== null && value !== undefined && value !== '') {
                                                        return +value;
                                                    }
                                                    return null;
                                                });
                                                break;
                                            case 'java.math.BigDecimal':
                                                fns.push(function (value) {
                                                    if (value === '' || value === undefined || value === null) {
                                                        return null;
                                                    } else if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
                                                        if (value.value === '' || value.value === undefined || value.value === null) return null;else return { value: +value.value };
                                                    } else {
                                                        return { value: +value };
                                                    }
                                                });
                                                break;
                                            case 'java.lang.Boolean':
                                                fns.push(function (value) {
                                                    if (value === '' || value === undefined) {
                                                        return null;
                                                    } else if (typeof value === 'string') {
                                                        return value === 'true';
                                                    } else {
                                                        return value;
                                                    }
                                                });
                                                break;
                                            default:
                                                var type_,
                                                    isArray = false;
                                                if (el.indexOf('java.util.List') === -1) {
                                                    type_ = el;
                                                } else {
                                                    type_ = el.match(/<(.*)>/);
                                                    isArray = true;
                                                    type_ !== null && (type_ = type_[1]);
                                                }
                                                if (_this2.domains[type_] !== undefined) {
                                                    if (isArray === true) {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                for (var i = 0; i < value.length; i++) {
                                                                    if (value[i] !== null && value[i] !== undefined) {
                                                                        value[i] = _toolkit2.default.dataCheck(value[i], type_);
                                                                    }
                                                                }
                                                            }
                                                            return value;
                                                        });
                                                    } else {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                value = _this2.dataCheck(value, type_);
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
                                    _this2.dubbo[name][method.name] = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                                        var args,
                                            _args = arguments;
                                        return _regenerator2.default.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        args = (0, _from2.default)(_args);

                                                        if (!(args.length !== self.dubbo[name][method.name].check.length)) {
                                                            _context.next = 3;
                                                            break;
                                                        }

                                                        throw {
                                                            error: '请求' + _clzName + '.' + method.name + '时参数不符,class定义了' + self.dubbo[name][method.name].check.length + '个,传了' + args.length + '个!',
                                                            message: '请求' + _clzName + '.' + method.name + '时参数不符,class定义了' + self.dubbo[name][method.name].check.length + '个,传了' + args.length + '个!',
                                                            state: 101005
                                                        };

                                                    case 3:
                                                        args.forEach(function (value, index) {
                                                            args[index] = self.dubbo[name][method.name].check[index](value);
                                                        });
                                                        _context.next = 6;
                                                        return self.invoke(_clzName, method.name, args);

                                                    case 6:
                                                        return _context.abrupt('return', _context.sent);

                                                    case 7:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, this);
                                    }));
                                    _this2.dubbo[name][method.name].check = fns;
                                });
                            };

                            for (_clzName in domains) {
                                _loop2(_clzName);
                            }
                            this.file_finished = true;
                            this.finish_call();

                        case 23:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function readFile() {
            return _ref2.apply(this, arguments);
        }

        return readFile;
    }();

    /**
     * 读取节点
     */


    _class.prototype.readNode = function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
            var _this3 = this;

            var host_, children, _loop3, i;

            return _regenerator2.default.wrap(function _callee3$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            host_ = {};
                            _context4.next = 3;
                            return this.getChildren('/' + this.service_group, function () {
                                _this3.readNode();
                            });

                        case 3:
                            children = _context4.sent;
                            _loop3 = _regenerator2.default.mark(function _loop3(i) {
                                var node, services, versions;
                                return _regenerator2.default.wrap(function _loop3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                node = children[i];

                                                host_[node] = [];
                                                _context3.next = 4;
                                                return _this3.getChildren('/' + _this3.service_group + '/' + node + '/' + vider);

                                            case 4:
                                                services = _context3.sent;

                                                _this3.consumer.query.interface = node;
                                                _this3.consumer.host = _this3.clientHost + '/' + node;
                                                _this3.consumer.query.timestamp = _this3.consumer.query['×tamp'] = new Date().getTime();
                                                _this3.consumer.query.version = _this3.consumer.query.revision = _this3.service_version || str;
                                                versions = [];

                                                services.forEach(function (service) {
                                                    service = decodeURIComponent(service);
                                                    var ser_param = _querystring2.default.parse(service);
                                                    if (_this3.service_version !== false && (ser_param['default.version'] || ser_param['version']) !== _this3.service_version) return;
                                                    var ser_host = _url2.default.parse(service);
                                                    if (_this3.ip !== false && ser_host.hostname !== _this3.ip) return;
                                                    host_[node].push(ser_host.host);
                                                    var version = ser_param['default.version'] || ser_param['version'];
                                                    if (versions.indexOf(version) === -1) {
                                                        versions.push(_this3.consumer.query.version = _this3.consumer.query.revision = version);
                                                        _this3.addNode('/' + _this3.service_group + '/' + node + '/consumers/' + encodeURIComponent(_url2.default.format(_this3.consumer)));
                                                    }
                                                });

                                            case 11:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _loop3, _this3);
                            });
                            i = 0;

                        case 6:
                            if (!(i < children.length)) {
                                _context4.next = 11;
                                break;
                            }

                            return _context4.delegateYield(_loop3(i), 't0', 8);

                        case 8:
                            i++;
                            _context4.next = 6;
                            break;

                        case 11:
                            this.node_finished = true;
                            this.host = host_;
                            this.finish_call();

                        case 14:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee3, this);
        }));

        function readNode() {
            return _ref4.apply(this, arguments);
        }

        return readNode;
    }();

    /**
     * 成功回调
     */


    _class.prototype.finish_call = function finish_call() {
        if (this.file_finished === true && this.node_finished === true && this.called === false) {
            this.called = true;
            this.emit('success');
        }
    };

    _class.prototype.init = function init() {
        var _this4 = this;

        this.host = {};
        this.called = false;
        this.client.once('connected', function () {
            _this4.consumer = {
                protocol: 'consumer',
                slashes: 'true',
                host: str,
                query: {
                    application: _this4.name,
                    category: 'consumers',
                    'default.timeout': _this4.connectTimeout,
                    check: 'false',
                    dubbo: _this4.dubbo_version,
                    interface: str,
                    revision: str,
                    version: str,
                    side: 'consumer',
                    timestamp: str
                }
            };
            _this4.getChildren = _toolkit2.default.P(_this4.client.getChildren, _this4.client);
            _this4.exists = _toolkit2.default.P(_this4.client.exists, _this4.client);
            _this4.createNode = _toolkit2.default.P(_this4.client.create, _this4.client);
            _this4.readNode();
        }).once('disconnected', function () {
            _this4.host = {};
        });
        _fs2.default.watch('./interface', this.readFile);
        this.readFile();
        this.client.connect();
    };

    /**
     * 添加节点
     * @param node
     */


    _class.prototype.addNode = function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(node) {
            var stat;
            return _regenerator2.default.wrap(function _callee4$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this.exists(node);

                        case 2:
                            stat = _context5.sent;

                            if (!stat) {
                                _context5.next = 5;
                                break;
                            }

                            return _context5.abrupt('return');

                        case 5:
                            this.createNode(node, 1);

                        case 6:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee4, this);
        }));

        function addNode(_x2) {
            return _ref5.apply(this, arguments);
        }

        return addNode;
    }();

    /**
     * 随机算法
     * @param length
     * @returns {number}
     */


    _class.prototype.random = function random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    /**
     * 执行方法
     * @param clzName
     * @param methodName
     * @param args
     * @returns {Promise}
     */


    _class.prototype.invoke = function invoke(clzName, methodName, args) {
        var _this5 = this;

        return new _promise2.default(function (resolve, reject) {
            if (_this5.host[clzName] === undefined || _this5.host[clzName].length === 0) {
                throw {
                    error: 'zk中找不到' + clzName + '对应的服务节点',
                    message: 'zk中找不到' + clzName + '对应的服务节点',
                    state: 101003
                };
            }
            var host = _this5.random(_this5.host[clzName]);
            var domain_ = _domain2.default.create();
            domain_.on('error', function (err) {
                throw {
                    error: err,
                    message: err,
                    state: 101003
                };
                if (err.code && err.code.toString() === 'ECONNREFUSED') {
                    throw {
                        error: '连接' + host + '/' + clzName + '失败!',
                        message: '连接' + host + '/' + clzName + '失败!',
                        state: 101002
                    };
                } else {
                    throw {
                        error: clzName + '发生错误 ' + err.code,
                        message: clzName + '发生错误 ' + err.code,
                        state: 101005
                    };
                }
            });
            domain_.run(function () {
                var proxy = new _hessianProxyGarbled2.default.Proxy('http://' + host + '/' + clzName, _this5.username, _this5.password, proxy);
                proxy.invoke(methodName, args, function (err, reply) {
                    if (reply && reply.fault === true) {
                        reject({
                            message: clzName + '/' + methodName + '发生异常!',
                            error: clzName + '/' + methodName + '发生异常!',
                            state: 101004
                        });
                    } else if (err) {
                        reject({
                            message: clzName + '/' + methodName + '发生异常：' + (0, _stringify2.default)(err),
                            error: clzName + '/' + methodName + '发生异常：' + (0, _stringify2.default)(err),
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
    };

    _class.prototype.dataCheck = function dataCheck(domain, fullName) {
        var fn = this.domains[fullName];
        var pre = {};
        for (var i in domain) {
            if (fn.hasOwnProperty(i)) {
                pre[i] = fn[i](domain[i]);
            }
        }
        pre.__type__ = fullName;
        return pre;
    };

    return _class;
}(_events2.default.EventEmitter);

exports.default = _class;
;

module.exports = exports.default;
//# sourceMappingURL=index.js.map