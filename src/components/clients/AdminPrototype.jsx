import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ERPPrototype.css';
import './AdminPrototype.css';

// --- Default chip libraries ---
const DEFAULT_TRIGGERS = ['Doorknob', 'Germs', 'Symmetry', 'Intrusive thought', 'Checking', 'Counting', 'Contamination', 'Harm OCD'];
const DEFAULT_BODY = ['Tight chest', 'Nausea', 'Sweaty palms', 'Racing heart', 'Dizzy', 'Tense shoulders'];
const DEFAULT_EMOTIONS = ['Anxious', 'Disgusted', 'Fearful', 'Guilty', 'Uncertain', 'Dread'];
const DEFAULT_BELIEFS = ['"Something bad will happen"', '"I need to be sure"', '"It\'s my fault"', '"I\'m contaminated"', '"Not just right"'];
const DEFAULT_COPING = ['Sat with it', 'Deep breaths', 'Delayed ritual', 'Talked it out', 'Exposure held', 'Grounding', 'Journaled'];

// --- Mock patient data ---
const INITIAL_PATIENTS = [
  {
    id: 1,
    name: 'Laura M.',
    initials: 'LM',
    email: 'laura.m@email.com',
    phone: '(555) 123-4567',
    status: 'active',
    invited: true,
    lastSession: '2 hours ago',
    sessionsThisWeek: 4,
    avgAnxietyTrend: 'down',
    sessions: [
      { date: 'Today, 2:15 PM', triggers: ['Doorknob', 'Contamination'], body: ['Tight chest', 'Nausea'], emotions: ['Anxious', 'Disgusted'], beliefs: ['"I\'m contaminated"'], coping: ['Sat with it', 'Deep breaths'], expected: 70, actual: 45, note: 'Touched the door handle at work' },
      { date: 'Yesterday, 9:30 AM', triggers: ['Germs'], body: ['Sweaty palms'], emotions: ['Anxious'], beliefs: ['"Something bad will happen"'], coping: ['Exposure held', 'Grounding'], expected: 80, actual: 55, note: '' },
      { date: 'Mar 5, 6:00 PM', triggers: ['Checking'], body: ['Racing heart'], emotions: ['Uncertain', 'Dread'], beliefs: ['"I need to be sure"'], coping: ['Delayed ritual'], expected: 60, actual: 40, note: 'Didn\'t go back to check the stove' },
      { date: 'Mar 4, 11:15 AM', triggers: ['Contamination', 'Germs'], body: ['Nausea', 'Dizzy'], emotions: ['Disgusted', 'Fearful'], beliefs: ['"I\'m contaminated"'], coping: ['Sat with it', 'Journaled'], expected: 85, actual: 60, note: 'Public restroom exposure' },
    ],
    chips: {
      triggers: { active: ['Doorknob', 'Germs', 'Contamination', 'Checking'], custom: ['Door handle at work', 'Public restroom'] },
      body: { active: [...DEFAULT_BODY], custom: [] },
      emotions: { active: [...DEFAULT_EMOTIONS], custom: [] },
      beliefs: { active: [...DEFAULT_BELIEFS], custom: [] },
      coping: { active: [...DEFAULT_COPING], custom: [] },
    },
  },
  {
    id: 2,
    name: 'Nina R.',
    initials: 'NR',
    email: 'nina.r@email.com',
    phone: '(555) 234-5678',
    status: 'active',
    invited: true,
    lastSession: '1 day ago',
    sessionsThisWeek: 2,
    avgAnxietyTrend: 'stable',
    sessions: [
      { date: 'Yesterday, 4:00 PM', triggers: ['Symmetry', 'Counting'], body: ['Tense shoulders'], emotions: ['Uncertain'], beliefs: ['"Not just right"'], coping: ['Sat with it'], expected: 50, actual: 45, note: '' },
      { date: 'Mar 5, 10:00 AM', triggers: ['Intrusive thought'], body: ['Racing heart', 'Tight chest'], emotions: ['Fearful', 'Guilty'], beliefs: ['"Something bad will happen"', '"It\'s my fault"'], coping: ['Deep breaths', 'Talked it out'], expected: 75, actual: 50, note: 'Driving intrusive thought' },
    ],
    chips: {
      triggers: { active: ['Symmetry', 'Counting', 'Intrusive thought'], custom: [] },
      body: { active: [...DEFAULT_BODY], custom: [] },
      emotions: { active: [...DEFAULT_EMOTIONS], custom: [] },
      beliefs: { active: [...DEFAULT_BELIEFS], custom: [] },
      coping: { active: [...DEFAULT_COPING], custom: [] },
    },
  },
  {
    id: 3,
    name: 'Janine T.',
    initials: 'JT',
    email: 'janine.t@email.com',
    phone: '(555) 345-6789',
    status: 'active',
    invited: true,
    lastSession: '3 days ago',
    sessionsThisWeek: 1,
    avgAnxietyTrend: 'up',
    sessions: [
      { date: 'Mar 4, 7:30 PM', triggers: ['Harm OCD'], body: ['Racing heart', 'Dizzy'], emotions: ['Fearful', 'Guilty'], beliefs: ['"Something bad will happen"', '"It\'s my fault"'], coping: ['Talked it out', 'Grounding'], expected: 90, actual: 75, note: 'Had a rough day' },
    ],
    chips: {
      triggers: { active: ['Harm OCD', 'Intrusive thought'], custom: ['Kitchen knives'] },
      body: { active: [...DEFAULT_BODY], custom: [] },
      emotions: { active: [...DEFAULT_EMOTIONS], custom: [] },
      beliefs: { active: [...DEFAULT_BELIEFS], custom: [] },
      coping: { active: [...DEFAULT_COPING], custom: [] },
    },
  },
];

