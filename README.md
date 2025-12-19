#  Load Optimizer and Production Plan Generator

An intelligent production planning solution for garment manufacturing that optimizes work allocation using a two-phase algorithm combining affinity-based matching with greedy optimization.

![Production Planning](https://img.shields.io/badge/Python-3.8%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

##  Features

- **Two-Phase Allocation Algorithm**: Combines affinity-based priority matching with greedy fallback
- **Zero-Changeover Scheduling**: Assigns one style per group per week across all shifts
- **Multi-Interface Design**:
  - Premium Web UI with glassmorphic design
  - FastAPI REST API for system integration
  - Streamlit analytics dashboard
- **Real-Time Analytics**: Interactive charts for efficiency, capacity utilization, and KPIs
- **Bilingual Support**: Full English and Thai localization


##  Project Structure

```
Loading-Optimization/
├── backend/              # Python backend services
│   ├── main.py           # FastAPI server
│   ├── logic.py          # Core allocation algorithm
│   └── streamlit_app.py  # Streamlit dashboard
├── frontend/             # Web application
│   ├── index.html        # Main UI
│   ├── script.js         # JavaScript logic
│   ├── css/              # Stylesheets
│   └── assets/images/    # UI assets
├── docs/                 # Documentation
│   ├── PROJECT_REPORT.md # Full technical report
│   ├── PROJECT_REPORT.tex# LaTeX version
│   └── architecture_diagram.png
└── data/                 # Data directory (gitignored)
```

##  Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/1-ritesh/Loading-Optimization.git
cd Loading-Optimization
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the FastAPI server**
```bash
cd backend
python -m uvicorn main:app --reload 
```

4. **Access the application**
- Web UI: http://localhost:8000
- API docs: http://localhost:8000/docs
- Streamlit (alternative): `streamlit run backend/streamlit_app.py`

##  Usage

### Web Interface

1. Navigate to http://localhost:8000
2. Upload Excel file with two sheets:
   - `demand_forecast`: Production demand data
   - `Output_forecast`: Historical performance data
3. View optimized allocation plan with:
   - KPI dashboard
   - Capacity utilization charts
   - Weekly efficiency trends
   - Detailed production schedule
4. Download CSV results

### API Integration

```python
import requests

# Upload file for processing
with open('production_data.xlsx', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/generate-plan',
        files={'file': f}
    )
    
result = response.json()
print(f"Total Allocated: {result['kpi']['total_allocated']}")
print(f"Efficiency: {result['kpi']['weighted_avg_eff']}%")
```

##  Algorithm Overview

### Two-Phase Allocation

**Phase 1: Affinity-Based**
- Matches styles to groups with proven historical performance
- Uses style-specific efficiency metrics
- Prioritizes highest-demand items

**Phase 2: Greedy Fallback**
- Allocates remaining demand to available capacity
- Ensures maximum capacity utilization
- O(n × p + (n + m) log(n + m)) complexity

### Zero-Changeover Scheduling
- Assigns one style per group per week
- Distributes work across all 12 shifts evenly
- Eliminates setup time losses

##  System Requirements

| Component | Requirement |
|-----------|-------------|
| Python | 3.8+ |
| RAM (Minimum) | 4 GB |
| RAM (Recommended) | 8 GB+ |
| Disk Space | 500 MB |
| Browser | Chrome 90+, Firefox 88+, Safari 14+ |

##  Technologies Used

- **Backend**: Python, FastAPI, Pandas, NumPy
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Visualization**: Chart.js, Plotly
- **Deployment**: Uvicorn, Docker-ready

##  Documentation

Complete technical documentation is available in the `docs/` folder:
- [Project Report (Markdown)](docs/PROJECT_REPORT.md)
- [Project Report (LaTeX)](docs/PROJECT_REPORT.tex)
- [Architecture Diagram](docs/architecture_diagram.png)

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

##  License

This project is licensed under the MIT License - see the LICENSE file for details.


##  Acknowledgments

- HanesBrands production planning team for domain expertise and data
- Open-source community for FastAPI, Pandas, Streamlit, and related tools

---

