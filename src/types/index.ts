export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  provider: 'credentials' | 'google';
  savedProperties?: string[];
  createdAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AIReport {
  positioning: string;
  targetBuyer: string;
  predictedDaysToSell: number;
  confidence: number;
  highlights?: string[];
  investmentScore?: number;
  priceAnalysis?: string;
  generatedAt: string;
}

export type PropertyType = 'house' | 'apartment' | 'villa' | 'condo' | 'land';
export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold';

export interface Property {
  _id: string;
  title: string;
  description: string;
  aiDescription?: string;
  price: number;
  pricePerSqft?: number;
  address: Address;
  type: PropertyType;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  parking: number;
  amenities: string[];
  images: string[];
  owner: User | string;
  rating: number;
  reviewCount: number;
  views: number;
  isFeatured: boolean;
  aiReport?: AIReport;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  property: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PropertyFilters {
  search?: string;
  type?: PropertyType | '';
  status?: PropertyStatus | '';
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: string[];
  toolResults?: Record<string, unknown>[];
  timestamp: Date;
}

export interface MarketStats {
  city: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  listings: number;
  avgRating: number;
}

export interface PriceTrend {
  month: string;
  avgPrice: number;
  listings: number;
}

export interface TypeStat {
  type: string;
  avgPrice: number;
  count: number;
  avgSqft: number;
}
