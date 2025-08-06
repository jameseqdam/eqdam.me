import Navigation from './Navigation.tsx';
import HeroSection from './HeroSection.tsx';
import AboutSection from './AboutSection.tsx';
import ExperienceSection from './ExperienceSection.tsx';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection.tsx';
import EducationSection from './EducationSection.tsx';
import ContactSection from './ContactSection.tsx';

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
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="py-6 lg:py-8 bg-background border-t border-border px-4 sm:px-6">
        <div className="portfolio-container text-center">
          <p className="text-sm sm:text-base text-muted-foreground">
            © 2024 James Abbott Eqdam. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Designed with passion for user experience and attention to detail.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;