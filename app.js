/**
 * K. PARTHASARATHI — PORTFOLIO APPLICATION LOGIC
 * Dynamic Particle Engine, Interactive AI Labs, Terminal CLI, and Modal Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initTypingEffect();
  initNavigation();
  initProjectFilters();
  initProjectModals();
  initAILabs();
  initTerminal();
  initResumeModal();
  initClipboardAndContact();
});

/* ==========================================================================
   1. INTERACTIVE BACKGROUND CONSTELLATION CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  const mouse = { x: -1000, y: -1000, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  let particles = [];
  const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 14000), 75);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 0.8;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 229, 255,' : 'rgba(139, 92, 246,';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse gentle repulsion / pull
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor}${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const roles = [
    'Autonomous RL Agents (PPO)',
    'Clinical Diagnostic AI & Grad-CAM',
    'Scalable AWS Cloud Infrastructure',
    'Explainable ML Ensemble Pipelines',
    'Retrieval-Augmented Generation (RAG)',
    'Production FastAPI Microservices'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseEnd = 1600;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === current.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    links.forEach((l) => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Active section scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'modalIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT CASE STUDY MODALS
   ========================================================================== */
const PROJECT_DETAILS = {
  deepcare: {
    title: 'DeepCare — Cloud-Based Healthcare Platform with AI Chest X-ray Analysis',
    badge: 'Clinical Deep Learning + AWS Cloud',
    stack: 'Python, FastAPI, React, TypeScript, PostgreSQL, PyTorch, AWS, Terraform, Docker',
    summary:
      'A comprehensive clinical diagnostic pipeline providing separate portals for patients, physicians, and system administrators. Doctors upload patient chest radiographs, execute automated DenseNet-121 inference across 14 chest pathologies, inspect Grad-CAM explainability heatmaps, and generate cryptographically verifiable signed PDF medical reports.',
    architecture: [
      'Model Architecture: DenseNet-121 fine-tuned on NIH ChestX-ray14 dataset (112,120 frontal-view X-ray images).',
      'Explainability Layer: Grad-CAM generates gradient-weighted class activation heatmaps overlayed over lung lobes to explain diagnostic features to clinicians.',
      'Security & Auth: Zero-trust FastAPI microservice utilizing JWT role-based access control, Argon2 password hashing, and immutable HIPAA-compliant access audit logging.',
      'AWS Cloud Infrastructure: Automated with Terraform IAC, featuring EC2 Auto Scaling behind an Application Load Balancer, Multi-AZ RDS PostgreSQL, KMS-encrypted S3 buckets, CloudWatch alarms, and automated GitHub Actions CI/CD pipeline.'
    ],
    metrics: ['14 Chest Pathologies Detected', 'Sub-second Inference Latency', 'Multi-tenant Hospital Security']
  },
  aeroheal: {
    title: 'AeroHeal — Autonomous Server Remediation via Reinforcement Learning',
    badge: 'Reinforcement Learning + Cloud Systems',
    stack: 'Python, PyTorch, Stable-Baselines3, OpenAI Gym, PPO Algorithm, NumPy',
    summary:
      'Engineered an autonomous self-healing cloud server remediation agent using Proximal Policy Optimization (PPO). The agent monitors continuous 4-dimensional server telemetry (CPU load, memory consumption, disk I/O, network latency) and learns preemptive remediation policies before critical threshold crashes occur.',
    architecture: [
      'Environment Design: Custom OpenAI Gym simulation streaming stochastic system workloads and simulating traffic spikes.',
      'Reward Function: Formulated multi-objective reward engineering penalizing downtime, SLA breaches, and redundant aggressive reboots.',
      'Evaluation & Results: Stress tested over 300,000 environment steps, maintaining 99.9% uptime SLA without requiring manual threshold adjustments or brittle rule-based alerts.'
    ],
    metrics: ['300,000 Simulation Steps', '99.9% SLA Preserved', 'Proactive vs Reactive Intervention']
  },
  'rag-assistant': {
    title: 'RAG-Based Intelligent Document Assistant',
    badge: 'Generative AI & Semantic Retrieval',
    stack: 'Python, LangChain, OpenAI API, FAISS, Streamlit',
    summary:
      'A high-precision Retrieval-Augmented Generation (RAG) platform capable of answering complex inquiries over multi-gigabyte domain-specific PDF datasets with verifiable contextual citations.',
    architecture: [
      'Data Ingestion Pipeline: Recursive character chunking with token boundary preservation and metadata extraction.',
      'Vector Embedding & Storage: Integrated OpenAI text embeddings into high-speed FAISS vector index for nearest-neighbor semantic search.',
      'Accuracy: Achieved 95% contextual answer accuracy verified across technical research benchmarks.',
      'Frontend: Interactive Streamlit UI displaying confidence scores, chunk distances, and referenced document snippets.'
    ],
    metrics: ['95% Contextual Accuracy', 'Low-Latency FAISS Index', 'Verifiable Citations']
  },
  diabetanet: {
    title: 'DiabetaNet — Diabetes Prediction & Explainability System',
    badge: 'Ensemble ML + Clinical Interpretability',
    stack: 'Python, Scikit-learn, XGBoost, SHAP, SMOTE, Streamlit',
    summary:
      'Clinical machine learning decision support system built on a hybrid soft-voting ensemble combining Random Forest, XGBoost, and Support Vector Machines, providing patient-level SHAP explainability.',
    architecture: [
      'Data Engineering: Addressed extreme class imbalance using SMOTE (Synthetic Minority Over-sampling Technique) combined with robust Z-score normalization across 100,000 patient records.',
      'Ensemble Soft-Voting: Aggregated prediction probabilities of Random Forest, XGBoost, and SVM, attaining 97.43% test classification accuracy.',
      'Explainable AI (XAI): Granular SHAP value attribution visualizes positive/negative biomarker risk contributions.',
      'Application: Deployed as an interactive Streamlit clinical workstation offering patient lookups and personalized nutritional guidance.'
    ],
    metrics: ['97.43% Classification Accuracy', '100k Patient Dataset', 'Granular SHAP Bar Breakdown']
  },
  malpractice: {
    title: 'AI-Based Online Exam Malpractice Detection System',
    badge: 'Computer Vision & Real-time Streaming',
    stack: 'Python, FastAPI, OpenCV, NumPy, WebSockets',
    summary:
      'Computer-vision proctoring engine for remote online examination integrity, analyzing live webcam video streams to detect suspicious activity, multi-person presence, and prolonged gaze deviations.',
    architecture: [
      'Streaming Architecture: Built an asynchronous FastAPI backend receiving compressed camera frames via WebSocket pipelines.',
      'Vision Analytics: OpenCV facial landmark tracking and head-pose orientation calculation for instant anomaly classification.',
      'Incident Dispatch: Flags candidate infractions and logs timestamped screenshot evidence for automated proctor review.'
    ],
    metrics: ['Real-Time 30 FPS Processing', 'Automated Timestamped Evidence', 'Zero-Lag Video Ingestion']
  },
  'aws-chatbot': {
    title: 'Enterprise AI Chatbot Cloud Deployment on AWS',
    badge: 'Cloud Architecture & DevOps',
    stack: 'AWS EC2, Amazon S3, AWS IAM, Python, Linux, Nginx',
    summary:
      'Demonstrated production-grade deployment of an intelligent conversational AI agent hosted on AWS EC2, configured with strict security boundaries, scalable object storage, and automated monitoring.',
    architecture: [
      'Compute: Deployed daemonized application server managed by systemd and reverse-proxied via Nginx on Amazon EC2.',
      'Cloud Storage: Configured Amazon S3 buckets for conversation log persistence and document asset retrieval.',
      'Security & Access: Provisioned least-privilege IAM roles and security groups, isolating database and internal services from public ingress.'
    ],
    metrics: ['Production AWS Architecture', 'Least-Privilege IAM Policies', '99.9% Uptime Reliability']
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('project-backdrop');
  const closeBtn = document.getElementById('close-project-modal-btn');
  const closePmBtn = document.getElementById('close-pm-btn');
  const titleEl = document.getElementById('pm-title');
  const bodyEl = document.getElementById('pm-body');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  function openProject(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    titleEl.textContent = data.title;
    bodyEl.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="pill pill-accent">${data.badge}</span>
      </div>
      <p style="margin-bottom: 18px; color: #cbd5e1; font-size: 0.95rem;">${data.summary}</p>
      
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; color: #fff; margin-bottom: 8px;">Key Technical Highlights & Architecture:</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: #94a3b8; display: flex; flex-direction: column; gap: 8px;">
          ${data.architecture.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div style="background: rgba(0, 229, 255, 0.05); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 8px; padding: 14px; margin-bottom: 20px;">
        <strong style="color: #00e5ff; font-size: 0.85rem; display: block; margin-bottom: 6px;">Tech Stack:</strong>
        <span style="font-family: var(--font-mono); font-size: 0.82rem; color: #e2e8f0;">${data.stack}</span>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${data.metrics.map((m) => `<span class="pill pill-success">${m}</span>`).join('')}
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach((t) => {
    t.addEventListener('click', () => {
      const pId = t.getAttribute('data-project');
      openProject(pId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closePmBtn) closePmBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. INTERACTIVE AI LABS
   ========================================================================== */
function initAILabs() {
  // Tab Switching
  const tabs = document.querySelectorAll('.lab-tab');
  const contents = document.querySelectorAll('.lab-content');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      contents.forEach((c) => c.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(tab.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  // Lab 1: RAG Simulator
  const ragInput = document.getElementById('rag-input');
  const ragBtn = document.getElementById('rag-run-btn');
  const sampleChips = document.querySelectorAll('.sample-chip');
  const ragChunkBadge = document.querySelector('.chunk-badge');
  const ragChunkText = document.querySelector('.chunk-text');
  const ragResponseText = document.getElementById('rag-response-text');
  const ragSourceTag = document.querySelector('.source-tag');

  const RAG_KB = [
    {
      keywords: ['aeroheal', 'ppo', 'server', 'crash', 'telemetry', 'reinforcement'],
      chunk:
        '"AeroHeal deploys a continuous Proximal Policy Optimization (PPO) agent inside a custom OpenAI Gym environment. By continuously processing 4-dimensional system telemetry (CPU load, memory allocation, network latency, and disk I/O), the agent observes state transitions and selects preemptive balancing actions before resource exhaustion causes an SLA penalty or service crash."',
      source: 'Source: AeroHeal_Architecture_Doc.pdf',
      sim: '0.962',
      answer:
        'AeroHeal uses a PPO-based reinforcement learning policy trained on 300,000 continuous telemetry steps. Rather than waiting for hard thresholds to trigger alarms, the agent predicts trajectory failure states and proactively rebalances workloads across the server cluster, successfully preserving 99.9% uptime SLA constraints.'
    },
    {
      keywords: ['diabetanet', 'accuracy', 'ensemble', 'shap', 'blood sugar', 'patient'],
      chunk:
        '"DiabetaNet integrates Random Forest, XGBoost, and SVM using soft-voting probability aggregation. To mitigate class skew, SMOTE synthetic sampling was applied. SHAP explainability plots decompose each biomarker\'s marginal contribution to diabetic risk."',
      source: 'Source: DiabetaNet_Clinical_Evaluation.pdf',
      sim: '0.978',
      answer:
        'DiabetaNet achieves 97.43% classification accuracy over 100,000 patient records. This performance was realized through a soft-voting ensemble combining Random Forest, XGBoost, and SVM, combined with SMOTE data balancing and SHAP value explainability for medical transparency.'
    },
    {
      keywords: ['deepcare', 'aws', 'terraform', 'x-ray', 'healthcare', 'fastapi'],
      chunk:
        '"DeepCare\'s cloud infrastructure is codified with Terraform on AWS. It provisions a Multi-AZ VPC, EC2 Auto Scaling groups governed by Application Load Balancers, KMS-encrypted S3 buckets for DICOM/PNG X-rays, RDS PostgreSQL, and DenseNet-121 Grad-CAM containerized inference."',
      source: 'Source: DeepCare_Cloud_IAC.tf',
      sim: '0.954',
      answer:
        'In DeepCare, Parthasarathi utilized AWS EC2 Auto Scaling, ALB, Multi-AZ RDS PostgreSQL, KMS-encrypted S3, and CloudWatch monitoring—all provisioned using Terraform Infrastructure as Code with Docker containers and GitHub Actions CI/CD.'
    },
    {
      keywords: ['certifications', 'cert', 'aws', 'sap', 'salesforce', 'nptel'],
      chunk:
        '"Parthasarathi holds the AWS Certified Developer – Associate (April 2026, ID: 05dcbc6ce4b842f4ae1fc69ce2797767), SAP Certified Generative AI Developer (2026), SAP Back-End ABAP Cloud Developer, Salesforce Agentforce Specialist (2025), and IIT Kharagpur NPTEL ML Certification (2024)."',
      source: 'Source: Certifications_Registry.json',
      sim: '0.985',
      answer:
        'Parthasarathi holds 5 major industry credentials: AWS Certified Developer – Associate (Amazon Web Services), SAP Certified Generative AI Developer, SAP Certified ABAP Cloud Back-End Developer, Salesforce Agentforce Specialist, and NPTEL Machine Learning (IIT Kharagpur).'
    }
  ];

  function runRAG(query) {
    if (!query.trim()) return;
    const lower = query.toLowerCase();

    let bestMatch = RAG_KB[0];
    let maxMatches = -1;

    RAG_KB.forEach((item) => {
      let matches = 0;
      item.keywords.forEach((k) => {
        if (lower.includes(k)) matches++;
      });
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = item;
      }
    });

    // Animate search
    ragBtn.disabled = true;
    ragBtn.textContent = 'Retrieving...';
    ragResponseText.textContent = 'Searching vector index with cosine similarity...';

    setTimeout(() => {
      ragChunkBadge.innerHTML = `Vector Chunk #1 • Cosine Similarity: <strong>${bestMatch.sim}</strong>`;
      ragSourceTag.textContent = bestMatch.source;
      ragChunkText.textContent = bestMatch.chunk;
      ragResponseText.textContent = bestMatch.answer;
      ragBtn.disabled = false;
      ragBtn.textContent = 'Run Query';
      showToast('RAG Semantic Retrieval Complete');
    }, 400);
  }

  if (ragBtn && ragInput) {
    ragBtn.addEventListener('click', () => runRAG(ragInput.value));
    ragInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runRAG(ragInput.value);
    });
  }

  sampleChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      ragInput.value = q;
      runRAG(q);
    });
  });

  // Lab 2: DiabetaNet SHAP Simulator
  const inGlucose = document.getElementById('input-glucose');
  const inBmi = document.getElementById('input-bmi');
  const inAge = document.getElementById('input-age');
  const inHba1c = document.getElementById('input-hba1c');

  const valGlucose = document.getElementById('val-glucose');
  const valBmi = document.getElementById('val-bmi');
  const valAge = document.getElementById('val-age');
  const valHba1c = document.getElementById('val-hba1c');

  const predBadge = document.getElementById('shap-pred-badge');
  const barHba1c = document.getElementById('bar-hba1c');
  const barGlucose = document.getElementById('bar-glucose');
  const barBmi = document.getElementById('bar-bmi');
  const barAge = document.getElementById('bar-age');

  const shapHba1cVal = document.getElementById('shap-hba1c-val');
  const shapGlucoseVal = document.getElementById('shap-glucose-val');
  const shapBmiVal = document.getElementById('shap-bmi-val');
  const shapAgeVal = document.getElementById('shap-age-val');

  function updateSHAP() {
    if (!inGlucose || !inBmi || !inAge || !inHba1c) return;

    const g = parseFloat(inGlucose.value);
    const b = parseFloat(inBmi.value);
    const a = parseFloat(inAge.value);
    const h = parseFloat(inHba1c.value);

    valGlucose.textContent = g;
    valBmi.textContent = b.toFixed(1);
    valAge.textContent = a;
    valHba1c.textContent = h.toFixed(1);

    // Baseline calculation simulating trained soft-voting ensemble
    const score = (g - 100) * 0.4 + (b - 24) * 1.8 + (a - 30) * 0.35 + (h - 5.5) * 22;
    const probability = Math.min(Math.max(1 / (1 + Math.exp(-score * 0.045)), 0.02), 0.99);
    const pct = (probability * 100).toFixed(1);

    if (probability > 0.6) {
      predBadge.textContent = `High Risk (${pct}%)`;
      predBadge.style.color = '#fb7185';
      predBadge.style.background = 'rgba(244, 63, 94, 0.15)';
      predBadge.style.borderColor = 'rgba(244, 63, 94, 0.3)';
    } else if (probability > 0.35) {
      predBadge.textContent = `Moderate Risk (${pct}%)`;
      predBadge.style.color = '#fbbf24';
      predBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      predBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
    } else {
      predBadge.textContent = `Normal / Low Risk (${pct}%)`;
      predBadge.style.color = '#34d399';
      predBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      predBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    }

    // SHAP value calculations relative to healthy baselines
    const shapH = ((h - 5.7) * 0.15).toFixed(2);
    const shapG = ((g - 110) * 0.005).toFixed(2);
    const shapB = ((b - 25) * 0.02).toFixed(2);
    const shapA = ((a - 35) * 0.004).toFixed(2);

    updateShapBar(barHba1c, shapHba1cVal, shapH);
    updateShapBar(barGlucose, shapGlucoseVal, shapG);
    updateShapBar(barBmi, shapBmiVal, shapB);
    updateShapBar(barAge, shapAgeVal, shapA);
  }

  function updateShapBar(bar, valEl, val) {
    const num = parseFloat(val);
    valEl.textContent = (num >= 0 ? '+' : '') + val;
    const absPct = Math.min(Math.abs(num) * 120 + 10, 100);
    bar.style.width = `${absPct}%`;

    if (num >= 0) {
      bar.className = 'bar-fill bar-pos';
    } else {
      bar.className = 'bar-fill bar-neg';
    }
  }

  [inGlucose, inBmi, inAge, inHba1c].forEach((input) => {
    if (input) input.addEventListener('input', updateSHAP);
  });
  updateSHAP();

  // Lab 3: AeroHeal PPO Telemetry Simulator
  const surgeBtn = document.getElementById('surge-btn');
  const resetRlBtn = document.getElementById('reset-rl-btn');
  const cpuVal = document.getElementById('cpu-val');
  const memVal = document.getElementById('mem-val');
  const latVal = document.getElementById('lat-val');
  const rlState = document.getElementById('rl-state');
  const cpuFill = document.getElementById('cpu-fill');
  const memFill = document.getElementById('mem-fill');
  const latFill = document.getElementById('lat-fill');
  const logBox = document.getElementById('agent-logs');

  let surgeInterval = null;

  function appendLog(text) {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  }

  if (surgeBtn) {
    surgeBtn.addEventListener('click', () => {
      surgeBtn.disabled = true;
      appendLog('[ALARM] Traffic surge incoming! Injecting +500% concurrent synthetic requests...');

      cpuVal.textContent = '94%';
      cpuFill.style.width = '94%';
      cpuFill.style.background = '#ef4444';

      memVal.textContent = '89%';
      memFill.style.width = '89%';
      memFill.style.background = '#ef4444';

      latVal.textContent = '380ms';
      latFill.style.width = '85%';
      latFill.style.background = '#ef4444';

      rlState.textContent = 'CRITICAL SPIKE';
      rlState.className = 'meter-val';
      rlState.style.color = '#ef4444';

      appendLog('[PPO-AGENT] Observation vector breached baseline. Reward gradient decreasing.');
      appendLog('[PPO-POLICY] Action selected: Autonomous Scale-Out & Route Shedding (Action ID: #4)');

      setTimeout(() => {
        appendLog('[PPO-AGENT] Worker spin-up confirmed. Traffic balanced across healthy nodes.');
        cpuVal.textContent = '52%';
        cpuFill.style.width = '52%';
        cpuFill.style.background = '#00e5ff';

        memVal.textContent = '61%';
        memFill.style.width = '61%';
        memFill.style.background = '#00e5ff';

        latVal.textContent = '54ms';
        latFill.style.width = '28%';
        latFill.style.background = '#00e5ff';

        rlState.textContent = 'HEALED / OPTIMAL';
        rlState.style.color = '#10b981';
        surgeBtn.disabled = false;
        showToast('AeroHeal PPO Agent Restored 99.9% SLA');
      }, 2200);
    });
  }

  if (resetRlBtn) {
    resetRlBtn.addEventListener('click', () => {
      cpuVal.textContent = '42%';
      cpuFill.style.width = '42%';
      cpuFill.style.background = '#00e5ff';

      memVal.textContent = '58%';
      memFill.style.width = '58%';
      memFill.style.background = '#00e5ff';

      latVal.textContent = '48ms';
      latFill.style.width = '24%';
      latFill.style.background = '#00e5ff';

      rlState.textContent = 'STABLE';
      rlState.style.color = '#10b981';
      appendLog('[RESET] Environment reset to steady-state telemetry.');
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE TERMINAL
   ========================================================================== */
function initTerminal() {
  const termInput = document.getElementById('terminal-input');
  const termHistory = document.getElementById('terminal-history');
  const clearBtn = document.getElementById('clear-term-btn');
  const chips = document.querySelectorAll('.term-chip');

  const historyBuffer = [];
  let historyIdx = -1;

  const COMMANDS = {
    help: `Available commands:
  • help           : Show this help manual
  • whoami         : Information about Parthasarathi
  • skills         : List technical proficiencies
  • projects       : List key engineering projects
  • certs          : Display industry certifications
  • education      : Academic credentials & GPA
  • research       : IEEE Paper & Conference highlights
  • contact        : Direct phone, email, and social handles
  • cat resume.txt : Display quick text resume
  • clear          : Clear terminal screen`,

    whoami: `K. Parthasarathi
-----------------------------------------------------------
Undergraduate in Computer Science & Engineering (AI & ML)
Institution : SRM Institute of Science & Technology
CGPA        : 8.65 / 10 | Expected Graduation: 2027
Role Focus  : Machine Learning Systems, RL, AWS Cloud DevOps`,

    skills: `Technical Skills Matrix:
-----------------------------------------------------------
• Languages   : Python, C, C++, TypeScript, JavaScript
• AI / ML     : Reinforcement Learning (PPO), Scikit-learn, XGBoost, SHAP, FAISS, PyTorch
• Cloud & Ops : AWS (EC2, S3, IAM, ALB, VPC), Docker, Terraform, GitHub Actions
• Web & DB    : FastAPI, React, PostgreSQL, MySQL, HTML5, CSS3, Streamlit`,

    projects: `Key Projects:
-----------------------------------------------------------
1. DeepCare     : Cloud Healthcare Platform with DenseNet-121 Grad-CAM & AWS IAC
2. AeroHeal     : Autonomous Server Remediation via PPO Reinforcement Learning
3. RAG-Assistant: Retrieval-Augmented Generation with FAISS & LangChain (95% Acc)
4. DiabetaNet   : 97.43% Soft-Voting ML Ensemble with SHAP Explainability
5. ExamProctor  : FastAPI + OpenCV Real-time Malpractice Detection
6. AI-Chatbot   : Scalable AWS EC2 + S3 Deployment`,

    certs: `Industry Certifications:
-----------------------------------------------------------
• AWS Certified Developer – Associate (April 2026 | ID: 05dcbc6ce4b842f4ae1fc69ce2797767)
• SAP Certified – SAP Generative AI Developer (2026)
• SAP Certified – Back-End Developer, ABAP Cloud (April 2026)
• Salesforce Agentforce Specialist – Global Certification (2025)
• NPTEL Machine Learning – IIT Kharagpur (2024 | ID: NPTEL23CS74S43880055)`,

    education: `Academic Background:
-----------------------------------------------------------
• B.Tech CSE (AI & ML) : SRMIST, Kattankulathur (2023–2027) | CGPA: 8.65
• Grade XII (TS BIE)   : Page Junior College, Kompally (2022–2023) | 97.7%
• Grade X (TS SSC)     : Trinity Model Secondary School (2020–2021) | 100.0%`,

    research: `Research Publication:
-----------------------------------------------------------
Paper Title : 'Intelligent Blood Sugar Prediction Using Ensemble Machine Learning Approaches'
Conference  : 4th IEEE International Conference on Ambient Intelligence in Health Care (ICAIHC-2026)
Venue       : National Institute of Technology (NIT), Raipur
Presented   : September 2026`,

    contact: `Contact Channels:
-----------------------------------------------------------
• Email    : k7sarathi@gmail.com
• Phone    : +91 73965 82230
• LinkedIn : https://linkedin.com/in/parthasarathi-k-srm
• GitHub   : https://github.com/Parthu555
• Vercel   : https://vercel.com/k7sarathi-4798s-projects`,

    'cat resume.txt': `===========================================================
K. PARTHASARATHI | B.Tech CSE (AI & ML) — SRMIST
Phone: +91 73965 82230 | Email: k7sarathi@gmail.com
===========================================================
SUMMARY:
Computer Science student specialising in AI & ML with strong foundations in Data Structures,
Algorithms, Reinforcement Learning, and AWS Cloud Computing.

CREDENTIALS:
- AWS Certified Developer – Associate
- SAP Certified GenAI Developer
- 8.65 CGPA @ SRMIST | NIT Raipur IEEE Paper Author
===========================================================`
  };

  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    historyBuffer.push(raw);
    historyIdx = historyBuffer.length;

    const entry = document.createElement('div');
    entry.className = 'term-history-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-history-cmd';
    cmdLine.innerHTML = `<span class="prompt-user">parthu@portfolio</span>:<span class="prompt-dir">~</span>$ ${escapeHtml(raw)}`;
    entry.appendChild(cmdLine);

    const outLine = document.createElement('div');
    outLine.className = 'term-history-output';

    if (cmd === 'clear') {
      termHistory.innerHTML = '';
      termInput.value = '';
      return;
    } else if (COMMANDS[cmd]) {
      outLine.textContent = COMMANDS[cmd];
    } else {
      outLine.textContent = `command not found: "${cmd}". Type "help" to see valid commands.`;
    }

    entry.appendChild(outLine);
    termHistory.appendChild(entry);
    termInput.value = '';

    const screen = document.getElementById('terminal-screen');
    if (screen) screen.scrollTop = screen.scrollHeight;
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(termInput.value);
      } else if (e.key === 'ArrowUp') {
        if (historyIdx > 0) {
          historyIdx--;
          termInput.value = historyBuffer[historyIdx] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < historyBuffer.length - 1) {
          historyIdx++;
          termInput.value = historyBuffer[historyIdx] || '';
        } else {
          historyIdx = historyBuffer.length;
          termInput.value = '';
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      termHistory.innerHTML = '';
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const c = chip.getAttribute('data-cmd');
      executeCommand(c);
    });
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ==========================================================================
   8. RESUME MODAL & PRINTING
   ========================================================================== */
function initResumeModal() {
  const resumeBtn = document.getElementById('resume-btn');
  const modal = document.getElementById('resume-modal');
  const backdrop = document.getElementById('resume-backdrop');
  const closeBtn = document.getElementById('close-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  function openResume() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (resumeBtn) resumeBtn.addEventListener('click', openResume);
  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  if (backdrop) backdrop.addEventListener('click', closeResume);

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   9. CLIPBOARD & CONTACT FORM
   ========================================================================== */
function initClipboardAndContact() {
  // Generic copy buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = btn.getAttribute('data-clipboard');
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`Copied to clipboard: ${val}`);
        });
      }
    });
  });

  const heroEmailBtn = document.getElementById('copy-email-hero');
  if (heroEmailBtn) {
    heroEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('k7sarathi@gmail.com').then(() => {
        showToast('Email copied: k7sarathi@gmail.com');
      });
    });
  }

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting...</span>';
      feedback.textContent = '';

      setTimeout(() => {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `✓ Thank you, <strong>${escapeHtml(name)}</strong>! Your message has been prepared. You can also reach out directly via <a href="mailto:k7sarathi@gmail.com" style="color:#00e5ff; text-decoration:underline;">k7sarathi@gmail.com</a>.`;
        showToast('Message sent successfully!');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Send Message</span>
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        `;
      }, 700);
    });
  }
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:#00e5ff;">⚡</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3200);
}
