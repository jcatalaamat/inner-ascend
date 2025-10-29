# Gumroad Neubrutalism Style Guide for Inner Ascend

## Overview

This style guide documents the Gumroad-inspired neubrutalism design system applied to Inner Ascend. Neubrutalism is characterized by bold, blocky elements, strong borders, hard shadows, and a clean, minimal aesthetic that prioritizes functionality and visual impact.

---

## Core Design Principles

### 1. **Bold & Blocky**
- Thick borders (3-4px minimum)
- Hard shadows with no blur (`shadowRadius={0}`)
- Sharp, defined corners (moderate border radius: `$3` to `$6`)
- Strong visual hierarchy through weight, not subtlety

### 2. **Minimal & Clean**
- Reduced decorative elements
- Simple geometric shapes (squares, rectangles)
- Ample whitespace
- Focus on content and functionality

### 3. **High Contrast**
- Dark backgrounds with light text
- Bold accent colors that pop
- No gradients (use solid colors)
- Clear visual separation between elements

### 4. **Functional Animation**
- Press-down effects (button moves down, shadow disappears)
- Simple scale/fade transitions
- No complex or decorative animations
- Responsive feedback that feels tactile

---

## Color System

### Cosmic Palette (from token-colors.ts)

```typescript
// Primary Colors
deepSpace1: '#0A0A0F'      // Almost black, main backgrounds
deepSpace2: '#121218'      // Card backgrounds
deepSpace3: '#1A1A24'      // Elevated surfaces

// Brand Colors
cosmicViolet: '#8B7BF7'         // Primary brand
cosmicVioletHover: '#6B5BD6'    // Hover/active states
cosmicVioletLight: '#A99BFF'    // Highlights

// Text Colors
silverMoon: '#E8E6F0'       // Primary text (high contrast)
silverMoon2: '#B8B5C8'      // Secondary text
silverMoon3: '#6E6B7D'      // Tertiary/disabled text

// Shadow Colors
shadowPurple: '#2D1B3D'     // Deep purple-black shadows
shadowPurple2: '#1F1428'    // Darker shadow elements

// Accent Colors
integrationGreen: '#4ECDC4'      // Success/completed
integrationGreenDark: '#3DA69E'  // Achievement glow
innerChildGold: '#FFD93D'        // Achievements/streaks
innerChildGoldDark: '#E8C547'    // Streak highlights
```

### Theme Colors
- **Purple Theme**: Spiritual, transformation, shadow work
- **Blue Theme**: Calm, meditation, practices
- **Yellow/Gold Theme**: Achievement, progress, wisdom

---

## Typography

### Font Weights
```typescript
// Headings
fontWeight="900"  // Extra bold for H1, primary CTAs
fontWeight="800"  // Bold for H2, important buttons
fontWeight="700"  // Semi-bold for H3, secondary buttons
fontWeight="600"  // Medium for labels, skip buttons
fontWeight="500"  // Regular body text with presence
```

### Sizes & Line Heights
```typescript
// Headings
H1: size="$10" (mobile: "$9"), lh={44} (mobile: 38)
H2: size="$8", lh="$7"
H3: size="$6", lh="$5"

// Body Text
Large: size="$5", lh="$7"
Regular: size="$4", lh="$6"
Small: size="$3", lh="$4"
```

### Letter Spacing
```typescript
letterSpacing={-1}    // Tight for large headings
letterSpacing={-0.5}  // Tight for buttons/CTAs
letterSpacing={0}     // Normal for body text
```

---

## Component Patterns

### Buttons

#### Primary CTA (Main Action Button)
```tsx
<Button
  size="$5"
  br="$4"
  bg="$color10"              // Strong color
  col="$color1"              // High contrast text
  fontWeight="800"
  letterSpacing={-0.5}
  borderWidth={4}
  borderColor="$color11"
  shadowColor="$color11"
  shadowOffset={{ width: 0, height: 4 }}
  shadowOpacity={1}
  shadowRadius={0}           // Hard shadow (no blur)
  pressStyle={{
    bg: '$color9',
    y: 4,                    // Move down on press
    shadowOffset: { width: 0, height: 0 }  // Shadow disappears
  }}
>
  Start My Journey
</Button>
```

#### Secondary Button
```tsx
<Button
  size="$5"
  br="$4"
  bg="$color5"
  borderWidth={3}
  borderColor="$color8"
  pressStyle={{
    bg: '$color6',
    y: 2,
  }}
>
  Back
</Button>
```

