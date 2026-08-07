import mongoose, { Schema } from "mongoose";

const socialLinksSchema = new Schema({
    website: {
        type: String,
        trim: true,
        default: ""
    },

    linkedin: {
        type: String,
        trim: true,
        default: "",
    },

    github: {
        type: String,
        trim: true,
        default: true,
    },

    twitter: {
        type: String,
        trim: true,
        default: "",
    }
}, {
    _id: false,
}, { timestamps: true })

const recruiterSchema = new Schema({
    recruiterId: {
        type: Schema.Types.ObjectId,
        required: true
    },

    role: {
        type: String,
        enum: ["OWNER", "ADMIN", "RECRUITER"],
        default: "RECRUITER"
    },

    joinedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: false,
}
);

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
        maxlength: 3000
    },

    industry: {
        type: String,
        trim: true
    },

    companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10001"],
    },

    foundedYear: {
        type: Number
    },

    headquarters: {
        country: String,
        state: String,
        city: String,
    },

    logo: {
        url: String,
        publicId: String
    },

    banner: {
        url: String,
        publicId: String
    },

    recruiters: {
        type: [recruiterSchema],
        default: [],
    },

    socialLinks: socialLinksSchema,

    isVerified: {
        type: Boolean,
        default: false
    },

    deletedAt: {
        type: Date,
        default: null,
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


companySchema.index({
    name: "text",
    description: "text"
}),

    companySchema.index({
        industry: 1,
    }),

    companySchema.index({
        "headquarters.city": 1,
    }),

    companySchema.index({
        "recruiters.recruiterId": 1,
    })

export const Company = mongoose.model("Company", companySchema);