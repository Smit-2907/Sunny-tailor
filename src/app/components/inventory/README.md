# Fabric Inventory Management System

## Overview
A comprehensive fabric inventory management screen with role-based access control (RBAC). The system allows all users to view stock levels while restricting stock updates to authorized roles only.

## Features

### 📊 **Core Functionality**
- **Real-time Stock Monitoring**: View current stock levels with visual indicators
- **Stock Level Alerts**: Critical, Low, Sufficient, and Overstocked status tracking
- **Comprehensive Filtering**: Search by code, name, color, supplier with multi-filter support
- **Stock Adjustments**: Add or remove stock with reason tracking
- **Inventory Statistics**: Total items, inventory value, low stock alerts
- **Export Capabilities**: Export inventory data for reporting

### 🔐 **Role-Based Access Control**

#### **Viewing Access (All Users)**
- View complete fabric inventory
- See stock levels and status
- Check fabric details
- View supplier information
- Access historical restock data

#### **Editing Access (Fabric Store + Master Admin Only)**
- Update stock levels
- Add new fabric items
- Adjust inventory (add/remove stock)
- Track adjustment reasons
- Update fabric details

#### **Restricted Users**
- See disabled input fields
- View-only notice displayed
- Cannot modify stock levels
- All data is read-only

## Components

### `FabricInventoryScreen`
Main component located at: `/src/app/components/inventory/fabric-inventory-screen.tsx`

**Props:**
```typescript
interface FabricInventoryScreenProps {
  currentRole: string; // User's current role
}
```

**Supported Roles:**
- `fabric-store` - Full edit access
- `master-manager` - Full edit access
- All other roles - View-only access

## Data Structure

### Fabric Item
```typescript
interface FabricItem {
  id: string;
  fabricCode: string;        // Unique fabric identifier (e.g., FAB-001)
  fabricName: string;        // Display name
  fabricType: string;        // Cotton, Polyester, Linen, etc.
  color: string;             // Fabric color
  currentStock: number;      // Current available quantity
  minimumStock: number;      // Minimum threshold
  maximumStock: number;      // Maximum capacity
  unit: string;              // meters, yards, kilograms
  pricePerUnit: number;      // Price in ₹
  location: string;          // Storage location (e.g., Rack A1)
  supplier: string;          // Supplier name
  lastUpdated: string;       // Last modification date
  status: "sufficient" | "low" | "critical" | "overstocked";
  lastRestockDate: string;   // Date of last restock
  lastRestockQuantity: number; // Quantity of last restock
}
```

## Stock Status Logic

### Status Determination
- **Critical**: Stock < 50% of minimum threshold
- **Low**: Stock < minimum threshold
- **Sufficient**: Stock between minimum and maximum
- **Overstocked**: Stock > maximum threshold

### Visual Indicators
- **Critical**: Red badge, red progress bar
- **Low**: Yellow badge, yellow progress bar
- **Sufficient**: Green badge, green progress bar
- **Overstocked**: Blue badge, blue progress bar

## Usage Examples

### 1. Fabric Store Role
```tsx
import { FabricInventoryScreen } from "@/app/components/inventory/fabric-inventory-screen";

export function FabricStoreDashboard() {
  return <FabricInventoryScreen currentRole="fabric-store" />;
}
```

### 2. Master Admin Role
```tsx
export function MasterAdminDashboard() {
  return <FabricInventoryScreen currentRole="master-manager" />;
}
```

### 3. View-Only Role (HR, Production, etc.)
```tsx
export function HRDashboard() {
  // HR can view inventory but cannot edit
  return <FabricInventoryScreen currentRole="hr" />;
}
```

## Key Features Detail

### 1. **Advanced Filtering**
- Search by fabric code, name, color, or supplier
- Filter by stock status (All, Sufficient, Low, Critical, Overstocked)
- Filter by fabric type (Cotton, Polyester, Linen, etc.)
- Active filter count display
- Clear all filters with one click

### 2. **Stock Adjustment System** (Authorized Users Only)
- **Add Stock**: Record new shipments and restocks
- **Remove Stock**: Track usage, damage, or wastage
- **Reason Tracking**: Mandatory reason for all adjustments
- **Preview**: See new stock level before saving
- **Audit Trail**: Track last restock date and quantity

### 3. **Visual Stock Monitoring**
- Progress bars showing stock percentage
- Color-coded status badges
- Min/Max range display
- Stock level alerts
- Critical stock banner at top

### 4. **Comprehensive Details View**
Each fabric item shows:
- Fabric specifications (code, name, type, color)
- Current stock vs. Min/Max thresholds
- Storage location
- Supplier information
- Price per unit
- Total value calculation
- Last restock information
- Last update timestamp

### 5. **Statistics Dashboard**
- Total Fabric Items count
- Total Inventory Value (₹)
- Low Stock Items count
- Critical Stock Items count

## Permission Matrix

| Feature | Master Admin | Fabric Store | Other Roles |
|---------|-------------|--------------|-------------|
| View Inventory | ✅ | ✅ | ✅ |
| View Stock Levels | ✅ | ✅ | ✅ |
| View Details | ✅ | ✅ | ✅ |
| Update Stock | ✅ | ✅ | ❌ |
| Add Fabric | ✅ | ✅ | ❌ |
| Remove Stock | ✅ | ✅ | ❌ |
| Export Data | ✅ | ✅ | ✅ |

## UI/UX Features

### For Authorized Users (Fabric Store + Master Admin)
- "Update" button on each row
- Stock adjustment dialog with full controls
- Add new fabric button
- Editable fields with validation

### For Restricted Users (All Others)
- "View" button (instead of "Update")
- Blue notice banner explaining view-only access
- Lock icon indicators
- Disabled input fields with explanation
- Read-only detail dialogs

## Best Practices

### 1. **Stock Updates**
- Always provide a clear reason for adjustments
- Review the preview before saving
- Check if stock falls below minimum threshold
- Verify supplier information

### 2. **Critical Stock Management**
- Monitor the critical stock alert banner
- Filter by "critical" status regularly
- Plan restocks before reaching critical levels
- Set appropriate min/max thresholds

### 3. **Data Accuracy**
- Keep supplier information up to date
- Maintain accurate location data
- Update prices regularly
- Record all stock movements

## Integration

### Connected Components
- `SharedFilters` - Reusable filter component
- `StatCard` - Statistics display
- `PageHeader` - Page header with actions
- `Table` - Data table display
- `Dialog` - Modal dialogs
- `Badge` - Status indicators

### Data Flow
1. Component receives `currentRole` prop
2. Permission check: `canEdit` vs `canViewOnly`
3. UI adapts based on permissions
4. Stock updates modify local state
5. Status recalculated automatically
6. Visual indicators update in real-time

## Future Enhancements
- Backend integration for persistent storage
- Stock movement history/audit log
- Automated reorder suggestions
- Low stock email notifications
- Barcode scanning support
- Batch stock updates
- Advanced reporting and analytics
- Integration with Purchase Orders
- Supplier performance tracking

## Support
For issues or questions regarding the Fabric Inventory System, contact the development team or refer to the main application documentation.
