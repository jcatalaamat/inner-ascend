import { Card, H6, Image, Text, XStack, YStack, Button, Theme, Paragraph } from '@my/ui'
import { MapPin, Star } from '@tamagui/lucide-icons'
import { NativeAd, NativeAdView, NativeAsset, NativeAssetType, NativeMediaView } from 'react-native-google-mobile-ads'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export type NativeAdPlaceCardProps = {
  nativeAd: NativeAd
}

export const NativeAdPlaceCard = ({ nativeAd }: NativeAdPlaceCardProps) => {
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
      >
        {/* Media (Image or Video) */}
        {nativeAd.mediaContent && (
          <YStack position="relative">
            <NativeMediaView
              style={{
                width: '100%',
                height: 140,
                borderRadius: 12,
              }}
            />

            {/* "Ad" Badge */}
            <YStack position="absolute" top="$2" left="$2" zIndex={10}>
              <XStack bg="rgba(0,0,0,0.6)" px="$2" py="$1" borderRadius="$2">
                <Text fontSize="$1" color="white" fontWeight="600">
                  {t('common.ad')}
                </Text>
              </XStack>
            </YStack>
          </YStack>
        )}

        <YStack gap="$2">
          {/* Title and Star Rating */}
          <XStack jc="space-between" ai="flex-start" gap="$2">
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <H6 size="$4" f={1} numberOfLines={2}>
                {nativeAd.headline}
              </H6>
            </NativeAsset>
            {nativeAd.starRating && (
              <XStack ai="center" gap="$1">
                <NativeAsset assetType={NativeAssetType.STAR_RATING}>
                  <XStack ai="center" gap="$1" bg="$blue3" px="$2" py="$1" borderRadius="$2">
                    <Star size={12} color="$blue10" />
                    <Text fontSize="$1" color="$blue11" fontWeight="600">
                      {nativeAd.starRating.toFixed(1)}
                    </Text>
                  </XStack>
                </NativeAsset>
              </XStack>
            )}
          </XStack>

          {/* Type Badge - use advertiser as type */}
          {nativeAd.advertiser && (
            <Theme name="green">
              <Button size="$2" px="$3" py="$1" borderRadius="$10" disabled als="flex-start">
                <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                  <Text fontSize="$2" tt="capitalize" fontWeight="600">
                    {nativeAd.advertiser}
                  </Text>
                </NativeAsset>
              </Button>
            </Theme>
          )}

          {/* Store (Location) */}
          {nativeAd.store && (
            <XStack ai="center" gap="$2">
              <MapPin size={14} color="$color10" />
              <NativeAsset assetType={NativeAssetType.STORE}>
                <Text fontSize="$3" color="$color11" numberOfLines={1}>
                  {nativeAd.store}
                </Text>
              </NativeAsset>
            </XStack>
          )}

          {/* Price Range */}
          {nativeAd.price && (
            <NativeAsset assetType={NativeAssetType.PRICE}>
              <Text fontSize="$3" fontWeight="600" color="$color12">
                {nativeAd.price}
              </Text>
            </NativeAsset>
          )}

          {/* Body (Description) */}
          {nativeAd.body && (
            <NativeAsset assetType={NativeAssetType.BODY}>
              <Paragraph fontSize="$3" color="$color10" numberOfLines={3} opacity={0.8}>
                {nativeAd.body}
              </Paragraph>
            </NativeAsset>
          )}

          {/* Call to Action Button */}
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <Button size="$3" theme="active" width="100%">
              <Text fontSize="$3" fontWeight="600">
                {nativeAd.callToAction || t('common.learn_more')}
              </Text>
            </Button>
          </NativeAsset>
        </YStack>
      </Card>
    </NativeAdView>
  )
}
