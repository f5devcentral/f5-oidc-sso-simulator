source ./tools/sh/constants.sh

function generate_cert_and_key {
    local hostName=${OIDC_SIMULATOR_HOST}
    local certFile=${OIDC_SIMULATOR_CERT}
    local keyFile=${OIDC_SIMULATOR_KEY}

    if [ -z $hostName ]; then
        printf "${RED}An environment variable of OIDC_SIMULATOR_HOST is not set.${NC}\n"
        echo "Setting OIDC_SIMULATOR_HOST=${DEFAULT_OIDC_SIMULATOR_HOST} as default value.."
        echo ""
        hostName=${DEFAULT_OIDC_SIMULATOR_HOST}
    fi

    if [ -z $certFile ]; then
        printf "${RED}An environment variable of OIDC_SIMULATOR_CERT is not set.${NC}\n"
        echo "Setting OIDC_SIMULATOR_CERT=${DEFAULT_OIDC_SIMULATOR_CERT} as default value.."
        echo ""
        certFile=${DEFAULT_OIDC_SIMULATOR_CERT}
    fi

    if [ -z $keyFile ]; then
        printf "${RED}An environment variable of OIDC_SIMULATOR_KEY is not set.${NC}\n"
        echo "Setting OIDC_SIMULATOR_KEY=${DEFAULT_OIDC_SIMULATOR_KEY} as default value.."
        echo ""
        keyFile=${DEFAULT_OIDC_SIMULATOR_KEY}
    fi

    local certDirFile="./myconfig/certs/${certFile}"
    local keyDirFile="./myconfig/certs/${keyFile}"

    echo "Start generating cert and key for F5 OIDC/SSO simulator"
    openssl req -x509                                      \
        -out    ${certFile}                                \
        -keyout ${keyFile}                                 \
        -newkey rsa:2048 -nodes -sha256                    \
        -subj '/CN='${hostName} -extensions EXT -config <( \
        printf "[dn]\nCN=${hostName}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:${hostName}\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
    mv ./${certFile} ${certDirFile}
    mv ./${keyFile}  ${keyDirFile}

    if test -f ${certDirFile}; then
        printf "${YELLOW}Generated a cert for ${APP_NAME}: ${certDirFile}${NC}\n"
    else
        printf "${RED}Failed to generate a cert for ${APP_NAME}: ${certDirFile}${NC}\n"
    fi

    if test -f ${keyDirFile}; then
        printf "${YELLOW}Generated a key  for ${APP_NAME}: ${keyDirFile}${NC}\n"
    else
        printf "\n${RED}Failed to generate a key  for ${APP_NAME}: ${certDirFile}${NC}\n"
    fi
    echo ""
}

printf "\n${GREEN}${APP_NAME}: Cert & Key Generation ${NC}\n\n"
generate_cert_and_key
