import { IconProps } from '@tamagui/helpers-icon'
import React from 'react'
import { H2, Paragraph, YStack } from 'tamagui'

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
      ai="center"
      p="$8"
      fullscreen
      mx="auto"
      jc="center"
      animation="100ms"
      exitStyle={{ o: 0 }}
      o={1}
    >
      <YStack
        animation="lazy"
        y={0}
        enterStyle={{ y: -10, o: 0 }}
        exitStyle={{ y: -10, o: 0 }}
        o={1}
      >
        <Icon col="$color9" size={96} />
      </YStack>
      <H2
        mt="$5"
        animation="bouncy"
        y={0}
        enterStyle={{ y: 4, o: 0 }}
        exitStyle={{ y: 4, o: 0 }}
        o={1}
        size="$7"
        col="$color10"
        selectable={false}
        ta="center"
        $md={{
          size: '$7',
          mt: '$4',
          col: '$color10',
        }}
      >
        {title}
      </H2>
      <Paragraph
        mt="$4"
        maw={520}
        mx="auto"
        animation="bouncy"
        y={0}
        enterStyle={{ y: -2, o: 0 }}
        exitStyle={{ y: -2, o: 0 }}
        o={1}
        size="$4"
        lh="$6"
        ta="center"
        col="$color9"
        selectable={false}
        $md={{
          mt: '$3',
          col: '$color9',
        }}
      >
        {description}
      </Paragraph>
    </YStack>
  )
}
