OIDC_HOST='host.docker.internal'
openssl req -x509\
  -out    oidc_simulator_temp.crt \
  -keyout oidc_simulator_temp.key \
  -newkey rsa:2048 -nodes -sha256                     \
  -subj '/CN='${OIDC_HOST} -extensions EXT -config <( \
   printf "[dn]\nCN=${OIDC_HOST}\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:${OIDC_HOST}\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
mv ./oidc_simulator_temp.crt ./common/certs/oidc_simulator_temp.crt
mv ./oidc_simulator_temp.key ./common/certs/oidc_simulator_temp.key
