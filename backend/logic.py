import pandas as pd
import numpy as np
from io import BytesIO

# --- CONSTANTS ---
BASE_OUTPUT_100_EFF = 480
SHIFT_HOURS = 7.5
QTY_COL = 'QTY'
SEW_WEEK_COL = 'SEW_WEEK'
STYLE_COL = 'style_construction_detail'
EFF_COL = 'eff'
GROUPLINE_COL = 'groupline'
SHIFTS_PER_WEEK = [f"s{i}" for i in range(1, 13)]

def generate_template_file():
    demand_template = pd.DataFrame({
        'PLANT': ['90'] * 5, 'SELL_STYLE': ['STBA02', 'STLL02', 'STBA03', 'STLL03', 'STBA04'],
        'PACK_STYLE': ['STBA02_001', 'STLL02_001', 'STBA03_001', 'STLL03_001', 'STBA04_001'],
        'SELL_COLOR': ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK'], 'SELL_SIZE': ['M', 'L', 'M', 'L', 'S'],
        'QTY': [1421, 1500, 1300, 1450, 1350], 'DC': ['DC1'] * 5,
        'SEW_WEEK': [202538] * 5, 'CUT_WEEK': [202537] * 5, 
        'style_construction_detail': ['5PBX Sewcenter', 'BX Boy jersey', '5PBX Sewcenter', 'BX Boy jersey', 'Woven Boxer-Exposed WB']
    })
    output_template = pd.DataFrame({
        'year': [2025] * 5, 'month': ['Sep'] * 5, 'week': [38] * 5,
        'groupline': ['035-042', '051-058', '059-066', '067-074', '075-082'], 'shift': ['B'] * 5,
        'style': ['Knit MKCB', 'Woven Boxer-Exposed WB', 'Woven Boxer-Exposed WB', 'Woven Boxer-Exposed WB', 'BB White normal'],
        'size': ['R2'] * 5, 'cd_btn': ['Y'] * 5, 'eff': [153.10, 141.30, 121.40, 99.20, 125.50],
        'HC': [86, 94, 85, 77, 73], 'output': [1290, 1661, 1293, 952, 2131],
        'rate_cbc': [98.0, 98.1, 98.0, 98.0, 98.1], 'output for 100% efficiency with 38 employee': [1500] * 5,
        'standard allowance hour to produce 385 dz': [10] * 5, 'actual hour': [9] * 5
    })
    style_template = pd.DataFrame({
        'SELLING_GARMENT': ['STBA02_001', 'STLL02_001', 'STBA03_001', 'STLL03_001', 'STBA04_001'],
        'STYLE_DETAIL': ['5PBX Sewcenter', 'BX Boy jersey', '5PBX Sewcenter', 'BX Boy jersey', 'Woven Boxer-Exposed WB']
    })
    
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        demand_template.to_excel(writer, sheet_name='demand_forecast', index=False)
        output_template.to_excel(writer, sheet_name='Output_forecast', index=False)
        style_template.to_excel(writer, sheet_name='style_construction', index=False)
    output.seek(0)
    return output

