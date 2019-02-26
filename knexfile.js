// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/lambda.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./migrations"
    },
    seeds: { directory: "./seeds" }
  }
};
