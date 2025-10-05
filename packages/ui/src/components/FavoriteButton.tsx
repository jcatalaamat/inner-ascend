import { Heart } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, type ButtonProps } from 'tamagui'

export type FavoriteButtonProps = {
  isFavorited: boolean
  onToggle: () => void
  size?: number
} & Omit<ButtonProps, 'onPress'>

export const FavoriteButton = ({ isFavorited, onToggle, size = 24, ...props }: FavoriteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handlePress = () => {
    setIsAnimating(true)
    onToggle()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <Button
      circular
      size="$3"
      chromeless
      backgroundColor={isFavorited ? '$red3' : '$color3'}
      onPress={handlePress}
      pressStyle={{ opacity: 0.8 }}
      animation="bouncy"
      {...props}
    >
      <Heart
        size={size}
        color={isFavorited ? '$red10' : '$color10'}
        fill={isFavorited ? '$red10' : 'transparent'}
        strokeWidth={isFavorited ? 2 : 1.5}
      />
    </Button>
  )
}
