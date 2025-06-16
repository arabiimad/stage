# Dental Equipment Website - Project Analysis

## Project Overview
Development of a modern website for a dental equipment company with two main components:
1. **Showcase section** - Corporate presentation (1-2 pages)
2. **E-commerce section** - Product catalog with secure payment

## Target Audience
- Dental practices
- Prosthetic laboratories  
- Dentists and oral health practitioners

## Design Requirements

### Visual Identity
- **Primary Colors:**
  - White background (#FFFFFF)
  - Medical blue (#0d6efd)
  - Turquoise (#00c4cc)
  - Subtle pastel accents

### Design Style
- Ultra-modern, creative, and animated
- 2025 design trends (micro-interactions, smooth scrolling, subtle parallax)
- Minimalist approach
- Premium sans-serif typography (Inter/Poppins)
- 3D dental tool illustrations

### Animations & Interactions
- Fade/slide transitions between sections (GSAP ScrollTrigger)
- Subtle hover states on buttons/icons
- Tactile feedback
- Lazy-loading with skeleton screens
- Smooth scrolling navigation

## Site Structure

### Navigation
- Sticky transparent header (becomes white on scroll)
- Logo (left) + navigation links + "Boutique" CTA (right)
- Links: Home, About, Achievements, Contact

### Showcase Sections
1. **Hero Section**
   - Title: "La technologie dentaire à portée de main"
   - Subtitle + "Discover Catalog" button
   - Animated 3D illustration

2. **About Section**
   - Animated company timeline
   - Key statistics (years of experience, equipped practices)

3. **Achievements/Client Cases**
   - Auto-scroll carousel or masonry cards
   - Before/after photos, practitioner testimonials

4. **Contact/CTA**
   - Simplified form + clickable phone number
   - Integrated Google Maps

5. **Footer**
   - Quick links, social media, legal mentions, newsletter

### E-commerce Section (/boutique)
- Responsive grid layout (4 columns desktop → 1 column mobile)
- Dynamic filters (Categories: Equipment, Consumables, Promotions)
- Detailed product pages (image zoom, tabs: Description/Specifications/Reviews)
- Secure payment (Stripe/PayPal) + optional customer account
- Return policy, Terms & Conditions

## Technical Requirements

### Technology Stack
- HTML5, CSS3 (or TailwindCSS)
- JavaScript ES2023
- SPA framework (React/Next.js recommended)
- Animations: GSAP or Framer Motion

### Performance
- LCP < 2.5s
- Lighthouse Mobile score 90+
- Optimized images (WebP format)

### SEO & Accessibility
- Complete metadata
- Schema.org Product markup for e-commerce
- WCAG 2.2 AA compliance
- Focus rings, ARIA labels

### Responsive Design
- 4K screens to smartphones
- Portrait & landscape orientations
- Touch-friendly interactions

### Additional Features
- Multilingual ready (French default, EN/ES optional)
- Optional headless CMS (Sanity) for content management

## Deliverables
1. High-fidelity mockup (Figma) + animated prototype
2. Design System (colors, typography, components)
3. Source code (webpack/Next.js) + installation README
4. E-commerce administration documentation
5. Optimized asset pack (SVG, WebP images)

## Tone & Voice
- Professional, reassuring, innovative, and human
- Clear, educational language
- Avoid technical jargon

