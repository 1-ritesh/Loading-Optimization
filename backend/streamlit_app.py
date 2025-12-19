import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import logic
import os

# Page config
st.set_page_config(
    page_title="Production Planning AI | HanesBrands",
    page_icon="🏭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Premium Custom CSS - Hybrid Design
st.markdown("""
<style>
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    /* Global Styles */
    * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* File uploader */
    [data-testid="stFileUploader"] {
        background: rgba(102, 126, 234, 0.05);
        border: 2px dashed rgba(102, 126, 234, 0.5);
        border-radius: 16px;
        padding: 2rem;
        transition: all 0.3s ease;
    }
    
    [data-testid="stFileUploader"]:hover {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
    }
    
    /* Buttons */
    .stDownloadButton button {
        background: #4CAF50;
        color: white;
        border-radius: 8px;
        padding: 0.75rem 1.5rem;
        font-weight: 600;
    }
    
    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Landing page feature cards hover effect */
    .feature-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
        border-color: #667eea !important;
    }
</style>
""", unsafe_allow_html=True)

# Simple Title
st.title("🏭 AI-Powered Production Planning")
st.markdown("### Optimize your production schedule with intelligent allocation")

# Sidebar
with st.sidebar:
    st.markdown("## 🎯 About")
    st.info("""
    **AI Production Planner**
    
    Optimizes work allocation based on:
    - 📊 Group efficiency
    - 🎯 Capacity constraints  
    - 🔄 Style-group affinity
    - ⚡ Zero changeovers per week
    
    Built for HanesBrands by Anish Naphade
    """)
    
    st.markdown("---")
    
    # Template download
    st.markdown("### 📥 Download Template")
    st.markdown("Get the Excel template with required format:")
    
    # Read template file and create download button
    try:
        with open("data_detail_template.xlsx", "rb") as template_file:
            template_bytes = template_file.read()
        
        st.download_button(
            label="⬇️ Download Template",
            data=template_bytes,
            file_name="data_detail_template.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            use_container_width=True
        )
    except FileNotFoundError:
        st.warning("Template file not found. Please contact admin.")

# File uploader
uploaded_file = st.file_uploader(
    "📁 Upload Production Data",
    type=['xlsx'],
    help="Upload Excel file with demand_forecast and Output_forecast sheets"
)

if uploaded_file:
    # Create unique temp file
    import uuid
    temp_path = f"temp_upload_{uuid.uuid4().hex}.xlsx"
    
    with open(temp_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    try:
        with st.spinner('⚙️ Running AI optimization engine...'):
            result = logic.process_plan(temp_path)
        
        st.success("✅ Optimization complete! Plan generated successfully.")
        
        # KPI Section
        st.markdown("## 📊 Key Performance Indicators")
        
        kpi = result['kpi']
        col1, col2, col3, col4, col5 = st.columns(5)
        
        with col1:
            st.metric("Total Demand", f"{kpi['total_demand']:,.0f}", help="Total units demanded across all styles")
        
        with col2:
            allocation_pct = kpi['total_allocated']/kpi['total_demand']*100
            st.metric("Allocated", f"{kpi['total_allocated']:,.0f}", delta=f"{allocation_pct:.1f}%")
        
        with col3:
            st.metric("Avg Efficiency", f"{kpi['weighted_avg_eff']:.1f}%", help="Weighted average group efficiency")
        
        with col4:
            st.metric("Capacity Used", f"{kpi['cap_utilization']:.1f}%", help="Total capacity utilization")
        
        with col5:
            st.metric("Model Score", f"{kpi['model_score']:.1f}%", help="Optimization quality score")
        
        # Charts Section
        st.markdown("## 📈 Analytics Dashboard")
        chart_col1, chart_col2 = st.columns(2)
        
        with chart_col1:
            # Capacity donut chart
            fig_cap = go.Figure(data=[go.Pie(
                labels=['Utilized', 'Available'],
                values=[kpi['cap_utilization'], 100 - kpi['cap_utilization']],
                hole=.6,
                marker_colors=['#667eea', 'rgba(255, 255, 255, 0.1)'],
                textinfo='percent',
                textfont=dict(size=14, color='white'),
                hovertemplate='<b>%{label}</b><br>%{value:.1f}%<extra></extra>'
            )])
            fig_cap.update_layout(
                title=dict(text="Capacity Utilization", font=dict(size=16, color='white')),
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                height=300,
                showlegend=True,
                legend=dict(font=dict(color='white'))
            )
            st.plotly_chart(fig_cap, use_container_width=True)
        
        with chart_col2:
            # Weekly efficiency
            if 'weekly_group_efficiency' in result and result['weekly_group_efficiency']:
                weekly_df = pd.DataFrame(result['weekly_group_efficiency'])
                groups = sorted(weekly_df['Group'].unique())
                selected_group = st.selectbox("📍 Select Group", groups, key="group_selector")
                
                group_data = weekly_df[weekly_df['Group'] == selected_group].sort_values('Week')
                
                fig_eff = go.Figure()
                fig_eff.add_trace(go.Scatter(
                    x=group_data['Week'],
                    y=group_data['Efficiency'],
                    mode='lines+markers',
                    line=dict(color='#00d4ff', width=3),
                    marker=dict(size=10, color='#00d4ff', line=dict(color='white', width=2)),
                    fill='tozeroy',
                    fillcolor='rgba(0, 212, 255, 0.1)',
                    hovertemplate='Week %{x}<br>Efficiency: %{y:.2f}%<extra></extra>'
                ))
                fig_eff.update_layout(
                    title=dict(text=f"Group {selected_group} - Weekly Efficiency", font=dict(size=16, color='white')),
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    height=300,
                    xaxis=dict(title="Week", gridcolor='rgba(255,255,255,0.1)', color='white'),
                    yaxis=dict(title="Efficiency (%)", gridcolor='rgba(255,255,255,0.1)', color='white'),
                    hovermode='x unified'
                )
                st.plotly_chart(fig_eff, use_container_width=True)
        
        # Allocation Summary
        st.markdown("## 📋 Work Allocation Summary")
        summary_df = pd.DataFrame(result['summary'])
        
        for col in summary_df.columns:
            if 'avg' in col.lower() or 'eff' in col.lower():
                summary_df[col] = summary_df[col].round(2)
            elif summary_df[col].dtype in ['float64', 'int64']:
                summary_df[col] = summary_df[col].apply(lambda x: f"{x:,.0f}")
        
        st.dataframe(summary_df, use_container_width=True, height=400)
        
        # Demand Details
        if 'demand_details' in result:
            with st.expander("📦 View Demand Details"):
                demand_df = pd.DataFrame(result['demand_details'])
                st.dataframe(demand_df, use_container_width=True, height=300)
        
        # Detailed Plan
        st.markdown("## 📅 Detailed Production Schedule")
        st.caption(f"📆 Planning Horizon: {result.get('planning_horizon', 7)} weeks")
        
        plan_df = pd.DataFrame(result['detailed_plan'])
        
        # Filters
        filter_col1, filter_col2, filter_col3 = st.columns(3)
        
        with filter_col1:
            weeks = ['All'] + sorted(plan_df['Week'].unique().tolist())
            selected_week = st.selectbox("🗓️ Week", weeks)
        
        with filter_col2:
            groups = ['All'] + sorted(plan_df['Group'].unique().tolist())
            selected_grp = st.selectbox("👥 Group", groups)
        
        with filter_col3:
            styles = ['All'] + sorted(plan_df['Style'].unique().tolist())
            selected_style = st.selectbox("👕 Style", styles)
        
        # Apply filters
        filtered_plan = plan_df.copy()
        if selected_week != 'All':
            filtered_plan = filtered_plan[filtered_plan['Week'] == selected_week]
        if selected_grp != 'All':
            filtered_plan = filtered_plan[filtered_plan['Group'] == selected_grp]
        if selected_style != 'All':
            filtered_plan = filtered_plan[filtered_plan['Style'] == selected_style]
        
        # Format
        display_plan = filtered_plan.copy()
        for col in ['Allocated Qty', 'Shift Capacity', 'HC']:
            if col in display_plan.columns:
                display_plan[col] = display_plan[col].apply(lambda x: f"{x:,.0f}" if pd.notnull(x) else '-')
        
        if 'Eff' in display_plan.columns:
            display_plan['Eff'] = display_plan['Eff'].apply(lambda x: f"{x:.2f}%" if pd.notnull(x) else '-')
        
        st.dataframe(display_plan, use_container_width=True, height=500)
        
        # Export Section
        st.markdown("## 💾 Export Reports")
        download_col1, download_col2 = st.columns(2)
        
        with download_col1:
            csv_plan = plan_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Detailed Plan",
                data=csv_plan,
                file_name="production_plan_detailed.csv",
                mime="text/csv",
                use_container_width=True
            )
        
        with download_col2:
            csv_summary = summary_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Summary",
                data=csv_summary,
                file_name="production_plan_summary.csv",
                mime="text/csv",
                use_container_width=True
            )
        
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")
    
    finally:
        import time
        time.sleep(0.5)
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except:
            pass

