// import "./globals.css";
"use client";

import { useParams } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const username = params?.username;
  return (
    <>
      <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a className="text-xl font-bold mb- md:mb-0" href="#">
            Mystery message
          </a>

          <span className="mr-4">
            Message to <span className="font-semibold">{username}</span>{" "}
          </span>
        </div>
      </nav>
      {children}
    </>
  );
}
