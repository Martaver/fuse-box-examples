const {
    Sparky,
    FuseBox,
    UglifyJSPlugin,
    QuantumPlugin,
    WebIndexPlugin,
    CSSPlugin,
    EnvPlugin,
    SassPlugin,
    CSSModules
} = require("fuse-box");
const express = require("express");
const path = require("path");
let producer;
let production = false;

Sparky.task("build", () => {
    const fuse = FuseBox.init({
        homeDir: "src",
        output: "dist/static/$name.js",
        hash: production,
        target: "browser",
        sourceMaps: true,
        experimentalFeatures: true,
        cache: !production,
        plugins: [
            EnvPlugin({
                NODE_ENV: production ? "production" : "development"
            }), [
                SassPlugin({
                    importer: true
                }),
                CSSModules({}),
                CSSPlugin({})
            ],
            WebIndexPlugin({
                title: "React Code Splitting demo",
                template: "src/index.html",
                path: "/static/"
            }),
            production && QuantumPlugin({
                treeshake: true,
                removeExportsInterop: false,
                uglify: false
            })
        ]
    });

    //if (!production) {
    // Configure development server
    fuse.dev({
        root: false
    }, server => {
        const dist = path.join(__dirname, "dist");
        const app = server.httpServer.app;
        app.use("/static/", express.static(path.join(dist, 'static')));
        app.get("*", function(req, res) {
            res.sendFile(path.join(dist, "static/index.html"));
        });
    })

    fuse.register("typescript-collections", {
        main: "dist/lib/index.js",
        homeDir: "node_modules/typescript-collections",
        instructions: " "
    })



    //  }

    // extract dependencies automatically
    const vendor = fuse.bundle("vendor")
        .instructions(`~ **/**.{ts,tsx} +tslib`)
    if (!production) {
        vendor.hmr();
    }

    const app = fuse.bundle("app")
        // Code splitting ****************************************************************
        .splitConfig({
            browser: "/static/",
            dest: "bundles/"
        })
        .split("routes/about/**", "about > routes/about/AboutComponent.tsx")
        .split("routes/contact/**", "contact > routes/contact/ContactComponent.tsx")
        .split("routes/home/**", "home > routes/home/HomeComponent.tsx")
        // bundle the entry point without deps
        // bundle routes for lazy loading as there is not require statement in or entry point
        .instructions(`> [app.tsx] + [routes/**/**.{ts, tsx}]`)

    if (!production) {
        app.hmr().watch()
    }

    return fuse.run();
});

// main task
Sparky.task("default", ["clean", "build"], () => {});

// wipe it all
Sparky.task("clean", () => Sparky.src("dist/*").clean("dist/"));



Sparky.task("set-production-env", () => production = true);
Sparky.task("dist", ["clean", "set-production-env", "build"], () => {})
