import { PublicClientApplication } from "@azure/msal-browser";

let msalInstance;

export async function initialize() {
  msalInstance = new PublicClientApplication({
    auth: {
      clientId: "59873bae-8acc-4209-8303-48d21dc05949",
      authority: "https://login.microsoftonline.com/e95b66c6-47c7-4015-adc5-eb6001af8ccf"
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
  });

  // Check if there's a response from the authentication server
  const response = await msalInstance.handleRedirectPromise();

  // If there's a response and it contains an account, the user is logged in
  if (response && response.account) {
    return response.account;
  }

  // If there's no response or it doesn't contain an account, the user is not logged in
  return null;
}