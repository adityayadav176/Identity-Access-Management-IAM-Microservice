import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { UserProfile } from "../models/profile.model.js";

const calculateProfileCompletion = (profile) => {

    let score = 0;
    if(profile.bio)
        score += 10;
    if(profile.headline)
        score += 10;
    if(profile.skills && profile.skills.length > 0)
        score += 20;
    if(profile.projects && profile.projects.length > 0)
        score += 20;
    if(profile.experience && profile.experience.length > 0)
        score += 15;
    if(profile.education && profile.education.length > 0)
        score += 15;
    if(profile.resumeId)
        score += 10;
    return score;
};

const createProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        throw new ApiError(401, "Unauthorized Acess Denied");
    }

    const existingProfile = await UserProfile.findOne({
        userId
    })

    if(existingProfile) {
        throw new ApiError(409, "Profile Already Exists");
    }

     const {bio, headline, skills, projects, experience, education, socialLinks, resumeId, location, preferences} = req.body;

     const profileData = {
        userId,
        bio,
        headline,
        skills,
        projects,
        experience,
        education,
        socialLinks,
        resumeId,
        location,
        preferences
    };

    const profile = await UserProfile.create(
        profileData
    );

    profile.profileCompletion = calculateProfileCompletion(profile);

    return res.status(201).json(
        new ApiResponse(201, profile, "Profile created Successfully")
    )
})

const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if(!userId) {
        throw new ApiError(400, "Unauthorized Access Denied");
    }

    const profile = await UserProfile.findOne({userId});

    if(!profile) {
        throw new ApiError(404, "Profile Not Found");
    }

      const {
        bio,
        headline,
        skills,
        projects,
        experience,
        education,
        socialLinks,
        resumeId,
        location,
        preferences
    } = req.body;

    if (bio !== undefined) profile.bio = bio;
    if (headline !== undefined) profile.headline = headline;
    if (skills !== undefined) profile.skills = skills;
    if (projects !== undefined) profile.projects = projects;
    if (experience !== undefined) profile.experience = experience;
    if (education !== undefined) profile.education = education;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;
    if (resumeId !== undefined) profile.resumeId = resumeId;
    if (location !== undefined) profile.location = location;
    if (preferences !== undefined) profile.preferences = preferences;

    profile.profileCompletion = calculateProfileCompletion(profile);

    await profile.save();

    return res.status(200)
    .json(
        new ApiResponse(200, profile, "Profile Updated Successfully")
    )
})

export {
    createProfile,
    updateProfile
}
