import { Dialog, Image, XStack, YStack } from '@my/ui'
import { X } from '@tamagui/lucide-icons'
import { useEffect } from 'react'
import { Modal, Pressable, Dimensions, StyleSheet } from 'react-native'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'

type ImageViewerProps = {
  imageUrl: string
  isVisible: boolean
  onClose: () => void
}

export const ImageViewer = ({ imageUrl, isVisible, onClose }: ImageViewerProps) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        {/* Close Button */}
        <XStack position="absolute" top="$4" right="$4" zIndex={10}>
          <Pressable
            onPress={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <X size={24} color="white" />
          </Pressable>
        </XStack>

        {/* Image */}
        <Image
          source={{ uri: imageUrl }}
          width={screenWidth}
          height={screenHeight}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  )
}
