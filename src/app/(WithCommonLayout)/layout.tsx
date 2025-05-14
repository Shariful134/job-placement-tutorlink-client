import Footer from "@/components/ui/shared/Footer";
import Navbar from "@/components/ui/shared/Navbar";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="full">
      <Navbar></Navbar> <main className="min-h-screen">{children}</main>{" "}
      <Footer></Footer>
    </div>
  );
};

export default CommonLayout;
