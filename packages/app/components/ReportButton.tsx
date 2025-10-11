import { Button } from '@my/ui'
import { Flag } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { ReportSheet } from './ReportSheet'
import type { ReportItemType } from 'app/utils/report-types'
import { usePostHog } from 'posthog-react-native'

interface ReportButtonProps {
  itemId: string
  itemType: ReportItemType
  variant?: 'outlined' | 'ghost'
  size?: '$2' | '$3' | '$4'
  iconOnly?: boolean
}

export function ReportButton({
  itemId,
  itemType,
  variant = 'ghost',
  size = '$3',
  iconOnly = false,
}: ReportButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const posthog = usePostHog()

  const handleOpenSheet = () => {
    posthog?.capture('report_button_clicked', {
      item_type: itemType,
      item_id: itemId,
    })
    setSheetOpen(true)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon={<Flag size={16} />}
        onPress={handleOpenSheet}
        chromeless={variant === 'ghost'}
      >
        {!iconOnly && 'Report'}
      </Button>

      <ReportSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        itemId={itemId}
        itemType={itemType}
      />
    </>
  )
}
