import * as fs from "fs";
import * as http from "http";
import nop = require("../../dist/common/nop");

import * as debugModule from "debug";

const debug = debugModule("server");

const PORT: number = 3000;

// Create a server and the handler for a few requests
const httpServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
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
httpServer.listen(PORT, () => {
  debug("Listening on: http://localhost:%s", PORT);
});
