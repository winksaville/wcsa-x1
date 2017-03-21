/**
 * Module with routines shared by spec.ts files
 */
import * as child from "child_process";
import * as debugModule from "debug";
const debug = debugModule("spec.lib");
import * as http from "http";

export function httpGet(httpHost: string,
                        httpPort: number,
                        httpPath: string): Promise<number> {
  debug(`httpGet:+ httpPath='${httpPath}'`);
  let promise = new Promise<number>((resolve, reject) => {
    debug("httpGet.promise:+");
    try {
      let options = {
        host: httpHost,
        path: httpPath,
        port: httpPort,
      };

      http.request(options, (response) => {
        debug("httpGet.response:+");
        let str = "";

        // Handle incoming data
        response.on("data", (chunk) => {
          debug(`httpGet.response: chunk=${chunk}`);
          str += chunk;
        });

        // Handle end of data
        response.on("end", () => {
          debug(`httpGet.response: end ${response.statusCode}`);
          resolve((response.statusCode) ? response.statusCode : 500);
        });
        debug("httpGet.response:-");
      }).end();
    } catch (err) {
      reject(`err=${err}`);
    }
    debug("httpGet.promise:-");
  });
  debug("httpGet:-");
  return promise;
}

async function waitTillStarted(
    server: child.ChildProcess,
    port: number,
    timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Listen for the running message
    const listener = (data: Buffer) => {
      const expected = `running PORT=${port}`;
      debug(`waitTillStarted: data='${data}'`);
      if (data.toString() === expected) {
        clearTimeout(timeoutId);
        server.stdout.removeListener("data", listener);
        debug(`waiTillStarted: found 'running PORT=${port}'`);
        resolve();
      }
    };
    server.stdout.on("data", listener);

    // But only wait for timeoutMs
    const timeoutId = setTimeout(() => {
      server.stdout.removeListener("data", listener);
      server.kill();
      reject();
    }, timeoutMs);
  });
}

export async function startServer(
    port: number,
    timeoutMs: number,
    serverPath: string): Promise<child.ChildProcess> {
  // Start the server
  let server = await child.spawn("node", [ serverPath ]);

  // Wait till server starts
  await waitTillStarted(server, port, timeoutMs)
      .then(() => {
        debug("setupFixture: server started");
      })
      .catch(() => {
        throw new Error(`setupFixture: server NOT started ${port}`);
      });

  server.stdout.on("data", (data) => {
    debug(`server.stdout: ${data}`);
  });
  server.stderr.on("data", (data) => {
    debug(`server.stderr: ${data}`);
  });
  server.on("close", (code) => {
    debug(`server: exited with ${code}`);
  });
  server.on("error", (err) => {
    debug(`server: error ${err}`);
  });

  return server;
}
