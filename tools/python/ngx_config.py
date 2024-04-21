import shutil

from jinja2 import Environment, BaseLoader, FileSystemLoader
from idp_config import IdPConfig


OIDC_IDP_CONF_DIR               = "/etc/nginx/idp/"
OIDC_TEMPLATE_DIR               = "/etc/nginx/template/"
OIDC_DNS_RESOLVER_CONF          = "oidc_dns_resolver.conf"
OIDC_DNS_RESOLVER_JINJA         = "oidc_dns_resolver.template"
OIDC_IDP_CONF                   = "oidc_idp.conf"
OIDC_IDP_JINJA                  = "oidc_idp.template"
OIDC_PROXY_HOST_CERTS_CONF      = "oidc_proxy_host_certs.conf"
OIDC_PROXY_HOST_CERTS_JINJA     = "oidc_proxy_host_certs.template"


class NginxConfig:
    def __init__(self):
        self.jinja_env = Environment(loader=BaseLoader())
        self.idp_config = IdPConfig()

    def generate_oidc_dns_resolver_conf(self):
        self.generate_conf_from_template(
            OIDC_DNS_RESOLVER_JINJA, OIDC_DNS_RESOLVER_CONF,
            idp_address = self.idp_config.oidc_dns_resolver
        )

    def generate_oidc_idp_conf(self):
        self.generate_conf_from_template(
            OIDC_IDP_JINJA, OIDC_IDP_CONF,
            oidc_authz_endpoint    = self.idp_config.oidc_authz_endpoint,
            oidc_jwt_keyfile       = self.idp_config.oidc_jwt_keyfile,
            oidc_logout_endpoint   = self.idp_config.oidc_logout_endpoint,
            oidc_token_endpoint    = self.idp_config.oidc_token_endpoint,
            oidc_userinfo_endpoint = self.idp_config.oidc_userinfo_endpoint,
            oidc_scopes            = self.idp_config.oidc_scopes,
            oidc_client            = self.idp_config.oidc_client,
            oidc_pkce_enable       = int(self.idp_config.oidc_pkce_enable),
            oidc_client_secret     = self.idp_config.oidc_client_secret
        )

    def generate_proxy_host_certs_conf(self):
        self.generate_conf_from_template(
            OIDC_PROXY_HOST_CERTS_JINJA, OIDC_PROXY_HOST_CERTS_CONF,
            host = self.idp_config.simulator_host,
            port = self.idp_config.simulator_port,
            cert = self.idp_config.simulator_cert,
            key  = self.idp_config.simulator_key
        )

    def generate_conf_from_template(self, tmpl_file, conf_file, **args):
        templ_dir_file = f"{OIDC_TEMPLATE_DIR}{tmpl_file}"
        conf_target = f"{OIDC_IDP_CONF_DIR}{conf_file}"
        conf_default = f"{OIDC_TEMPLATE_DIR}{conf_file}"
        try:
            template = self.get_template(templ_dir_file)
            content = template.render(args)
            self.generate_conf(content, conf_target)
        except Exception as error:
            print(
                f"Generate default {conf_file} because of template exception: ",
                error
            )
            shutil.copyfile(conf_default, conf_target)

    def get_template(self, template_file):
        with open(template_file) as f:
            template_str = f.read()
        return Environment(
            loader=FileSystemLoader(OIDC_TEMPLATE_DIR)
        ).from_string(template_str)

    def generate_conf(self, content, target_conf_file):
        with open(target_conf_file, mode="w", encoding="utf-8") as fp:
            fp.write(content)
            print(f"Generated {target_conf_file}")


if __name__ == '__main__':
    ngx = NginxConfig()
    ngx.generate_oidc_dns_resolver_conf()
    ngx.generate_proxy_host_certs_conf()
    ngx.generate_oidc_idp_conf()
