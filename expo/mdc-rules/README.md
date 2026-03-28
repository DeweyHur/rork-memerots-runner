# MDC Rules for React Native Development

This directory contains Model-Driven Change (MDC) rules for React Native development, including fixing deprecated properties and creating/modifying TypeScript/TSX classes.

## Rules

### shadow-properties.json
Automatically converts deprecated `shadow*` properties to modern `boxShadow` CSS property.

**What it fixes:**
- `shadowColor`
- `shadowOffset` 
- `shadowOpacity`
- `shadowRadius`

**What it converts to:**
- `boxShadow` (modern CSS property)

### class-modification.json
Rules for modifying existing classes in TypeScript/TSX files.

**Features:**
- Add TypeScript interfaces to existing classes
- Convert function components to class components
- Add constructors and lifecycle methods
- Add error boundary functionality
- Add common method templates

### class-creation.json
Templates for creating new classes with different patterns.

**Available templates:**
- `@create-component` - React component class
- `@create-service` - Service class with singleton pattern
- `@create-hook` - Custom React hook
- `@create-context` - React context with provider
- `@create-utility` - Utility class with static methods
- `@create-model` - Data model class
- `@create-error-boundary` - Error boundary component

## Usage

### With MDC Tools

1. Install an MDC-compatible tool (like `@modelcontextprotocol/sdk`)
2. Run the rules on your codebase:

```bash
# Fix shadow properties
mdc apply shadow-properties.json --path ./src

# Modify existing classes
mdc apply class-modification.json --path ./src

# Create new classes from templates
mdc apply class-creation.json --path ./src
```

### Manual Application

#### Shadow Properties
**Pattern 1 (Standard shadows):**
```
shadowColor: ['"]([^'"]+)['"],
shadowOffset: { width: ([^,]+), height: ([^}]+) },
shadowOpacity: ([^,]+),
shadowRadius: ([^,]+)
```

**Replacement:**
```
boxShadow: '${4}px ${5}px ${6}px rgba(0, 0, 0, ${7})'
```

#### Class Creation Templates
Add these comments to your files to trigger class creation:

```typescript
// @create-component UserProfile
// @create-service ApiService
// @create-hook useUserData
// @create-context UserContext
// @create-utility StringUtils
// @create-model User
// @create-error-boundary AppErrorBoundary
```

## Examples

### Shadow Properties
**Before:**
```javascript
const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});
```

**After:**
```javascript
const styles = StyleSheet.create({
  container: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  }
});
```

### Class Creation
**Before:**
```typescript
// @create-component UserProfile
```

**After:**
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface UserProfileProps {
  // Add your props here
}

interface UserProfileState {
  // Add your state properties here
}

export default class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.state = {
      // Initialize your state here
    };
  }

  componentDidMount(): void {
    // Add initialization logic here
  }

  componentWillUnmount(): void {
    // Add cleanup logic here
  }

  render(): React.ReactElement {
    return (
      <View style={styles.container}>
        {/* Add your JSX here */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // Add your styles here
  },
});
```

## Benefits

1. **Modern Standards**: Uses modern CSS `boxShadow` property
2. **Better Web Support**: Works better on web platforms
3. **Cross-Platform**: Consistent behavior across platforms
4. **Future-Proof**: Avoids deprecated React Native APIs
5. **Productivity**: Automates common class creation patterns
6. **Type Safety**: Generates proper TypeScript interfaces
7. **Consistency**: Ensures consistent code patterns across the team

## Validation

After applying the rules, verify:
- [ ] Box shadow values are properly formatted
- [ ] Color values are preserved correctly
- [ ] Visual appearance matches original design
- [ ] No console warnings about deprecated properties
- [ ] All necessary imports are included
- [ ] TypeScript interfaces are properly defined
- [ ] Class methods have proper return types
- [ ] Error boundaries handle errors correctly

## Notes

- The `elevation` property is preserved for Android compatibility
- Test visual appearance on all target platforms
- Consider platform-specific styling if needed
- The rules handle both string colors and variable references
- Always customize generated code for your specific needs
- Follow your team's coding conventions and patterns
- Consider using functional components with hooks for simpler cases 

## Character Sprite Actions

**Valid sprite action names for all character sprite data:**

- `left` - Left-facing walking animation (used for enemies moving right-to-left)
- `right` - Right-facing walking animation
- `up` - Upward movement animation (used for jumping)
- `down` - Downward movement animation (used for walking/crouching)
- `hit` - Hit/damage animation
- `dead` - Death animation

**⚠️ IMPORTANT: Do NOT use the old mapped action names:**
- ❌ `walk` (use `down` or `left`/`right` instead)
- ❌ `jump` (use `up` instead)
- ❌ `fall` (use `down` instead)
- ❌ `attack` (use `hit` instead)

## Sprite System Usage

### For Players
- **Default action**: `down` (walking animation)
- **Jumping**: `up` action
- **Crouching**: `left` action
- **Dashing/Avoiding**: `right` action

### For Enemies
- **Default action**: `left` (walking animation as enemies move right-to-left)
- **Fallback**: `down` → `right` → `up` if `left` is not available

### Sprite Data Structure
```typescript
interface Character {
  sprites: {
    down: SpriteFrame[];
    up: SpriteFrame[];
    left: SpriteFrame[];
    right: SpriteFrame[];
    hit: SpriteFrame[];
    dead: SpriteFrame[];
  };
}
```

### Character IDs
- **Players**: `0` (아레스1), `1` (에레인)
- **Enemies**: `149`, `150`, `151`, `152`, `153`, `154`, `155`, `156`, `157`, `158`, `159`, `161`, `163`, `164`, `166`, `167`, `168`

### Sprite Animation Component
Use `SpriteAnimation` component for rendering sprites:
```tsx
<SpriteAnimation
  spriteFrames={character.sprites.down}
  imageSource={character.image}
  frameRate={150}
  isPlaying={true}
/>
```
- `up`
- `down`
- `hit`
- `dead`

> **Warning:**
> Do NOT use or map to `walk`, `jump`, `fall`, or `attack` in code or data. These do not exist in the sprite JSON and will break animation loading.

Always use the above 6 actions when referencing or loading character sprites. 