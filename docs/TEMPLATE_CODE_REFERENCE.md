# Template Code Reference - Best Practices

This document captures best practices from the original template code (posts/projects features) before removal. These patterns should be followed when building new features.

---

## Table of Contents
1. [SchemaForm Pattern](#schemaform-pattern)
2. [React Query Patterns](#react-query-patterns)
3. [Component Layout Patterns](#component-layout-patterns)
4. [Database Schema Examples](#database-schema-examples)

---

## SchemaForm Pattern

### Overview
The app uses `@ts-react/form` with Zod schemas for type-safe, validated forms. This pattern is demonstrated in `CreatePostForm.tsx` and `CreateProjectForm.tsx`.

### Basic Form Structure

```tsx
import { SchemaForm, formFields } from 'app/utils/SchemaForm'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { useUser } from 'app/utils/useUser'
import { SubmitButton, Theme, YStack, useToastController } from '@my/ui'

// 1. Define Zod Schema
const CreateItemSchema = z.object({
  title: formFields.text.min(10).describe('Name // Your item title'),
  description: formFields.textarea.describe('Description // Item description'),
  category: formFields.select.describe('Category // Choose a category'),
  isPaid: formFields.boolean.describe('Paid Item'),
  imageUrl: formFields.image.describe('Image // Upload an image'),
})

// 2. Create Form Component
export const CreateItemForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { user } = useUser()
  const supabase = useSupabase()
  const toast = useToastController()

  // 3. Set up mutation
  const mutation = useMutation({
    async onError(error) {
      console.error(error)
      toast.show('Error creating item')
    },
    async mutationFn(data: z.infer<typeof CreateItemSchema>) {
      // Handle data submission
      await supabase.from('items').insert({
        title: data.title,
        description: data.description,
        category_id: data.category,
        user_id: user?.id,
      })
    },
    async onSuccess() {
      onSuccess()
    },
  })

  // 4. Render form
  return (
    <SchemaForm
      onSubmit={(values) => mutation.mutate(values)}
      schema={CreateItemSchema}
      defaultValues={{
        title: '',
        description: '',
        category: '',
        isPaid: false,
      }}
      props={{
        category: {
          placeholder: 'Choose a category',
          options: [
            { name: 'Option 1', value: 'opt1' },
            { name: 'Option 2', value: 'opt2' },
          ],
        },
      }}
      renderAfter={({ submit }) => (
        <Theme inverse>
          <SubmitButton onPress={() => submit()}>Create Item</SubmitButton>
        </Theme>
      )}
    >
      {(fields) => (
        <YStack gap="$2" py="$4" minWidth="100%" $gtSm={{ minWidth: 480 }}>
          {Object.values(fields)}
        </YStack>
      )}
    </SchemaForm>
  )
}
```

### Available Form Field Types

From `app/utils/SchemaForm.tsx`:

```tsx
const formFields = {
  text: z.string(),
  textarea: createUniqueFieldSchema(z.string(), 'textarea'),
  number: z.number(),
  boolean: z.boolean(),
  boolean_switch: createUniqueFieldSchema(z.boolean(), 'boolean_switch'),
  boolean_checkbox: createUniqueFieldSchema(z.boolean(), 'boolean_checkbox'),
  select: createUniqueFieldSchema(z.string(), 'select'),
  address: createUniqueFieldSchema(AddressSchema, 'address'),
  date: createUniqueFieldSchema(DateSchema, 'date'),
  image: createUniqueFieldSchema(ImagePickerSchema, 'image'),
}
```

### Image Upload Pattern

Example from `CreatePostForm.tsx`:

```tsx
const uploadImageAndGetUrl = async (imageSource: { fileURL: string; path: string }) => {
  // 1. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('post-images') // Storage bucket name
    .upload(
      `public/${Date.now()}_image${imageSource.path}`, // Unique filename
      await fetch(imageSource.fileURL).then((res) => res.blob())
    )

  if (uploadError) {
    console.log('Upload error:', uploadError)
    throw uploadError
  }

  // 2. Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(uploadData?.path as string)

  return publicUrlData.publicUrl
}

// 3. Use in mutation
const mutation = useMutation({
  async mutationFn(data: z.infer<typeof CreatePostSchema>) {
    const imageUrl = await uploadImageAndGetUrl(
      data.image_url as { fileURL: string; path: string }
    )

    await supabase.from('posts').insert({
      ...data,
      image_url: imageUrl,
    })
  },
})
```

---

## React Query Patterns

### Basic Query Setup

From `usePostQuery.ts`:

```tsx
import { useQuery } from '@tanstack/react-query'
import { useSupabase } from '../supabase/useSupabase'

const getItems = async (supabase) => {
  return supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)
}

function useItemQuery() {
  const supabase = useSupabase()

  const queryFn = async () => {
    return getItems(supabase).then((result) => result.data)
  }

  return useQuery({
    queryKey: ['items'],
    queryFn,
  })
}

export default useItemQuery
```

### Using the Query in Components

```tsx
import useItemQuery from 'app/utils/react-query/useItemQuery'
import { FullscreenSpinner, useToastController } from '@my/ui'
import { useEffect } from 'react'

export const ItemsSection = () => {
  const { data, isPending, isError } = useItemQuery()
  const toast = useToastController()

  useEffect(() => {
    isError && toast.show('Error loading items.')
  }, [isError])

  if (isPending) return <FullscreenSpinner />

  return (
    // Render items
  )
}
```

---

## Component Layout Patterns

### Responsive Grid Layout

From `posts-section.tsx` - showing responsive card grids:

```tsx
import { Stack, XStack, isWeb, validToken } from '@my/ui'
import { Platform } from 'react-native'

// 1. Define responsive widths
const cardWidthMd = validToken(
  Platform.select({
    web: 'calc(33.33% - 12px)', // 3 columns on web
    native: '32%',              // ~3 columns on native
  })
)

// 2. Use in layout
export const ItemsSection = () => {
  const { data } = useItemQuery()

  return (
    <Stack
      maxWidth={1070}
      gap="$3"
      $platform-native={{
        marginBottom: '$0',
        marginLeft: '$1',
        marginRight: '$2.5'
      }}
      justifyContent="flex-start"
      flexWrap="wrap"
      flexDirection={isWeb ? 'row' : 'column'}
      $gtMd={{ gap: '$4' }}
    >
      {data?.map((item, index) => (
        <ItemCard
          key={`${item.title}-${index}`}
          $gtMd={{
            width: cardWidthMd,
            marginBottom: '1%',
            minWidth: '32.333%'
          }}
          $platform-web={{ maxWidth: 300 }}
          $platform-native={{ minWidth: '100%', maxWidth: '100%' }}
          {...item}
        />
      ))}
    </Stack>
  )
}
```

### Section Header Pattern

```tsx
import { XStack, H4, Button, Theme } from '@my/ui'
import { ArrowRight } from '@tamagui/lucide-icons'

<XStack
  paddingHorizontal="$4.5"
  alignItems="center"
  gap="$2"
  justifyContent="space-between"
  marginBottom="$4"
>
  <H4 theme="alt1" fontWeight="400">
    Section Title
  </H4>
  <Theme name="alt2">
    <Button size="$2" chromeless iconAfter={ArrowRight}>
      View All
    </Button>
  </Theme>
</XStack>
```

### Empty State Pattern

```tsx
import { View, Text } from '@my/ui'

{data?.length ? (
  // Render items
) : (
  <View w="100%" px="$4" $gtSm={{ marginBottom: '$4' }}>
    <View
      height={200}
      w="100%"
      alignItems="center"
      justifyContent="center"
      flex={1}
      backgroundColor="$gray1"
      borderRadius="$5"
    >
      <Text>No items found</Text>
    </View>
  </View>
)}
```

### Platform-Specific Styling

```tsx
// Platform detection
import { isWeb } from '@my/ui'
import { Platform } from 'react-native'

// Conditional props
<Component
  $platform-web={{ maxWidth: 300 }}
  $platform-native={{ minWidth: '100%' }}
/>

// Conditional rendering
{isWeb ? <WebComponent /> : <NativeComponent />}

// Platform.select
const value = Platform.select({
  web: 'web-value',
  native: 'native-value',
  ios: 'ios-specific',
  android: 'android-specific',
})
```

---

## Database Schema Examples

### Table Structure Example

From `20240626153522_project.sql`:

```sql
-- Posts table example
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES auth.users(id),
  category_id UUID REFERENCES categories(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Projects table example
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  number_of_days INT,
  paid_project BOOLEAN DEFAULT FALSE,
  street VARCHAR(255),
  us_zip_code VARCHAR(10),
  project_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Migration Best Practices

1. **Always use UUIDs** for primary keys with `uuid_generate_v4()`
2. **Include timestamps** (`created_at`, `updated_at`) on all tables
3. **Use proper foreign keys** with `REFERENCES` for relationships
4. **Set NOT NULL** for required fields
5. **Use VARCHAR** with appropriate limits for strings
6. **Use BOOLEAN** for true/false flags
7. **Use TEXT** for long-form content

### Indexes (Commented Example)

```sql
-- Create indexes for foreign keys and frequently queried fields
CREATE INDEX idx_posts_profile_id ON posts(profile_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
```

### Triggers (Commented Example)

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
```

---

## Summary

These patterns demonstrate:
- ✅ Type-safe form handling with Zod + SchemaForm
- ✅ Image upload workflow with Supabase Storage
- ✅ React Query setup for data fetching
- ✅ Responsive layouts with platform-specific styling
- ✅ Consistent UI patterns (headers, empty states, loading)
- ✅ Database schema best practices

Refer to this document when building new features to maintain consistency across the codebase.