#### Chromeless/Ghost Button
```tsx
<Button
  size="$4"
  chromeless
  col="$color10"
  fontWeight="600"
  pressStyle={{
    bg: '$color5',
    scale: 0.96,
  }}
  br="$3"
>
  Skip
</Button>
```

### Cards

#### Elevated Card with Border
```tsx
<YStack
  bg="$color3"
  borderWidth={3}
  borderColor="$color7"
  br="$5"
  p="$5"
  shadowColor="$color8"
  shadowOffset={{ width: 4, height: 4 }}
  shadowOpacity={1}
  shadowRadius={0}
>
  {/* Card content */}
</YStack>
```

#### Flat Content Card
```tsx
<YStack
  bg="$color2"
  br="$4"
  p="$6"
  borderWidth={2}
  borderColor="$color5"
>
  {/* Card content */}
</YStack>
```

### Icon Containers

#### Bold Geometric Icon Container (Onboarding Style)
```tsx
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
```

#### Smaller Icon Badge
```tsx
<Circle
  size={56}
  bg="$color4"
  borderWidth={3}
  borderColor="$color7"
  ai="center"
  jc="center"
>
  <Icon col="$color10" size={28} strokeWidth={2.5} />
</Circle>
```

### Progress Indicators

#### Progress Dots (Onboarding)
```tsx
<XStack gap={12} jc="center">
  {dots.map((_, idx) => (
    <YStack
      key={idx}
      br="$2"                        // Blocky, not fully rounded
      w={active ? 40 : 12}
      h={12}
      bg={active ? '$color10' : '$color6'}
      borderWidth={active ? 3 : 0}
      borderColor="$color11"
      animation="quick"
      pressStyle={{ scale: 0.9 }}
    />
  ))}
</XStack>
```

#### Progress Bar
```tsx
<YStack w="100%" h={12} bg="$color4" br="$2" borderWidth={2} borderColor="$color6">
  <YStack
    h="100%"
    w={`${progress}%`}
    bg="$color10"
    br="$2"
    borderRightWidth={progress < 100 ? 2 : 0}
    borderColor="$color11"
  />
</YStack>
```

### Input Fields

#### Text Input (Gumroad Style)
```tsx
<Input
  size="$5"
  br="$3"
  borderWidth={3}
  borderColor="$color7"
  bg="$color3"
  col="$color11"
  fontWeight="500"
  focusStyle={{
    borderColor: '$color10',
    borderWidth: 4,
  }}
  placeholderTextColor="$color8"
/>
```

### Lists & Items

#### List Item with Border
```tsx
<XStack
  p="$4"
  bg="$color2"
  borderWidth={2}
  borderColor="$color6"
  br="$3"
  mb="$3"
  pressStyle={{
    bg: '$color3',
    borderColor: '$color7',
  }}
>
  {/* List item content */}
</XStack>
```

### Tags/Badges

#### Tag Pill
```tsx
<XStack
  px="$3"
  py="$2"
  bg="$color5"
  br="$2"
  borderWidth={2}
  borderColor="$color7"
>
  <Text size="$2" fontWeight="700" col="$color10">
    SHADOW WORK
  </Text>
</XStack>
```

---

## Layout Patterns

### Screen Container
```tsx
<YStack
  f={1}
  bg="$color1"           // Deep space background
  px="$6"                // Generous padding
  py="$5"
>
  {/* Screen content */}
</YStack>
```

### Content Section
```tsx
<YStack
  gap="$4"               // Consistent spacing
  mb="$6"
>
  <H2>Section Title</H2>
  {/* Section content */}
</YStack>
```

### Grid Layout
```tsx
<XStack fw="wrap" gap="$4">
  <YStack f={1} minWidth={150}>
    {/* Grid item */}
  </YStack>
  {/* More grid items */}
</XStack>
```

---

## Animation Guidelines

### Entrance Animations
```tsx
enterStyle={{
  o: 0,
  x: 20,      // Slide from right
  scale: 0.95
}}
o={1}
x={0}
scale={1}
animation="lazy"  // Use "lazy" for smooth transitions
```

### Exit Animations
```tsx
exitStyle={{
  o: 0,
  x: -20,     // Slide to left
  scale: 0.95
}}
```

### Press Animations
```tsx
pressStyle={{
  scale: 0.96,        // Subtle scale down
  y: 2,              // Move down slightly
  bg: '$color6',     // Darken background
}}
```

### Hover (Web Only)
```tsx
hoverStyle={{
  bg: '$color6',
  borderColor: '$color9',
}}
```

---

## Spacing Scale

Use Tamagui's spacing tokens consistently:

