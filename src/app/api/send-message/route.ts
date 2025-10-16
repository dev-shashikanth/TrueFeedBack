import dbConnect from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendJsonResponse } from "@/helpers/sendJsonResponse";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return sendJsonResponse(false, "User not found", 404);
    }

    //is user accepting the messages
    if (!user.isAcceptingMessage)
      return sendJsonResponse(false, "User is not accepting messages", 403);

    const newMessage = { content, createdAt: new Date() }
    
    user.messages.push(newMessage as Message)

    await user.save()
    return sendJsonResponse(true, "Message sent successfully", 200)
  } catch (error) {
    return sendJsonResponse(false, "Internal error", 200);

  }
}
