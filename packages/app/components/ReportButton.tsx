import { Button } from '@my/ui'
import { Flag } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { ReportSheet } from './ReportSheet'
import type { ReportItemType } from 'app/utils/report-types'

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

  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon={<Flag size={16} />}
        onPress={() => setSheetOpen(true)}
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
