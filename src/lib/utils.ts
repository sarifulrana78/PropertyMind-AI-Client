import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, status?: string): string {
  if (status === 'for-rent') {
    return `$${price.toLocaleString()}/mo`;
  }
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price.toLocaleString()}`;
}

export function formatFullPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'for-sale': return 'badge-secondary';
    case 'for-rent': return 'badge-primary';
    case 'sold': return 'badge-red';
    default: return 'badge-primary';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'for-sale': return 'For Sale';
    case 'for-rent': return 'For Rent';
    case 'sold': return 'Sold';
    default: return status;
  }
}

export function getPropertyTypeIcon(type: string): string {
  switch (type) {
    case 'house': return '🏡';
    case 'apartment': return '🏢';
    case 'villa': return '🏰';
    case 'condo': return '🏙️';
    case 'land': return '🌱';
    default: return '🏠';
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
