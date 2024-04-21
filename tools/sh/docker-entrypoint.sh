#!/usr/bin/env bash
python3 /etc/nginx/init/ngx_config.py
nginx -g "daemon off;"
