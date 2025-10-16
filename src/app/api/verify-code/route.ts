import { sendJsonResponse } from "@/helpers/sendJsonResponse";
import dbConnect from "@/lib/connectDB";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) return sendJsonResponse(false, "User not found", 500);

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return sendJsonResponse(true, "Account verified", 200);
    } else if (isCodeNotExpired) {
      return sendJsonResponse(
        false,
        "verification code expired, please signup again ",
        400
      );
    } else {
      return sendJsonResponse(false, "Incorrect verificaiton code ", 400);
    }
  } catch (error) {
    console.error("Verify code error", error);
    return Response.json(
      {
        success: false,
        message: "verify code error",
      },
      {
        status: 500,
      }
    );
  }
}
