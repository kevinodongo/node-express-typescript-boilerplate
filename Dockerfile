# build stage
FROM node:lts-alpine as build-stage

# enviroment production
ENV NODE_ENV=production

# create work directory
WORKDIR /app

# copy package.jsn
COPY package*.json ./

# install dependencies
RUN yarn install

# copy everything
COPY . .

# build backend
RUN yarn build

#production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]