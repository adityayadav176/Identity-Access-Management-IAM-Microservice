import { Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createJob = asyncHandler(async(req, res)=> {
    const {
        title,
        description,
        companyId,
        salary,
        location,
        skills,
        requirements,
        responsibilities,
        status,
        workSpaceType,
        employmentType,
        experienceLevel,
        category,
        applicationDeadline,
        openings
    } = req.body;

    const recruiterId = req.user._id;

    if(!recruiterId) {
        throw new ApiError(401, "Unauthorized");
    }

    if(!mongoose.isValidObjectId(companyId)) {
        throw new ApiError(400, "Invalid Company Id");
    }

    if(!title || !description || !companyId || !employmentType || !experienceLevel) {
        throw new ApiError(400, "Required Fields Are Missing");
    }

    const job = await Job.create({
        title, description, companyId, recruiterId, salary, location, skills, requirements, responsibilities, workSpaceType, employmentType, experienceLevel, category, applicationDeadline, openings, status
    });

    return res.status(201)
    .json(
        new ApiResponse(201, job, "Job Created Successfully")
    );
})

export {
    createJob
}