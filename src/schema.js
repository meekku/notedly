const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    disabled: Boolean
    favoriteCount: Int!
    favoritedBy: [User]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }
  
  type Query {
    notes: [Note!]!
    note(id: ID): Note!
    readableInfo(id: ID!): String
    AllNotes: [Note!]!
    user(username: String!): User
    users: [User!]!
    me: User!
    noteFeed(cursor: String): NoteFeed
  }

  type Mutation {
    newNote(content: String!, disabled: Boolean): Note
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    changeActivationModeNote(id:ID!): Note!
  }

`;
/*const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    disabled: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
    favouriteCount: Int!
    favouriteBy: [User!]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favourites: [Note!]!
  }

  type Query {
    notes: [Note!]!
    note(id: ID): Note!
    readableInfo(id: ID!): String
    AllNotes: [Note!]!
    user(username: String!): User
    users: [User!]!
    me: User!
  }

  type Mutation {
    newNote(content: String!, disabled: Boolean): Note
    deleteNote(id:ID!): Boolean!
    updateNote(id: ID!, content: String!): Note!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String!, password: String!): String!
    toggleFavourite(id: ID!): Note!
  }
`;

const { gql } = require('apollo-server-express');


  
    type Mutation {
        deleteNote(id:ID!): Boolean!
        newNote(content: String!, disabled: Boolean)): Note!
        updateNote(id:ID!, content: String!): Note!
            
    deleteNote(id: ID!): Boolean!

    }
`;
//scalar DateTime
//        createdAt: DateTime!
//readableInfo(id: ID!): String
//updatedAt: DateTime!
//    type User {
 //   id: ID!
   // username: String!
    //email: String!
    //avatar String
    //notes: [Note!]!
//}
//        */
