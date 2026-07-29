# Raw Material Inventory Management System

## Overview
A comprehensive raw material inventory management screen with advanced role-based access control (RBAC), lock icons, and tooltip explanations for better user experience. The system allows all users to view inventory while restricting editing capabilities to authorized roles only.

## Features

### 🔐 **Enhanced Security Features**
- **Lock Icons**: Visual indicators on restricted actions
- **Tooltip Explanations**: Hover over lock icons for detailed permission info
- **Permission Banners**: Clear notices for view-only users
- **Role-Based UI**: Interface adapts based on user permissions

### 📊 **Core Functionality**
- **Real-time Stock Monitoring**: View current stock with visual progress bars
- **Reorder Point Tracking**: Alerts when stock falls below reorder threshold
- **Lead Time Management**: Track supplier lead times for planning
- **Stock Level Alerts**: Critical, Low, Sufficient, and Overstocked status
- **Advanced Filtering**: Multi-filter support with active count
- **Stock Adjustments**: Add/remove stock with mandatory reason tracking
- **Inventory Statistics**: 4 KPI cards with real-time data

### 💡 **User Experience Enhancements**
- **Tooltips on Lock Icons**: Explains why features are locked
- **Tooltips on Reorder Points**: Shows lead time information
- **Tooltips on Buttons**: Action explanations for all users
- **Visual Feedback**: Color-coded status indicators
- **Responsive Design**: Works seamlessly on all devices

## Components

### `RawMaterialInventoryScreen`
Main component located at: `/src/app/components/inventory/raw-material-inventory-screen.tsx`

**Props:**
```typescript
interface RawMaterialInventoryScreenProps {
  currentRole: string; // User's current role
}
```

**Supported Roles:**
- `raw-material` - Full edit access
- `master-manager` - Full edit access
- All other roles - View-only access

## Data Structure

### Raw Material Item
```typescript
interface RawMaterialItem {
  id: string;
  materialCode: string;        // Unique material identifier (e.g., RM-001)
  materialName: string;         // Display name
  category: string;             // Thread & Yarn, Fasteners, etc.
  subCategory: string;          // Specific type within category
  currentStock: number;         // Current available quantity
  minimumStock: number;         // Minimum threshold
  maximumStock: number;         // Maximum capacity
  unit: string;                 // pieces, spools, meters, packs, boxes
  pricePerUnit: number;         // Price in ₹
  location: string;             // Storage location (e.g., Shelf A1-01)
  supplier: string;             // Supplier name
  lastUpdated: string;          // Last modification date
  status: "sufficient" | "low" | "critical" | "overstocked";
  lastRestockDate: string;      // Date of last restock
  lastRestockQuantity: number;  // Quantity of last restock
  reorderPoint: number;         // Stock level to trigger reorder
  leadTimeDays: number;         // Supplier lead time in days
}
```

## Material Categories

### Supported Categories
1. **Thread & Yarn**
   - Polyester Thread
   - Cotton Thread
   - Nylon Thread
   
2. **Fasteners**
   - Buttons (Metal, Plastic, Wood)
   - Zippers (Metal, Plastic, Invisible)
   - Snaps
   - Hooks & Eyes
   - Velcro

3. **Elastic & Trims**
   - Elastic Bands (various widths)
   - Ribbons
   - Bias Tape
   - Piping

4. **Labels & Tags**
   - Woven Labels
   - Printed Labels
   - Hang Tags
   - Care Labels

5. **Interfacing**
   - Interlining Fabric
   - Fusible Interfacing
   - Non-fusible Interfacing

6. **Notions**
   - Needles
   - Pins
   - Thimbles
   - Measuring Tools

## Stock Status Logic

### Status Determination
- **Critical**: Stock < 50% of minimum threshold
- **Low**: Stock < minimum threshold
- **Sufficient**: Stock between minimum and maximum
- **Overstocked**: Stock > maximum threshold

