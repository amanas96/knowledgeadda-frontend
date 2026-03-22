import HeroSection from "../components/homePage/heroSection.jsx";
import StatsSection from "../components/homePage/statsSection.jsx";
import FeaturedCourses from "../components/homePage/featuredCourses.jsx";
import QuizSection from "../components/homePage/quizSection.jsx";
import WhyUsSection from "../components/homePage/whyUsSection.jsx";
import CTASection from "../components/homePage/ctaSection.jsx";
import ContactPage from "./company/contactPage.jsx";
import Footer from "../components/homePage/footer.jsx";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedCourses />
      <QuizSection />
      <WhyUsSection />
      <CTASection />
      <ContactPage />
      <Footer />
    </>
  );
};

export default HomePage;
