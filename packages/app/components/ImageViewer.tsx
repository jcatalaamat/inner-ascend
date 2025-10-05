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

  // Zoom and pan state
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  // Reset when modal closes
  useEffect(() => {
    if (!isVisible) {
      if (scale && scale.value !== undefined) {
        scale.value = 1
      }
      if (savedScale && savedScale.value !== undefined) {
        savedScale.value = 1
      }
      if (translateX && translateX.value !== undefined) {
        translateX.value = 0
      }
      if (translateY && translateY.value !== undefined) {
        translateY.value = 0
      }
      if (savedTranslateX && savedTranslateX.value !== undefined) {
        savedTranslateX.value = 0
      }
      if (savedTranslateY && savedTranslateY.value !== undefined) {
        savedTranslateY.value = 0
      }
    }
  }, [isVisible])

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      if (scale && savedScale && scale.value !== undefined && savedScale.value !== undefined) {
        scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 3))
      }
    })
    .onEnd(() => {
      if (scale && savedScale && scale.value !== undefined) {
        savedScale.value = scale.value
      }
    })

  // Pan gesture (only when zoomed)
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale && scale.value !== undefined && scale.value > 1) {
        if (translateX && savedTranslateX && translateX.value !== undefined && savedTranslateX.value !== undefined) {
          translateX.value = savedTranslateX.value + e.translationX
        }
        if (translateY && savedTranslateY && translateY.value !== undefined && savedTranslateY.value !== undefined) {
          translateY.value = savedTranslateY.value + e.translationY
        }
      }
    })
    .onEnd(() => {
      if (translateX && savedTranslateX && translateX.value !== undefined) {
        savedTranslateX.value = translateX.value
      }
      if (translateY && savedTranslateY && translateY.value !== undefined) {
        savedTranslateY.value = translateY.value
      }
    })

  // Double tap to zoom
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale && scale.value !== undefined) {
        if (scale.value > 1) {
          if (scale.value !== undefined) scale.value = withSpring(1)
          if (savedScale && savedScale.value !== undefined) savedScale.value = 1
          if (translateX && translateX.value !== undefined) translateX.value = withSpring(0)
          if (translateY && translateY.value !== undefined) translateY.value = withSpring(0)
          if (savedTranslateX && savedTranslateX.value !== undefined) savedTranslateX.value = 0
          if (savedTranslateY && savedTranslateY.value !== undefined) savedTranslateY.value = 0
        } else {
          if (scale.value !== undefined) scale.value = withSpring(2)
          if (savedScale && savedScale.value !== undefined) savedScale.value = 2
        }
      }
    })

  const composed = Gesture.Simultaneous(
    Gesture.Race(doubleTap, pinchGesture),
    panGesture
  )

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX?.value || 0 },
      { translateY: translateY?.value || 0 },
      { scale: scale?.value || 1 },
    ],
  }))

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
        <GestureDetector gesture={composed}>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <Image
              source={{ uri: imageUrl }}
              width={screenWidth}
              height={screenHeight}
              resizeMode="contain"
            />
          </Animated.View>
        </GestureDetector>
      </Pressable>
    </Modal>
  )
}
