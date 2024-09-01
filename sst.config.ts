/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ThirteenTruco",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.StaticSite("MyWeb", {
      build: {
        command: "pnpm run build",
        output: "dist",
      },
    });
  },
});
