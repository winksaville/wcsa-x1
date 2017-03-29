"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const m = require("mithril");
const nop = require("../../dist/common/nop");
const csprng = require("csprng");
const debugModule = require("debug");
const debug = debugModule("client");
function invokeNopClicked() {
    debug("invokeNopClicked:+");
    nop();
    debug("invokeNopClicked:-");
}
function setField(fieldId, result) {
    debug(`setField:+ fieldId=${fieldId} result=${result}`);
    try {
        let field = document.getElementById(fieldId);
        field.value = result;
    }
    catch (err) {
        debug(`Caught err setField: ${fieldId} result=${result} err=${err}`);
    }
    debug(`setField:- fieldId=${fieldId} result=${result}`);
}
function randButtonClicked() {
    let r = csprng(64, 16);
    setField("rand_output", r);
}
m.render(document.body, m("div", [
    m("div", "Hello, click to ", [
        m("a", { href: "http://localhost:3000" }, "reload"),
    ]),
    m("div", [
        m("button", { id: "invokeNop", onclick: invokeNopClicked }, "invoke nop directly"),
    ]),
    m("div", [
        m("Input", { id: "rand_output", type: "text", readOnly: true, style: "width: 200px;" }),
        m("br"),
        m("button", { id: "randButton", onclick: randButtonClicked }, "Generate Rand Number"),
        m("br"),
    ])
]));
//# sourceMappingURL=client.js.map