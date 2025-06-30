
# Local Development Guide

## Quick Start Commands

```bash
# 1. Install Node.js from https://nodejs.org/
# 2. Clone or download your project
# 3. Navigate to project directory
cd restaurant-management-system

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev

# 6. Open browser to http://localhost:8080
```

## File Structure Explanation

### Core Application Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main app component with routing
- `index.html` - HTML template

### Key Components
- `src/components/OwnerDashboard.tsx` - Owner interface
- `src/components/StaffDashboard.tsx` - Staff interface
- `src/components/MenuManagement.tsx` - Menu CRUD operations
- `src/components/OrderManagement.tsx` - Order tracking
- `src/components/OrderTaking.tsx` - Staff order creation

### Data Management
- `src/contexts/DataContext.tsx` - Manages menu items and orders
- `src/contexts/AuthContext.tsx` - Handles user authentication
- `src/types/` - TypeScript type definitions

### Styling
- `src/index.css` - Global styles with Tailwind CSS
- `tailwind.config.ts` - Tailwind configuration
- `src/components/ui/` - Reusable UI components

## Development Workflow

1. **Make Changes**: Edit files in `src/` directory
2. **Hot Reload**: Changes automatically appear in browser
3. **Debug**: Use browser developer tools
4. **Build**: Run `npm run build` for production

## Key Features to Test

1. **Login System**:
   - Owner: username `owner`, password `password`
   - Staff: username `staff`, password `password`

2. **Menu Management** (Owner only):
   - Create menu categories and items
   - Set prices and descriptions
   - Enable/disable items

3. **Order Taking** (Staff):
   - Select menu items
   - Set table numbers
   - Calculate totals

4. **Order Management** (Owner):
   - View orders by table
   - Update order status
   - Mark bills as paid

## Customization Tips

### Adding New Features:
1. Create new component in `src/components/`
2. Add to appropriate dashboard
3. Update types in `src/types/` if needed

### Styling Changes:
- Use Tailwind CSS classes
- Modify `src/index.css` for global styles
- Components use shadcn/ui for consistency

### Data Persistence:
- Currently uses localStorage
- Consider Supabase integration for production
- Update DataContext.tsx for new storage methods

## Deployment Preparation

### Before deploying:
1. Run `npm run build`
2. Test the `dist/` folder contents
3. Set up environment variables if needed
4. Configure your hosting platform

### Recommended Hosting:
- **Vercel** (easiest for React apps)
- **Netlify** (great for static sites)
- **GitHub Pages** (free option)
