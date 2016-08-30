/**
 * Created by cc on 16/8/11.
 *
 * 初始化 require(..).one(参数) ：
 *      初始化参数是json对象，key的含义如下:
 *      name（app标识）,
 *      zk(注册中心地址 ip:port
 *      host 本机IP
 *      connectTimeout 连接超时时间,
 *      retries 错误重试次数
 *      dubbo_version(展示到注册中心的消费者dubbo版本,默认2.8.4),
 *      service_version(服务版本,默认为任意版本,不为空时在ZK中心只获取指定版本的服务),
 *      service_group = '_service'(服务分组,默认dubbo,这也是dubbo服务端在不指定分组时的默认分组)
 *      strictString = true(是否过滤所有提交字符串中的script/frame等)
 *      host(固定调用的服务器地址ip,不传表示调用任意地址,例如 10.0.0.1表示只调用10.0.0.1上的服务)
 *      username zk用户名
 *      password zk密码
 *      data 数据处理方法,如果不传则将服务端返回的数据原生不动返回,该方法将接收一个参数，即服务器返回的数据；允许直接throw异常
 *
 *  关于异常格式：
 *      json对象，state=错误编码和message=错误消息
 *  内置的错误码：
 *      101006 参数不符
 *      101002 找不到节点
 *      101005 连接失败
 *      101004 服务端异常
 *  事件说明：
 *  绑定事件前需要先初始化
 *      require(..).on()
 *  on('接口名称') 这个接口初始化完毕，已经可以调用了,事件参数=接口对应的host列表
 *  on('data') 从服务器接收到数据时触发，事件参数=host，className，methodName，param，time，data
 *  on('error') 发生异常时触发，事件参数=host，className，methodName，param，time，error
 *  on('all')  全部初始化完毕
 *  新建实体类：
 *      require(..).domain.实体类名称();
 *  如何调用服务端代码
 *      require(..).service.接口名称.方法名(参数).then().catch(); 参数自动做类型转换
 */
'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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

var Adubbo = false;

