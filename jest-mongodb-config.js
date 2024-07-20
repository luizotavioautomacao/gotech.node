module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "4.0.3", // "4.4.1", // "5.0.8"
      skipMD5: true,
    },
    instance: {
      dbName: "jest",
    },
    autoStart: false,
  },
};