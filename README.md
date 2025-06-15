# Smart Lead Scoring & Qualification Tool

A sophisticated full-stack application for scoring and qualifying sales leads based on company data. Upload CSV files, automatically score leads using intelligent algorithms, and manage your sales pipeline with an intuitive dashboard.

## 🚀 Features

### Core Functionality
- **CSV Upload System**: Drag-and-drop interface with data validation
- **Intelligent Scoring Algorithm**: Multi-factor scoring based on:
  - Company Size (0-25 points)
  - Industry Type (0-25 points)
  - Location (0-20 points)
  - Data Completeness (0-30 points)
- **Lead Categorization**: Automatic classification into Hot (80-100), Warm (50-79), Cold (0-49)
- **Interactive Dashboard**: Three-column layout with real-time statistics
- **Advanced Filtering**: Search, industry, location, and score range filters
- **Export Capabilities**: CSV export with scores, top performers, and priority lists
- **Smart Insights**: AI-powered recommendations and analytics

### UI/UX Features
- Modern, responsive design
- Color-coded lead categories
- Animated transitions and hover effects
- Detailed lead information modals
- Score breakdown explanations
- Real-time statistics and charts

## 🛠️ Tech Stack

**Frontend:**
- React.js
- CSS3 with modern animations
- Papa Parse (CSV processing)
- Responsive design

**Backend:**
- Node.js
- Express.js
- CORS enabled
- Development with Nodemon

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14.0 or higher)
- npm (comes with Node.js)
- Git (optional, for cloning)

## 🔧 Installation & Setup

### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd smart-lead-scoring

# Or download and extract the ZIP file
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5001`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend application will start on `http://localhost:3000`

### 4. Verify Installation
- Backend: Visit `http://localhost:5001` - you should see "Smart Lead Scoring API is running!"
- Frontend: Visit `http://localhost:3000` - you should see the application dashboard

## 📊 Sample Dataset

The project includes a sample dataset (`sample_leads.csv`) with 15 companies across various industries. You can use this to test the application immediately after setup.

### Dataset Structure
The CSV file should contain the following columns:
- **Company Name** (required)
- **Industry** (required)
- **Location** (required)
- **Employee Count** (required)
- **Revenue** (optional)
- **Phone** (optional)
- **Website** (optional)
- **Address** (optional)

### Sample Data Preview
```csv
Company Name,Industry,Location,Employee Count,Revenue,Phone,Website,Address
TechCorp Solutions,Technology,San Francisco,150,$5M,(555) 123-4567,www.techcorp.com,123 Tech St
HealthPlus Medical,Healthcare,New York,75,$3M,(555) 234-5678,www.healthplus.com,456 Health Ave
...
```

## 🎯 Usage Guide

### 1. Upload Leads
1. Click "Choose File" or drag and drop a CSV file
2. Preview the data and verify column mapping
3. Click "Confirm Upload" to process leads

### 2. View Dashboard
- **Hot Leads** (Red): Scores 80-100 - High priority prospects
- **Warm Leads** (Amber): Scores 50-79 - Medium priority prospects  
- **Cold Leads** (Gray): Scores 0-49 - Low priority prospects

### 3. Filter and Search
- Use the search bar to find specific companies
- Filter by industry, location, or score range
- Sort by score, company name, or other criteria

### 4. View Lead Details
- Click on any lead card to see detailed information
- View score breakdown and explanations
- See all available contact information

### 5. Export Data
- Export all leads with scores
- Export top 10 performers
- Export by priority category
- Download as CSV format

### 6. Smart Insights
- View analytics on lead distribution
- Get AI-powered recommendations
- See industry and location trends

## 🏗️ Project Structure

```
smart-lead-scoring/
├── backend/
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   └── node_modules/          # Backend packages
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── CSVUploader.js
│   │   │   ├── Dashboard.js
│   │   │   ├── LeadCard.js
│   │   │   ├── FilterPanel.js
│   │   │   ├── StatsCards.js
│   │   │   ├── SmartInsights.js
│   │   │   ├── ScoreDistribution.js
│   │   │   ├── ExportPanel.js
│   │   │   └── LeadDetailModal.js
│   │   ├── utils/
│   │   │   └── scoringEngine.js # Scoring algorithms
│   │   ├── App.js             # Main application
│   │   ├── App.css            # Styles
│   │   └── index.js           # React entry point
│   ├── package.json           # Frontend dependencies
│   └── node_modules/          # Frontend packages
├── sample_leads.csv           # Sample dataset
└── README.md                  # This file
```

## 🎨 Scoring Algorithm Details

### Company Size Score (0-25 points)
- 1-10 employees: 5 points
- 11-50 employees: 10 points  
- 51-200 employees: 20 points
- 200+ employees: 25 points

### Industry Score (0-25 points)
- **High Growth** (25 points): Technology, Healthcare, Fintech, E-commerce, SaaS, Biotech
- **Stable** (15 points): Education, Government, Non-profit, Utilities
- **Traditional** (10 points): Manufacturing, Retail, Construction, Agriculture

### Location Score (0-20 points)
- **Major Metro** (20 points): San Francisco, New York, Los Angeles, Chicago, Boston, Seattle, Austin
- **Secondary Cities** (15 points): Denver, Atlanta, Phoenix, Portland, San Diego
- **Other Locations** (10 points): All other cities

### Data Completeness (0-30 points)
- Complete contact info (Phone + Website + Address): 30 points
- Partial contact info (2 out of 3): 20 points
- Minimal contact info (1 out of 3): 10 points
- No contact info: 0 points

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change port in backend/server.js
const PORT = process.env.PORT || 5002;
```

**CSV Upload Issues:**
- Ensure CSV has required columns: Company Name, Industry, Location, Employee Count
- Check for proper CSV formatting (commas as separators)
- File size should be reasonable (< 10MB recommended)

**Dependencies Issues:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```



**Happy Lead Scoring! 🎯** 