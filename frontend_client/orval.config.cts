module.exports = {
  'client-api': {
    input: '../backend_server/build/openapi.json',
    output: {
      target: './src/api/client.ts',
      override: {
	mutator: {
	  path: './src/helpers/backendConnectorAxiosInstance.ts',
	}
      },
    },
  },
};
