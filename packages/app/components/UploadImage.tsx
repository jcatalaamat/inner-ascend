import { YStack, Image, Text, Button } from '@my/ui'
import { Upload, X } from '@tamagui/lucide-icons'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { decode } from 'base64-arraybuffer'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'

type UploadImageProps = {
  bucketName: 'event-images' | 'place-images'
  onUploadComplete?: (url: string) => void
  initialImageUrl?: string | null
  aspectRatio?: [number, number]
}

export const UploadImage = ({
  bucketName,
  onUploadComplete,
  initialImageUrl,
  aspectRatio = [16, 9],
}: UploadImageProps) => {
  const supabase = useSupabase()
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const [uploading, setUploading] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled) {
      await uploadImage(result)
    }
  }

  const uploadImage = async (pickerResult: ImagePicker.ImagePickerResult) => {
    try {
      setUploading(true)
      const image = pickerResult.assets[0]
      if (!image?.base64) {
        throw new Error('No image provided.')
      }

      const base64Str = image.base64.includes('base64,')
        ? image.base64.substring(image.base64.indexOf('base64,') + 'base64,'.length)
        : image.base64

      const arrayBuffer = decode(base64Str)

      if (!(arrayBuffer.byteLength > 0)) {
        throw new Error('Invalid image data')
      }

      const fileName = `${Date.now()}.jpeg`
      const result = await supabase.storage
        .from(bucketName)
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        })

      if (result.error) {
        throw new Error(result.error.message)
      }

      const publicUrlRes = supabase.storage
        .from(bucketName)
        .getPublicUrl(result.data.path)

      const publicUrl = publicUrlRes.data.publicUrl
      setImageUrl(publicUrl)
      onUploadComplete?.(publicUrl)
    } catch (e) {
      console.error('Upload failed:', e)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageUrl(null)
    onUploadComplete?.('')
  }

  return (
    <YStack gap="$2" width="100%">
      {imageUrl ? (
        <YStack position="relative" width="100%" height={200} borderRadius="$4" overflow="hidden">
          <Image
            source={{ uri: imageUrl }}
            width="100%"
            height={200}
            resizeMode="cover"
          />
          <YStack position="absolute" top="$2" right="$2" zIndex={10}>
            <Button
              size="$3"
              circular
              icon={X}
              onPress={removeImage}
              backgroundColor="$red10"
              color="white"
            />
          </YStack>
        </YStack>
      ) : (
        <YStack
          width="100%"
          height={200}
          borderRadius="$4"
          borderWidth={2}
          borderStyle="dashed"
          borderColor="$borderColor"
          backgroundColor="$color3"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          onPress={pickImage}
          disabled={uploading}
        >
          <Upload size={40} color="$color10" />
          <Text color="$color11" marginTop="$2">
            {uploading ? 'Uploading...' : 'Tap to upload image'}
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
