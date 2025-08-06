const AboutSection = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-muted/30 px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover my philosophy on leadership and approach to user experience design
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Leadership Philosophy */}
          <div className="portfolio-card bg-background p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6 text-primary">Leadership Philosophy</h3>
            <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                As a leader, I strive to be a supporter, ensuring everyone feels important and that their contributions matter. 
                I foster a team-player mentality by aligning individual and team goals, motivating others to pursue what is 
                good for them, which naturally benefits the team.
              </p>
              <p>
                A core aspect of my leadership is helping others become leaders themselves and empowering them to take pride 
                in their work. I actively solicit feedback to continuously improve. Empathy is central to my approach, allowing 
                me to understand individual needs and apply tough love, positive reinforcement, or direct guidance as appropriate 
                to get the best out of each team member.
              </p>
              <p>
                I believe in celebrating successes and creating belief in a motivating vision that goes beyond money and prestige, 
                focusing on meaningful impact. It is also crucial to acknowledge and not deny reality.
              </p>
            </div>
          </div>

          {/* UX Approach */}
          <div className="portfolio-card bg-background p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6 text-primary">UX Approach & Principles</h3>
            <div className="space-y-3 lg:space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                My approach to UX involves making technology invisible and understanding diverse user behaviors and cognitive skills. 
                I aim to move from doubt to certainty, prioritize outcome over output, balance flexibility with structure, and 
                foster shared understanding across teams.
              </p>
              <p>
                My work is guided by key design principles including <strong>Visibility</strong>, <strong>Feedback</strong>, 
                <strong>Affordance</strong>, <strong>Mapping</strong>, <strong>Constraint</strong>, and <strong>Consistency</strong>, 
                as highlighted by Jakob Nielsen's principles.
              </p>
              <p>
                I emphasize a design process that moves through <strong>Empathize</strong>, <strong>Define</strong>, 
                <strong>Ideate</strong>, <strong>Prototype</strong>, <strong>Test</strong>, and <strong>Implement</strong> phases, 
                aligned with Inspiration (Understand), Ideation (Explore), and Implementation (Materialize).
              </p>
            </div>
          </div>
        </div>

        {/* Key Values */}
        <div className="mt-12 lg:mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 lg:mb-8">Core Values</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Outcome-Driven</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Prioritizing meaningful results over busy work</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <span className="text-xl sm:text-2xl">🤝</span>
              </div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Empathy-First</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Understanding users and team members deeply</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Innovation</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Pushing boundaries with data-driven insights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;