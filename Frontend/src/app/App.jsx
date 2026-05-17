import { useState, useRef, useEffect } from 'react';
import './App.css';

/* ─── Mock API response ──────────────────────────────────────────── */
const MOCK_RESPONSE = {
  problem: "predict the team who will win the ipl 2026 based on current performance",
  solution_1: `Predicting the **IPL 2026 winner** based on current performances requires analyzing trends, squad strengths, and franchise stability.

### **Key Factors for IPL 2026 Success:**
1. **Core Retention & Auction Strategy** – Teams with smart mega-auction plans
2. **Youth Development** – MI, CSK, RCB have strong scouting pipelines
3. **Leadership Stability** – Settled captains/coaches perform better
4. **Recent Form (2023–24)** – Consistency in playoffs
5. **Home Advantage** – If home-away format returns post-2025

### **Top Contenders:**
**Mumbai Indians (MI)** — Best talent pipeline (Tilak Varma, Suryakumar Yadav, Bumrah). Five IPL titles prove big-match temperament. Comeback kings even after poor seasons.

**Chennai Super Kings (CSK)** — Consistent core with Jadeja, Pathirana, and Ruturaj Gaikwad's leadership post-Dhoni era. Auction mastery always finds gems.

**Kolkata Knight Riders (KKR)** — Young, explosive squad. Rinku Singh, Varun Chakravarthy, Sunil Narine's all-round ability with analytics-driven management.

**Royal Challengers Bangalore (RCB)** — Virat Kohli in god-mode plus improved death bowling could finally break their playoff jinx.

### **Dark Horses:**
- **Rajasthan Royals (RR)**: Sanju Samson, Jaiswal, Buttler — lethal batting
- **Sunrisers Hyderabad (SRH)**: Travis Head + Heinrich Klaasen pace attack

### **Final Prediction: Mumbai Indians (MI) 🏆**
MI's talent development, 5-title history, and even-year dominance (2013, 2015, 2017, 2019, 2020) make them the strongest pick for 2026.

**Alternative:** CSK if Ruturaj transitions smoothly into the captain's role.`,

  solution_2: `Predicting IPL 2026 is highly speculative, but current trends point to a few strong contenders.

### **Top Contenders Based on Current Trends:**

**Chennai Super Kings (CSK)**
- Consistent performance, strong leadership under MS Dhoni
- Well-balanced squad with proven winning culture
- Challenge: Aging core players may need replacements by 2026

**Mumbai Indians (MI)**
- Five-time champions with a strong batting lineup
- Excellent pace attack anchored by Jasprit Bumrah
- Challenge: Inconsistent recent performances

**Gujarat Titans (GT)**
- Strong start as a new franchise with excellent captaincy under Hardik Pandya
- Balanced squad with young talent like Shubman Gill and Sai Sudharsan
- Challenge: Maintaining consistency over multiple seasons

**Rajasthan Royals (RR)**
- Strong batting lineup with emerging young talent
- Yashasvi Jaiswal's explosive opening provides strong foundation
- Challenge: Inconsistent bowling attack

**Lucknow Super Giants (LSG)**
- Strong batting depth with Nicholas Pooran and KL Rahul
- Emerging players bolster their lineup
- Challenge: Lack of experience as a newer franchise

### **Dark Horses:**
- **SRH**: Could rebuild effectively and surprise
- **RCB**: Historically strong on paper, need consistency
- **PBKS**: Need to improve team balance significantly

### **Final Prediction: Gujarat Titans (GT) or CSK 🏆**
GT's ability to maintain core players + CSK's strategic brilliance makes them the strongest favorites. However, the IPL remains highly unpredictable — new players could emerge as dominant forces.`,

  judge: {
    solution_1_score: 9,
    solution_2_score: 7,
    solution_1_reasoning: "Solution 1 provides a comprehensive analysis of IPL teams, considering multiple factors such as core retention, youth development, leadership stability, recent form, and home advantage. It evaluates strengths and weaknesses of each team with a detailed breakdown of top contenders and dark horses. The final prediction of Mumbai Indians is well-reasoned with supporting historical data (even-year dominance pattern). The alternative pick of Chennai Super Kings is also thoughtfully argued.",
    solution_2_reasoning: "Solution 2 identifies the same top contenders but provides less depth in its evaluation. It lacks the statistical modeling and historical performance patterns that Solution 1 uses. The final prediction of Gujarat Titans or CSK is less strongly justified — GT's recent inconsistency and the post-Hardik era uncertainty were not sufficiently addressed. The analysis misses key retirement factors and emerging talent trajectories."
  }
};

/* ─── Markdown-lite renderer ─────────────────────────────────────── */
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="md-h3">{line.slice(4).replace(/\*\*/g,'')}</h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="md-h2">{line.slice(3)}</h2>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={key++} className="md-bold">{line.slice(2,-2)}</p>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={key++} className="md-li">{inlineFormat(line.replace(/^\d+\. /, ''))}</li>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="md-li-bullet">{inlineFormat(line.slice(2))}</li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="md-spacer" />);
    } else {
      elements.push(
        <p key={key++} className="md-p">{inlineFormat(line)}</p>
      );
    }
  }
  return elements;
}

function inlineFormat(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2,-2)}</strong>
      : part
  );
}

