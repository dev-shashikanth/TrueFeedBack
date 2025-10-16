import { sendJsonResponse } from "@/helpers/sendJsonResponse";
import dbConnect from "@/lib/connectDB";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  //checking user session
  if (!session || !session.user) {
    return sendJsonResponse(false, "Not authenticated", 401);
  }

  try {
    const updatedResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      sendJsonResponse(false, "Message not found or alredy deleted", 404);
    }

    return sendJsonResponse(true, "Message Deleted", 200);
  } catch (error) {
    console.error("Error in delete message route", error);
    return sendJsonResponse(false, "Error deleting message", 500);
  }
}