else:
    # Landing page
    st.markdown("""
    <div style='text-align: center; padding: 3rem 0;'>
        <p style='font-size: 1.2rem; color: rgba(255, 255, 255, 0.8); line-height: 1.8; max-width: 700px; margin: 0 auto;'>
        Upload your production data to receive an AI-optimized allocation plan that maximizes efficiency 
        while respecting capacity constraints and style-group affinities.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class='feature-card' style='text-align: center; padding: 2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);'>
            <div style='font-size: 2.5rem; margin-bottom: 1rem;'>📊</div>
            <h3 style='color: white; margin-bottom: 0.5rem;'>Upload Data</h3>
            <p style='color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;'>
            Upload your Excel file containing demand and output forecasts
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class='feature-card' style='text-align: center; padding: 2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);'>
            <div style='font-size: 2.5rem; margin-bottom: 1rem;'>⚡</div>
            <h3 style='color: white; margin-bottom: 0.5rem;'>AI Processing</h3>
            <p style='color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;'>
            Advanced algorithms optimize allocation in seconds
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class='feature-card' style='text-align: center; padding: 2rem; background: rgba(102, 126, 234, 0.1); border-radius: 12px; border: 1px solid rgba(102, 126, 234, 0.3);'>
            <div style='font-size: 2.5rem; margin-bottom: 1rem;'>📥</div>
            <h3 style='color: white; margin-bottom: 0.5rem;'>Export Plan</h3>
            <p style='color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;'>
            Download detailed schedules ready for implementation
            </p>
        </div>
        """, unsafe_allow_html=True)