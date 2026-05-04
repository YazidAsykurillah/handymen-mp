FROM node:20-alpine

WORKDIR /var/www

# Copy root and app package files to support monorepo hoisting
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install dependencies from root
RUN npm install

# Copy all files
COPY . .

# Set working directory to the app
WORKDIR /var/www/apps/web

EXPOSE 3000

CMD ["npm", "run", "dev"]
