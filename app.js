// ==========================================
// InstaSuite AI App Logic & State Manager
// ==========================================

// Global App State
const state = {
    currentTab: 'dashboard',
    currentAccount: 'main',
    scheduledPosts: [
        {
            id: 'post-1',
            title: '6 Claude Skills for Reels',
            date: '2026-06-24T17:30',
            concept: 'Build once, use forever. 6 Claude custom skills for social media templates.',
            hooks: [
                'One Claude feature cut my content week from 50 hours to 20.',
                'Stop writing prompts. Build content operating systems inside Claude.'
            ],
            caption: '🧠 CLAUDE SKILLS ARE A GAME CHANGER\n\nRun Claude smarter. Get all 6 templates that do hook generation, b-roll styling, cover edits, and captions in one workflow.\n\n👇 Comment "SKILLS" and I will DM you the system vault link instantly!',
            brolls: [
                { type: 'COVER', prompt: 'Cinematic minimalist studio, neon accent background, text: "BUILD ONCE, USE FOREVER"' },
                { type: 'SCENE 1', prompt: 'Fast-paced hand scrolling through Claude interface on screen, dark mode' }
            ],
            status: 'Scheduled',
            type: 'Reel'
        },
        {
            id: 'post-2',
            title: 'Higgsfield MCP Live Demo',
            date: '2026-06-26T12:00',
            concept: 'Connecting image and video generation tools directly inside AI chats.',
            hooks: [
                'You can now generate video directly inside your Claude interface.'
            ],
            caption: '🎬 AI VIDEO DIRECTLY IN CHAT\n\nNo more tab hopping. Higgsfield MCP allows you to call image & video generation triggers straight inside your writing window.\n\n🔥 Comment "VIDEO" to get the setup guide!',
            brolls: [
                { type: 'COVER', prompt: 'Hyperrealistic hand holding phone showing AI video render. 8k' }
            ],
            status: 'Draft',
            type: 'Carousel'
        }
    ],
    competitors: [
        { username: 'growwithalex', followers: '142,380', engagement: '5.64%', growth: '+4.2%', posts: 242 },
        { username: 'socialcreator_pro', followers: '98,400', engagement: '4.82%', growth: '+2.9%', posts: 180 },
        { username: 'faceless_empire', followers: '215,600', engagement: '6.12%', growth: '+7.4%', posts: 410 }
    ],
    currentYear: 2026,
    currentMonth: 5 // June (0-indexed)
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCreator();
    initScheduler();
    initCompetitors();
    initAnalytics();
    
    // Initial Render
    renderDashboardQueue();
    switchTab('dashboard');
});

// Navigation Controller
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Quick create btn
    document.getElementById('quick-create-btn').addEventListener('click', () => {
        openQuickCreateModal();
    });
}

function switchTab(tabId) {
    state.currentTab = tabId;
    
    // Toggle active class in nav
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Toggle active panel
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Update Headers
    const title = document.getElementById('page-title');
    const subtitle = document.getElementById('page-subtitle');
    
    if (tabId === 'dashboard') {
        title.textContent = 'Dashboard';
        subtitle.textContent = `Welcome back. Here is your Instagram performance update.`;
    } else if (tabId === 'creator') {
        title.textContent = 'AI Post Creator';
        subtitle.textContent = 'Stack viral hooks, funnel captions, and Higgsfield B-Roll templates.';
    } else if (tabId === 'scheduler') {
        title.textContent = 'Content Calendar';
        subtitle.textContent = 'Drag-and-drop planned queue, drafts, and automated content batches.';
        renderCalendar();
    } else if (tabId === 'competitors') {
        title.textContent = 'Competitor Spy';
        subtitle.textContent = 'Track and spy on key industry accounts to close content gaps.';
    } else if (tabId === 'analytics') {
        title.textContent = 'Performance Analytics';
        subtitle.textContent = 'Understand followers growth, click-through-rates, and ManyChat leads.';
        // Resize charts to fit viewport container
        if (window.growthChartInstance) window.growthChartInstance.resize();
        if (window.postTypeChartInstance) window.postTypeChartInstance.resize();
        if (window.postingTimesChartInstance) window.postingTimesChartInstance.resize();
    }
}

// AI Post Creator Engine
let generatedPostData = {
    title: '',
    hooks: [],
    caption: '',
    brolls: []
};

