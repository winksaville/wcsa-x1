import * as child from "child_process";
import { startServer } from "../common/spec.lib";

import {
  AsyncSetupFixture,
  AsyncTeardownFixture,
  AsyncTest,
  Expect,
  TestFixture,
} from "alsatian";

import {
  Builder,
  By,
  WebDriver,
} from "selenium-webdriver";

import * as debugModule from "debug";

const debug = debugModule("client.spec");

const PORT = 3000;

@TestFixture("Client tests")
export class ClientTests {
  private driver: WebDriver;
  private browserName = "chrome";
  private server: child.ChildProcess;

  @AsyncSetupFixture
  public async setupFixture() {
    debug("setupFixture:+");

    // Start the browser we"re going to control
    this.driver = new Builder()
        .forBrowser(this.browserName)
        .build();

    // Start server
    this.server = await startServer(PORT, 5000, "./dist/server/server.js");

    // Get the home page
    await this.driver.get(`http:localhost:${PORT}/`);

    debug("setupFixture:-");
  }

  @AsyncTeardownFixture
  public async teardownFixture() {
    debug("teardownFixture:+");

    await this.driver.quit();
    await this.server.kill();

    debug("teardownFixture:-");
  }

  @AsyncTest("wd: nop which is defined in a TS file")
  public async testWdNop() {
    debug("testWdNop:+");

    try {
      let button = await this.driver.findElement(By.id("invokeNop"));
      button.click();
    } catch (e) {
      debug(`testWdNop caught e=${e}`);
      Expect(false).toBe(true); // Always fail.
    }
    // Expect(false).toBe(true); // Always fail.

    debug("testWdNop:-");
  }
}
