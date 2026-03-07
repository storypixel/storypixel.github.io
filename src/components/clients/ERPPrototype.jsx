import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SiriWave from 'siriwave';
import './ERPPrototype.css';

// --- Data ---
const TRIGGERS = ['Doorknob', 'Germs', 'Symmetry', 'Intrusive thought', 'Checking', 'Counting', 'Contamination', 'Harm OCD'];
const ALARMS_BODY = ['Tight chest', 'Nausea', 'Sweaty palms', 'Racing heart', 'Dizzy', 'Tense shoulders'];
const ALARMS_EMOTION = ['Anxious', 'Disgusted', 'Fearful', 'Guilty', 'Uncertain', 'Dread'];
const BELIEFS = ['"Something bad will happen"', '"I need to be sure"', '"It\'s my fault"', '"I\'m contaminated"', '"Not just right"'];
const COPING = ['Sat with it', 'Deep breaths', 'Delayed ritual', 'Talked it out', 'Exposure held', 'Grounding', 'Journaled'];

// --- Design notes per card ---
const CARD_NOTES = [
  {
    title: 'Date Selection',
    notes: [
      'One tap for the common case — "Today" auto-advances to triggers',
      'Recent days shown by weekday name for quick retroactive logging',
      '"Pick a date" opens native calendar for anything older',
      'Not numbered as a step — it\'s context, not therapy',
    ],
  },
  {
    title: 'Trigger Selection',
    notes: [
      '"Something else" opens a free-text field so users aren\'t limited to presets',
      'Chip list grows over time as user adds custom triggers — becomes personalized',
    ],
  },
  {
    title: 'Body & Emotions',
    notes: [
      '"Something else" on both sections lets users describe sensations/emotions not in the preset list',
      'Two distinct sections (body vs emotion) — Kaley\'s sheet tracks these separately',
      'No skip button here — noticing what you feel IS the therapy',
    ],
  },
  {
    title: 'Thoughts / Beliefs',
    notes: [
      'Voice input uses Apple SpeechRecognizer (on-device, no network required, iOS 17+)',
      'Skippable — not every ERP session has a clear belief attached',
      'Beliefs are in quotes to reinforce "this is OCD talking, not me"',
    ],
  },
  {
    title: 'Coping Strategies',
    notes: [
      'Voice input: on-device Apple SpeechRecognizer — no data leaves the phone',
      'Skippable — sometimes you just white-knuckle it',
      'Quick note field for anything that doesn\'t fit a chip',
    ],
  },
  {
    title: 'Anxiety Rating',
    notes: [
      'This is the killer feature — expected vs actual comparison',
      'No competitor does this. Kaley already tracks it in her Google Sheet',
      'Over time, seeing actual < expected reinforces that OCD lies about danger',
      'Slider has haptic detents at every 10 points (native iOS)',
    ],
  },
  {
    title: 'Review & Save',
    notes: [
      'Summary screen — review everything before saving',
      'Tap any section to jump back and edit',
      'Insight line only shows when actual < expected (positive reinforcement)',
      'Encouraging message at bottom — gentle, not patronizing',
    ],
  },
];

// --- Card transition variants ---
const cardVariants = {
  enter: { y: '100%', opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
};
const cardTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

// --- Custom Slider ---
function ERPSlider({ value, onChange, color = 'blue', label }) {
  const trackRef = useRef(null);
  const [detent, setDetent] = useState(false);
  const lastDetent = useRef(Math.round(value / 10) * 10);

  const calcValue = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(pct * 100);
  }, []);

  const handleMove = useCallback((clientX) => {
    const v = calcValue(clientX);
    onChange(v);
    const rounded = Math.round(v / 10) * 10;
    if (rounded !== lastDetent.current && Math.abs(v - rounded) < 3) {
      lastDetent.current = rounded;
      setDetent(true);
      setTimeout(() => setDetent(false), 150);
    }
  }, [calcValue, onChange]);

  const onPointerDown = (e) => {
    e.preventDefault();
    handleMove(e.clientX);
    const onMove = (ev) => handleMove(ev.clientX);
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="erp-slider-group">
      <div className="erp-slider-label">
        <span className="erp-slider-name">{label}</span>
        <span className="erp-slider-value">{value}</span>
      </div>
      <div className="erp-slider-track" ref={trackRef} onPointerDown={onPointerDown}>
        <div className={`erp-slider-fill ${color}`} style={{ width: `${value}%` }} />
        <div
          className={`erp-slider-thumb ${color} ${detent ? 'detent' : ''}`}
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="erp-slider-ticks">
        <span className="erp-slider-tick">0</span>
        <span className="erp-slider-tick">25</span>
        <span className="erp-slider-tick">50</span>
        <span className="erp-slider-tick">75</span>
        <span className="erp-slider-tick">100</span>
      </div>
    </div>
  );
}

