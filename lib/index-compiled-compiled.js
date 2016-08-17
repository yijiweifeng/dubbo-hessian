/**
 * Created by cc on 16/8/11.
 */
'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _nodeZookeeperClient = require('node-zookeeper-client');

var _nodeZookeeperClient2 = _interopRequireDefault(_nodeZookeeperClient);

var _javaClassParser = require('java-class-parser');

var _javaClassParser2 = _interopRequireDefault(_javaClassParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

require('babel-runtime/core-js/promise').default = require('bluebird');
global.Promise = require('bluebird');

var P = function P(fn) {
    return function () {
        var _this = this;

        var args = (0, _from2.default)(arguments);
        return new _promise2.default(function (resolve, reject) {
            args.push(function (err, data) {
                if (err !== null) reject(err);else resolve(data);
            });
            fn.call(_this, args);
        });
    };
};

var A = function () {
    function A() {
        (0, _classCallCheck3.default)(this, A);
    }

    /**
     * @param json,key= name（app标识）,zk(注册中心地址 ip:port),dubbo_version(展示到注册中心的dubbo版本,默认2.8.4),service_version(服务版本,默认为任意版本),service_group = 'dubbo'(服务分组,默认dubbo)
     */
    A.prototype.asconstructor = function asconstructor() {
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

        this.client = _nodeZookeeperClient2.default.createClient(zk, connectTimeout, retries);
        var readdir = P(_fs2.default.readdir);

        this.client.once('connected', function () {});
    };

    return A;
}();

exports.default = A;

var a = new A();

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

//# sourceMappingURL=index-compiled.js.map
//# sourceMappingURL=index-compiled.js.map

//# sourceMappingURL=index-compiled-compiled.js.map