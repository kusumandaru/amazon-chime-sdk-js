FROM node:10-alpine
ENV PATH="/usr/bin:/usr/local/bin:${PATH}"
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/.aws && chown -R node:node /home/node/.aws
WORKDIR /home/node/app
RUN apk --no-cache add curl
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install
COPY config /home/node/.aws
COPY credentials /home/node/.aws
COPY /home/ec2-user/amazon-chime-sdk-js/* /home/node/app/
USER root
RUN apk add --update nodejs npm
#USER node
#COPY --chown=node:node . .
EXPOSE 80
#CMD [ "npm run", "start" ]