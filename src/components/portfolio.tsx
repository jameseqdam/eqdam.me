import Navigation from './Navigation.tsx';
import HeroSection from './HeroSection.tsx';
import AboutSection from './AboutSection.tsx';
import ExperienceSection from './ExperienceSection.tsx';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection.tsx';
import EducationSection from './EducationSection.tsx';
import ContactSection from './ContactSection.tsx';
import ThoughtLeadershipSection from './ThoughtLeadershipSection.tsx';
import SiteFooter from './SiteFooter.tsx';

const Portfolio = () => {
  return (
    <div className="relative">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ThoughtLeadershipSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <SiteFooter />
    </div>
  );
};

export default Portfolio;