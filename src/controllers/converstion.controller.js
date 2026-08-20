import mongoose from "mongoose";

import { Conversation } from "../models/converstion.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Create or get existing conversation


const getMyConversation = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access denied")
    }

    const conversation = await Conversation.find({
        participants: userId,

        isDeleted: false
    }).sort({
        createdAt: -1,
    }).populate("participants", "name email avatar");

    if (!conversation || conversation.length === 0) {
        throw new ApiError(404, "Conversation Not Found");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, conversation, "converstation fethed Successfully")
        )
})

const getConversationById = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access Denied");
    }

    const { conversationId } = req.params;

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid conversationId");
    }

    const conversation = await Conversation.findOne({
        _id: conversationId,
        isDeleted: false,
        participants: userId
    })
        .populate("participants", "name email avatar");

    if (!conversation) {
        throw new ApiError(404, "conversation not found");
    }

    return res.status(200).json(
        new ApiResponse(200, conversation, "Conversation Fetched Successfully")
    )
})

const parmanentlyDeleteConversation = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access denied");
    }

    const { conversationId } = req.params;

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid conversation id")
    }

    const conversation = await Conversation.findOneAndDelete({
        _id: conversationId,
        isDeleted: true,
        participants: userId
    });

    if (!conversation) {
        throw new ApiError(404, "Conversation not found or you are not authorized");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, {}, "conversation Deleted Successfully")
        )
})

const deleteConversation = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access Denied")
    }

    const { conversationId } = req.params;

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid conversationId");
    }

    const conversation = await Conversation.findOneAndUpdate(
        {
            _id: conversationId,
            participants: userId,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true
            }
        },
        {
            new: true
        }
    );

    if (!conversation) {
        throw new ApiError(404, "Conversation not found or deleted ")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Conversation moved to recycle bin sussessfully")
        )
})

const restoreConversation = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Access denied");
    }

    const { conversationId } = req.params;

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
        throw new ApiError(400, "Invalid conversationId")
    }

    const conversation = await Conversation.findOneAndUpdate(
        {
            _id: conversationId,
            participants: userId,
            isDeleted: true
        },
        {
            $set: {
                isDeleted: false,
            }
        },
        {
            new: true
        }
    );

    if(!conversation) {
        throw new ApiError(404, "Conversation not found or restored")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, conversation, "Conversation restored successfully")
    )
})

export {
    createOrGetConversation,
    getMyConversation,
    getConversationById,
    parmanentlyDeleteConversation,
    deleteConversation
};