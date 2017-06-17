window.$fsmp$ = (function() {
    function loadRemoteScript(url) {
        return Promise.resolve().then(function() {
            if (FuseBox.isBrowser) {
                let d = document;
                var head = d.getElementsByTagName("head")[0];
                var target;
                if (/\.css$/.test(url)) {
                    target = d.createElement("link");
                    target.rel = "stylesheet";
                    target.type = "text/css";
                    target.href = url;
                } else {
                    target = d.createElement("script");
                    target.type = "text/javascript";
                    target.src = url;
                    target.async = true;
                }
                head.insertBefore(target, head.firstChild);
            }
        });
    }

    function request(url, cb) {
        if (FuseBox.isServer) {
            cb(null, require(url));
        } else {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
                if (this.readyState == 4) {
                    cb(this.status == 200 ? 0 : 1, this.responseText, request.getResponseHeader("Content-Type"));
                }
            };
            request.open("GET", url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.send();
        }
    }

    function evaluateModule(id, code) {
        var fn = new Function('module', 'exports', code);
        var moduleExports = {};
        var moduleObject = { exports: moduleExports };
        fn(moduleObject, moduleExports);
        return moduleObject.exports;
    }

    return function(id) {
        return new Promise((resolve, reject) => {
            if (FuseBox.exists(id)) {
                return resolve(FuseBox.import(id));
            }

            var isCSS = /\.css$/.test(id);
            if (FuseBox.isServer) {
                if (isCSS) {
                    return reject("Can't load CSS on server!");
                }
            }
            // id.charCodeAt(4) = : which means http
            if (FuseBox.isBrowser) {
                if ((name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) || isCSS) {
                    return loadRemoteScript(id);
                }
            }
            var splitConfig = FuseBox.global("__fsbx__bundles__");

            if (splitConfig && splitConfig.bundles) {
                if (splitConfig.bundles[id]) {
                    return resolve(FuseBox.import("~/" + splitConfig.bundles[id].main))
                }
            }

            request(id, function(error, contents, type) {
                var data;
                if (type && FuseBox.isBrowser) {
                    if (/javascript/.test(type)) {
                        data = evaluateModule(id, contents);
                    } else if (/json/.test(type)) {
                        data = JSON.parse(contents);
                    } else if (!/javascript/.test(type)) {
                        data = contents;
                    }
                } else {
                    data = contents;
                }
                return resolve(data);
            });
        });
    };
})();