import { Conversation } from "../models/converstion.model.js";
import { socketAuth } from "./socket.auth.js";

export const initializeSocket = (io) => {

    io.use(socketAuth);

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);
        console.log("User ID:", socket.user._id);

        socket.on("join_conversation", async (conversationId) => {
            try {
                const conversation = await Conversation.findById(conversationId);

                if(!conversation) {
                    return socket.emit("socket_error", {
                        event: "join_conversation",
                        message: "Conversation not found"
                    })
                }

                const isParticipant = conversation.participants.some((participantId) => {
                    participantId.toString() === socket.user._id.toString()
                })

                if(!isParticipant) {
                    return socket.emit("socket_error", {
                        event: "join_conversation",
                        message: "You are not a participant of this conversation"
                    })
                }

                socket.join(conversationId.toString());

                console.log(`User ${socket.user._id} joined conversation ${conversationId}`);

                socket.emit("conversation_joined", {
                    conversationId: conversationId.toString(),
                })
            } catch (error) {
                console.error("join conversation error",  error.message);

                socket.emit("socket_error", {
                    event: "join_conversation",
                    message: "Unable to join conversation",
                });
            };
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.id);
        });
    });
};