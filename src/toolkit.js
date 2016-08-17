/**
 * Created by cc on 16/8/12.
 */
'use strict';

export default  {
    evaluation: ["script", "frame", "onclick", "location", "href", "submit"],
    stringSafeChange: function (strictString, str) {
        return strictString === true ? str.replace(this.evaluation, "*") : str;
    },
    firstLowCase: function (name) {
        return name.replace(/\w/, function (v) {
            return v.toLowerCase();
        });
    },
    P: function (fn) {
        return function () {
            let args = Array.from(arguments);
            return new Promise((resolve, reject) => {
                args.push((err, data) => {
                    if (err !== null) reject(err);
                    else resolve(data);
                });
                fn.call(this, args);
            });
        };
    },
    dataCheck: function (domain,fullName) {
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
    },
}