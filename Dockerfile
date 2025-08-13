# base image
FROM node:18-alpine as builder
ARG TAG_ID
# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY . /usr/src/app
RUN npm i --legacy-peer-deps
# RUN NODE_ENV=production TAG_ID=$TAG_ID npm run build
RUN REACT_APP_TAG_ID=$TAG_ID NODE_ENV=production npm run build
# RUN npm run build  

# production environment
FROM nginx:1.27.0-alpine
# FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
