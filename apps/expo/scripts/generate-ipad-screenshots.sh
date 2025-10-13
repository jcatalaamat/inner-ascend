#!/bin/bash

# Generate iPad screenshots from iPhone screenshots
# iPad Pro 13-inch required dimensions: 2064 x 2752 (portrait)

echo "🎨 Generating iPad screenshots from iPhone screenshots..."

SCREENSHOTS_DIR="./fastlane/screenshots"
LOCALES=("en-US" "en-GB" "es-MX" "es-ES")

# iPad Pro 13-inch dimensions (portrait)
IPAD_WIDTH=2064
IPAD_HEIGHT=2752

for locale in "${LOCALES[@]}"; do
  echo ""
  echo "📍 Processing locale: $locale"

  SOURCE_DIR="$SCREENSHOTS_DIR/$locale"

  if [ ! -d "$SOURCE_DIR" ]; then
    echo "⚠️  Directory not found: $SOURCE_DIR"
    continue
  fi

  # Process each screenshot
  for screenshot in "$SOURCE_DIR"/*.png; do
    if [ ! -f "$screenshot" ]; then
      continue
    fi

    filename=$(basename "$screenshot")

    # Get original dimensions
    original_width=$(sips -g pixelWidth "$screenshot" | awk '/pixelWidth:/ {print $2}')
    original_height=$(sips -g pixelHeight "$screenshot" | awk '/pixelHeight:/ {print $2}')

    echo "  📱 Processing: $filename ($original_width x $original_height)"

    # Check if it's an iPhone screenshot
    if [ "$original_width" -eq 1290 ] && [ "$original_height" -eq 2796 ]; then
      # Create iPad version
      # Strategy: Scale to fit within iPad dimensions, then add padding

      # Calculate scale to fit (maintain aspect ratio)
      scale_width=$(echo "scale=4; $IPAD_WIDTH / $original_width" | bc)
      scale_height=$(echo "scale=4; $IPAD_HEIGHT / $original_height" | bc)

      # Use the smaller scale to ensure it fits
      if (( $(echo "$scale_width < $scale_height" | bc -l) )); then
        scale=$scale_width
      else
        scale=$scale_height
      fi

      # Calculate new dimensions
      new_width=$(echo "scale=0; $original_width * $scale / 1" | bc)
      new_height=$(echo "scale=0; $original_height * $scale / 1" | bc)

      # Create temporary scaled image
      temp_scaled="${screenshot%.png}_temp_scaled.png"
      sips -z $new_height $new_width "$screenshot" --out "$temp_scaled" > /dev/null 2>&1

      # Create iPad-sized canvas with padding (centered)
      # Use ImageMagick's convert if available, otherwise use sips with padding
      ipad_filename="${filename%.png}_iPad_Pro_13inch.png"
      ipad_output="$SOURCE_DIR/$ipad_filename"

      # Create canvas and center the image
      # Using sips padding (adds white borders to reach target size)
      x_offset=$(( ($IPAD_WIDTH - $new_width) / 2 ))
      y_offset=$(( ($IPAD_HEIGHT - $new_height) / 2 ))

      # Create white canvas and overlay scaled image
      sips -s format png --resampleHeightWidthMax $IPAD_HEIGHT "$temp_scaled" \
           --padToHeightWidth $IPAD_HEIGHT $IPAD_WIDTH \
           --out "$ipad_output" > /dev/null 2>&1

      # Clean up temp file
      rm "$temp_scaled"

      echo "    ✅ Created: $ipad_filename (${IPAD_WIDTH} x ${IPAD_HEIGHT})"
    else
      echo "    ⏭️  Skipped (not iPhone 16 Pro Max dimensions)"
    fi
  done
done

echo ""
echo "✨ Done! iPad screenshots created for all locales."
echo ""
echo "📂 Screenshot folders:"
for locale in "${LOCALES[@]}"; do
  ipad_count=$(ls "$SCREENSHOTS_DIR/$locale"/*iPad*.png 2>/dev/null | wc -l | tr -d ' ')
  echo "  $locale: $ipad_count iPad screenshots"
done

echo ""
echo "🚀 Run 'yarn fastlane:upload:screenshots' to upload all screenshots"
