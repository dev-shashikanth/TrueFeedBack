import { resend } from "@/lib/resend";

import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "you@example.com",
      to: email,
      subject: "verificaiton code",
      react: verificationEmail({ username, otp: verifyCode }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verificaiton email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
