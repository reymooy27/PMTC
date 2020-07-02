module.exports = {
  apps: [
    {
      name: "PMTC",
      script: "./server.js",
      instances: "max",
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
