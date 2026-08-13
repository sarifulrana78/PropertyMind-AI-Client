'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Bed, Bath, Square, Calendar, Car, Star, Eye, ArrowLeft,
  Heart, Share2, Building2, Check, Brain, TrendingUp, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useProperty, useAddReview } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { PropertyDetailSkeleton } from '@/components/SkeletonLoaders';
import { formatFullPrice, formatPrice, getStatusColor, getStatusLabel, formatRelativeDate } from '@/lib/utils';
import { Review } from '@/types';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const id = params.id as string;

  const { data, isLoading, error } = useProperty(id);
  const addReviewMutation = useAddReview(id);

  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [saved, setSaved] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container"><PropertyDetailSkeleton /></div>
    </div>
  );

  if (error || !data?.property) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Property not found</h2>
        <Link href="/properties" className="btn-primary">Back to Listings</Link>
      </div>
    </div>
  );

  const { property, reviews, related } = data;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await addReviewMutation.mutateAsync({ rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const prevImage = () => setActiveImage(prev => (prev - 1 + property.images.length) % property.images.length);
  const nextImage = () => setActiveImage(prev => (prev + 1) % property.images.length);

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container">
        {/* Back button */}
        <button id="back-to-listings" onClick={() => router.back()} className="flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>

        {/* Image gallery */}
        <motion.div className="relative rounded-2xl overflow-hidden mb-8" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={property.images[activeImage] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />

            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <button id="gallery-prev" onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-card flex items-center justify-center hover:bg-white/20">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button id="gallery-next" onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 glass-card flex items-center justify-center hover:bg-white/20">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white">
              {activeImage + 1} / {property.images.length}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={getStatusColor(property.status)}>{getStatusLabel(property.status)}</span>
              {property.isFeatured && <span className="badge-accent">⭐ Featured</span>}
            </div>

            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button id="save-property" onClick={() => setSaved(!saved)} className={`w-10 h-10 glass-card flex items-center justify-center transition-all ${saved ? 'text-red-400 border-red-500/30' : 'text-dark-300 hover:text-red-400'}`}>
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
              <button id="share-property" className="w-10 h-10 glass-card flex items-center justify-center text-dark-300 hover:text-white">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail row */}
          {property.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {property.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-dark-400">
                    <MapPin className="w-4 h-4 text-primary-400" />
                    <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-secondary-400">{formatPrice(property.price, property.status)}</div>
                  {property.pricePerSqft && (
                    <div className="text-sm text-dark-400">${property.pricePerSqft}/sqft</div>
                  )}
                </div>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-4 gap-3 glass-card p-5">
                {[
                  { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                  { icon: Square, label: 'Sq. Footage', value: `${property.sqft?.toLocaleString()} sqft` },
                  { icon: Calendar, label: 'Year Built', value: property.yearBuilt },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 text-primary-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="text-xs text-dark-400">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary-400" /> Description
              </h2>
              <p className="text-dark-300 leading-relaxed">{property.description}</p>

              {property.aiDescription && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-4 h-4 text-primary-400" />
                    <span className="text-sm font-semibold text-primary-300">AI-Generated Description</span>
                    <span className="badge-primary text-xs">AI</span>
                  </div>
                  <p className="text-dark-300 leading-relaxed text-sm italic">{property.aiDescription}</p>
                </div>
              )}
            </motion.div>

            {/* Specifications */}
            <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-bold text-white mb-6">Key Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Property Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1) },
                  { label: 'Status', value: getStatusLabel(property.status) },
                  { label: 'Bedrooms', value: property.bedrooms },
                  { label: 'Bathrooms', value: property.bathrooms },
                  { label: 'Square Footage', value: `${property.sqft?.toLocaleString()} sqft` },
                  { label: 'Price per sqft', value: `$${property.pricePerSqft || '-'}` },
                  { label: 'Year Built', value: property.yearBuilt },
                  { label: 'Parking Spots', value: property.parking },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-dark-400 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2 text-dark-300 text-sm">
                      <Check className="w-4 h-4 text-secondary-400" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Market Report */}
            {property.aiReport && (
              <motion.div className="glass-card p-6 border-primary-500/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                  <h2 className="text-xl font-bold text-white">AI Market Report</h2>
                  <span className="badge-primary text-xs">AI Analysis</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <div className="text-xs text-dark-400 mb-1">Market Position</div>
                    <div className="text-white text-sm font-medium">{property.aiReport.positioning}</div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs text-dark-400 mb-1">Target Buyer</div>
                    <div className="text-white text-sm font-medium">{property.aiReport.targetBuyer}</div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs text-dark-400 mb-1">Est. Days to Sell</div>
                    <div className="text-secondary-400 text-2xl font-bold">{property.aiReport.predictedDaysToSell}</div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-xs text-dark-400 mb-1">AI Confidence</div>
                    <div className="text-accent-400 text-2xl font-bold">{Math.round(property.aiReport.confidence * 100)}%</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Reviews ({property.reviewCount})
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent-400 fill-accent-400" />
                  <span className="text-white font-bold">{property.rating?.toFixed(1)}</span>
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-4 mb-6">
                {(reviews as Review[]).length === 0 ? (
                  <p className="text-dark-400 text-sm">No reviews yet. Be the first to review!</p>
                ) : (
                  (reviews as Review[]).map(review => (
                    <div key={review._id} className="flex gap-3 py-4 border-b border-white/5">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {typeof review.user === 'object' ? review.user.name?.[0] : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm">
                            {typeof review.user === 'object' ? review.user.name : 'User'}
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} className={`w-3 h-3 ${i <= review.rating ? 'text-accent-400 fill-accent-400' : 'text-dark-600'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-dark-500">{formatRelativeDate(review.createdAt)}</span>
                        </div>
                        <p className="text-dark-300 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add review form */}
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="font-semibold text-white">Write a Review</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-dark-400 text-sm">Rating:</span>
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        type="button"
                        id={`review-star-${i}`}
                        onClick={() => setReviewRating(i)}
                      >
                        <Star className={`w-6 h-6 ${i <= reviewRating ? 'text-accent-400 fill-accent-400' : 'text-dark-600 hover:text-accent-300'} cursor-pointer transition-colors`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this property..."
                    required
                    rows={3}
                    className="input-field resize-none"
                  />
                  <button
                    id="submit-review-btn"
                    type="submit"
                    disabled={addReviewMutation.isPending}
                    className="btn-primary text-sm"
                  >
                    {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-dark-400 text-sm">
                  <Link href="/login" className="text-primary-400 hover:underline">Sign in</Link> to write a review.
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact agent card */}
            <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
              <h3 className="font-bold text-white mb-4">Listed by</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {typeof property.owner === 'object' ? property.owner.name : 'Property Owner'}
                  </p>
                  <p className="text-xs text-dark-400">PropertyMind Agent</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-3 border-y border-white/5">
                  <Star className="w-4 h-4 text-accent-400 fill-accent-400" />
                  <span className="text-white font-semibold">{property.rating?.toFixed(1)}</span>
                  <span className="text-dark-400 text-sm">({property.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-dark-400 text-sm">
                  <Eye className="w-4 h-4 text-primary-400" />
                  <span>{property.views?.toLocaleString()} property views</span>
                </div>
              </div>
              <Link
                href="/ai-advisor"
                id="contact-agent-ai-btn"
                className="btn-primary w-full justify-center mt-5 text-sm"
              >
                <Brain className="w-4 h-4" /> Ask AI Advisor
              </Link>
            </motion.div>

            {/* Price breakdown */}
            <motion.div className="glass-card p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <h3 className="font-bold text-white mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400 text-sm">Listing Price</span>
                  <span className="text-white font-bold">{formatFullPrice(property.price)}</span>
                </div>
                {property.pricePerSqft && (
                  <div className="flex justify-between">
                    <span className="text-dark-400 text-sm">Per Square Foot</span>
                    <span className="text-white">${property.pricePerSqft}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t border-white/5">
                  <span className="text-dark-400 text-sm">Est. Down Payment (20%)</span>
                  <span className="text-secondary-400 font-semibold">{formatFullPrice(property.price * 0.2)}</span>
                </div>
              </div>
              <Link
                href={`/ai-advisor?q=Calculate mortgage for property at ${formatFullPrice(property.price)}`}
                id="mortgage-calc-btn"
                className="btn-outline w-full justify-center mt-4 text-sm"
              >
                Calculate Mortgage
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Related Properties */}
        {related?.length > 0 && (
          <motion.section className="mt-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-2xl font-bold text-white mb-6">Similar Properties in {property.address.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map(p => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
