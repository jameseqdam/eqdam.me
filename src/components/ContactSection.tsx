import { MapPin, Linkedin, Globe, Twitter, GraduationCap } from 'lucide-react';
import ContactReveal from '@/components/ContactReveal';

const ContactSection = () => {
  // Email and phone are rendered by <ContactReveal /> so they stay masked in the
  // markup; only non-sensitive details live in plain text here.
  const contactInfo = [
    {
      icon: MapPin,
      label: "Location",
      value: "Stockholm, San Francisco",
      href: "#"
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/eqdam",
      handle: "@eqdam"
    },
    {
      icon: Globe,
      label: "Portfolio Website",
      href: "https://www.authpro.com/auth/jameseqdam/",
      handle: "James Eqdam"
    },
    {
      icon: Twitter,
      label: "Twitter/X",
      href: "https://twitter.com/jameseqdam",
      handle: "@jameseqdam"
    },
    {
      icon: GraduationCap,
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=AijTeogAAAAJ&hl=en",
      handle: "Academic Profile"
    }
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-background px-4 sm:px-6">
      <div className="portfolio-container">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to discuss UX strategy, research methodologies, or potential collaborations? 
            I'd love to hear from you.
          </p>
        </div>

        {/* Direct contact and profiles sit side by side now that the section
            carries no form. */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6">Get In Touch</h3>
            <div className="space-y-3 lg:space-y-4">
              <ContactReveal channel="email" />
              <ContactReveal channel="phone" />
              <p className="text-xs text-muted-foreground">
                Contact details are hidden from bots — press and hold to reveal.
              </p>
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.href}
                  className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-muted rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <contact.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{contact.label}</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{contact.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6">Connect Online</h3>
            <div className="space-y-3 lg:space-y-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-muted rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <social.icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{social.label}</p>
                    <p className="text-muted-foreground text-sm sm:text-base">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Full width below the pair, so the list reads across rather than as a
            narrow column. */}
        <div className="mt-8 lg:mt-12 p-4 lg:p-6 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold mb-3 text-sm sm:text-base">Available for:</h4>
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2 text-muted-foreground">
            <li className="text-xs sm:text-sm">• UX Strategy Consulting</li>
            <li className="text-xs sm:text-sm">• UX Maturity &amp; Operational Efficiency</li>
            <li className="text-xs sm:text-sm">• Research &amp; Design Leadership Roles</li>
            <li className="text-xs sm:text-sm">• Speaking Engagements</li>
            <li className="text-xs sm:text-sm">• Academic Collaborations</li>
            <li className="text-xs sm:text-sm">• Mentoring &amp; Coaching</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;