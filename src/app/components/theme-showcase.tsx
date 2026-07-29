import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Building2,
  Users,
  Factory,
  Package
} from "lucide-react";

/**
 * Theme Showcase Component
 * Demonstrates the light theme design system
 * Use this as a reference for building new components
 */
export function ThemeShowcase() {
  return (
    <div className="space-y-8 p-8 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Light Theme Showcase</h1>
        <p className="text-muted-foreground">
          Complete design system reference for the Clothing Manufacturing ERP
        </p>
      </div>

      {/* Color Palette */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Primary */}
          <div>
            <div className="h-20 bg-indigo-600 rounded-lg mb-2" />
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">#4F46E5</p>
          </div>
          
          {/* Success */}
          <div>
            <div className="h-20 bg-green-600 rounded-lg mb-2" />
            <p className="text-sm font-medium">Success</p>
            <p className="text-xs text-muted-foreground">#10B981</p>
          </div>
          
          {/* Error */}
          <div>
            <div className="h-20 bg-red-600 rounded-lg mb-2" />
            <p className="text-sm font-medium">Error</p>
            <p className="text-xs text-muted-foreground">#EF4444</p>
          </div>
          
          {/* Warning */}
          <div>
            <div className="h-20 bg-yellow-600 rounded-lg mb-2" />
            <p className="text-sm font-medium">Warning</p>
            <p className="text-xs text-muted-foreground">#F59E0B</p>
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Primary Button
          </Button>
          <Button variant="secondary">
            Secondary Button
          </Button>
          <Button variant="outline">
            Outline Button
          </Button>
          <Button variant="ghost">
            Ghost Button
          </Button>
          <Button variant="destructive">
            Destructive Button
          </Button>
          <Button disabled>
            Disabled Button
          </Button>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Master Manager
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            HR
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Critical
          </Badge>
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Production
          </Badge>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Alerts</h2>
        <div className="space-y-3">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Success</AlertTitle>
            <AlertDescription className="text-green-800">
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Information</AlertTitle>
            <AlertDescription className="text-blue-800">
              This is an informational message.
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-900">Warning</AlertTitle>
            <AlertDescription className="text-yellow-800">
              Please review before proceeding.
            </AlertDescription>
          </Alert>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900">Error</AlertTitle>
            <AlertDescription className="text-red-800">
              An error occurred. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Forms */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Form Elements</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <Label htmlFor="select">Select Role</Label>
            <select 
              id="select"
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option>Master Manager</option>
              <option>HR</option>
              <option>Production Manager</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <Label htmlFor="checkbox" className="font-normal">
              I agree to the terms and conditions
            </Label>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">425</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 12% vs last month</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 3 new this month</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Production</p>
                <p className="text-2xl font-bold">94.6%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">↑ 2.3% vs last month</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">↓ 5 urgent</p>
          </Card>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-3">
          <h1 className="text-foreground">Heading 1 - Large Title</h1>
          <h2 className="text-foreground">Heading 2 - Section Title</h2>
          <h3 className="text-foreground">Heading 3 - Subsection</h3>
          <h4 className="text-foreground">Heading 4 - Small Heading</h4>
          <p className="text-foreground">
            Body text - Regular paragraph with comfortable reading size.
          </p>
          <p className="text-muted-foreground">
            Muted text - Secondary information and descriptions.
          </p>
          <p className="text-sm text-muted-foreground">
            Small text - Captions, hints, and metadata.
          </p>
        </div>
      </Card>

      {/* Background Examples */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Backgrounds</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm font-medium">Card Background</p>
            <p className="text-xs text-muted-foreground">#FFFFFF</p>
          </div>
          <div className="p-4 bg-background border border-gray-200 rounded-lg">
            <p className="text-sm font-medium">Page Background</p>
            <p className="text-xs text-muted-foreground">#F9FAFB</p>
          </div>
          <div className="p-4 bg-muted border border-gray-200 rounded-lg">
            <p className="text-sm font-medium">Muted Background</p>
            <p className="text-xs text-muted-foreground">#F3F4F6</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
