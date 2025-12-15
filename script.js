const API_URL = 'http://localhost:8000/api';

// DOM Elements
const heroSection = document.getElementById('hero-section');
const dashboardSection = document.getElementById('dashboard-section');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadContent = document.getElementById('upload-content');
const loadingContent = document.getElementById('loading-content');
const errorMessage = document.getElementById('error-message');
const newPlanBtn = document.getElementById('new-plan-btn');
const downloadTemplateBtn = document.getElementById('download-template-btn');
const downloadSummaryBtn = document.getElementById('download-summary-btn');
const downloadPlanBtn = document.getElementById('download-plan-btn');
const fullscreenAllocationBtn = document.getElementById('fullscreen-allocation-btn');
const fullscreenDetailedBtn = document.getElementById('fullscreen-detailed-btn');
const weekScrollLeft = document.getElementById('week-scroll-left');
const weekScrollRight = document.getElementById('week-scroll-right');

// State
let planData = null;
let selectedWeek = null;
let groupWeekData = null;

// Charts
let capacityChart, efficiencyChart, weeklyGroupChart;

// Event Listeners
downloadTemplateBtn.addEventListener('click', downloadTemplate);
newPlanBtn.addEventListener('click', resetView);
downloadSummaryBtn.addEventListener('click', () => downloadCSV(planData.summary, 'allocation_summary.csv'));
downloadPlanBtn.addEventListener('click', () => downloadCSV(planData.detailed_plan, 'detailed_plan.csv'));
fullscreenAllocationBtn.addEventListener('click', () => toggleFullscreen('allocation-section'));
fullscreenDetailedBtn.addEventListener('click', () => toggleFullscreen('detailed-section'));
weekScrollLeft.addEventListener('click', () => scrollWeekFilters(-200));
weekScrollRight.addEventListener('click', () => scrollWeekFilters(200));

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
});
fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

// Functions

function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showError('Please upload a valid Excel file (.xlsx)');
        return;
    }

    uploadFile(file);
}

