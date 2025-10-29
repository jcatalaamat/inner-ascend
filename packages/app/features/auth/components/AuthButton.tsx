import { Button, ButtonProps } from '@my/ui'
import { ComponentProps } from 'react'

/**
 * Gumroad-style auth button with consistent styling:
 * - Full width
 * - Bolder borders (2px)
 * - Larger touch target (56px height)
 * - More rounded (12px)
 * - Clean, minimal aesthetic
 */
export function AuthButton({
  children,
  variant = 'outlined',
  ...props
}: ButtonProps & { variant?: 'outlined' | 'solid' }) {
  const isSolid = variant === 'solid'

  const baseStyles: ComponentProps<typeof Button> = {
    w: '100%',
    h: 56,
    br: '$12',
    fontSize: '$5',
    fontWeight: '600',
    borderWidth: isSolid ? 0 : 2,
    borderColor: '$shadowPurple',
    pressStyle: {
      opacity: 0.8,
      scale: 0.98,
    },
    ...props,
  }

  return (
    <Button
      {...baseStyles}
      bg={isSolid ? '$cosmicViolet' : '$deepSpace3'}
      color="$silverMoon"
      pressStyle={{
        ...baseStyles.pressStyle,
        bg: isSolid ? '$cosmicVioletHover' : '$deepSpace2',
      }}
    >
      {children}
    </Button>
  )
}
