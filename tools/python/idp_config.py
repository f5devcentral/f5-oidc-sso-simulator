import requests
from http import HTTPStatus
from os import environ as env


DEFAULT_HOST                    = "host.docker.internal"
DEFAULT_PROTO                   = "https"
DEFAULT_OIDC_SIMULATOR_PORT     = 443
DEFAULT_OIDC_SIMULATOR_CERT     = "oidc_simulator.crt"
DEFAULT_OIDC_SIMULATOR_KEY      = "oidc_simulator.key"

BUNDLE_IDP_CLIENT_ID            = "my-client-id"
BUNDLE_IDP_CLIENT_SECRET        = "my-client-secret"
BUNDLE_IDP_PORT                 = 8443
BUNDLE_IDP_WELL_KNOWN_ENDPOINTS = f"{DEFAULT_PROTO}://{DEFAULT_HOST}:{BUNDLE_IDP_PORT}/realms/master/.well-known/openid-configuration"

BUNDLE_IDP_DOMAIN_URI_PREFIX    = f"{DEFAULT_HOST}:{BUNDLE_IDP_PORT}/realms/master/protocol/openid-connect"


class IdPConfig:
    def __init__(self):
        def bool(env_val):
            if env_val.lower() == 'true' or env_val == "1" or env_val == 1:
                return True
            return False

        host_prefix = f"{DEFAULT_PROTO}://{BUNDLE_IDP_DOMAIN_URI_PREFIX}"

        temp = env.get("IDP_AUTHORIZATION_ENDPOINT")
        self.oidc_authz_endpoint = temp if temp else f"{host_prefix}/auth"

        temp = env.get("IDP_TOKEN_ENDPOINT")
        self.oidc_token_endpoint = temp if temp else f"{host_prefix}/token"

        temp = env.get("IDP_USER_INFO_ENDPOINT")
        self.oidc_userinfo_endpoint = temp if temp else f"{host_prefix}/userinfo"

        temp = env.get("IDP_END_SESSION_ENDPOINT")
        self.oidc_logout_endpoint = temp if temp else f"{host_prefix}/logout"

        temp = env.get("IDP_JWKS_URI")
        self.oidc_jwt_keyfile = temp if temp else f"{host_prefix}/certs"

        temp = env.get("IDP_SCOPES")
        self.oidc_scopes = temp if temp else "openid+profile+email"

        temp = env.get("IDP_CLIENT_ID")
        self.oidc_client = temp if temp else BUNDLE_IDP_CLIENT_ID

        temp = env.get("IDP_CLIENT_SECRET")
        self.oidc_client_secret = temp if temp else BUNDLE_IDP_CLIENT_SECRET

        temp = env.get("IDP_LOGOUT_QUERY_PARAMS")
        self.oidc_logout_query_params_enable = True if temp else False
        self.oidc_logout_query_params = f"'{temp}'" if temp else '""'

        temp = env.get("IDP_PKCE_ENABLE")
        self.oidc_pkce_enable = bool(temp) if temp else True

        temp = env.get("IDP_DNS_RESOLVER")
        self.oidc_dns_resolver = temp if temp else "127.0.0.11"

        temp = env.get("OIDC_SIMULATOR_HOST")
        self.simulator_host = temp if temp else DEFAULT_HOST

        temp = env.get("OIDC_SIMULATOR_PROTO")
        self.simulator_proto = temp if temp else DEFAULT_PROTO

        temp = env.get("OIDC_SIMULATOR_PORT")
        self.simulator_port = temp if temp else DEFAULT_OIDC_SIMULATOR_PORT

        temp = env.get("OIDC_SIMULATOR_CERT")
        self.simulator_cert = temp if temp else DEFAULT_OIDC_SIMULATOR_CERT

        temp = env.get("OIDC_SIMULATOR_KEY")
        self.simulator_key = temp if temp else DEFAULT_OIDC_SIMULATOR_KEY

        self.set_values_by_well_known_endpoint()

    def set_values_by_well_known_endpoint(self):
        try:
            well_known_uri = env.get("IDP_WELL_KNOWN_ENDPOINTS")
            if not well_known_uri:
                print("The env variable of IDP_WELL_KNOWN_ENDPOINTS not defined!")
                print("So a bundle IdP will be used instead.")
                return

            r = requests.get(well_known_uri, verify=False)
            if r.status_code != HTTPStatus.OK:
                print(f"Received an error from the well-known endpoint: {r.status_code}")
                print("So a bundle IdP will be used instead.")
                return
            
            body = r.json()
            self.oidc_authz_endpoint    = body["authorization_endpoint"]
            self.oidc_token_endpoint    = body["token_endpoint"]
            self.oidc_userinfo_endpoint = body["userinfo_endpoint"]
            self.oidc_logout_endpoint   = body["end_session_endpoint"]
            self.oidc_jwt_keyfile       = body["jwks_uri"]
        except KeyError as error:
            print(f"Key not found from well-known endpoint response: {error}")
            return
        except Exception as error:
            print(f"Bundle IdP endpoints will be used due to well-known endpoint exception: {error}")
            return

        print(f"Configured IdP config via OIDC well-known endpoints!")
