import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, TrendingUp, Brain, Building2, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — Real Estate Intelligence',
  description: 'Expert insights on real estate markets, AI trends, investment strategies, and property technology.',
};

const posts = [
  {
    id: 1, category: 'Market Trends', badge: 'badge-secondary',
    title: 'Austin Real Estate 2026: Why Tech Migration Continues to Drive Demand',
    excerpt: 'Despite broader market corrections, Austin continues to outperform expectations. We analyze the fundamental drivers behind the city\'s resilient real estate market and what buyers need to know heading into Q3.',
    date: 'August 10, 2026', readTime: '6 min read', author: 'Alexandra Chen',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  },
  {
    id: 2, category: 'AI & PropTech', badge: 'badge-primary',
    title: 'How LLM-Powered Agents Are Disrupting Traditional Real Estate Valuation',
    excerpt: 'Large language models with tool-calling capabilities are now outperforming traditional automated valuation models (AVMs) in 73% of cases. We explore the technical reasons why and what it means for the industry.',
    date: 'August 7, 2026', readTime: '8 min read', author: 'Marcus Williams',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  },
  {
    id: 3, category: 'Investment Guide', badge: 'badge-accent',
    title: 'Top 5 US Markets for Real Estate ROI in 2026: An AI-Powered Analysis',
    excerpt: 'Our proprietary AI analyzed 250,000+ data points including job growth, population migration, infrastructure spending, and cap rate compression to identify the five markets with the highest investment potential.',
    date: 'August 3, 2026', readTime: '10 min read', author: 'James Rodriguez',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  },
  {
    id: 4, category: 'Buyer\'s Guide', badge: 'badge-primary',
    title: 'First-Time Homebuyer\'s Complete Guide to Using AI in Your Property Search',
    excerpt: 'Navigating the real estate market as a first-time buyer is overwhelming. Here\'s how to leverage AI tools — including our advisor — to level the playing field against experienced investors.',
    date: 'July 28, 2026', readTime: '7 min read', author: 'Priya Sharma',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: 5, category: 'Market Trends', badge: 'badge-secondary',
    title: 'The Miami Condo Market: Luxury Resilience in an Uncertain Economy',
    excerpt: 'Miami\'s luxury condo segment has defied gravity, with units above $1M seeing 18% year-over-year appreciation. We break down who is buying and why.',
    date: 'July 22, 2026', readTime: '5 min read', author: 'Alexandra Chen',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  },
  {
    id: 6, category: 'AI & PropTech', badge: 'badge-primary',
    title: 'Groq LPU vs GPU: Why Speed Matters for Real Estate AI Agents',
    excerpt: 'PropertyMind AI runs on Groq\'s lightning-fast LPU inference. Here\'s a technical deep-dive into why inference speed is critical for multi-step agentic workflows in real estate applications.',
    date: 'July 15, 2026', readTime: '9 min read', author: 'Marcus Williams',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  },
];

const categories = [
  { name: 'All Posts', icon: BookOpen, count: 6 },
  { name: 'Market Trends', icon: TrendingUp, count: 2 },
  { name: 'AI & PropTech', icon: Brain, count: 2 },
  { name: 'Investment Guide', icon: Building2, count: 1 },
  { name: "Buyer's Guide", icon: BookOpen, count: 1 },
];

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen gradient-hero py-12">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-primary inline-flex mb-4">Real Estate Intelligence</div>
          <h1 className="text-5xl font-black text-white mb-4">PropertyMind Blog</h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Expert insights on markets, AI trends, investment strategies, and everything real estate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-bold text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.name}>
                      <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-all text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary-400" />
                          {cat.name}
                        </div>
                        <span className="text-xs bg-dark-700 text-dark-400 px-2 py-0.5 rounded-full">{cat.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
            {/* Featured post */}
            <article className="glass-card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all duration-300">
              <div className="relative h-72 overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className={`${featured.badge} mb-3 inline-flex`}>{featured.category}</span>
                  <h2 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors">{featured.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-dark-400 leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-dark-500">
                    <span>{featured.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.readTime}</div>
                    <span>•</span>
                    <span>{featured.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-400 text-sm font-medium">
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </article>

            {/* Post grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map(post => (
                <article key={post.id} className="glass-card overflow-hidden group cursor-pointer hover:border-primary-500/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className={`${post.badge} text-xs`}>{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors text-sm">
                      {post.title}
                    </h3>
                    <p className="text-dark-400 text-xs line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-dark-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
