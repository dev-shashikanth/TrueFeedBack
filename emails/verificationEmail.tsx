import React from "react";

interface verificationEmailTypes {
  username: string;
  otp: string;
}

const verificationEmail = ({ username, otp }: verificationEmailTypes) => {
  return (
    <div>
      Hello, {username}
      <p>Here is the otp :{otp} </p>
    </div>
  );
};

export default verificationEmail;
