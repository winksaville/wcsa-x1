import * as m from "mithril";
import nop = require("../../dist/common/nop");

function invokeNop() {
  nop();
}

m.render(document.body,
  m("div", "Hello, click to ", [
    m("a", {href: "http://localhost:3000"}, "reload"),
    m("br"),
    m("button", {id: "invokeNop", onclick: invokeNop }, "invoke nop directly")
  ])
);
