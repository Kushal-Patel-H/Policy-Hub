import { useRef, useState, useEffect } from "react";
import WelcomeNavbar from "../../components/WelcomeNavbar/WelcomeNavbar";
import FeatureCard from "../../components/FeatureCard";
import backgroundImage from "../../assets/welcome-bg.png";
import policy from "../../assets/policy.png";
import alerts from "../../assets/alerts.png";
import customers from "../../assets/customers.png";
import analytics from "../../assets/analytics.png";
import about_1 from "../../assets/about_1.jpg";
import about_2 from "../../assets/about_2.jpg";
import RegisterModal from "../../components/Modal/RegisterModal";



export default function Welcome() {
  const aboutRef = useRef(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(true);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 100) {   // hide after scrolling 100px
      setShowArrow(false);
    } else {
      setShowArrow(true);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  
  return (
    <div className="min-h-screen bg-white">
      {/* fixed navbar */}
      <WelcomeNavbar />

      {/* HERO SECTION with background image */}
      <section
        className="pt-24 md:pt-28 pb-16 md:pb-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.6)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* gradient heading */}
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"> 
            <span className="bg-gradient-to-b from-[#0A2A67] to-[#0A2A65]/70 bg-clip-text text-transparent" > 
            “Take Control of 
            <br className="hidden sm:block" /> Your Clients’ Policies” </span> </h1>

          {/* features */}
          <div className="text-center mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              title="All‑in‑One Policy Hub"
              text="Track and manage all insurance policies with ease, in one place."
              iconSrc={policy} 
            />
            <FeatureCard
              title="Smart Alerts"
              text="Automated reminders for policy renewals and expiries."
              iconSrc={alerts} 
            />
            <FeatureCard
              title="Customer Relations"
              text="Advanced customer management with full policy history."
              iconSrc={customers}
            />
            <FeatureCard
              title="Analytics Dashboard"
              text="Visual insights to monitor policies & agent performance."
              iconSrc={analytics} 
            />
          </div>

          {/* get started */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="rounded-full bg-white px-8 py-3 text-xl font-semibold text-[#0A2A67] shadow-xxl hover:shadow-lg transition"
            >
              Get Started
            </button>
          </div>
        </div>
       
      {/* bouncing arrow */}
{showArrow && (
  <div className="mt-8 flex justify-center">
    <button
      onClick={() => window.scrollBy({ top: 600, behavior: "smooth" })}
  aria-label="Scroll slightly down"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#0A2A67"
        className="w-8 h-8 animate-bounce"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
)}

</section>

      {/* ABOUT SECTION (white bg) */}
      <section ref={aboutRef} className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-eczar font-bold text-gray-900">About Us</h2>
          <div className="h-0.5 w-20 bg-black mt-3 mb-8" />

          {/* first row: text left, image right */}
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <p className="text-gray-700 leading-8 text-[20px]">
              Our system is a smart and user‑friendly platform designed exclusively
              for insurance agents. It enables you to efficiently manage client details,
              track active policies, monitor renewal dates, and stay on top of upcoming
              expirations—all in one place.
            </p>
            <img
              src={about_1}  /* replace with your image */
              alt="About visual 1"
              className="w-4/5 sm:w-3/4 lg:w-2/3 mx-auto rounded-xl shadow"
            />
          </div>

          {/* second row: image left, text right */}
          <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
            <img
              src={about_2}  /* replace with your image */
              alt="About visual 2"
              className="w-3/4 sm:w-2/3 lg:w-1/2 mx-auto rounded-xl shadow"
            />
            <p className="order-none md:order-1 text-gray-700 leading-8 text-[20px]">
              With its intuitive dashboard and automated reminders, you can focus more on 
              building strong client relationships, while the system takes care of organizing 
              data, tracking policies, and keeping you informed at every step.
            </p>
          </div>
        </div>
      </section>
      <RegisterModal open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
}
