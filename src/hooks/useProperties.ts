import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Property, PropertyFilters, Pagination } from '@/types';

// Fetch properties with filters
export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== '' && val !== null) {
          params.append(key, String(val));
        }
      });
      const response = await api.get(`/properties?${params.toString()}`);
      return response.data.data as { properties: Property[]; pagination: Pagination };
    },
    staleTime: 30 * 1000,
  });
}

// Fetch single property
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await api.get(`/properties/${id}`);
      return response.data.data as { property: Property; reviews: unknown[]; related: Property[] };
    },
    enabled: !!id,
  });
}

// Fetch featured properties
export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      const response = await api.get('/properties/featured');
      return response.data.data.properties as Property[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch my properties
export function useMyProperties() {
  return useQuery({
    queryKey: ['my-properties'],
    queryFn: async () => {
      const response = await api.get('/properties/mine');
      return response.data.data.properties as Property[];
    },
  });
}

// Create property mutation
export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const response = await api.post('/properties', data);
      return response.data.data.property as Property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
    },
  });
}

// Delete property mutation
export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/properties/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
    },
  });
}

// Add review mutation
export function useAddReview(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const response = await api.post(`/properties/${propertyId}/reviews`, data);
      return response.data.data.review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    },
  });
}

// Market stats
export function useMarketStats() {
  return useQuery({
    queryKey: ['market-stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/market-stats');
      return response.data.data.cityStats;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// Price trends
export function usePriceTrends() {
  return useQuery({
    queryKey: ['price-trends'],
    queryFn: async () => {
      const response = await api.get('/analytics/price-trends');
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

// AI Description generator
export function useGenerateDescription() {
  return useMutation({
    mutationFn: async (propertyData: Partial<Property>) => {
      const response = await api.post('/ai/generate-description', { propertyData });
      return response.data.data;
    },
  });
}

// Market analysis
export function useMarketAnalysis() {
  return useMutation({
    mutationFn: async (city: string) => {
      const response = await api.post('/ai/market-analysis', { city });
      return response.data.data;
    },
  });
}
