import { Metadata } from 'next';
import { Building2, Users, Award, Globe, Heart, Zap, Shield, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PropertyMind AI — the team and mission behind the most intelligent real estate platform.',
};

const team = [
  { name: 'Alexandra Chen', role: 'CEO & Co-Founder', bio: 'Former Goldman Sachs VP with 15 years in real estate investment. Led $2B in property transactions.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex-ceo' },
  { name: 'Marcus Williams', role: 'CTO & Co-Founder', bio: 'Ex-Google AI researcher. PhD in Machine Learning from MIT. Built enterprise AI systems at scale.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus-cto' },
  { name: 'Priya Sharma', role: 'Head of AI', bio: 'Former OpenAI researcher. Specializes in language models and agentic AI systems for domain-specific applications.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-ai' },
  { name: 'James Rodriguez', role: 'Head of Product', bio: 'Product veteran from Zillow and Redfin. Passionate about making real estate accessible through technology.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james-pm' },
];

const values = [
  { icon: Brain, title: 'AI-First', description: 'We believe AI should augment human intelligence, not replace it. Every feature is built to make you smarter.', color: 'from-primary-500 to-purple-500' },
  { icon: Shield, title: 'Trust & Security', description: 'Your data is encrypted, protected, and never sold. We earn trust through transparency and action.', color: 'from-secondary-500 to-teal-500' },
  { icon: Heart, title: 'User Obsessed', description: 'Every design decision starts and ends with our users. We measure success by your success.', color: 'from-pink-500 to-rose-500' },
  { icon: Globe, title: 'Inclusive Access', description: 'Premium real estate intelligence should be available to everyone — from first-time buyers to institutional investors.', color: 'from-accent-500 to-orange-500' },
];

// Fix missing import
import Image from 'next/image';

function Brain({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="section-container max-w-4xl">
          <div className="badge-primary inline-flex mb-6">Our Story</div>
          <h1 className="text-5xl font-black text-white mb-6">
            Democratizing Real Estate
            <span className="block gradient-text">Intelligence with AI</span>
          </h1>
          <p className="text-dark-300 text-xl leading-relaxed max-w-2xl mx-auto">
            PropertyMind AI was born from a simple frustration: why should only wealthy investors have access to expert real estate advice? We&apos;re changing that with AI.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-dark-900/50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Building2, value: '23+', label: 'Active Listings', color: 'text-primary-400' },
              { icon: Users, value: '4+', label: 'Platform Users', color: 'text-secondary-400' },
              { icon: Award, value: '100%', label: 'AI Powered', color: 'text-accent-400' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="glass-card p-8">
                <Icon className={`w-10 h-10 ${color} mx-auto mb-4`} />
                <div className="text-4xl font-black text-white mb-2">{value}</div>
                <div className="text-dark-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-dark-400 max-w-xl mx-auto">The principles that guide every decision we make</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="glass-card p-6 text-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-dark-900/50">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet the Team</h2>
            <p className="text-dark-400">World-class experts in AI, real estate, and technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="glass-card p-6 text-center hover:border-primary-500/30 transition-all">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="rounded-2xl mx-auto mb-4 border-2 border-primary-500/30"
                />
                <h3 className="font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-dark-400 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24">
        <div className="section-container max-w-2xl">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-dark-400 mb-8">Have questions? We&apos;d love to hear from you.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-dark-300">
                <Mail className="w-5 h-5 text-primary-400" />
                <a href="mailto:hello@propertymind.ai" className="hover:text-primary-400 transition-colors" id="about-email">
                  hello@propertymind.ai
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 text-dark-300">
                <Phone className="w-5 h-5 text-primary-400" />
                <a href="tel:+18005551234" className="hover:text-primary-400 transition-colors" id="about-phone">
                  +1 (800) 555-1234
                </a>
              </div>
              <div className="flex items-center justify-center gap-3 text-dark-300">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>123 Tech Avenue, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
