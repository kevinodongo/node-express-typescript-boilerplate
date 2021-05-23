/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { roles } from '../utils/Roles';
import crypto from "crypto";
import { toJSON, paginate } from './plugins';


// email taken function check
type _isEmailTaken = (email: string, excludeUserId: any) => any
type _comparePassword = (password: any) => any


// user document
export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    facebook: string;
    role: string;
    // add more user fields
    user__profile: {
        name: string;
        gender: string;
        about: string;
        verified: string;
        picture: string;
    };
    comparePassword: _comparePassword;
    isEmailTaken: _isEmailTaken
    gravatar: (size: number) => string;
};

// user schema
const userSchema = new mongoose.Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value: string) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            enum: roles,
            default: 'user',
        },
        user__profile: {
            name: String,
            gender: String,
            about: String,
            verified: String,
            picture: String
        }
    },
    {
        timestamps: true,
    }
)

userSchema.plugin(toJSON)
userSchema.plugin(paginate)

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isEmailTaken: _isEmailTaken = async function (email: string, excludeUserId: any) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
userSchema.statics.isEmailTaken = isEmailTaken

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
const comparePassword: _comparePassword = async function (password: any) {
    const user = this as UserDocument
    return bcrypt.compare(password, user.password);
};
userSchema.methods.isPasswordMatch = comparePassword


// handle password
userSchema.pre('save', async function (next) {
    const user = this as UserDocument
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// handle gravatar
userSchema.methods.gravatar = function (size: 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

/**
 * @typedef User
 */
export const User = mongoose.model<UserDocument>('User', userSchema);



