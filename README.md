# sample-institute-services
sample-institute-services

# - Env Example
NODE_ENV=dev
APP_NAME=Shivalik R

ENTRYTRACKING_DB_URL={{DB_URL}}
ENTRYTRACKING_DB_POOLSIZE=10,
DB_NAME={{DB_NAME}}
DB_URL={{DB_SHORT_URL}}
PORT=3056

# 27/06/2025
# Local
USER_ROUTE_URL=http://localhost:3011/api/v1/

# Dev
# USER_ROUTE_URL={{URL}}/

# - Migrate File  path : /src & Name : migrate-mongo-config.js

const config = {
  mongodb: {
    // Dev Database Url
    url: "{{url}}",
    databaseName: "{{db_name}}",

    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;

