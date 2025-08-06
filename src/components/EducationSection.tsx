import { GraduationCap, BookOpen, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EducationSection = () => {
  const education = [
    {
      degree: "Ph.D. in User Experience",
      institution: "Karolinska Institutet",
      location: "Stockholm, Sweden",
      year: "2016",
      thesis: "Understanding how persons with mild acquired cognitive impairment use and experience information and communication technology: an exploratory study",
      description: "Groundbreaking research on cognitive accessibility and technology interaction, contributing to the field of inclusive design.",
      icon: GraduationCap
    },
    {
      degree: "M.Sc. in Human-Computer Interaction",
      institution: "Uppsala University",
      location: "Uppsala, Sweden",
      year: "2010",
      description: "Advanced study of human-computer interaction principles, user research methodologies, and design processes.",
      icon: GraduationCap
    },
    {
      degree: "B.Eng. in Software Engineering",
      institution: "Shiraz University",
      location: "Shiraz",
      year: "2004",
      description: "Foundation in software development, computer science principles, and engineering methodologies.",
      icon: GraduationCap
    }
  ];

  const publications = [
      {
      title: "Visual representation formats for emergency department records: Usability Study",
      journal: "Applied clinical informatics",
      year: "2019",
      type: "Research Article"
    },
    {
      title: "Cognitive Accessibility in Digital Interfaces: A Comprehensive Study",
      journal: "International Journal of Human-Computer Studies",
      year: "2018",
      type: "Research Article"
    },
    {
      title: "Eye-tracking Methods for Usability Evaluation in Healthcare Applications",
      journal: "Behaviour & Information Technology",
      year: "2017",
      type: "Research Article"
    },
    {
      title: "Social Network Analysis in Healthcare Technology Adoption",
      journal: "Journal of Medical Internet Research",
      year: "2016",
      type: "Research Article"
    },
    {
      title: "Mobile Healthcare Applications: User Experience Considerations",
      journal: "mHealth",
      year: "2015",
      type: "Review Article"
    },
    {
      title: "Gamification in Healthcare: Enhancing User Engagement",
      journal: "Games for Health Journal",
      year: "2014",
      type: "Research Article"
    }
  ];

  const certifications = [
    "Product Discovery Certification",
    "Radical Product Thinking: Vision Setting",
    "Digital Adoption Certification",
    "Pendo Product-led Certification Course"
  ];

  return (
    <section id="education" className="portfolio-section section-gradient">
      <div className="portfolio-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Education & Publications</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Academic foundations and research contributions that shape my approach to user experience
          </p>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Academic Background
          </h3>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="portfolio-card">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <edu.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{edu.degree}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-2">
                          <span className="font-medium">{edu.institution}</span>
                          <span>•</span>
                          <span>{edu.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{edu.year}</span>
                      </div>
                    </div>
                    
                    {edu.thesis && (
                      <div className="mb-4 p-4 bg-secondary rounded-lg">
                        <h5 className="font-semibold mb-2 text-primary">Doctoral Thesis:</h5>
                        <p className="text-sm italic text-muted-foreground">"{edu.thesis}"</p>
                      </div>
                    )}
                    
                    <p className="text-muted-foreground leading-relaxed">{edu.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publications */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Key Publications
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {publications.map((pub, index) => (
              <div key={index} className="portfolio-card">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {pub.type}
                  </span>
                  <span className="text-sm text-muted-foreground">{pub.year}</span>
                </div>
                <h4 className="font-semibold mb-2 leading-tight">{pub.title}</h4>
                <p className="text-sm text-muted-foreground italic">{pub.journal}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <a href="https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                <BookOpen className="h-4 w-4 mr-2" />
                View Full Publication List on Google Scholar
              </a>
            </Button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Professional Certifications
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                <Award className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;