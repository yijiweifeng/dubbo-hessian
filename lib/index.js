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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

    Dubbo.invoke = function invoke(clzName, methodName, args, host) {
        if (Adubbo !== false) return Adubbo._invoke(clzName, methodName, args, host);
    };

    Dubbo.election = function election(arr) {
        if (Adubbo !== false) return Adubbo._election(arr);
    };

    Dubbo.prototype._readFile = function () {
        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
            var _this2 = this;

            var type = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!(type < 2)) {
                                _context4.next = 2;
                                break;
                            }

                            return _context4.delegateYield(_regenerator2.default.mark(function _callee() {
                                var domains;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return readDir('./interface/domain');

                                            case 2:
                                                domains = _context.sent;

                                                _this2._domains = {};
                                                domains.forEach(function (ele, index) {
                                                    return domains[index] = './interface/domain/' + ele;
                                                });
                                                _context.next = 7;
                                                return parser2(domains);

                                            case 7:
                                                domains = _context.sent;

                                                (0, _keys2.default)(domains).forEach(function (clzName) {
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
                                                });

                                            case 9:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this2);
                            })(), 't0', 2);

                        case 2:
                            if (!(type !== 1)) {
                                _context4.next = 4;
                                break;
                            }

                            return _context4.delegateYield(_regenerator2.default.mark(function _callee3() {
                                var services;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.next = 2;
                                                return readDir('./interface/service');

                                            case 2:
                                                services = _context3.sent;

                                                _this2._service = {};
                                                services.forEach(function (ele, index) {
                                                    return services[index] = './interface/service/' + ele;
                                                });
                                                _context3.next = 7;
                                                return parser2(services);

                                            case 7:
                                                services = _context3.sent;

                                                (0, _keys2.default)(services).forEach(function (clzName) {
                                                    var methods = {};
                                                    var name = clzName.substr(clzName.lastIndexOf('.') + 1);
                                                    services[clzName].methods.forEach(function (method) {
                                                        var fns = [];
                                                        method.args.forEach(function (el) {
                                                            switch (el) {
                                                                case 'java.lang.String':
                                                                    fns.push(function (value) {
                                                                        if (value === null || value === undefined || value === 'null') {
                                                                            return null;
                                                                        }
                                                                        return _toolkit2.default.stringSafeChange(_this2._strictString, value + str);
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
                                                                                    value.forEach(function (valuei, i) {
                                                                                        if (valuei !== null && valuei !== undefined) {
                                                                                            value[i] = _this2._dataCheck(valuei, type_);
                                                                                        }
                                                                                    });
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
                                                            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                                                                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                                                                    args[_key] = arguments[_key];
                                                                }

                                                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                                    while (1) {
                                                                        switch (_context2.prev = _context2.next) {
                                                                            case 0:
                                                                                if (!(args.length !== _this2._service[name][method.name].check.length)) {
                                                                                    _context2.next = 3;
                                                                                    break;
                                                                                }

                                                                                _this2.emit('error', {
                                                                                    host: null,
                                                                                    className: clzName,
                                                                                    methodName: method.name,
                                                                                    param: args,
                                                                                    time: 0,
                                                                                    error: '调用' + clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!'
                                                                                });
                                                                                throw {
                                                                                    state: 101006,
                                                                                    status: 101006,
                                                                                    statusMessage: '调用' + clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!',
                                                                                    message: '调用' + clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!',
                                                                                    error: '调用' + clzName + '/' + method.name + '参数不符,期望' + _this2._service[name][method.name].check.length + '个,传了' + args.length + '个!'
                                                                                };

                                                                            case 3:
                                                                                args.forEach(function (value, index) {
                                                                                    args[index] = _this2._service[name][method.name].check[index](value);
                                                                                });
                                                                                _context2.next = 6;
                                                                                return _this2._invoke(clzName, method.name, args);

                                                                            case 6:
                                                                                return _context2.abrupt('return', _context2.sent);

                                                                            case 7:
                                                                            case 'end':
                                                                                return _context2.stop();
                                                                        }
                                                                    }
                                                                }, _callee2, _this2);
                                                            }));

                                                            return function (_x4) {
                                                                return _ref3.apply(this, arguments);
                                                            };
                                                        }();
                                                        methods[method.name].check = fns;
                                                    });
                                                    _this2._service[name] = methods;
                                                    if (_this2._host[clzName]) {
                                                        _this2.emit(name, _this2._host[clzName]);
                                                    }
                                                });

                                            case 9:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this2);
                            })(), 't1', 4);

                        case 4:

                            if (type === 0) {
                                this._file_finished = true;
                                this._finish_call();
                            }

                        case 5:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function _readFile(_x2) {
            return _ref2.apply(this, arguments);
        }

        return _readFile;
    }();

    Dubbo.prototype._readNode = function () {
        var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(node) {
            var _this3 = this;

            var children;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (!(node === undefined)) {
                                _context6.next = 10;
                                break;
                            }

                            _context6.next = 3;
                            return this._getChildren('/' + this._service_group, function () {
                                return _this3._readNode();
                            });

                        case 3:
                            children = _context6.sent;

                            children.forEach(function (child) {
                                return _this3._readNode(child);
                            });
                            this._node_finished = true;
                            this._finish_call();
                            this.emit('node');
                            _context6.next = 11;
                            break;

                        case 10:
                            return _context6.delegateYield(_regenerator2.default.mark(function _callee5() {
                                var hosts, services, consumer, name;
                                return _regenerator2.default.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                hosts = [];

                                                if (_this3._version[node] === undefined) {
                                                    _this3._version[node] = [];
                                                }
                                                _context5.next = 4;
                                                return _this3._getChildren('/' + _this3._service_group + '/' + node + '/' + vider, function () {
                                                    return _this3._readNode(node);
                                                });

                                            case 4:
                                                services = _context5.sent;
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
                                                    hosts.findIndex(function (h) {
                                                        return h === ser_host.host;
                                                    }) === -1 && hosts.push(ser_host.host);
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
                                                _this3.emit('node-' + name, _this3._host[node]);

                                            case 15:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this3);
                            })(), 't0', 11);

                        case 11:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        function _readNode(_x5) {
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
        this._domains = {};
        this._service = {};
        this._called = false;
        this._client.once('connected', function () {
            _this4._getChildren = _toolkit2.default.P(_this4._client.getChildren, _this4._client);
            _this4._exists = _toolkit2.default.P(_this4._client.exists, _this4._client);
            _this4._createNode = _toolkit2.default.P(_this4._client.create, _this4._client);
            _this4._readNode();
        }).once('disconnected', function () {});

        //fs.watch('./interface/domain', () => this._readFile(1));
        //fs.watch('./interface/service', () => this._readFile(2));
        this._readFile();
        this._client.connect();
    };

    Dubbo.prototype._addNode = function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(node) {
            var stat;
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.next = 2;
                            return this._exists(node);

                        case 2:
                            stat = _context7.sent;

                            if (!stat) {
                                _context7.next = 5;
                                break;
                            }

                            return _context7.abrupt('return');

                        case 5:
                            this._createNode(node, 1);

                        case 6:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        function _addNode(_x6) {
            return _ref5.apply(this, arguments);
        }

        return _addNode;
    }();

    Dubbo.prototype._election = function _election(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    Dubbo.prototype._invoke = function _invoke(clzName, methodName, args, host) {
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
                    status: 101002,
                    statusMessage: clzName + '/' + methodName + 'zk中找不到对应的服务节点',
                    message: clzName + '/' + methodName + 'zk中找不到对应的服务节点',
                    error: clzName + '/' + methodName + 'zk中找不到对应的服务节点',
                    state: 101002
                };
            }
            if (host === undefined) {
                host = _this5._election(_this5._host[clzName]);
            }
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
                            error: host + '/' + clzName + '/' + methodName + '发生故障' + (0, _stringify2.default)(reply) + '!'
                        });
                        reject({
                            message: host + '/' + clzName + '/' + methodName + '发生故障' + (0, _stringify2.default)(reply) + '!',
                            error: host + '/' + clzName + '/' + methodName + '发生故障' + (0, _stringify2.default)(reply) + '!',
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
            (0, _keys2.default)(fn).forEach(function (i) {
                return pre[i] = fn[i]('');
            });
        } else {
            (0, _keys2.default)(domain).forEach(function (i) {
                return fn.hasOwnProperty(i) && (pre[i] = fn[i](domain[i]));
            });
        }
        pre.__type__ = fullName;
        return pre;
    };

    (0, _createClass3.default)(Dubbo, null, [{
        key: 'service',
        get: function get() {
            if (Adubbo !== false) return Adubbo._service;
        }
    }, {
        key: 'domain',
        get: function get() {
            if (Adubbo !== false) return Adubbo._domains;
        }
    }]);
    return Dubbo;
}(_events2.default.EventEmitter);

exports.default = Dubbo;

module.exports = exports.default;
//# sourceMappingURL=index.js.map