// --- Views ---
const VIEW_LIST = 'list';
const VIEW_PATIENT = 'patient';
const VIEW_SESSION = 'session';
const VIEW_CONFIG = 'config';
const VIEW_ADD = 'add';
const VIEW_INVITE = 'invite';

// --- Small Components ---

function TrendBadge({ trend }) {
  const config = {
    down: { label: 'Improving', color: '#68b88a' },
    stable: { label: 'Stable', color: '#b8d4f0' },
    up: { label: 'Needs attention', color: '#e88a70' },
  };
  const { label, color } = config[trend] || config.stable;
  return (
    <span className="admin-trend-badge" style={{ background: `${color}22`, color }}>
      {label}
    </span>
  );
}

function AnxietyBar({ expected, actual }) {
  const diff = expected - actual;
  return (
    <div className="admin-anxiety-bar">
      <div className="admin-anxiety-bar-row">
        <span className="admin-anxiety-bar-label">Expected</span>
        <div className="admin-anxiety-bar-track">
          <div className="admin-anxiety-bar-fill blue" style={{ width: `${expected}%` }} />
        </div>
        <span className="admin-anxiety-bar-val">{expected}</span>
      </div>
      <div className="admin-anxiety-bar-row">
        <span className="admin-anxiety-bar-label">Actual</span>
        <div className="admin-anxiety-bar-track">
          <div className="admin-anxiety-bar-fill green" style={{ width: `${actual}%` }} />
        </div>
        <span className="admin-anxiety-bar-val">{actual}</span>
      </div>
      {diff > 0 && (
        <span className="admin-anxiety-diff">{diff} pts less than expected</span>
      )}
    </div>
  );
}

