# 🎨 Modern Theme System - Chitral Hive

## Overview
Chitral Hive now features a comprehensive, modern theme system with **Light** and **Dark** modes that provides an exceptional user experience with smooth transitions and professional design.

## ✨ Features

### 🌓 Dual Theme Support
- **Light Mode**: Clean, bright design with subtle shadows and elegant color palette
- **Dark Mode**: Eye-friendly dark theme with enhanced contrast and vibrant accents
- **Smooth Transitions**: All theme changes animate smoothly for a polished experience
- **Persistent Preference**: Theme choice is saved in localStorage and persists across sessions

### 🎯 Modern Design Elements
- **Gradient Accents**: Beautiful gradient overlays on primary elements
- **Enhanced Shadows**: Depth-aware shadows that adapt to the theme
- **CSS Variables**: Theme-aware custom properties for consistency
- **Responsive**: Optimized for all screen sizes
- **Accessible**: WCAG-compliant color contrasts and focus states

## 🔧 Implementation Details

### Core Components

#### 1. **SettingContext** (`src/contexts/SettingContext.jsx`)
Manages theme state and provides theme toggling functionality:
- `settings.theme`: Current theme ('light' or 'dark')
- `toggleTheme()`: Function to switch between themes
- `updateSettings()`: Update theme and other settings

```javascript
import useSettings from 'hooks/useSettings';

const { settings, toggleTheme } = useSettings();
const isDark = settings.theme === 'dark';
```

#### 2. **ThemeSwitcher Component** (`src/components/ThemeSwitcher.jsx`)
Beautiful animated toggle switch with two variants:
- **Full Toggle**: Animated switch with decorative elements
- **Icon Only**: Compact icon button for space-constrained areas

```javascript
import ThemeSwitcher from 'components/ThemeSwitcher';

// Full toggle with animation
<ThemeSwitcher iconOnly={false} />

// Icon button variant
<ThemeSwitcher iconOnly={true} />
```

#### 3. **Theme Colors** (`src/theme/themeColors.js`)
Comprehensive color palettes for both themes:
- `themeColors`: Light mode color palette
- `darkThemeColors`: Dark mode color palette
- Includes primary, secondary, success, error, warning, info colors
- Custom background and text colors

#### 4. **MuiTheme** (`src/theme/MuiTheme.jsx`)
Material-UI theme provider with dynamic theme switching:
- Responsive font sizes
- Theme-aware shadows
- Automatic mode switching based on settings

#### 5. **Global Styles** (`styles/globals.css`)
CSS custom properties for both themes:
- Light theme: `:root` and `[data-theme="light"]`
- Dark theme: `[data-theme="dark"]`
- Smooth transitions on all theme-aware elements

## 📍 Integration Points

The theme switcher is integrated in multiple locations:

### Desktop Navigation
- **Header** (`src/components/header/Header.jsx`): Full toggle switch in main header
- **Topbar** (`src/components/topbar/Topbar.jsx`): Icon button in top navigation bar

### Mobile Navigation
- **Mobile Navigation Bar** (`src/components/mobile-navigation/MobileNavigationBar.jsx`): 
  Dedicated theme toggle button in bottom navigation

## 🎨 CSS Custom Properties

### Light Theme Variables
```css
--primary-color: #D23F57
--bg-primary: #FFFFFF
--bg-secondary: #F8FAFC
--text-primary: #1a202c
--text-secondary: #4B566B
```

### Dark Theme Variables
```css
--primary-color: #FF6B8A
--bg-primary: #0F172A
--bg-secondary: #1E293B
--text-primary: #F9FAFB
--text-secondary: #D1D5DB
```

## 🔨 Usage in Components

### Using CSS Variables
```jsx
<Box sx={{
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  borderColor: 'var(--border-color)',
}}>
  Content
</Box>
```

### Using Theme Object
```jsx
<Box sx={{
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderColor: theme.palette.divider,
}}>
  Content
</Box>
```

### Conditional Styling
```jsx
const { settings } = useSettings();
const isDark = settings.theme === 'dark';

<Box sx={{
  background: isDark ? '#1E293B' : '#FFFFFF',
  boxShadow: isDark 
    ? '0 4px 20px rgba(0,0,0,0.6)' 
    : '0 4px 20px rgba(0,0,0,0.08)',
}}>
  Content
</Box>
```

## 📱 Responsive Behavior

### Desktop (> 900px)
- Full theme toggle in header
- Icon button in topbar
- Visible theme transitions

### Mobile (≤ 900px)
- Theme toggle in bottom navigation bar
- Icon-based interface
- Touch-optimized controls

## 🎭 Animation & Transitions

### Theme Switch Animation
- **Duration**: 300ms
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Properties**: background-color, color, border-color, box-shadow

