# Website Wireframes & Layout Structure

## Page Layout Overview

### Header/Navigation
```
┌─────────────────────────────────────────────────────────────────┐
│ [LOGO]              [Accueil] [À propos] [Réalisations] [Contact] │
│                                                        [BOUTIQUE] │
└─────────────────────────────────────────────────────────────────┘
```

### Hero Section
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│    La technologie dentaire à portée de main                    │
│    ─────────────────────────────────────────                   │
│    Équipements de pointe pour professionnels                   │
│    de la santé bucco-dentaire                                  │
│                                                                 │
│    [Découvrir le catalogue]                    [3D DENTAL TOOL] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### About Section
```
┌─────────────────────────────────────────────────────────────────┐
│                        À propos de nous                         │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   [TIMELINE]    │  │   [STATS BOX]   │  │   [VALUES]      │  │
│  │   2010: Début   │  │   500+ clients  │  │   Innovation    │  │
│  │   2015: Expansion│  │   15 ans exp.   │  │   Qualité       │  │
│  │   2020: Digital │  │   99% satisf.   │  │   Service       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Achievements Section
```
┌─────────────────────────────────────────────────────────────────┐
│                         Nos réalisations                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │ [CASE STUDY]│  │ [CASE STUDY]│  │ [CASE STUDY]│  │   ...   │ │
│  │   Image     │  │   Image     │  │   Image     │  │         │ │
│  │   Title     │  │   Title     │  │   Title     │  │         │ │
│  │   Quote     │  │   Quote     │  │   Quote     │  │         │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                         [← →] Navigation                        │
└─────────────────────────────────────────────────────────────────┘
```

### Contact Section
```
┌─────────────────────────────────────────────────────────────────┐
│                           Contact                               │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│  │        CONTACT FORM         │  │        GOOGLE MAP           │ │
│  │  [Nom]                      │  │                             │ │
│  │  [Email]                    │  │    [Interactive Map]        │ │
│  │  [Téléphone]                │  │                             │ │
│  │  [Message]                  │  │                             │ │
│  │                             │  │                             │ │
│  │  [Envoyer]                  │  │                             │ │
│  └─────────────────────────────┘  └─────────────────────────────┘ │
│                                                                 │
│  📞 +33 1 23 45 67 89    📧 contact@dental-tech.fr             │
└─────────────────────────────────────────────────────────────────┘
```

## E-commerce Section Layout (/boutique)

### Product Catalog
```
┌─────────────────────────────────────────────────────────────────┐
│  [← Retour]                    BOUTIQUE                         │
│                                                                 │
│  ┌─────────────────┐                                            │
│  │    FILTRES      │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │                 │  │ PRD │ │ PRD │ │ PRD │ │ PRD │          │
│  │ □ Équipements   │  │  1  │ │  2  │ │  3  │ │  4  │          │
│  │ □ Consommables  │  └─────┘ └─────┘ └─────┘ └─────┘          │
│  │ □ Promotions    │                                            │
│  │                 │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ Prix: [___-___] │  │ PRD │ │ PRD │ │ PRD │ │ PRD │          │
│  │                 │  │  5  │ │  6  │ │  7  │ │  8  │          │
│  │ [Appliquer]     │  └─────┘ └─────┘ └─────┘ └─────┘          │
│  └─────────────────┘                                            │
│                                [1] [2] [3] ... [→]              │
└─────────────────────────────────────────────────────────────────┘
```

### Product Detail Page
```
┌─────────────────────────────────────────────────────────────────┐
│  [← Retour au catalogue]                                        │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│  │                             │  │    Nom du produit           │ │
│  │      PRODUCT IMAGE          │  │    ★★★★☆ (4.5/5)           │ │
│  │      [Zoom feature]         │  │                             │ │
│  │                             │  │    Prix: 299€               │ │
│  │  [thumb] [thumb] [thumb]    │  │                             │ │
│  └─────────────────────────────┘  │    Quantité: [- 1 +]        │ │
│                                   │                             │ │
│  ┌─────────────────────────────────┐ │    [AJOUTER AU PANIER]     │ │
│  │ [Description] [Spécifications] │ │                             │ │
│  │ [Avis clients]                 │ │    ♡ Ajouter aux favoris   │ │
│  │                                │ └─────────────────────────────┘ │
│  │ Contenu des onglets...         │                               │
│  └─────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Shopping Cart
```
┌─────────────────────────────────────────────────────────────────┐
│                          Panier (3)                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ [img] Produit 1                    Qté: [2]    150€  [×]   │ │
│  │ [img] Produit 2                    Qté: [1]    299€  [×]   │ │
│  │ [img] Produit 3                    Qté: [1]     89€  [×]   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│  │      CODE PROMO             │  │        RÉSUMÉ               │ │
│  │  [_______________] [OK]     │  │                             │ │
│  └─────────────────────────────┘  │  Sous-total:      538€      │ │
│                                   │  Livraison:        15€      │ │
│  [← Continuer les achats]         │  TVA (20%):       110€      │ │
│                                   │  ─────────────────────      │ │
│                                   │  TOTAL:           663€      │ │
│                                   │                             │ │
│                                   │  [COMMANDER]                │ │
│                                   └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Mobile Responsive Adaptations

### Mobile Navigation
```
┌─────────────────────────────────┐
│ [☰] LOGO              [🛒] [👤] │
└─────────────────────────────────┘
```

### Mobile Hero (Stacked)
```
┌─────────────────────────────────┐
│                                 │
│        [3D DENTAL TOOL]         │
│                                 │
│   La technologie dentaire       │
│   à portée de main              │
│                                 │
│   [Découvrir le catalogue]      │
│                                 │
└─────────────────────────────────┘
```

### Mobile Product Grid (1 column)
```
┌─────────────────────────────────┐
│  [Filtres ▼]         [Sort ▼]  │
│                                 │
│  ┌─────────────────────────────┐ │
│  │         PRODUCT 1           │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │         PRODUCT 2           │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │         PRODUCT 3           │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Animation & Interaction Notes

### Scroll Animations
- Hero elements fade in with stagger effect
- Section titles slide up on scroll
- Cards have subtle parallax movement
- Progress bar for page scroll

### Hover Effects
- Product cards lift with shadow increase
- Buttons have subtle scale and color transitions
- Navigation links underline animation
- Image zoom on hover for product gallery

### Loading States
- Skeleton screens for product loading
- Smooth transitions between pages
- Loading spinners for form submissions
- Progressive image loading with blur-to-sharp effect

