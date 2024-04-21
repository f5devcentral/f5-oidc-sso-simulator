#!/bin/bash

function remove_app_id {
    local containerID=$(docker ps --all -q --filter=name=$containerName)
    echo "Container ID  : $containerID"
    if [ -z $containerID ]; then
        echo "Container ID doesn't exist for $containerName"
        echo ""
        return $(false)
    fi
    docker stop $containerID || true
    echo "Stopped a container ID: $containerID"
    echo ""

    docker rm   $containerID || true
    echo "Removed a container ID: $containerID"
    echo ""
    return $(true)
}

function remove_app_image {
    local repo=$(docker images --format="{{.Repository}}" | grep $containerName)
    if [ -z $repo ]; then
        echo "Container image doesn't exist for $containerName"
        echo ""
        return
    fi        
    docker rmi  $repo || true
    echo "Removed a container image: $containerName"
    echo ""
}

function clean_app {
    local containerName=$1
    echo "Start cleaning a container: $containerName"
    if [ -z $containerName ]; then
        echo "An argument of container name is required."
        echo "- bash ./sh/docker-clean.sh {container_name}"
        echo "- e.g., bash ./sh/clean-app.sh f5-oidc"
        echo ""
        return
    fi

    if remove_app_id; then
        remove_app_image
    fi
}

clean_app $1
