import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { formatPrice, getStatusColor, getStatusLabel, getPropertyTypeIcon } from '@/lib/utils';
import { Bed, Bath, Square, MapPin, Star, Eye, ArrowRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const statusColor = getStatusColor(property.status);
  const typeIcon = getPropertyTypeIcon(property.type);

  return (
    <div className="property-card flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={statusColor}>{getStatusLabel(property.status)}</span>
          {property.isFeatured && (
            <span className="badge-accent">Featured</span>
          )}
        </div>

        {/* Views */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
          <Eye className="w-3 h-3 text-dark-300" />
          <span className="text-xs text-dark-300">{property.views?.toLocaleString()}</span>
        </div>

        {/* Type badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-lg">{typeIcon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-secondary-400">
            {formatPrice(property.price, property.status)}
          </span>
          {property.pricePerSqft && (
            <span className="text-xs text-dark-400">${property.pricePerSqft}/sqft</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-base mb-2 line-clamp-1 group-hover:text-primary-300 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-dark-400 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
          <span className="truncate">{property.address.city}, {property.address.state}</span>
        </div>

        {/* Short description */}
        <p className="text-dark-400 text-xs line-clamp-2 mb-4 flex-1 leading-relaxed">
          {property.description}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 mb-4 py-3 border-y border-white/5">
          <div className="flex items-center gap-1.5 text-dark-300 text-xs">
            <Bed className="w-3.5 h-3.5 text-primary-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-dark-300 text-xs">
            <Bath className="w-3.5 h-3.5 text-primary-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-dark-300 text-xs">
            <Square className="w-3.5 h-3.5 text-primary-400" />
            <span>{property.sqft?.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
            <span className="text-sm font-medium text-white">{property.rating?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-dark-500">({property.reviewCount})</span>
          </div>

          {/* View button */}
          <Link
            href={`/properties/${property._id}`}
            id={`property-card-${property._id}`}
            className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors group/btn"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
