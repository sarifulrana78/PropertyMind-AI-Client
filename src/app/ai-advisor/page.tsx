'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Loader2, Bot, User, Wrench, Search, BarChart3,
  Calculator, GitCompare, Sparkles, MessageSquare, RefreshCw, Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const TOOL_ICONS: Record<string, React.ReactNode> = {
  search_properties: <Search className="w-3.5 h-3.5" />,
  get_market_stats: <BarChart3 className="w-3.5 h-3.5" />,
  calculate_mortgage: <Calculator className="w-3.5 h-3.5" />,
  compare_properties: <GitCompare className="w-3.5 h-3.5" />,
};

const TOOL_LABELS: Record<string, string> = {
  search_properties: 'Searching properties...',
  get_market_stats: 'Fetching market stats...',
  calculate_mortgage: 'Calculating mortgage...',
  compare_properties: 'Comparing properties...',
};

const EXAMPLE_PROMPTS = [
  '🏠 Find 3-bedroom houses in Austin under $800K',
  '📊 What is the average home price in Miami?',
  '💰 Calculate mortgage for a $500,000 home with 20% down at 6.5%',
  '🔍 Search for luxury villas in Los Angeles',
  '📈 Compare the markets in Austin and Miami',
  '🏢 Find apartments for rent in Chicago under $5,000/month',
];

export default function AIAdvisorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Pre-fill from URL query
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setInput(q);
  }, [searchParams]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isStreaming) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setActiveTools([]);

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const historyMessages = messages.map(m => ({ role: m.role, content: m.content }));
      historyMessages.push({ role: 'user', content: text });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pm_token') || ''}`,
        },
        body: JSON.stringify({ messages: historyMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to AI advisor');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'tool_call') {
              setActiveTools(data.tools);
            } else if (data.type === 'tool_result') {
              setActiveTools([]);
            } else if (data.type === 'content') {
              setMessages(prev => prev.map(m =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + data.delta }
                  : m
              ));
            } else if (data.type === 'done') {
              setIsStreaming(false);
              setActiveTools([]);
            } else if (data.type === 'error') {
              toast.error(data.message || 'AI error occurred');
              setIsStreaming(false);
              setActiveTools([]);
            }
          } catch {}
        }
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id));
    } finally {
      setIsStreaming(false);
      setActiveTools([]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setActiveTools([]);
    inputRef.current?.focus();
  };

  if (authLoading) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col gradient-hero">
      {/* Header */}
      <div className="border-b border-white/5 bg-dark-900/80 backdrop-blur-sm">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">PropertyMind AI Advisor</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                  <p className="text-xs text-dark-400">Powered by Groq llama-3.3-70b • 4 research tools active</p>
                </div>
              </div>
            </div>
            <button
              id="clear-chat-btn"
              onClick={clearChat}
              className="flex items-center gap-1.5 text-dark-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <RefreshCw className="w-4 h-4" /> Clear Chat
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="section-container py-6 max-w-4xl">
          {messages.length === 0 ? (
            /* Welcome screen */
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/20">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Meet Your AI Property Advisor</h2>
              <p className="text-dark-400 max-w-lg mx-auto mb-8">
                I can search properties, analyze markets, calculate mortgages, and compare listings in real-time. Ask me anything about real estate!
              </p>

              {/* Tool cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-2xl mx-auto">
                {[
                  { icon: Search, label: 'Search', desc: 'Find properties' },
                  { icon: BarChart3, label: 'Markets', desc: 'Get city stats' },
                  { icon: Calculator, label: 'Mortgage', desc: 'Calculate costs' },
                  { icon: GitCompare, label: 'Compare', desc: 'Side-by-side' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="glass-card p-4 text-center">
                    <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <div className="text-white font-semibold text-sm">{label}</div>
                    <div className="text-dark-500 text-xs">{desc}</div>
                  </div>
                ))}
              </div>

              {/* Example prompts */}
              <p className="text-dark-400 text-sm mb-4">Try asking:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {EXAMPLE_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    id={`example-prompt-${prompt.slice(0, 20).replace(/\s/g, '-')}`}
                    onClick={() => sendMessage(prompt.replace(/^[^\s]+\s/, ''))}
                    className="text-left px-4 py-3 glass-card text-dark-300 hover:text-white hover:border-primary-500/30 text-sm transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                      {message.role === 'user' ? (
                        <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-5 py-3 text-sm leading-relaxed ml-auto">
                          {message.content}
                        </div>
                      ) : (
                        <div className="glass-card px-5 py-4">
                          {message.content ? (
                            <div className="text-dark-100 text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                              {isStreaming && messages[messages.length - 1].id === message.id && (
                                <span className="inline-block w-2 h-4 bg-primary-400 ml-1 animate-pulse rounded-sm" />
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-dark-400 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
                              <span>Thinking...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-dark-600 to-dark-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-dark-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Active tools indicator */}
              {activeTools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-3 glass-card border-primary-500/20"
                >
                  <Wrench className="w-4 h-4 text-primary-400 animate-spin" />
                  <div className="flex flex-wrap gap-2">
                    {activeTools.map(tool => (
                      <span key={tool} className="badge-primary flex items-center gap-1">
                        {TOOL_ICONS[tool]}
                        {TOOL_LABELS[tool]}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 bg-dark-900/80 backdrop-blur-sm">
        <div className="section-container max-w-4xl py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about properties, markets, mortgages..."
                disabled={isStreaming}
                className="input-field pl-11 pr-4"
              />
            </div>
            <button
              id="send-message-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isStreaming}
              className="btn-primary px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-dark-600 text-xs mt-2 text-center">
            AI may make mistakes. Verify important decisions with a licensed real estate professional.
          </p>
        </div>
      </div>
    </div>
  );
}
