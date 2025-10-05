import { Dialog, Image, XStack, YStack } from '@my/ui'
import { X } from '@tamagui/lucide-icons'
import { useEffect } from 'react'
import { Modal, Pressable, Dimensions, StyleSheet } from 'react-native'

type ImageViewerProps = {
  imageUrl: string
  isVisible: boolean
  onClose: () => void
}

export const ImageViewer = ({ imageUrl, isVisible, onClose }: ImageViewerProps) => {
  // Early return if not visible to prevent initialization issues
  if (!isVisible) {
    return null
  }

  // Temporarily disable Reanimated to test if this is the source of the error
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
        <Image
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  )
}