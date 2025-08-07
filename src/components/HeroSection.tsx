import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Globe, Twitter, GraduationCap } from 'lucide-react';
import headshotImage from '@/assets/james-headshot.jpg';

const HeroSection = () => {
const [scrollY, setScrollY] = useState(0);
  const socialLinks = [
    { icon: Linkedin, href: "https://linkedin.com/in/eqdam", label: 'LinkedIn' },
    { icon: Globe, href: "https://www.eqdam.me/", label: 'Website' },
    { icon: Twitter, href: "https://twitter.com/jameseqdam", label: 'Twitter' },
    { icon: GraduationCap, href: "https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en", label: 'Google Scholar' },
  ];
useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 // Calculate transition progress (0 to 1)
  const progress = Math.min(scrollY / 500, 1);
  const isMinimized = scrollY > 100;
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
      <div className={`fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-500 ease-out ${
        isMinimized ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="portfolio-container">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
          <div 
                className="rounded-full overflow-hidden border-2 border-border transition-all duration-500 ease-out"
                style={{
                  width: `${48}px`,
                  height: `${48}px`,
                }}
              >                
              <img
                  src={headshotImage}
                  alt="James Abbott Eqdam"
                  className="w-full h-full object-cover"
                />
              </div>
                            <div className="transition-all duration-500 ease-out">
                <h2 className="text-lg font-bold text-foreground transition-all duration-500 ease-out">James Abbott Eqdam</h2>
                <p className="text-sm text-muted-foreground transition-all duration-500 ease-out">Experience Research & Design</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              {socialLinks.slice(0, 2).map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
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
      <section id="home" className="min-h-screen flex items-center bg-background px-4 sm:px-6 relative">
        <div className="portfolio-container text-foreground">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
            {/* Profile Image */}
            <div 
              className="flex justify-center lg:justify-start order-first"
              style={{ opacity: 1 - progress * 0.4 }}
            >
              <div className="relative">
                <div 
                  className="rounded-full overflow-hidden border-4 border-border shadow-2xl transition-all duration-500 ease-out"
                  style={{
                    width: `${320 - progress * 64}px`,
                    height: `${320 - progress * 64}px`,
                    transform: `scale(${1 - progress * 0.2})`
                  }}
                >
                  <img
                    src={headshotImage}
                    alt="James Abbott Eqdam - Professional Headshot"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
             <div className="space-y-3 lg:space-y-4">
              <h1 
                className="font-bold leading-tight transition-all duration-500 ease-out"
                style={{
                  fontSize: `${3 - progress * 1.5}rem`,
                  transform: `scale(${1 - progress * 0.2})`,
                  opacity: 1 - progress * 0.3
                }}
              >
                James Abbott Eqdam
              </h1>
              <h2 
                className="font-light text-muted-foreground transition-all duration-500 ease-out"
                style={{
                  fontSize: `${1.5 - progress * 0.5}rem`,
                  transform: `scale(${1 - progress * 0.15})`,
                  opacity: 1 - progress * 0.5
                }}
              >
                Experience Research & Design
              </h2>
            </div>

            <p 
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-500 ease-out"
              style={{ opacity: 1 - progress * 0.7 }}
            >
              With a strong foundation in Human-Computer Interaction acquired through multidisciplinary academic education, 
              and a wealth of R&D leadership experience, I have led and managed complex UX projects across various industries, 
              including e-commerce and healthcare. By conducting extensive UX research in diverse settings, I have developed 
              a deep understanding of global strategy that enables me to navigate and succeed in different contexts.
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start transition-all duration-500 ease-out"
              style={{ opacity: 1 - progress * 0.8 }}
            >
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
            <div 
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground justify-center lg:justify-start transition-all duration-500 ease-out"
              style={{ opacity: 1 - progress * 0.8 }}
            >
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
            <div 
              className="flex gap-4 justify-center lg:justify-start transition-all duration-500 ease-out"
              style={{ opacity: 1 - progress * 0.8 }}
            >
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
          </div>
        </div>

    </section>
    </>
  );
};

export default HeroSection;