### Reorder Point System
- **Alert Triggered**: When currentStock ≤ reorderPoint
- **Visual Indicator**: Orange warning icon with tooltip
- **Tooltip Info**: Shows lead time for planning
- **Proactive Management**: Order before reaching critical levels

## Tooltip System

### 🔒 **Lock Icon Tooltips**

#### 1. **Add Material Button** (View-Only Users)
```
"Adding new materials requires Raw Material Store or Master Admin role"
```

#### 2. **Dialog Title Lock Icon**
```
"Stock editing is disabled for your role. Contact Raw Material Store or 
Master Admin for changes."
```

#### 3. **View-Only Notice**
```
"You do not have permission to modify stock levels. Required role: 
Raw Material Store or Master Admin."
```

### ℹ️ **Information Tooltips**

#### 1. **Reorder Point**
```
"Stock level at which new orders should be placed"
```

#### 2. **Reorder Alert** (When below reorder point)
```
"Below reorder point! Lead time: X days"
```

#### 3. **View Button** (View-Only Users)
```
"View details (Read-only)"
```

## Permission Matrix

| Feature | Master Admin | Raw Material Store | Other Roles |
|---------|-------------|-------------------|-------------|
| View Inventory | ✅ | ✅ | ✅ |
| View Stock Levels | ✅ | ✅ | ✅ |
| View Details | ✅ | ✅ | ✅ |
| View Tooltips | ✅ | ✅ | ✅ |
| **Update Stock** | ✅ | ✅ | ❌ 🔒 |
| **Add Material** | ✅ | ✅ | ❌ 🔒 |
| **Adjust Inventory** | ✅ | ✅ | ❌ 🔒 |
| Export Data | ✅ | ✅ | ✅ |

🔒 = Lock icon with tooltip explanation

## UI/UX Features

### For Authorized Users (Raw Material Store + Master Admin)
- ✅ "Update Stock" button on each row
- ✅ Stock adjustment dialog with full controls
- ✅ "Add Material" button enabled
- ✅ Editable fields with validation
- ✅ Save changes functionality

### For Restricted Users (All Others)
- 👁️ "View Details" button instead of "Update"
- 🔵 Blue notice banner with clear explanation
- 🔒 Lock icons on disabled features
- 💬 Tooltips explaining restrictions
- 📖 Read-only detail dialogs
- ℹ️ Contextual help throughout

## Visual Indicators

### Status Badges
- 🟢 **Sufficient**: Green badge with checkmark
- 🟡 **Low Stock**: Yellow badge with trending down icon
- 🔴 **Critical**: Red badge with alert triangle
- 🔵 **Overstocked**: Blue badge with trending up icon

### Progress Bars
- Color-coded to match status
- Shows percentage of maximum capacity
- Visual stock level indicator

### Alerts & Warnings
- 🚨 Critical stock alert banner (top of page)
- ⚠️ Reorder point warning (in table)
- 🔔 Below reorder point notification (in details)

## Usage Examples

### 1. Raw Material Store Role (Full Access)
```tsx
import { RawMaterialInventoryScreen } from "@/app/components/inventory/raw-material-inventory-screen";

export function RawMaterialDashboard() {
  return <RawMaterialInventoryScreen currentRole="raw-material" />;
}
```

### 2. Master Admin Role (Full Access)
```tsx
export function MasterAdminDashboard() {
  return <RawMaterialInventoryScreen currentRole="master-manager" />;
}
```

### 3. View-Only Roles (HR, Production, etc.)
```tsx
export function ProductionDashboard() {
  // Production can view inventory but cannot edit
  // Lock icons and tooltips explain restrictions
  return <RawMaterialInventoryScreen currentRole="production" />;
}
```

## Key Features Detail

### 1. **Advanced Filtering System**
- **Search**: Material code, name, category, or supplier
- **Status Filter**: All, Sufficient, Low, Critical, Overstocked
- **Category Filter**: All categories or specific category
- **Active Count**: Shows number of active filters
- **Clear All**: One-click filter reset

