import { Job, Job } from "../models/job.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createJob = asyncHandler(async (req, res) => {
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

    if (!recruiterId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!mongoose.isValidObjectId(companyId)) {
        throw new ApiError(400, "Invalid Company Id");
    }

    if (!title || !description || !companyId || !employmentType || !experienceLevel) {
        throw new ApiError(400, "Required Fields Are Missing");
    }

    const job = await Job.create({
        title, description, companyId, recruiterId, salary, location, skills, requirements, responsibilities, workSpaceType, employmentType, experienceLevel, category, applicationDeadline, openings, status
    });

    if (!job) {
        throw new ApiError(400, "Job Creating Failed..")
    }

    return res.status(201)
        .json(
            new ApiResponse(201, job, "Job Created Successfully")
        );
})

const updateJob = asyncHandler(async (req, res) => {
    const { JobId } = req.params;

    if (!JobId || !mongoose.isValidObjectId(JobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const recruiterId = req.user?._id;

    if (!recruiterId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const existingJob = await Job.findOne({
        _id: JobId,
        recruiterId,
        isDeleted: false
    });

    if (!existingJob) {
        throw new ApiError(
            403,
            "You are not allowed to update this job or job not found."
        );
    }

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

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (companyId !== undefined) updateData.companyId = companyId;
    if (salary !== undefined) updateData.salary = salary;
    if (location !== undefined) updateData.location = location;
    if (skills !== undefined) updateData.skills = skills;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (status !== undefined) updateData.status = status;
    if (workSpaceType !== undefined) updateData.workSpaceType = workSpaceType;
    if (employmentType !== undefined) updateData.employmentType = employmentType;
    if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
    if (category !== undefined) updateData.category = category;
    if (applicationDeadline !== undefined) {
        if (new Date(applicationDeadline) < new Date()) {
            throw new ApiError(
                400,
                "Application deadline cannot be in the past."
            );
        }

        updateData.applicationDeadline = applicationDeadline;
    }

    if (openings !== undefined) updateData.openings = openings;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields provided for update.");
    }

    const updatedJob = await Job.findByIdAndUpdate(
        JobId,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedJob,
            "Job updated successfully."
        )
    );
});

const deleteJob = asyncHandler(async (req, res) => {
    const { JobId } = req.params;

    if (!JobId || !mongoose.isValidObjectId(JobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const recruiterId = req.user?._id;

    if (!recruiterId) {
        throw new ApiError(401, "Unauthorized Access");
    }

    const job = await Job.findOne({
        _id: JobId,
        recruiterId,
        isDeleted: false
    });

    if (!job) {
        throw new ApiError(
            404,
            "Job not found or you are not authorized to delete it."
        );
    }

    job.isDeleted = true;
    job.status = "CLOSED";

    await job.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Job deleted successfully."
        )
    );
});

const permanentDeleteJob = asyncHandler(async (req, res) => {
    const { JobId } = req.params;

    if(!JobId || !mongoose.isValidObjectId(JobId)) {
        throw new ApiError(400, "Invalid JoId");
    }

    const recruiterId = req.user._id;

    if(!recruiterId) {
        throw new ApiError(401, "You are not authorized to perform this task")
    }

    const job = await Job.findOneAndDelete({
        _id: JobId,
        recruiterId,
        isDeleted: true
    })

    if(!job) {
        throw new ApiError(404, "Job not found or you are not authorized to delete it.")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{}, "Job Deleted Successfully")
    )
})

export {
    createJob,
    updateJob,
    permanentDeleteJob,
    deleteJob
}