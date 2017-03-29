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

function getField(fieldId: string): string {
  debug(`getField:+ fieldId=${fieldId}`);
  let result = "";
  try {
    let field: HTMLInputElement = <HTMLInputElement> document.getElementById(fieldId);
    result = field.value;
  } catch (err) {
    debug(`Caught err getField: ${fieldId} err=${err}`);
    result = "";
  }
  debug(`getField:- fieldId=${fieldId} result=${result}`);
  return result;
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

function sendDataButtonClicked() {
  let r = csprng(64, 16);
  setField("randOutputId", r);
  debug(`Name:${getField("nameId")}`);
  debug(`Email:${getField("emailId")}`);
}

m.render(document.body,
  m("div", [
    m("div", "Hello, click to ", [
      m("a", {href: "http://localhost:3000"}, "reload"),
    ]),
    m("div", [
      m("button", {id: "invokeNopId", onclick: invokeNopClicked}, "invoke nop directly"),
    ]),
    m("div", [
      m("div", "Name: ", [
        m("Input", {id: "nameId", type: "text", style: "width: 200px;"}),
      ]),
      m("div", "Email: ", [
        m("Input", {id: "emailId", type: "text", style: "width: 200px;"}),
      ]),
      m("div", "Rand # RO: ", [
        m("Input", {id: "randOutputId", type: "text", readOnly: true, style: "width: 200px;"}),
      ]),
      m("div", [
        m("button", {id: "sendDataButtonId", onclick: sendDataButtonClicked}, "Send data"),
      ])
    ]),
  ])
);
