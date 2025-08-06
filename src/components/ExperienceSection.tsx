import { Calendar, MapPin, Building } from 'lucide-react';

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Director of UX Research & Design",
      company: "Coupa Software",
      location: "San Francisco, CA",
      period: "Jan 2019 – Present",
      description: "Leading strategic UX initiatives across the global spend management platform, building and managing high-performing research and design teams.",
      highlights: [
        "Built and scaled UX research and design teams from ground up",
        "Established comprehensive UX processes and methodologies",
        "Evangelized user-centered design across 1000+ person organization",
        "Delivered measurable impact through data-driven design decisions",
        "Led cross-functional collaboration with product, engineering, and business stakeholders"
      ]
    },
    {
      title: "User Experience Specialist",
      company: "Episerver (now Optimizely)",
      location: "Stockholm, Sweden",
      period: "Aug 2018 – Dec 2018",
      description: "Focused on design systems and user experience optimization for the digital experience platform.",
      highlights: [
        "Developed comprehensive design system components",
        "Conducted user research for enterprise customers",
        "Improved design consistency across product suite",
        "Collaborated with global design and engineering teams"
      ]
    },
    {
      title: "User Experience Lead",
      company: "Cambio Healthcare Systems",
      location: "Stockholm, Sweden",
      period: "Jan 2017 – Jul 2018",
      description: "Led UX initiatives for healthcare technology solutions, focusing on improving clinical workflows and patient outcomes.",
      highlights: [
        "Designed user experiences for NHS and healthcare providers",
        "Conducted extensive healthcare user research",
        "Led strategic design projects for clinical applications",
        "Improved healthcare worker efficiency through design"
      ]
    },
    {
      title: "User Experience Researcher",
      company: "Karolinska Institutet",
      location: "Stockholm, Sweden",
      period: "Jul 2011 – Jul 2018",
      description: "Conducted extensive research on how persons with cognitive impairments use and experience ICT, leading to groundbreaking insights.",
      highlights: [
        "Led pioneering research on cognitive accessibility",
        "Published multiple peer-reviewed research papers",
        "Developed innovative research methodologies",
        "Collaborated with international research teams",
        "Earned PhD in User Experience"
      ]
    },
    {
      title: "User Experience Designer",
      company: "Karolinska Institutet",
      location: "Stockholm, Sweden",
      period: "Apr 2010 – Jun 2011",
      description: "Designed user interfaces and experiences for healthcare and research applications.",
      highlights: [
        "Designed accessible healthcare applications",
        "Conducted usability evaluations using eye-tracking",
        "Created wireframes and interactive prototypes",
        "Applied HCI principles to healthcare contexts"
      ]
    },
    {
      title: "Freelance HCI Expert",
      company: "Uppsala University",
      location: "Uppsala, Sweden",
      period: "Nov 2009 – Mar 2010",
      description: "Provided human-computer interaction expertise for university research projects and academic initiatives.",
      highlights: [
        "Consulted on HCI research methodologies",
        "Designed user studies and evaluations",
        "Contributed to academic research publications",
        "Mentored students in UX research methods"
      ]
    }
  ];

  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 bg-background px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive journey through leadership roles in UX research and design across various industries
          </p>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="portfolio-card bg-background p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 lg:mb-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">{exp.title}</h3>
                  <div className="flex flex-col gap-2 text-sm sm:text-base text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">{exp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{exp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground mb-4 lg:mb-6 leading-relaxed">
                {exp.description}
              </p>

              <div>
                <h4 className="font-semibold mb-3 text-sm sm:text-base">Key Achievements:</h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;