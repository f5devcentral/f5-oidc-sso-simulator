# 🔐 f5-oidc-sso-simulator

The **`f5-oidc-sso-simulator`** provides a OIDC/SSO simulation environment to test user **authentication**, App/API **authorization**, and ID/access **token claims**' retrieval via your IdPs for the following persona and scenarios.

| Persona | Scenario |
|---------|----------|
| **Product Manager, Solution Architect** | **New IdP Support**: I want to test new IdPs to ensure my app's implementation supports it before selling the app. |
| **Solution Engineer, Customer Support** | **SSO Troubleshooting**: I want to test customers' IdP configuration without using my app as one of troubleshooting steps when getting authN errors. |
| **Enterprise Customer** | **Token Claim Extract**: I want to extract and check ID/access token claims with securely protecting PII without using public sites when configuring an IdP. |
| **Software Engineer, Quality Engineer** | **OIDC Test Env**: I want to quickly configure and run SSO test environments when testing my apps. |


## 🏠 Getting Started

### 1. Prerequisites
- [ ] **IdP Setup**: Create an app in your IdP. Use the following URIs if you want to run this tool locally.
  | Category                     | URI Example                                 |
  |------------------------------|---------------------------------------------|
  | **Redirect URI**             | `https://host.docker.internal:443/_codexch` |
  | **Post Logout Redirect URI** | `https://host.docker.internal:443/_logout`  |
- [ ] **Clone** this repo
  ```bash
  git clone https://github.com/f5devcentral/f5-oidc-sso-simulator.git
  ```
- [ ] **Docker**: [Install and Run Docker](https://docs.docker.com/engine/install/)
- [ ] **Host**: Edit `hosts` file when testing your app locally:
  ```bash
  $ sudo vi /etc/hosts
  127.0.0.1 host.docker.internal
  ```
- [ ] **Nginx Plus Free Trial**: [Download Nginx Plus license files](https://www.nginx.com/free-trial-request/), and copy `nginx-repo.crt` and `nginx-repo.key` to `./myconfig/certs/`.

### 2. Configure a Simulator
- [ ] Create a file (e.g., `./myconfig/settings-xxx.env`) that contains environment variables by referencing [./myconfig/settings-bundle.env](./myconfig/settings-bundle.env).

- [ ] Edit environment variables.
  ```bash
  IDP_CLIENT_ID=${edit-your-idp-app-client-id}
  IDP_CLIENT_SECRET=${edit-your-IDP_CLIENT_SECRET}
  IDP_WELL_KNOWN_ENDPOINTS=${edit-your-idp-well-known-endpoint}
  IDP_PKCE_ENABLE=true <- set to false if you want to use client secret
  IDP_DNS_RESOLVER=${edit-your-DNS-resolver-IP-address}
  ```

### 3. Run the Simulator as Docker Containers
- [ ] **Start** Docker containers:
  ```bash
  make start
  ```
- [ ] **Check** Docker containers' status:
  ```bash
  make watch
  ```
  ![](./docs/img/make-watch.png)

### 4. Run a Web Browser and Test OIDC/SSO
- [ ] Run a Web Browser with https://host.docker.internal and click `Sign in/out` button:
  | Landing Page | IdP Sign in | User Info after Sign-in |
  |--------------|-------------|-------------------------|
  | ![](./docs/img/oidc-landing-page.png) | ![](./docs/img/oidc-kc-login.png) | ![](./docs/img/oidc-logged-in.png) |
- [ ] Check ID/access token claims and test API authorization
  | ID Token Claims | Access Token Claims | Proxied API Authorization |
  |-----------------|---------------------|---------------------------|
  | ![](./docs/img/oidc-id-token.png) | ![](./docs/img/oidc-access-token.png) | ![](./docs/img/oidc-api-authz.png) | 
  > Note: 
  > - Ensure **ID token** contains OIDC standard claim names of **`given_name, family_name, email`** for F5 **Distributed Cloud(XC)** Customers before configuring **F5 XC SSO**.
  > - Authentication error will be occured with XC if your IdP doesn't return ID token.
  > - User Account Information form will be shown in XC if the ID token doesn't contain standard claims.


## 📚 References
- [NGINX OIDC Core and App Examples for multiple Identity Providers](https://github.com/nginx-openid-connect)
- [Amazon Cognito Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-amazon-cognito)
- [Auth0 Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-auth0)
- [Azure Entera ID (a.k.a. AD) Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-azure-ad)
- [Keycloak Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-keycloak)
- [Okta Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-okta)
- [OneLogin Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-onelogin)
- [Ping Identity Setup & Nginx Config Example](https://github.com/nginx-openid-connect/nginx-oidc-ping-identity)
- [Google SSO Setup & F5 Distributed Cloud Example](https://docs.cloud.f5.com/docs/how-to/user-mgmt/sso-google)
- [Custom SSO Setup & & F5 Distributed Cloud Example](https://docs.cloud.f5.com/docs/how-to/user-mgmt/sso-custom)


