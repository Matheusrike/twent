FROM node:22-alpine	

WORKDIR /app

# Copy only necessary files for installing dependencies
COPY package.json pnpm-lock.yaml ./
COPY ./prisma ./prisma

# Install pnpm
RUN npm install -g pnpm

# Install deps
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm prisma generate

COPY ./prisma/generated/libquery_engine-linux-musl-openssl-3.0.x.so.node ./dist/prisma/generated/libquery_engine-linux-musl-openssl-3.0.x.so.node

# Copy application source code
COPY . .

# Build application
RUN pnpm build

EXPOSE 3333

CMD ["pnpm", "start"]
