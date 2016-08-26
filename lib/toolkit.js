/**
 * Created by cc on 16/8/12.
 */
'use strict';

exports.__esModule = true;

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    evaluation: ["script", "frame", "onclick", "location", "href", "submit"],
    stringSafeChange: function stringSafeChange(strictString, str) {
        return strictString === true ? str.replace(this.evaluation, "*") : str;
    },
    firstLowCase: function firstLowCase(name) {
        return name.replace(/\w/, function (v) {
            return v.toLowerCase();
        });
    },
    P: function P(fn) {
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
    },
    dataCheck: function dataCheck(domain, fullName) {
        var interfacex;
        if (domainName !== null) {
            interfacex = domainFn[domainName];
            if (interfacex === undefined) {
                return domain;
            }
            fullName = domains[domainName];
        } else if (fullName !== null) {
            var index = domains.indexOf(fullName);
            if (index === -1) {
                return domain;
            }
            interfacex = domainFn[index];
            if (interfacex === undefined) {
                return domain;
            }
        }
        var pre = {};
        for (var i in domain) {
            if (interfacex.hasOwnProperty(i)) {
                pre[i] = interfacex[i](domain[i]);
            }
        }
        pre.__type__ = fullName;
        return pre;
    }
};
//# sourceMappingURL=toolkit.js.map