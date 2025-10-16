import dbConnect from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendJsonResponse } from "@/helpers/sendJsonResponse";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //checking user session
  if (!session || !session.user) {
    return sendJsonResponse(false, "Not authenticated", 401);
  }

  const userId = new mongoose.Types.ObjectId(user?._id as string);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
      return sendJsonResponse(false, "User not found", 400);
    }

    return sendJsonResponse(true, "", 200, { messages: user[0].messages });
  } catch (error) {
    console.log(error);
    return sendJsonResponse(false, "Internal server error", 500);
  }
}
