export const msalConfig = {
  auth: {
    clientId: "<YOUR_CLIENT_ID>", // From Azure AD App Registration
    authority: "https://login.microsoftonline.com/<YOUR_TENANT_ID>",
    redirectUri: "http://localhost:3000",
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Basic user info
};