async function uploadFile(file) {
    showLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/generate-plan`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate plan');
        }

        planData = await response.json();
        console.log('detailed_plan length:', planData.detailed_plan?.length || 0);
        renderDashboard(planData);
        switchView('dashboard');
    } catch (error) {
        showError(error.message);
        console.error(error);
    } finally {
        showLoading(false);
    }
}

async function downloadTemplate() {
    try {
        const response = await fetch(`${API_URL}/template`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data_detail_template.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (error) {
        console.error('Error downloading template:', error);
    }
}

function downloadCSV(data, filename) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

function switchView(view) {
    if (view === 'dashboard') {
        heroSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        newPlanBtn.classList.remove('hidden');
    } else {
        heroSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        newPlanBtn.classList.add('hidden');
    }
}

function resetView() {
    planData = null;
    fileInput.value = '';
    switchView('hero');
    errorMessage.classList.add('hidden');
}

function showLoading(isLoading) {
    if (isLoading) {
        uploadContent.classList.add('hidden');
        loadingContent.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } else {
        uploadContent.classList.remove('hidden');
        loadingContent.classList.add('hidden');
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function renderDashboard(data) {
    renderStats(data.kpi);
    renderCharts(data.summary, data.kpi);

    // NEW: build group-week aggregation and initialise weekly group chart
    prepareGroupWeekData(data.detailed_plan);

    renderKPITable(data.kpi);
    renderAllocationTable(data.summary);
    renderDemandTable(data.demand_details);
    renderTimelineFilters(data.detailed_plan);
    renderDetailedTable(data.detailed_plan);
}

function renderStats(kpi) {
    // Animate stat values
    animateValue('stat-demand-value', 0, kpi.total_demand, 1000, (val) => Math.round(val).toLocaleString());
    animateValue('stat-efficiency-value', 0, kpi.weighted_avg_eff, 1000, (val) => val.toFixed(1) + '%');
    animateValue('stat-utilization-value', 0, kpi.cap_utilization, 1000, (val) => val.toFixed(1) + '%');
    animateValue('stat-score-value', 0, kpi.model_score, 1000, (val) => val.toFixed(1) + '%');
}

function animateValue(id, start, end, duration, formatter) {
    const element = document.getElementById(id);
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = start + (end - start) * eased;

        element.textContent = formatter(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function renderCharts(summary, kpi) {
    // Destroy existing charts
    if (capacityChart) capacityChart.destroy();
    if (efficiencyChart) efficiencyChart.destroy();

    // Capacity Utilization Doughnut
    const capCtx = document.getElementById('capacityChart').getContext('2d');
    capacityChart = new Chart(capCtx, {
        type: 'doughnut',
        data: {
            labels: ['Used Capacity', 'Available Capacity'],
            datasets: [{
                data: [kpi.cap_utilization, 100 - kpi.cap_utilization],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(255, 255, 255, 0.1)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(255, 255, 255, 0.2)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#ededed', font: { family: 'Inter' } }
                }
            }
        }
    });

    // Efficiency Distribution Bar Chart
    const effCtx = document.getElementById('efficiencyChart').getContext('2d');
    efficiencyChart = new Chart(effCtx, {
        type: 'bar',
        data: {
            labels: summary.map(row => row.Group),
            datasets: [{
                label: 'Efficiency (%)',
                data: summary.map(row => row['Efficiency (%)']),
                backgroundColor: 'rgba(139, 92, 246, 0.7)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ededed', font: { family: 'Inter' } }
                }
            }
        }
    });
}

/* ---------- NEW: GROUP-WEEK CHART LOGIC ---------- */

function prepareGroupWeekData(detailedPlan) {
    if (!detailedPlan || !detailedPlan.length) {
        console.warn('No detailed_plan data for group-week chart');
        return;
    }

    const weeksSet = new Set();
    const groupsSet = new Set();
    const valuesByGroup = {};

    detailedPlan.forEach(item => {
        const week = item.Week;
        const group = item.Group;
        const qty = item['Allocated Qty'] || 0;

        if (week == null || !group) return;

        weeksSet.add(week);
        groupsSet.add(group);

        if (!valuesByGroup[group]) {
            valuesByGroup[group] = {};
        }
        valuesByGroup[group][week] = (valuesByGroup[group][week] || 0) + qty;
    });

    const weeks = Array.from(weeksSet).sort((a, b) => a - b);
    const groups = Array.from(groupsSet).sort();

    console.log('Groups for weekly chart:', groups);
    console.log('Weeks for weekly chart:', weeks);

    groupWeekData = { weeks, groups, valuesByGroup };

    const select = document.getElementById('group-select');
    if (!select) return;

    // Populate dropdown
    select.innerHTML = '';
    groups.forEach(group => {
        const opt = document.createElement('option');
        opt.value = group;
        opt.textContent = group;
        select.appendChild(opt);
    });

    if (groups.length > 0) {
        select.value = groups[0];
        updateWeeklyGroupChart(groups[0]);
    }

    // Change handler
    select.onchange = (e) => {
        updateWeeklyGroupChart(e.target.value);
    };
}

function updateWeeklyGroupChart(group) {
    if (!groupWeekData || !group) return;

    const { weeks, valuesByGroup } = groupWeekData;
    const groupValues = valuesByGroup[group] || {};

    const data = weeks.map(week => {
        const val = groupValues[week] || 0;
        return Math.round(val);
    });

    const canvas = document.getElementById('weeklyGroupChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (weeklyGroupChart) {
        weeklyGroupChart.destroy();
    }

    weeklyGroupChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeks.map(w => `Week ${w}`),
            datasets: [{
                label: `Allocated Units (${group})`,
                data: data,
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ededed', font: { family: 'Inter' } }
                }
            }
        }
    });
}

/* ---------- TABLE RENDERING LOGIC ---------- */

function renderKPITable(kpi) {
    const tbody = document.querySelector('#kpi-table tbody');
    tbody.innerHTML = `
        <tr><td>Total Demand (Horizon)</td><td>${Math.round(kpi.total_demand).toLocaleString()}</td><td>units</td></tr>
        <tr><td>Total Allocated (Horizon)</td><td>${Math.round(kpi.total_allocated).toLocaleString()}</td><td>units</td></tr>
        <tr><td>Overall Avg. Weekly Efficiency</td><td>${kpi.weighted_avg_eff.toFixed(2)}</td><td>%</td></tr>
        <tr><td>Total Capacity Utilization</td><td>${kpi.cap_utilization.toFixed(2)}</td><td>%</td></tr>
        <tr><td>Model Performance Score</td><td>${kpi.model_score.toFixed(2)}</td><td>%</td></tr>
        <tr><td>Total Planned Changeovers</td><td>${kpi.changeovers}</td><td>changes</td></tr>
        <tr><td>Shortfall</td><td>${Math.round(kpi.unallocated_qty).toLocaleString()}</td><td>units</td></tr>
    `;
}

function renderAllocationTable(summary) {
    const tbody = document.querySelector('#allocation-table tbody');
    tbody.innerHTML = summary.map(row => `
        <tr>
            <td>${row.Group}</td>
            <td>${Math.round(row['Average HC'])}</td>
            <td>${row['Efficiency (%)'].toFixed(2)}</td>
            <td>${Math.round(row['Weekly Capacity (Units)']).toLocaleString()}</td>
            <td>${Math.round(row['Total Capacity (Units)']).toLocaleString()}</td>
            <td>${Math.round(row['Allocated Units']).toLocaleString()}</td>
        </tr>
    `).join('');
}

function renderDemandTable(demandDetails) {
    const tbody = document.querySelector('#demand-table tbody');
    if (!demandDetails || demandDetails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No demand data available</td></tr>';
        return;
    }
    tbody.innerHTML = demandDetails.map(row => `
        <tr>
            <td>${row.Style || '-'}</td>
            <td>${row.SELL_STYLE || '-'}</td>
            <td>${row.PACK_STYLE || '-'}</td>
            <td>${row.SELL_COLOR || '-'}</td>
            <td>${row.SELL_SIZE || '-'}</td>
            <td>${row['Demand Qty'] ? Math.round(row['Demand Qty']).toLocaleString() : '0'}</td>
        </tr>
    `).join('');
}

function toggleFullscreen(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('fullscreen-mode');

    // Update icon
    const btn = sectionId === 'allocation-section' ? fullscreenAllocationBtn : fullscreenDetailedBtn;
    const icon = btn.querySelector('i');
    if (section.classList.contains('fullscreen-mode')) {
        icon.setAttribute('data-lucide', 'minimize-2');
    } else {
        icon.setAttribute('data-lucide', 'maximize-2');
    }
    lucide.createIcons();
}

function scrollWeekFilters(amount) {
    const container = document.getElementById('week-filters');
    container.scrollBy({ left: amount, behavior: 'smooth' });
}

function renderTimelineFilters(detailedPlan) {
    const weeks = [...new Set(detailedPlan.map(item => item.Week))].sort((a, b) => a - b);
    const container = document.getElementById('week-filters');
    container.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.textContent = 'All';
    allBtn.onclick = () => {
        selectedWeek = null;
        updateFilterButtons(allBtn);
        renderDetailedTable(detailedPlan);
    };
    container.appendChild(allBtn);

    weeks.forEach(week => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = `Week ${week}`;
        btn.onclick = () => {
            selectedWeek = week;
            updateFilterButtons(btn);
            renderDetailedTable(detailedPlan);
        };
        container.appendChild(btn);
    });
}

function updateFilterButtons(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function renderDetailedTable(detailedPlan) {
    const tbody = document.getElementById('detailed-table-body');
    tbody.innerHTML = '';

    let filteredData = detailedPlan;
    if (selectedWeek) {
        filteredData = detailedPlan.filter(item => item.Week === selectedWeek);
    }

    const fragment = document.createDocumentFragment();

    filteredData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.Week}</td>
            <td>${item.Group}</td>
            <td>${item.Shift}</td>
            <td>${item.Style}</td>
            <td>${item.SELL_STYLE}</td>
            <td>${item.PACK_STYLE}</td>
            <td>${item.SELL_COLOR}</td>
            <td>${Math.round(item['Allocated Qty']).toLocaleString()}</td>
            <td>${Math.round(item['Shift Capacity']).toLocaleString()}</td>
            <td>${Math.round(item.HC)}</td>
            <td>${item.Eff.toFixed(2)}</td>
        `;
        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    lucide.createIcons();
}
