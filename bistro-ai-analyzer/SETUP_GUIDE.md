
# Restaurant Management System - Local Setup Guide

## Prerequisites
Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Git** (optional but recommended)
   - Download from: https://git-scm.com/

## Project Structure
```
restaurant-management-system/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── CustomerSentiment.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MenuManagement.tsx
│   │   ├── MenuView.tsx
│   │   ├── OrderManagement.tsx
│   │   ├── OrderTaking.tsx
│   │   ├── OwnerDashboard.tsx
│   │   ├── PeakHoursAnalysis.tsx
│   │   └── StaffDashboard.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication logic
│   │   └── DataContext.tsx     # Data management
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   └── utils.ts            # Utility functions
│   ├── pages/
│   │   └── NotFound.tsx
│   ├── types/
│   │   ├── auth.ts             # Authentication types
│   │   ├── menu.ts             # Menu item types
│   │   └── order.ts            # Order types
│   ├── App.tsx                 # Main application component
│   ├── index.css               # Global styles
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── package-lock.json           # Locked dependency versions
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── README.md                   # Project documentation
```

## Installation Steps

### Method 1: Download from Lovable (Recommended)
1. Go to your Lovable project: https://lovable.dev/projects/a4f3dcfd-869c-48e5-84f9-01a7213f1272
2. Click on the GitHub button (top right) to transfer your code to GitHub
3. Clone your repository:
   ```bash
   git clone <your-github-repo-url>
   cd <your-project-name>
   ```

### Method 2: Manual Setup
1. Create a new folder for your project:
   ```bash
   mkdir restaurant-management-system
   cd restaurant-management-system
   ```

2. Copy all the files from your Lovable project to this folder

### After Getting the Code
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### For Staff Users:
- **Order Taking**: Take orders by selecting menu items and setting table numbers
- **Menu View**: View available menu items organized by category

### For Owner Users:
- **Menu Management**: Create, update, and manage menu items and categories
- **Order Management**: View orders by table, update order status, and mark bills as paid
- **Analytics Dashboard**: View sales data, popular items, and business insights
- **Reports**: Access detailed business reports

## Login Credentials

### Owner Account:
- Username: `owner`
- Password: `password`

### Staff Account:
- Username: `staff`
- Password: `password`

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Context API
- **Data Storage**: localStorage (for demo purposes)
- **Charts**: Recharts
- **Icons**: Lucide React

## Customization

### Adding New Menu Items:
1. Login as owner
2. Go to "Menu Management" tab
3. Click "Add New Item"
4. Fill in the details and save

### Managing Orders:
1. Staff can take orders in the "Take Orders" tab
2. Owner can view and manage orders in the "Order Status" tab
3. Update order status from pending → preparing → ready → delivered
4. Mark bills as paid to remove completed orders

## Troubleshooting

### Common Issues:

1. **Port already in use**:
   ```bash
   # Kill process on port 8080
   npx kill-port 8080
   # Or use a different port
   npm run dev -- --port 3000
   ```

2. **Node modules issues**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**:
   ```bash
   # Check TypeScript configuration
   npx tsc --noEmit
   ```

## Production Deployment

### Build for production:
```bash
npm run build
```

### Deploy options:
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions

## Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed correctly
3. Verify Node.js version compatibility
4. Refer to the troubleshooting section above

## Next Steps

1. **Database Integration**: Consider integrating with Supabase for persistent data storage
2. **Authentication**: Implement proper user authentication
3. **Real-time Updates**: Add WebSocket support for real-time order updates
4. **Mobile Responsive**: Further optimize for mobile devices
5. **Printing**: Add receipt printing functionality

Happy coding! 🚀
