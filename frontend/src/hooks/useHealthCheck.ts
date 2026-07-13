import { useQuery } from '@tanstack/react-query'
import { healthCheck } from '../services/api'

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: healthCheck,
    retry: false,
  })
}
