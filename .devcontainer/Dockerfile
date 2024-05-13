FROM node:18.17.1-bookworm
ENV PS_VERSION=0.11.95-SNAPSHOT \
    URSIM_VERSION=0.9.68 \
    SDK_VERSION=5.0.36 
SHELL ["/bin/bash", "-c"]
RUN set -ex; \
    apt-get update && apt-get install -y \
             build-essential \
             ca-certificates \
             curl \
             gnupg \
             sudo \
             tzdata \
             unzip \
             openssh-server \
             rsync; \
    rm -rf /var/lib/apt/lists/*

#   Install docker
RUN set -ex; \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg; \
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null; \
    apt-get update -y; \
    apt-get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io  \
        docker-buildx-plugin \
        docker-compose-plugin \
        gh; \
    rm -rf /var/lib/apt/lists/* 

#   Copy zipped files to /
COPY web-sdk-external-${SDK_VERSION}.zip web-simulator-external-${URSIM_VERSION}.zip /

#   Set up non-root user
ARG USERNAME=psxdev
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN set -ex; \
    groupadd --gid $USER_GID $USERNAME; \
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME; \
    usermod -aG docker $USERNAME; \
    echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME; \
    chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME

#   unzip files, chown to psxdev, and changed line in run-simulator.js to remove absolute path
ENV URSIM_PATH=/ursim-polyscopex-${URSIM_VERSION}
RUN set -ex; \
    sudo unzip '*.zip'; \
    sudo rm web-sdk-external-${SDK_VERSION}.zip web-simulator-external-${URSIM_VERSION}.zip; \
    sudo chown -R psxdev:psxdev sdk-polyscopex-${SDK_VERSION}/ ursim-polyscopex-${URSIM_VERSION}/  /usr/local/lib/node_modules/; \
    sed -i '0,/process.cwd()/s/process.cwd()/process.env.URSIM_PATH/' /${URSIM_PATH}/artifacts/runtime/run-simulator.js

#   navigate into ursim and sdk directories and run npm commands asynchronously
RUN set -ex; \
    (cd /ursim-polyscopex-${URSIM_VERSION}; npm run build-local --prefix artifacts/runtime)& \
    (cd /sdk-polyscopex-${SDK_VERSION}; \
	pushd urcap-generator > /dev/null; \
	npm install --no-update-notifier ; \
	npm link; \
	cp -f sh_newurcap ../newurcap.sh; \
	npm config set @universal-robots:registry https://pkgs.dev.azure.com/polyscopex/api/_packaging/polyscopex/npm/registry/; \
	npm config set strict-ssl false; \
	popd > /dev/null)






