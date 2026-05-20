const state = {
  persona: null,
  screen: 'persona',
  newCase: {
    category: 'Benefits',
    subject: 'Question about dependent eligibility',
    description: 'Need guidance on dependent verification requirements for upcoming enrollment.',
    priority: 'Medium',
    member: 'Jordan Lee (Employee ID: MC-4921)'
  },
  generatedCase: null
};

const app = document.getElementById('app');
const helpFab = document.getElementById('help-fab');
helpFab.addEventListener('click', () => alert('Demo help center: Contact HealthEquity support at 1-800-555-0147.'));

const memberCases = [
  ['HEQ-10422', 'Benefits', 'Medium', 'In Progress', '18h'],
  ['HEQ-10409', 'Document Request', 'Low', 'Waiting on Member', '42h'],
  ['HEQ-10387', 'Claims', 'High', 'Assigned', '6h']
];
const adminCases = [
  ['HEQ-10422', 'Jordan Lee', 'Benefits', 'Medium', 'In Progress', '18h', 'A. Nguyen'],
  ['HEQ-10447', 'Taylor Kim', 'Enrollment', 'High', 'New', '5h', 'P. Scott'],
  ['HEQ-10409', 'Sam Patel', 'Document Request', 'Low', 'Waiting on Member', '42h', 'D. Reyes'],
  ['HEQ-10352', 'Riley Chen', 'Escalation', 'High', 'In Progress', '2h (At Risk)', 'Escalations Queue']
];

function render() {
  if (state.screen === 'persona') return renderPersona();
  app.innerHTML = renderPortalShell();
  bindCommonActions();
}

function renderPersona() {
  app.innerHTML = `<div class="persona-shell"><div class="persona-wrap">
      <h1 class="hero-title">Mayo Clinic Case Management Portal</h1>
      <p class="hero-sub">Hackathon prototype: future-state experience for Mayo Clinic and HealthEquity case support (demo data only, no PHI).</p>
      <div class="persona-grid">
        <div class="persona-card" data-persona="member"><h3>Member / Employee</h3><p>Submit and track support cases, upload secure documents, and communicate with support teams.</p></div>
        <div class="persona-card" data-persona="admin"><h3>Mayo Administrator</h3><p>Monitor organizational case performance, SLA risk, escalations, and cross-member support metrics.</p></div>
      </div></div></div>`;
  app.querySelectorAll('.persona-card').forEach(c => c.onclick = () => {
    state.persona = c.dataset.persona;
    state.screen = state.persona === 'member' ? 'member-dashboard' : 'admin-dashboard';
    render();
  });
}

function renderPortalShell() {
  const isMember = state.persona === 'member';
  const content = isMember ? renderMemberScreen() : renderAdminScreen();
  return `<div class="portal">
    <header class="topbar">
      <div class="logo-title">Mayo Clinic Case Management Portal</div>
      <nav class="top-links"><a href="#" data-go="${isMember ? 'member-dashboard' : 'admin-dashboard'}">⌂ Home</a><a href="#">✉ Messages</a><a href="#">❖ Support</a><a href="#" data-go="persona">⇢ Logout</a></nav>
      <div class="profile">${isMember ? 'Avery Morgan • Member' : 'Patricia Gomez • Mayo Administrator'}</div>
    </header>
    <aside class="left-nav">${leftNav(isMember)}</aside>
    <main class="main">${content}</main>
    <aside class="right-panel">${rightPanel()}</aside>
  </div>`;
}
function leftNav(isMember){
  return `<div class="nav-section-title">Account & Services</div>
    ${isMember ? `
      <button class="nav-item ${active('member-dashboard')}" data-go="member-dashboard">Dashboard</button>
      <button class="nav-item ${active('member-create')}" data-go="member-create">Create Case</button>
      <button class="nav-item ${active('member-case-detail')}" data-go="member-case-detail">My Case Detail</button>` : `
      <button class="nav-item ${active('admin-dashboard')}" data-go="admin-dashboard">Admin Dashboard</button>
      <button class="nav-item ${active('admin-case-list')}" data-go="admin-case-list">Case List</button>
      <button class="nav-item ${active('admin-case-detail')}" data-go="admin-case-detail">Case Detail</button>
      <button class="nav-item ${active('admin-sla-dashboard')}" data-go="admin-sla-dashboard">SLA & Performance</button>`}
      <div class="nav-section-title">Salesforce Mapping</div>
      <div class="card note">
        <div>• Experience Cloud: external portal shell</div>
        <div>• Case object: intake & tracking</div>
        <div>• Contact/Account: user-org relationship</div>
        <div>• Files: secure document uploads</div>
        <div>• Reports/Dashboards: admin metrics</div>
        <div>• Sharing Rules/Permission Sets: persona access</div>
        <div>• Notifications: SLA alerts & updates</div>
      </div>`;
}
function rightPanel(){
  return `<h4 style="margin:0 0 10px">Resources & Help</h4>
    <div class="help-item"><strong>Case Submission Tips</strong><div class="note">Provide complete descriptions to speed routing.</div></div>
    <div class="help-item"><strong>Security Notice</strong><div class="note">Demo only. No real PHI is stored in this prototype.</div></div>
    <div class="help-item"><strong>SLA Policy</strong><div class="note">High priority cases target first response within 4 business hours.</div></div>`;
}
function active(s){ return state.screen === s ? 'active' : ''; }
function crumb(t){ return `<div class="breadcrumb">${state.persona === 'member' ? 'Member Portal' : 'Admin Portal'} / ${t}</div>`; }

