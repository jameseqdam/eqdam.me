import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Section highlighting only applies to the single-page homepage.
      if (!isHome) {
        setActiveSection('');
        return;
      }

      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const scrollToSection = (sectionId: string) => {
    // On sub-pages the homepage anchors do not exist, so route back to "/"
    // and let ScrollToTop handle the hash once the homepage has mounted.
    if (!isHome) {
      navigate(sectionId === 'home' ? '/' : `/#${sectionId}`);
      setIsMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // On the homepage the "/" link would be a no-op route change, so intercept it
  // and scroll back to the hero section instead.
  const handleWordmarkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) {
      setIsMobileMenuOpen(false);
      return;
    }

    event.preventDefault();
    scrollToSection('home');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-transparent'
    }`}>
      <div className="portfolio-container">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            onClick={handleWordmarkClick}
            aria-label="UXDR — Experience Research &amp; Design, back to homepage"
            className="inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            {/* id is the handoff target the preloader flies its logo into. */}
            <img
              id="site-logo"
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              className="site-logo h-8 w-8 flex-shrink-0 lg:h-9 lg:w-9"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-primary">UXDR</span>
              <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                Experience Research &amp; Design
              </span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary bg-secondary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;