function initCreator() {
    const btnHooks = document.getElementById('btn-generate-hooks');
    const btnCaption = document.getElementById('btn-generate-caption');
    const btnAssets = document.getElementById('btn-generate-assets');
    const btnSchedule = document.getElementById('btn-add-to-scheduler');
    
    btnHooks.addEventListener('click', () => {
        const concept = document.getElementById('post-concept').value.trim();
        if (!concept) return alert('Please enter a script or concept idea first!');
        
        btnHooks.classList.add('btn-loading');
        btnHooks.textContent = '🪝 Drafting Hooks...';
        
        setTimeout(() => {
            generateHooks(concept);
            btnHooks.classList.remove('btn-loading');
            btnHooks.innerHTML = '<span>🪝 Generate Hooks</span>';
        }, 1200);
    });

    btnCaption.addEventListener('click', () => {
        const concept = document.getElementById('post-concept').value.trim();
        if (!concept) return alert('Please enter a script or concept idea first!');
        
        btnCaption.textContent = '✍️ Writing Caption...';
        
        setTimeout(() => {
            generateCaption(concept);
            btnCaption.innerHTML = '<span>✍️ Generate Funnel Caption</span>';
        }, 1000);
    });

    btnAssets.addEventListener('click', () => {
        const concept = document.getElementById('post-concept').value.trim();
        if (!concept) return alert('Please enter a script or concept idea first!');
        
        btnAssets.textContent = '🎨 Designing Renders...';
        
        setTimeout(() => {
            generateAssets(concept);
            btnAssets.innerHTML = '<span>🎨 Generate Cover & B-Roll</span>';
            btnSchedule.disabled = false;
        }, 1500);
    });

    btnSchedule.addEventListener('click', () => {
        if (!generatedPostData.caption) {
            alert('Please generate the post first before scheduling!');
            return;
        }
        
        // Push to scheduled state
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 3); // Schedule for 3 days later
        const dateStr = dateObj.toISOString().slice(0, 16);
        
        const newPost = {
            id: 'post-' + Date.now(),
            title: generatedPostData.title || 'AI Generated Reel',
            date: dateStr,
            concept: document.getElementById('post-concept').value,
            hooks: generatedPostData.hooks,
            caption: generatedPostData.caption,
            brolls: generatedPostData.brolls,
            status: 'Scheduled',
            type: 'Reel'
        };
        
        state.scheduledPosts.push(newPost);
        renderDashboardQueue();
        alert('Post scheduled successfully on calendar!');
        switchTab('scheduler');
    });

    // Copy caption
    document.getElementById('btn-copy-caption').addEventListener('click', () => {
        const cap = document.getElementById('caption-output-content').textContent;
        navigator.clipboard.writeText(cap);
        alert('Caption copied to clipboard!');
    });
}

function generateHooks(concept) {
    const tone = document.getElementById('concept-tone').value;
    
    // Formulate title
    const firstLine = concept.split(/[.\n]/)[0];
    generatedPostData.title = firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
    
    // Simulate high converting hook styles
    const hooks = [
        `[Contrarian] Stop writing prompts. This 1 Claude custom skill does the work of 5 tools.`,
        `[Pattern Interrupt] This one AI workflow completely broke my content schedule (in a good way).`,
        `[Curiosity Gap] I saved 30 hours of social media work using Claude’s secret skill layout...`,
        `[Stat Shock] 50 hours of content production crushed to just 20 using a single trigger.`,
        `[Storyteller] Alex spent 3 years scaling channels. This is the AI system he built to replace himself.`,
        `[Question] What if you could build high-converting hooks, covers, and video scripts in one single chat?`
    ];
    
    generatedPostData.hooks = hooks;
    
    const hooksOutputList = document.getElementById('hooks-output-list');
    hooksOutputList.innerHTML = '';
    
    hooks.forEach((hook, i) => {
        const type = hook.match(/\[(.*?)\]/)[1];
        const content = hook.replace(/\[.*?\] /, '');
        
        const hBox = document.createElement('div');
        hBox.className = 'hook-box';
        hBox.innerHTML = `
            <div class="hook-meta">
                <span class="hook-type">${type} Hook</span>
                <button class="btn-mini-copy" onclick="copyText('${content.replace(/'/g, "\\'")}')">Copy</button>
            </div>
            <p class="hook-content">"${content}"</p>
        `;
        hooksOutputList.appendChild(hBox);
    });
    
    document.getElementById('generated-hooks-card').style.display = 'block';
    
    // Update mockup cover overlay
    const overlayTitle = document.getElementById('mockup-overlay-title');
    overlayTitle.textContent = generatedPostData.title;
    overlayTitle.style.display = 'block';
}

