const apis = ["waitingQueue"];

const configs = {};

apis.forEach((name) => {
  configs[name] = {
    input: `./open-apis/${name}.custom.json`,
    output: {
      mode: "split",
      target: `./src/@api/${name}.ts`,
      // schemas: "src/api/auth/model",
      client: "react-query",
      mock: false,
      override: {
        title: (title) => `${title}Api`,
        mutator: {
          path: "./src/@api/use-custom-instance.ts",
          name: "useCustomInstance",
        },
        formData: {
          path: "./src/@api/custom-form-data.ts",
          name: "customFormData",
        },
        header: () => [`eslint-disable`],
      },
    },
    hooks: {
      afterAllFilesWrite: ["prettier --write"],
    },
  };
});

module.exports = {
  ...configs,
};
