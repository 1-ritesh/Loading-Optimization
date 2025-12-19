const API_URL = 'http://localhost:8000/api';

// Translations
const translations = {
    en: {
        nav_new_plan: "New Plan",
        nav_template: "Template",
        hero_subtitle: "AI-powered production planning that optimizes work allocation based on efficiency, capacity, and style-group affinity",
        feature_smart_allocation_title: "Smart Allocation",
        feature_smart_allocation_desc: "Optimizes work distribution across production lines",
        feature_efficiency_boost_title: "Efficiency Boost",
        feature_efficiency_boost_desc: "Maximizes capacity utilization & reduces idle time",
        feature_visual_analytics_title: "Visual Analytics",
        feature_visual_analytics_desc: "Real-time insights with interactive dashboards",
        dropzone_title: "Drag & Drop Operations Data",
        dropzone_subtitle: "or click to browse files (.xlsx format)",
        loading_text: "Analyzing Data Patterns...",
        project_vision_title: "PROJECT VISION",
        project_vision_text: "Load Optimizer represents a paradigm shift in production planning. By leveraging advanced algorithms to analyze historical efficiency, capacity constraints, and style-group affinities, we transform complex allocation challenges into streamlined, data-driven decisions.",
        vision_smart_logic_title: "Smart Logic",
        vision_smart_logic_desc: "Our algorithm doesn't just fill quotas. It intelligently matches styles to groups based on proven performance history.",
        vision_modern_stack_title: "Modern Stack",
        vision_modern_stack_desc: "Built on a robust Python FastAPI backend paired with a responsive, glassmorphic frontend utilizing modern CSS.",
        vision_deep_analytics_title: "Deep Analytics",
        vision_deep_analytics_desc: "Beyond allocation, we provide granular visibility into weekly efficiency trends, helping managers identify bottlenecks.",
        vision_future_ready_title: "Future Ready",
        vision_future_ready_desc: "Designed for scalability, with a roadmap including predictive machine learning models for demand forecasting.",
        credit_text: "Built for HanesBrands by Anish Naphade",
        footer_built_for: "Built for HBI Inc.",
        footer_language: "LANGUAGE",
        stat_total_demand: "Total Demand",
        unit_units: "units",
        stat_avg_efficiency: "Avg. Efficiency",
        unit_optimization: "optimization",
        stat_capacity_used: "Capacity Used",
        unit_capacity: "of total capacity",
        stat_model_score: "Model Score",
        unit_performance: "performance",
        chart_capacity_utilization: "Capacity Utilization",
        chart_efficiency_distribution: "Efficiency Distribution",
        chart_weekly_efficiency: "Weekly Efficiency by Group",
        section_kpi: "Key Performance Indicators",
        section_allocation_plan: "Optimized Work Allocation Plan",
        btn_download_csv: "Download CSV",
        section_demand_details: "Demand Details",
        section_detailed_plan: "Detailed Production Plan",
        th_metric: "Metric",
        th_value: "Value",
        th_unit: "Unit",
        th_group: "Group",
        th_avg_hc: "Average HC",
        th_eff_pct: "Efficiency (%)",
        th_weekly_cap: "Weekly Capacity",
        th_total_cap: "Total Capacity",
        th_allocated_units: "Allocated Units",
        th_week: "Week",
        th_shift: "Shift",
        th_style: "Style",
        th_sell_style: "Sell Style",
        th_pack_style: "Pack Style",
        th_sell_color: "Sell Color",
        th_sell_size: "Sell Size",
        th_sell_pack: "Sell Pack",
        th_primary_dc: "Primary DC",
        th_demand_qty: "Demand Qty",
        th_allocated_qty: "Allocated Qty",
        th_shift_cap: "Shift Capacity",
        th_hc: "Headcount",
        th_eff: "Efficiency",
        kpi_demand: "Total Demand (Horizon)",
        kpi_allocated: "Total Allocated (Horizon)",
        kpi_avg_eff: "Overall Avg. Weekly Efficiency",
        kpi_cap_util: "Total Capacity Utilization",
        kpi_score: "Model Performance Score",
        kpi_changeovers: "Total Planned Changeovers",
        kpi_shortfall: "Shortfall",
        unit_changes: "changes",
        planning_horizon: "Planning Horizon",
        filter_week: "Week",
        filter_group: "Group",
        filter_style: "Style"
    },
    th: {
        nav_new_plan: "แผนใหม่",
        nav_template: "แม่แบบ",
        hero_subtitle: "การวางแผนการผลิตด้วย AI ที่เพิ่มประสิทธิภาพการจัดสรรงานตามประสิทธิภาพ กำลังการผลิต และความสัมพันธ์ของกลุ่มรูปแบบ",
        feature_smart_allocation_title: "การจัดสรรอัจฉริยะ",
        feature_smart_allocation_desc: "เพิ่มประสิทธิภาพการกระจายงานในสายการผลิต",
        feature_efficiency_boost_title: "เพิ่มประสิทธิภาพ",
        feature_efficiency_boost_desc: "ใช้ประโยชน์จากกำลังการผลิตสูงสุดและลดเวลาว่าง",
        feature_visual_analytics_title: "การวิเคราะห์เชิงภาพ",
        feature_visual_analytics_desc: "ข้อมูลเชิงลึกแบบเรียลไทม์ด้วยแดชบอร์ดแบบโต้ตอบ",
        dropzone_title: "ลากและวางข้อมูลการปฏิบัติงาน",
        dropzone_subtitle: "หรือคลิกเพื่อเรียกดูไฟล์ (.xlsx)",
        loading_text: "กำลังวิเคราะห์รูปแบบข้อมูล...",
        project_vision_title: "วิสัยทัศน์โครงการ",
        project_vision_text: "Load Optimizer คือการเปลี่ยนแปลงกระบวนทัศน์ในการวางแผนการผลิต โดยใช้อัลกอริทึมขั้นสูงเพื่อวิเคราะห์ประสิทธิภาพย้อนหลัง ข้อจำกัดของกำลังการผลิต และความสัมพันธ์ของกลุ่ม",
        vision_smart_logic_title: "ตรรกะอัจฉริยะ",
        vision_smart_logic_desc: "อัลกอริทึมของเราจับคู่สไตล์กับกลุ่มอย่างชาญฉลาดตามประวัติผลงานที่พิสูจน์แล้ว",
        vision_modern_stack_title: "เทคโนโลยีสมัยใหม่",
        vision_modern_stack_desc: "สร้างบนแบ็กเอนด์ Python FastAPI ที่แข็งแกร่งจับคู่กับฟรอนต์เอนด์ที่ตอบสนองได้ดี",
        vision_deep_analytics_title: "การวิเคราะห์เชิงลึก",
        vision_deep_analytics_desc: "เราให้การมองเห็นแนวโน้มประสิทธิภาพรายสัปดาห์อย่างละเอียด ช่วยผู้จัดการระบุปัญหาคอขวด",
        vision_future_ready_title: "พร้อมสำหรับอนาคต",
        vision_future_ready_desc: "ออกแบบมาเพื่อความสามารถในการขยายตัว พร้อมแผนงานรวมถึงโมเดลการเรียนรู้ของเครื่อง",
        credit_text: "สร้างขึ้นสำหรับ HanesBrands โดย Anish Naphade",
        footer_built_for: "สร้างขึ้นสำหรับ HBI Inc.",
        footer_language: "ภาษา",
        stat_total_demand: "ความต้องการรวม",
        unit_units: "หน่วย",
        stat_avg_efficiency: "ประสิทธิภาพเฉลี่ย",
        unit_optimization: "การเพิ่มประสิทธิภาพ",
        stat_capacity_used: "กำลังการผลิตที่ใช้",
        unit_capacity: "ของกำลังการผลิตรวม",
        stat_model_score: "คะแนนโมเดล",
        unit_performance: "ผลการดำเนินงาน",
        chart_capacity_utilization: "การใช้กำลังการผลิต",
        chart_efficiency_distribution: "การกระจายประสิทธิภาพ",
        chart_weekly_efficiency: "ประสิทธิภาพรายสัปดาห์ตามกลุ่ม",
        section_kpi: "ดัชนีชี้วัดผลงานหลัก",
        section_allocation_plan: "แผนการจัดสรรงานที่เหมาะสมที่สุด",
        btn_download_csv: "ดาวน์โหลด CSV",
        section_demand_details: "รายละเอียดความต้องการ",
        section_detailed_plan: "แผนการผลิตโดยละเอียด",
        th_metric: "ตัวชี้วัด",
        th_value: "ค่า",
        th_unit: "หน่วย",
        th_group: "กลุ่ม",
        th_avg_hc: "คนงานเฉลี่ย",
        th_eff_pct: "ประสิทธิภาพ (%)",
        th_weekly_cap: "กำลังการผลิตรายสัปดาห์",
        th_total_cap: "กำลังการผลิตรวม",
        th_allocated_units: "หน่วยที่จัดสรร",
        th_week: "สัปดาห์",
        th_shift: "กะ",
        th_style: "สไตล์",
        th_sell_style: "สไตล์ขาย",
        th_pack_style: "สไตล์แพ็ค",
        th_sell_color: "สีขาย",
        th_sell_size: "ขนาดขาย",
        th_sell_pack: "แพ็คขาย",
        th_primary_dc: "คลังสินค้าหลัก",
        th_demand_qty: "ปริมาณความต้องการ",
        th_allocated_qty: "ปริมาณที่จัดสรร",
        th_shift_cap: "กำลังการผลิตต่อกะ",
        th_hc: "จำนวนคน",
        th_eff: "ประสิทธิภาพ",
        kpi_demand: "ความต้องการรวม (ขอบเขต)",
        kpi_allocated: "จัดสรรรวม (ขอบเขต)",
        kpi_avg_eff: "ประสิทธิภาพเฉลี่ยโดยรวม",
        kpi_cap_util: "การใช้กำลังการผลิตรวม",
        kpi_score: "คะแนนประสิทธิภาพโมเดล",
        kpi_changeovers: "การเปลี่ยนแปลงแผนรวม",
        kpi_shortfall: "ขาด",
        unit_changes: "ครั้ง",
        planning_horizon: "ขอบเขตการวางแผน",
        filter_week: "สัปดาห์",
        filter_group: "กลุ่ม",
        filter_style: "สไตล์"
    }
};

