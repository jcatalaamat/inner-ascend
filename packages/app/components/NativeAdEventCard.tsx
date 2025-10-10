import { Card, H6, Image, Text, XStack, YStack, Button, Theme, Paragraph } from '@my/ui'
import { Calendar, MapPin } from '@tamagui/lucide-icons'
import { NativeAd, NativeAdView, NativeAsset, NativeAssetType, NativeMediaView } from 'react-native-google-mobile-ads'
import { useTranslation } from 'react-i18next'
import { useState, memo } from 'react'

export type NativeAdEventCardProps = {
  nativeAd: NativeAd
}

const NativeAdEventCardComponent = ({ nativeAd }: NativeAdEventCardProps) => {
  const [hover, setHover] = useState(false)
  const { t } = useTranslation()

  return (
    <NativeAdView nativeAd={nativeAd}>
      <Card
        cursor="pointer"
        gap="$2"
        p="$3"
        borderRadius="$4"
        chromeless={!hover}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        elevation="$2"
        shadowColor="$shadowColor"
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 2 }}
      >
        {/* Media with Overlay Content */}
        {nativeAd.mediaContent && (
          <YStack position="relative" borderRadius="$3" overflow="hidden">
            <NativeMediaView
              style={{
                width: '100%',
                height: 200,
                borderRadius: 12,
              }}
            />

            {/* Gradient Overlay */}
            <YStack
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="60%"
              bg="linear-gradient(180deg, transparent 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.7) 100%)"
              pointerEvents="none"
            />

            {/* "Ad" Badge - Top Left */}
            <YStack position="absolute" top="$2" left="$2" zIndex={10}>
              <XStack bg="rgba(255,165,0,0.9)" px="$2.5" py="$1.5" borderRadius="$3">
                <Text fontSize="$2" color="white" fontWeight="700">
                  {t('common.ad')}
                </Text>
              </XStack>
            </YStack>

            {/* Content Overlay at Bottom */}
            <YStack position="absolute" bottom="$3" left="$3" right="$3" gap="$1.5" zIndex={5}>
              {/* Headline (Title) */}
              <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <H6
                  size="$6"
                  numberOfLines={2}
                  fontWeight="800"
                  color="white"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  {nativeAd.headline}
                </H6>
              </NativeAsset>

              {/* Advertiser Badge */}
              {nativeAd.advertiser && (
                <Theme name="blue">
                  <Button size="$2" px="$3" py="$1.5" borderRadius="$10" disabled als="flex-start" opacity={0.95}>
                    <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                      <Text fontSize="$2" fontWeight="700">
                        {nativeAd.advertiser}
                      </Text>
                    </NativeAsset>
                  </Button>
                </Theme>
              )}

              {/* Store & Price - Single Line */}
              <XStack ai="center" gap="$3" flexWrap="wrap">
                {nativeAd.store && (
                  <XStack ai="center" gap="$1.5" f={1}>
                    <MapPin size={14} color="white" />
                    <NativeAsset assetType={NativeAssetType.STORE}>
                      <Text fontSize="$3" color="white" numberOfLines={1} fontWeight="500" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                        {nativeAd.store}
                      </Text>
                    </NativeAsset>
                  </XStack>
                )}
                {nativeAd.price && (
                  <NativeAsset assetType={NativeAssetType.PRICE}>
                    <Text fontSize="$4" fontWeight="800" color="white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
                      {nativeAd.price}
                    </Text>
                  </NativeAsset>
                )}
              </XStack>
            </YStack>
          </YStack>
        )}

        {/* Content Below Image */}
        <YStack gap="$2.5" pt="$1">
          {/* Body (Description) */}
          {nativeAd.body && (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Paragraph fontSize="$3" color="$color10" numberOfLines={2} opacity={0.8} lineHeight="$2">
                {nativeAd.body}
              </Paragraph>
            </NativeAsset>
          )}

          {/* Call to Action Button */}
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Button size="$3" theme="active" width="100%">
              <Text fontSize="$3" fontWeight="700">
                {nativeAd.callToAction || t('common.learn_more')}
              </Text>
            </Button>
          </NativeAsset>
        </YStack>
      </Card>
    </NativeAdView>
  )
}

export const NativeAdEventCard = memo(NativeAdEventCardComponent)
