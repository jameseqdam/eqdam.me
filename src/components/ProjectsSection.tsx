import { Button } from '@/components/ui/button';
import { ExternalLink, Users, Target, TrendingUp } from 'lucide-react';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Strategic UX Research & Design Transformation",
      company: "Coupa Software",
      timeline: "2019-2025",
      category: "Leadership & Strategy",
      problem: "Coupa needed to scale its UX capabilities to support rapid growth and evolving market demands while maintaining design quality and user satisfaction across a complex spend management platform.",
      solution: "Led comprehensive transformation including team building, process establishment, design system creation, and culture change initiatives. Implemented data-driven design methodologies and cross-functional collaboration frameworks.",
      impact: "Built high-performing teams, established scalable UX processes, and delivered measurable improvements in user satisfaction and business metrics. Successfully evangelized UX across 1000+ person organization.",
      skills: ["Team Leadership", "Process Design", "Strategy", "Change Management"],
      icon: Users
    },
    {
      title: "Enterprise Design Systems",
      company: "Episerver (Optimizely)",
      timeline: "2018",
      category: "Design Systems",
      problem: "Episerver's digital experience platform lacked design consistency across its product suite, leading to fragmented user experiences and inefficient development processes.",
      solution: "Developed comprehensive design system components, established design tokens, and created governance processes. Collaborated with global teams to ensure adoption and consistency.",
      impact: "Improved design consistency, reduced development time, and enhanced user experience across the entire product ecosystem.",
      skills: ["Design Systems", "Component Libraries", "Design Tokens", "Governance"],
      icon: Target
    },
    {
      title: "NHS Healthcare UX Projects",
      company: "Cambio Healthcare Systems",
      timeline: "2017-2018",
      category: "Healthcare Innovation",
      problem: "Healthcare providers needed more intuitive and efficient digital tools to improve clinical workflows and patient outcomes while meeting strict regulatory requirements.",
      solution: "Conducted extensive user research with healthcare professionals, designed clinical workflow improvements, and created user-centered healthcare applications focusing on accessibility and efficiency.",
      impact: "Enhanced clinical efficiency, improved healthcare worker satisfaction, and contributed to better patient care through thoughtful design interventions.",
      skills: ["Healthcare UX", "Clinical Research", "Regulatory Compliance", "Workflow Design"],
      icon: TrendingUp
    },
    {
      title: "Cognitive Accessibility Research",
      company: "Karolinska Institutet",
      timeline: "2011-2018",
      category: "Research & Innovation",
      problem: "Limited understanding of how persons with mild acquired cognitive impairment use and experience information and communication technology, creating barriers to digital inclusion.",
      solution: "Conducted groundbreaking longitudinal research using mixed methods including eye-tracking, interviews, and behavioral analysis. Developed new methodologies for studying cognitive accessibility.",
      impact: "Published influential research that informed accessibility guidelines, contributed to PhD thesis, and established new standards for inclusive design research.",
      skills: ["UX Research", "Accessibility", "Eye-tracking", "Academic Research"],
      icon: Target,
      link: "http://bit.ly/AbbProject15"
    }
  ];

  const additionalProjects = [
    {
      title: "KTH Innovation Challenge Winner",
      description: "Gamification project that won the innovation challenge",
      link: "http://bit.ly/AbbProject12"
    },
    {
      title: "Social Network Analysis Study",
      description: "Comprehensive analysis of social networks in healthcare",
      link: "http://bit.ly/AbbProject11"
    },
    {
      title: "E-services and Social Media Usage",
      description: "Research on digital service adoption patterns",
      link: "http://bit.ly/AbbProject14"
    },
    {
      title: "Mobile Healthcare Apps Research",
      description: "Study on mobile app effectiveness in healthcare",
      link: "http://bit.ly/AbbProject13"
    }
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Key Projects</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            In-depth case studies showcasing strategic thinking, problem-solving, and measurable impact
          </p>
        </div>

        <div className="space-y-8 lg:space-y-12">
          {projects.map((project, index) => (
            <div key={index} className="portfolio-card bg-background p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 lg:mb-6">
                    <div className="flex items-start gap-3 lg:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <project.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">{project.title}</h3>
                        <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{project.company}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{project.timeline}</span>
                          </div>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs w-fit">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {project.link && (
                      <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          View Report
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4 lg:space-y-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">The Challenge</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{project.problem}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">What We Did</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{project.solution}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">My Role & Impact</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{project.impact}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">Key Skills Applied</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Projects */}
        <div className="mt-12 lg:mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 lg:mb-8">Additional Research Projects</h3>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
            {additionalProjects.map((project, index) => (
              <div key={index} className="portfolio-card bg-background p-4 lg:p-6 rounded-lg border border-border">
                <h4 className="font-semibold mb-2 text-sm sm:text-base">{project.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">{project.description}</p>
                <Button variant="outline" size="sm" asChild className="w-full text-xs sm:text-sm">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View Report
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;