'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Brain, Zap, Building2, MapPin, DollarSign, Bed, Bath, Square, Calendar, PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProperty, useGenerateDescription } from '@/hooks/useProperties';
import toast from 'react-hot-toast';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(1, 'Price is required'),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'Zip code is required'),
  type: z.enum(['house', 'apartment', 'villa', 'condo', 'land']),
  status: z.enum(['for-sale', 'for-rent']),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  sqft: z.number().min(1),
  yearBuilt: z.number().min(1800).max(2026),
  parking: z.number().min(0).default(1),
  amenities: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function AddPropertyPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const createProperty = useCreateProperty();
  const generateDescription = useGenerateDescription();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'house', status: 'for-sale', bedrooms: 3, bathrooms: 2, sqft: 1500, yearBuilt: 2020, parking: 1,
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const watchedValues = watch();

  const handleGenerateAI = async () => {
    const formData = watchedValues;
    if (!formData.city || !formData.type || !formData.price) {
      toast.error('Please fill in city, type, and price before generating AI description');
      return;
    }
    const toastId = toast.loading('🤖 Generating AI description and market report...');
    try {
      const result = await generateDescription.mutateAsync({
        title: formData.title || 'Property',
        description: formData.description || '',
        price: formData.price,
        address: { city: formData.city, state: formData.state, street: formData.street, zipCode: formData.zipCode, country: 'USA' },
        type: formData.type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        yearBuilt: formData.yearBuilt,
        amenities: formData.amenities?.split(',').map(a => a.trim()) || [],
        status: formData.status,
      });

      if (result?.aiDescription) {
        setValue('description', result.aiDescription);
        toast.success('✨ AI description generated! Review and submit.', { id: toastId });
      }
    } catch {
      toast.error('Failed to generate AI description', { id: toastId });
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    const toastId = toast.loading('Creating your listing...');
    try {
      const propertyData = {
        title: data.title,
        description: data.description,
        price: data.price,
        address: { street: data.street, city: data.city, state: data.state, zipCode: data.zipCode, country: 'USA' },
        type: data.type,
        status: data.status,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        yearBuilt: data.yearBuilt,
        parking: data.parking,
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        images: data.imageUrl ? [data.imageUrl] : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
      };
      const created = await createProperty.mutateAsync(propertyData);
      toast.success('Property listed successfully!', { id: toastId });
      router.push(`/properties/${created._id}`);
    } catch {
      toast.error('Failed to create listing', { id: toastId });
    }
  };

  if (authLoading) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">List Your Property</h1>
              <p className="text-dark-400 text-sm">Add your property with AI-powered description generation</p>
            </div>
          </div>
        </motion.div>

        {/* AI Feature Banner */}
        <motion.div
          className="glass-card p-4 mb-8 mt-6 border-primary-500/30 bg-primary-500/5"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-primary-300 font-semibold text-sm">AI-Powered Listing Assistant</p>
              <p className="text-dark-400 text-xs mt-1">After filling in basic details, click &quot;Generate AI Description&quot; to get a professional listing description and market positioning report automatically.</p>
            </div>
            <button
              id="generate-ai-description-btn"
              type="button"
              onClick={handleGenerateAI}
              disabled={generateDescription.isPending}
              className="btn-primary text-xs py-2 px-4 whitespace-nowrap flex-shrink-0"
            >
              {generateDescription.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> Generate AI</>
              )}
            </button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-400" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="prop-title" className="block text-sm font-medium text-dark-300 mb-2">Property Title *</label>
                <input id="prop-title" {...register('title')} placeholder="e.g., Modern 3-Bedroom Home with Pool" className="input-field" />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="prop-description" className="block text-sm font-medium text-dark-300 mb-2">Description *</label>
                <textarea id="prop-description" {...register('description')} placeholder="Describe your property..." rows={4} className="input-field resize-none" />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prop-type" className="block text-sm font-medium text-dark-300 mb-2">Property Type *</label>
                  <select id="prop-type" {...register('type')} className="input-field">
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prop-status" className="block text-sm font-medium text-dark-300 mb-2">Status *</label>
                  <select id="prop-status" {...register('status')} className="input-field">
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary-400" /> Pricing
            </h2>
            <div>
              <label htmlFor="prop-price" className="block text-sm font-medium text-dark-300 mb-2">Price (USD) *</label>
              <input id="prop-price" type="number" {...register('price', { valueAsNumber: true })} placeholder="e.g., 750000" className="input-field" />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
              <p className="text-dark-500 text-xs mt-1">For rentals, enter the monthly rent amount</p>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-400" /> Location
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="prop-street" className="block text-sm font-medium text-dark-300 mb-2">Street Address *</label>
                <input id="prop-street" {...register('street')} placeholder="e.g., 123 Main Street" className="input-field" />
                {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label htmlFor="prop-city" className="block text-sm font-medium text-dark-300 mb-2">City *</label>
                <input id="prop-city" {...register('city')} placeholder="e.g., Austin" className="input-field" />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="prop-state" className="block text-sm font-medium text-dark-300 mb-2">State *</label>
                <input id="prop-state" {...register('state')} placeholder="e.g., TX" className="input-field" />
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label htmlFor="prop-zip" className="block text-sm font-medium text-dark-300 mb-2">Zip Code *</label>
                <input id="prop-zip" {...register('zipCode')} placeholder="e.g., 78701" className="input-field" />
              </div>
            </div>
          </motion.div>

          {/* Property Details */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Bed className="w-4 h-4 text-primary-400" /> Property Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="prop-beds" className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1"><Bed className="w-3 h-3" /> Bedrooms *</label>
                <input id="prop-beds" type="number" {...register('bedrooms', { valueAsNumber: true })} min="0" max="20" className="input-field" />
              </div>
              <div>
                <label htmlFor="prop-baths" className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1"><Bath className="w-3 h-3" /> Bathrooms *</label>
                <input id="prop-baths" type="number" {...register('bathrooms', { valueAsNumber: true })} min="0" max="20" className="input-field" />
              </div>
              <div>
                <label htmlFor="prop-sqft" className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1"><Square className="w-3 h-3" /> Square Feet *</label>
                <input id="prop-sqft" type="number" {...register('sqft', { valueAsNumber: true })} min="1" className="input-field" />
              </div>
              <div>
                <label htmlFor="prop-year" className="block text-sm font-medium text-dark-300 mb-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> Year Built *</label>
                <input id="prop-year" type="number" {...register('yearBuilt', { valueAsNumber: true })} min="1800" max="2026" className="input-field" />
              </div>
              <div>
                <label htmlFor="prop-parking" className="block text-sm font-medium text-dark-300 mb-2">Parking Spots</label>
                <input id="prop-parking" type="number" {...register('parking', { valueAsNumber: true })} min="0" className="input-field" />
              </div>
            </div>
          </motion.div>

          {/* Additional */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-400" /> Additional Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="prop-amenities" className="block text-sm font-medium text-dark-300 mb-2">Amenities (comma-separated)</label>
                <input id="prop-amenities" {...register('amenities')} placeholder="Pool, Gym, Smart Home, EV Charger" className="input-field" />
              </div>
              <div>
                <label htmlFor="prop-image" className="block text-sm font-medium text-dark-300 mb-2">Image URL (optional)</label>
                <input id="prop-image" {...register('imageUrl')} placeholder="https://images.unsplash.com/..." className="input-field" />
                {errors.imageUrl && <p className="text-red-400 text-xs mt-1">{errors.imageUrl.message}</p>}
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <button
              id="submit-property-btn"
              type="submit"
              disabled={createProperty.isPending}
              className="btn-primary flex-1 justify-center text-base py-4"
            >
              {createProperty.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Listing...</>
              ) : (
                <><PlusCircle className="w-5 h-5" /> List Property</>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-outline px-8"
            >
              Cancel
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
