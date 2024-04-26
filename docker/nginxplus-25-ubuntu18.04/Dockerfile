FROM ubuntu:18.04

LABEL maintainer="NGINX Docker Maintainers <docker-maint@nginx.com>"

#
# Python3.8 install for Ubuntu
#
# ref: https://linuxize.com/post/how-to-install-python-3-8-on-ubuntu-18-04/
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get install -y python3.8 python3-pip
# Update symlink to point to latest
RUN rm /usr/bin/python3 && ln -s /usr/bin/python3.8 /usr/bin/python3
RUN python3 --version
RUN pip3 --version
RUN pip3 install MarkupSafe==2.0.0
RUN pip3 install requests
RUN pip3 install Jinja2

# Define NGINX versions for NGINX Plus and NGINX Plus modules
# Uncomment this block and the versioned nginxPackages in the main RUN
# instruction to install a specific release
# https://docs.nginx.com/nginx/releases/
ENV NGINX_VERSION 25
# https://nginx.org/en/docs/njs/changes.html
ENV NJS_VERSION   0.6.2
# https://plus-pkgs.nginx.com 1~bionic
ENV PKG_RELEASE   1~bionic

## Install Nginx Plus

# Download certificate and key from the customer portal https://account.f5.com/myf5
# and copy to the build context and set correct permissions
RUN  mkdir -p /etc/ssl/nginx
COPY myconfig/certs/*.crt /etc/ssl/nginx/
COPY myconfig/certs/*.key /etc/ssl/nginx/

RUN set -x \
    && chmod 644 /etc/ssl/nginx/* \
    # Create nginx user/group first, to be consistent throughout Docker variants
    && addgroup --system --gid 1001 nginx \
    && adduser --system --disabled-login --ingroup nginx --no-create-home --home /nonexistent --gecos "nginx user" --shell /bin/false --uid 1001 nginx \
    # Install prerequisite packages, vim for editing, then Install NGINX Plus
    && apt-get update && apt-get upgrade -y \
    && DEBIAN_FRONTEND=noninteractive apt-get -qq -y install --no-install-recommends apt-transport-https lsb-release ca-certificates wget dnsutils gnupg2 vim-tiny apt-utils ubuntu-keyring jq

RUN set -x \
    # Install NGINX Plus from repo (https://cs.nginx.com/repo_setup)
    && wget -qO - https://cs.nginx.com/static/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null \
    && printf "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] https://pkgs.nginx.com/plus/ubuntu `lsb_release -cs` nginx-plus\n" | tee /etc/apt/sources.list.d/nginx-plus.list

RUN set -x \
    && wget -P /etc/apt/apt.conf.d https://cs.nginx.com/static/files/90pkgs-nginx \
    && apt-get update \
    #
    ## Install the latest release of NGINX Plus and/or NGINX Plus modules
    ## Optionally use versioned packages over defaults to specify a release
    # List available versions: 
    && apt-cache policy nginx-plus \
    ## Uncomment one:
    # && DEBIAN_FRONTEND=noninteractive apt-get -qq -y install --no-install-recommends nginx-plus \
    && DEBIAN_FRONTEND=noninteractive apt-get -qq -y install --no-install-recommends nginx-plus=${NGINX_VERSION}-${PKG_RELEASE} \
    #
    ## Optional: Install NGINX Plus Dynamic Modules (3rd-party) from repo
    ## See https://www.nginx.com/products/nginx/modules
    ## Some modules include debug binaries, install module ending with "-dbg"
    ## Uncomment one:
    ## njs dynamic modules
    #nginx-plus-module-njs \
    #nginx-plus-module-dbg \
    nginx-plus-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE} \
    nginx-plus-module-njs-dbg=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE} \
    ## NGINX high Availablity keepalived
    #nginx-ha-keepalived \
    ## NGINX agent for New Relic \
    #nginx-nr-agent \
    ## SPNEGO for Kerberos authentication
    #nginx-plus-module-auth-spnego
    #nginx-plus-module-auth-spnego-dbg
    #nginx-plus-module-auth-spnego=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE}
    #nginx-plus-module-auth-spnego-dbg=${NGINX_VERSION}+${NJS_VERSION}-${PKG_RELEASE}
    ## brotli compression dynamic modules
    #nginx-plus-module-brotli \
    #nginx-plus-module-brotli-dbg \
    #nginx-plus-module-brotli=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-brotli-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## cookie flag dynamic module
    #nginx-plus-module-cookie-flag \
    #nginx-plus-module-cookie-flag-dbg
    #nginx-plus-module-cookie-flag=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-cookie-flag-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Encrypted-Session dynamic module
    #nginx-plus-module-encrypted-session \
    #nginx-plus-module-encrypted-session=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-encrypted-session-dbg \
    #nginx-plus-module-encrypted-session-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## FIPS Check 
    #nginx-plus-module-fips-check \
    #nginx-plus-module-fips-check-dbg \
    #nginx-plus-module-fips-check=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-fips-check-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## GeoIP dynamic modules
    #nginx-plus-module-geoip \
    #nginx-plus-module-geoip-dbg \
    #nginx-plus-module-geoip=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-geoip-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## GeoIP2 dynamic modules
    #nginx-plus-module-geoip2 \
    #nginx-plus-module-geoip2-dbg \
    #nginx-plus-module-geoip2=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-geoip2-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## headers-more dynamic module
    #nginx-plus-module-headers-more \
    #nginx-plus-module-headers-more-dbg \
    #nginx-plus-module-headers-more=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-headers-more-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## image filter dynamic module
    #nginx-plus-module-image-filter \
    #nginx-plus-module-image-filter-dbg \
    #nginx-plus-module-image-filter=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-image-filter-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Lua dynamic module
    #nginx-plus-module-lua \
    #nginx-plus-module-lua-dbg \
    #nginx-plus-module-lua=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-lua-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## ModSecurity dynamic module
    #nginx-plus-module-modsecurity \
    #nginx-plus-module-modsecurity-dbg \
    #nginx-plus-module-modsecurity=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-modsecurity-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Nginx Development Kit dynamic module
    #nginx-plus-module-ndk \
    #nginx-plus-module-ndk-dbg \
    #nginx-plus-module-ndk=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-ndk-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## OpenTracing dynamic module
    #nginx-plus-module-opentracing \
    #nginx-plus-module-opentracing-dbg \
    #nginx-plus-module-opentracing=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-opentracing-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Phusion Passenger Open Source dynamic module
    #nginx-plus-module-passenger \
    #nginx-plus-module-passenger-dbg \
    #nginx-plus-module-passenger=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-passenger-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Perl dynamic module
    #nginx-plus-module-perl \
    #nginx-plus-module-perl-dbg \
    #nginx-plus-module-perl=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-perl-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## Prometheus exporter NJS module
    #nginx-plus-module-prometheus \
    #nginx-plus-module-prometheus=${NGINX_VERSION}-${PKG_RELEASE} \
    ## RTMP dynamic module
    #nginx-plus-module-rtmp \
    #nginx-plus-module-rtmp-dbg \
    #nginx-plus-module-rtmp=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-rtmp-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## set-misc dynamic module
    #nginx-plus-module-set-misc \
    #nginx-plus-module-set-misc-dbg \
    #nginx-plus-module-set-misc=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-set-misc-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## HTTP Substitutions Filter dynamic module
    #nginx-plus-module-subs-filter \
    #nginx-plus-module-subs-filter-dbg \
    #nginx-plus-module-subs-filter=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-subs-filter-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## xslt dynamic module
    #nginx-plus-module-xslt \
    #nginx-plus-module-xslt-dbg \
    #nginx-plus-module-xslt=${NGINX_VERSION}-${PKG_RELEASE} \
    #nginx-plus-module-xslt-dbg=${NGINX_VERSION}-${PKG_RELEASE} \
    ## NGINX Sync Script nginx-sync.sh 
    #nginx-sync \
    # Remove default nginx config
    && rm /etc/nginx/conf.d/default.conf \
    # Optional: Create cache folder and set permissions for proxy caching
    && mkdir -p /var/cache/nginx \
    && chown -R nginx /var/cache/nginx \
    # Optional: Create State file folder and set permissions
    && mkdir -p /var/lib/nginx/state \
    && chown -R nginx /var/lib/nginx/state \
    # Set permissions
    && chown -R nginx:nginx /etc/nginx \
    # Forward request and error logs to docker log collector
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    # Raise the limits to successfully run benchmarks
    && ulimit -c -m -s -t unlimited \
    # Cleanup
    && apt-get remove --purge --auto-remove -y gnupg lsb-release apt-utils \  
    && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx-plus.list \
    && rm -rf /etc/apt/apt.conf.d/90nginx   \
    && rm -rf nginx_signing.key             \
    && rm -rf /etc/ssl/nginx/nginx-repo.crt \
    && rm -rf /etc/ssl/nginx/nginx-repo.key

RUN    mkdir -p /etc/nginx/backend        \
    && mkdir -p /etc/nginx/conf.d         \
    && mkdir -p /etc/nginx/oidc           \
    && mkdir -p /etc/nginx/idp            \
    && mkdir -p /etc/nginx/init           \
    && mkdir -p /etc/nginx/template       \
    && mkdir -p /usr/share/nginx/html/css \
    && mkdir -p /var/lib/nginx/state

VOLUME /usr/share/nginx/html
VOLUME /etc/nginx

RUN    chmod -R 644 /etc/nginx
RUN    chmod -R 644 /etc/nginx/conf.d
RUN    chmod -R 644 /etc/nginx/oidc
RUN    chmod -R 644 /etc/nginx/backend
RUN    chmod -R 644 /etc/nginx/idp
RUN    chmod -R 644 /etc/nginx/init
RUN    chmod -R 644 /etc/nginx/template
RUN    chmod -R 644 /usr/share/nginx/html/css

COPY  common/frontend/  /usr/share/nginx/html/
COPY  common/backend/   /etc/nginx/backend/
COPY  common/etc/nginx/ /etc/nginx/
COPY  common/oidc/      /etc/nginx/oidc/
COPY  common/template/  /etc/nginx/template/
COPY  tools/python/     /etc/nginx/init/
COPY  tools/sh/docker-entrypoint.sh /docker-entrypoint.sh

STOPSIGNAL SIGTERM
ENTRYPOINT ["bash", "/docker-entrypoint.sh"]
