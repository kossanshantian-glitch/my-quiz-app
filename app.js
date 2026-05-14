// ============================================================
//  app.js — クイズアプリのメインロジック
// ============================================================

const LABELS = ['A', 'B', 'C', 'D', 'E'];
const COMMENTS = [
  [100, '🏆 パーフェクト！全問正解です！'],
  [80,  '🌟 素晴らしい！ほぼ完璧です'],
  [60,  '👍 なかなかいい成績です'],
  [40,  '📚 もう少し復習しましょう'],
  [0,   '💪 次は頑張ろう！復習が必要です'],
];

let state = {
  questions: [],
  current: 0,
  score: 0,
  answers: [],   // { q, correct, userChoice, isCorrect }
  userName: '',
  startTime: null,
};

// ── 初期化 ──────────────────────────────────────────────
window.onload = () => {
  document.getElementById('total-count').textContent = QUIZ_DATA.length;
  loadSettings();
};

// ── 画面切替 ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  el.classList.add('active');
  // settings screen needs flex-direction column
  if (id === 'screen-result') el.style.flexDirection = 'column';
}

// ── クイズ開始 ────────────────────────────────────────────
function startQuiz() {
  state.questions = shuffle([...QUIZ_DATA]);
  state.current = 0;
  state.score = 0;
  state.answers = [];
  state.userName = document.getElementById('user-name').value.trim();
  state.startTime = Date.now();
  showScreen('screen-quiz');
  renderQuestion();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── 問題描画 ─────────────────────────────────────────────
function renderQuestion() {
  const q = state.questions[state.current];
  const total = state.questions.length;

  // header
  const pct = (state.current / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent =
    `${state.current + 1} / ${total}`;
  document.getElementById('score-badge').textContent = `✓ ${state.score}`;

  // question
  document.getElementById('q-number').textContent = `Q${state.current + 1}`;
  document.getElementById('q-text').textContent = q.question;

  // choices
  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  q.choices.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-label">${LABELS[i]}</span>${escHtml(text)}`;
    btn.onclick = () => handleAnswer(i);
    choicesEl.appendChild(btn);
  });

  // hide feedback
  const fb = document.getElementById('feedback');
  fb.classList.add('hidden');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── 回答処理 ─────────────────────────────────────────────
function handleAnswer(chosen) {
  const q = state.questions[state.current];
  const isCorrect = chosen === q.correct;
  if (isCorrect) state.score++;

  // record
  state.answers.push({
    question: q.question,
    correctChoice: q.choices[q.correct],
    userChoice: q.choices[chosen],
    isCorrect,
    explanation: q.explanation,
  });

  // disable all buttons, highlight
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === chosen && !isCorrect) btn.classList.add('wrong');
  });

  // feedback
  const fb = document.getElementById('feedback');
  fb.classList.remove('hidden');
  document.getElementById('feedback-icon').textContent = isCorrect ? '✅' : '❌';
  const msg = document.getElementById('feedback-msg');
  msg.textContent = isCorrect ? '正解！' : `不正解… 正解は「${q.choices[q.correct]}」`;
  msg.className = 'feedback-msg ' + (isCorrect ? 'correct' : 'wrong');
  document.getElementById('explanation').textContent = q.explanation;
}

// ── 次の問題 ─────────────────────────────────────────────
function nextQuestion() {
  state.current++;
  if (state.current >= state.questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ── 結果画面 ─────────────────────────────────────────────
function showResult() {
  showScreen('screen-result');
  const total = state.questions.length;
  const pct = Math.round((state.score / total) * 100);

  document.getElementById('result-correct').textContent = state.score;
  document.getElementById('result-total').textContent = total;

  // emoji
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : pct >= 40 ? '📚' : '💪';
  document.getElementById('result-emoji').textContent = emoji;

  // comment
  const comment = COMMENTS.find(([th]) => pct >= th);
  document.getElementById('result-comment').textContent = comment[1];

  // stats
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  document.getElementById('result-status').innerHTML = `
    <div class="stat-pill">正答率 <span>${pct}%</span></div>
    <div class="stat-pill">所要時間 <span>${min}分${sec}秒</span></div>
    <div class="stat-pill">問題数 <span>${total}問</span></div>
  `;

  // review
  const wrongAnswers = state.answers.filter(a => !a.isCorrect);
  const reviewEl = document.getElementById('review-list');
  if (wrongAnswers.length > 0) {
    reviewEl.innerHTML = '<h3>間違えた問題の復習</h3>';
    wrongAnswers.forEach(a => {
      const div = document.createElement('div');
      div.className = 'review-item';
      div.innerHTML = `
        <div class="ri-q">Q: ${escHtml(a.question)}</div>
        <div class="ri-ans">
          あなたの答え: <span class="wrong">${escHtml(a.userChoice)}</span><br>
          正解: <span class="correct">${escHtml(a.correctChoice)}</span><br>
          <small style="color:#9090a8">${escHtml(a.explanation)}</small>
        </div>
      `;
      reviewEl.appendChild(div);
    });
  } else {
    reviewEl.innerHTML = '<p style="color:#22c55e;text-align:center">全問正解！復習は不要です 🎉</p>';
  }
}

// ── リトライ ─────────────────────────────────────────────
function retryQuiz() {
  showScreen('screen-start');
}

// ── スプレッドシートに保存 ───────────────────────────────
async function saveToSheet() {
  const gasUrl = localStorage.getItem('gas_url') || '';
  if (!gasUrl) {
    showSaveStatus('error', '⚙️ まず設定からGoogle Apps Script URLを登録してください');
    return;
  }

  const btn = document.getElementById('btn-save');
  btn.disabled = true;
  btn.textContent = '保存中...';

  const now = new Date();
  const dateStr = now.toLocaleString('ja-JP');
  const total = state.questions.length;
  const pct = Math.round((state.score / total) * 100);
  const elapsed = Math.round((Date.now() - state.startTime) / 1000);

  const payload = {
    timestamp: dateStr,
    name: state.userName || '匿名',
    score: state.score,
    total: total,
    percent: pct,
    elapsed: elapsed,
    details: state.answers.map(a => ({
      q: a.question,
      correct: a.correctChoice,
      answer: a.userChoice,
      result: a.isCorrect ? '○' : '×',
    }))
  };

  try {
    const res = await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // no-cors では response body 読めないので成功扱い
    showSaveStatus('success', '✅ スプレッドシートに保存しました！');
  } catch (e) {
    showSaveStatus('error', '❌ 保存に失敗しました。URLを確認してください。');
  } finally {
    btn.disabled = false;
    btn.textContent = '📊 スプレッドシートに保存';
  }
}

function showSaveStatus(type, msg) {
  const el = document.getElementById('save-status');
  el.className = 'save-status ' + type;
  el.textContent = msg;
}

// ── 設定 ─────────────────────────────────────────────────
function loadSettings() {
  const url = localStorage.getItem('gas_url') || '';
  document.getElementById('gas-url-input').value = url;
}

function saveSettings() {
  const url = document.getElementById('gas-url-input').value.trim();
  localStorage.setItem('gas_url', url);
  showScreen('screen-start');
}