### 2. **Reorder Point Management**
- Automatic alerts when stock ≤ reorder point
- Orange warning icon in table
- Tooltip shows lead time for planning
- Helps prevent stockouts
- Proactive inventory management

### 3. **Stock Adjustment System** (Authorized Only)
- **Add Stock**: Record new shipments
- **Remove Stock**: Track usage or damage
- **Reason Required**: Mandatory explanation
- **Preview**: See new level before saving
- **Auto-Status**: Updates status automatically

### 4. **Comprehensive Details View**
Each material shows:
- Material specifications (code, name, category, sub-category)
- Current stock vs. Min/Max/Reorder thresholds
- 4-card stock summary (Current, Min, Max, Reorder)
- Storage location and supplier info
- Price per unit and lead time
- Last restock information
- Status with reorder alerts

### 5. **Interactive Tooltips**
- 🔒 Lock icons explain access restrictions
- ℹ️ Info icons provide context
- ⚠️ Warning icons show urgency
- 💡 Educational tooltips throughout
- 🎯 Improves user understanding

## Best Practices

### 1. **Reorder Point Planning**
- Set reorder point = (lead time demand) + safety stock
- Monitor items at or below reorder point
- Plan orders considering supplier lead time
- Maintain safety stock for critical items

### 2. **Stock Monitoring**
- Check critical stock alerts daily
- Filter by "critical" status regularly
- Review low stock items weekly
- Monitor overstocked items monthly

### 3. **Data Accuracy**
- Always provide clear adjustment reasons
- Update prices and lead times regularly
- Verify supplier information
- Maintain accurate location data
- Record all stock movements

### 4. **User Education**
- Hover over lock icons to understand restrictions
- Read tooltip explanations
- Contact authorized users for stock updates
- Use export feature for reporting

## Accessibility Features

### ✨ **Enhanced Tooltips**
- Clear, concise explanations
- Max-width for readability
- Appears on hover
- Works with keyboard navigation
- Mobile-friendly

### 🎨 **Visual Hierarchy**
- Color-coded status system
- Icon-based indicators
- Clear section headings
- Consistent spacing
- Professional typography

### ♿ **Inclusive Design**
- Keyboard accessible
- Screen reader friendly
- High contrast colors
- Clear focus states
- Semantic HTML

## Integration

### Connected Components
- `SharedFilters` - Reusable filter component
- `StatCard` - Statistics display
- `PageHeader` - Page header with actions
- `Table` - Data table display
- `Dialog` - Modal dialogs
- `Badge` - Status indicators
- `Tooltip` - Contextual help
- `TooltipProvider` - Tooltip wrapper

### Dependencies
```typescript
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
```

## Future Enhancements

### Planned Features
- 📊 Stock movement history with charts
- 📧 Email notifications for critical stock
- 📱 Mobile app integration
- 🤖 AI-powered demand forecasting
- 📦 Barcode scanning support
- 🔄 Automatic reorder suggestions
- 📈 Advanced analytics dashboard
- 🔗 Purchase order integration
- 📋 Batch stock operations
- 🏷️ QR code generation for materials

### Advanced Tooltips
- Interactive tutorials
- Video help links
- Multi-step guides
- Context-sensitive help
- Personalized tips

## Troubleshooting

### Common Issues

**Q: Why can't I update stock?**
A: Hover over the lock icon to see required permissions. Contact Raw Material Store or Master Admin.

**Q: What does the orange warning icon mean?**
A: Hover over it - it indicates stock is at or below the reorder point. Check lead time in tooltip.

**Q: How do I know my access level?**
A: Check the blue banner at the top. View-only users see a lock icon notice.

**Q: Where can I find help?**
A: Hover over any lock icon or info icon for contextual help and explanations.

## Support

For questions or issues:
1. Hover over lock/info icons for immediate help
2. Check the permission banner at the top
3. Contact your system administrator
4. Refer to the main application documentation

---

**Built with ❤️ for enterprise manufacturing operations**
