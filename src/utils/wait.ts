// TODO : delete this file when it's no longer needed

export async function wait(dur: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, dur);
  });
}
