import Footer from "@/components/dashboard/Footer";
import NavBar from "@/components/dashboard/NavBar";

export default function DashboardLayout({
  children,
}: Readonly<{} & {
  children: React.ReactNode;
}>) {
  return (
    <div>
        <NavBar />
        <main className="flex min-h-screen flex-col items-center justify-between p-24"> 
          {children}
        </main>
        <Footer />
    </div>
  );
}