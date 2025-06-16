# Design System - Dental Equipment Website

## Color Palette

### Primary Colors
- **White**: #FFFFFF (Primary background)
- **Medical Blue**: #0d6efd (Primary accent, buttons, links)
- **Turquoise**: #00c4cc (Secondary accent, highlights)

### Supporting Colors
- **Light Gray**: #f8f9fa (Section backgrounds)
- **Medium Gray**: #6c757d (Text secondary)
- **Dark Gray**: #212529 (Text primary)
- **Success Green**: #198754 (Success states)
- **Soft Pastel Blue**: #e3f2fd (Subtle backgrounds)
- **Soft Pastel Turquoise**: #e0f7fa (Subtle highlights)

## Typography

### Primary Font: Inter
- **Headings**: Inter, sans-serif
- **Body Text**: Inter, sans-serif
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Weights
- **Light**: 300 (Subtle text)
- **Regular**: 400 (Body text)
- **Medium**: 500 (Subheadings)
- **Semi-Bold**: 600 (Section titles)
- **Bold**: 700 (Main headings)

### Font Sizes (Desktop)
- **Hero Title**: 3.5rem (56px)
- **Section Title**: 2.5rem (40px)
- **Subsection Title**: 1.75rem (28px)
- **Body Large**: 1.25rem (20px)
- **Body Regular**: 1rem (16px)
- **Body Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

### Font Sizes (Mobile)
- **Hero Title**: 2.5rem (40px)
- **Section Title**: 2rem (32px)
- **Subsection Title**: 1.5rem (24px)
- **Body Large**: 1.125rem (18px)
- **Body Regular**: 1rem (16px)
- **Body Small**: 0.875rem (14px)

## Spacing System

### Base Unit: 8px
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)
- **4xl**: 96px (6rem)
- **5xl**: 128px (8rem)

## Component Styles

### Buttons

#### Primary Button
- Background: #0d6efd
- Text: #ffffff
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 500
- Transition: all 0.3s ease
- Hover: background #0b5ed7, transform translateY(-2px)

#### Secondary Button
- Background: transparent
- Text: #0d6efd
- Border: 2px solid #0d6efd
- Padding: 10px 22px
- Border-radius: 8px
- Font-weight: 500
- Hover: background #0d6efd, text #ffffff

#### Accent Button (Boutique)
- Background: #00c4cc
- Text: #ffffff
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 600
- Hover: background #00a8b0, transform translateY(-2px)

### Cards
- Background: #ffffff
- Border-radius: 12px
- Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05)
- Padding: 24px
- Hover: box-shadow 0 8px 25px rgba(0, 0, 0, 0.1), transform translateY(-4px)
- Transition: all 0.3s ease

### Navigation
- Background: transparent → #ffffff (on scroll)
- Height: 80px
- Backdrop-filter: blur(10px)
- Box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) (on scroll)
- Sticky positioning

## Animation Guidelines

### Micro-interactions
- **Hover states**: 0.3s ease transition
- **Button press**: 0.15s ease-out
- **Card hover**: 0.3s ease transform and shadow
- **Link hover**: 0.2s ease color change

### Page Transitions
- **Fade in**: opacity 0 → 1, 0.6s ease
- **Slide up**: transform translateY(30px) → 0, 0.6s ease
- **Stagger animations**: 0.1s delay between elements

### Scroll Animations
- **Parallax**: subtle movement, max 20px displacement
- **Reveal on scroll**: intersection observer triggered
- **Progress indicators**: smooth width/height transitions

## Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

## Accessibility

### Focus States
- Outline: 2px solid #0d6efd
- Outline-offset: 2px
- Border-radius: 4px

### Color Contrast
- All text meets WCAG 2.2 AA standards
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text

### Interactive Elements
- Minimum touch target: 44px × 44px
- Clear visual feedback for all states
- Keyboard navigation support

## Visual Elements

### Icons
- Style: Outline/stroke icons
- Weight: 2px stroke
- Size: 24px standard, 32px for emphasis
- Color: Inherit from parent or #6c757d

### Images
- Format: WebP with JPEG fallback
- Lazy loading: Intersection observer
- Aspect ratios: 16:9 for hero, 4:3 for cards, 1:1 for avatars

### Shadows
- **Subtle**: 0 2px 4px rgba(0, 0, 0, 0.05)
- **Medium**: 0 4px 6px rgba(0, 0, 0, 0.1)
- **Strong**: 0 8px 25px rgba(0, 0, 0, 0.15)
- **Floating**: 0 12px 40px rgba(0, 0, 0, 0.2)

