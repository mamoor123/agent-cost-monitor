// ===== DATA STORE =====
const Store = {
    agents: [],
    alerts: [],
    activities: [],
    settings: {
        theme: 'dark',
        alertThreshold: 80,
        autoStop: true
    },

    // Initialize with sample data
    init() {
        this.agents = [
            {
                id: 1,
                name: 'Customer Support Bot',
                model: 'gpt-4',
                description: 'Handles customer inquiries',
                budget: 100.00,
                costToday: 67.50,
                costWeek: 425.80,
                status: 'running',
                createdAt: new Date('2026-06-10')
            },
            {
                id: 2,
                name: 'Content Writer',
                model: 'claude-3-sonnet',
                description: 'Generates blog posts and articles',
                budget: 50.00,
                costToday: 23.40,
                costWeek: 156.20,
                status: 'running',
                createdAt: new Date('2026-06-12')
            },
            {
                id: 3,
                name: 'Data Analyzer',
                model: 'gpt-4-turbo',
                description: 'Processes and analyzes datasets',
                budget: 200.00,
                costToday: 145.20,
                costWeek: 892.50,
                status: 'running',
                createdAt: new Date('2026-06-08')
            },
            {
                id: 4,
                name: 'Code Reviewer',
                model: 'claude-3-opus',
                description: 'Reviews pull requests',
                budget: 75.00,
                costToday: 72.80,
                costWeek: 489.60,
                status: 'running',
                createdAt: new Date('2026-06-14')
            },
            {
                id: 5,
                name: 'Email Responder',
                model: 'gpt-3.5-turbo',
                description: 'Drafts email responses',
                budget: 30.00,
                costToday: 8.90,
                costWeek: 52.30,
                status: 'stopped',
                createdAt: new Date('2026-06-15')
            }
        ];

        this.alerts = [
            {
                id: 1,
                type: 'warning',
                title: 'Budget Alert: Code Reviewer',
                description: 'Code Reviewer has used 97% of its daily budget ($72.80 / $75.00)',
                agentId: 4,
                time: new Date(Date.now() - 300000)
            },
            {
                id: 2,
                type: 'danger',
                title: 'Budget Exceeded: Data Analyzer',
                description: 'Data Analyzer has exceeded weekly budget by $92.50',
                agentId: 3,
                time: new Date(Date.now() - 1800000)
            },
            {
                id: 3,
                type: 'success',
                title: 'Agent Auto-Stopped',
                description: 'Email Responder was automatically stopped to prevent budget overrun',
                agentId: 5,
                time: new Date(Date.now() - 3600000)
            }
        ];

        this.activities = [
            {
                id: 1,
                type: 'cost',
                icon: 'fa-dollar-sign',
                text: 'Data Analyzer incurred $12.40 in costs',
                time: new Date(Date.now() - 120000)
            },
            {
                id: 2,
                type: 'alert',
                icon: 'fa-exclamation-triangle',
                text: 'Code Reviewer approaching budget limit (97%)',
                time: new Date(Date.now() - 300000)
            },
            {
                id: 3,
                type: 'success',
                icon: 'fa-check-circle',
                text: 'Customer Support Bot completed 150 tasks',
                time: new Date(Date.now() - 600000)
            },
            {
                id: 4,
                type: 'info',
                icon: 'fa-robot',
                text: 'Content Writer started new session',
                time: new Date(Date.now() - 900000)
            },
            {
                id: 5,
                type: 'cost',
                icon: 'fa-dollar-sign',
                text: 'Total daily cost reached $317.80',
                time: new Date(Date.now() - 1200000)
            }
        ];

        this.loadFromStorage();
    },

    loadFromStorage() {
        const saved = localStorage.getItem('agentwatch-data');
        if (saved) {
            const data = JSON.parse(saved);
            this.agents = data.agents || this.agents;
            this.alerts = data.alerts || this.alerts;
            this.activities = data.activities || this.activities;
            this.settings = data.settings || this.settings;
        }
    },

    saveToStorage() {
        localStorage.setItem('agentwatch-data', JSON.stringify({
            agents: this.agents,
            alerts: this.alerts,
            activities: this.activities,
            settings: this.settings
        }));
    },

    addAgent(agent) {
        agent.id = Date.now();
        agent.costToday = 0;
        agent.costWeek = 0;
        agent.status = 'running';
        agent.createdAt = new Date();
        this.agents.push(agent);
        this.addActivity('info', 'fa-robot', `${agent.name} was added`);
        this.saveToStorage();
        return agent;
    },

    removeAgent(id) {
        const agent = this.agents.find(a => a.id === id);
        if (agent) {
            this.agents = this.agents.filter(a => a.id !== id);
            this.addActivity('info', 'fa-trash', `${agent.name} was removed`);
            this.saveToStorage();
        }
    },

    toggleAgentStatus(id) {
        const agent = this.agents.find(a => a.id === id);
        if (agent) {
            agent.status = agent.status === 'running' ? 'stopped' : 'running';
            const action = agent.status === 'running' ? 'started' : 'stopped';
            this.addActivity('info', 'fa-robot', `${agent.name} was ${action}`);
            this.saveToStorage();
        }
    },

    updateBudget(id, budget, threshold) {
        const agent = this.agents.find(a => a.id === id);
        if (agent) {
            agent.budget = budget;
            agent.alertThreshold = threshold;
            this.addActivity('info', 'fa-wallet', `Budget updated for ${agent.name}: $${budget}`);
            this.saveToStorage();
        }
    },

    addAlert(type, title, description, agentId) {
        const alert = {
            id: Date.now(),
            type,
            title,
            description,
            agentId,
            time: new Date()
        };
        this.alerts.unshift(alert);
        this.saveToStorage();
        return alert;
    },

    dismissAlert(id) {
        this.alerts = this.alerts.filter(a => a.id !== id);
        this.saveToStorage();
    },

    clearAlerts() {
        this.alerts = [];
        this.saveToStorage();
    },

    addActivity(type, icon, text) {
        const activity = {
            id: Date.now(),
            type,
            icon,
            text,
            time: new Date()
        };
        this.activities.unshift(activity);
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        this.saveToStorage();
    },

    getTotalCostToday() {
        return this.agents.reduce((sum, agent) => sum + agent.costToday, 0);
    },

    getActiveAgents() {
        return this.agents.filter(a => a.status === 'running').length;
    },

    getBudgetAlerts() {
        return this.agents.filter(a => {
            const percentage = (a.costToday / a.budget) * 100;
            return percentage >= (a.alertThreshold || 80);
        }).length;
    },

    getStoppedAgents() {
        return this.agents.filter(a => a.status === 'stopped').length;
    },

    getCostData(days = 7) {
        const data = [];
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            data.push(Math.random() * 500 + 200);
        }
        return { labels, data };
    }
};