let currentLang = 'en';

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
const filterWeekDisp = document.getElementById('filter-week');
const filterGroupDisp = document.getElementById('filter-group');
const filterStyleDisp = document.getElementById('filter-style');
const langBtns = document.querySelectorAll('.lang-btn');

// State
let planData = null;
let activeFilters = {
    week: 'all',
    group: 'all',
    style: 'all'
};
let groupWeekData = null;

// Charts
let capacityChart, efficiencyChart, weeklyGroupChart;

// Event Listeners
langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.textContent.includes('Thai') ? 'th' : 'en';
        switchLanguage(lang);
    });
});

downloadTemplateBtn.addEventListener('click', downloadTemplate);
newPlanBtn.addEventListener('click', resetView);
downloadSummaryBtn.addEventListener('click', () => downloadCSV(planData.summary, 'allocation_summary.csv'));
downloadPlanBtn.addEventListener('click', () => downloadCSV(planData.detailed_plan, 'detailed_plan.csv'));
fullscreenAllocationBtn.addEventListener('click', () => toggleFullscreen('allocation-section'));
fullscreenDetailedBtn.addEventListener('click', () => toggleFullscreen('detailed-section'));

// New Filter Event Listeners
filterWeekDisp.addEventListener('change', (e) => {
    activeFilters.week = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    renderDetailedTable(planData.detailed_plan);
});

