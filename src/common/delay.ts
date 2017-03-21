/**
 * Delay which returns a Promise
 */
function delay(time: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, time);
  });
}
export = delay;
