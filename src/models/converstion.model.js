import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],

    conversationType: {
        type: String,
        enum: ["direct", "group"],
        default: "direct"
    },

    groupName: {
        type: String,
        trim: true
    },

    groupAdmin: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },

    lastMessageAt: {
        type: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    deletedAt: Date
}, { timestamps: true });

conversationSchema.index({
    participants: 1
})

conversationSchema.index({
    lastMessageAt: -1
})

export const Conversation = mongoose.model("Conversation", conversationSchema);