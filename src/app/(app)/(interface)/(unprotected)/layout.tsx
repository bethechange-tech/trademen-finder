import Header from "@/components/Header/index";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
