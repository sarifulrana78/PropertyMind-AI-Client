'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Settings, Trash2, Eye, PlusCircle, Loader2, Building2, MapPin, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { useMyProperties, useDeleteProperty } from '@/hooks/useProperties';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, getStatusColor, getStatusLabel, formatRelativeDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ManagePropertiesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: properties, isLoading } = useMyProperties();
  const deleteProperty = useDeleteProperty();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const toastId = toast.loading('Deleting property...');
    try {
      await deleteProperty.mutateAsync(id);
      toast.success('Property deleted', { id: toastId });
    } catch {
      toast.error('Failed to delete property', { id: toastId });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (authLoading || isLoading) return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen gradient-hero py-8">
      <div className="section-container">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-5 h-5 text-primary-400" />
              <span className="text-dark-400 text-sm">Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Manage Listings</h1>
            <p className="text-dark-400 text-sm mt-1">
              {properties?.length || 0} total listing{properties?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/properties/add" id="manage-add-btn" className="btn-primary">
            <PlusCircle className="w-4 h-4" /> Add New Property
          </Link>
        </motion.div>

        {!properties || properties.length === 0 ? (
          <motion.div
            className="glass-card p-16 text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <Building2 className="w-20 h-20 text-dark-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">No properties yet</h2>
            <p className="text-dark-400 mb-8 max-w-md mx-auto">
              Start by adding your first property listing. Our AI will help you create a compelling description.
            </p>
            <Link href="/properties/add" id="empty-add-btn" className="btn-primary">
              <PlusCircle className="w-4 h-4" /> List Your First Property
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="glass-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-dark-800/50 border-b border-white/5 text-xs font-semibold text-dark-400 uppercase tracking-wider">
              <div className="col-span-4">Property</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Listed</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/5">
              {properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-white/2 transition-colors items-center"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                >
                  {/* Property info */}
                  <div className="md:col-span-4 flex items-center gap-4">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80'}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{property.title}</h3>
                      <div className="flex items-center gap-1 text-dark-400 text-xs mt-0.5">
                        <MapPin className="w-3 h-3 text-primary-400" />
                        <span className="truncate">{property.address.city}, {property.address.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-1 text-secondary-400 font-bold text-sm">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatPrice(property.price, property.status).replace('$', '')}
                    </div>
                    <div className="text-xs text-dark-500 mt-0.5">{property.type}</div>
                  </div>

                  {/* Status */}
                  <div className="md:col-span-2">
                    <span className={getStatusColor(property.status)}>{getStatusLabel(property.status)}</span>
                    <div className="flex items-center gap-1 text-dark-500 text-xs mt-1">
                      <Eye className="w-3 h-3" />
                      {property.views} views
                    </div>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-1.5 text-dark-400 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-primary-400" />
                      <span>{formatRelativeDate(property.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center gap-2 md:justify-end">
                    <Link
                      href={`/properties/${property._id}`}
                      id={`view-property-${property._id}`}
                      className="flex items-center gap-1.5 px-3 py-2 glass-card text-dark-300 hover:text-white text-xs font-medium transition-all hover:border-primary-500/30"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>

                    {confirmDeleteId === property._id ? (
                      <div className="flex items-center gap-1">
                        <button
                          id={`confirm-delete-${property._id}`}
                          onClick={() => handleDelete(property._id)}
                          disabled={deletingId === property._id}
                          className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg font-medium transition-all flex items-center gap-1"
                        >
                          {deletingId === property._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-2 glass-card text-dark-300 text-xs rounded-lg"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`delete-property-${property._id}`}
                        onClick={() => setConfirmDeleteId(property._id)}
                        className="flex items-center gap-1.5 px-3 py-2 glass-card text-red-400 hover:text-red-300 text-xs font-medium transition-all hover:border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>

                  {/* Mobile confirm overlay */}
                  {confirmDeleteId === property._id && (
                    <div className="md:hidden col-span-1 flex items-center gap-2 p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-xs">Confirm delete?</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
