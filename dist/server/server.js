"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var http = require("http");
var nop = require("../../dist/common/nop");
var debugModule = require("debug");
var debug = debugModule("server");
var PORT = 3000;
// Create a server and the handler for a few requests
var httpServer = http.createServer(function (req, res) {
    debug("req.url=%s res=%s", req.url, res);
    switch (req.url) {
        case "/": {
            // Use a routine from common
            nop();
            // Write the header
            res.writeHead(200, {
                "charset": "UTF-8",
                "content-type": "text/html",
            });
            // Send index.html as the content
            fs.createReadStream("./public/index.html").pipe(res);
            break;
        }
        case "/build/bundle.js": {
            // Write the header
            res.writeHead(200, {
                "charset": "UTF-8",
                "content-type": "text/javascript",
            });
            // Send bundle.js as the content
            fs.createReadStream("./dist/client/bundle.js").pipe(res);
            break;
        }
        default: {
            debug("default: req.url=" + req.url);
            // Not found send a 404 header
            res.writeHead(404, {
                "charset": "UTF-8",
                "content-type": "text/html",
            });
            // And the content is the url
            res.end("bad req.url=" + req.url);
            break;
        }
    }
});
// Start it listening on the desired port
httpServer.listen(PORT, function () {
    debug("Listening on: http://localhost:%s", PORT);
});
//# sourceMappingURL=server.js.map