function generateCaption(concept) {
    const trigger = document.getElementById('manychat-trigger').value.trim() || 'GROW';
    
    const caption = `🧠 NEW CONTENT AUTOMATION WORKFLOW\n\nHere is how to automate the repetitive parts of social media without losing your brand style.\n\n1️⃣ Hook Stacking (No more blank pages)\n2️⃣ Cinematic B-Roll Prompts (Using Higgsfield)\n3️⃣ Customized Covers & Visual Presets\n\nNo prompt tricks. Just a pure content operating system.\n\n👇 Comment "${trigger.toUpperCase()}" and I will instantly DM you my automated 6-step skills system vault!`;
    
    generatedPostData.caption = caption;
    
    document.getElementById('caption-output-content').textContent = caption;
    document.getElementById('generated-caption-card').style.display = 'block';
    
    // Update Instagram mock caption
    document.getElementById('mockup-caption-text').textContent = caption;
}

function generateAssets(concept) {
    // Generate simulated prompts
    const brolls = [
        { type: 'COVER GRAPHIC', prompt: 'Cinematic glassmorphic tablet showing AI workflows glowing, dark futuristic theme, gradient highlights [Ready for Higgsfield]' },
        { type: 'B-ROLL SCENE 1', prompt: 'Over-the-shoulder view of high-end creator interface designing automation calendars' },
        { type: 'B-ROLL SCENE 2', prompt: 'Stylized neon studio lighting, abstract shapes shifting dynamically in background, loopable. 4k resolution' }
    ];
    
    generatedPostData.brolls = brolls;
    
    const brollList = document.getElementById('broll-prompts-output');
    brollList.innerHTML = '';
    
    brolls.forEach(item => {
        const card = document.createElement('div');
        card.className = 'broll-item';
        card.innerHTML = `
            <div class="broll-header">${item.type}</div>
            <p class="broll-prompt-text">Prompt: <span>${item.prompt}</span></p>
        `;
        brollList.appendChild(card);
    });

    // Alter Instagram preview visual state to indicate mock asset loaded
    const mediaContainer = document.getElementById('mockup-media-render');
    mediaContainer.style.background = 'linear-gradient(135deg, rgba(144, 97, 249, 0.4), rgba(255, 94, 142, 0.3))';
    mediaContainer.innerHTML = `
        <span class="media-icon">✨</span>
        <p style="color: white; font-weight: 500;">Asset Renders Active</p>
    `;
    
    document.getElementById('mockup-overlay-badge').style.display = 'block';
}

function copyText(txt) {
    navigator.clipboard.writeText(txt);
    alert('Copied: ' + txt);
}

// Content Scheduler Calendar
function initScheduler() {
    document.getElementById('prev-month').addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });

    // Modal Close
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-submit-btn').addEventListener('click', handleModalSubmit);
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
    document.getElementById('calendar-month-year').textContent = `${months[state.currentMonth]} ${state.currentYear}`;
    
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';
    
    const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    
    // Empty prefix days
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        daysContainer.appendChild(emptyDay);
    }
    
    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        // Check if today
        const today = new Date();
        if (today.getDate() === day && today.getMonth() === state.currentMonth && today.getFullYear() === state.currentYear) {
            dayDiv.classList.add('today');
        }
        
        dayDiv.innerHTML = `<span class="day-number">${day}</span><div class="day-events"></div>`;
        
        // Find events on this day
        const dateString = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = state.scheduledPosts.filter(post => post.date.startsWith(dateString));
        
        const eventsContainer = dayDiv.querySelector('.day-events');
        dayEvents.forEach(evt => {
            const eventSpan = document.createElement('span');
            eventSpan.className = 'calendar-event';
            if (evt.status === 'Draft') eventSpan.classList.add('accent-event');
            eventSpan.textContent = evt.title;
            eventSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                inspectPost(evt);
            });
            eventsContainer.appendChild(eventSpan);
        });

        dayDiv.addEventListener('click', () => {
            openQuickCreateModal(dateString);
        });
        
        daysContainer.appendChild(dayDiv);
    }
}

