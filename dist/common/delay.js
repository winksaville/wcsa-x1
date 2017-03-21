"use strict";
/**
 * Delay which returns a Promise
 */
function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
module.exports = delay;
//# sourceMappingURL=delay.js.map