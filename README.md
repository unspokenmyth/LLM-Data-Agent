# Data Intelligence Agent 🤖📊

Welcome to the Data Intelligence Agent, an AI-powered assistant designed to make data analysis accessible to everyone. Simply upload your dataset, ask a question in plain English, and receive automated insights, visualizations, and ready-to-use code in seconds.

Powered by Google's Gemini API, this tool acts as your personal data engineer, transforming complex data queries into clear, actionable intelligence.

---

## ✨ Key Features

-   **Natural Language Interaction**: Ask questions about your data as if you're talking to an expert. No need to write complex code or queries.
-   **Dual Execution Modes**: Choose between generating **Python/Pandas** code for complex transformations or standard **SQL** queries for database-style analysis.
-   **Automated Analysis Pipeline**: The agent follows a complete data analysis workflow:
    1.  **Data Validation**: Performs a quick check on your file for issues like missing values or duplicates.
    2.  **AI-Generated Plan**: Creates a logical, step-by-step plan to answer your question.
    3.  **Code Generation**: Writes clean, commented Python or SQL code based on the plan.
    4.  **Data Visualization**: Automatically generates the most appropriate chart (Bar, Line, or Pie) to visualize the results.
    5.  **AI-Powered Summary**: Delivers a concise summary with key findings and actionable business insights.
-   **Interactive Results**: All outputs are presented in collapsible cards, allowing you to focus on what's important.
-   **Code Export**: Easily copy or download the generated code for use in your own projects.
-   **Session History & Caching**: Previous analyses are saved in the sidebar for quick access. Queries on the same data are cached for instant results.
-   **Responsive Design**: A clean, modern, and responsive UI that works beautifully on any screen size.

---

## 🚀 How to Use

Getting started is simple:

1.  **Launch the App**: Open the `index.html` file in your browser.
2.  **Start a New Analysis**: Click the "Start New Analysis" button on the welcome screen or in the sidebar.
3.  **Upload Your Data**:
    -   Click to select a local **CSV** or **JSON** file.
    -   The app will perform a quick validation.
4.  **Choose Execution Mode**: Select whether you want the analysis performed using **Python/Pandas** or **SQL**.
5.  **Ask a Question**: Type your question into the text box (e.g., *"What is the average revenue by region?"* or *"Plot the quarterly sales trend for the last year"*).
6.  **Analyze**: Hit the "Analyze Data" button.
7.  **Review the Results**: Watch as the AI progresses through the pipeline and then explore your interactive results, including the AI summary, chart, data preview, and the generated code.

---

## 🛠️ Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Engine**: Google Gemini API (`@google/genai`)
-   **Charting Library**: Chart.js
-   **Icons**: A custom set of SVG icons for a clean and consistent look.

---

## 📁 Project Structure

The project is organized into a modular structure for clarity and maintainability:

```
/
├── components/         # Reusable React components (UI elements)
│   ├── icons/          # SVG icon components
│   └── ...
├── hooks/              # Custom React hooks (e.g., useCopyToClipboard)
├── services/           # API call logic (e.g., geminiService.ts)
├── types/              # TypeScript type definitions (e.g., AppState)
├── App.tsx             # Main application component
├── index.html          # Entry point HTML file
└── index.tsx           # React root renderer
```

This structured approach ensures that the application is easy to understand, extend, and maintain.
