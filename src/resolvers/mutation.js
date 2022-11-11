const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../util/gravatar');

module.exports = {

    newNote: async (parent, args, { models, user }) => {
      // if no user on the context throw error
      if (!user) {
        throw new AuthenticationError('You must be signed in to create a note');
      }
        return await models.Note.create({
            content: args.content,
            author: mongoose.Types.ObjectId(user.id),
            disabled: args.disabled,
            favoriteCount: 0
        })},
    deleteNote: async (parent, { id }, { models, user }) => {
        // if no user throw error
        if (!user) {
          throw new AuthenticationError('You must be signed in to delete a note ');
        }

        //find note:
        const note = await models.Note.findById(id);
        // if the note owner and current user dont match the error occurs:
        if (note && String(note.author) !== user.id) {
          throw new ForbiddenError("You dont have permissions to delete this")
        }

        try {
          // if everything checks out, remove the note:
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch(err) {
            return false;
        }
    },
    updateNote: async (parent, { content, id }, { models, user }) => {
        // if not a user, error:
        if (!user) {
          throw new AuthenticationError('You must be signed in to update');
        }
        // find the note:
        const note = await models.Note.findById(id);
        // if the note owner and current user dont match error comes up:
        if (note && String(note.author) !== user.id) {
          throw new ForbiddenError("You don't have permissions to update this");
        }

        // if everything is allright:
        try {
          return await models.Note.findOneAndUpdate(
            {
              _id: id
            },
            {
              $set: {
                content
              }
            },
            {
              new: true
            }
          );
        } catch (err) {
          throw new Error('Error updating note');
        }
      },
      signUp: async (parent, { username, email, password }, { models }) => {
        email = email.trim().toLowerCase();
        const hashed = await bcrypt.hash(password, 10);
        const avatar = gravatar(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
    
            return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
        }   catch (err) {
            throw new Error('Error creating new user account');
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
      if (email) {
          email = email.trim().toLowerCase();
      }
  
      const user = await models.User.findOne({
          $or: [{ email }, { username }]
      });
  
      if (!user) {
          throw new AuthenticationError('Error signing in');
      }
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
          throw new AuthenticationError('Error signing in')
      }
  
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
    },
    toggleFavorite: async (parent, { id }, { models, user }) => {
      // if no user occurs error:
      if (!user) {
        throw new AuthenticationError();
      }

      //check to see if user has already favourited
      let noteCheck = await models.Note.findById(id);
      const hasUser = noteCheck.favoritedBy.indexOf(user.id);

      //if the user exists in the list
      //pull them from it and reduce count by 1
      if (hasUser >= 0) {
        return await models.Note.findByIdAndUpdate(
          id,
          {
            $pull: {
              favoritedBy: mongoose.Types.ObjectId(user.id)
            },
            $inc: {
              favoriteCount: -1
            }
          },
          {
            // set new to true to return updated doc
            new: true
          }
        );
      } else {
        // if the user doesn't exist in the list
        // add them to it and increment count by 1
        return await models.Note.findByIdAndUpdate(
          id,
          {
            $push: {
              favoritedBy: mongoose.Types.ObjectId(user.id)
            },
            $inc: {
              favoriteCount: 1
            }
          },
          {
            new: true
          }
        );
      }
    },
    changeActivationModeNote: async (parent, { id }, { models, user }) => {
      // if not a user, error:
      if (!user) {
        throw new AuthenticationError('You must be signed in to update');
      }
      // find the note:
      const note = await models.Note.findById(id);
      // if the note owner and current user dont match error comes up:
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError("You don't have permissions to update this");
      }

      // if everything is allright:
      try {
        if (note.disabled === false){
          return await models.Note.findOneAndUpdate(
            {
              _id: id
            },
            {
              $set: {
                disabled: true
              }
            },
            {
              new: true
            }
          );
        }
        else {
          return await models.Note.findOneAndUpdate(
            {
              _id: id
            },
            {
              $set: {
                disabled: false
              }
            },
            {
              new: true
            }
          );
        }
      }
        catch (err) {
          throw new Error('Error updating note');
        }
    }
  };