function inspectPost(post) {
    const inspector = document.getElementById('scheduler-inspector');
    inspector.innerHTML = `
        <div class="inspector-details">
            <div class="inspector-preview-card">
                <div class="inspector-preview-text">${post.title.toUpperCase()}</div>
            </div>
            
            <div class="inspector-info-row">
                <strong>Schedule Time</strong>
                <span>${post.date.replace('T', ' ')}</span>
            </div>
            <div class="inspector-info-row">
                <strong>Format Type</strong>
                <span class="badge badge-info">${post.type}</span>
            </div>
            <div class="inspector-info-row">
                <strong>Status</strong>
                <span class="badge ${post.status === 'Scheduled' ? 'badge-success' : 'badge-accent'}">${post.status}</span>
            </div>
            
            <div class="form-group">
                <label>Caption Preview</label>
                <div class="inspector-caption">${post.caption.replace(/\n/g, '<br>')}</div>
            </div>
            
            <button class="btn btn-secondary btn-full" onclick="deletePost('${post.id}')">Delete Schedule</button>
        </div>
    `;
}

window.deletePost = function(postId) {
    state.scheduledPosts = state.scheduledPosts.filter(p => p.id !== postId);
    renderCalendar();
    renderDashboardQueue();
    document.getElementById('scheduler-inspector').innerHTML = '<p class="empty-state">Select a scheduled post or date to inspect, reschedule, or publish.</p>';
};

function renderDashboardQueue() {
    const queueList = document.getElementById('dashboard-queue');
    if (!queueList) return;
    
    queueList.innerHTML = '';
    
    if (state.scheduledPosts.length === 0) {
        queueList.innerHTML = '<p class="empty-state">No upcoming scheduled posts. Create one in the AI Post Creator!</p>';
        return;
    }
    
    // Sort scheduled posts by date ascending
    const sorted = [...state.scheduledPosts].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    sorted.forEach(post => {
        const qItem = document.createElement('div');
        qItem.className = 'queue-item';
        
        const date = new Date(post.date);
        const formatTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formatDateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        qItem.innerHTML = `
            <div class="queue-media">${post.type === 'Reel' ? '🎬' : '📸'}</div>
            <div class="queue-details">
                <h4>${post.title}</h4>
                <p>Status: ${post.status}</p>
            </div>
            <div class="queue-meta">
                <span class="queue-time">${formatTime}</span>
                <p class="queue-status">${formatDateStr}</p>
            </div>
        `;
        queueList.appendChild(qItem);
    });
}

// Quick modal triggers
let targetModalDate = '';
function openQuickCreateModal(dateStr = '') {
    targetModalDate = dateStr;
    const modal = document.getElementById('quick-create-modal');
    modal.classList.add('active');
    
    // Populate date picker default
    const dateInput = document.getElementById('modal-date');
    if (dateStr) {
        dateInput.value = `${dateStr}T17:30`;
    } else {
        const now = new Date();
        dateInput.value = now.toISOString().slice(0, 16);
    }
}

function closeModal() {
    document.getElementById('quick-create-modal').classList.remove('active');
}

function handleModalSubmit() {
    const title = document.getElementById('modal-title').value.trim();
    const date = document.getElementById('modal-date').value;
    const notes = document.getElementById('modal-notes').value.trim();
    
    if (!title) {
        alert('Please enter a post title!');
        return;
    }
    
    const newPost = {
        id: 'post-' + Date.now(),
        title: title,
        date: date,
        concept: notes,
        hooks: [],
        caption: notes || 'No caption generated.',
        brolls: [],
        status: 'Draft',
        type: 'Reel'
    };
    
    state.scheduledPosts.push(newPost);
    renderCalendar();
    renderDashboardQueue();
    closeModal();
    
    // Clear modal fields
    document.getElementById('modal-title').value = '';
    document.getElementById('modal-notes').value = '';
}

// Competitors Spy Engine
function initCompetitors() {
    const trackBtn = document.getElementById('btn-track-competitor');
    trackBtn.addEventListener('click', () => {
        const username = document.getElementById('competitor-username').value.trim();
        if (!username) return;
        
        // Add competitor mock
        const followers = Math.floor(Math.random() * 200 + 40) + ',000';
        const engagement = (Math.random() * 4 + 3).toFixed(2) + '%';
        const growth = '+' + (Math.random() * 6 + 2).toFixed(1) + '%';
        
        state.competitors.push({
            username: username.replace('@', ''),
            followers: followers,
            engagement: engagement,
            growth: growth,
            posts: Math.floor(Math.random() * 300 + 100)
        });
        
        document.getElementById('competitor-username').value = '';
        renderCompetitorsMatrix();
    });
    
    renderCompetitorsMatrix();
    renderSpyFeed();
    renderGapIdeas();
}

