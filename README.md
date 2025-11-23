# VLC Fundraising Event Planner

A React application for planning and comparing fundraising events for Chapel School. Calculate profitability, efficiency metrics, and manage event details.

**Live Site:** https://vlc-fundraising-event-planner-exa9znmfu.vercel.app

## Features

- Compare 5 different fundraising event types
- Calculate net profit, person power, and profit per hour
- Sortable comparison dashboard
- Editable inputs for revenue and expenses
- Difficulty ratings and notes for each event
- Real-time profitability calculations
- Responsive design with modern UI

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

## Collaboration

### For Collaborators

This project supports collaboration through AI assistants (ChatGPT, Gemini, Cursor):

1. **Get GitHub Access:**
   - Ask the repository owner to add you as a collaborator
   - Accept the invitation email

2. **Using Cursor (Recommended):**
   - Install [Cursor](https://cursor.sh)
   - Clone: `https://github.com/thedoctorJJ/VLC-fundraising-event-planner.git`
   - Open in Cursor and use built-in AI to make changes
   - Commit and push changes

3. **Using ChatGPT/Gemini:**
   - Share the repo URL: `https://github.com/thedoctorJJ/VLC-fundraising-event-planner`
   - Ask the AI to help you make changes
   - Use GitHub's web editor to apply changes
   - Or clone locally and push changes

4. **No Git Experience Needed:**
   - AI assistants can guide you through all steps
   - GitHub web interface allows editing without terminal
   - Changes auto-deploy to Vercel

## Project Structure

```
vlc-fundraising-event-planner/
├── App.tsx              # Main application component
├── main.tsx             # React entry point
├── index.html           # HTML template
├── index.css            # Tailwind CSS imports
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vercel.json          # Vercel deployment config
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Event Types

The app supports 5 fundraising event types:

1. **Camps for Holiday Breaks** - Holiday camps for students
2. **SAT and PSAT Prep Classes** - Test preparation courses
3. **TACHS Prep Classes** - Catholic high school entrance exam prep
4. **Christmas Market** - Vendor market with table rentals
5. **Sip and Paint Evening** - Adult painting event with wine