```
$1  = 4px   - Minimal spacing
$2  = 8px   - Tight spacing
$3  = 12px  - Small spacing
$4  = 16px  - Default spacing
$5  = 20px  - Medium spacing
$6  = 24px  - Large spacing
$7  = 28px  - Extra large spacing
$8  = 32px  - Section spacing
$9  = 36px  - Major section spacing
$10 = 40px  - Screen margin spacing
```

---

## Border Radius Scale

```
$2  = 4px   - Subtle rounding (tags, pills)
$3  = 8px   - Small elements (inputs, small buttons)
$4  = 12px  - Medium elements (buttons, cards)
$5  = 16px  - Large cards
$6  = 20px  - Extra large containers (icon boxes)
```

---

## Shadow Patterns

### Hard Drop Shadow (Signature Neubrutalism)
```tsx
shadowColor="$color8"
shadowOffset={{ width: 6, height: 6 }}
shadowOpacity={1}
shadowRadius={0}  // No blur = hard shadow
```

### Subtle Hard Shadow
```tsx
shadowColor="$color7"
shadowOffset={{ width: 4, height: 4 }}
shadowOpacity={1}
shadowRadius={0}
```

### Press State (Shadow Disappears)
```tsx
pressStyle={{
  y: 4,  // Move down by shadow offset
  shadowOffset: { width: 0, height: 0 }
}}
```

---

## Icon Guidelines

### Sizing
- **Extra Large**: 64-96px (onboarding, empty states)
- **Large**: 48px (feature icons)
- **Medium**: 32px (list icons)
- **Small**: 20-24px (inline icons, buttons)

### Stroke Width
- **Bold**: `strokeWidth={2.5}` - Primary icons
- **Regular**: `strokeWidth={2}` - Standard icons
- **Light**: `strokeWidth={1.5}` - Decorative icons

### Colors
```tsx
// Primary icons
col="$color11"  // High contrast

// Secondary icons
col="$color9"   // Medium contrast

// Disabled icons
col="$color7"   // Low contrast
```

---

## Real-World Examples from Inner Ascend

### Onboarding Screen
```tsx
<YStack
  f={1}
  jc="center"
  ai="center"
  px="$6"
  py="$8"
>
  {/* Icon container */}
  <Square
    size={120}
    bg="$color5"
    borderWidth={4}
    borderColor="$color8"
    borderRadius="$6"
    shadowColor="$color8"
    shadowOffset={{ width: 6, height: 6 }}
    shadowOpacity={1}
    shadowRadius={0}
  >
    <Icon col="$color11" size={64} strokeWidth={2.5} />
  </Square>

  {/* Title */}
  <H1
    size="$10"
    fontWeight="900"
    col="$color12"
    ta="center"
    lh={44}
    letterSpacing={-1}
    mt="$6"
    mb="$4"
  >
    Your Spiritual Journey Companion
  </H1>

  {/* Description */}
  <Paragraph
    size="$5"
    lh="$7"
    ta="center"
    col="$color11"
    fontWeight="500"
    maw={420}
  >
    A student manual for the soul.
  </Paragraph>

  {/* Accent line */}
  <XStack
    w={80}
    h={6}
    bg="$color8"
    mt="$6"
    borderRadius="$2"
  />
</YStack>
```

### Module Card
```tsx
<YStack
  bg="$color3"
  p="$5"
  br="$5"
  borderWidth={3}
  borderColor="$color7"
  shadowColor="$color8"
  shadowOffset={{ width: 4, height: 4 }}
  shadowOpacity={1}
  shadowRadius={0}
  pressStyle={{
    y: 4,
    shadowOffset: { width: 0, height: 0 },
    bg: '$color4',
  }}
>
  {/* Module icon */}
  <Circle
    size={56}
    bg="$color5"
    borderWidth={3}
    borderColor="cosmicViolet"
    mb="$4"
  >
    <BookOpen size={28} color="$cosmicViolet" strokeWidth={2.5} />
  </Circle>

  {/* Module title */}
  <H3
    fontWeight="800"
    col="$color12"
    mb="$2"
  >
    Module 1: Self-Awareness
  </H3>

  {/* Module description */}
  <Paragraph
    size="$3"
    col="$color10"
    lh="$4"
  >
    Begin your journey with foundational concepts
  </Paragraph>
</YStack>
```

---

## Do's and Don'ts

### ✅ DO

- Use hard shadows (shadowRadius={0})
- Apply bold borders (3-4px)
- Use extra bold typography (800-900 weight)
- Keep animations simple and functional
- Maintain high contrast
- Use blocky, geometric shapes
- Apply press-down effects on interactive elements
- Leave generous whitespace
- Use solid colors (no gradients)

