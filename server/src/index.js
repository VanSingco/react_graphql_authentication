import { GraphQLServer, PubSub } from "graphql-yoga";
import prisma from  './prisma';
import {resolvers, fragmentReplacements} from './resolver/index';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request){
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
});

const options = {
    port: 8000,
    endpoint: '/graphql',
    playground: '/playground',
  }
  
  server.start(options, ({ port }) => {
    console.log(`Server started, listening on port ${port} for incoming requests.`)
  })