function renderMemberScreen(){
  switch(state.screen){
    case 'member-dashboard':
      return `${crumb('Dashboard')}<h2 class="page-title">Welcome, Avery Morgan</h2>
      <div class="grid-4">
        ${metric('Open Cases','3')}${metric('Waiting on Me','1')}${metric('Recently Updated','2')}${metric('SLA Due Soon','1')}
      </div>
      <div style="margin:14px 0"><button class="primary" data-go="member-create">Create New Case</button></div>
      <div class="card"><h3>Recent Cases</h3>
      <table class="table"><tr><th>Case #</th><th>Category</th><th>Priority</th><th>Status</th><th>SLA</th></tr>
      ${memberCases.map(r=>`<tr><td><a href="#" data-go="member-case-detail">${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${statusPill(r[3])}</td><td>${r[4]}</td></tr>`).join('')}</table></div>`;
    case 'member-create':
      return `${crumb('Create Case')}<h2 class="page-title">Create New Case</h2>
      <div class="card"><label>Case Category</label><select id="cat">${['Benefits','Claims','Enrollment','Account Access','Payroll Contribution','Document Request','Escalation','General Inquiry'].map(c=>`<option ${state.newCase.category===c?'selected':''}>${c}</option>`).join('')}</select>
      <label>Subject</label><input id="subject" value="${state.newCase.subject}"/>
      <label>Description</label><textarea id="desc">${state.newCase.description}</textarea>
      <label>Priority</label><select id="priority"><option>Low</option><option selected>Medium</option><option>High</option></select>
      <label>Related Member</label><select id="member"><option selected>${state.newCase.member}</option><option>Casey Roberts (MC-7710)</option></select>
      <button class="primary" data-action="save-case">Continue</button></div>`;
    case 'member-upload':
      return `${crumb('Document Upload')}<h2 class="page-title">Secure Document Upload</h2>
      <div class="card"><div class="chart-placeholder">Drag & drop area (simulated)</div><p class="note">Rule: Up to 2 attachments, each under 2 MB.</p>
      <ul><li>eligibility_letter.pdf (1.2 MB)</li><li>dependent_form.jpg (0.8 MB)</li></ul>
      <button class="primary" data-go="member-review">Continue</button></div>`;
    case 'member-review':
      return `${crumb('Review & Submit')}<h2 class="page-title">Review Case Submission</h2>
      <div class="card"><p><strong>Category:</strong> ${state.newCase.category}</p><p><strong>Subject:</strong> ${state.newCase.subject}</p><p><strong>Description:</strong> ${state.newCase.description}</p><p><strong>Priority:</strong> ${state.newCase.priority}</p><p><strong>Related Member:</strong> ${state.newCase.member}</p>
      <button class="primary" data-action="submit-case">Submit Case</button></div>`;
    case 'member-confirmation':
      return `${crumb('Confirmation')}<h2 class="page-title">Case Submitted Successfully</h2>
      <div class="card"><p><strong>Case Number:</strong> ${state.generatedCase}</p><p><strong>Status:</strong> ${statusPill('New')}</p><p><strong>Estimated SLA Response:</strong> 8 business hours</p>
      <button class="primary" data-go="member-case-detail">View Case</button></div>`;
    case 'member-case-detail':
      return `${crumb('Case Detail')}<h2 class="page-title">Member Case Detail ${state.generatedCase ? `(${state.generatedCase})` : '(HEQ-10422)'}</h2>
      <div class="card"><h3>Status Timeline</h3><div class="timeline"><div class="step active">New</div><div class="step">Assigned</div><div class="step">In Progress</div><div class="step">Waiting on Member</div><div class="step">Resolved</div></div></div>
      <div class="grid-2" style="margin-top:12px"><div class="card"><h3>SLA Countdown</h3><p class="metric">07:42:13</p><small>Time to first-response target.</small></div>
      <div class="card"><h3>Messages</h3><p><strong>Support:</strong> We received your case and assigned it for triage.</p><p><strong>You:</strong> Thank you, awaiting next steps.</p></div></div>
      <div class="card" style="margin-top:12px"><label>Add Comment</label><textarea placeholder="Type your message"></textarea><button class="primary">Post Comment</button> <button class="ghost">Upload Additional Document</button> <button class="ghost" data-go="member-dashboard">Back to Dashboard</button></div>`;
  }
}

function renderAdminScreen(){
  switch(state.screen){
    case 'admin-dashboard':
      return `${crumb('Dashboard')}<h2 class="page-title">Mayo Administrator Dashboard</h2><div class="note">Organization: <strong>Mayo Clinic</strong></div>
      <div class="grid-4" style="margin-top:10px">${metric('Total Open Cases','147')}${metric('SLA At Risk','12')}${metric('Escalated Cases','9')}${metric('Resolved This Month','384')}</div>
      <div class="grid-2" style="margin-top:12px"><div class="card"><h3>Case Trend</h3><div class="chart-placeholder">30-day case volume trend placeholder</div></div>
      <div class="card"><h3>Category Breakdown</h3><p>Benefits: 39%</p><p>Claims: 22%</p><p>Enrollment: 18%</p><p>Account Access: 11%</p></div></div>
      <div style="margin-top:12px"><button class="primary" data-go="admin-case-list">View All Cases</button> <button class="ghost" data-go="admin-sla-dashboard">Open SLA & Performance</button></div>`;
    case 'admin-case-list':
      return `${crumb('Case List')}<h2 class="page-title">Organization Case List</h2>
      <div class="card"><div class="grid-4"><select><option>Status: All</option><option>New</option><option>In Progress</option></select><select><option>Category: All</option><option>Benefits</option><option>Claims</option></select><select><option>Priority: All</option><option>High</option><option>Medium</option></select><select><option>SLA Risk: All</option><option>At Risk</option></select></div>
      <table class="table"><tr><th>Case Number</th><th>Member</th><th>Category</th><th>Priority</th><th>Status</th><th>SLA</th><th>Owner</th></tr>
      ${adminCases.map(r=>`<tr><td><a href="#" data-go="admin-case-detail">${r[0]}</a></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${statusPill(r[4])}</td><td>${r[5]}</td><td>${r[6]}</td></tr>`).join('')}</table></div>`;
    case 'admin-case-detail':
      return `${crumb('Case Detail')}<h2 class="page-title">Admin Case Detail (HEQ-10352)</h2>
      <div class="grid-2"><div class="card"><h3>Case Overview</h3><p><strong>Category:</strong> Escalation</p><p><strong>Priority:</strong> High</p><p><strong>Status:</strong> ${statusPill('In Progress')}</p><p><strong>SLA Status:</strong> <span class="status-pill s-risk">At Risk - 2h Remaining</span></p></div>
      <div class="card"><h3>Member Information</h3><p><strong>Name:</strong> Riley Chen</p><p><strong>Member ID:</strong> MC-****-9081</p><p><strong>DOB:</strong> **/**/1989</p><p><strong>Email:</strong> ri***@example.com</p><p class="note">Sensitive fields masked for admin visibility.</p></div></div>
      <div class="grid-2" style="margin-top:12px"><div class="card"><h3>Internal Notes</h3><p>Routing to escalation queue due to repeat denial concern.</p></div><div class="card"><h3>Public Comments</h3><p>Member requested urgent callback before end of day.</p></div></div>
      <div style="margin-top:12px"><button class="primary">Add Comment</button> <button class="ghost">Escalate Case</button> <button class="ghost">Mark Follow-Up Needed</button></div>`;
    case 'admin-sla-dashboard':
      return `${crumb('SLA & Performance')}<h2 class="page-title">SLA and Performance Dashboard</h2>
      <div class="grid-2"><div class="card"><h3>Case Volume Trend</h3><div class="chart-placeholder">Trend chart placeholder</div></div><div class="card"><h3>SLA Performance</h3><p>First Response SLA Met: <strong>92.4%</strong></p><p>Resolution SLA Met: <strong>89.1%</strong></p><p>Escalation Rate: <strong>6.7%</strong></p><p>Top Categories: Benefits, Claims, Enrollment</p></div></div>
      <div style="margin-top:12px"><button class="ghost" data-go="admin-dashboard">Back to Admin Dashboard</button></div>`;
  }
}

function bindCommonActions(){
  app.querySelectorAll('[data-go]').forEach(el=>el.onclick=(e)=>{e.preventDefault(); state.screen = el.dataset.go; if(state.screen==='persona'){state.persona=null;} render();});
  const save = app.querySelector('[data-action="save-case"]');
  if(save) save.onclick = () => {
    state.newCase.category = document.getElementById('cat').value;
    state.newCase.subject = document.getElementById('subject').value;
    state.newCase.description = document.getElementById('desc').value;
    state.newCase.priority = document.getElementById('priority').value;
    state.newCase.member = document.getElementById('member').value;
    state.screen = 'member-upload';
    render();
  };
  const submit = app.querySelector('[data-action="submit-case"]');
  if(submit) submit.onclick = () => {
    state.generatedCase = `HEQ-${Math.floor(10000 + Math.random()*89999)}`;
    state.screen = 'member-confirmation';
    render();
  };
}
function metric(title, value){ return `<div class="card"><small>${title}</small><div class="metric">${value}</div></div>`; }
function statusPill(status){
  let c = 's-new';
  if(status.includes('Progress') || status.includes('Assigned')) c='s-progress';
  if(status.includes('Waiting')) c='s-wait';
  if(status.includes('Risk')) c='s-risk';
  return `<span class="status-pill ${c}">${status}</span>`;
}
render();