### ❌ DON'T

- Use soft shadows or blur
- Use thin borders (<2px)
- Use light font weights (<600) for headings
- Add decorative or complex animations
- Use low-contrast color combinations
- Use overly rounded corners (avoid circles for containers)
- Use hover effects without press feedback
- Crowd elements together
- Mix gradients with neubrutalism

---

## Future Implementation Ideas

### 1. **Streak Calendar**
```tsx
// Bold grid of days with hard shadows
<XStack fw="wrap" gap="$2">
  {days.map(day => (
    <Square
      size={40}
      bg={day.completed ? '$integrationGreen' : '$color4'}
      borderWidth={3}
      borderColor={day.completed ? '$integrationGreenDark' : '$color6'}
      br="$2"
    >
      <Text fontWeight="800" col={day.completed ? '$color1' : '$color9'}>
        {day.number}
      </Text>
    </Square>
  ))}
</XStack>
```

### 2. **Achievement Badges**
```tsx
<YStack
  bg="$innerChildGold"
  p="$4"
  br="$4"
  borderWidth={4}
  borderColor="$innerChildGoldDark"
  shadowColor="$innerChildGoldDark"
  shadowOffset={{ width: 6, height: 6 }}
  shadowOpacity={1}
  shadowRadius={0}
>
  <Trophy size={48} strokeWidth={2.5} />
  <Text fontWeight="900" fontSize={24} col="$deepSpace1">
    7 Day Streak!
  </Text>
</YStack>
```

### 3. **Practice Timer**
```tsx
<YStack ai="center" gap="$5">
  {/* Large time display */}
  <Text
    fontSize={96}
    fontWeight="900"
    col="$color12"
    letterSpacing={-4}
  >
    05:00
  </Text>

  {/* Bold control buttons */}
  <XStack gap="$4">
    <Button
      size="$6"
      circular
      bg="$integrationGreen"
      borderWidth={4}
      borderColor="$integrationGreenDark"
      icon={Play}
    />
  </XStack>
</YStack>
```

### 4. **Journal Entry Card**
```tsx
<YStack
  bg="$color2"
  p="$5"
  br="$4"
  borderWidth={2}
  borderLeftWidth={6}
  borderColor="$color6"
  borderLeftColor="$cosmicViolet"
>
  <XStack jc="space-between" mb="$3">
    <Text fontWeight="800" col="$color12">
      Today's Reflection
    </Text>
    <Text fontWeight="600" col="$color9" size="$3">
      Oct 29, 2025
    </Text>
  </XStack>

  <Paragraph col="$color11" lh="$6">
    Journal entry content...
  </Paragraph>
</YStack>
```

### 5. **Tab Navigation**
```tsx
<XStack gap="$2" p="$2" bg="$color2" br="$4">
  {tabs.map(tab => (
    <Button
      key={tab.id}
      f={1}
      size="$4"
      bg={tab.active ? '$color10' : 'transparent'}
      col={tab.active ? '$color1' : '$color9'}
      fontWeight="700"
      borderWidth={tab.active ? 3 : 0}
      borderColor="$color11"
      br="$3"
      pressStyle={{
        bg: '$color5',
      }}
    >
      {tab.label}
    </Button>
  ))}
</XStack>
```

### 6. **Stats Dashboard**
```tsx
<XStack fw="wrap" gap="$4">
  {stats.map(stat => (
    <YStack
      f={1}
      minWidth={150}
      bg="$color3"
      p="$5"
      br="$4"
      borderWidth={3}
      borderColor="$color7"
      ai="center"
    >
      <Text fontSize={48} fontWeight="900" col="$cosmicViolet">
        {stat.value}
      </Text>
      <Text fontWeight="700" col="$color10" size="$3">
        {stat.label}
      </Text>
    </YStack>
  ))}
</XStack>
```

---

## Resources

- **Gumroad Website**: https://gumroad.com (reference for design patterns)
- **Neubrutalism Examples**: https://brutalistwebsites.com
- **Tamagui Docs**: https://tamagui.dev
- **Color Palette Tool**: https://coolors.co

---

## Changelog

- **2025-10-29**: Initial style guide created based on onboarding screen rebrand
- Applied to: OnboardingStepContent, Onboarding, OnboardingControls components
- Core cosmic color palette established
- Button patterns documented
- Future implementation ideas added

---

**Note**: This is a living document. Update it as new patterns emerge and the design system evolves.
