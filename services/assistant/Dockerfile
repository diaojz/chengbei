FROM node:24-alpine
WORKDIR /app
COPY services/assistant/*.mjs ./
COPY services/assistant/generated/corpus.json ./generated/corpus.json
RUN mkdir /data && chown node:node /data
USER node
ENV NODE_ENV=production CHAT_DATA_DIR=/data PORT=8787
EXPOSE 8787
CMD ["node","server.mjs"]
