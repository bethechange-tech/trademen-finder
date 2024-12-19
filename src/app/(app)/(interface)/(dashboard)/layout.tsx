import { getAuthUser } from "@/utils/actions";
import Sidebar from "./Sidebar";
import { getHankoSession, isTokenExpired } from "@/helpers/hanko-helpers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let decoded = null;
  let currentUser = null;

  try {
    // Fetch user session and authentication details
    [
      decoded,
      currentUser
    ] = await Promise.all([
      getHankoSession(),
      getAuthUser(),
    ]);

    // If session is invalid or expired, redirect to login
    if (!decoded || await isTokenExpired(decoded.exp)) {
      return redirect("/login");
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error during authentication:", error);
    // Redirect to login if any errors occur
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for navigation */}
      <Sidebar currentUser={currentUser} />
      <div className="flex-1 flex flex-col">
        {/* Render children content */}
        {children}
      </div>
    </div>
  );
}
