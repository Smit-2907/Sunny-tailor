# 🎨 Light Theme Guide - Clothing Manufacturing ERP

## Complete Light Theme Implementation

This document outlines the comprehensive light theme design system for your B2B clothing manufacturing ERP application.

---

## 🎯 **Color Palette**

### **Primary Colors**
- **Primary Indigo:** `#4F46E5` (indigo-600) - Main brand color
- **Primary Hover:** `#4338CA` (indigo-700) - Hover states
- **Primary Light:** `#E0E7FF` (indigo-100) - Backgrounds
- **Primary Text:** `#FFFFFF` - Text on primary buttons

### **Secondary Colors**
- **Gray 700:** `#374151` - Secondary text
- **Gray 600:** `#4B5563` - Body text
- **Gray 500:** `#6B7280` - Muted text
- **Gray 400:** `#9CA3AF` - Placeholders
- **Gray 300:** `#D1D5DB` - Borders
- **Gray 200:** `#E5E7EB` - Dividers
- **Gray 100:** `#F3F4F6` - Subtle backgrounds
- **Gray 50:** `#F9FAFB` - Page backgrounds

### **Semantic Colors**
- **Success:** `#10B981` (green-600)
  - Background: `#D1FAE5` (green-100)
  - Border: `#A7F3D0` (green-200)
  
- **Error/Destructive:** `#EF4444` (red-600)
  - Background: `#FEE2E2` (red-100)
  - Border: `#FECACA` (red-200)
  
- **Warning:** `#F59E0B` (amber-600)
  - Background: `#FEF3C7` (amber-100)
  - Border: `#FDE68A` (amber-200)
  
- **Info:** `#3B82F6` (blue-600)
  - Background: `#DBEAFE` (blue-100)
  - Border: `#BFDBFE` (blue-200)

### **Chart Colors**
1. **Chart 1:** `#4F46E5` (Indigo)
2. **Chart 2:** `#10B981` (Green)
3. **Chart 3:** `#F59E0B` (Amber)
4. **Chart 4:** `#EF4444` (Red)
5. **Chart 5:** `#8B5CF6` (Purple)

---

## 📐 **Layout Structure**

### **Sidebar**
- **Background:** `#FFFFFF` (White)
- **Text:** `#111827` (Gray 900)
- **Border:** `#E5E7EB` (Gray 200)
- **Active Item:** `#4F46E5` (Indigo 600)
- **Hover:** `#F3F4F6` (Gray 100)

### **Top Bar**
- **Background:** `#FFFFFF` (White)
- **Border:** `#E5E7EB` (Gray 200)
- **Height:** `64px` (h-16)

### **Main Content Area**
- **Background:** `#F9FAFB` (Gray 50)
- **Padding:** Responsive (p-3 sm:p-4 md:p-6 lg:p-8)

### **Cards**
- **Background:** `#FFFFFF` (White)
- **Border:** `#E5E7EB` (Gray 200)
- **Shadow:** `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- **Border Radius:** `0.5rem` (8px)

---

## 🔤 **Typography**

### **Font Family**
- **Primary:** Inter
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif

### **Font Weights**
- **Normal:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### **Text Hierarchy**
```css
h1: 36px, font-weight: 500
h2: 30px, font-weight: 500
h3: 24px, font-weight: 500
h4: 18px, font-weight: 500
body: 16px, font-weight: 400
small: 14px, font-weight: 400
```

### **Text Colors**
- **Primary Text:** `#111827` (Gray 900)
- **Secondary Text:** `#6B7280` (Gray 500)
- **Muted Text:** `#9CA3AF` (Gray 400)
- **On Primary:** `#FFFFFF` (White)

---

## 🎨 **Component Styles**

### **Buttons**

#### Primary Button
```tsx
className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg"
```

#### Secondary Button
```tsx
className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium"
```

#### Outline Button
```tsx
className="border border-gray-300 hover:bg-gray-50 text-gray-700"
```

