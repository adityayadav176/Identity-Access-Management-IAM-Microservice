import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import { Interview } from "../models/interview.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getAdminDashboardStats = asyncHandler(async (req, res) => {

    const [
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalCompanies,
        verifiedCompany,
        totalJobs,
        activeJobs,
        totalApplications,
        totalInterviews
    ] = await Promise.all([

        // Users
        User.countDocuments(),

        User.countDocuments({
            role: "User"
        }),

        User.countDocuments({
            role: "recruiter"
        }),

        // Companies
        Company.countDocuments(),

        Company.countDocuments({
            isVerified: true
        }),

        // Jobs
        Job.countDocuments(),

        Job.countDocuments({
            status: "OPEN"
        }),

        // Applications
        Application.countDocuments(),

        // Interviews
        Interview.countDocuments()
    ]);


    // ==============================
    // APPLICATION STATISTICS
    // ==============================

    const applicationStats = await Application.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);


    const applications = {};

    applicationStats.forEach(item => {
        applications[item._id] = item.count;
    });

    const interviewStats = await Interview.aggregate([
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);


    const interviews = {};

    interviewStats.forEach(item => {
        interviews[item._id] = item.count;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users: {
                    total: totalUsers,
                    candidates: totalCandidates,
                    recruiters: totalRecruiters
                },

                companies: {
                    total: totalCompanies,
                    verified: verifiedCompany
                },

                jobs: {
                    total: totalJobs,
                    active: activeJobs
                },

                applications: {
                    total: totalApplications,
                    ...applications
                },

                interviews: {
                    total: totalInterviews,
                    ...interviews
                }
            },
            "Admin dashboard statistics fetched successfully"
        )
    );
});


export {
    getAdminDashboardStats
};