def process_plan(file_content):
    # 1. READ DATA
    excel_data = pd.ExcelFile(file_content)
    demand_df = pd.read_excel(file_content, sheet_name='demand_forecast')
    output_df = pd.read_excel(file_content, sheet_name='Output_forecast')

    # 2. PREPROCESSING
    # Validate columns
    required_demand_cols = [STYLE_COL, QTY_COL, SEW_WEEK_COL]
    required_output_cols = [GROUPLINE_COL, EFF_COL, 'HC']
    
    missing_demand = [col for col in required_demand_cols if col not in demand_df.columns]
    missing_output = [col for col in required_output_cols if col not in output_df.columns]
    
    if missing_demand:
        raise ValueError(f"Missing columns in 'demand_forecast': {', '.join(missing_demand)}")
    if missing_output:
        raise ValueError(f"Missing columns in 'Output_forecast': {', '.join(missing_output)}")

    demand_df[STYLE_COL] = demand_df[STYLE_COL].astype(str).str.strip()
    output_df[GROUPLINE_COL] = output_df[GROUPLINE_COL].astype(str).str.strip()
    demand_df[QTY_COL] = pd.to_numeric(demand_df[QTY_COL], errors='coerce').fillna(0)

    # Calculate Horizon
    demand_df['week_num'] = demand_df[SEW_WEEK_COL].astype(str).str.split('.').str[0].str[-2:]
    demand_df['week_num'] = pd.to_numeric(demand_df['week_num'], errors='coerce')
    unique_weeks = sorted(demand_df['week_num'].dropna().astype(int).unique())
    planning_horizon_weeks = len(unique_weeks)
    
    if planning_horizon_weeks == 0:
        raise ValueError("Could not determine planning horizon.")

    # 3. PREPARE DEMAND ROWS (NO AGGREGATION)
    # Keep all individual demand rows with their specific SELL_STYLE, SELL_COLOR, etc.
    # Create a copy with safe column access
    demand_rows = demand_df.copy()
    
    # Ensure required metadata columns exist with defaults
    metadata_cols = ['SELL_STYLE', 'SELL_COLOR', 'SELL_SIZE', 'PACK_STYLE', 'SELL_PACK', 'PRIMARY_DC']
    for col in metadata_cols:
        if col not in demand_rows.columns:
            demand_rows[col] = '-'
    
    # Select only the columns we need
    base_cols = [STYLE_COL, QTY_COL]
    available_cols = base_cols + [col for col in metadata_cols if col in demand_rows.columns]
    demand_rows = demand_rows[available_cols].copy()
    
    # Sort by quantity descending (highest demand first for greedy allocation)
    demand_rows = demand_rows.sort_values(by=QTY_COL, ascending=False).reset_index(drop=True)
    
    # DEBUG: Check Output_forecast structure
    print("\n" + "="*60)
    print("OUTPUT_FORECAST COLUMNS:")
    print("="*60)
    print(f"Total rows: {len(output_df)}")
    print(f"Columns: {list(output_df.columns)}")
    print("\nFirst 3 rows of Output_forecast:")
    print(output_df.head(3).to_string())
    print("="*60 + "\n")
    
    # SIZE MAPPING: Convert demand sizes to Output_forecast R-codes
    def map_size_to_r_code(size):
        """Map numeric size to R-code range"""
        try:
            size_num = int(size)
            if size_num == 41:
                return 'R1'
            elif size_num in [42, 43, 44]:
                return 'R2'
            elif size_num in [45, 46]:
                return 'R3'
        except:
            pass
        return size  # Return as-is if no mapping
    
    # 3.5. BUILD STYLE-SIZE-GROUP AFFINITY MAP FROM OUTPUT_FORECAST
    # Map (style, size) combinations to groups that have worked on them
    # Also build a lookup for style-specific efficiency
    style_size_group_map = {}
    group_style_efficiency = {}  # NEW: (group, style) -> efficiency
    
    for _, row in output_df.iterrows():
        style = str(row.get('style construction', '')).strip()
        size = str(row.get('size', '')).strip()
        group = str(row[GROUPLINE_COL]).strip()
        output = row.get('output', 0)
        eff = row.get(EFF_COL, 0)
        
        if style and group:
            key = (style, size) if size else (style, '')
            if key not in style_size_group_map:
                style_size_group_map[key] = []
            # Store group with its output and efficiency
            style_size_group_map[key].append({'group': group, 'output': output, 'eff': eff})
            
            # Store style-specific efficiency for this group-style combination
            group_style_key = (group, style)
            if group_style_key not in group_style_efficiency:
                group_style_efficiency[group_style_key] = []
            group_style_efficiency[group_style_key].append(eff)
    
    # Average the efficiency for each group-style combination
    for key in group_style_efficiency:
        group_style_efficiency[key] = sum(group_style_efficiency[key]) / len(group_style_efficiency[key])
    
    # Sort each group list by output (descending) - highest output first
    for key in style_size_group_map:
        style_size_group_map[key] = sorted(
            style_size_group_map[key], 
            key=lambda x: x['output'], 
            reverse=True
        )
    
    # DEBUG: Print affinity map summary
    print("\n" + "="*60)
    print(f"AFFINITY MAP: {len(style_size_group_map)} unique (style, size) combinations")
    print("="*60)
    if len(style_size_group_map) > 0:
        print("Sample entries:")
        for i, (key, groups) in enumerate(list(style_size_group_map.items())[:5]):
            style_name, size_name = key
            print(f"  {i+1}. Style: '{style_name[:40]}...' | Size: '{size_name}' | {len(groups)} groups")
    print("="*60 + "\n")
    
    # Calculate group capacity
    group_stats = output_df.groupby(GROUPLINE_COL).agg({
        EFF_COL: 'mean', 
        'HC': 'mean'
    }).reset_index()
    
    base_rate = BASE_OUTPUT_100_EFF / 38 / SHIFT_HOURS
    hours_per_horizon = SHIFT_HOURS * 2 * 6 * planning_horizon_weeks
    
    group_stats['Total_Capacity'] = group_stats['HC'] * hours_per_horizon * base_rate * (group_stats[EFF_COL] / 100)
    group_stats = group_stats.sort_values(by='Total_Capacity', ascending=False).reset_index(drop=True)
    
    # 4. TWO-PHASE ALLOCATION
    allocations = [] 
    demand_queue = demand_rows.to_dict('records')
    groups_dict = {row[GROUPLINE_COL]: row for row in group_stats.to_dict('records')}
    
    total_demand_initial = demand_df[QTY_COL].sum()
    total_capacity_initial = group_stats['Total_Capacity'].sum()
    
    # PHASE 1: AFFINITY-BASED ALLOCATION (PRIORITY)
    phase1_matches = 0
    phase1_attempts = 0
    for demand in demand_queue:
        style = demand[STYLE_COL]
        size = demand.get('SELL_SIZE', '')
        
        # Map demand size to R-code
        r_code = map_size_to_r_code(size)
        
        # Try exact match: (style, R-code)
        key = (style, r_code) if r_code else (style, '')
        preferred_groups = style_size_group_map.get(key, [])
        
        # If no exact match, try just style
        if not preferred_groups and r_code:
            key = (style, '')
            preferred_groups = style_size_group_map.get(key, [])
        
        # DEBUG: Log first 5 matching attempts
        if phase1_attempts < 5:
            print(f"Demand {phase1_attempts+1}: Style='{style[:40]}', Size={size} (R-code:{r_code}) -> {len(preferred_groups)} preferred groups")
            phase1_attempts += 1
        
        # Try allocating to preferred groups (sorted by efficiency)
        for pref in preferred_groups:
            group_name = pref['group']
            if group_name in groups_dict:
                current_group = groups_dict[group_name]
                group_cap = current_group['Total_Capacity']
                demand_qty = demand[QTY_COL]
                
                if demand_qty <= 0 or group_cap <= 0:
                    continue
                
                amount_to_allocate = min(demand_qty, group_cap)
                
                # Look up style-specific efficiency, fallback to group average
                style_name = demand[STYLE_COL]
                group_style_key = (group_name, style_name)
                style_eff = group_style_efficiency.get(group_style_key, current_group[EFF_COL])
                
                allocations.append({
                    'Group': group_name,
                    'Style': demand[STYLE_COL],
                    'SELL_STYLE': demand.get('SELL_STYLE', '-'),
                    'PACK_STYLE': demand.get('PACK_STYLE', '-'),
                    'SELL_COLOR': demand.get('SELL_COLOR', '-'),
                    'SELL_SIZE': demand.get('SELL_SIZE', '-'),
                    'SELL_PACK': demand.get('SELL_PACK', '-'),
                    'PRIMARY_DC': demand.get('PRIMARY_DC', '-'),
                    'Allocated_Qty': amount_to_allocate,
                    'HC': current_group['HC'],
                    'Eff': style_eff,  # Use style-specific efficiency
                    'Total_Group_Cap': current_group['Total_Capacity'] + amount_to_allocate,
                    'Phase': 'Affinity'  # Track which phase allocated this
                })
                
                phase1_matches += 1
                demand[QTY_COL] -= amount_to_allocate
                groups_dict[group_name]['Total_Capacity'] -= amount_to_allocate
                
                if demand[QTY_COL] <= 0.01:
                    break
    
    print(f"\nPhase 1 Summary: {phase1_matches} successful matches out of {len(demand_queue)} demands\n")
    
    # PHASE 2: GREEDY FALLBACK FOR REMAINING DEMAND
    # Rebuild groups queue from remaining capacity, sorted by capacity
    groups_queue = sorted(
        [g for g in groups_dict.values() if g['Total_Capacity'] > 0.01],
        key=lambda x: x['Total_Capacity'],
        reverse=True
    )
    
    # Sort unallocated demands by remaining quantity
    remaining_demands = [d for d in demand_queue if d[QTY_COL] > 0.01]
    remaining_demands.sort(key=lambda x: x[QTY_COL], reverse=True)
    
    g_idx = 0
    d_idx = 0
    
    while d_idx < len(remaining_demands) and g_idx < len(groups_queue):
        current_demand = remaining_demands[d_idx]
        current_group = groups_queue[g_idx]
        
        demand_qty = current_demand[QTY_COL]
        group_cap = current_group['Total_Capacity']
        
        if demand_qty <= 0:
            d_idx += 1
            continue
        if group_cap <= 0:
            g_idx += 1
            continue
        
        amount_to_allocate = min(demand_qty, group_cap)
        
        # Look up style-specific efficiency, fallback to group average
        style_name = current_demand[STYLE_COL]
        group_name = current_group[GROUPLINE_COL]
        group_style_key = (group_name, style_name)
        style_eff = group_style_efficiency.get(group_style_key, current_group[EFF_COL])
        
        allocations.append({
            'Group': current_group[GROUPLINE_COL],
            'Style': current_demand[STYLE_COL],
            'SELL_STYLE': current_demand.get('SELL_STYLE', '-'),
            'PACK_STYLE': current_demand.get('PACK_STYLE', '-'),
            'SELL_COLOR': current_demand.get('SELL_COLOR', '-'),
            'SELL_SIZE': current_demand.get('SELL_SIZE', '-'),
            'SELL_PACK': current_demand.get('SELL_PACK', '-'),
            'PRIMARY_DC': current_demand.get('PRIMARY_DC', '-'),
            'Allocated_Qty': amount_to_allocate,
            'HC': current_group['HC'],
            'Eff': style_eff,  # Use style-specific efficiency
            'Total_Group_Cap': current_group['Total_Capacity'] + amount_to_allocate,
            'Phase': 'Greedy'  # Track which phase allocated this
        })
        
        remaining_demands[d_idx][QTY_COL] -= amount_to_allocate
        groups_queue[g_idx]['Total_Capacity'] -= amount_to_allocate
        
        if remaining_demands[d_idx][QTY_COL] <= 0.01:
            d_idx += 1 
        
        if groups_queue[g_idx]['Total_Capacity'] <= 0.01:
            g_idx += 1 
    
    allocation_df = pd.DataFrame(allocations)
    if allocation_df.empty:
        allocation_df = pd.DataFrame(columns=[
            'Group', 'Style', 'SELL_STYLE', 'PACK_STYLE', 'SELL_COLOR', 
            'SELL_SIZE', 'Allocated_Qty', 'HC', 'Eff', 'Total_Group_Cap', 'Phase'
        ])


    # DEBUG: Print allocation phase statistics
    if not allocation_df.empty and 'Phase' in allocation_df.columns:
        phase_stats = allocation_df.groupby('Phase')['Allocated_Qty'].agg(['sum', 'count']).reset_index()
        print("\n" + "="*60)
        print("ALLOCATION PHASE STATISTICS")
        print("="*60)
        for _, row in phase_stats.iterrows():
            phase = row['Phase']
            total_qty = float(row['sum'])
            num_allocations = int(row['count'])
            print(f"{phase:10} | {num_allocations:4} allocations | {total_qty:12,.0f} units")
        print("="*60 + "\n")
    
    unallocated_qty = sum(d[QTY_COL] for d in demand_queue)
    total_allocated = allocation_df['Allocated_Qty'].sum() if not allocation_df.empty else 0

    # 5. KPI CALCULATIONS
    if total_allocated > 0:
        weighted_avg_eff = (allocation_df['Eff'] * allocation_df['Allocated_Qty']).sum() / total_allocated
    else:
        weighted_avg_eff = 0

    cap_utilization = (total_allocated / total_capacity_initial * 100) if total_capacity_initial > 0 else 0

    max_eff = group_stats[EFF_COL].max()
    effective_output = (allocation_df['Allocated_Qty'] * (allocation_df['Eff']/100)).sum()
    theoretical_max_output = total_allocated * (max_eff/100)
    model_score = (effective_output / theoretical_max_output * 100) if theoretical_max_output > 0 else 0

    changeovers = allocation_df.groupby('Group').size().sub(1).sum()
    if changeovers < 0: changeovers = 0

    kpi_data = {
        'total_demand': float(total_demand_initial),
        'total_allocated': float(total_allocated),
        'weighted_avg_eff': float(weighted_avg_eff),
        'cap_utilization': float(cap_utilization),
        'model_score': float(model_score),
        'changeovers': int(changeovers),
        'unallocated_qty': float(unallocated_qty)
    }

    # 6. WORK ALLOCATION SUMMARY
    summary_df = allocation_df.groupby(['Group', 'HC', 'Eff']).agg({
        'Allocated_Qty': 'sum'
    }).reset_index()
    
    summary_df['Total Capacity (Units)'] = summary_df['HC'] * hours_per_horizon * base_rate * (summary_df['Eff'] / 100)
    summary_df['Weekly Capacity (Units)'] = summary_df['Total Capacity (Units)'] / planning_horizon_weeks
    
    summary_df = summary_df[[
        'Group', 'HC', 'Eff', 'Weekly Capacity (Units)', 'Total Capacity (Units)', 'Allocated_Qty'
    ]]
    summary_df.columns = ['Group', 'Average HC', 'Efficiency (%)', 'Weekly Capacity (Units)', 'Total Capacity (Units)', 'Allocated Units']
    summary_data = summary_df.sort_values(by='Allocated Units', ascending=False).to_dict('records')

    # 7. DETAILED PLAN
    plan_rows = []
    
    for group_name in group_stats[GROUPLINE_COL].unique():
        group_work = allocation_df[allocation_df['Group'] == group_name].copy()
        if group_work.empty: continue
        
        hc = group_work.iloc[0]['HC']
        eff = group_work.iloc[0]['Eff']
        cap_per_shift = hc * SHIFT_HOURS * base_rate * (eff / 100)
        cap_per_week = cap_per_shift * 12  # 12 shifts per week
        
        tasks = []
        for _, row in group_work.iterrows():
            tasks.append({
                'Style': row['Style'],
                'SELL_STYLE': row['SELL_STYLE'],
                'PACK_STYLE': row['PACK_STYLE'],
                'SELL_COLOR': row['SELL_COLOR'],
                'SELL_SIZE': row.get('SELL_SIZE', '-'),
                'SELL_PACK': row.get('SELL_PACK', '-'),
                'PRIMARY_DC': row.get('PRIMARY_DC', '-'),
                'Qty': row['Allocated_Qty'],
                'Eff': row['Eff']  # Store efficiency for this specific task/style
            })
        
        current_task_idx = 0
        
        # ZERO CHANGEOVERS: Assign ONE style per week for all 12 shifts
        for week in unique_weeks:
            if current_task_idx >= len(tasks):
                # No more tasks, mark entire week as IDLE
                for shift in SHIFTS_PER_WEEK:
                    plan_rows.append({
                        'Week': int(week),
                        'Group': group_name,
                        'Shift': shift,
                        'Style': 'IDLE',
                        'SELL_STYLE': '-',
                        'PACK_STYLE': '-',
                        'SELL_COLOR': '-',
                        'SELL_SIZE': '-',
                        'SELL_PACK': '-',
                        'PRIMARY_DC': '-',
                        'Allocated Qty': 0.0,
                        'Shift Capacity': float(cap_per_shift),
                        'HC': float(hc),
                        'Eff': float(eff)  # Use group's base efficiency for IDLE
                    })
                continue
            
            # Get current task
            task = tasks[current_task_idx]
            qty_remaining = task['Qty']
            task_eff = task['Eff']  # Get efficiency for THIS specific task/style
            task_cap_per_shift = hc * SHIFT_HOURS * base_rate * (task_eff / 100)
            task_cap_per_week = task_cap_per_shift * 12
            
            # Allocate to this week (one style for all 12 shifts)
            units_this_week = min(qty_remaining, task_cap_per_week)
            units_per_shift = units_this_week / 12  # Distribute evenly across 12 shifts
            
            # Assign same style to all 12 shifts
            for shift in SHIFTS_PER_WEEK:
                plan_rows.append({
                    'Week': int(week),
                    'Group': group_name,
                    'Shift': shift,
                    'Style': task['Style'],
                    'SELL_STYLE': task['SELL_STYLE'],
                    'PACK_STYLE': task['PACK_STYLE'],
                    'SELL_COLOR': task['SELL_COLOR'],
                    'SELL_SIZE': task['SELL_SIZE'],
                    'SELL_PACK': task.get('SELL_PACK', '-'),
                    'PRIMARY_DC': task.get('PRIMARY_DC', '-'),
                    'Allocated Qty': float(units_per_shift),
                    'Shift Capacity': float(task_cap_per_shift),  # Use task-specific capacity
                    'HC': float(hc),
                    'Eff': float(task_eff)  # Use task-specific efficiency
                })
            
            # Update task remaining quantity
            tasks[current_task_idx]['Qty'] -= units_this_week
            
            # Move to next task if current one complete
            if tasks[current_task_idx]['Qty'] <= 0.1:
                current_task_idx += 1

    final_plan_df = pd.DataFrame(plan_rows)
    
    # Sort by Week, Group, then Shift (numerically) so shifts go s1, s2, ... s12 for each group in each week
    if not final_plan_df.empty and 'Week' in final_plan_df.columns and 'Shift' in final_plan_df.columns:
        # Extract shift number from 's1', 's2', etc. for proper numerical sorting
        final_plan_df['shift_num'] = final_plan_df['Shift'].str.extract(r'(\d+)').astype(int)
        final_plan_df = final_plan_df.sort_values(by=['Week', 'Group', 'shift_num'], ascending=True)
        final_plan_df = final_plan_df.drop('shift_num', axis=1).reset_index(drop=True)
    
    # Prepare demand details table (sorted by quantity descending)
    # Select columns that actually exist
    detail_cols = [STYLE_COL]
    for col in ['SELL_STYLE', 'SELL_COLOR', 'SELL_SIZE', 'PACK_STYLE']:
        if col in demand_rows.columns:
            detail_cols.append(col)
    detail_cols.append(QTY_COL)
    
    demand_details = demand_rows[detail_cols].copy()
    demand_details = demand_details.sort_values(by=QTY_COL, ascending=False).reset_index(drop=True)
    
    # Rename columns for display
    col_rename = {STYLE_COL: 'Style', QTY_COL: 'Demand Qty'}
    demand_details = demand_details.rename(columns=col_rename)
    
    # Calculate weekly group efficiency for chart
    # Show the actual efficiency based on which style the group is working on each week
    weekly_efficiency_data = []
    if not final_plan_df.empty:
        for group_name in final_plan_df['Group'].unique():
            group_data = final_plan_df[final_plan_df['Group'] == group_name]
            
            for week in group_data['Week'].unique():
                week_data = group_data[group_data['Week'] == week]
                
                # Get the efficiency for this week (based on the style being worked on)
                # Use the Eff value from the plan (could vary if working on different styles)
                eff = week_data.iloc[0]['Eff'] if not week_data.empty else 0
                
                weekly_efficiency_data.append({
                    'Group': group_name,
                    'Week': int(week),
                    'Efficiency': float(eff)
                })
    
    return {
        'kpi': kpi_data,
        'summary': summary_data,
        'demand_details': demand_details.to_dict('records'),
        'detailed_plan': final_plan_df.to_dict('records'),
        'planning_horizon': planning_horizon_weeks,
        'weekly_group_efficiency': weekly_efficiency_data
    }
