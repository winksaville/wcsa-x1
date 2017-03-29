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
      let button = await this.driver.findElement(By.id("invokeNopId"));
      await button.click();
    } catch (e) {
      debug(`testWdNop caught e=${e}`);
      Expect(false).toBe(true); // Always fail.
    }

    debug("testWdNop:-");
  }

  @AsyncTest("wd: rand output")
  public async testRandOutput() {
    debug("testRandOutput:+");

    try {
      let name = await this.driver.findElement(By.id("nameId"));
      await name.sendKeys("test name");
      let email = await this.driver.findElement(By.id("emailId"));
      await email.sendKeys("testname@email.com");
      let button = await this.driver.findElement(By.id("sendDataButtonId"));
      await button.click();
      let nameResult = await this.driver.findElement(By.id("nameId"))
        .getAttribute("value");
      Expect(nameResult).toBe("test name");
      debug(`nameResult=${nameResult}`);
      let emailResult = await this.driver.findElement(By.id("emailId"))
        .getAttribute("value");
      Expect(emailResult).toBe("testname@email.com");
      debug(`emailResult=${emailResult}`);
      let randOutput = await this.driver.findElement(By.id("randOutputId"))
        .getAttribute("value");
      debug(`randOutput=${randOutput}`);
      Expect(randOutput).not.toBeEmpty();
    } catch (e) {
      debug(`testRandOutput caught e=${e}`);
      Expect(false).toBe(true); // Always fail.
    }

    debug("testRandOutput:-");
  }
}
