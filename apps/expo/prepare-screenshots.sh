#!/bin/bash

# Screenshot Preparation Script for Mazunte Connect
# This script helps organize screenshots for App Store submission

set -e

echo "📸 Mazunte Connect Screenshot Organizer"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create screenshot directories
echo -e "${BLUE}Creating screenshot directories...${NC}"
mkdir -p fastlane/screenshots/en-US
mkdir -p fastlane/screenshots/es-MX

echo -e "${GREEN}✓${NC} Directories created:"
echo "  - fastlane/screenshots/en-US/"
echo "  - fastlane/screenshots/es-MX/"
echo ""

# Check if screenshots exist on Desktop
DESKTOP_SCREENSHOTS=$(find ~/Desktop -name "Simulator Screen Shot*.png" 2>/dev/null | wc -l | tr -d ' ')

if [ "$DESKTOP_SCREENSHOTS" -gt 0 ]; then
    echo -e "${YELLOW}Found $DESKTOP_SCREENSHOTS screenshot(s) on Desktop${NC}"
    echo ""
    echo "Would you like to:"
    echo "1. Organize English screenshots"
    echo "2. Organize Spanish screenshots"
    echo "3. Skip and do manually"
    echo ""
    read -p "Enter choice (1-3): " choice

    case $choice in
        1)
            echo -e "${BLUE}Organizing English screenshots...${NC}"
            echo "Rename files to:"
            echo "  1_home_screen.png"
            echo "  2_event_detail.png"
            echo "  3_places_list.png"
            echo "  4_map_view.png"
            echo "  5_create_event.png"
            echo ""
            echo "Move files from Desktop to: fastlane/screenshots/en-US/"
            ;;
        2)
            echo -e "${BLUE}Organizing Spanish screenshots...${NC}"
            echo "Rename files to:"
            echo "  1_pantalla_inicio.png"
            echo "  2_detalle_evento.png"
            echo "  3_lista_lugares.png"
            echo "  4_vista_mapa.png"
            echo "  5_crear_evento.png"
            echo ""
            echo "Move files from Desktop to: fastlane/screenshots/es-MX/"
            ;;
        3)
            echo "Skipping automatic organization"
            ;;
    esac
else
    echo -e "${YELLOW}No screenshots found on Desktop${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Run the app on simulator:"
    echo "   ${GREEN}yarn ios --simulator \"iPhone 14 Pro Max\"${NC}"
    echo ""
    echo "2. Take screenshots (⌘ + S) of:"
    echo "   • Home screen with events"
    echo "   • Event detail page"
    echo "   • Places list"
    echo "   • Map view"
    echo "   • Create event screen"
    echo ""
    echo "3. Change language to Spanish and repeat"
    echo ""
    echo "4. Run this script again to organize screenshots"
fi

echo ""
echo -e "${BLUE}Screenshot Requirements:${NC}"
echo "  Device: iPhone 14 Pro Max (6.7\")"
echo "  Size: 1284 × 2778 pixels"
echo "  Format: PNG"
echo "  Minimum: 5 screenshots"
echo "  Maximum: 10 screenshots"
echo ""

# Check current screenshots
EN_COUNT=$(find fastlane/screenshots/en-US -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
ES_COUNT=$(find fastlane/screenshots/es-MX -name "*.png" 2>/dev/null | wc -l | tr -d ' ')

echo -e "${BLUE}Current Status:${NC}"
echo "  English screenshots: $EN_COUNT"
echo "  Spanish screenshots: $ES_COUNT"
echo ""

if [ "$EN_COUNT" -ge 5 ] && [ "$ES_COUNT" -ge 5 ]; then
    echo -e "${GREEN}✓ You have enough screenshots to proceed!${NC}"
    echo ""
    echo "Next step: Upload screenshots"
    echo "  ${GREEN}yarn fastlane:upload:screenshots${NC}"
elif [ "$EN_COUNT" -gt 0 ] || [ "$ES_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠ You need at least 5 screenshots in each language${NC}"
    echo "  English: Need $((5 - EN_COUNT)) more"
    echo "  Spanish: Need $((5 - ES_COUNT)) more"
else
    echo -e "${YELLOW}⚠ No screenshots found yet${NC}"
    echo ""
    echo "Run the app and start capturing screenshots!"
fi

echo ""
echo "For detailed instructions, see: ../../SCREENSHOT_GUIDE.md"
echo ""
