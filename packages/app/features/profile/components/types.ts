/**
 * Shared types for profile components
 */

export type ViewMode = 'personal' | 'creator'

export interface ProfileSectionProps {
  onViewAll?: () => void
}

export interface HorizontalScrollSectionProps<T> {
  items: T[]
  isLoading: boolean
  onItemPress: (id: string) => void
  emptyMessage: string
  createMessage?: string
  onCreatePress?: () => void
}
