module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find(
            { disabled: false }
        );
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id)
    },
    readableInfo: async (parent, args, { models }) => {
        const theNote = await models.Note.findById(args.id);
        var showThis = theNote.content + " has been written by " + theNote.author
        return showThis;
    },
    AllNotes: async (parent, args, { models }) => {
        return await models.Note.find().limit(100);
    },
    user: async (parent, { username }, { models }) => {
        //find a user for a given username
        return await models.User.findOne({ username });
    },
    users: async (parent, args, { models }) => {
        //find all users
        return await models.User.find({});
    },
    me: async (parent, args, { models, user }) => {
        // find a user given the current user context
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent, { cursor }, { models }) => {
        //limit to 10 items
        const limit = 10;
        // default is false
        let hasNextPage = false;
        // if no cursor passed it wil empty
        // and pull the newest notes from db
        let cursorQuery = {};

        // if there is cursor
        // query look notes with objectID less than that 
        // which is in cursor
        if (cursor) {
            cursorQuery = { _id: { $lt: cursor } };
        }

        // find the limit +1 of notes in our db, sorted from newest
        let notes = await models.Note.find(cursorQuery).sort({ _id: -1 }).limit(limit + 1);

        // if the number of notes we find exceeds our limit
        // set has nextpage value to true and trim the notes to limit
        if (notes.length > limit) {
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }

        // the new cursor will be the mongo object ID of the
        // last item in the feed array
        const newCursor = notes[notes.length - 1]._id;

        return {
            notes,
            cursor: newCursor,
            hasNextPage
        };
    }
};




