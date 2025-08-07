import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Globe, Twitter, GraduationCap } from 'lucide-react';
import headshotImage from '@/assets/james-headshot.jpg';

const HeroSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/eqdam", label: 'LinkedIn' },
    { icon: Globe, href: "https://www.eqdam.me/", label: 'Website' },
    { icon: Twitter, href: "https://twitter.com/jameseqdam", label: 'Twitter' },
    { icon: GraduationCap, href: "https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en", label: 'Google Scholar' },
  ];
useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
/*     <section id="home" className="min-h-screen flex items-center bg-background px-4 sm:px-6">
      <div className="portfolio-container text-foreground">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"> */
         <>
      {/* Minimized Header */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300 ${
        isScrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="portfolio-container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
                <img
                  src={headshotImage}
                  alt="James Abbott Eqdam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">James Abbott Eqdam</h2>
                <p className="text-sm text-muted-foreground">Experience Research & Design</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {socialLinks.slice(0, 2).map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section id="home" className="min-h-screen flex items-center bg-background px-4 sm:px-6">
        <div className="portfolio-container text-foreground">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                James Abbott Eqdam
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground">
                Experience Research & Design
              </h2>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              With a strong foundation in Human-Computer Interaction acquired through multidisciplinary academic education, 
              and a wealth of R&D leadership experience, I have led and managed complex UX projects across various industries, 
              including e-commerce and healthcare. By conducting extensive UX research in diverse settings, I have developed 
              a deep understanding of global strategy that enables me to navigate and succeed in different contexts.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection('projects')}
                className="portfolio-button portfolio-button-primary"
              >
                View My Work
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                variant="outline" 
                className="portfolio-button portfolio-button-outline"
              >
                Get In Touch
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Mail className="h-4 w-4" />
                <span>james@eqdam.me</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Phone className="h-4 w-4" />
                <span>+46 (762) 34-3539</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="h-4 w-4" />
                <span>Stockholm, Sweden</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="relative">
              <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-border shadow-2xl">
                <img
                  src={headshotImage}
                  alt="James Abbott Eqdam - Professional Headshot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;