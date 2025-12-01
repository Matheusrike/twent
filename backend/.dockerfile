FROM node:22-alpine
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate

# Copy the rest of the application code
COPY ./ ./

# Build backend
RUN pnpm build

# Expose port
EXPOSE 3333

# Run the application
CMD [ "pnpm", 'start' ]