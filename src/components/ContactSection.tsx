import { Mail, Phone, MapPin, Linkedin, Globe, Twitter, GraduationCap, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "james@eqdam.me",
      href: "mailto:james@eqdam.me"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+46 (762) 34-3539",
      href: "tel:+4672343539"
    }, 
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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="portfolio-card bg-muted/30 p-4 sm:p-6 lg:p-8 rounded-lg border border-border">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6">Send a Message</h3>
            <form className="space-y-4 lg:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input 
                    id="firstName"
                    placeholder="John"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input 
                    id="lastName"
                    placeholder="Doe"
                    className="bg-background"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-background"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input 
                  id="subject"
                  placeholder="Let's discuss UX strategy"
                  className="bg-background"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea 
                  id="message"
                  rows={4}
                  placeholder="Tell me about your project or what you'd like to discuss..."
                  className="bg-background min-h-[100px] sm:min-h-[120px]"
                />
              </div>
              
              <Button className="w-full portfolio-button portfolio-button-primary">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 lg:mb-6">Get In Touch</h3>
              <div className="space-y-3 lg:space-y-4">
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

            <div className="p-4 lg:p-6 bg-muted rounded-lg border border-border">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Available for:</h4>
              <ul className="space-y-1 lg:space-y-2 text-muted-foreground">
                <li className="text-xs sm:text-sm">• UX Strategy Consulting</li>
                <li className="text-xs sm:text-sm">• Research & Design Leadership Roles</li>
                <li className="text-xs sm:text-sm">• Speaking Engagements</li>
                <li className="text-xs sm:text-sm">• Academic Collaborations</li>
                <li className="text-xs sm:text-sm">• Mentoring & Coaching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;