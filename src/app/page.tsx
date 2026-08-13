'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Search, Building2, Brain, BarChart3, TrendingUp, Shield, Star,
  ArrowRight, ChevronDown, MapPin, Bed, Bath, Square, Play, Check,
  Zap, Users, Award, Globe, ChevronLeft, ChevronRight, Quote, Plus, Minus
} from 'lucide-react';
import { useFeaturedProperties, useMarketStats } from '@/hooks/useProperties';
import PropertyCard from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/SkeletonLoaders';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Hero animated counter
function AnimatedCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const step = end / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Star rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-accent-400 fill-accent-400' : 'text-dark-600'}`} />
      ))}
    </div>
  );
}

// FAQ Item
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-6 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white pr-4">{question}</span>
        <span className="flex-shrink-0 w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
          {open ? <Minus className="w-3 h-3 text-primary-400" /> : <Plus className="w-3 h-3 text-primary-400" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-dark-300 leading-relaxed text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}

const testimonials = [
  {
    name: 'Alexandra Chen',
    role: 'Investment Banker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexandra',
    rating: 5,
    text: 'PropertyMind AI completely transformed how I research real estate investments. The AI advisor identified a 23% undervalued property in Austin that I would have never found manually.',
  },
  {
    name: 'Marcus Thompson',
    role: 'First-time Buyer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    rating: 5,
    text: 'As a first-time buyer, I was overwhelmed by the market. The AI advisor walked me through mortgage calculations, compared neighborhoods, and found my dream home in 2 weeks!',
  },
  {
    name: 'Priya Patel',
    role: 'Real Estate Agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 5,
    text: 'The AI-generated property descriptions save me 2 hours per listing. My clients love the market positioning reports — it makes me look like a genius analyst.',
  },
];

const faqs = [
  { question: 'How does the AI Property Advisor work?', answer: 'Our AI Advisor is powered by Groq\'s llama-3.3-70b model with specialized real estate tools. It can search our database, fetch market statistics, calculate mortgages, and compare properties in real-time, giving you data-driven recommendations just like a personal real estate expert.' },
  { question: 'Is PropertyMind AI free to use?', answer: 'Yes! Browsing properties, using the AI Advisor, and accessing market analytics are all free. Premium features like advanced AI reports and unlimited saved searches are available for subscribers.' },
  { question: 'How accurate are the AI market analyses?', answer: 'Our market analyses are based on real listing data in our database combined with AI reasoning. While we strive for accuracy, real estate markets are dynamic — always consult with a licensed agent for major investment decisions.' },
  { question: 'Can I list my property on PropertyMind AI?', answer: 'Absolutely! Create a free account and navigate to "List Property." Our AI will automatically generate a professional description and market positioning report for your listing.' },
  { question: 'How do I get AI-generated descriptions for my listings?', answer: 'When you add a property, click the "Generate AI Description" button. Our AI analyzes your property\'s features and creates a compelling, SEO-optimized description in seconds.' },
];

const features = [
  {
    icon: Brain,
    title: 'AI Property Advisor',
    description: 'Chat with our intelligent agent that searches listings, calculates mortgages, and provides personalized investment advice.',
    color: 'from-primary-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Instant AI Descriptions',
    description: 'Generate professional, SEO-optimized property descriptions and market reports in seconds with our AI writer.',
    color: 'from-secondary-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Market Analytics',
    description: 'Deep market insights with real-time charts showing price trends, inventory levels, and investment opportunities.',
    color: 'from-accent-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'Every property is verified and reviewed. Our AI flags inconsistencies to ensure you always see accurate data.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Globe,
    title: 'Nationwide Coverage',
    description: 'Properties across all 50 states with local market expertise powered by city-specific AI models.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Investment Scoring',
    description: 'AI-powered investment scores that predict property appreciation potential and time-to-sell estimates.',
    color: 'from-violet-500 to-primary-500',
  },
];

const howItWorks = [
  { step: '01', title: 'Search & Explore', description: 'Browse thousands of verified listings with powerful filters for location, type, price, and features.' },
  { step: '02', title: 'AI Analysis', description: 'Our AI instantly analyzes any property — generating market reports, investment scores, and comparisons.' },
  { step: '03', title: 'Get Insights', description: 'Chat with our AI Advisor for personalized recommendations, mortgage calculations, and expert guidance.' },
];

