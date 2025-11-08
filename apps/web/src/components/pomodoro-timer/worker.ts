let interval: NodeJS.Timeout | undefined;

const start = () => {
  interval ??= setInterval(() => self.postMessage(undefined), 1000);
};

const pause = () => {
  if (interval) {
    clearInterval(interval);
    interval = undefined;
  }
};

onmessage = (e: MessageEvent<"start" | "pause">) => {
  if (e.data === "start") {
    start();
  } else {
    pause();
  }
};
