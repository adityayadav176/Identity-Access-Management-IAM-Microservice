import { Conversation } from "../models/converstion.model.js";
import { Message } from "../models/message.model.js";
import { socketAuth } from "./socket.auth.js";

export const initializeSocket = (io) => {
    // Socket authentication
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        console.log("User ID:", socket.user._id);

        // ==========================================
        // JOIN CONVERSATION
        // ==========================================
        socket.on("join_conversation", async (conversationId) => {
            try {
                if (!conversationId) {
                    return socket.emit("socket_error", {
                        event: "join_conversation",
                        message: "Conversation ID is required",
                    });
                }

                // Find conversation
                const conversation = await Conversation.findById(
                    conversationId
                );

                if (!conversation) {
                    return socket.emit("socket_error", {
                        event: "join_conversation",
                        message: "Conversation not found",
                    });
                }

                // Check participant
                const isParticipant = conversation.participants.some(
                    (participantId) =>
                        participantId.toString() ===
                        socket.user._id.toString()
                );

                if (!isParticipant) {
                    return socket.emit("socket_error", {
                        event: "join_conversation",
                        message:
                            "You are not a participant of this conversation",
                    });
                }

                // Join conversation room
                socket.join(conversationId.toString());

                console.log(
                    `User ${socket.user._id} joined conversation ${conversationId}`
                );

                socket.emit("conversation_joined", {
                    success: true,
                    conversationId: conversationId.toString(),
                });
            } catch (error) {
                console.error(
                    "Join conversation error:",
                    error.message
                );

                socket.emit("socket_error", {
                    event: "join_conversation",
                    message: "Unable to join conversation",
                });
            }
        });

        // ==========================================
        // SEND MESSAGE
        // ==========================================
        socket.on("send_message", async (data) => {
            try {
                const {
                    conversationId,
                    content,
                    messageType = "text",
                } = data;

                // Validate data
                if (!conversationId || !content) {
                    return socket.emit("message_error", {
                        success: false,
                        message:
                            "conversationId and content are required",
                    });
                }

                // Find conversation
                const conversation = await Conversation.findById(
                    conversationId
                );

                if (!conversation) {
                    return socket.emit("message_error", {
                        success: false,
                        message: "Conversation not found",
                    });
                }

                // Check participant
                const isParticipant = conversation.participants.some(
                    (participantId) =>
                        participantId.toString() ===
                        socket.user._id.toString()
                );

                if (!isParticipant) {
                    return socket.emit("message_error", {
                        success: false,
                        message:
                            "You are not a participant of this conversation",
                    });
                }

                // Create message
                const message = await Message.create({
                    conversation: conversationId,
                    sender: socket.user._id,
                    content,
                    messageType,
                });

                // Update conversation
                conversation.lastMessage = message._id;
                conversation.lastMessageAt = new Date();

                await conversation.save();

                // Populate sender
                const populatedMessage = await Message.findById(
                    message._id
                ).populate(
                    "sender",
                    "name username profileImage"
                );

                // Emit message to conversation room
                io.to(conversationId.toString()).emit(
                    "new_message",
                    {
                        success: true,
                        message: populatedMessage,
                    }
                );

                console.log(
                    `Message sent by ${socket.user._id} in conversation ${conversationId}`
                );
            } catch (error) {
                console.error(
                    "Send message error:",
                    error.message
                );

                socket.emit("message_error", {
                    success: false,
                    message: "Failed to send message",
                });
            }
        });

        // ==========================================
        // DISCONNECT
        // ==========================================
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};