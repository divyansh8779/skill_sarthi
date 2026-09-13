/* script.js
   Vanilla JS interactions for Skill Sathi demo.
   - Smooth scroll, mobile nav, theme toggle
   - Progress ring animation
   - Reveal on scroll (IntersectionObserver)
   - Career card expansion, toasts
   - Explore modal search & filters
   - Assessment multi-step modal
   - Radar chart (Chart.js) animate on reveal
   - Roadmap task completion and progress update
   - Daily challenge timer with pause/reset
   - AI chat mock responses with typing animation
   - Keyboard accessibility and Escape to close modals
*/

// ---------- Utilities ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const toastContainer = $('#toastContainer');

function showToast(text, ms = 3000) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  toastContainer.appendChild(t);
  setTimeout(() => t.style.opacity = '1', 50);
  setTimeout(() => t.remove(), ms);
}

// Smooth scroll for nav links
$$('.nav-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Mobile menu
const mobileMenuBtn = $('#mobileMenuBtn');
const mobileNav = $('#mobileNav');
const closeMobile = $('#closeMobile');
mobileMenuBtn?.addEventListener('click', ()=> mobileNav.style.display = 'flex');
closeMobile?.addEventListener('click', ()=> mobileNav.style.display = 'none');
$('#mobileExplore')?.addEventListener('click', ()=> { mobileNav.style.display='none'; openExploreModal(); });
$('#mobileAssessment')?.addEventListener('click', ()=> { mobileNav.style.display='none'; openAssessmentModal(); });

// Theme toggle
const themeToggle = $('#themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('theme-dark');
  const icon = themeToggle.querySelector('i');
  if (document.body.classList.contains('theme-dark')) {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
});

// Set year
$('#year').textContent = new Date().getFullYear();

// ---------- Progress ring animation ----------
const ring = document.querySelector('.ring');
const ringText = document.querySelector('.ring-text');
function animateRing(percent = 72, duration = 1200) {
  const circle = ring;
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  const offset = circumference - (percent / 100) * circumference;
  // animate
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const current = circumference - progress * (circumference - offset);
    circle.style.strokeDashoffset = current;
    ringText.textContent = `${Math.round(progress * percent)}%`;
    if (progress < 1) requestAnimationFrame(step);
    else ringText.textContent = `${percent}%`;
  }
  requestAnimationFrame(step);
}

// ---------- IntersectionObserver reveal & radar chart trigger ----------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // special triggers
      if (entry.target.id === 'dashboard') animateRing(72);
      if (entry.target.querySelector('#radarChart')) {
        if (!window.radarInitialized) {
          initRadarChart();
          window.radarInitialized = true;
        }
      }
    }
  });
}, {threshold: 0.18});

$$('.reveal').forEach(el => observer.observe(el));

// ---------- Career card expansion & actions ----------
$$('.career-card').forEach(card => {
  const expandBtn = card.querySelector('.expand');
  const details = card.querySelector('.card-details');
  expandBtn.addEventListener('click', () => {
    const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
    expandBtn.setAttribute('aria-expanded', String(!expanded));
    if (expanded) details.hidden = true;
    else details.hidden = false;
  });

  // action buttons show toast
  card.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      showToast(`${action.replace('-', ' ')} clicked`);
    });
  });
});

// ---------- Explore Careers Modal ----------
const exploreModal = $('#exploreModal');
const openExplore = $('#openExplore');
const closeExploreBtn = $('#closeExplore');
const careerSearch = $('#careerSearch');
const exploreList = $('#exploreList');

const careersMock = [
  {title:'Full-Stack Developer', cat:'technology', score:92},
  {title:'UI/UX Designer', cat:'design', score:74},
  {title:'Product Manager', cat:'business', score:68},
  {title:'Data Scientist', cat:'data', score:86},
  {title:'Frontend Developer', cat:'technology', score:88},
  {title:'Graphic Designer', cat:'design', score:64},
];

