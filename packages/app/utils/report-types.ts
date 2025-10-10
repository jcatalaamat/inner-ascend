export type ReportItemType = 'event' | 'place' | 'review' | 'user'
export type ReportReason = 'spam' | 'inappropriate' | 'misleading' | 'harassment' | 'duplicate' | 'other'
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed'
export type ReportAction = 'hide_item' | 'remove_item' | 'warn_user' | 'ban_user' | 'no_action'

export interface Report {
  id: string
  reporter_id: string | null
  item_id: string
  item_type: ReportItemType
  reason: ReportReason
  description: string | null
  status: ReportStatus
  resolved_by: string | null
  resolution_notes: string | null
  resolution_action: ReportAction | null
  created_at: string
  resolved_at: string | null
}

export interface ReportSubmission {
  item_id: string
  item_type: ReportItemType
  reason: ReportReason
  description?: string
}
