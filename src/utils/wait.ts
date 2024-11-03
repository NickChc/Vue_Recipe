// TODO : delete this file when it's no longer needed

export async function wait(dur: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(resolve, dur);
  });
}

type TWaitReturnType = Awaited<ReturnType<typeof wait>>;
