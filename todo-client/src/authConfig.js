export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: window.location.origin, // Works locally and in prod
  },
};

export const loginRequest = {
  scopes: ["api://cb87752d-4999-4d1b-b247-85a06e98c649/scope"],
};
