/**
 * Test nop module
 */
import { Expect, Test } from "alsatian";
import nop = require("../../dist/common/nop");
import * as debugModule from "debug";

const debug = debugModule("nop.spec");

export class NopTests {
  @Test("test nop type is function")
  public testNopType() {
    debug("testNopType:+");

    let type = typeof(nop);
    Expect(type).toBe("function");

    debug("testNopType:-");
  }

  @Test("test nop return value is not defined")
  public testNopReturnValue() {
    debug("testNopReturnValue:+");

    let type = nop();
    Expect(type).not.toBeDefined();

    debug("testNopReturnValue:-");
  }
}
