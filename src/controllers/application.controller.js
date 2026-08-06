import { Application } from "../models/application.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Resume } from "../models/resume.model.js";

const applyForJob = asyncHandler(async (req, res) => {
    const user = req.user?._id;

    if(!user) {
        throw new ApiError(401, "Unauthorized Access Denied");
    }

    const { jobId } = req.params;

    if(!jobId || !mongoose.isValidObjectId(jobId)) {
        throw new ApiError(400, "Invalid JobId");
    }

     const job = await Job.findById(jobId);

    if(!job) {
        throw new ApiError(404, "Job Not Found");
    }

     if(job.status !== "OPEN" || job.isDeleted) {
        throw new ApiError(400, "Job is not accepting applications");
    }

     if(job.openings <= 0) {
        throw new ApiError(400, "No Openings available");
    }

     if(job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
        throw new ApiError(400, "Job Is Expired");
    }

    const alreadyApplied = await Application.findOne({
        candidateId: user,
        jobId: jobId
    })

    if(alreadyApplied) {
        throw new ApiError(400, "You have already applied for this job");
    }

    const resume = await Resume.findOne({user});

    if(!resume) {
        throw new ApiError(400, "Please upload resume before applying")
    }

    const application = await Application.create({
        candidateId: user,
        jobId: job._id,
        companyId: job.companyId,
        resumeId: resume._id
    })

    return res.status(201)
    .json(
        new ApiResponse(201, application, "Apply For This Job Successfully")
    )
})

const getMyApplications = asyncHandler(async (req, res) => {
    const user = req.user._id;

    if(!user) {
        throw new ApiError(401, "Unauthorized Access Denied");
    }

    const page = Number(req.query?.page || 1);
    const limit = Number(req.query?.limit || 10);
    const skip = (page - 1) * limit;

    const applications = await Application.find({
    candidateId: user,
    isDeleted: false
})
.populate(
    "jobId",
    "title salary companyId"
)
.populate(
    "resumeId"
)
.skip(skip)
.limit(limit);

    const totalApplications = await Application.countDocuments({
        candidateId: user,
        isDeleted: false
    });

    const totalPages = Math.ceil(totalApplications / limit);

    if(applications.length === 0) {
        throw new ApiError(404, "You Currently Don't Have Any Applications");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200, 
            {
                applications,
                pagination: {
                    currentPage: page,
                    limit,
                    totalApplications,
                    totalPages: Math.ceil(totalApplications / limit)
                }
            },
            "Application Fetched successfully"
        )
    )
})

export {
    applyForJob,
    getMyApplications
}