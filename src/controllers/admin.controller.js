import { User } from "../models/user.models.js";
import { Book } from "../models/Book.models.js";
import { Transaction } from "../models/Transaction.model.js";
import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (!users.length) {
        throw new ApiError(404, "No users found");
    }
    return res.json(
        new ApiResponse(200, { users }, "Users data fetched successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();
    return res.json(
        new ApiResponse(200, {}, `User with username ${username} removed`)
    );
});

const getSystemStatistics = asyncHandler(async (req, res) => {
    const [userCount, bookCount, transactionCount, availableBooksCount] = await Promise.all([
        User.countDocuments({}),
        Book.countDocuments({}),
        Transaction.countDocuments({}),
        Book.countDocuments({ available: { $gt: 0 } })
    ]);

    return res.json(
        new ApiResponse(200, {
            userCount,
            bookCount,
            transactionCount,
            availableBooksCount,
        }, "System statistics fetched successfully")
    );
});



export {
    getAllUsers,
    deleteUser,
    getSystemStatistics
}