function renderCompetitorsMatrix() {
    const tbody = document.getElementById('competitors-comparison-rows');
    tbody.innerHTML = '';
    
    state.competitors.forEach(comp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="table-account-name">@${comp.username}</td>
            <td>${comp.followers}</td>
            <td>${comp.engagement}</td>
            <td>${comp.growth}</td>
            <td>
                <button class="btn-small-danger" onclick="removeCompetitor('${comp.username}')">Remove</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

window.removeCompetitor = function(username) {
    state.competitors = state.competitors.filter(c => c.username !== username);
    renderCompetitorsMatrix();
};

function renderSpyFeed() {
    const spyFeedList = document.getElementById('competitor-spy-feed');
    spyFeedList.innerHTML = `
        <div class="spy-feed-item">
            <div class="spy-feed-header">
                <span class="spy-account">@faceless_empire</span>
                <span class="spy-engagement">8.42% Engagement</span>
            </div>
            <p class="spy-caption">"My 50-hour work week just got compressed into 20 hours because of this single secret skill feature in Claude AI..."</p>
            <div class="spy-tags-box">
                <span class="spy-hook-tag">Stat Shock Hook</span>
                <span class="spy-hook-tag">Growth Hack</span>
            </div>
        </div>
        <div class="spy-feed-item">
            <div class="spy-feed-header">
                <span class="spy-account">@socialcreator_pro</span>
                <span class="spy-engagement">6.91% Engagement</span>
            </div>
            <p class="spy-caption">"Why you should STOP using chatgpt for content templates. Use this exact structure for high CTR in 2026 instead..."</p>
            <div class="spy-tags-box">
                <span class="spy-hook-tag">Contrarian Hook</span>
                <span class="spy-hook-tag">Tutorial</span>
            </div>
        </div>
    `;
}

function renderGapIdeas() {
    const gapList = document.getElementById('competitor-gap-ideas');
    gapList.innerHTML = `
        <div class="gap-idea-card">
            <div class="gap-header">
                <span class="gap-tag">High CTR Theme</span>
                <span class="gap-confidence">94% Confidence</span>
            </div>
            <h4>ManyChat Keyphrase Loop templates</h4>
            <p>Competitor @faceless_empire generated 24k views on comment triggers. Your account has 0 posts matching this pattern.</p>
        </div>
        <div class="gap-idea-card">
            <div class="gap-header">
                <span class="gap-tag">B-Roll style gap</span>
                <span class="gap-confidence">88% Confidence</span>
            </div>
            <h4>Faceless Stoic Aesthetic Loops</h4>
            <p>Visual style with textured grainy filters performing 40% better on reels than clean vector designs.</p>
        </div>
    `;
}

// Analytics Charts (ChartJS Initialization)
function initAnalytics() {
    // Growth line chart
    const ctxGrowth = document.getElementById('growthChart').getContext('2d');
    window.growthChartInstance = new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: '@growwithalex',
                data: [82000, 95000, 112000, 125000, 134000, 142380],
                borderColor: '#9061F9',
                backgroundColor: 'rgba(144, 97, 249, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Competitor Average',
                data: [75000, 84000, 93000, 105000, 115000, 121000],
                borderColor: '#FF5E8E',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });

    // Engagement post type bar chart
    const ctxPostType = document.getElementById('postTypeChart').getContext('2d');
    window.postTypeChartInstance = new Chart(ctxPostType, {
        type: 'bar',
        data: {
            labels: ['Reels', 'Carousels', 'Single Images', 'Stories'],
            datasets: [{
                label: 'Avg Engagement %',
                data: [7.82, 5.14, 3.24, 1.84],
                backgroundColor: ['#9061F9', '#FF5E8E', '#10B981', '#3B82F6'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF' } },
                x: { grid: { display: false }, ticks: { color: '#9CA3AF' } }
            }
        }
    });

    // Optimal times polar area chart
    const ctxOptimal = document.getElementById('postingTimesChart').getContext('2d');
    window.postingTimesChartInstance = new Chart(ctxOptimal, {
        type: 'radar',
        data: {
            labels: ['9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'],
            datasets: [{
                label: 'Engagement Score',
                data: [65, 85, 45, 95, 75, 30],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                r: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    angleLines: { color: 'rgba(255,255,255,0.05)' },
                    pointLabels: { color: '#9CA3AF' },
                    ticks: { display: false }
                }
            }
        }
    });
}
