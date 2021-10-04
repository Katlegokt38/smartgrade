const {  OKTA_TESTING_DISABLEHTTPSCHECK } = process.env;

export default {
  oidc: {
    clientId: '0oaf4t45S11k4qHhE5d5',
    issuer: 'https://dev-3895494.okta.com/',
    redirectUri: 'https://smartgrade1.herokuapp.com/login/callback',
    scopes: ['openid', 'profile', 'email'],
    testing: {
      disableHttpsCheck: `${OKTA_TESTING_DISABLEHTTPSCHECK}`
    }
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8080/api/messages',
  },
};
