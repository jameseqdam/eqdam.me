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

        {/* Proficiency Levels */}
        <div className="mt-12 lg:mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 lg:mb-8">Core Competencies</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { skill: "UX Research", level: 95 },
              { skill: "Design Leadership", level: 90 },
              { skill: "Strategic Planning", level: 90 },
              { skill: "Team Building", level: 95 }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-secondary"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${item.level}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm sm:text-lg lg:text-xl font-bold text-primary">{item.level}%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-xs sm:text-sm lg:text-base">{item.skill}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;