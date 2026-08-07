import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { verifyUser } from "../middleware/verifyUser.middleware.js"

import { User } from "../models/user.model.js"
import { Company } from "../models/company.model.js"
import { Job } from "../models/job.model.js"
import { Application } from "../models/application.model.js"
import { Interview } from "../models/interview.model.js"
import mongoose from "mongoose"

const scheduleInterview = asyncHandler(async (req, res) => {
    const recruiterId = req.user._id;

    const {
        application,
        company,
        candidate,
        job,
        round,
        interviewType,
        location,
        scheduledAt,
        duration,
        timezone
    } = req.body;

    if (!application || !company || !job || !candidate || !interviewType || !scheduledAt) {
        throw new ApiError(400, "All Fields Are Required");
    }

    if (!application || !mongoose.isValidObjectId(application)) {
        throw new ApiError(400, "Invalid ApplicationId")
    }

    if (!job || !mongoose.isValidObjectId(job)) {
        throw new ApiError(400, "Invalid JobId")
    }

    if (!company || !mongoose.isValidObjectId(company)) {
        throw new ApiError(400, "Invalid CompanyId")
    }

    if (!candidate || !mongoose.isValidObjectId(candidate)) {
        throw new ApiError(400, "Invalid CandidateId")
    }

    const applicationDoc = await Application.findById(application);

    if (!applicationDoc) {
        throw new ApiError(404, "Application Not Found");
    }

    const jobDoc = await Job.findById(job);

    if (!jobDoc) {
        throw new ApiError(404, "Job Not Found");
    }

    const companyDoc = await Company.findById(company);

    if (!companyDoc) {
        throw new ApiError(404, "Company Not Found");
    }

    const candidateDoc = await User.findById(candidate);

    if (!candidateDoc) {
        throw new ApiError(404, "Canidate Not Found");
    }

    const interviewDate = new Date(scheduledAt);

    if (interviewDate <= new Date()) {
        throw new ApiError(400, "Interview Must be scheduled in the future");
    }

    if (interviewType === "Offline" && (!location || !location.trim())) {
        throw new ApiError(400, "Location Required For Offline Interview");
    }

    const existingInterview = await Interview.findOne({
        application,
        round: round || 1,
        status: {
            $in: ["Scheduled", "Accepted", "Rescheduled"]
        }
    });

    if (existingInterview) {
        throw new ApiError(409, "Interview For this Round already exists");
    }

    const interview = await Interview.create({
        application,
        job,
        company,
        candidate,
        recruiter: recruiterId,
        round: round || 1,
        interviewType,
        location: interviewType === "Offline" ? location.trim() : undefined,

        scheduledAt: interviewDate,
        duration: duration || 60,
        timezone: timezone || "Asia/Kolkata"
    });

    return res.status(201)
        .json(
            new ApiResponse(201, interview, "Interview Scheduled successfully")
        )
})

const getInterviewById = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    if (!interviewId || !mongoose.isValidObjectId(interviewId)) {
        throw new ApiError(400, "Invalid InterviewID");
    }

    const interview = await Interview.findById(interviewId)
        .populate("candidate", "fullName avatar email")
        .populate("recruiter", "fullName avatar email")
        .populate("application")
        .populate("job", "title companyId");

    if (!interview) {
        throw new ApiError(404, "Interview Not found");
    }

    if (interview.candidate._id.toString() !== req.user._id.toString() && interview.recruiter_id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized Access Denied");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, interview, "Interview Fetched Successfully")
        )
})

const getMyInterviews = asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const filter = {
        $or: [
            { candidate: req.user._id },
            { recruiter: req.user._id }
        ]
    }

    const interviews = await Interview.find(filter)
        .populate("candidate", "fullName avatar email")
        .populate("recruiter", "fullName avatar email")
        .populate("application")
        .populate("job", "title companyId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    if (!interviews) {
        throw new ApiError(404, "Interview Not Found");
    }

    const totalInterview = await Interview.countDocuments(filter);

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    interviews,
                    pagination: {
                        totalInterview,
                        currentPage: page,
                        totalPage: Math.ceil(totalInterview / limit),
                        limit
                    }
                },
                "Interviews Fetched Successfully")
        )
})

const rescheduleInterview = asyncHandler(async (req, res) => {
    const {interviewId} = req.params;
    const {scheduledAt} = req.body;

    if(!interviewId) {
        throw new ApiError(400, "Interview ID is required");
    }

    if(!scheduledAt) {
        throw new ApiError(400, "New interview date & time is required");
    }

    const interview = await Interview.findById(interviewId);

    if(!interview) {
        throw new ApiError(404, "Interview Not Found");
    }

    if(interview.recruiter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only recruiter can reschedule interview");
    }

    interview.scheduledAt = new Date(scheduledAt);
    interview.status = "Rescheduled";

    await interview.save()

    return res.status(200).json(
        new ApiResponse(200, interview, "Interview Rescheduled successfully")
    )
})

const updateInterviewStatus = asyncHandler(async (req, res) => {
    const {interviewId} = req.params;
    const {status} = req.body;

    const allowedStatus = [
            "Scheduled",
            "Accepted",
            "Rejected",
            "Completed",
            "Cancelled",
            "Reschedule Requested",
            "Rescheduled",
            "No Show"
    ];

    if(!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid interview status");
    }

    const interview = await interview.findById(interviewId);

    if(!interview) {
        throw new ApiError(404, "interview not found");
    }

    if(interview.recruiter.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only recruiter can update interview status");
    }

    interview.status = status;
    await interview.save();

    return res.status(200)
    .json(
        new ApiResponse(200, interview, "Interview status Updated Successfully")
    )
})

export {
    scheduleInterview,
    getInterviewById,
    getMyInterviews,
    rescheduleInterview,
    updateInterviewStatus
}