// ===== PENDO TRACK EVENT DEDUPLICATION =====
const _pendoTrackedAutoStopped = new Set();
const _pendoTrackedThresholdExceeded = new Set();
let _pendoSearchDebounceTimer = null;

// ===== UI CONTROLLER =====
const UI = {
    currentSection: 'dashboard',
    chart: null,

    init() {
        this.bindEvents();
        this.renderDashboard();
        this.renderAgents();
        this.renderBudgets();
        this.renderAlerts();
        this.renderActivities();
        this.initChart();
        this.updateStats();
        this.applyTheme(Store.settings.theme);
    },

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Menu toggle
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });

        // Theme switch
        document.getElementById('theme-switch').addEventListener('change', (e) => {
            const previousTheme = Store.settings.theme;
            const theme = e.target.checked ? 'light' : 'dark';
            this.applyTheme(theme);
            Store.settings.theme = theme;
            Store.saveToStorage();

            if (typeof pendo !== 'undefined') {
                pendo.track('theme_changed', {
                    theme: theme,
                    previous_theme: previousTheme
                });
            }
        });

        // Add Agent buttons
        document.getElementById('add-agent-btn').addEventListener('click', () => this.showModal('add-agent-modal'));
        document.getElementById('add-agent-btn-2').addEventListener('click', () => this.showModal('add-agent-modal'));

        // Set Budget button
        document.getElementById('set-budget-btn').addEventListener('click', () => {
            this.populateBudgetSelect();
            this.showModal('set-budget-modal');
        });

        // Clear Alerts button
        document.getElementById('clear-alerts-btn').addEventListener('click', () => {
            if (typeof pendo !== 'undefined') {
                const alertTypes = [...new Set(Store.alerts.map(a => a.type))];
                pendo.track('alerts_bulk_cleared', {
                    alerts_count: Store.alerts.length,
                    alert_types_cleared: alertTypes.join(',')
                });
            }

            Store.clearAlerts();
            this.renderAlerts();
            this.updateStats();
        });

        // Modal close buttons
        document.getElementById('modal-close').addEventListener('click', () => this.hideModal('add-agent-modal'));
        document.getElementById('modal-cancel').addEventListener('click', () => this.hideModal('add-agent-modal'));
        document.getElementById('budget-modal-close').addEventListener('click', () => this.hideModal('set-budget-modal'));
        document.getElementById('budget-modal-cancel').addEventListener('click', () => this.hideModal('set-budget-modal'));

        // Add Agent form
        document.getElementById('add-agent-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAgent();
        });

        // Set Budget form
        document.getElementById('set-budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSetBudget();
        });

        // Chart filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateChart(btn.dataset.range);
            });
        });

        // Search
        document.querySelector('.search-box input').addEventListener('input', (e) => {
            const query = e.target.value;
            this.filterAgents(query);

            clearTimeout(_pendoSearchDebounceTimer);
            _pendoSearchDebounceTimer = setTimeout(() => {
                if (typeof pendo !== 'undefined' && query.length > 0) {
                    const visibleRows = document.querySelectorAll('#agents-tbody tr');
                    let resultsCount = 0;
                    visibleRows.forEach(row => {
                        if (row.style.display !== 'none') resultsCount++;
                    });
                    pendo.track('agent_search_executed', {
                        query: query.substring(0, 100),
                        results_count: resultsCount,
                        total_agents_count: Store.agents.length
                    });
                }
            }, 500);
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    },

    switchSection(section) {
        this.currentSection = section;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `${section}-section`);
        });

        // Update header
        const titles = {
            dashboard: 'Dashboard',
            agents: 'AI Agents',
            budgets: 'Budget Management',
            alerts: 'Alerts & Notifications',
            settings: 'Settings'
        };
        document.querySelector('.header-left h1').textContent = titles[section] || 'Dashboard';

        // Close sidebar on mobile
        document.querySelector('.sidebar').classList.remove('active');
    },

    showModal(id) {
        document.getElementById(id).classList.add('active');
    },

    hideModal(id) {
        document.getElementById(id).classList.remove('active');
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('theme-switch').checked = theme === 'light';
    },

    handleAddAgent() {
        const name = document.getElementById('agent-name').value;
        const model = document.getElementById('agent-model').value;
        const budget = parseFloat(document.getElementById('agent-budget').value);
        const description = document.getElementById('agent-description').value;

        if (name && model && budget) {
            Store.addAgent({ name, model, budget, description });

            if (typeof pendo !== 'undefined') {
                pendo.track('agent_created', {
                    agent_name: name,
                    model: model,
                    budget: budget,
                    has_description: Boolean(description),
                    total_agents_count: Store.agents.length
                });
            }

            this.renderAgents();
            this.updateStats();
            this.hideModal('add-agent-modal');
            document.getElementById('add-agent-form').reset();
            this.showNotification('Agent added successfully!', 'success');
        }
    },

    handleSetBudget() {
        const agentId = parseInt(document.getElementById('budget-agent-select').value);
        const budget = parseFloat(document.getElementById('budget-amount').value);
        const threshold = parseInt(document.getElementById('budget-threshold').value);

        if (agentId && budget) {
            const agent = Store.agents.find(a => a.id === agentId);
            const previousBudget = agent ? agent.budget : null;

            Store.updateBudget(agentId, budget, threshold);

            if (typeof pendo !== 'undefined' && agent) {
                pendo.track('budget_updated', {
                    agent_id: String(agentId),
                    agent_name: agent.name,
                    budget_amount: budget,
                    alert_threshold: threshold,
                    previous_budget: previousBudget,
                    model: agent.model
                });
            }

            this.renderAgents();
            this.renderBudgets();
            this.updateStats();
            this.hideModal('set-budget-modal');
            document.getElementById('set-budget-form').reset();
            this.showNotification('Budget updated successfully!', 'success');
        }
    },

    populateBudgetSelect() {
        const select = document.getElementById('budget-agent-select');
        select.innerHTML = Store.agents.map(agent =>
            `<option value="${agent.id}">${agent.name}</option>`
        ).join('');
    },

    renderDashboard() {
        this.updateStats();
    },

    updateStats() {
        document.getElementById('total-cost').textContent = `$${Store.getTotalCostToday().toFixed(2)}`;
        document.getElementById('active-agents').textContent = Store.getActiveAgents();
        document.getElementById('budget-alerts').textContent = Store.getBudgetAlerts();
        document.getElementById('agents-stopped').textContent = Store.getStoppedAgents();
        document.getElementById('alert-count').textContent = Store.alerts.length;
    },

    renderAgents() {
        const tbody = document.getElementById('agents-tbody');
        
        if (Store.agents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <i class="fas fa-robot"></i>
                            <h3>No agents yet</h3>
                            <p>Add your first AI agent to start monitoring costs</p>
                            <button class="btn btn-primary" onclick="UI.showModal('add-agent-modal')">
                                <i class="fas fa-plus"></i> Add Agent
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = Store.agents.map(agent => {
            const percentage = (agent.costToday / agent.budget) * 100;
            const fillClass = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'safe';
            
            return `
                <tr>
                    <td>
                        <div class="agent-name">
                            <div class="agent-avatar">${agent.name.charAt(0)}</div>
                            <div class="agent-info">
                                <h4>${agent.name}</h4>
                                <p>${agent.description || 'No description'}</p>
                            </div>
                        </div>
                    </td>
                    <td><span class="model-badge">${agent.model}</span></td>
                    <td class="cost-cell">$${agent.costToday.toFixed(2)}</td>
                    <td>
                        <div class="budget-cell">
                            <div class="budget-bar">
                                <div class="budget-fill ${fillClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                            </div>
                            <span class="budget-text">${percentage.toFixed(0)}% of $${agent.budget.toFixed(2)}</span>
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${agent.status}">
                            <i class="fas fa-circle"></i>
                            ${agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <div class="actions-cell">
                            <button class="action-btn tooltip" data-tooltip="${agent.status === 'running' ? 'Stop' : 'Start'}" onclick="UI.toggleAgent(${agent.id})">
                                <i class="fas fa-${agent.status === 'running' ? 'pause' : 'play'}"></i>
                            </button>
                            <button class="action-btn tooltip" data-tooltip="Edit Budget" onclick="UI.editBudget(${agent.id})">
                                <i class="fas fa-wallet"></i>
                            </button>
                            <button class="action-btn danger tooltip" data-tooltip="Remove" onclick="UI.removeAgent(${agent.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderBudgets() {
        const grid = document.getElementById('budgets-grid');
        
        if (Store.agents.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <h3>No budgets set</h3>
                    <p>Add agents and set their budgets to track spending</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = Store.agents.map(agent => {
            const percentage = (agent.costToday / agent.budget) * 100;
            const fillClass = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'safe';
            const remaining = Math.max(0, agent.budget - agent.costToday);

            return `
                <div class="budget-card">
                    <div class="budget-card-header">
                        <h3>${agent.name}</h3>
                        <span class="model-badge">${agent.model}</span>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar">
                            <div class="budget-progress-fill ${fillClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="budget-progress-text">
                            <span class="spent">$${agent.costToday.toFixed(2)} spent</span>
                            <span class="limit">$${agent.budget.toFixed(2)} limit</span>
                        </div>
                    </div>
                    <div class="budget-details">
                        <div class="budget-detail">
                            <div class="budget-detail-label">Remaining</div>
                            <div class="budget-detail-value">$${remaining.toFixed(2)}</div>
                        </div>
                        <div class="budget-detail">
                            <div class="budget-detail-label">Used</div>
                            <div class="budget-detail-value">${percentage.toFixed(1)}%</div>
                        </div>
                        <div class="budget-detail">
                            <div class="budget-detail-label">Weekly</div>
                            <div class="budget-detail-value">$${agent.costWeek.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    renderAlerts() {
        const list = document.getElementById('alerts-list');
        
        if (Store.alerts.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <h3>No alerts</h3>
                    <p>You're all caught up! Alerts will appear here when agents approach their budget limits.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = Store.alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-icon ${alert.type}">
                    <i class="fas fa-${alert.type === 'warning' ? 'exclamation-triangle' : alert.type === 'danger' ? 'times-circle' : 'check-circle'}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-description">${alert.description}</div>
                    <div class="alert-time">${this.getTimeAgo(alert.time)}</div>
                </div>
                <div class="alert-actions">
                    <button class="alert-dismiss" onclick="UI.dismissAlert(${alert.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderActivities() {
        const list = document.getElementById('activity-list');
        
        list.innerHTML = Store.activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${this.getTimeAgo(activity.time)}</div>
                </div>
            </div>
        `).join('');
    },

    initChart() {
        const ctx = document.getElementById('cost-chart').getContext('2d');
        const { labels, data } = Store.getCostData(7);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Cost ($)',
                    data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f1f5f9',
                        bodyColor: '#94a3b8',
                        borderColor: '#334155',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `$${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8',
                            callback: (value) => `$${value}`
                        }
                    }
                }
            }
        });
    },

    updateChart(range) {
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        const { labels, data } = Store.getCostData(days);

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    },

    toggleAgent(id) {
        const agent = Store.agents.find(a => a.id === id);
        const previousStatus = agent ? agent.status : null;

        Store.toggleAgentStatus(id);

        if (typeof pendo !== 'undefined' && agent) {
            pendo.track('agent_status_toggled', {
                agent_id: String(agent.id),
                agent_name: agent.name,
                new_status: agent.status,
                previous_status: previousStatus,
                model: agent.model,
                cost_today: agent.costToday,
                budget: agent.budget,
                budget_usage_pct: Math.round((agent.costToday / agent.budget) * 100)
            });
        }

        this.renderAgents();
        this.updateStats();
    },

    editBudget(id) {
        const agent = Store.agents.find(a => a.id === id);
        if (agent) {
            this.populateBudgetSelect();
            document.getElementById('budget-agent-select').value = id;
            document.getElementById('budget-amount').value = agent.budget;
            document.getElementById('budget-threshold').value = agent.alertThreshold || 80;
            this.showModal('set-budget-modal');
        }
    },

    removeAgent(id) {
        if (confirm('Are you sure you want to remove this agent?')) {
            const agent = Store.agents.find(a => a.id === id);

            if (typeof pendo !== 'undefined' && agent) {
                pendo.track('agent_removed', {
                    agent_id: String(agent.id),
                    agent_name: agent.name,
                    model: agent.model,
                    budget: agent.budget,
                    cost_today: agent.costToday,
                    cost_week: agent.costWeek,
                    agent_status: agent.status
                });
            }

            Store.removeAgent(id);
            this.renderAgents();
            this.renderBudgets();
            this.updateStats();
            this.showNotification('Agent removed', 'info');
        }
    },

    dismissAlert(id) {
        const alert = Store.alerts.find(a => a.id === id);

        if (typeof pendo !== 'undefined' && alert) {
            pendo.track('alert_dismissed', {
                alert_id: String(alert.id),
                alert_type: alert.type,
                alert_title: alert.title,
                agent_id: alert.agentId ? String(alert.agentId) : '',
                remaining_alerts_count: Store.alerts.length - 1
            });
        }

        Store.dismissAlert(id);
        this.renderAlerts();
        this.updateStats();
    },

    filterAgents(query) {
        const rows = document.querySelectorAll('#agents-tbody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    },

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background-color: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// ===== SIMULATION ENGINE =====
const Simulator = {
    interval: null,

    start() {
        // Simulate real-time cost updates every 5 seconds
        this.interval = setInterval(() => {
            this.simulateCostUpdates();
            this.checkBudgetAlerts();
            UI.updateStats();
            UI.renderAgents();
            UI.renderBudgets();
            UI.renderActivities();
        }, 5000);
    },

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    },

    simulateCostUpdates() {
        Store.agents.forEach(agent => {
            if (agent.status === 'running') {
                // Random cost increment between $0.10 and $2.00
                const increment = (Math.random() * 1.9 + 0.1);
                agent.costToday += increment;
                agent.costWeek += increment;
            }
        });
        Store.saveToStorage();
    },

    checkBudgetAlerts() {
        Store.agents.forEach(agent => {
            if (agent.status !== 'running') return;

            const percentage = (agent.costToday / agent.budget) * 100;
            const threshold = agent.alertThreshold || 80;

            if (percentage >= 100 && Store.settings.autoStop) {
                agent.status = 'stopped';
                Store.addAlert('danger', `Budget Exceeded: ${agent.name}`,
                    `${agent.name} has exceeded its daily budget and was automatically stopped`, agent.id);
                Store.addActivity('alert', 'fa-stop-circle',
                    `${agent.name} auto-stopped: budget exceeded`);

                if (typeof pendo !== 'undefined' && !_pendoTrackedAutoStopped.has(agent.id)) {
                    _pendoTrackedAutoStopped.add(agent.id);
                    pendo.track('agent_auto_stopped', {
                        agent_id: String(agent.id),
                        agent_name: agent.name,
                        model: agent.model,
                        budget: agent.budget,
                        cost_today: agent.costToday,
                        overage_amount: parseFloat((agent.costToday - agent.budget).toFixed(2)),
                        cost_week: agent.costWeek
                    });
                }
            } else if (percentage >= threshold && percentage < threshold + 5) {
                Store.addAlert('warning', `Budget Alert: ${agent.name}`,
                    `${agent.name} has used ${percentage.toFixed(0)}% of its daily budget`, agent.id);
                Store.addActivity('alert', 'fa-exclamation-triangle',
                    `${agent.name} approaching budget limit (${percentage.toFixed(0)}%)`);

                if (typeof pendo !== 'undefined' && !_pendoTrackedThresholdExceeded.has(agent.id)) {
                    _pendoTrackedThresholdExceeded.add(agent.id);
                    pendo.track('budget_threshold_exceeded', {
                        agent_id: String(agent.id),
                        agent_name: agent.name,
                        model: agent.model,
                        budget: agent.budget,
                        cost_today: agent.costToday,
                        percentage_used: parseFloat(percentage.toFixed(1)),
                        threshold: threshold,
                        remaining_budget: parseFloat((agent.budget - agent.costToday).toFixed(2))
                    });
                }
            }
        });
        Store.saveToStorage();
    }
};

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    pendo.initialize({
        visitor: {
            id: ''
        }
    });

    Store.init();
    UI.init();
    Simulator.start();
});
