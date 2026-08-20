import { Message } from "../models/message.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { Conversation } from "../models/converstion.model.js"

const getMessages = asyncHandler(async (req, res) => {

    const { conversationId } = req.params;

    const userId = req.user?._id;

    const { before } = req.query;

    let limit = Number(req.query.limit) || 30;

    // Prevent very large requests
    if (limit < 1) {
        limit = 30;
    }

    if (limit > 50) {
        limit = 50;
    }

    // Authentication

    if (!userId) {
        throw new ApiError(
            401,
            "Unauthorized access denied"
        );
    }


    // Validate conversation ID

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid conversation ID");
    }

    // Validate before cursor
    if (before && !mongoose.isValidObjectId(before)) {
        throw new ApiError(400, "Invalid pagination cursor");
    }
    // Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new ApiError(
            404,
            "Conversation not found"
        );
    }
    // Check deleted conversation
    if (conversation.isDeleted) {
        throw new ApiError(404, "Conversation is deleted");
    }
    // Check user is participant
    const isParticipant = conversation.participants.some(
        participant =>
            participant.toString() === userId.toString()
    );

    if (!isParticipant) {
        throw new ApiError(
            403,
            "You are not a participant of this conversation"
        );
    }
    // Build message query
    const query = {
        conversation: conversationId,
        isDeleted: false
    };


    // Cursor pagination
    if (before) {

        const cursorMessage = await Message.findOne({
            _id: before,
            conversation: conversationId
        });

        if (!cursorMessage) {
            throw new ApiError(
                400,
                "Invalid message cursor"
            );
        }

        query.createdAt = {
            $lt: cursorMessage.createdAt
        };
    }
    // Fetch messages
    const messages = await Message.find(query)
        .sort({
            createdAt: -1
        })
        .limit(limit + 1)
        .populate(
            "sender",
            "name email avatar"
        );
    // Check if more messages exist
    const hasMore = messages.length > limit;
    // Remove extra message
    if (hasMore) {
        messages.pop();
    }
    // Reverse for chat UI
    messages.reverse();
    // Next cursor
    const nextCursor =
        hasMore && messages.length > 0
            ? messages[0]._id
            : null;
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                messages,
                pagination: {
                    limit,
                    hasMore,
                    nextCursor
                }
            },
            "Messages fetched successfully"
        )
    );
});



export {
    markMessageAsRead,
    markMessageAsDelivered,
    getMessages,
    editMessage,
    deleteMessage
};