function MiniChart({ sessions }) {
  if (sessions.length < 2) return null;
  const values = sessions.map((s) => s.actual).reverse();
  const max = Math.max(...values, 100);
  const w = 120;
  const h = 40;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="admin-mini-chart">
      <polyline points={points} fill="none" stroke="#68b88a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TabBar({ active, onSelect }) {
  const tabs = [
    { id: 'sessions', label: 'Sessions' },
    { id: 'chips', label: 'ERP Options' },
    { id: 'profile', label: 'Profile' },
  ];
  return (
    <div className="admin-tab-bar">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`admin-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ConfigSection({ title, defaults, active: initialActive, custom: initialCustom }) {
  const [active, setActive] = useState([...initialActive]);
  const [custom, setCustom] = useState([...initialCustom]);
  const [adding, setAdding] = useState(false);
  const [newChip, setNewChip] = useState('');

  const toggle = (item) => {
    setActive((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const removeCustom = (item) => {
    setCustom((prev) => prev.filter((x) => x !== item));
    setActive((prev) => prev.filter((x) => x !== item));
  };

  const addCustom = () => {
    const val = newChip.trim();
    if (val && !custom.includes(val) && !defaults.includes(val)) {
      setCustom((prev) => [...prev, val]);
      setActive((prev) => [...prev, val]);
      setNewChip('');
      setAdding(false);
    }
  };

  return (
    <div className="admin-config-section">
      <div className="erp-divider">
        <div className="erp-divider-line" />
        <span className="erp-divider-text">{title}</span>
        <div className="erp-divider-line" />
      </div>
      <div className="erp-chips">
        {defaults.map((item) => (
          <button
            key={item}
            className={`erp-chip ${active.includes(item) ? 'selected' : ''}`}
            onClick={() => toggle(item)}
          >
            {item}
          </button>
        ))}
        {custom.map((item) => (
          <button
            key={item}
            className="erp-chip selected admin-custom-chip"
            onClick={() => removeCustom(item)}
            title="Tap to remove"
          >
            {item} &times;
          </button>
        ))}
        {!adding && (
          <button className="erp-chip add-chip" onClick={() => setAdding(true)}>+ Add</button>
        )}
      </div>
      {adding && (
        <div className="erp-add-input-wrapper">
          <input
            className="erp-add-input"
            placeholder={`Add custom ${title.toLowerCase()}...`}
            value={newChip}
            onChange={(e) => setNewChip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            autoFocus
          />
          <button className="erp-add-confirm" onClick={addCustom}>Add</button>
        </div>
      )}
    </div>
  );
}

// ======================
// Main Admin Prototype
// ======================
export default function AdminPrototype() {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [view, setView] = useState(VIEW_LIST);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [patientTab, setPatientTab] = useState('sessions');
  const [toast, setToast] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  // Add form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const openPatient = (patient) => {
    setSelectedPatientId(patient.id);
    setPatientTab('sessions');
    setView(VIEW_PATIENT);
  };

  const openSession = (session) => {
    setSelectedSession(session);
    setView(VIEW_SESSION);
  };

  const openAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setView(VIEW_ADD);
  };

  const openInvite = () => {
    setView(VIEW_INVITE);
  };

  const goBack = () => {
    if (view === VIEW_SESSION) setView(VIEW_PATIENT);
    else if (view === VIEW_CONFIG) setView(VIEW_PATIENT);
    else if (view === VIEW_INVITE) setView(VIEW_PATIENT);
    else { setView(VIEW_LIST); setSelectedPatientId(null); }
  };

  const getInitials = (name) => {
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const addPatient = () => {
    if (!formName.trim()) return;
    const newPatient = {
      id: Date.now(),
      name: formName.trim(),
      initials: getInitials(formName.trim()),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      status: 'active',
      invited: false,
      lastSession: 'Never',
      sessionsThisWeek: 0,
      avgAnxietyTrend: 'stable',
      sessions: [],
      chips: {
        triggers: { active: [...DEFAULT_TRIGGERS], custom: [] },
        body: { active: [...DEFAULT_BODY], custom: [] },
        emotions: { active: [...DEFAULT_EMOTIONS], custom: [] },
        beliefs: { active: [...DEFAULT_BELIEFS], custom: [] },
        coping: { active: [...DEFAULT_COPING], custom: [] },
      },
    };
    setPatients((prev) => [...prev, newPatient]);
    setSelectedPatientId(newPatient.id);
    setPatientTab('chips');
    setView(VIEW_PATIENT);
    showToast('Patient added — configure their ERP options below');
  };

  const archivePatient = () => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatientId ? { ...p, status: 'archived' } : p
      )
    );
    setSelectedPatientId(null);
    setView(VIEW_LIST);
    showToast('Patient archived');
  };

  const restorePatient = () => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatientId ? { ...p, status: 'active' } : p
      )
    );
    showToast('Patient restored');
  };

  const removePatient = () => {
    setPatients((prev) => prev.filter((p) => p.id !== selectedPatientId));
    setSelectedPatientId(null);
    setView(VIEW_LIST);
    showToast('Patient removed permanently');
  };

  const sendInvite = (method) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === selectedPatientId ? { ...p, invited: true } : p
      )
    );
    goBack();
    showToast(`Invite sent via ${method}`);
  };

  const renderContent = () => {
    switch (view) {

      // --- Patient List ---
      case VIEW_LIST: {
        const activePatients = patients.filter((p) => p.status === 'active');
        const archivedPatients = patients.filter((p) => p.status === 'archived');
        return (
          <div className="erp-card" key="patient-list">
            <div className="erp-card-header">
              <p className="erp-card-step">Therapist Dashboard</p>
              <h2 className="erp-card-title">Your Patients</h2>
              <p className="erp-card-subtitle">{activePatients.length} active{archivedPatients.length > 0 ? `, ${archivedPatients.length} archived` : ''}</p>
            </div>
            <div className="admin-patient-list">
              {activePatients.map((p) => (
                <button key={p.id} className="admin-patient-card" onClick={() => openPatient(p)}>
                  <div
                    className="admin-patient-avatar has-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatientId(p.id);
                      setPatientTab('profile');
                      setView(VIEW_PATIENT);
                    }}
                  >
                    {p.initials}
                    <span className="admin-avatar-edit-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      </svg>
                    </span>
                  </div>
                  <div className="admin-patient-info">
                    <span className="admin-patient-name">{p.name}</span>
                    <span className="admin-patient-meta">
                      {p.sessionsThisWeek} sessions this week
                    </span>
                    <span className="admin-patient-last">Last: {p.lastSession}</span>
                  </div>
                  <div className="admin-patient-right">
                    <TrendBadge trend={p.avgAnxietyTrend} />
                    <MiniChart sessions={p.sessions} />
                  </div>
                </button>
              ))}
            </div>
            <button className="admin-add-patient-btn" onClick={openAdd}>
              + Add Patient
            </button>
            {archivedPatients.length > 0 && (
              <>
                <button className="admin-archived-toggle" onClick={() => setShowArchived(!showArchived)}>
                  <span>Archived ({archivedPatients.length})</span>
                  <span className={`admin-archived-chevron ${showArchived ? 'open' : ''}`}>&#9662;</span>
                </button>
                {showArchived && (
                  <div className="admin-patient-list admin-archived-list">
                    {archivedPatients.map((p) => (
                      <button key={p.id} className="admin-patient-card archived" onClick={() => openPatient(p)}>
                        <div className="admin-patient-avatar archived">{p.initials}</div>
                        <div className="admin-patient-info">
                          <span className="admin-patient-name">{p.name}</span>
                          <span className="admin-patient-meta">Archived</span>
                          <span className="admin-patient-last">{p.sessions.length} sessions logged</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );
      }

      // --- Patient Detail (tabbed) ---
      case VIEW_PATIENT:
        return (
          <div className="erp-card" key="patient-detail">
            <div className="erp-nav">
              <button className="erp-back" onClick={goBack}>&larr; Patients</button>
              <span />
            </div>
            <div className="erp-card-header">
              <div className="admin-patient-header">
                <div className="admin-patient-avatar large">{selectedPatient.initials}</div>
                <div>
                  <h2 className="erp-card-title" style={{ fontSize: 22 }}>{selectedPatient.name}</h2>
                  <TrendBadge trend={selectedPatient.avgAnxietyTrend} />
                </div>
              </div>
            </div>
            <div className="admin-stats-row">
              <div className="admin-stat">
                <span className="admin-stat-num">{selectedPatient.sessions.length}</span>
                <span className="admin-stat-label">Total</span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-num">{selectedPatient.sessionsThisWeek}</span>
                <span className="admin-stat-label">This week</span>
              </div>
              <div className="admin-stat">
                <span className="admin-stat-num">
                  {selectedPatient.sessions.length > 0
                    ? Math.round(selectedPatient.sessions.reduce((a, s) => a + (s.expected - s.actual), 0) / selectedPatient.sessions.length)
                    : '—'}
                </span>
                <span className="admin-stat-label">Avg. gap</span>
              </div>
            </div>

            <TabBar active={patientTab} onSelect={setPatientTab} />

            {patientTab === 'sessions' && (
              <div className="admin-session-list">
                {selectedPatient.sessions.length === 0 && (
                  <p className="admin-empty-state">No sessions yet. Send an invite to get started.</p>
                )}
                {selectedPatient.sessions.map((s, i) => (
                  <button key={i} className="admin-session-card" onClick={() => openSession(s)}>
                    <div className="admin-session-top">
                      <span className="admin-session-date">{s.date}</span>
                      <span className="admin-session-triggers">{s.triggers.join(', ')}</span>
                    </div>
                    <AnxietyBar expected={s.expected} actual={s.actual} />
                  </button>
                ))}
              </div>
            )}

            {patientTab === 'chips' && (
              <div className="admin-chips-tab">
                <ConfigSection title="Triggers" defaults={DEFAULT_TRIGGERS} active={selectedPatient.chips.triggers.active} custom={selectedPatient.chips.triggers.custom} />
                <ConfigSection title="Body Sensations" defaults={DEFAULT_BODY} active={selectedPatient.chips.body.active} custom={selectedPatient.chips.body.custom} />
                <ConfigSection title="Emotions" defaults={DEFAULT_EMOTIONS} active={selectedPatient.chips.emotions.active} custom={selectedPatient.chips.emotions.custom} />
                <ConfigSection title="Beliefs" defaults={DEFAULT_BELIEFS} active={selectedPatient.chips.beliefs.active} custom={selectedPatient.chips.beliefs.custom} />
                <ConfigSection title="Coping Strategies" defaults={DEFAULT_COPING} active={selectedPatient.chips.coping.active} custom={selectedPatient.chips.coping.custom} />
                <button className="erp-next-btn" style={{ marginTop: 16 }} onClick={() => showToast('ERP options saved')}>
                  Save Changes
                </button>
              </div>
            )}

            {patientTab === 'profile' && (
              <ProfileTab
                patient={selectedPatient}
                onSave={(updates) => {
                  setPatients((prev) =>
                    prev.map((p) =>
                      p.id === selectedPatientId
                        ? { ...p, ...updates, initials: getInitials(updates.name || p.name) }
                        : p
                    )
                  );
                  showToast('Patient updated');
                }}
                onInvite={openInvite}
                onArchive={archivePatient}
                onRestore={restorePatient}
                onDelete={removePatient}
              />
            )}
          </div>
        );

      // --- Session Detail ---
      case VIEW_SESSION:
        return (
          <div className="erp-card" key="session-detail">
            <div className="erp-nav">
              <button className="erp-back" onClick={goBack}>&larr; {selectedPatient.name}</button>
              <span />
            </div>
            <div className="erp-card-header">
              <p className="erp-card-step">{selectedSession.date}</p>
              <h2 className="erp-card-title">Session Detail</h2>
            </div>
            <div className="erp-review-list">
              <div className="erp-review-section" style={{ cursor: 'default' }}>
                <span className="erp-review-label">Triggers</span>
                <span className="erp-review-items">{selectedSession.triggers.join(', ')}</span>
              </div>
              {selectedSession.body.length > 0 && (
                <div className="erp-review-section" style={{ cursor: 'default' }}>
                  <span className="erp-review-label">Body</span>
                  <span className="erp-review-items">{selectedSession.body.join(', ')}</span>
                </div>
              )}
              {selectedSession.emotions.length > 0 && (
                <div className="erp-review-section" style={{ cursor: 'default' }}>
                  <span className="erp-review-label">Emotions</span>
                  <span className="erp-review-items">{selectedSession.emotions.join(', ')}</span>
                </div>
              )}
              {selectedSession.beliefs.length > 0 && (
                <div className="erp-review-section" style={{ cursor: 'default' }}>
                  <span className="erp-review-label">Thoughts</span>
                  <span className="erp-review-items">{selectedSession.beliefs.join(', ')}</span>
                </div>
              )}
              {selectedSession.coping.length > 0 && (
                <div className="erp-review-section" style={{ cursor: 'default' }}>
                  <span className="erp-review-label">Coping</span>
                  <span className="erp-review-items">{selectedSession.coping.join(', ')}</span>
                </div>
              )}
              {selectedSession.note && (
                <div className="erp-review-section" style={{ cursor: 'default' }}>
                  <span className="erp-review-label">Note</span>
                  <span className="erp-review-items">{selectedSession.note}</span>
                </div>
              )}
              <div className="erp-review-section erp-review-anxiety" style={{ cursor: 'default' }}>
                <span className="erp-review-label">Anxiety</span>
                <span className="erp-review-anxiety-row">
                  <span className="erp-review-anxiety-stat">
                    <span className="erp-review-anxiety-num">{selectedSession.expected}</span>
                    <span className="erp-review-anxiety-sub">expected</span>
                  </span>
                  <span className="erp-review-anxiety-stat">
                    <span className="erp-review-anxiety-num">{selectedSession.actual}</span>
                    <span className="erp-review-anxiety-sub">actual</span>
                  </span>
                </span>
              </div>
              {selectedSession.expected - selectedSession.actual > 0 && (
                <p className="erp-review-insight">
                  {selectedSession.expected - selectedSession.actual} points less than expected
                </p>
              )}
            </div>
          </div>
        );

      // --- Add Patient ---
      case VIEW_ADD:
        return (
          <div className="erp-card" key="add-patient">
            <div className="erp-nav">
              <button className="erp-back" onClick={goBack}>&larr; Cancel</button>
              <span />
            </div>
            <div className="erp-card-header">
              <p className="erp-card-step">New Patient</p>
              <h2 className="erp-card-title">Add a patient</h2>
              <p className="erp-card-subtitle">You can customize their ERP options after adding</p>
            </div>
            <div className="admin-form">
              <label className="admin-form-label">Full name</label>
              <input className="admin-form-input" placeholder="e.g. Sarah K." value={formName} onChange={(e) => setFormName(e.target.value)} autoFocus />
              <label className="admin-form-label">Email</label>
              <input className="admin-form-input" placeholder="patient@email.com" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
              <label className="admin-form-label">Phone (optional)</label>
              <input className="admin-form-input" placeholder="(555) 000-0000" type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
            </div>
            <button className="erp-next-btn" onClick={addPatient} style={{ marginTop: 'auto' }}>
              Add Patient
            </button>
          </div>
        );

      // --- Send Invite ---
      case VIEW_INVITE:
        return (
          <div className="erp-card" key="invite">
            <div className="erp-nav">
              <button className="erp-back" onClick={goBack}>&larr; Cancel</button>
              <span />
            </div>
            <div className="erp-card-header">
              <p className="erp-card-step">Invite Patient</p>
              <h2 className="erp-card-title">Send app link</h2>
              <p className="erp-card-subtitle">
                {selectedPatient.name} will get a link to download the app and connect to your practice
              </p>
            </div>
            <div className="admin-invite-options">
              <button className="admin-invite-btn" onClick={() => sendInvite('email')}>
                <span className="admin-invite-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div className="admin-invite-text">
                  <span className="admin-invite-method">Send via Email</span>
                  <span className="admin-invite-detail">{selectedPatient.email || 'No email on file'}</span>
                </div>
              </button>
              <button className="admin-invite-btn" onClick={() => sendInvite('text')}>
                <span className="admin-invite-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div className="admin-invite-text">
                  <span className="admin-invite-method">Send via Text</span>
                  <span className="admin-invite-detail">{selectedPatient.phone || 'No phone on file'}</span>
                </div>
              </button>
              <button className="admin-invite-btn" onClick={() => { navigator.clipboard?.writeText('https://erp.app/invite/abc123'); showToast('Link copied!'); goBack(); }}>
                <span className="admin-invite-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </span>
                <div className="admin-invite-text">
                  <span className="admin-invite-method">Copy Link</span>
                  <span className="admin-invite-detail">Share manually</span>
                </div>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="erp-prototype-layout">
      <div className="erp-phone-frame">
        <div className="erp-phone-shell">
          <div className="admin-header-bar">
            <span className="admin-header-dot" />
            <span className="admin-header-label">ERP Tracker — Therapist</span>
            <span className="admin-header-dot" />
          </div>
          <div className="erp-card-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={view + (selectedPatientId || '') + (selectedSession?.date || '')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {toast && (
              <motion.div
                className="admin-toast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AdminNotesPanel view={view} patientTab={patientTab} />
    </div>
  );
}

function ProfileTab({ patient, onSave, onInvite, onArchive, onRestore, onDelete }) {
  const [name, setName] = useState(patient.name);
  const [email, setEmail] = useState(patient.email);
  const [phone, setPhone] = useState(patient.phone);
  const dirty = name !== patient.name || email !== patient.email || phone !== patient.phone;

  return (
    <div className="admin-profile-tab">
      <div className="admin-form">
        <label className="admin-form-label">Full name</label>
        <input className="admin-form-input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="admin-form-label">Email</label>
        <input className="admin-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="admin-form-label">Phone</label>
        <input className="admin-form-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {dirty && (
        <button className="erp-next-btn" style={{ marginBottom: 12 }} onClick={() => onSave({ name: name.trim(), email: email.trim(), phone: phone.trim() })}>
          Save Changes
        </button>
      )}

      <div className="erp-divider" style={{ marginTop: dirty ? 0 : 8 }}>
        <div className="erp-divider-line" />
        <span className="erp-divider-text">Access</span>
        <div className="erp-divider-line" />
      </div>

      <div className="admin-info-row">
        <span className="admin-info-label">App Access</span>
        <span className="admin-info-value">{patient.invited ? 'Invited' : 'Not yet invited'}</span>
      </div>

      <div className="admin-info-actions">
        <button className={patient.invited ? 'admin-action-btn' : 'erp-next-btn'} onClick={onInvite}>
          {patient.invited ? 'Resend Invite' : 'Send Invite Link'}
        </button>

        {patient.status === 'active' ? (
          <button className="admin-action-btn warning" onClick={onArchive}>
            Archive Patient
          </button>
        ) : (
          <>
            <button className="admin-action-btn restore" onClick={onRestore}>
              Restore Patient
            </button>
            <button className="admin-action-btn danger" onClick={onDelete}>
              Delete Permanently
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AdminNotesPanel({ view, patientTab }) {
  const notes = {
    [VIEW_LIST]: {
      title: 'Patient Dashboard',
      items: [
        'At-a-glance: trend badge, sparkline, sessions/week',
        'Tap patient card to see full history and manage their setup',
        '+ Add Patient at the bottom to onboard new patients',
        'Future: sort/filter by trend, last active, etc.',
      ],
    },
    [`${VIEW_PATIENT}-sessions`]: {
      title: 'Session History',
      items: [
        'Anxiety bars show expected vs actual at a glance',
        'Tap any session for full detail (read-only)',
        'Green gap = patient is learning OCD overestimates danger',
        'Empty state prompts therapist to send invite',
      ],
    },
    [`${VIEW_PATIENT}-chips`]: {
      title: 'ERP Options',
      items: [
        'Therapist pre-configures which options the patient sees in each step',
        'Toggle defaults on/off based on patient\'s OCD subtype',
        'Add custom options for patient-specific triggers, beliefs, etc.',
        'Custom items (with x) can be removed; defaults just toggle on/off',
        'Patient can still add their own via "Something else" in the app',
      ],
    },
    [`${VIEW_PATIENT}-profile`]: {
      title: 'Patient Profile',
      items: [
        'Edit name, email, phone inline — Save appears when changes detected',
        'Send or resend invite link to connect patient to your practice',
        'Archive patient to move them out of active list (preserves data)',
        'Archived patients can be restored or permanently deleted',
      ],
    },
    [VIEW_SESSION]: {
      title: 'Session Detail',
      items: [
        'Same review layout the patient sees — familiar to both sides',
        'Read-only view for therapist (no accidental edits)',
        'Therapist can reference specific sessions in conversation',
      ],
    },
    [VIEW_ADD]: {
      title: 'Add Patient',
      items: [
        'Minimal info to get started: name + email',
        'After adding, lands on ERP Options tab to configure',
        'Phone is optional (for text invites)',
        'Future: import from EHR / practice management system',
      ],
    },
    [VIEW_INVITE]: {
      title: 'Send Invite',
      items: [
        'Three ways to share: email, text, or copy link',
        'Link connects patient to therapist\'s practice',
        'Patient downloads app, enters code, sees their configured chips',
        'Future: track invite status (sent, opened, activated)',
      ],
    },
  };

  const key = view === VIEW_PATIENT ? `${VIEW_PATIENT}-${patientTab}` : view;
  const data = notes[key];
  if (!data) return null;

  return (
    <div className="erp-notes-panel">
      <h3 className="erp-notes-title">{data.title}</h3>
      <ul className="erp-notes-list">
        {data.items.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
