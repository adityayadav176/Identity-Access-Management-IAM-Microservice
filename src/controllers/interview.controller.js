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



export {
    scheduleInterview,
    getInterviewById,
    getMyInterviews,
    rescheduleInterview,
    updateInterviewStatus
}