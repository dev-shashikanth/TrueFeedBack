import dbConnect from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendJsonResponse } from "@/helpers/sendJsonResponse";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //checking user session
  if (!session || !session.user) {
    return sendJsonResponse(false, "Not authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return sendJsonResponse(
        false,
        "failed to update user status to accept messages",
        500
      );
    }

    return sendJsonResponse(
      true,
      "message acceptance status updatd successfully",
      200
    );
  } catch (error) {
    return sendJsonResponse(
      false,
      "failed to update user status to accept messages",
      500
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //checking user session
  if (!session || !session.user) {
    return sendJsonResponse(false, "Not authenticated", 401);
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return sendJsonResponse(false, "User not found", 404);
    }

    return sendJsonResponse(true, "", 200, {
      isAcceptingMessage: foundUser.isAcceptingMessage,
    });
  } catch (error) {
    return sendJsonResponse(
      false,
      "Error in getting message acceptance status",
      500
    );
  }
}
