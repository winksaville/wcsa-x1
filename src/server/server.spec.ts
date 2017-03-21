import * as child from "child_process";
import { httpGet, startServer } from "../common/spec.lib";

import {
  AsyncSetupFixture,
  AsyncTeardownFixture,
  AsyncTest,
  Expect,
  TestFixture,
} from "alsatian";

import * as debugModule from "debug";
const debug = debugModule("server.spec");

const PORT = 3000;

@TestFixture("Server tests")
export class ServerTests {
  public server: child.ChildProcess;

  @AsyncSetupFixture
  public async setupFixture() {

    debug("setupFixture:+");

    // Start server
    this.server = await startServer(PORT, 5000, "./dist/server/server.js");

    // Get the root page
    debug("setupFixture: call httpGet '/'");
    await httpGet("localhost", PORT, "/")
                .then((statusCode) => debug(`httpGet: '/' statusCode=${statusCode}`))
                .catch((err) => debug(`httpGet: '/' ERR=${err}`));

    debug("setupFixture:-");
  }

  @AsyncTeardownFixture
  public async teardownFixture() {
    debug("teardownFixture:+");

    await this.server.kill();

    debug("teardownFixture:-");
  }

  @AsyncTest()
  public async testNop() {
    debug("testNop:+");

    let retValue = await httpGet("localhost", PORT, "/nop")
      .then((statusCode) => {
        debug(`httpGet: '/nop' ${statusCode}`);
        return statusCode;
      })
      .catch((err) => {
        debug(`httpGet: '/nop' ERR=${err}`);
        return -1;
      });
    Expect((retValue >= 200) && (retValue <= 299)).toBeTruthy();

    debug("testNop:-");
  }
}
