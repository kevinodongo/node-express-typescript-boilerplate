/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { User } from "../models/user.model"
import ApiError from '../utils/ApiError';

/**
 * Create a user
  * @param {Object} userBody
 * @returns {Promise<User>}
 */
export const createUser = async (userBody: any) => {
  const user = new User({
    email: userBody.email,
    password: userBody.password
  });
 
  // check if user email exists

  const response = await getUserByEmail(userBody.email)
  console.log("[RESPONSE]", response)
  if(response){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken', false, '');
  }

  // save new user
  const saved__user = await user.save()
  if(!saved__user){
    throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Some error occurred while creating user.', false, '');
  }
  return saved__user
};


/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
 export const getUserById = async (id: string) => {
  return User.findById(id);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
 export const queryUsers = async (filter: any, options: any) => {
  const users = await User.find(filter, options)
  return users;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
 export const getUserByEmail = async (userEmail: string) => {
  return User.findOne({ email: userEmail });
};


/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
 export const updateUserById = async (userId: string, updateBody: any) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found', false, '');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
export const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found', false, '');
  }
  await user.remove();
  return user;
}