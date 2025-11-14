# 🤖📊 Data Intelligence Agent

The **Data Intelligence Agent** is a smart, AI-powered assistant that lets anyone explore and analyze data using simple natural language.  
Upload a dataset, ask a question like *“What are the top 10 products by revenue?”* and instantly receive:

- Clean Python/Pandas or SQL code  
- Interactive visualizations  
- Step-by-step reasoning  
- A concise AI-generated insight summary  

Built with **Google’s Gemini API**, the agent works like your personal data engineer — transforming raw questions into clear, actionable intelligence.


---

## ✨ Features at a Glance

### 🗣 Natural Language Interface  
Ask questions as if you're talking to a teammate — no coding or SQL required.

### 🔄 Dual Execution Modes  
Choose how the analysis is executed:  
- **Python / Pandas** → for transformations, grouping, custom logic  
- **SQL** → for analytical queries, aggregations, filtering

### 📊 Automated Analysis Pipeline  
Every query goes through a complete data workflow:

1. **Data Validation**  
   Quick checks for schema, missing values, duplicates, and data types.

2. **AI Analysis Plan**  
   A logical breakdown of how the question should be answered.

3. **Code Generation**  
   Clean, documented Python/Pandas or SQL code created by the AI.

4. **Visualization**  
   Automatic chart selection (Bar, Line, or Pie) using Chart.js.

5. **Summary of Insights**  
   A short, human-readable explanation of what the results mean.

### 🗂 Interactive Results UI  
All outputs appear in collapsible, organized cards:
- Summary  
- Chart  
- Generated Code  
- Data Preview  
- Execution Logs  

Helps you focus only on what you need.

### 💾 Code Export & Reuse  
Copy the code with one click — or download it for your notebooks and scripts.

### 🕒 Session History & Caching  
Your past analyses are saved in the sidebar.  
Repeat a similar question on the same data?  
→ The result loads instantly from cache.

### 📱 Responsive, Polished UI  
A clean, intuitive design built with React + Tailwind that works across all screen sizes.

---

## 🚀 Getting Started

1. **Open the App**  
   Launch the `index.html` file in your browser.

2. **Start a New Analysis**  
   Click **“Start New Analysis”** from the landing page or sidebar.

3. **Upload Your Dataset**  
   Supports **CSV** and **JSON**.  
   The app will run quick validation automatically.

4. **Choose Execution Mode**  
   - Python/Pandas  
   - SQL  

5. **Ask Your Question**  
   Examples:
   - *“Show me the average revenue by region.”*  
   - *“Plot monthly sales for 2023.”*  
   - *“Find the top 5 performing categories.”*

6. **Click Analyze**  
   Watch the AI run through validation, planning, code generation, execution, and visualization.

7. **Explore Your Results**  
   Review:
   - AI summary  
   - Chart  
   - Data preview  
   - Exportable code  
   - Logs  

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS  
- **AI Engine:** Google Gemini API (`@google/genai`)  
- **Visualization:** Chart.js  
- **UI Icons:** Clean custom SVG icon set  

---
