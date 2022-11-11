// Require the mongoose library
const mongoose = require('mongoose');

// Määritellään mallin tietokantaskeema
const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        disabled: {
            type:Boolean,
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
    //Luo aikaleimakentät
    timestamps: true
    }
);

//Luo malli
const Note = mongoose.model('Note', noteSchema)

//Paljasta malli
module.exports = Note;