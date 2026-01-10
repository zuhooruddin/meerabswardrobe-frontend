# 🧪 Theme System Testing Guide

## Quick Test Checklist

Use this checklist to verify that the theme system is working correctly across your Chitral Hive e-commerce platform.

## ✅ Visual Tests

### 1. Desktop Navigation Tests

#### Header Component
- [ ] Theme toggle appears in the header (between account icon and cart)
- [ ] Toggle switch animates smoothly when clicked
- [ ] Light mode shows sun icon, dark mode shows moon icon
- [ ] Header background changes from white to dark navy
- [ ] Header shadow adapts to theme

#### Topbar Component
- [ ] Theme icon appears in topbar (next to "Today Deal")
- [ ] Icon changes from sun to moon based on theme
- [ ] Icon has hover effect
- [ ] Topbar background adapts to theme

### 2. Mobile Navigation Tests (Screen width ≤ 900px)

- [ ] Bottom navigation bar contains "Theme" button
- [ ] Theme button shows appropriate icon (sun/moon)
- [ ] Button responds to touch/click
- [ ] Theme changes when button is clicked

### 3. Theme Persistence Tests

- [ ] Set theme to dark mode
- [ ] Refresh the page
- [ ] Theme should remain dark
- [ ] Clear localStorage and refresh
- [ ] Should default to light mode

### 4. Color Adaptation Tests

