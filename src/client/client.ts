import * as m from "mithril";
import nop = require("../../dist/common/nop");
import csprng = require("csprng");
import * as debugModule from "debug";
const debug = debugModule("client");

function invokeNopClicked() {
  debug("invokeNopClicked:+");
  nop();
  debug("invokeNopClicked:-");
}

function setField(fieldId: string, result: string) {
  debug(`setField:+ fieldId=${fieldId} result=${result}`);
  try {
    let field: HTMLInputElement = <HTMLInputElement> document.getElementById(fieldId);
    field.value = result;
  } catch (err) {
    debug(`Caught err setField: ${fieldId} result=${result} err=${err}`);
  }
  debug(`setField:- fieldId=${fieldId} result=${result}`);
}

function randButtonClicked() {
  let r = csprng(64, 16);
  setField("rand_output", r);
}

m.render(document.body,
  m("div", [
    m("div", "Hello, click to ", [
      m("a", {href: "http://localhost:3000"}, "reload"),
    ]),
    m("div", [
      m("button", {id: "invokeNop", onclick: invokeNopClicked}, "invoke nop directly"),
    ]),
    m("div", [
      m("Input", {id: "rand_output", type: "text", readOnly: true, style: "width: 200px;"}),
      m("br"),
      m("button", {id: "randButton", onclick: randButtonClicked}, "Generate Rand Number"),
      m("br"),
    ])
  ])
);
