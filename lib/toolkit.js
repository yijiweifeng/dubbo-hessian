/**
 * Created by cc on 16/8/12.
 */
'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    evaluation: ['script', 'frame', 'onclick', 'location', 'href', 'submit'],
    stringSafeChange: function stringSafeChange(strictString, str) {
        return strictString === true ? str.replace(this.evaluation, '*') : str;
    },
    firstLowCase: function firstLowCase(name) {
        return name.replace(/\w/, function (v) {
            return v.toLowerCase();
        });
    },
    P: function P(fn, target) {
        var _this = this;

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new _promise2.default(function (resolve, reject) {
                args.push(function (err) {
                    for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        data[_key2 - 1] = arguments[_key2];
                    }

                    if (err === null) return resolve.apply(_this, data);
                    return reject(err);
                });
                fn.apply(target, args);
            });
        };
    }
};


module.exports = exports.default;
//# sourceMappingURL=toolkit.js.map