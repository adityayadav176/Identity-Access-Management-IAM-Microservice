import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    if(!req.user) {
        throw new ApiError(402, "Unauthorized Access Denied");
    }

    if(req.user.role !== "User") {
        throw new ApiError(403, "Admin Access required");
    }

    next();
});