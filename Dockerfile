# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV INVENSYS_NG_MCP_CATALOG_PATH=/app/dist/mcp/invensys-ng-catalog.json

RUN apk add --no-cache nginx tini

COPY --from=build /app/dist/ui-kit/browser /usr/share/nginx/html
COPY --from=build /app/dist/mcp /app/dist/mcp
COPY --from=build /app/tools/mcp /app/tools/mcp
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf
COPY docker/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/entrypoint.sh"]
