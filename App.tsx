import React from 'react';

const architecture = [
  {
    title: 'Frontend (Web + Mobile)',
    items: [
      'React + Vite UI, responsive layouts, offline-friendly caching',
      'Quiz runner with step-by-step flow and instant feedback',
      'Language switcher (UZ/EN/RU) with auto-detection fallback',
      'Progress tracker, timer, and motivational micro-texts',
    ],
  },
  {
    title: 'Backend (API + AI)',
    items: [
      'Node.js or Python (FastAPI) orchestration layer',
      'PDF ingestion, text extraction, and concept tagging',
      'Question generator service with MCQ/True-False templates',
      'Result scoring, leaderboard ranking, and analytics',
    ],
  },
  {
    title: 'AI Services',
    items: [
      'PDF parsing + OCR for scanned documents',
      'Embedding-based topic clustering + key concept extraction',
      'LLM prompts with validation + safety filters',
      'Answer explanation generator with citation to source chunk',
    ],
  },
];

const databaseSchema = [
  {
    name: 'users',
    fields: ['id (UUID)', 'full_name', 'email', 'language_pref', 'created_at'],
  },
  {
    name: 'quizzes',
    fields: [
      'id (UUID)',
      'user_id (FK)',
      'title',
      'source_pdf_url',
      'language',
      'time_limit_sec',
      'question_count',
      'created_at',
    ],
  },
  {
    name: 'questions',
    fields: [
      'id (UUID)',
      'quiz_id (FK)',
      'type (MCQ/TF)',
      'prompt',
      'options (JSON)',
      'correct_answer',
      'explanation',
      'source_chunk_id',
    ],
  },
  {
    name: 'results',
    fields: [
      'id (UUID)',
      'quiz_id (FK)',
      'user_id (FK)',
      'score',
      'correct_count',
      'total_questions',
      'accuracy_pct',
      'time_spent_sec',
      'created_at',
    ],
  },
  {
    name: 'leaderboard',
    fields: [
      'id (UUID)',
      'quiz_id (FK)',
      'user_id (FK)',
      'rank_position',
      'score',
      'time_spent_sec',
    ],
  },
];

const apiEndpoints = [
  { method: 'POST', path: '/api/v1/uploads', desc: 'Upload PDF + detect language.' },
  { method: 'POST', path: '/api/v1/quizzes', desc: 'Generate quiz from parsed PDF.' },
  { method: 'GET', path: '/api/v1/quizzes/:id', desc: 'Fetch quiz metadata + questions.' },
  { method: 'POST', path: '/api/v1/quizzes/:id/answer', desc: 'Submit answer + get explanation.' },
  { method: 'POST', path: '/api/v1/results', desc: 'Store results and update leaderboard.' },
  { method: 'GET', path: '/api/v1/leaderboard/:quizId', desc: 'Top 10 + user rank.' },
];

const aiPipeline = [
  {
    title: '1. PDF Parsing',
    detail: 'Extract text via pdfminer + OCR fallback for scans. Chunk by headings and pages.',
  },
  {
    title: '2. Language Detection',
    detail: 'FastText or langdetect on chunks; allow manual override in UI.',
  },
  {
    title: '3. Concept Extraction',
    detail: 'Embed chunks, cluster by topic, and identify key terms + definitions.',
  },
  {
    title: '4. Question Generation',
    detail: 'LLM prompt templates for MCQ (4 options) and True/False.',
  },
  {
    title: '5. Validation & Explanations',
    detail: 'Answer checking with source chunk + short explanation summary.',
  },
];

