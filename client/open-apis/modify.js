const _ = require("lodash");
const File = require("fs");
const axios = require("axios");

// const token =
//   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6IkdBVEVXQVkiLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTY4MDI2NjcwMn0.aLx6Z-456zx1gF8DfRfq90ljG0uGFDam7TxVJ-m950EmDKVBWCOVz8O7vJx6ely4Ykw3xGvQl3z3viGdEBok3g";
// url to open api doc
const gatewayUrl = "http://localhost:5000";

let noRemote = false;
process.argv.forEach((val) => {
  if (val === "--no-remote") {
    noRemote = true;
  }
});

console.info("noRemote:", noRemote);

const services = ["waitingQueue"];
const apis = {};

function dynamicRequire(service) {
  // eslint-disable-next-line import/no-dynamic-require
  apis[service] = require(`./${service}.json`);
}

async function start() {
  await Promise.all(
    services.map(async (service) => {
      if (noRemote) {
        dynamicRequire(service);
      } else {
        console.log(`Fetching ${service}`);
        const response = await axios.default.get(
          `${gatewayUrl}/api.json`
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // }
        );

        await File.writeFileSync(
          `./open-apis/${service}.json`,
          JSON.stringify(response.data, null, 2)
        );
        console.log(`Save to disk: ${service}.json`);
        dynamicRequire(service);
      }
    })
  );

  console.log("Start modifying apis");
  _.forEach(apis, (api, name) => {
    console.log("Modifying", name);

    const modified = _.cloneDeep(api);

    // _.forEach(api.paths, (value, key) => {
    //   if (key.startsWith("/api/")) {
    //     modified.paths[`/${name}${key}`] = value;
    //     delete modified.paths[key];
    //   }
    // });

    File.writeFileSync(
      `./open-apis/${name}.custom.json`,
      JSON.stringify(modified, null, 2)
    );
  });
}

start();
