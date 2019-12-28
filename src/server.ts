import dotenv from 'dotenv';
dotenv.config({});
import { register } from 'prom-client';
import { importSchema } from 'graphql-import';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import { applyAuthMiddlewares, verifyAuth } from './auth';
import resolvers from './resolvers';
import telegramBot from './telegram';
import db from './db';

const app = express();
app.use(bodyParser({ extended: true }));

app.get('/metrics', (req, res) => {
  res.send(register.metrics());
});

telegramBot.telegram.deleteWebhook();
telegramBot.startPolling();

const gqlServer = new ApolloServer({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers,
  context: async ({ req }) => {
    const visitor = await verifyAuth(req.headers.authorization);
    return { visitor, db };
  },
});
applyAuthMiddlewares({ app });
gqlServer.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
