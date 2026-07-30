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

const getCompanyById = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const recruiterId = req.user?._id;

    if (!companyId || !mongoose.isValidObjectId(companyId)) {
        throw new ApiError(400, "Invalid Company ID");
    }

    if (!recruiterId || !mongoose.isValidObjectId(recruiterId)) {
        throw new ApiError(401, "Unauthorized");
    }

    const company = await Company.findOne({
        _id: companyId,
        "recruiters.recruiterId": recruiterId,
    });

    if (!company) {
        throw new ApiError(
            404,
            "Company not found or you are not authorized to access it."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            company,
            "Company fetched successfully."
        )
    );
});

export {
    createCompany,
    getCompanyById
}