# 📱 Mobile Layout Examples - Visual Guide

## Table of Contents
1. [Main Layout Structure](#main-layout-structure)
2. [Dashboard Layouts](#dashboard-layouts)
3. [Data Tables](#data-tables)
4. [Forms & Filters](#forms--filters)
5. [Chat Interface](#chat-interface)
6. [Navigation Patterns](#navigation-patterns)

---

## Main Layout Structure

### **Mobile (< 768px)**
```
┌─────────────────────────┐
│ [☰] ClothingERP     [👤]│ ← Top Bar (64px)
├─────────────────────────┤
│                         │
│                         │
│     Main Content        │
│     (Full Width)        │
│     Padding: 12px       │
│                         │
│                         │
└─────────────────────────┘

└─────────────────────────┘
  ← Sidebar (hidden, slides in from left)
```

### **Tablet (768px - 1024px)**
```
┌─────────────────────────────────────┐
│ [☰] ClothingERP  [Search]    [Icons]│
├─────────────────────────────────────┤
│                                     │
│        Main Content                 │
│        (Full Width)                 │
│        Padding: 24px                │
│                                     │
└─────────────────────────────────────┘
```

### **Desktop (> 1024px)**
```
┌──────┬──────────────────────────────────┐
│      │ ClothingERP  [Search]    [Icons] │
│      ├──────────────────────────────────┤
│ Side │                                  │
│ bar  │      Main Content                │
│ 256  │      Padding: 32px               │
│ px   │                                  │
│      │                                  │
└──────┴──────────────────────────────────┘
```

---

## Dashboard Layouts

### **Mobile Stats Grid**
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │  Total Companies    │ │
│ │      47             │ │
│ │  ↑ 3 new            │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │  Active Orders      │ │
│ │      183            │ │
│ │  ↑ 12%              │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │  Pending Measure... │ │
│ │      24             │ │
│ │  ↓ 8 urgent         │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │  Production         │ │
│ │      120            │ │
│ │  ↑ 94.5%            │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   1 column, stacked
```

### **Tablet Stats Grid (2 Columns)**
```
┌──────────────────────────────────┐
│ ┌──────────────┐ ┌──────────────┐│
│ │Total Comp... │ │Active Order..││
│ │    47        │ │    183       ││
│ │ ↑ 3 new      │ │ ↑ 12%        ││
│ └──────────────┘ └──────────────┘│
│ ┌──────────────┐ ┌──────────────┐│
│ │Pending Meas..│ │Production    ││
│ │    24        │ │    120       ││
│ │ ↓ 8 urgent   │ │ ↑ 94.5%      ││
│ └──────────────┘ └──────────────┘│
└──────────────────────────────────┘
```

### **Desktop Stats Grid (4 Columns)**
```
┌────────────────────────────────────────────────────────────┐
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐        │
│ │Total  │ │Active │ │Pending│ │Produc.│ │Dispat.│        │
│ │Comp...│ │Orders │ │Measur.│ │       │ │       │        │
│ │  47   │ │  183  │ │  24   │ │  120  │ │  32   │        │
│ │↑3 new │ │↑ 12%  │ │↓8 urg.│ │↑94.5% │ │↓5 del.│        │
│ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘        │
└────────────────────────────────────────────────────────────┘
```

### **Mobile Chart Display**
```
┌─────────────────────────┐
│ Order Status Distribu.. │
│ [Live Data]             │
├─────────────────────────┤
│        ╱───╲           │
│       ╱  🥧  ╲          │
│      ╱  Pie   ╲         │
│      ╲  Chart ╱         │
│       ╲      ╱          │
│        ╲───╱            │
├─────────────────────────┤
│ • Pending     45        │
│ • In Progress 120       │
│ • Completed   230       │
└─────────────────────────┘
  Full width, stacked legend
```

---

## Data Tables

### **Desktop Table View**
```
┌────────────────────────────────────────────────────┐
│ Name        │ Email        │ Status   │ Actions   │
├────────────────────────────────────────────────────┤
│ John Doe    │ john@...     │ Active   │ [⋮]       │
│ Jane Smith  │ jane@...     │ Pending  │ [⋮]       │
│ Bob Johnson │ bob@...      │ Active   │ [⋮]       │
└────────────────────────────────────────────────────┘
```

### **Mobile Card View (NEW!)**
```
┌─────────────────────────┐
│ Name:     John Doe      │
│ Email:    john@example  │
│ Status:   Active        │
│ Role:     Manager       │
├─────────────────────────┤
│ [View] [Edit] [Delete]  │
└─────────────────────────┘

┌─────────────────────────┐
│ Name:     Jane Smith    │
│ Email:    jane@example  │
│ Status:   Pending       │
│ Role:     Employee      │
├─────────────────────────┤
│ [View] [Edit] [Delete]  │
└─────────────────────────┘

  Each row becomes a card
  All data visible
  Touch-friendly buttons
```

---

## Forms & Filters

### **Mobile Filter Panel (Collapsed)**
```
┌─────────────────────────┐
│ 🔍 Filters          [▼] │
└─────────────────────────┘
   Tap to expand
```

### **Mobile Filter Panel (Expanded)**
```
┌─────────────────────────┐
│ 🔍 Filters          [▲] │
├─────────────────────────┤
│ Search                  │
│ ┌─────────────────────┐ │
│ │ 🔍 Search orders... │ │
│ └─────────────────────┘ │
│                         │
│ Status                  │
│ ┌─────────────────────┐ │
│ │ All Statuses     [▼]│ │
│ └─────────────────────┘ │
│                         │
│ Date Range              │
│ ┌─────────────────────┐ │
│ │ Last 30 days     [▼]│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │   Clear Filters     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   Stacked fields
   Full-width inputs
```

### **Desktop Filter Panel**
```
┌────────────────────────────────────────────────────────┐
│ 🔍 Filters                                             │
├────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────┐ ┌──────────┐ [Clear]   │
│ │🔍Search...   │ │Status [▼]│ │Date  [▼] │           │
│ └──────────────┘ └──────────┘ └──────────┘           │
└────────────────────────────────────────────────────────┘
   Horizontal layout
```

### **Mobile Form**
```
┌─────────────────────────┐
│ Name                    │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Email                   │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Phone                   │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │      Submit         │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   Stacked vertically
   Full-width button
   Large touch targets
```

---

## Chat Interface

### **Mobile - Channel List**
```
┌─────────────────────────┐
│ [Back] Internal Chat    │
├─────────────────────────┤
│ 🔍 Search messages...   │
├─────────────────────────┤
│ DEPARTMENTS             │
│ ┌─────────────────────┐ │
│ │# General       [3] >│ │
│ │ Meeting at 3 PM     │ │
│ │ 5m ago              │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │# Production    [5] >│ │
│ │ Order completed     │ │
│ │ 2m ago              │ │
│ └─────────────────────┘ │
│                         │
│ DIRECT MESSAGES         │
│ ┌─────────────────────┐ │
│ │ R  Rajesh Kumar [2]>│ │
│ │    Check measure... │ │
│ │    3m ago           │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   Full screen channel list
   Tap to open conversation
```

### **Mobile - Chat View**
```
┌─────────────────────────┐
│ [←] # General    [⋮]    │
├─────────────────────────┤
│                         │
│  ┌────────────────┐     │
│  │ Good morning!  │ MG  │
│  │ 2h ago         │     │
│  └────────────────┘     │
│                         │
│  RK  ┌────────────────┐ │
│      │ Production     │ │
│      │ complete!      │ │
│      │ 1h ago         │ │
│      └────────────────┘ │
│                         │
│  ┌────────────────┐     │
│  │ Great work! 👍 │ YOU │
│  │ Just now       │     │
│  └────────────────┘     │
│                         │
├─────────────────────────┤
│ [📎] [Type message] [😊]│
│                    [→]  │
└─────────────────────────┘
   Full screen conversation
   Back button to channels
   Touch-friendly inputs
```

### **Desktop - Chat (2 Columns)**
```
┌──────────┬──────────────────────────────────┐
│CHANNELS  │ # General              [☎][📹][⋮]│
│          ├──────────────────────────────────┤
│# General │                                  │
│  [3]     │  MG  Good morning team!          │
│          │      2h ago                      │
│# Prod... │                                  │
│  [5]     │      Production complete!    RK  │
│          │                           1h ago │
│# Measure │                                  │
│  [2]     │  YOU Great work! 👍              │
│          │      Just now                    │
│          │                                  │
│DIRECT    ├──────────────────────────────────┤
│Rajesh [2]│ [📎] Type a message...  [😊] [→] │
│Priya     │                                  │
└──────────┴──────────────────────────────────┘
   Channels + Chat side-by-side
```

---

## Navigation Patterns

### **Mobile Sidebar (Closed)**
```
┌─────────────────────────┐
│ [☰] ClothingERP         │
│                         │
│   Main Content          │
│                         │
└─────────────────────────┘

← Sidebar off-screen
```

### **Mobile Sidebar (Open)**
```
┏━━━━━━━━━━━━━┓──────────┐
┃ ┌─────────┐ ┃          │
┃ │  Logo   │ ┃  [X]     │
┃ └─────────┘ ┃          │
┃ ┌─────────┐ ┃          │
┃ │ [Badge] │ ┃ Overlay  │
┃ └─────────┘ ┃          │
┃             ┃          │
┃ MASTER      ┃          │
┃ • Dashboard ┃          │
┃             ┃          │
┃ DEPARTMENTS ┃          │
┃ • HR [156]  ┃          │
┃ • Measure.  ┃          │
┃ • Produc... ┃          │
┃             ┃          │
┃ COMMUN...   ┃          │
┃ • WhatsApp  ┃          │
┃ • Chat [20] ┃          │
┗━━━━━━━━━━━━━┛──────────┘

Slides in from left
Dark overlay on content
Tap outside to close
```

### **Mobile Page Header**
```
┌─────────────────────────┐
│ Dashboard               │
│ Overview & stats        │
│ ┌─────────────────────┐ │
│ │  + New Report       │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   Stacked layout
   Full-width button
```

### **Desktop Page Header**
```
┌────────────────────────────────────────────┐
│ Dashboard                    [+ New Report]│
│ Overview & stats                           │
└────────────────────────────────────────────┘
   Side-by-side layout
```

---

## Responsive Breakpoints Visual

### **Mobile Portrait (375px)**
```
┌───────────┐
│           │
│  Single   │
│  Column   │
│           │
│  Stacked  │
│  Content  │
│           │
└───────────┘
```

### **Mobile Landscape (667px)**
```
┌─────────────────────┐
│                     │
│    Still mostly     │
│    single column    │
│                     │
└─────────────────────┘
```

### **Tablet Portrait (768px)**
```
┌─────────────────────┐
│                     │
│    Two columns      │
│  ┌────────┬───────┐ │
│  │  Left  │ Right │ │
│  └────────┴───────┘ │
│                     │
└─────────────────────┘
```

### **Tablet Landscape (1024px)**
```
┌────────────────────────────┐
│                            │
│    Three columns           │
│  ┌───┬────────┬─────────┐  │
│  │ L │ Center │  Right  │  │
│  └───┴────────┴─────────┘  │
│                            │
└────────────────────────────┘
```

### **Desktop (1280px+)**
```
┌──────────────────────────────────────┐
│                                      │
│    Full layout with sidebar          │
│  ┌─────┬──────────────────────────┐  │
│  │ Nav │      Main Content        │  │
│  │     │  ┌────┬────┬────┬────┐   │  │
│  │     │  │    │    │    │    │   │  │
│  │     │  └────┴────┴────┴────┘   │  │
│  └─────┴──────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## Touch Target Sizes

### **Mobile Touch Targets**
```
┌────────────────────────┐
│  ┌──────────────────┐  │
│  │                  │  │ ← 44px height
│  │     BUTTON       │  │   (iOS standard)
│  │                  │  │
│  └──────────────────┘  │
│        ↑               │
│      16px padding      │
└────────────────────────┘

✅ Comfortable for thumbs
✅ Easy to tap accurately
✅ Prevents mis-taps
```

### **Desktop Touch Targets**
```
┌──────────────────┐
│  ┌────────────┐  │
│  │   BUTTON   │  │ ← 32px height
│  └────────────┘  │    (smaller OK)
│                  │
└──────────────────┘

✅ Mouse precision
✅ Compact layout
```

---

## Modal/Dialog Patterns

### **Mobile Modal (Full Screen)**
```
┌─────────────────────────┐
│ [←] Add User        [✓] │
├─────────────────────────┤
│                         │
│ Name                    │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Email                   │
│ ┌─────────────────────┐ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Role                    │
│ ┌─────────────────────┐ │
│ │ Select role...   [▼]│ │
│ └─────────────────────┘ │
│                         │
│                         │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │      Save User      │ │
│ └─────────────────────┘ │
└─────────────────────────┘
   Full screen on mobile
   Fixed header & footer
   Scrollable content
```

### **Desktop Modal (Centered)**
```
      ┌──────────────────┐
      │ Add User     [✕] │
      ├──────────────────┤
      │ Name             │
      │ ┌──────────────┐ │
      │ │              │ │
      │ └──────────────┘ │
      │ Email            │
      │ ┌──────────────┐ │
      │ │              │ │
      │ └──────────────┘ │
      │ Role             │
      │ ┌──────────────┐ │
      │ │ Select... [▼]│ │
      │ └──────────────┘ │
      ├──────────────────┤
      │ [Cancel] [Save]  │
      └──────────────────┘

   Centered overlay
   Compact size
   Background dimmed
```

---

## Bottom Sheet Pattern (Mobile)

```
┌─────────────────────────┐
│                         │
│   Main Content          │
│                         │
│                         │
│   (Dimmed when          │
│    sheet is open)       │
│                         │
│  ╭─────────────────────╮│
│  │  ═══                ││ ← Handle to drag
│  ├─────────────────────┤│
│  │ Quick Actions       ││
│  ├─────────────────────┤│
│  │ □ Upload PO         ││
│  │ □ Add Employee      ││
│  │ □ Create Report     ││
│  │ □ Send WhatsApp     ││
│  ╰─────────────────────╯│
└─────────────────────────┘

Slides up from bottom
Swipe down to dismiss
Touch-friendly actions
```

---

## Pull-to-Refresh (Mobile)

```
┌─────────────────────────┐
│         ↓               │ ← Pull down
│        (🔄)             │   Loading indicator
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Order #123          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Order #124          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Order #125          │ │
│ └─────────────────────┘ │
└─────────────────────────┘

Native mobile gesture
Refreshes data
Familiar UX pattern
```

---

## Empty States

### **Mobile Empty State**
```
┌─────────────────────────┐
│                         │
│         ╱───╲           │
│        │     │          │
│        │  📦 │          │ ← Large icon
│        │     │          │
│         ╲───╱           │
│                         │
│   No orders yet         │ ← Clear message
│                         │
│  Start by uploading     │ ← Helpful hint
│  a purchase order       │
│                         │
│ ┌─────────────────────┐ │
│ │   Upload PO         │ │ ← Primary action
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘

Centered vertically
Clear call-to-action
Friendly & helpful
```

---

## Loading States

### **Skeleton Screens (Mobile)**
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │ ███████████         │ │ ← Animated
│ │ ████████            │ │   shimmer
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ███████████         │ │
│ │ ████████            │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ███████████         │ │
│ │ ████████            │ │
│ └─────────────────────┘ │
└─────────────────────────┘

Shows content structure
Reduces perceived wait time
Professional appearance
```

---

## Toast Notifications (Mobile)

```
┌─────────────────────────┐
│                         │
│   Main Content          │
│                         │
│                         │
│  ┌───────────────────┐  │
│  │ ✓ Order created   │  │ ← Toast
│  │   successfully!   │  │   slides up
│  └───────────────────┘  │
│                         │
└─────────────────────────┘

Bottom positioned
Auto-dismisses
Clear feedback
```

---

## Conclusion

These visual examples demonstrate how **ClothingERP** adapts to different screen sizes while maintaining usability and functionality. The mobile-first approach ensures that the application works seamlessly on all devices, providing an optimal user experience regardless of the device being used.

### **Key Principles Applied:**
✅ Progressive enhancement
✅ Touch-first interactions
✅ Readable content
✅ Easy navigation
✅ Clear hierarchy
✅ Consistent patterns

---

**ClothingERP - Enterprise Manufacturing at Your Fingertips** 📱✨
