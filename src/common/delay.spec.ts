/**
 * Test delay module
 */
import { AsyncTest, Expect, Test, TestCase } from "alsatian";
import delay = require("../../dist/common/delay");
import * as debugModule from "debug";

const debug = debugModule("delay.spec");

export class DelayTests {
  public rangeOk(expected: number, measured: number, percent: number) {
    let fudge = (expected * percent) / 100.0;
    debug(`rangeOk: expected=${expected} measured=${measured} percent=${percent} fudge=${fudge}`);
    return (measured > (expected - fudge)) && (measured < (expected + fudge));
  }

  @Test("test delay type is function")
  public testDelayType() {
    debug("testDelayType:+");

    let type = typeof(delay);
    Expect(type).toBe("function");

    debug("testDelayType:-");
  }

  @TestCase(100, 5)
  @TestCase(200, 5)
  @AsyncTest("test delay ms time")
  public async testDelayMs(delayMs: number, percent: number) {
    debug(`testDelayMs:+ delayMs=${delayMs} percent=${percent}`);

    let now = Date.now();
    debug(`testDelayMs: now=${now}`);
    await delay(delayMs);
    let elaspedMs = Date.now() - now;
    debug(`testDelayMs:- delayMs=${delayMs} elasped=${elaspedMs}`);
    let ok = this.rangeOk(delayMs, elaspedMs, 10);
    Expect(ok).toBeTruthy();

    debug(`testDelayMs:- delayMs=${delayMs} percent=${percent}`);
  }

  @AsyncTest("test delay then")
  public async testDelayThen() {
    debug("testDelayThenCatch:+");

    // Validate not defined
    let thenOk;
    Expect(thenOk).not.toBeDefined();

    // Delay and set thenOk appropriately
    await delay(100).then(() => thenOk = true);

    // Test defined and true
    Expect(thenOk).toBeDefined();
    Expect(thenOk).toBeTruthy();

    debug("testDelayThenCatch:-");
  }

  @AsyncTest("test delay catch")
  public async testDelayCatch() {
    debug("testDelayCatch:+");

    // Validate not defined
    let catchOk;
    Expect(catchOk).not.toBeDefined();

    // Delay and throw and error then verify we catch it
    await delay(100)
                .then(() => { throw new Error(); } )
                .catch(() => catchOk = true);

    // Test defined and true
    Expect(catchOk).toBeDefined();
    Expect(catchOk).toBeTruthy();

    debug("testDelayCatch:-");
  }
}
