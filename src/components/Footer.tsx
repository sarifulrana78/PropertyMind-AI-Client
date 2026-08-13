import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Properties', href: '/properties' },
    { label: 'AI Advisor', href: '/ai-advisor' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'List Property', href: '/properties/add' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/about' },
    { label: 'Press Kit', href: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms of Service', href: '/about' },
    { label: 'Cookie Policy', href: '/about' },
    { label: 'Accessibility', href: '/about' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-white/5">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6" id="footer-logo">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Property</span>
                <span className="text-white">Mind</span>
                <span className="text-secondary-400 text-xs ml-1 font-semibold">AI</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6 max-w-xs">
              The most intelligent real estate platform powered by AI. Discover, analyze, and invest in properties with confidence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-dark-400 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                <a href="mailto:hello@propertymind.ai" className="hover:text-primary-400 transition-colors" id="footer-email">
                  hello@propertymind.ai
                </a>
              </div>
              <div className="flex items-center gap-3 text-dark-400 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <a href="tel:+18005551234" className="hover:text-primary-400 transition-colors" id="footer-phone">
                  +1 (800) 555-1234
                </a>
              </div>
              <div className="flex items-center gap-3 text-dark-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>123 Tech Ave, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      id={`footer-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                      className="text-dark-400 hover:text-primary-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} PropertyMind AI. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                id={`footer-social-${label.toLowerCase()}`}
                className="w-9 h-9 rounded-lg bg-dark-800 hover:bg-primary-500/20 hover:border-primary-500/30 border border-white/5 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all duration-200"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
