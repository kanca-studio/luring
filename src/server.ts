import { importSchema } from 'graphql-import';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import dotenv from 'dotenv';
import { applyAuthMiddlewares, verifyAuth } from './auth';
import resolvers from './resolvers';

dotenv.config({});

const app = express();

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
  console.log(`Running on ${process.env.PORT}`);
});
