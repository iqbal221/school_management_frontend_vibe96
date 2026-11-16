import { redirect } from "next/navigation";
import Login from "./login/page";
import DashboardLayout from "./(withlayout)/layout";
import DashboardPage from "./(withlayout)/dashboard/page";
import LoginPage from "@/components/Login/Login";

const HomePage = () => {
  // redirect("/dashboard");
  return <LoginPage></LoginPage>
};

export default HomePage;
