import Header from "@/components/Header/index";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import {
  getHankoSession,
  isTokenExpired
} from "@/helpers/hanko-helpers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let decoded = null;

  try {
    // Fetch the session
    decoded = await getHankoSession();

    // Check if the session is invalid or expired
    if (!decoded || await isTokenExpired(decoded.exp)) {
      return redirect("/login");
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error during session validation:", error);

    // Redirect to login on any error
    return redirect("/login");
  }

  // Render children if session is valid
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <Toaster />
      <main className="container mx-auto my-8 md:my-8 px-4 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
