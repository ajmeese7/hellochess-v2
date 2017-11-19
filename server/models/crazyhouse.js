const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CrazyhouseSchema = new Schema({
    white: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        elo: {
            type: Number,
            required: true
        }
    },
    black: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        elo: {
            type: Number,
            required: true
        }
    },
    pgn: {
        type: String,
    },
    final_fen: {
        type: String,
        rquired: true
    },
    time: {
        value: {
            type: Number,
            required: true
        },
        increment: {
            type: Number,
            required: true
        }
    },
    result: {
        type: String,
        required: true
    }
});

var CrazyhouseGame = mongoose.model('CrazyhouseGame', CrazyhouseSchema);

module.exports = {CrazyhouseGame};
