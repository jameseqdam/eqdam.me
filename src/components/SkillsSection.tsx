const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Research Methods",
      skills: [
        "User Interviews", "Usability Testing", "Ethnographic Research", "Survey Design",
        "A/B Testing", "Card Sorting", "Tree Testing", "Eye-tracking Studies",
        "Diary Studies", "Contextual Inquiry", "Heuristic Evaluation", "Expert Reviews",
        "Competitive Analysis", "Journey Mapping", "Persona Development", "Task Analysis"
      ]
    },
    {
      title: "Design & Prototyping",
      skills: [
        "Wireframing", "Interactive Prototyping", "Visual Design", "Information Architecture",
        "Interaction Design", "Service Design", "Design Systems", "Accessibility Design",
        "Mobile Design", "Responsive Design", "Design Thinking", "Human-Centered Design",
        "Agile UX", "Lean UX", "Design Strategy", "Brand Guidelines"
      ]
    },
    {
      title: "Tools & Software",
      skills: [
        "Figma", "Sketch", "Adobe Creative Suite", "InVision", "Principle", "Framer",
        "Miro", "Mural", "UserTesting", "Hotjar", "Google Analytics", "Mixpanel",
        "Pendo", "Dovetail", "SurveyMonkey", "Qualtrics", "Metabase", "Tableau",
        "R", "SPSS", "NVivo", "Optimal Workshop"
      ]
    },
    {
      title: "Leadership & Strategy",
      skills: [
        "Team Leadership", "Strategic Planning", "Stakeholder Management", "Change Management",
        "Process Development", "Cross-functional Collaboration", "Design Operations",
        "UX Evangelism", "Budget Management", "Talent Acquisition", "Mentoring",
        "Workshop Facilitation", "Presentation Skills", "Executive Communication"
      ]
    },
    {
      title: "Technical & Analytics",
      skills: [
        "HTML/CSS", "JavaScript", "SQL", "Python", "R Programming", "Statistical Analysis",
        "Data Visualization", "API Integration", "Version Control", "Agile Methodologies",
        "Design Tokens", "Component Libraries", "CMS Platforms", "E-commerce Platforms"
      ]
    },
    {
      title: "Languages",
      skills: [
        "English (Fluent)", "Swedish (Professional)"
      ]
    }
  ];

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-background px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive toolkit built through years of hands-on experience and continuous learning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="portfolio-card bg-background p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6 text-primary flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 lg:px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core Competencies */}
        <div className="mt-12 lg:mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 lg:mb-8">Core Competencies</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {[
              { skill: "UX Research", level: "Expert", icon: "🔍", description: "Deep user insights & methodology" },
              { skill: "Design Leadership", level: "Expert", icon: "👥", description: "Team guidance & strategic vision" },
              { skill: "Strategic Planning", level: "Expert", icon: "🎯", description: "Long-term product roadmaps" },
              { skill: "Team Building", level: "Expert", icon: "🚀", description: "Culture & talent development" }
            ].map((item, index) => (
              <div key={index} className="portfolio-card bg-background p-4 lg:p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-2xl lg:text-3xl flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm lg:text-base">{item.skill}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.level === "Expert" 
                          ? "bg-primary/20 text-primary border border-primary/30" 
                          : "bg-secondary text-secondary-foreground"
                      }`}>
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-6 rounded-full ${
                            i < (item.level === "Expert" ? 5 : 4)
                              ? "bg-primary"
                              : "bg-secondary"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;