import { configure, getConsoleSink } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

export const initLogger = async () => {
  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: getPrettyFormatter({ properties: true }),
      }),
    },
    loggers: [
      {
        category: ["logtape", "meta"],
        lowestLevel: "warning",
        sinks: ["console"],
      },
      { category: "Motherbase", lowestLevel: "debug", sinks: ["console"] },
    ],
  });
};
