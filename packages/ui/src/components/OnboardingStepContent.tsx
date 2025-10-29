import { IconProps } from '@tamagui/helpers-icon'
import React from 'react'
import { H1, Paragraph, YStack, XStack, Square } from 'tamagui'

export const StepContent = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.FC<IconProps>
  title: string
  description: string
}) => {
  return (
    <YStack
      f={1}
      jc="center"
      ai="center"
      px="$6"
      py="$8"
      animation="100ms"
      exitStyle={{ o: 0, x: -20 }}
      enterStyle={{ o: 0, x: 20 }}
      o={1}
      x={0}
    >
      {/* Bold geometric icon container - Gumroad style */}
      <YStack
        animation="lazy"
        y={0}
        scale={1}
        enterStyle={{ y: -20, o: 0, scale: 0.8 }}
        exitStyle={{ y: 20, o: 0, scale: 0.8 }}
        o={1}
        mb="$6"
      >
        <Square
          size={120}
          bg="$color5"
          borderWidth={4}
          borderColor="$color8"
          borderRadius="$6"
          ai="center"
          jc="center"
          shadowColor="$color8"
          shadowOffset={{ width: 6, height: 6 }}
          shadowOpacity={1}
          shadowRadius={0}
        >
          <Icon col="$color11" size={64} strokeWidth={2.5} />
        </Square>
      </YStack>

      {/* Bold, left-aligned title - Gumroad neubrutalism */}
      <YStack
        w="100%"
        maw={460}
        animation="lazy"
        y={0}
        enterStyle={{ y: 10, o: 0 }}
        exitStyle={{ y: -10, o: 0 }}
        o={1}
        pt="$2"
        pb="$1"
      >
        <H1
          size="$10"
          fontWeight="900"
          col="$color12"
          ta="center"
          lh={44}
          letterSpacing={-1}
          selectable={false}
          mb="$4"
          $md={{
            size: '$9',
            lh: 38,
          }}
        >
          {title}
        </H1>
      </YStack>

      {/* Clean description with better spacing */}
      <Paragraph
        maw={420}
        animation="lazy"
        y={0}
        enterStyle={{ y: 10, o: 0 }}
        exitStyle={{ y: -10, o: 0 }}
        o={1}
        size="$5"
        lh="$7"
        ta="center"
        col="$color11"
        fontWeight="500"
        selectable={false}
        px="$4"
        $md={{
          size: '$4',
          lh: '$6',
        }}
      >
        {description}
      </Paragraph>

      {/* Decorative accent line - neubrutalism touch */}
      <XStack
        w={80}
        h={6}
        bg="$color8"
        mt="$6"
        borderRadius="$2"
        animation="lazy"
        scale={1}
        enterStyle={{ scale: 0, o: 0 }}
        exitStyle={{ scale: 0, o: 0 }}
        o={1}
      />
    </YStack>
  )
}
