import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Globe, 
  ExternalLink,
  Menu,
  X,
  User,
  Briefcase,
  FolderOpen,
  Award,
  BookOpen,
  Contact
} from 'lucide-react';
import jamesHeadshot from '@/assets/james-headshot.jpg';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home', icon: User },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const experiences = [
    {
      title: "Director of UX Research & Design",
      company: "Coupa Software",
      period: "Jan 2019 – Present",
      description: "Led comprehensive UX transformation across enterprise software platform, building team from 2 to 15+ members. Established research operations, design systems, and measurable UX impact frameworks. Drove 40% improvement in user satisfaction and 25% reduction in support tickets through strategic design initiatives."
    },
    {
      title: "User Experience Specialist",
      company: "Episerver (now Optimizely)",
      period: "Aug 2018 – Dec 2018",
      description: "Specialized in content management system UX optimization and design system development. Conducted comprehensive user research and usability testing to inform product strategy."
    },
    {
      title: "User Experience Lead",
      company: "Cambio Healthcare Systems",
      period: "Jan 2017 – Jul 2018",
      description: "Led UX initiatives for healthcare technology solutions, focusing on electronic health records and patient management systems. Collaborated with NHS stakeholders on strategic healthcare digitization projects."
    },
    {
      title: "User Experience Researcher",
      company: "Karolinska Institutet",
      period: "Jul 2011 – Jul 2018",
      description: "Conducted extensive research on human-computer interaction in healthcare contexts. Specialized in accessibility and cognitive impairment considerations in digital health solutions."
    },
    {
      title: "User Experience Designer",
      company: "Karolinska Institutet",
      period: "Apr 2010 – Jun 2011",
      description: "Designed user interfaces and interaction patterns for medical research applications and health information systems."
    },
    {
      title: "Freelance HCI Expert",
      company: "Uppsala University",
      period: "Nov 2009 – Mar 2010",
      description: "Provided human-computer interaction expertise for academic research projects and interface design consulting."
    }
  ];

  const projects = [
    {
      title: "Coupa - Strategic UX Research & Design Transformation",
      problem: "Enterprise procurement platform lacked cohesive UX strategy, resulting in poor user adoption and high support burden across complex B2B workflows.",
      solution: "Built comprehensive UX research operations from ground up, established design systems, implemented user-centered design processes, and created measurable impact frameworks.",
      impact: "40% improvement in user satisfaction, 25% reduction in support tickets, successful team scaling from 2 to 15+ members, and established UX as strategic business function."
    },
    {
      title: "Episerver - Design Systems Implementation",
      problem: "Content management platform suffered from inconsistent UI patterns and fragmented user experience across multiple product lines.",
      solution: "Developed comprehensive design system with reusable components, established design tokens, and created documentation for cross-functional team adoption.",
      impact: "Reduced development time by 30%, improved design consistency across product suite, and enhanced designer-developer collaboration."
    },
    {
      title: "NHS/Cambio Healthcare Digital Transformation",
      problem: "Healthcare providers struggled with complex, non-intuitive electronic health record systems affecting patient care efficiency.",
      solution: "Conducted extensive user research with healthcare professionals, redesigned critical workflows, and implemented accessibility-first design principles.",
      impact: "Improved clinical workflow efficiency by 35%, enhanced patient data accessibility, and received positive feedback from 95% of healthcare providers."
    },
    {
      title: "KTH Innovation Challenge - Gamification Project",
      problem: "Low student engagement in educational technology platforms, resulting in poor learning outcomes and high dropout rates.",
      solution: "Designed and prototyped gamified learning experience with adaptive difficulty, social learning features, and progress visualization.",
      impact: "Won KTH Innovation Challenge, demonstrated 60% increase in user engagement, and established foundation for educational technology startup."
    }
  ];

  const skillCategories = [
    {
      title: "Research Methods",
      skills: ["User Interviews", "Usability Testing", "A/B Testing", "Survey Design", "Eye-tracking Studies", "Ethnographic Research", "Card Sorting", "Journey Mapping", "Persona Development", "Competitive Analysis"]
    },
    {
      title: "Design & Prototyping",
      skills: ["Design Systems", "Wireframing", "Prototyping", "Information Architecture", "Interaction Design", "Visual Design", "Accessibility Design", "Mobile-first Design", "Responsive Design", "Design Thinking"]
    },
    {
      title: "Tools & Software",
      skills: ["Figma", "Sketch", "Miro", "Pendo", "UserTesting", "Dovetail", "SurveyMonkey", "Metabase", "Adobe Creative Suite", "InVision", "Principle", "Framer"]
    },
    {
      title: "Leadership & Strategy",
      skills: ["Team Building", "Strategic Planning", "Stakeholder Management", "Design Operations", "Mentoring", "Cross-functional Collaboration", "Product Strategy", "UX Evangelism", "Process Optimization", "Change Management"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-semibold text-lg text-foreground">
              James Abbott Eqdam
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className="transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile Navigation Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => scrollToSection(item.id)}
                      className="justify-start"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  James Abbott Eqdam
                </h1>
                <p className="text-xl md:text-2xl text-primary font-medium">
                  Experience Research & Design
                </p>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                With a strong foundation in Human-Computer Interaction acquired through multidisciplinary academic education, and a wealth of R&D leadership experience, I have led and managed complex UX projects across various industries, including e-commerce and healthcare. By conducting extensive UX research in diverse settings, I have developed a deep understanding of global strategy that enables me to navigate and succeed in different contexts.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                </Button>
                <Button variant="outline" size="lg">
                   <a href="https://www.authpro.com/auth/jameseqdam/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Portfolio
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                  <img 
                    src={jamesHeadshot} 
                    alt="James Abbott Eqdam"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              About Me
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              My philosophy and approach to UX leadership and design
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Leadership Philosophy
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  As a leader, I strive to be a supporter, ensuring everyone feels important and that their contributions matter. I foster a team-player mentality by aligning individual and team goals, motivating others to pursue what is good for them, which naturally benefits the team. A core aspect of my leadership is helping others become leaders themselves and empowering them to take pride in their work.
                </p>
                <Separator className="my-6" />
                <p className="text-muted-foreground leading-relaxed">
                  I actively solicit feedback to continuously improve. Empathy is central to my approach, allowing me to understand individual needs and apply tough love, positive reinforcement, or direct guidance as appropriate to get the best out of each team member.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  UX Approach & Principles
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My approach to UX involves making technology invisible and understanding diverse user behaviors and cognitive skills. I aim to move from doubt to certainty, prioritize outcome over output, balance flexibility with structure, and foster shared understanding across teams.
                </p>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {["Visibility", "Feedback", "Affordance", "Mapping", "Constraint", "Consistency"].map((principle) => (
                      <Badge key={principle} variant="secondary" className="text-sm">
                        {principle}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="my-6" />
                <p className="text-muted-foreground leading-relaxed">
                  Design process: Empathize → Define → Ideate → Prototype → Test → Implement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              A journey through UX leadership and innovation
            </p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="shadow-lg border-0 bg-card hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-primary font-medium mb-2">
                        {exp.company}
                      </p>
                    </div>
                    <Badge variant="outline" className="self-start">
                      {exp.period}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Projects
            </h2>
            <p className="text-lg text-muted-foreground">
              Case studies showcasing problem-solving and impact
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="shadow-lg border-0 bg-card hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-destructive mb-2">Problem</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-primary mb-2">What We Did</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-accent mb-2">My Impact</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.impact}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Skills & Expertise
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive skill set across UX research, design, and leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category, index) => (
              <Card key={index} className="shadow-lg border-0 bg-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card className="shadow-lg border-0 bg-card max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Languages
                </h3>
                <div className="flex justify-center gap-4">
                  <Badge variant="default">English (Native)</Badge>
                  <Badge variant="default">Swedish (Fluent)</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Publications & Education
            </h2>
            <p className="text-lg text-muted-foreground">
              Academic foundation and research contributions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">Education</h3>
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      Ph.D. in User Experience
                    </h4>
                    <p className="text-primary font-medium mb-2">Karolinska Institutet</p>
                    <p className="text-sm text-muted-foreground mb-3">2016</p>
                    <p className="text-sm text-muted-foreground italic">
                      "Understanding how persons with mild acquired cognitive impairment use and experience information and communication technology: an exploratory study"
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      M.Sc. in Human-Computer Interaction
                    </h4>
                    <p className="text-primary font-medium mb-2">Uppsala University</p>
                    <p className="text-sm text-muted-foreground">March 2010</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-card">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">
                      B.Eng. in Software Engineering
                    </h4>
                    <p className="text-primary font-medium mb-2">Shiraz University</p>
                    <p className="text-sm text-muted-foreground">February 2004</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8">Key Publications</h3>
              <div className="space-y-4">
                <Card className="shadow-lg border-0 bg-card">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Research publications spanning cognitive accessibility, healthcare technology, and human-computer interaction, with focus on inclusive design methodologies and empirical user experience research.
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Research Projects</h4>
                  {[
                    { title: "Gamification Project Report", url: "http://bit.ly/AbbProject12" },
                    { title: "Social Network Analysis Study", url: "http://bit.ly/AbbProject11" },
                    { title: "E-services and Social Media Usage", url: "http://bit.ly/AbbProject14" },
                    { title: "Mobile Healthcare Apps Research", url: "http://bit.ly/AbbProject13" },
                    { title: "Eye-tracking Usability Evaluation", url: "http://bit.ly/AbbProject15" }
                  ].map((pub, index) => (
                    <Card key={index} className="shadow-sm border-0 bg-secondary/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{pub.title}</p>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={pub.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to discuss UX strategy and collaboration opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">james@eqdam.me</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">+46 (xxx) xxx-xxxx</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Sweden, EU</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Professional Links
                </h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://linkedin.com/in/eqdam" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-5 h-5 mr-3" />
                      LinkedIn Profile
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-5 h-5 mr-3" />
                      Google Scholar
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://twitter.com/jameseqdam" target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-5 h-5 mr-3" />
                      Twitter / X
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://eqdam.me" target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5 mr-3" />
                      Personal Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 James Abbott Eqdam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;