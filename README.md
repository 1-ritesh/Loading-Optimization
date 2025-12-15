# Sewing Plan Optimizer AI

A web-based production planning tool that converts demand and capacity data into an optimized sewing plan using intelligent allocation logic.

## Features
- Upload Excel demand & capacity data
- Smart allocation across sewing groups
- Capacity utilization & efficiency KPIs
- Weekly & shift-level production plan
- Interactive charts and tables
- CSV export for summaries and detailed plans

## Tech Stack
- **Backend:** FastAPI, Python, Pandas, NumPy  
- **Frontend:** HTML, CSS, JavaScript, Chart.js  
- **Data:** Excel (.xlsx)

## Project Structure
.
├── main.py # FastAPI backend
├── logic.py # Allocation & planning logic
├── index.html # Frontend UI
├── style.css # UI styling
├── script.js # Frontend logic
├── requirements.txt # Python dependencies

css
Copy code

## Setup & Run
```bash
pip install -r requirements.txt
uvicorn main:app --reload
Open in browser:

http://localhost:8000