var Dubbo = function (_events$EventEmitter) {
    (0, _inherits3.default)(Dubbo, _events$EventEmitter);

    function Dubbo() {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        var _ref$name = _ref.name;
        var name = _ref$name === undefined ? 'node_client' : _ref$name;
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
        var data = _ref.data;
        (0, _classCallCheck3.default)(this, Dubbo);

        if (!zk) {
            throw '必须定义zk地址!';
        }
        if (_fs2.default.existsSync('./interface') === false) {
            throw 'interface目录不存在!';
        }

        var _this = (0, _possibleConstructorReturn3.default)(this, _events$EventEmitter.call(this));

        _this._client = _nodeZookeeperClient2.default.createClient(zk, {
            connectTimeout: connectTimeout,
            retries: retries
        });
        _this._connectTimeout = connectTimeout;
        _this._name = name;
        _this._service_version = dubbo_version;
        _this._service_version = service_version;
        _this._service_group = service_group;
        _this._strictString = strictString;
        _this._ip = ip;
        _this._clientHost = host;
        _this._username = username;
        _this._password = password;
        _this._data = data;
        _this._init();
        return _this;
    }

    Dubbo.one = function one(param) {
        if (Adubbo === false) {
            Adubbo = new Dubbo(param);
        }
        return this;
    };

    Dubbo.on = function on(event, fn) {
        if (Adubbo !== false) {
            Adubbo.on(event, fn);
        }
        return this;
    };

    Dubbo.prototype._readFile = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
            var _this2 = this;

            var domains, _loop, clzName, methods, _loop2, _clzName;

            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return readDir('./interface/domain');

                        case 2:
                            domains = _context2.sent;

                            this._domains = {};
                            this._service = {};
                            domains.forEach(function (ele, index) {
                                return domains[index] = './interface/domain/' + ele;
                            });
                            _context2.next = 8;
                            return parser2(domains);

                        case 8:
                            domains = _context2.sent;

                            _loop = function _loop(clzName) {
                                var fns = {};
                                var name = clzName.substr(clzName.lastIndexOf('.') + 1);
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
                                                    return _toolkit2.default.stringSafeChange(_this2._strictString, value + str);
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
                                _this2._domains[clzName] = fns;
                                _this2._domains[name] = function () {
                                    return _this2._dataCheck(false, clzName);
                                };
                            };

                            for (clzName in domains) {
                                _loop(clzName);
                            }
                            _context2.next = 13;
                            return readDir('./interface/service');

                        case 13:
                            domains = _context2.sent;

                            domains.forEach(function (ele, index) {
                                return domains[index] = './interface/service/' + ele;
                            });
                            _context2.next = 17;
                            return parser2(domains);

                        case 17:
                            domains = _context2.sent;
                            methods = {};

                            _loop2 = function _loop2(_clzName) {
                                var name = _clzName.substr(_clzName.lastIndexOf('.') + 1);
                                _this2._service[name] = {};
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
                                                if (_this2._domains[type_] !== undefined) {
                                                    if (isArray === true) {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                for (var i = 0; i < value.length; i++) {
                                                                    if (value[i] !== null && value[i] !== undefined) {
                                                                        value[i] = _this2._dataCheck(value[i], type_);
                                                                    }
                                                                }
                                                            }
                                                            return value;
                                                        });
                                                    } else {
                                                        fns.push(function (value) {
                                                            if (value !== null && value !== undefined) {
                                                                value = _this2._dataCheck(value, type_);
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
                                    methods[method.name] = function () {
                                        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                                            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                                args[_key] = arguments[_key];
                                            }

                                            return _regenerator2.default.wrap(function _callee$(_context) {
                                                while (1) {
                                                    switch (_context.prev = _context.next) {
                                                        case 0:
                                                            if (!(args.length !== _this2._service[name][method.name].check.length)) {
                                                                _context.next = 3;
                                                                break;
                                                            }

                                                            _this2.emit('error', {
                                                                host: null,
                                                                className: _clzName,
                                                                methodName: method.name,
                                                                param: args,
                                                                time: 0,
                                                                error: '调用' + _clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!'
                                                            });
                                                            throw {
                                                                stata: 101006,
                                                                message: '调用' + _clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!',
                                                                error: '调用' + _clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!'
                                                            };

                                                        case 3:
                                                            args.forEach(function (value, index) {
                                                                return args[index] = _this2._service[name][method.name].check[index](value);
                                                            });
                                                            _context.next = 6;
                                                            return _this2._invoke(_clzName, method.name, args);

                                                        case 6:
                                                            return _context.abrupt('return', _context.sent);

                                                        case 7:
                                                        case 'end':
                                                            return _context.stop();
                                                    }
                                                }
                                            }, _callee, _this2);
                                        }));

                                        return function (_x2) {
                                            return _ref3.apply(this, arguments);
                                        };
                                    }();
                                    methods[method.name].check = fns;
                                });
                                _this2._service[name] = methods;
                                if (_this2._host[_clzName]) {
                                    _this2.emit(name, _this2._host[_clzName]);
                                }
                            };

                            for (_clzName in domains) {
                                _loop2(_clzName);
                            }
                            this._file_finished = true;
                            this._finish_call();

                        case 23:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        function _readFile() {
            return _ref2.apply(this, arguments);
        }

        return _readFile;
    }();

    Dubbo.prototype._readNode = function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(node) {
            var _this3 = this;

            var children, i;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!(node === undefined)) {
                                _context4.next = 9;
                                break;
                            }

                            _context4.next = 3;
                            return this._getChildren('/' + this._service_group, function () {
                                return _this3._readNode();
                            });

                        case 3:
                            children = _context4.sent;

                            for (i = 0; i < children.length; i++) {
                                this._readNode(children[i]);
                            }
                            this._node_finished = true;
                            this._finish_call();
                            _context4.next = 10;
                            break;

                        case 9:
                            return _context4.delegateYield(_regenerator2.default.mark(function _callee3() {
                                var hosts, services, consumer, name;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                hosts = [];

                                                if (_this3._version[node] === undefined) {
                                                    _this3._version[node] = [];
                                                }
                                                _context3.next = 4;
                                                return _this3._getChildren('/' + _this3._service_group + '/' + node + '/' + vider, function () {
                                                    return _this3._readNode(node);
                                                });

                                            case 4:
                                                services = _context3.sent;
                                                consumer = _this3._consumer();
                                                name = node.substr(node.lastIndexOf('.') + 1);

                                                consumer.query.interface = node;
                                                consumer.host = _this3._clientHost + '/' + node;
                                                consumer.query.timestamp = consumer.query['×tamp'] = new Date().getTime();
                                                consumer.query.version = consumer.query.revision = _this3._service_version || str;
                                                services.forEach(function (service) {
                                                    service = decodeURIComponent(service);
                                                    var ser_param = _querystring2.default.parse(service);
                                                    if (_this3._service_version !== false && (ser_param['default.version'] || ser_param['version']) !== _this3._service_version) return;
                                                    var ser_host = _url2.default.parse(service);
                                                    if (_this3._ip !== false && ser_host.hostname !== _this3._ip) return;
                                                    hosts.push(ser_host.host);
                                                    var version = ser_param['default.version'] || ser_param['version'];
                                                    if (_this3._version[node].indexOf(version) === -1) {
                                                        _this3._version[node].push(consumer.query.version = consumer.query.revision = version);
                                                        _this3._addNode('/' + _this3._service_group + '/' + node + '/consumers/' + encodeURIComponent(_url2.default.format(consumer)));
                                                    }
                                                });
                                                _this3._host[node] = hosts;
                                                if (_this3._service[name]) {
                                                    _this3.emit(name, _this3._host[node]);
                                                }

                                            case 14:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this3);
                            })(), 't0', 10);

                        case 10:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function _readNode(_x3) {
            return _ref4.apply(this, arguments);
        }

        return _readNode;
    }();

    Dubbo.prototype._finish_call = function _finish_call() {
        if (this._file_finished === true && this._node_finished === true && this._called === false) {
            this._called = true;
            this.emit('all');
        }
    };

    Dubbo.prototype._consumer = function _consumer() {
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
    };

    Dubbo.prototype._init = function _init() {
        var _this4 = this;

        this._host = {};
        this._version = {};
        this._called = false;
        this._client.once('connected', function () {
            _this4._getChildren = _toolkit2.default.P(_this4._client.getChildren, _this4._client);
            _this4._exists = _toolkit2.default.P(_this4._client.exists, _this4._client);
            _this4._createNode = _toolkit2.default.P(_this4._client.create, _this4._client);
            _this4._readNode();
        }).once('disconnected', function () {
            return _this4._host = {};
        });
        _fs2.default.watch('./interface', this._readFile);
        this._readFile();
        this._client.connect();
    };

    Dubbo.prototype._addNode = function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(node) {
            var stat;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this._exists(node);

                        case 2:
                            stat = _context5.sent;

                            if (!stat) {
                                _context5.next = 5;
                                break;
                            }

                            return _context5.abrupt('return');

                        case 5:
                            this._createNode(node, 1);

                        case 6:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function _addNode(_x4) {
            return _ref5.apply(this, arguments);
        }

        return _addNode;
    }();

    Dubbo.prototype._random = function _random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    Dubbo.prototype._invoke = function _invoke(clzName, methodName, args) {
        var _this5 = this;

        return new _promise2.default(function (resolve, reject) {
            var begin = +new Date();
            if (_this5._host[clzName] === undefined || _this5._host[clzName].length === 0) {
                _this5.emit('error', {
                    host: null,
                    className: clzName,
                    methodName: methodName,
                    param: args,
                    time: 0,
                    error: clzName + '/' + methodName + 'zk中找不到对应的服务节点'
                });
                throw {
                    message: clzName + '/' + methodName + 'zk中找不到对应的服务节点',
                    error: clzName + '/' + methodName + 'zk中找不到对应的服务节点',
                    state: 101002
                };
            }
            var host = _this5._random(_this5._host[clzName]);
            var domain_ = _domain2.default.create();
            domain_.on('error', function (err) {
                if (err.code && err.code.toString() === 'ECONNREFUSED') {
                    var end = +new Date();
                    _this5.emit('error', {
                        host: host,
                        className: clzName,
                        methodName: methodName,
                        param: args,
                        time: end - begin,
                        error: host + '/' + clzName + '/' + methodName + '连接失败!'
                    });
                    reject({
                        message: host + '/' + clzName + '/' + methodName + '连接失败!',
                        error: host + '/' + clzName + '/' + methodName + '连接失败!',
                        state: 101005
                    });
                } else {
                    var _end = +new Date();
                    _this5.emit('error', {
                        host: host,
                        className: clzName,
                        methodName: methodName,
                        param: args,
                        time: _end - begin,
                        error: host + '/' + clzName + '/' + methodName + '发生未知异常:' + (0, _stringify2.default)(err) + '!'
                    });
                    reject({
                        message: host + '/' + clzName + '/' + methodName + '发生未知异常:' + (0, _stringify2.default)(err) + '!',
                        error: host + '/' + clzName + '/' + methodName + '发生未知异常:' + (0, _stringify2.default)(err) + '!',
                        state: 101004
                    });
                }
            });
            domain_.run(function () {
                var proxy = new _hessianProxyGarbled2.default.Proxy('http://' + host + '/' + clzName, _this5._username, _this5._password, proxy);
                proxy.invoke(methodName, args, function (err, reply) {
                    if (reply && reply.fault === true) {
                        var end = +new Date();
                        _this5.emit('error', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: end - begin,
                            error: host + '/' + clzName + '/' + methodName + '发生故障!'
                        });
                        reject({
                            message: host + '/' + clzName + '/' + methodName + '发生故障!',
                            error: host + '/' + clzName + '/' + methodName + '发生故障!',
                            state: 101004
                        });
                    } else if (err) {
                        var _end2 = +new Date();
                        _this5.emit('error', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: _end2 - begin,
                            error: host + '/' + clzName + '/' + methodName + '发生异常' + (0, _stringify2.default)(err) + '!'
                        });
                        reject({
                            message: host + '/' + clzName + '/' + methodName + '发生异常' + (0, _stringify2.default)(err) + '!',
                            error: host + '/' + clzName + '/' + methodName + '发生异常' + (0, _stringify2.default)(err) + '!',
                            state: 101004
                        });
                    } else {
                        var _end3 = +new Date();
                        _this5.emit('data', {
                            host: host,
                            className: clzName,
                            methodName: methodName,
                            param: args,
                            time: _end3 - begin,
                            data: reply
                        });
                        if (_this5._data) {
                            try {
                                resolve(_this5._data(reply));
                            } catch (error) {
                                _this5.emit('error', {
                                    host: host,
                                    className: clzName,
                                    methodName: methodName,
                                    param: args,
                                    time: _end3 - begin,
                                    error: host + '/' + clzName + '/' + methodName + '发生异常' + (0, _stringify2.default)(error) + '!'
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
    };

    Dubbo.prototype._dataCheck = function _dataCheck(domain, fullName) {
        var fn = this._domains[fullName];
        var pre = {};
        if (domain === false) {
            for (var i in fn) {
                pre[i] = fn[i](null);
            }
        } else {
            for (var i in domain) {
                if (fn.hasOwnProperty(i)) {
                    pre[i] = fn[i](domain[i]);
                }
            }
        }
        pre._type_ = fullName;
        return pre;
    };

    (0, _createClass3.default)(Dubbo, null, [{
        key: 'service',
        get: function get() {
            return Adubbo._service;
        }
    }, {
        key: 'domain',
        get: function get() {
            return Adubbo._domains;
        }
    }]);
    return Dubbo;
}(_events2.default.EventEmitter);

exports.default = Dubbo;

module.exports = exports.default;
//# sourceMappingURL=index.js.map