### Toggle Switch Animation
- **Duration**: 400ms
- **Easing**: cubic-bezier(0.68, -0.55, 0.265, 1.55) (bounce effect)
- **Decorative Elements**: Twinkling stars (dark), floating clouds (light)

## 🔐 Accessibility

### Keyboard Navigation
- All theme toggles are keyboard accessible
- Focus states clearly indicated
- Enter and Space keys trigger toggle

### Screen Readers
- Proper ARIA labels on all controls
- Announces theme changes
- Descriptive button text

### Color Contrast
- **Light Mode**: AAA compliance
- **Dark Mode**: Enhanced contrast for readability
- Focus indicators meet WCAG 2.1 standards

## 📦 File Structure
```
chitralhive/
├── src/
│   ├── contexts/
│   │   └── SettingContext.jsx         # Theme state management
│   ├── components/
│   │   ├── ThemeSwitcher.jsx          # Theme toggle component
│   │   ├── header/
│   │   │   └── Header.jsx             # Main header with theme toggle
│   │   ├── topbar/
│   │   │   └── Topbar.jsx             # Top navigation with theme toggle
│   │   └── mobile-navigation/
│   │       └── MobileNavigationBar.jsx # Mobile nav with theme toggle
│   └── theme/
│       ├── themeColors.js             # Color palettes
│       ├── MuiTheme.jsx               # Theme provider
│       └── themeOptions.js            # Theme configuration
└── styles/
    └── globals.css                    # Global CSS with theme variables
```

## 🚀 Quick Start

1. **Import useSettings hook**:
```javascript
import useSettings from 'hooks/useSettings';
```

2. **Get theme state and toggle function**:
```javascript
const { settings, toggleTheme } = useSettings();
const isDark = settings.theme === 'dark';
```

3. **Use in your component**:
```javascript
<Button onClick={toggleTheme}>
  Toggle Theme
</Button>
```

## 🎯 Best Practices

### 1. Use CSS Variables for Consistency
Prefer CSS variables over hard-coded colors for theme compatibility:
```css
/* Good */
color: var(--text-primary);
background: var(--bg-primary);

/* Avoid */
color: #1a202c;
background: white;
```

### 2. Leverage Theme Object
Use Material-UI's theme object for component styling:
```jsx
sx={{
  bgcolor: 'background.paper',
  color: 'text.primary',
}}
```

### 3. Add Transitions
Include smooth transitions for theme-aware properties:
```jsx
sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}}
```

### 4. Test Both Themes
Always verify components in both light and dark modes:
- Check contrast ratios
- Verify shadow visibility
- Test hover states
- Confirm border visibility

## 🐛 Troubleshooting

### Theme Not Persisting
**Issue**: Theme resets on page reload
**Solution**: Check localStorage permissions and browser settings

### Flickering on Load
**Issue**: Brief flash of wrong theme
**Solution**: Theme is set in useEffect - this is expected and minimal

### Styles Not Updating
**Issue**: Components not responding to theme changes
**Solution**: Ensure using theme-aware CSS variables or theme object

### Performance Issues
**Issue**: Slow theme transitions
**Solution**: Reduce transition duration or limit animated properties

## 📊 Performance Optimizations

1. **CSS Variables**: Instant theme switching without re-rendering
2. **Context Memoization**: Prevents unnecessary re-renders
3. **Local Storage**: Caches theme preference
4. **Optimized Transitions**: Only animates necessary properties

## 🎨 Customization

### Adding New Theme Colors
Edit `src/theme/themeColors.js`:
```javascript
export const themeColors = {
  // Add your custom colors
  custom: {
    main: '#YOUR_COLOR',
    light: '#LIGHTER_SHADE',
    dark: '#DARKER_SHADE',
  },
};
```

### Modifying CSS Variables
Edit `styles/globals.css`:
```css
:root {
  --your-custom-var: value;
}

[data-theme="dark"] {
  --your-custom-var: dark-value;
}
```

### Creating New Theme Variants
Extend `themeOptions.js` with additional theme configurations.

## 📈 Future Enhancements

Potential additions to the theme system:
- [ ] System preference detection (auto theme based on OS)
- [ ] Custom theme builder for users
- [ ] High contrast mode for accessibility
- [ ] Multiple color scheme options
- [ ] Scheduled theme switching (auto dark at night)

## 🤝 Contributing

When adding new components:
1. Use theme-aware CSS variables
2. Test in both light and dark modes
3. Ensure smooth transitions
4. Maintain accessibility standards
5. Update this documentation

## 📞 Support

For issues or questions about the theme system:
- Check the troubleshooting section
- Review best practices
- Examine existing component implementations
- Refer to Material-UI theming documentation

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Author**: Chitral Hive Development Team

## License
This theme system is part of the Chitral Hive e-commerce platform.