filterGroupDisp.addEventListener('change', (e) => {
    activeFilters.group = e.target.value;
    renderDetailedTable(planData.detailed_plan);
});

filterStyleDisp.addEventListener('change', (e) => {
    activeFilters.style = e.target.value;
    renderDetailedTable(planData.detailed_plan);
});

// Collapsible Table Functionality
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const content = document.getElementById(targetId);

        // Toggle active class
        this.classList.toggle('active');

        // Toggle content visibility
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            setTimeout(() => content.classList.add('show'), 10);
        } else {
            content.classList.remove('show');
            setTimeout(() => content.style.display = 'none', 300);
        }

        // Re-initialize lucide icons after DOM change
        lucide.createIcons();
    });
});

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


function t(key) {
    return translations[currentLang][key] || key;
}

function switchLanguage(lang) {
    currentLang = lang;

    // Update active button state
    langBtns.forEach(btn => {
        if ((lang === 'th' && btn.textContent.includes('Thai')) ||
            (lang === 'en' && btn.textContent.includes('English'))) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update static elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Re-render dashboard if data exists to update charts and dynamic tables
    if (planData) {
        renderDashboard(planData);
    }
}

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

    // NEW: Use weekly efficiency data for the chart
    prepareEfficiencyChart(data.weekly_group_efficiency);

    renderKPITable(data.kpi);
    renderAllocationTable(data.summary);
    renderDemandTable(data.demand_details);
    populateDetailedFilters(data.detailed_plan);
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
            labels: ['Used Capacity', 'Available Capacity'], // These could be translated if needed, or kept simple
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
                label: t('th_eff_pct'),
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
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${t('th_eff_pct')}: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

/* ---------- NEW: GROUP-WEEK CHART LOGIC ---------- */

function prepareEfficiencyChart(weeklyEfficiency) {
    if (!weeklyEfficiency || !weeklyEfficiency.length) {
        console.warn('No weekly efficiency data for chart');
        return;
    }

    const groupsSet = new Set();
    const efficiencyByGroup = {};

    weeklyEfficiency.forEach(item => {
        const group = item.Group;
        const week = item.Week;
        const eff = item.Efficiency || 0;

        if (!group || week == null) return;

        groupsSet.add(group);

        if (!efficiencyByGroup[group]) {
            efficiencyByGroup[group] = {};
        }
        efficiencyByGroup[group][week] = eff;
    });

    const groups = Array.from(groupsSet).sort();
    const weeks = [...new Set(weeklyEfficiency.map(item => item.Week))].sort((a, b) => a - b);

    console.log('Groups for efficiency chart:', groups);
    console.log('Weeks for efficiency chart:', weeks);

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
        updateEfficiencyChart(groups[0], efficiencyByGroup, weeks);
    }

    // Change handler
    select.onchange = (e) => {
        updateEfficiencyChart(e.target.value, efficiencyByGroup, weeks);
    };
}

function updateEfficiencyChart(group, efficiencyByGroup, weeks) {
    if (!efficiencyByGroup || !group) return;

    const groupData = efficiencyByGroup[group] || {};

    const data = weeks.map(week => {
        return groupData[week] || 0;
    });

    const canvas = document.getElementById('weeklyGroupChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (weeklyGroupChart) {
        weeklyGroupChart.destroy();
    }

    weeklyGroupChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `${t('th_week')} ${w}`),
            datasets: [{
                label: `${t('th_weekly_cap')} % (${group})`,
                data: data,
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderColor: 'rgba(0, 212, 255, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(0, 212, 255, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: t('th_weekly_cap'),
                        color: '#a3a3a3',
                        font: { family: 'Inter', size: 12 }
                    },
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                x: {
                    title: {
                        display: true,
                        text: t('th_week'),
                        color: '#a3a3a3',
                        font: { family: 'Inter', size: 12 }
                    },
                    ticks: { color: '#a3a3a3', font: { family: 'Inter' } },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ededed', font: { family: 'Inter' } }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Efficiency: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

/* ---------- TABLE RENDERING LOGIC ---------- */

function renderKPITable(kpi) {
    const tbody = document.querySelector('#kpi-table tbody');
    tbody.innerHTML = `
        <tr><td>${t('kpi_demand')}</td><td>${Math.round(kpi.total_demand).toLocaleString()}</td><td>${t('unit_units')}</td></tr>
        <tr><td>${t('kpi_allocated')}</td><td>${Math.round(kpi.total_allocated).toLocaleString()}</td><td>${t('unit_units')}</td></tr>
        <tr><td>${t('kpi_avg_eff')}</td><td>${kpi.weighted_avg_eff.toFixed(2)}</td><td>%</td></tr>
        <tr><td>${t('kpi_cap_util')}</td><td>${kpi.cap_utilization.toFixed(2)}</td><td>%</td></tr>
        <tr><td>${t('kpi_score')}</td><td>${kpi.model_score.toFixed(2)}</td><td>%</td></tr>
        <tr><td>${t('kpi_changeovers')}</td><td>${kpi.changeovers}</td><td>${t('unit_changes')}</td></tr>
        <tr><td>${t('kpi_shortfall')}</td><td>${Math.round(kpi.unallocated_qty).toLocaleString()}</td><td>${t('unit_units')}</td></tr>
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

function populateDetailedFilters(detailedPlan) {
    const weeks = [...new Set(detailedPlan.map(item => item.Week))].sort((a, b) => a - b);
    const groups = [...new Set(detailedPlan.map(item => item.Group))].sort();
    const styles = [...new Set(detailedPlan.map(item => item.Style))].sort();

    // Populate Week Dropdown
    filterWeekDisp.innerHTML = '<option value="all">All</option>' +
        weeks.map(w => `<option value="${w}">Week ${w}</option>`).join('');

    // Populate Group Dropdown
    filterGroupDisp.innerHTML = '<option value="all">All</option>' +
        groups.map(g => `<option value="${g}">${g}</option>`).join('');

    // Populate Style Dropdown
    filterStyleDisp.innerHTML = '<option value="all">All</option>' +
        styles.map(s => `<option value="${s}">${s}</option>`).join('');

    // Update Planning Horizon
    const horizonWeeks = weeks.length;
    document.getElementById('horizon-weeks').textContent = horizonWeeks;

    // Reset filters state
    activeFilters = { week: 'all', group: 'all', style: 'all' };
    filterWeekDisp.value = 'all';
    filterGroupDisp.value = 'all';
    filterStyleDisp.value = 'all';
}

function renderDetailedTable(detailedPlan) {
    const tbody = document.getElementById('detailed-table-body');
    tbody.innerHTML = '';

    let filteredData = detailedPlan;

    // Apply Multi-criteria Filtering
    if (activeFilters.week !== 'all') {
        filteredData = filteredData.filter(item => item.Week === activeFilters.week);
    }
    if (activeFilters.group !== 'all') {
        filteredData = filteredData.filter(item => item.Group === activeFilters.group);
    }
    if (activeFilters.style !== 'all') {
        filteredData = filteredData.filter(item => item.Style === activeFilters.style);
    }

    const fragment = document.createDocumentFragment();

    filteredData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="text-muted" style="font-size: 0.7rem;">${index}</td>
            <td>${item.Week}</td>
            <td>${item.Group}</td>
            <td>${item.Shift}</td>
            <td>${item.Style}</td>
            <td>${item.SELL_STYLE}</td>
            <td>${item.PACK_STYLE}</td>
            <td>${item.SELL_COLOR}</td>
            <td>${item.SELL_SIZE}</td>
            <td>${item.SELL_PACK}</td>
            <td>${item.PRIMARY_DC}</td>
            <td>${Math.round(item['Allocated Qty']).toLocaleString()}</td>
            <td>${Math.round(item['Shift Capacity']).toLocaleString()}</td>
            <td>${Math.round(item.HC)}</td>
            <td>${item.Eff.toFixed(2)}%</td>
        `;
        fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    lucide.createIcons();
}

// ================================================
// SCROLL REVEAL ANIMATION (Bugatti-style)
// ================================================
let lastScrollY = window.scrollY;
let scrollDirection = 'down';

// Track scroll direction
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
});

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Always show when in viewport
            entry.target.classList.add('visible');
        } else if (scrollDirection === 'up') {
            // Only hide when scrolling UP and element is out of view
            entry.target.classList.remove('visible');
        }
        // When scrolling DOWN and element is out of view, keep it visible
    });
}, observerOptions);

// Observe all scroll-reveal elements
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => scrollObserver.observe(el));

    // Cleanup one-time animations to restore hover effects
    const animatedElements = document.querySelectorAll('.fade-in-once');
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.classList.remove('fade-in-once');
            // Explicitly clear inline styles that might interfere
            el.style.animationDelay = '';
        });
    }, 2000); // Wait for all staggered animations to finish (max delay 0.6s + 1s duration)
});