function renderExplore(list = careersMock) {
  exploreList.innerHTML = '';
  list.forEach(c => {
    const item = document.createElement('div');
    item.className = 'explore-item';
    item.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${c.title}</strong><div style="color:var(--muted);font-size:13px">${c.cat}</div></div>
      <div style="text-align:right"><div style="font-weight:800">${c.score}%</div><div style="color:var(--muted);font-size:12px">match</div></div>
    </div>`;
    exploreList.appendChild(item);
  });
}

openExplore?.addEventListener('click', (e)=>{ e.preventDefault(); openExploreModal(); });
function openExploreModal(){ exploreModal.setAttribute('aria-hidden','false'); renderExplore(); $('#careerSearch').focus(); }
closeExploreBtn?.addEventListener('click', ()=> exploreModal.setAttribute('aria-hidden','true'));

// filters
$$('.filter').forEach(f => {
  f.addEventListener('click', () => {
    $$('.filter').forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.cat;
    if (cat === 'all') renderExplore();
    else renderExplore(careersMock.filter(c=>c.cat===cat));
  });
});

// search
careerSearch?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  renderExplore(careersMock.filter(c => c.title.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)));
});

// ---------- Assessment Modal (multi-step) ----------
const assessmentModal = $('#assessmentModal');
const openAssessment = $('#openAssessment');
const closeAssessment = $('#closeAssessment');
const stepContainer = $('#stepContainer');
const prevStepBtn = $('#prevStep');
const nextStepBtn = $('#nextStep');

const questions = [
  {q:'How comfortable are you with programming?', options:['Not at all','Beginner','Comfortable','Advanced']},
  {q:'How often do you build projects?', options:['Never','Sometimes','Monthly','Weekly']},
  {q:'How strong is your communication?', options:['Weak','Average','Good','Excellent']},
  {q:'How interested are you in artificial intelligence?', options:['Not interested','Curious','Interested','Very interested']},
  {q:'How consistently do you learn?', options:['Rarely','Sometimes','Often','Daily']},
];

let currentStep = 0;
const answers = new Array(questions.length).fill(null);

function renderStep(i) {
  stepContainer.innerHTML = '';
  const step = questions[i];
  const wrapper = document.createElement('div');
  wrapper.className = 'assessment-step';
  wrapper.innerHTML = `<h4>Question ${i+1} of ${questions.length}</h4><p style="font-weight:700">${step.q}</p>`;
  const opts = document.createElement('div');
  opts.style.display='flex';opts.style.flexDirection='column';opts.style.gap='8px';opts.style.marginTop='12px';
  step.options.forEach((o, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.type = 'button';
    btn.textContent = o;
    btn.addEventListener('click', () => {
      answers[i] = o;
      // visual selection
      opts.querySelectorAll('button').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      nextStepBtn.disabled = false;
    });
    if (answers[i] === o) btn.classList.add('selected');
    opts.appendChild(btn);
  });
  wrapper.appendChild(opts);
  stepContainer.appendChild(wrapper);
  prevStepBtn.disabled = i === 0;
  nextStepBtn.textContent = i === questions.length - 1 ? 'Calculate My Result' : 'Next';
  nextStepBtn.disabled = answers[i] === null;
}

openAssessment?.addEventListener('click', (e)=>{ e.preventDefault(); openAssessmentModal(); });
function openAssessmentModal(){ assessmentModal.setAttribute('aria-hidden','false'); currentStep=0; renderStep(0); }
closeAssessment?.addEventListener('click', ()=> assessmentModal.setAttribute('aria-hidden','true'));

prevStepBtn?.addEventListener('click', () => {
  if (currentStep > 0) { currentStep--; renderStep(currentStep); }
});
nextStepBtn?.addEventListener('click', () => {
  if (currentStep < questions.length - 1) {
    currentStep++; renderStep(currentStep);
  } else {
    // calculate mock result
    const result = calculateAssessment();
    stepContainer.innerHTML = `<div style="padding:12px"><h4>Your recommended direction</h4><div style="font-weight:800;font-size:18px;margin-top:8px">${result}</div><div style="margin-top:12px"><button class="btn primary" id="viewRoadmapBtn">View My Roadmap</button></div></div>`;
    nextStepBtn.disabled = true;
    $('#viewRoadmapBtn').addEventListener('click', ()=> { assessmentModal.setAttribute('aria-hidden','true'); document.querySelector('#roadmap').scrollIntoView({behavior:'smooth'}); });
  }
});

function calculateAssessment(){
  // simple heuristic: count positive answers
  const score = answers.reduce((acc, a) => acc + (a ? 1 : 0), 0);
  if (score >= 4) return 'Full-Stack Development';
  if (score >= 2) return 'Data Analyst';
  return 'Explore foundational skills';
}

// ---------- Radar Chart (Chart.js) ----------
let radarChart;
function initRadarChart(){
  const ctx = document.getElementById('radarChart').getContext('2d');
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Technical Skills','Communication','Problem Solving','Creativity','Leadership','Consistency'],
      datasets: [{
        label: 'Skill profile',
        data: [78,62,81,68,54,73],
        backgroundColor: 'rgba(34,211,238,0.12)',
        borderColor: 'rgba(34,211,238,0.9)',
        pointBackgroundColor: '#A3E635',
        pointBorderColor: '#042'
      }]
    },
    options: {
      responsive:true,
      maintainAspectRatio:false,
      scales: {
        r: {
          beginAtZero:true,
          max:100,
          grid: {color:'rgba(255,255,255,0.03)'},
          angleLines: {color:'rgba(255,255,255,0.02)'},
          ticks: {display:false}
        }
      },
      plugins: {legend:{display:false}},
      animation: {duration:900}
    }
  });
}

// ---------- Roadmap task completion ----------
const roadmapFill = $('#roadmapFill');
const roadmapPercent = $('#roadmapPercent');
const markBtns = $$('.mark-complete');

function updateRoadmapProgress(){
  const total = $$('.timeline-step').length;
  const completed = $$('.timeline-step.completed').length;
  const percent = Math.round((completed / total) * 100);
  roadmapFill.style.width = percent + '%';
  roadmapPercent.textContent = percent + '%';
}

markBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const week = btn.dataset.week;
    const step = document.querySelector(`.timeline-step[data-week="${week}"]`);
    step.classList.remove('upcoming','active');
    step.classList.add('completed');
    step.querySelector('.step-marker').textContent = '✓';
    btn.textContent = 'Completed';
    btn.disabled = true;
    updateRoadmapProgress();
    showToast(`Week ${week} marked complete`);
  });
});

// initialize progress
updateRoadmapProgress();

// ---------- Daily challenge timer ----------
let challengeTimerInterval = null;
let challengeRemaining = 25 * 60; // seconds
const challengeTimerEl = $('#challengeTimer');
const challengeRun = $('#challengeRun');
const startChallengeBtn = $('#startChallenge');
const pauseBtn = $('#pauseTimer');
const resetBtn = $('#resetTimer');
const skipBtn = $('#skipChallenge');

function formatTime(s){ const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
function updateTimerDisplay(){ challengeTimerEl.textContent = formatTime(challengeRemaining); }

function startTimer(){
  if (challengeTimerInterval) return;
  challengeTimerInterval = setInterval(() => {
    if (challengeRemaining <= 0) {
      clearInterval(challengeTimerInterval);
      challengeTimerInterval = null;
      showToast('Challenge complete! +50 XP');
      challengeRun.hidden = true;
      return;
    }
    challengeRemaining--;
    updateTimerDisplay();
  }, 1000);
}

startChallengeBtn.addEventListener('click', () => {
  challengeRun.hidden = false;
  startTimer();
  showToast('Challenge started');
});
pauseBtn.addEventListener('click', () => {
  if (challengeTimerInterval) { clearInterval(challengeTimerInterval); challengeTimerInterval = null; pauseBtn.textContent = 'Resume'; }
  else { startTimer(); pauseBtn.textContent = 'Pause'; }
});
resetBtn.addEventListener('click', () => {
  clearInterval(challengeTimerInterval); challengeTimerInterval = null; challengeRemaining = 25*60; updateTimerDisplay(); pauseBtn.textContent = 'Pause'; showToast('Timer reset');
});
skipBtn.addEventListener('click', () => { showToast('Skipped for today'); });

// ---------- AI Chat (mock) ----------
const openChatBtn = $('#openChat');
const chatPanel = $('#chatPanel');
const closeChat = $('#closeChat');
const chatBody = $('#chatBody');
const chatForm = $('#chatForm');
const chatInput = $('#chatInput');

openChatBtn.addEventListener('click', () => { chatPanel.setAttribute('aria-hidden','false'); chatInput.focus(); });
closeChat.addEventListener('click', () => chatPanel.setAttribute('aria-hidden','true'));

function appendMessage(text, who='bot') {
  const el = document.createElement('div');
  el.className = who === 'bot' ? 'bot-message' : 'user-message';
  el.textContent = text;
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function typeMessage(text, cb) {
  const el = document.createElement('div');
  el.className = 'bot-message';
  chatBody.appendChild(el);
  chatBody.scrollTop = chatBody.scrollHeight;
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = text.slice(0, i++);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (i > text.length) { clearInterval(interval); if (cb) cb(); }
  }, 18);
}

function mockResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('resume')) {
    return "Focus on projects with measurable outcomes: add 2-3 projects, list technologies, and quantify impact (e.g., 'reduced load time by 30%').";
  }
  if (p.includes('learn next') || p.includes('what should i learn')) {
    return "Start with React, then REST APIs and Git. Build a small portfolio project combining these skills.";
  }
  if (p.includes('career suits')) {
    return "Based on your profile, Full-Stack Development and Data Analyst are strong matches. Try a small React + API project to decide.";
  }
  return "Great question — practice building projects, track progress, and focus on one stack for 3 months. Want a 30-day plan?";
}

// quick prompt buttons
$$('.quick').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.dataset.prompt;
    appendMessage(p, 'user');
    typeMessage('...', () => {
      const r = mockResponse(p);
      typeMessage(r);
    });
  });
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  chatInput.value = '';
  // show typing
  typeMessage('...', () => {
    const r = mockResponse(text);
    typeMessage(r);
  });
});

// ---------- Toast on certain buttons ----------
$('#continueRoadmap').addEventListener('click', ()=> { showToast('Continuing your roadmap'); document.querySelector('#roadmap').scrollIntoView({behavior:'smooth'}); });
$('#takeAssessment').addEventListener('click', ()=> openAssessmentModal());
$('#startRecommended').addEventListener('click', ()=> { showToast('Starting recommended skill'); });

// ---------- Keyboard accessibility & Escape to close modals ----------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // close modals and chat
    if (exploreModal.getAttribute('aria-hidden') === 'false') exploreModal.setAttribute('aria-hidden','true');
    if (assessmentModal.getAttribute('aria-hidden') === 'false') assessmentModal.setAttribute('aria-hidden','true');
    if (chatPanel.getAttribute('aria-hidden') === 'false') chatPanel.setAttribute('aria-hidden','true');
    if (mobileNav.style.display === 'flex') mobileNav.style.display = 'none';
  }
});

// Close modals when clicking outside content
document.querySelectorAll('.modal').forEach(mod => {
  mod.addEventListener('click', (e) => {
    if (e.target === mod) mod.setAttribute('aria-hidden','true');
  });
});

// Active nav link based on scroll
const navLinks = $$('.nav-link');
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 120;
  sections.forEach((sec, idx) => {
    if (!sec) return;
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(n => n.classList.remove('active'));
      navLinks[idx].classList.add('active');
    }
  });
});

// Initialize explore list
renderExplore();

// Initialize ring text and radar placeholder
updateTimerDisplay();
