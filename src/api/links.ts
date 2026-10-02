import { apiRequest } from './client'
import type { ResourceLink } from '../types/links'

export function getLinks() {
  return apiRequest<{ links: ResourceLink[] }>('/links/')
}
