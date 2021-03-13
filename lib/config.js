const environments = {};

environments.development = {
    port: '3000',
    envName: 'development',
    hashingSecret: 'ThisIsMySecret'
};

environments.production = {
    port: '5000',
    envName: 'production',
    hashingSecret: 'ThisIsMySecret'
};

const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.development;

module.exports = environmentToExport;