// --- Siri Wave Bubble ---
function SiriWaveBubble({ active }) {
  const containerRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const sw = new SiriWave({
      container: containerRef.current,
      style: 'ios',
      width: 200,
      height: 200,
      speed: 0.03,
      amplitude: active ? 1.2 : 0.3,
      frequency: 4,
      color: '#8a70c0',
      autostart: true,
      pixelDepth: 0.02,
      lerpSpeed: 0.04,
      cover: true,
    });
    waveRef.current = sw;
    return () => sw.dispose();
  }, []);

  useEffect(() => {
    if (!waveRef.current) return;
    waveRef.current.setAmplitude(active ? 1.5 : 0.3);
    waveRef.current.setSpeed(active ? 0.06 : 0.03);
  }, [active]);

  return (
    <div className="erp-siri-bubble">
      <div ref={containerRef} className="erp-siri-bubble-canvas" />
    </div>
  );
}

// --- Chip Group ---
function ChipGroup({ items, selected, onToggle, showAdd, addPlaceholder = 'Type here...' }) {
  const [adding, setAdding] = useState(false);
  const [newChip, setNewChip] = useState('');
  const [bouncing, setBouncing] = useState(null);

  const handleToggle = (item) => {
    onToggle(item);
    setBouncing(item);
    setTimeout(() => setBouncing(null), 300);
  };

  const handleAdd = () => {
    if (newChip.trim()) {
      onToggle(newChip.trim());
      setNewChip('');
      setAdding(false);
    }
  };

  return (
    <>
      <div className="erp-chips">
        {items.map((item) => (
          <button
            key={item}
            className={`erp-chip ${selected.includes(item) ? 'selected' : ''} ${bouncing === item ? 'erp-chip-bouncing' : ''}`}
            onClick={() => handleToggle(item)}
          >
            {item}
          </button>
        ))}
        {showAdd && !adding && (
          <button className="erp-chip add-chip" onClick={() => setAdding(true)}>
            + Something else
          </button>
        )}
      </div>
      {adding && (
        <div className="erp-add-input-wrapper">
          <input
            className="erp-add-input"
            placeholder={addPlaceholder}
            value={newChip}
            onChange={(e) => setNewChip(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button className="erp-add-confirm" onClick={handleAdd}>Add</button>
        </div>
      )}
    </>
  );
}

// --- Voice Button (visual placeholder) ---
function VoiceButton() {
  return (
    <button className="erp-voice-btn" onClick={() => {}}>
      <span className="erp-voice-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </span>
      Tap to speak
    </button>
  );
}

// --- Progress Dots ---
function ProgressDots({ current, total }) {
  return (
    <div className="erp-progress">
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          className={`erp-dot ${i === current ? 'active' : ''} ${i < current ? 'completed' : ''}`}
        />
      ))}
    </div>
  );
}

