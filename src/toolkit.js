/**
 * Created by cc on 16/8/12.
 */
'use strict';

export default  {
    evaluation: ['script', 'frame', 'onclick', 'location', 'href', 'submit'],
    stringSafeChange: function (strictString, str) {
        return strictString === true ? str.replace(this.evaluation, '*') : str;
    },
    firstLowCase: function (name) {
        return name.replace(/\w/, v => {
            return v.toLowerCase();
        });
    },
    P: function (fn,target) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                args.push((err,...data) => {
                    if (err === null) return resolve.apply(this, data);
                    return reject(err);
                });
                fn.apply(target, args);
            });
        };
    }
};

module.exports = exports.default;