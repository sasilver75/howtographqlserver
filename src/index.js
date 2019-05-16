/**
 * NOTES:
 * Creating a GraphQL server using graphql-yoga by Prisma, which is a fully-featured GraphQL server based on Express.js (+ more)
 */

// ----------------------------------
//  IMPORTS
const {
  GraphQLServer
} = require('graphql-yoga');

// ----------------------------------
/**
 *  typeDefs will define our GraphQL SCHEMA... We're defining a simple Query type with one FIELD called info. This field has a type String!, whose ! indicates that this field can never be null.
 * NOTE: This is written in SDL, the "Schema Definition Language!"
 * EVERY SCHEMA has three special ROOT TYPES, these are called Query, Mutation, and Subscription. The root types correspond to the three operation types offered by GraphQL: queries, mutations, and subscriptions.
 * The Fields on these root types are called ROOT FIELD and define the available API operations
 * Currently, this schema only has a single root field, called info. When sending queries, mutations, or subscriptions to a GraphQL api, we ALWAYS need to start with a root field (info)! 
 */

//Schema
// EXPORTED OUT
// ----------------------------------
//  The resolvers object is the actual IMPLEMENTATION of the GraphqL Schema. Notice how its structure is identical to the structure of the type definition inside typeDefs: Query.info.

// Dummy Data
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length;


//Resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links, // returns inmemory links
    link: (parent, args) => {
      return links.find(link => link.id == args.id);
    }
  },

  Mutation: {
    post: (parent, args) => {
      // Create the link object
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      // Push the link object into our data store
      links.push(link)
      // Return the link object
      return link
    },
    updateLink: (parent, args) => {
      // find the link object using the ID, then change the url and description to the new args
      links.forEach(link => {
        if (link.id === args.id) {
          link.description = args.description;
          link.url = args.url;
          return link;
        }
      });
      // else, return null.
    }
  }

  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url,
  // }
}

// ----------------------------------
// // Finally, the schema and resolvers are bundled and passed to the GraphQL SERVER, which is imported from graphql-yoga. this tells the server what API operations are accepted and how they should be resolved.

// Server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})


// ----------------------------------

server.start(() => console.log(`Server is running on http://localhost:4000`));