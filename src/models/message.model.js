import mongoose, {Schema} from "mongoose";

const attachmentSchema = new Schema({
        url: String,
        publicId: String,
        fileName: String,
        originalName: String,
        mimeType: String,
        extenstion: String,
        size: Number
    },
    {
        _id: false
    }
)

const readSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    readAt: Date,
},
    {
        _id: false
    }
);

const deliveredSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    deliveredAt: Date
},  
    {
        _id: false
    }
)

const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
        trim: true
    },

    messageType: {
        type: String,
        enum: [
            "text",
            "image",
            "video",
            "audio",
            "document",
            "file"
        ],
        default: "text"
    },

    attachment: [attachmentSchema],

    deliveredTo: [deliveredSchema],

    readyBy: [readSchema],

    isEdited: {
        type: Boolean,
        default: false
    },

    editedAt: Date,

    isDeleted: {
        type: Boolean,
        default: false,
    },

    deletedAt: Date,

    seen: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

messageSchema.index({
    conversation: 1,
    createAt: -1
})

messageSchema.index({
    sender: 1
})

export const Message = mongoose.model("Message", messageSchema);