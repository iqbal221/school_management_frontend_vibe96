import { redirect } from "next/navigation";
import Login from "./login/page";
import DashboardLayout from "./(withlayout)/layout";
import DashboardPage from "./(withlayout)/dashboard/page";
import LoginPage from "@/components/Login/Login";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ScreenshotsSection from "@/components/landing/Screenshot";
import WhyChooseSchoolERP from "@/components/landing/WhyChooseUs";
import HowItWorks from "@/components/landing/HowItWorks";
import SecuritySection from "@/components/landing/SecuritySection";
import FAQSection from "@/components/landing/Faq";
import Footer from "@/components/landing/Footer";
import AboutSection from "@/components/landing/About";

const HomePage = () => {
  // redirect("/dashboard");
  return (

    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      {/* <DashboardPreview/> */}
      <FeaturesSection />
      <ScreenshotsSection />
      <AboutSection />
      <WhyChooseSchoolERP />
      <HowItWorks />
      <SecuritySection />
      <FAQSection />
      <Footer />
    </main>
  )

};

export default HomePage;
