# 🤖📊 Data Intelligence Agent  
**Your AI-powered data analysis assistant — live here:**  
 **https://llm-data-agent.vercel.app/** 🚀

Upload a dataset, ask a question in plain English, and get instant insights, charts, and ready-to-use Python or SQL.  
No coding required — just ask.

---

## ✨ What This App Does

- **Ask anything in plain English**  
  Example: “Show me the average sales by region.”

- **Get instant AI-generated results**  
  The app will:
  1. Check your data  
  2. Create an analysis plan  
  3. Generate clean Python/Pandas **or** SQL  
  4. Build the best chart for your question  
  5. Summarize the insights clearly  

- **Copy or download the code**  
  Use it directly in your projects.

- **Save your past questions**  
  Quickly revisit earlier analyses.

- **Works on any screen**  
  Clean, simple, responsive UI.

---

## 🚀 How to Use

1. **Open the app** → https://llm-data-agent.vercel.app/  
2. **Upload a CSV or JSON file**  
3. **Choose your mode** → Python/Pandas or SQL  
4. **Ask your question**  
5. **Click “Analyze”**  
6. Explore:
   - Summary  
   - Chart  
   - Data preview  
   - Generated code  

That’s it — the AI handles everything.

---

## 🛠️ Tech Behind the Magic

- **Frontend:** React + TypeScript + Tailwind CSS  
- **Charts:** Chart.js  
- **AI Engine:** Google Gemini (via secure Vercel API routes — no key in the browser)  
- **Hosting:** Vercel  

Fast, lightweight, secure, and free to use.

---

## 📁 Project Structure

The project is organized into a modular structure for clarity and maintainability:

```
/
├── api/ # Secure Vercel serverless functions (Gemini calls)
├── components/ # Reusable UI components
│ └── icons/ # SVG icons
├── hooks/ # Custom React hooks
├── services/ # Frontend API wrappers
├── types/ # TypeScript interfaces
├── App.tsx # Main app container
├── index.html # Entry HTML
└── index.tsx # App mount point
```