#### Ghost Button
```tsx
className="hover:bg-gray-100 text-gray-700"
```

#### Destructive Button
```tsx
className="bg-red-600 hover:bg-red-700 text-white font-medium"
```

### **Form Inputs**

#### Text Input
```tsx
className="border border-gray-300 bg-white text-gray-900 
           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
```

#### Select Dropdown
```tsx
className="border border-gray-300 bg-white text-gray-900
           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
```

#### Checkbox/Radio
```tsx
className="border-gray-300 text-indigo-600 
           focus:ring-indigo-500"
```

### **Alerts**

#### Success Alert
```tsx
className="border-green-200 bg-green-50 text-green-900"
<AlertCircle className="text-green-600" />
```

#### Error Alert
```tsx
className="border-red-200 bg-red-50 text-red-900"
<AlertCircle className="text-red-600" />
```

#### Warning Alert
```tsx
className="border-yellow-200 bg-yellow-50 text-yellow-900"
<AlertCircle className="text-yellow-600" />
```

#### Info Alert
```tsx
className="border-blue-200 bg-blue-50 text-blue-900"
<Info className="text-blue-600" />
```

### **Badges**

#### Default Badge
```tsx
className="bg-gray-100 text-gray-800 border-gray-200"
```

#### Success Badge
```tsx
className="bg-green-100 text-green-800 border-green-200"
```

#### Error Badge
```tsx
className="bg-red-100 text-red-800 border-red-200"
```

#### Warning Badge
```tsx
className="bg-yellow-100 text-yellow-800 border-yellow-200"
```

#### Info Badge
```tsx
className="bg-blue-100 text-blue-800 border-blue-200"
```

### **Role Badges**
```tsx
const roleColors = {
  "master-manager": "bg-purple-100 text-purple-800 border-purple-200",
  "hr": "bg-blue-100 text-blue-800 border-blue-200",
  "measurement-expert": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "production-manager": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "fabric-store": "bg-green-100 text-green-800 border-green-200",
  "raw-material-store": "bg-teal-100 text-teal-800 border-teal-200",
  "dispatch": "bg-orange-100 text-orange-800 border-orange-200",
  "accountant": "bg-emerald-100 text-emerald-800 border-emerald-200"
};
```

---

## 📊 **Dashboard Components**

### **Stat Cards**
- **Background:** White (`#FFFFFF`)
- **Border:** Gray 200 (`#E5E7EB`)
- **Icon Background:** Indigo 100 (`#E0E7FF`)
- **Icon Color:** Indigo 600 (`#4F46E5`)
- **Value Text:** Gray 900 (`#111827`)
- **Label Text:** Gray 500 (`#6B7280`)

### **Charts**
- **Background:** White
- **Grid Lines:** Gray 200 (`#E5E7EB`)
- **Axis Text:** Gray 500 (`#6B7280`)
- **Tooltip Background:** White with shadow

### **Tables**
- **Header Background:** Gray 50 (`#F9FAFB`)
- **Header Text:** Gray 700 (`#374151`)
- **Row Background:** White
- **Row Hover:** Gray 50 (`#F9FAFB`)
- **Border:** Gray 200 (`#E5E7EB`)
- **Zebra Striping:** Alternating Gray 50

---

## 🎯 **Status Colors**

### **Order Status**
- **Pending:** Yellow (`#EAB308`)
- **In Progress:** Blue (`#3B82F6`)
- **Completed:** Green (`#10B981`)
- **Delayed:** Red (`#EF4444`)
- **Cancelled:** Gray (`#6B7280`)

### **Stock Status**
- **Critical:** Red background (`#FEE2E2`), Red text (`#DC2626`)
- **Warning:** Yellow background (`#FEF3C7`), Yellow text (`#D97706`)
- **Normal:** Green background (`#D1FAE5`), Green text (`#059669`)

### **Activity Status**
- **New:** Blue
- **In Progress:** Indigo
- **Completed:** Green
- **Alert:** Red

