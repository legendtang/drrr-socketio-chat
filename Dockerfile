# Install dependencies only when needed
FROM node:10-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++ bash 
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

FROM node:10-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

ENTRYPOINT ["npm", "start"]