// --- Notes Panel ---
function NotesPanel({ cardIndex }) {
  const data = CARD_NOTES[cardIndex];
  if (!data) return null;
  return (
    <div className="erp-notes-panel">
      <h3 className="erp-notes-title">{data.title}</h3>
      <ul className="erp-notes-list">
        {data.notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </ul>
    </div>
  );
}

// --- Review Section (tappable to jump back) ---
function ReviewSection({ label, items, onTap }) {
  if (!items || items.length === 0) return null;
  return (
    <button className="erp-review-section" onClick={onTap}>
      <span className="erp-review-label">{label}</span>
      <span className="erp-review-items">{items.join(', ')}</span>
      <span className="erp-review-edit">Edit</span>
    </button>
  );
}

// ======================
// Main Prototype
// ======================
export default function ERPPrototype() {
  const [card, setCard] = useState(0);
  const [direction, setDirection] = useState(1);
  const returnToReview = useRef(false);
  const [hint, setHint] = useState(null);

  // Card data
  const [exposureDate, setExposureDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [triggers, setTriggers] = useState([]);
  const [triggerItems, setTriggerItems] = useState(TRIGGERS);
  const [alarmsBody, setAlarmsBody] = useState([]);
  const [alarmsBodyItems, setAlarmsBodyItems] = useState(ALARMS_BODY);
  const [alarmsEmotion, setAlarmsEmotion] = useState([]);
  const [alarmsEmotionItems, setAlarmsEmotionItems] = useState(ALARMS_EMOTION);
  const [beliefs, setBeliefs] = useState([]);
  const [beliefItems, setBeliefItems] = useState(BELIEFS);
  const [coping, setCoping] = useState([]);
  const [copingItems, setCopingItems] = useState(COPING);
  const [expectedAnxiety, setExpectedAnxiety] = useState(50);
  const [peakAnxiety, setPeakAnxiety] = useState(30);
  const [note, setNote] = useState('');

  // Swipe detection
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  const goTo = useCallback((target) => {
    returnToReview.current = true;
    setDirection(target > card ? 1 : -1);
    setCard(target);
  }, [card]);

  const goNext = useCallback(() => {
    if (card < 6) {
      returnToReview.current = false;
      setDirection(1);
      setCard((c) => c + 1);
    }
  }, [card]);

  const goBack = useCallback(() => {
    if (returnToReview.current) {
      returnToReview.current = false;
      setDirection(1);
      setCard(6);
      return;
    }
    if (card > 0) {
      setDirection(-1);
      setCard((c) => c - 1);
    }
  }, [card]);

  const reset = () => {
    setCard(0);
    setDirection(-1);
    setExposureDate(new Date().toISOString().slice(0, 10));
    setTriggers([]);
    setTriggerItems(TRIGGERS);
    setAlarmsBody([]);
    setAlarmsBodyItems(ALARMS_BODY);
    setAlarmsEmotion([]);
    setAlarmsEmotionItems(ALARMS_EMOTION);
    setBeliefs([]);
    setBeliefItems(BELIEFS);
    setCoping([]);
    setCopingItems(COPING);
    setExpectedAnxiety(50);
    setPeakAnxiety(30);
    setNote('');
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (diff > 60) goNext();
    else if (diff < -60) goBack();
  };

  const toggleItem = (list, setList, allItems, setAllItems) => (item) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
      if (!allItems.includes(item)) {
        setAllItems([...allItems, item]);
      }
    }
  };

  const diff = expectedAnxiety - peakAnxiety;

  const today = new Date().toISOString().slice(0, 10);
  const recentDays = [];
  for (let i = 1; i <= 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    recentDays.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { weekday: 'long' }),
    });
  }

  const cards = [
    // Card 0: Date
    <div className="erp-card" key="date">
      <div className="erp-nav">
        <span />
        <span />
      </div>
      <div className="erp-card-header">
        <h2 className="erp-card-title">When was this?</h2>
      </div>
      <div className="erp-date-options">
        <button
          className={`erp-date-option erp-date-today ${exposureDate === today ? 'selected' : ''}`}
          onClick={() => { setExposureDate(today); goNext(); }}
        >
          Today
        </button>
        {recentDays.map((d) => (
          <button
            key={d.value}
            className={`erp-date-option ${exposureDate === d.value ? 'selected' : ''}`}
            onClick={() => { setExposureDate(d.value); goNext(); }}
          >
            {d.label}
          </button>
        ))}
        <label className="erp-date-option erp-date-calendar">
          Pick a date...
          <input
            type="date"
            className="erp-date-hidden-input"
            value={exposureDate}
            onChange={(e) => { setExposureDate(e.target.value); goNext(); }}
          />
        </label>
      </div>
    </div>,

    // Card 1: Trigger
    <div className="erp-card" key="trigger">
      <div className="erp-nav">
        <button className="erp-back" onClick={goBack}>&larr; Back</button>
        <span />
      </div>
      <div className="erp-card-header">
        <p className="erp-card-step">Step 1 of 6</p>
        <h2 className="erp-card-title">What triggered you?</h2>
        <p className="erp-card-subtitle">Tap all that apply</p>
      </div>
      <SiriWaveBubble active={triggers.length > 0} />
      <ChipGroup
        items={triggerItems}
        selected={triggers}
        onToggle={(item) => {
          setHint(null);
          toggleItem(triggers, setTriggers, triggerItems, setTriggerItems)(item);
        }}
        showAdd
        addPlaceholder="Add trigger..."
      />
      <AnimatePresence>
        {hint && (
          <motion.p
            className="erp-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
      <button
        className="erp-next-btn"
        onClick={() => {
          if (triggers.length === 0) {
            setHint('Tap one or more triggers above to continue');
          } else {
            setHint(null);
            goNext();
          }
        }}
      >
        Next
      </button>
    </div>,

    // Card 1: Alarms
    <div className="erp-card" key="alarms">
      <div className="erp-nav">
        <button className="erp-back" onClick={goBack}>&larr; Back</button>
        <span />
      </div>
      <div className="erp-card-header">
        <p className="erp-card-step">Step 2 of 6</p>
        <h2 className="erp-card-title">What did you notice?</h2>
        <p className="erp-card-subtitle">Body sensations &amp; emotions</p>
      </div>
      <div className="erp-divider">
        <div className="erp-divider-line" />
        <span className="erp-divider-text">Body</span>
        <div className="erp-divider-line" />
      </div>
      <ChipGroup
        items={alarmsBodyItems}
        selected={alarmsBody}
        onToggle={toggleItem(alarmsBody, setAlarmsBody, alarmsBodyItems, setAlarmsBodyItems)}
        showAdd
        addPlaceholder="Add sensation..."
      />
      <div className="erp-divider">
        <div className="erp-divider-line" />
        <span className="erp-divider-text">Emotions</span>
        <div className="erp-divider-line" />
      </div>
      <ChipGroup
        items={alarmsEmotionItems}
        selected={alarmsEmotion}
        onToggle={toggleItem(alarmsEmotion, setAlarmsEmotion, alarmsEmotionItems, setAlarmsEmotionItems)}
        showAdd
        addPlaceholder="Add emotion..."
      />
      <button className="erp-next-btn" onClick={goNext}>
        Next
      </button>
    </div>,

    // Card 2: Beliefs/Thoughts
    <div className="erp-card" key="beliefs">
      <div className="erp-nav">
        <button className="erp-back" onClick={goBack}>&larr; Back</button>
        <button className="erp-skip" onClick={goNext}>Skip</button>
      </div>
      <div className="erp-card-header">
        <p className="erp-card-step">Step 3 of 6</p>
        <h2 className="erp-card-title">What thoughts came up?</h2>
        <p className="erp-card-subtitle">The beliefs OCD pushed on you</p>
      </div>
      <VoiceButton />
      <ChipGroup
        items={beliefItems}
        selected={beliefs}
        onToggle={toggleItem(beliefs, setBeliefs, beliefItems, setBeliefItems)}
        showAdd
        addPlaceholder="Add thought..."
      />
      <button className="erp-next-btn" onClick={goNext}>
        Next
      </button>
    </div>,

    // Card 3: Coping
    <div className="erp-card" key="coping">
      <div className="erp-nav">
        <button className="erp-back" onClick={goBack}>&larr; Back</button>
        <button className="erp-skip" onClick={goNext}>Skip</button>
      </div>
      <div className="erp-card-header">
        <p className="erp-card-step">Step 4 of 6</p>
        <h2 className="erp-card-title">How did you cope?</h2>
        <p className="erp-card-subtitle">What strategies did you use?</p>
      </div>
      <VoiceButton />
      <ChipGroup
        items={copingItems}
        selected={coping}
        onToggle={toggleItem(coping, setCoping, copingItems, setCopingItems)}
        showAdd
        addPlaceholder="Add strategy..."
      />
      <textarea
        className="erp-note-input"
        placeholder="Quick note (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="erp-next-btn" onClick={goNext}>
        Next
      </button>
    </div>,

    // Card 4: Anxiety Sliders
    <div className="erp-card" key="sliders">
      <div className="erp-nav">
        <button className="erp-back" onClick={goBack}>&larr; Back</button>
        <span />
      </div>
      <div className="erp-card-header">
        <p className="erp-card-step">Step 5 of 6</p>
        <h2 className="erp-card-title">Rate your anxiety</h2>
        <p className="erp-card-subtitle">Expected vs. what actually happened</p>
      </div>
      <ERPSlider
        label="Expected anxiety"
        value={expectedAnxiety}
        onChange={setExpectedAnxiety}
        color="blue"
      />
      <div style={{ height: 16 }} />
      <ERPSlider
        label="Actual peak"
        value={peakAnxiety}
        onChange={setPeakAnxiety}
        color="green"
      />
      <button className="erp-next-btn" onClick={goNext} style={{ marginTop: 40 }}>
        Review
      </button>
    </div>,

    // Card 6: Review & Save
    <div className="erp-card erp-card--review" key="review">
      <div className="erp-review-scroll">
        <div className="erp-nav">
          <button className="erp-back" onClick={goBack}>&larr; Back</button>
          <span />
        </div>
        <div className="erp-card-header">
          <p className="erp-card-step">Step 6 of 6</p>
          <h2 className="erp-card-title">Review your entry</h2>
          <p className="erp-card-subtitle">Tap any section to edit</p>
        </div>
        <div className="erp-review-list">
          <button className="erp-review-section" onClick={() => goTo(0)}>
            <span className="erp-review-label">Date</span>
            <span className="erp-review-items">{exposureDate === today ? 'Today' : new Date(exposureDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span className="erp-review-edit">Edit</span>
          </button>
          <ReviewSection label="Triggers" items={triggers} onTap={() => goTo(1)} />
          <ReviewSection label="Body" items={alarmsBody} onTap={() => goTo(2)} />
          <ReviewSection label="Emotions" items={alarmsEmotion} onTap={() => goTo(2)} />
          <ReviewSection label="Thoughts" items={beliefs} onTap={() => goTo(3)} />
          <ReviewSection label="Coping" items={coping} onTap={() => goTo(4)} />
          {note && (
            <button className="erp-review-section" onClick={() => goTo(4)}>
              <span className="erp-review-label">Note</span>
              <span className="erp-review-items">{note}</span>
              <span className="erp-review-edit">Edit</span>
            </button>
          )}
          <button className="erp-review-section erp-review-anxiety" onClick={() => goTo(5)}>
            <span className="erp-review-label">Anxiety</span>
            <span className="erp-review-anxiety-row">
              <span className="erp-review-anxiety-stat">
                <span className="erp-review-anxiety-num">{expectedAnxiety}</span>
                <span className="erp-review-anxiety-sub">expected</span>
              </span>
              <span className="erp-review-anxiety-stat">
                <span className="erp-review-anxiety-num">{peakAnxiety}</span>
                <span className="erp-review-anxiety-sub">actual</span>
              </span>
            </span>
            <span className="erp-review-edit">Edit</span>
          </button>
          {diff > 0 && (
            <p className="erp-review-insight">
              {diff} points less than you expected
            </p>
          )}
        </div>
      </div>
      <div className="erp-review-footer">
        <p className="erp-review-encourage">
          You showed up. That matters.
        </p>
        <button className="erp-done-btn" onClick={reset}>
          Save entry
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="erp-prototype-layout">
      <div className="erp-phone-frame">
        <div className="erp-phone-shell">
          <ProgressDots current={card} total={7} />
          <div
            className="erp-card-container"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={card}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={cardTransition}
                style={{ position: 'absolute', inset: 0 }}
              >
                {cards[card]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <NotesPanel cardIndex={card} />
    </div>
  );
}
