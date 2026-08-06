import mongoose, {Schema} from "mongoose";

const ApplicationSchema = new Schema({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
        index: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        index: true,
        required: true
    },
    resumeId: {
        type: Schema.Types.ObjectId,
        ref: "Resume",
        required: true
    },
    status: {
        type: String,
        enum: ["applied", "screening", "shortlisted", "interview_scheduled", "interview_completed", "selected", "rejected", "withdrawn"],
        default: "applied",
        index: true
    },
    recruiterNotes: {
        type: String,
        trim: true,
        default: "",
    },
    atsScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    atsStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending"
    },
    interviewId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, {timestamps: true});

ApplicationSchema.index(
    {candidateId: 1, jobId: 1},
    {unique: 1}
);

export const Application = mongoose.model("Application", ApplicationSchema);