const sampleJson = `{
  "quizId": "quiz_81ab",
  "title": "Operating Systems Midterm",
  "language": "en",
  "timeLimitSec": 1200,
  "questions": [
    {
      "id": "q1",
      "type": "MCQ",
      "prompt": "Which scheduling algorithm minimizes average waiting time?",
      "options": ["FIFO", "SJF", "Round Robin", "Priority"],
      "correctAnswer": "SJF",
      "explanation": "Shortest Job First is proven to minimize average waiting time.",
      "sourceChunkId": "chunk_14"
    },
    {
      "id": "q2",
      "type": "TRUE_FALSE",
      "prompt": "Paging eliminates external fragmentation.",
      "correctAnswer": true,
      "explanation": "Paging uses fixed-size frames, avoiding external fragmentation.",
      "sourceChunkId": "chunk_21"
    }
  ]
}`;

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">UniQuiz AI</p>
            <h1 className="text-xl font-semibold">Exam Simulator & AI Tutor</h1>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a className="hover:text-white" href="#flow">Quiz Flow</a>
            <a className="hover:text-white" href="#leaderboard">Leaderboard</a>
            <a className="hover:text-white" href="#architecture">Architecture</a>
            <button className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-900">Start Demo</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200">
              Built for university exam preparation · Uzbek · English · Russian
            </div>
            <h2 className="text-4xl font-semibold leading-tight text-white">
              Upload your lecture PDFs, get instant quizzes, and study like it is exam day.
            </h2>
            <p className="text-lg text-slate-300">
              UniQuiz AI turns notes, textbooks, and exam materials into step-by-step quizzes with instant feedback,
              explanations, and competitive rankings. Fast, focused, and motivating for students.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-semibold text-cyan-200">Quiz Flow</p>
                <p className="mt-2 text-sm text-slate-300">One question at a time · Instant ✅/❌ feedback · Auto-advance.</p>
                <p className="mt-3 text-xs text-slate-400">Motivation: “Keep going!” · “You’re doing great!”</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                <p className="text-sm font-semibold text-cyan-200">Scoring</p>
                <p className="mt-2 text-sm text-slate-300">+1 correct, 0 incorrect · Accuracy · Optional timer.</p>
                <p className="mt-3 text-xs text-slate-400">Competitive leaderboard with score + time tiebreaker.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Upload PDF</p>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-white/20 bg-slate-900/60 px-4 py-6">
                  <div>
                    <p className="text-sm font-semibold text-white">Drop lecture notes here</p>
                    <p className="text-xs text-slate-400">PDF · OCR supported · Auto language detect</p>
                  </div>
                  <button className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-900">Browse</button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">UZ detected</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">EN</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">RU</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Quiz Preview</p>
                  <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-200">Question 7 / 20</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Which statement best describes classical conditioning?</p>
                <div className="mt-3 grid gap-2 text-xs">
                  {['A. Learning by association', 'B. Learning by trial and error', 'C. Observational learning', 'D. Insight learning'].map((option) => (
                    <div key={option} className="rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2">
                      {option}
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3 text-xs text-emerald-200">
                  ✅ Correct! Classical conditioning is learning by association.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="flow" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <h3 className="text-xl font-semibold text-white">Step-by-step Quiz Flow</h3>
            <ol className="mt-4 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-cyan-300">1.</span>
                Upload PDF → parse → extract key concepts.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300">2.</span>
                Generate MCQ + True/False with explanations.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300">3.</span>
                Answer one-by-one → immediate ✅/❌ feedback.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300">4.</span>
                Auto-advance to next question with motivational text.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300">5.</span>
                Results summary, accuracy, and ranking.
              </li>
            </ol>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-semibold text-white">Timer & Scoring</h3>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Time Limit</p>
                  <p className="text-lg font-semibold text-white">20 minutes</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Score</p>
                  <p className="text-lg font-semibold text-white">18 / 25</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Accuracy</p>
                  <p className="text-lg font-semibold text-white">72%</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[72%] rounded-full bg-cyan-400"></div>
              </div>
              <p className="mt-3 text-xs text-slate-400">Keep going! You’re doing great!</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-xl font-semibold text-white">Final Result</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <div className="flex justify-between"><span>Total score</span><span className="text-white">18 / 25</span></div>
                <div className="flex justify-between"><span>Accuracy</span><span className="text-white">72%</span></div>
                <div className="flex justify-between"><span>Time spent</span><span className="text-white">14m 12s</span></div>
                <div className="flex justify-between"><span>Performance level</span><span className="text-emerald-300">Good</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="leaderboard" className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Leaderboard</h3>
              <p className="text-sm text-slate-300">You are 5th out of 120 students.</p>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300">Ranking = Score → Time tiebreaker</div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            {[
              ['1', 'Dilnoza Karimova', '24', '11m 02s'],
              ['2', 'Jonas Lee', '23', '10m 12s'],
              ['3', 'Sabina Ahmed', '23', '12m 41s'],
              ['4', 'Ruslan Petrov', '22', '09m 58s'],
              ['5', 'You', '22', '11m 30s'],
            ].map(([rank, name, score, time]) => (
              <div key={rank} className="grid grid-cols-[60px_1fr_80px_80px] items-center rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-cyan-200">#{rank}</span>
                <span className={name === 'You' ? 'font-semibold text-white' : 'text-slate-200'}>{name}</span>
                <span className="text-right text-slate-200">{score}</span>
                <span className="text-right text-slate-400">{time}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="architecture" className="grid gap-6 lg:grid-cols-3">
          {architecture.map((block) => (
            <div key={block.title} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">{block.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-cyan-300">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Database Schema</h3>
            <div className="mt-4 grid gap-4">
              {databaseSchema.map((table) => (
                <div key={table.name} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-cyan-200">{table.name}</p>
                  <p className="mt-2 text-xs text-slate-400">{table.fields.join(' · ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">API Endpoints</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {apiEndpoints.map((api) => (
                  <div key={api.path} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-200">{api.method}</span>
                      <span className="text-xs text-slate-400">{api.path}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300">{api.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
              <h3 className="text-lg font-semibold text-white">AI Logic Overview</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                {aiPipeline.map((step) => (
                  <div key={step.title} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="text-xs font-semibold text-cyan-200">{step.title}</p>
                    <p className="mt-2 text-xs text-slate-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Sample JSON Response</h3>
              <p className="text-xs text-slate-400">Quiz questions with answers + explanations.</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">v1</span>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-cyan-100">
            {sampleJson}
          </pre>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>UniQuiz AI · Smart exam prep for university students.</p>
          <p>Designed for speed, clarity, and motivation.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