const blogPosts = [
  {
    category: 'Market Trends',
    title: 'Austin Real Estate: Why Tech Exodus is Reshaping Demand',
    excerpt: 'Remote work has permanently altered where top talent chooses to live — and Austin is reaping the benefits.',
    date: 'Aug 10, 2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
  },
  {
    category: 'AI & PropTech',
    title: 'How AI is Disrupting Traditional Real Estate Valuation',
    excerpt: 'Machine learning models are now outperforming traditional appraisals in 73% of cases, according to new research.',
    date: 'Aug 7, 2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80',
  },
  {
    category: 'Investment Guide',
    title: 'Top 5 Cities for Real Estate ROI in 2026',
    excerpt: 'Our AI analyzed 250,000 data points to identify the markets with the highest investment potential this year.',
    date: 'Aug 3, 2026',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState('');

  const { data: featuredProperties, isLoading: featuredLoading } = useFeaturedProperties();
  const { data: marketStats, isLoading: statsLoading } = useMarketStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  const nextTestimonial = () => setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="overflow-x-hidden">
      {/* ============= SECTION 1: HERO ============= */}
      <section id="hero" className="gradient-hero min-h-[65vh] flex flex-col justify-center relative overflow-hidden pt-8 pb-16">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-950/50 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div variants={fadeIn} className="flex justify-center mb-6">
              <div className="badge-primary flex items-center gap-2 px-4 py-2 text-sm">
                <Zap className="w-3.5 h-3.5" />
                Powered by Groq AI — 10x Faster Intelligence
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Find Your
              <span className="block gradient-text">Dream Property</span>
              <span className="block text-4xl md:text-5xl font-bold text-dark-300 mt-2">with AI Intelligence</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={fadeIn} className="text-dark-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              PropertyMind AI combines real estate expertise with cutting-edge artificial intelligence to help you discover, analyze, and invest in properties smarter than ever before.
            </motion.p>

            {/* Search bar */}
            <motion.form variants={fadeIn} onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex items-center glass-card p-2 gap-2">
                <Search className="w-5 h-5 text-primary-400 flex-shrink-0 ml-2" />
                <input
                  id="hero-search"
                  type="text"
                  placeholder="Search by city, neighborhood, or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-dark-400 outline-none text-sm py-2"
                />
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </motion.form>

            {/* Quick links */}
            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-3 mb-12">
              {['Austin', 'Miami', 'New York', 'Los Angeles', 'Chicago'].map(city => (
                <Link
                  key={city}
                  href={`/properties?city=${city}`}
                  className="flex items-center gap-1.5 px-4 py-2 glass-card hover:border-primary-500/30 text-dark-300 hover:text-white text-sm transition-all duration-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary-400" />
                  {city}
                </Link>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeIn} className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { end: 23, suffix: '+', label: 'Properties' },
                { end: 8, suffix: ' Cities', label: 'Markets' },
                { end: 100, suffix: '%', label: 'AI Powered' },
              ].map(({ end, suffix, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-white">
                    <AnimatedCounter end={end} suffix={suffix} />
                  </div>
                  <div className="text-xs text-dark-400 mt-1">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-dark-500" />
        </div>
      </section>

      {/* ============= SECTION 2: HOW IT WORKS ============= */}
      <section id="how-it-works" className="py-24 bg-dark-900/50">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <span className="badge-primary mb-4 inline-flex">Simple & Smart</span>
            <h2 className="text-4xl font-bold text-white mb-4">How PropertyMind AI Works</h2>
            <p className="text-dark-400 max-w-xl mx-auto">Three simple steps to finding your perfect property with AI-powered intelligence</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-500/50 to-secondary-500/50" />

            {howItWorks.map((step, i) => (
              <motion.div key={step.step} variants={fadeIn} className="glass-card p-8 text-center relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                  <span className="text-white font-black text-lg">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{step.description}</p>
                {i < 2 && (
                  <div className="md:hidden absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <ChevronDown className="w-5 h-5 text-primary-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 3: FEATURED PROPERTIES ============= */}
      <section id="featured-properties" className="py-24">
        <div className="section-container">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div>
              <span className="badge-accent mb-3 inline-flex">Hot Listings</span>
              <h2 className="text-4xl font-bold text-white">Featured Properties</h2>
              <p className="text-dark-400 mt-2">Hand-picked premium properties from our top markets</p>
            </div>
            <Link href="/properties" id="home-view-all-btn" className="btn-outline text-sm">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {featuredLoading
              ? Array(4).fill(0).map((_, i) => (
                  <motion.div key={i} variants={fadeIn}><PropertyCardSkeleton /></motion.div>
                ))
              : (featuredProperties?.slice(0, 4) || []).map(property => (
                  <motion.div key={property._id} variants={fadeIn}>
                    <PropertyCard property={property} />
                  </motion.div>
                ))
            }
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 4: AI FEATURES ============= */}
      <section id="ai-features" className="py-24 bg-gradient-to-br from-dark-900 via-primary-950/30 to-dark-900">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <span className="badge-primary mb-4 inline-flex">
              <Brain className="w-3.5 h-3.5" /> AI Powered Features
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Intelligence That <span className="gradient-text">Transforms</span> Real Estate
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Our agentic AI doesn't just answer questions — it researches, analyzes, and reasons to give you truly expert guidance.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={fadeIn} className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <Link href="/ai-advisor" id="home-try-ai-btn" className="btn-primary">
              <Brain className="w-5 h-5" />
              Try AI Advisor Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 5: MARKET STATISTICS ============= */}
      <section id="market-stats" className="py-24 bg-dark-900/50">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <span className="badge-secondary mb-4 inline-flex">
              <BarChart3 className="w-3.5 h-3.5" /> Live Data
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">Real-Time Market Statistics</h2>
            <p className="text-dark-400 max-w-xl mx-auto">Live market data from our platform across 8 major US cities</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {statsLoading
              ? Array(4).fill(0).map((_, i) => (
                  <motion.div key={i} variants={fadeIn} className="glass-card p-6">
                    <div className="skeleton h-6 w-20 mb-3" />
                    <div className="skeleton h-8 w-28" />
                  </motion.div>
                ))
              : (marketStats?.slice(0, 8) || []).map((stat: { city: string; avgPrice: number; listings: number; avgRating: number }) => (
                  <motion.div key={stat.city} variants={fadeIn} className="glass-card p-6 hover:border-secondary-500/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-secondary-400" />
                      <span className="text-dark-300 text-sm font-medium">{stat.city}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      ${(stat.avgPrice / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-dark-400">Avg. price • {stat.listings} listings</div>
                  </motion.div>
                ))
            }
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <Link href="/analytics" id="home-analytics-btn" className="btn-outline">
              <BarChart3 className="w-4 h-4" /> View Full Analytics Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 6: WHY CHOOSE US (platform stats) ============= */}
      <section id="platform-stats" className="py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            >
              <span className="badge-accent mb-4 inline-flex"><Award className="w-3.5 h-3.5" /> Why PropertyMind AI</span>
              <h2 className="text-4xl font-bold text-white mb-6">
                The Smartest Way to
                <span className="block gradient-text">Buy, Sell & Invest</span>
              </h2>
              <p className="text-dark-400 mb-8 leading-relaxed">
                We've built the most comprehensive AI-powered real estate platform in the market. Our technology gives you an unfair advantage in any market condition.
              </p>
              <ul className="space-y-4">
                {[
                  'AI advisor with 4 built-in research tools',
                  'Instant AI property descriptions & market reports',
                  'Real-time market analytics with interactive charts',
                  'Secure JWT authentication with Google OAuth',
                  'Mobile-first, responsive design',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-secondary-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-secondary-400" />
                    </div>
                    <span className="text-dark-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex gap-4">
                <Link href="/register" id="home-get-started-btn" className="btn-primary">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/properties" id="home-browse-btn" className="btn-outline">
                  Browse Properties
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            >
              {[
                { icon: Building2, value: '23+', label: 'Active Listings', color: 'from-primary-500 to-purple-500' },
                { icon: Users, value: '4+', label: 'Active Users', color: 'from-secondary-500 to-teal-500' },
                { icon: Brain, value: '2', label: 'AI Agent Types', color: 'from-accent-500 to-orange-500' },
                { icon: Star, value: '4.7', label: 'Avg. Rating', color: 'from-pink-500 to-rose-500' },
              ].map(({ icon: Icon, value, label, color }) => (
                <motion.div key={label} variants={fadeIn} className="glass-card p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{value}</div>
                  <div className="text-dark-400 text-xs">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============= SECTION 7: TESTIMONIALS ============= */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-dark-900 via-primary-950/20 to-dark-900">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <span className="badge-primary mb-4 inline-flex"><Star className="w-3.5 h-3.5" /> Testimonials</span>
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-dark-400">What our users say about PropertyMind AI</p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="glass-card p-8 md:p-12 text-center relative">
              <Quote className="w-10 h-10 text-primary-500/40 mx-auto mb-6" />
              <p className="text-white text-lg md:text-xl leading-relaxed mb-8 italic">
                &ldquo;{testimonials[testimonialIndex].text}&rdquo;
              </p>
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={testimonials[testimonialIndex].avatar}
                  alt={testimonials[testimonialIndex].name}
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-primary-500/30"
                />
                <div>
                  <p className="font-semibold text-white">{testimonials[testimonialIndex].name}</p>
                  <p className="text-dark-400 text-sm">{testimonials[testimonialIndex].role}</p>
                </div>
                <StarRating rating={testimonials[testimonialIndex].rating} />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  id="testimonial-prev"
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary-500/30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4 text-dark-300" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === testimonialIndex ? 'bg-primary-500 w-6' : 'bg-dark-600'}`}
                    />
                  ))}
                </div>
                <button
                  id="testimonial-next"
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary-500/30 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-dark-300" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 8: BLOG PREVIEW ============= */}
      <section id="blog-preview" className="py-24 bg-dark-900/50">
        <div className="section-container">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div>
              <span className="badge-primary mb-3 inline-flex">Latest Insights</span>
              <h2 className="text-4xl font-bold text-white">From Our Blog</h2>
              <p className="text-dark-400 mt-2">Market insights, AI trends, and investment tips</p>
            </div>
            <Link href="/blog" id="home-blog-btn" className="btn-outline text-sm">
              View All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {blogPosts.map((post, i) => (
              <motion.article key={i} variants={fadeIn} className="glass-card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="badge-primary text-xs">{post.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-dark-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span>{post.date}</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 9: NEWSLETTER ============= */}
      <section id="newsletter" className="py-24">
        <div className="section-container">
          <motion.div
            className="glass-card p-12 text-center max-w-3xl mx-auto relative overflow-hidden"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Stay Ahead of the Market</h2>
              <p className="text-dark-400 mb-8 max-w-lg mx-auto">
                Get weekly AI-powered market insights, property picks, and investment opportunities delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="input-field flex-1"
                />
                <button
                  id="newsletter-submit"
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
              <p className="text-dark-500 text-xs mt-4">No spam. Unsubscribe anytime. 100% free.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============= SECTION 10: FAQ ============= */}
      <section id="faq" className="py-24 bg-dark-900/50">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <span className="badge-primary mb-4 inline-flex">FAQ</span>
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-dark-400 max-w-xl mx-auto">Everything you need to know about PropertyMind AI</p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-3"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeIn}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============= CTA SECTION ============= */}
      <section id="cta" className="py-24">
        <div className="section-container">
          <motion.div
            className="text-center"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur-3xl opacity-20" />
              <div className="relative glass-card p-12 md:p-16 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Ready to Find Your
                  <span className="block gradient-text">Perfect Property?</span>
                </h2>
                <p className="text-dark-300 text-lg mb-10 max-w-lg mx-auto">
                  Join thousands of smart buyers and investors using PropertyMind AI to make better real estate decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register" id="cta-register-btn" className="btn-primary text-base px-8 py-4">
                    <Brain className="w-5 h-5" /> Start With AI Free
                  </Link>
                  <Link href="/properties" id="cta-browse-btn" className="btn-outline text-base px-8 py-4">
                    Browse Listings
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