/* ─── Score Ring ─────────────────────────────────────────────────── */
function ScoreRing({ score, maxScore = 10 }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = score / maxScore;
  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 72 72" width="72" height="72">
        <circle cx="36" cy="36" r={r} className="score-ring-track" />
        <circle
          cx="36" cy="36" r={r}
          className="score-ring-fill"
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeDashoffset={circ * 0.25}
        />
      </svg>
      <span className="score-ring-num">{score}</span>
    </div>
  );
}

/* ─── Typing indicator ───────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span className="typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="typing-dot" style={{ animationDelay: '160ms' }} />
      <span className="typing-dot" style={{ animationDelay: '320ms' }} />
    </div>
  );
}

/* ─── Solution Card ──────────────────────────────────────────────── */
function SolutionCard({ number, content }) {
  return (
    <div className="solution-card glass">
      <div className="solution-card-header">
        <span className="solution-badge">Solution {number}</span>
      </div>
      <div className="solution-card-body">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

/* ─── Judge Panel ────────────────────────────────────────────────── */
function JudgePanel({ judge }) {
  return (
    <div className="judge-panel glass-gold">
      <div className="judge-header">
        <span className="judge-icon">⚖️</span>
        <div>
          <h2 className="judge-title">Judge's Verdict</h2>
          <p className="judge-subtitle">AI-powered comparative evaluation</p>
        </div>
      </div>

      <div className="judge-scores">
        {/* Solution 1 */}
        <div className="judge-score-block">
          <div className="judge-score-top">
            <ScoreRing score={judge.solution_1_score} />
            <div>
              <div className="judge-score-label">Solution 1</div>
              <div className="judge-score-value">{judge.solution_1_score}/10</div>
            </div>
          </div>
          <p className="judge-reasoning">{judge.solution_1_reasoning}</p>
        </div>

        <div className="judge-divider" />

        {/* Solution 2 */}
        <div className="judge-score-block">
          <div className="judge-score-top">
            <ScoreRing score={judge.solution_2_score} />
            <div>
              <div className="judge-score-label">Solution 2</div>
              <div className="judge-score-value">{judge.solution_2_score}/10</div>
            </div>
          </div>
          <p className="judge-reasoning">{judge.solution_2_reasoning}</p>
        </div>
      </div>

      <div className="judge-winner">
        <span className="judge-winner-label">🏆 Winner</span>
        <span className="judge-winner-text">
          Solution {judge.solution_1_score >= judge.solution_2_score ? '1' : '2'}
          &nbsp;— scored {Math.max(judge.solution_1_score, judge.solution_2_score)}/10
        </span>
      </div>
    </div>
  );
}

/* ─── Message types ──────────────────────────────────────────────── */
function UserMessage({ text }) {
  return (
    <div className="msg-row msg-row-user">
      <div className="user-bubble">{text}</div>
    </div>
  );
}

function AIResponse({ data }) {
  return (
    <div className="ai-response" style={{ animation: 'slideUp 0.4s ease' }}>
      <div className="solutions-grid">
        <SolutionCard number={1} content={data.solution_1} />
        <SolutionCard number={2} content={data.solution_2} />
      </div>
      <JudgePanel judge={data.judge} />
    </div>
  );
}

/* ─── Header ─────────────────────────────────────────────────────── */
function Header() {
  return (
    <header className="app-header glass">
      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="19" stroke="#6c63ff" strokeWidth="2" fill="rgba(108,99,255,0.1)" />
            <path d="M12 28 L20 12 L28 28" stroke="#6c63ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M14 23 H26" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="12" r="2.5" fill="#f5a623"/>
            <line x1="8" y1="30" x2="32" y2="30" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h1 className="header-title">AI Judge</h1>
          <p className="header-subtitle">Dual AI Solution Evaluator</p>
        </div>
      </div>
      <div className="header-status">
        <span className="status-dot" />
        <span className="status-text">Online</span>
      </div>
    </header>
  );
}

/* ─── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { type: 'user', text: q }]);
    setInput('');
    setLoading(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 2200));

    setLoading(false);
    setMessages(prev => [...prev, {
      type: 'ai',
      data: { ...MOCK_RESPONSE, problem: q }
    }]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    }
  };

  return (
    <div className="app-layout">
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <Header />

      {/* Chat area */}
      <main className="chat-area">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <h2 className="empty-title">Ask me anything</h2>
            <p className="empty-sub">I'll generate two expert solutions and judge which one is better.</p>
            <div className="suggestion-chips">
              {[
                'Predict IPL 2026 winner',
                'Best programming language for AI?',
                'Future of quantum computing?',
              ].map(s => (
                <button key={s} className="chip" onClick={() => setInput(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.type === 'user'
            ? <UserMessage key={i} text={msg.text} />
            : <AIResponse key={i} data={msg.data} />
        )}

        {loading && (
          <div className="loading-row">
            <div className="loading-card glass">
              <div className="loading-bar" />
              <div className="loading-content">
                <TypingIndicator />
                <span className="loading-text">Generating dual solutions & verdict…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <div className="input-bar-wrap">
        <div className="input-bar glass">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="input-textarea"
            placeholder="Ask your question…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKey}
            rows={1}
            disabled={loading}
          />
          <button
            id="send-btn"
            className={`send-btn${input.trim() ? ' send-btn-active' : ''}`}
            onClick={handleSend}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22 11 13 2 9 22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
