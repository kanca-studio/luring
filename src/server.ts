import dotenv from 'dotenv';
dotenv.config({});
import { importSchema } from 'graphql-import';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import shortid from 'shortid';
import { applyAuthMiddlewares, verifyAuth } from './auth';
import resolvers from './resolvers';
import telegramBot from './telegram';

const telegramWebhookPath = `/telegram/${shortid()}`;
const app = express();
app.use(telegramBot.webhookCallback(telegramWebhookPath));

const gqlServer = new ApolloServer({
  typeDefs: importSchema('src/schema.graphql'),
  resolvers,
  context: async ({ req }) => {
    const visitor = await verifyAuth(req.headers.authorization);
    return { visitor };
  },
});
applyAuthMiddlewares({ app });
gqlServer.applyMiddleware({ app });

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
  telegramBot.telegram.setWebhook(`${process.env.API_URL}${telegramWebhookPath}`);
});