#### Light Mode
- [ ] Background is white/light gray (#F8FAFC)
- [ ] Text is dark (#1a202c)
- [ ] Primary color is red/pink (#D23F57)
- [ ] Shadows are subtle
- [ ] Borders are visible
- [ ] Cards have light backgrounds

#### Dark Mode
- [ ] Background is dark navy (#0F172A)
- [ ] Text is light (#F9FAFB)
- [ ] Primary color is bright pink (#FF6B8A)
- [ ] Shadows are stronger
- [ ] Borders are visible (light)
- [ ] Cards have dark backgrounds (#1E293B)

### 5. Product Pages

#### Product Cards
- [ ] Card backgrounds adapt to theme
- [ ] Product titles are readable
- [ ] Prices are clearly visible
- [ ] "Add to Cart" buttons have proper contrast
- [ ] Hover effects work in both themes
- [ ] Product images display correctly

#### Product Detail Page
- [ ] Image gallery background adapts
- [ ] Product info card adapts
- [ ] Price display is readable
- [ ] Quantity selector is visible
- [ ] Reviews section adapts
- [ ] All text is readable

### 6. Form Elements

- [ ] Input fields have visible borders
- [ ] Input text is readable
- [ ] Placeholder text has good contrast
- [ ] Focus states are visible
- [ ] Buttons have proper colors
- [ ] Error messages are visible

### 7. Shopping Cart

- [ ] Cart drawer background adapts
- [ ] Item cards are visible
- [ ] Prices are readable
- [ ] Remove buttons are accessible
- [ ] Total price is prominent
- [ ] Checkout button stands out

### 8. Checkout Process

- [ ] Form fields are visible
- [ ] Labels are readable
- [ ] Step indicators adapt
- [ ] Payment section is clear
- [ ] Order summary is visible
- [ ] Submit button is prominent

## 🔬 Technical Tests

### 1. Console Tests

Open browser console and run:

```javascript
// Check current theme
localStorage.getItem('bazaar_settings')

// Should return something like:
// {"direction":"ltr","theme":"dark"}
```

### 2. DOM Attribute Tests

```javascript
// Check document theme attribute
document.documentElement.getAttribute('data-theme')

// Should return: "light" or "dark"
```

### 3. CSS Variables Tests

Open DevTools and check computed styles:

```javascript
// Light mode
getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-primary')
// Should return: #FFFFFF

// Dark mode
getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-primary')
// Should return: #0F172A
```

### 4. Material-UI Theme Tests

In any component:

```javascript
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
console.log(theme.palette.mode); // "light" or "dark"
```

## 🎯 Interaction Tests

### 1. Toggle Switch Animation

1. Click the theme toggle
2. Watch the animation:
   - [ ] Toggle circle slides smoothly
   - [ ] Duration is approximately 400ms
   - [ ] Bounce effect is noticeable
   - [ ] Background colors transition
   - [ ] Decorative elements appear (stars/clouds)

### 2. Theme Transition Smoothness

1. Toggle theme on different pages
2. Observe transitions:
   - [ ] No content "flash"
   - [ ] Smooth color changes
   - [ ] No layout shifts
   - [ ] No broken styles during transition
   - [ ] Complete within 300ms

### 3. Keyboard Accessibility

1. Tab to theme toggle
2. Check:
   - [ ] Focus indicator is visible
   - [ ] Press Enter to toggle
   - [ ] Press Space to toggle
   - [ ] Screen reader announces state

### 4. Touch Interactions (Mobile)

1. On mobile device:
   - [ ] Theme button responds to tap
   - [ ] No double-tap required
   - [ ] Immediate visual feedback
   - [ ] Smooth theme change

## 📱 Responsive Tests

### Desktop (> 1280px)
- [ ] Full toggle switch visible in header
- [ ] Icon button in topbar
- [ ] Adequate spacing between elements
- [ ] No overlapping elements

### Tablet (960px - 1280px)
- [ ] Toggle switch adapts to smaller space
- [ ] All elements remain accessible
- [ ] No horizontal scrolling

### Mobile (< 960px)
- [ ] Desktop toggles hidden
- [ ] Mobile navigation shows theme button
- [ ] Button is easily tappable (44px+)
- [ ] No layout issues

## 🐛 Bug Checks

### Common Issues to Look For

1. **Flickering**
   - [ ] No flash of wrong theme on load
   - [ ] No flickering during transitions

2. **Contrast Issues**
   - [ ] All text passes WCAG AA standards
   - [ ] Important elements have sufficient contrast
   - [ ] Focus indicators are always visible

3. **Performance**
   - [ ] Theme toggle is instant (< 100ms)
   - [ ] Page doesn't lag during transition
   - [ ] No memory leaks over multiple toggles

4. **Persistence**
   - [ ] Theme persists across navigation
   - [ ] Theme persists after page refresh
   - [ ] Theme persists in different tabs

5. **Edge Cases**
   - [ ] Works with browser back/forward
   - [ ] Works after clearing cookies (but not localStorage)
   - [ ] Works in incognito/private mode

## 🎨 Visual Comparison

### Light Mode Checklist
```
✓ Clean, bright appearance
✓ Subtle shadows
✓ High contrast text
✓ Professional look
✓ Easy to read
```

### Dark Mode Checklist
```
✓ Dark, comfortable appearance
✓ Reduced eye strain
✓ Vibrant accent colors
✓ Clear element separation
✓ Modern aesthetic
```

## 📊 Performance Benchmarks

Use Chrome DevTools Performance tab:

1. Record theme toggle
2. Check metrics:
   - [ ] First Paint < 100ms
   - [ ] Layout Shift < 0.1
   - [ ] No long tasks
   - [ ] Smooth 60fps animation

## 🔧 Developer Tools Tests

### React DevTools
1. Find SettingsProvider component
2. Check state:
   - [ ] `settings.theme` updates on toggle
   - [ ] No unnecessary re-renders
   - [ ] Context updates propagate

### Redux DevTools (if applicable)
1. Watch theme state changes
2. Verify:
   - [ ] Clean state updates
   - [ ] No duplicate actions
   - [ ] Proper persistence

## 📝 Browser Compatibility

Test in multiple browsers:

### Chrome/Edge (Chromium)
- [ ] Theme toggle works
- [ ] Animations smooth
- [ ] Colors correct
- [ ] No console errors

### Firefox
- [ ] Theme toggle works
- [ ] Animations smooth
- [ ] Colors correct
- [ ] No console errors

### Safari
- [ ] Theme toggle works
- [ ] Animations smooth (check backdrop-filter)
- [ ] Colors correct
- [ ] No console errors

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

## 🎯 User Experience Tests

### Scenario 1: First Time Visitor
1. Visit site (default light mode)
2. Browse products
3. Toggle to dark mode
4. Continue browsing
5. Verify smooth experience

### Scenario 2: Returning Visitor
1. Previously set dark mode
2. Return to site
3. Should load in dark mode
4. Browse different pages
5. Theme persists throughout

### Scenario 3: Time-Based Preference
1. Check theme at different times of day
2. Verify comfortable viewing
3. Test in bright/dark environments
4. Ensure eye comfort

## 📈 Analytics to Track (Future)

Consider tracking:
- Theme preference distribution
- Toggle frequency
- Time of day patterns
- Device-based preferences

## ✅ Final Checklist

Before deploying:

- [ ] All visual tests pass
- [ ] All technical tests pass
- [ ] All interaction tests pass
- [ ] All responsive tests pass
- [ ] No console errors
- [ ] No accessibility violations
- [ ] Performance is acceptable
- [ ] Works across browsers
- [ ] Mobile experience is smooth
- [ ] Documentation is complete

## 🚀 Quick Test Script

Run this quick test after any theme-related changes:

1. **Toggle theme** 5 times rapidly
2. **Refresh page** - theme should persist
3. **Navigate** to 5 different pages
4. **Resize browser** window
5. **Switch to mobile** view
6. **Check console** for errors
7. **Verify accessibility** with screen reader

If all pass ✅ - You're good to go!

## 📞 Reporting Issues

If you find any issues:

1. Note the theme state (light/dark)
2. Record the page/component
3. Capture screenshot/video
4. Check console for errors
5. Note browser and device
6. Document steps to reproduce

## 🎓 Testing Tips

- **Use DevTools**: Chrome/Firefox DevTools are your friends
- **Test Early**: Check theme on every new component
- **Test Often**: After every theme-related change
- **Test Everywhere**: Desktop, mobile, tablet
- **Test Everyone**: Different browsers, devices
- **User Test**: Get feedback from real users

---

**Happy Testing! 🎉**

For questions or issues, refer to THEME_SYSTEM.md for detailed documentation.

