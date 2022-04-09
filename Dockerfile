FROM ubuntu:latest

WORKDIR /app

# Install Doppler CLI
RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg make gcc build-essential && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | apt-key add - && \
    echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Login to Doppler
ENV DOPPLER_PROJECT="backend"
ENV DOPPLER_CONFIG="stg"
ENV DOPPLER_ENVIRONMENT="stg"

RUN echo 'DP_SERVOCE_TOKEN' | doppler configure set token --scope /app

COPY . /app

# RUN npm i -g pm2

RUN cd /app && npm ci

EXPOSE 5800

CMD ["doppler", "run", "npm", "start"]
# RUN pm2 startup systemd
# RUN pm2 logs ecosystem.config.js --color