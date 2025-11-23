# VLC Fundraising Event Planner

A React application for planning and comparing fundraising events for Chapel School. Calculate profitability, efficiency metrics, and manage event details.

## Features

- Compare 5 different fundraising event types
- Calculate net profit, person power, and profit per hour
- Sortable comparison dashboard
- Editable inputs for revenue and expenses
- Difficulty ratings and notes for each event

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. **Push your code to GitHub** (already done!)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository: `thedoctorJJ/VLC-fundraising-event-planner`
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy"

3. **That's it!** Your app will be live in seconds.

The `vercel.json` file is already configured for optimal deployment.

## Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages
Requires additional configuration. See [Vite deployment docs](https://vitejs.dev/guide/static-deploy.html#github-pages).

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