---

## 🔍 **Accessibility**

### **Focus States**
```tsx
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
```

### **Disabled States**
```tsx
disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
```

### **Hover States**
```tsx
hover:bg-gray-50 transition-colors duration-200
```

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### **Responsive Padding**
```tsx
p-3 sm:p-4 md:p-6 lg:p-8
```

### **Responsive Text**
```tsx
text-sm sm:text-base md:text-lg
```

---

## 🎨 **CSS Variables**

All theme colors are defined in `/src/styles/theme.css`:

```css
:root {
  --background: #F9FAFB;
  --foreground: #111827;
  --card: #ffffff;
  --card-foreground: #111827;
  --primary: #4F46E5;
  --primary-foreground: #ffffff;
  --secondary: #6B7280;
  --secondary-foreground: #ffffff;
  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --accent: #E0E7FF;
  --accent-foreground: #4F46E5;
  --destructive: #EF4444;
  --destructive-foreground: #ffffff;
  --border: #E5E7EB;
  --ring: #4F46E5;
  --sidebar: #ffffff;
  --sidebar-foreground: #111827;
  --sidebar-border: #E5E7EB;
}
```

---

## 🚀 **Implementation Checklist**

### ✅ **Completed**
- [x] Light theme CSS variables
- [x] White sidebar with light borders
- [x] White top bar
- [x] Light gray page background
- [x] White cards with subtle shadows
- [x] Indigo primary color throughout
- [x] Proper text contrast ratios
- [x] Role-specific color badges
- [x] Chart colors optimized for light theme
- [x] Form inputs with light backgrounds
- [x] Disabled dark mode in CSS
- [x] Inter font family

### 🎯 **Usage Guidelines**
1. **Always use white cards** on light gray backgrounds
2. **Use indigo for primary actions** and active states
3. **Use semantic colors** (green, red, yellow) for status
4. **Maintain proper contrast** for accessibility
5. **Use consistent spacing** with Tailwind utilities
6. **Apply hover states** to interactive elements
7. **Use shadows sparingly** for depth

---

## 📁 **Key Files**

### **Theme Configuration**
- `/src/styles/theme.css` - Main theme variables
- `/src/styles/tailwind.css` - Tailwind imports
- `/src/styles/mobile-responsive.css` - Responsive utilities
- `/src/styles/index.css` - Global styles

### **Components**
- `/src/app/components/enhanced-sidebar-nav.tsx` - Sidebar
- `/src/app/components/top-bar.tsx` - Top navigation
- `/src/app/components/enhanced-layout.tsx` - Main layout
- `/src/app/components/ui/*` - Reusable UI components

---

## 🎨 **Design Principles**

1. **Clarity:** Clean, uncluttered interfaces with ample white space
2. **Consistency:** Uniform color usage across all components
3. **Accessibility:** WCAG 2.1 AA compliant color contrast
4. **Professionalism:** Enterprise-grade visual design
5. **Responsiveness:** Mobile-first, adaptive layouts

---

## 🔧 **Customization**

To modify theme colors, edit `/src/styles/theme.css`:

```css
:root {
  --primary: #YOUR_PRIMARY_COLOR;
  --secondary: #YOUR_SECONDARY_COLOR;
  /* ... other variables */
}
```

Then rebuild with:
```bash
npm run build
```

---

## 📸 **Visual Examples**

### **Primary Button**
- Background: Indigo 600 (`#4F46E5`)
- Hover: Indigo 700 (`#4338CA`)
- Text: White
- Shadow: Medium

### **Card**
- Background: White
- Border: 1px solid Gray 200
- Shadow: Small
- Padding: 6 (24px)

### **Alert (Success)**
- Background: Green 50 (`#F0FDF4`)
- Border: Green 200 (`#BBF7D0`)
- Icon: Green 600 (`#16A34A`)
- Text: Green 900 (`#14532D`)

---

**Your ERP system now features a complete, professional light theme! 🎉**
