import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import slugify from "slugify";

const createCompany = asyncHandler(async (req, res) => {
    const recruiterId = req.user?._id;

    if (!recruiterId || !mongoose.isValidObjectId(recruiterId)) {
        throw new ApiError(401, "Unauthorized");
    }

    const {
        name,
        description,
        industry,
        companySize,
        foundedYear,
        headquarters,
        socialLinks,
    } = req.body;

    if(!name.trim()) {
        throw new ApiError(400, "Company name is required");
    }

    let slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    })

    let finalSlug = slug;
    let count = 1;

    while(await Company.exists({slug: finalSlug})) {
        finalSlug = `${slug}-${count++}`;
    }

    const company = await Company.create({
        name: name.trim(),
        slug: finalSlug,
        description,
        industry,
        companySize,
        foundedYear,
        headquarters,
        socialLinks,

        recruiters: [
            {
                recruiterId,
                role: "OWNER",
            },
        ],
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            company,
            "Company created successfully"
        )
    );
});

export {
    createCompany
}