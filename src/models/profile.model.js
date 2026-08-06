import mongoose, { Schema } from "mongoose";

const userProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User"
    },
    bio: {
        type: String,
        maxlength: 500,
        trim: true
    },
    headline: {
        type: String,
        trim: true
    },
    skills: [
        {
            name: {
                type: String,
                trim: true
            },
            level: {
                type: String,
                enum: [
                    "beginner",
                    "intermediate",
                    "expert"
                ],
                default: "intermediate"
            }
        }
    ],
    projects: [
        {
            title: {
                type: String,
                required: true
            },
            description: String,
            githubUrl: String,
            liveUrl: String,
            image: {
                url: String,
                public_id: String
            },
            technologies: [
                String
            ],
            startDate: Date,
            endDate: Date
        }
    ],
    experience: [
        {
            company: String,
            position: String,
            employmentType: {
                type: String,
                enum: [
                    "internship",
                    "full-time",
                    "part-time",
                    "contract"
                ]
            },
            startDate: Date,
            endDate: Date,
            currentlyWorking: {
                type: Boolean,
                default: false
            },
            description: String
        }
    ],
    education: [
        {
            institute: {
                type: String,
                trim: true
            },
            degree: String,
            field: String,
            startYear: Number,
            endYear: Number,
            grade: String
        }
    ],
    socialLinks: {
        github: String,
        linkedin: String,
        portfolio: String
    },
    resumeId: {
        type: Schema.Types.ObjectId,
        ref: "Resume"
    },
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    location: {
        city: String,
        state: String,
        country: {
            type: String,
            default: "India"
        }
    },
    preferences: {
        lookingForJob: {
            type: Boolean,
            default: true
        },
        expectedSalary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: "INR"
            }
        },
        preferredJobType: [
            {
                type: String,
                enum: [
                    "remote",
                    "hybrid",
                    "onsite"
                ]
            }
        ]
    }
}, { timestamps: true });

userProfileSchema.index({
    bio: "text",
    headline: "text",
    "skills.name": "text",
    "projects.technologies": "text",
    "experience.company": "text",
    "experience.position": "text",
    "education.degree": "text",
    "education.field": "text",
    "location.city": "text",
    "location.country": "text"
});
export const UserProfile = mongoose.model(
    "UserProfile",
    userProfileSchema
);