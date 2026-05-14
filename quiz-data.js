// ============================================================
//  quiz-data.js  ← ここを編集して問題を変更できます
// ============================================================

const QUIZ_DATA = [
  {
    question: "JavaScriptで変数を宣言するキーワードはどれですか？",
    choices: ["var", "dim", "int", "string"],
    correct: 0,
    explanation: "JavaScriptでは var、let、const の3種類で変数を宣言します。dim は VBA、int は C言語などの型名です。"
  },
  {
    question: "HTMLでリンクを作るタグはどれですか？",
    choices: ["<link>", "<a>", "<href>", "<url>"],
    correct: 1,
    explanation: "<a href='URL'>テキスト</a> でリンクを作ります。<link> はCSSの読み込みなどに使います。"
  },
  {
    question: "CSSで文字色を変えるプロパティは？",
    choices: ["font-color", "text-color", "color", "font-style"],
    correct: 2,
    explanation: "文字色は color プロパティで指定します。例: color: red; または color: #ff0000;"
  },
  {
    question: "インターネット上のページの住所を表す略称は？",
    choices: ["FTP", "URL", "HTML", "CSS"],
    correct: 1,
    explanation: "URL (Uniform Resource Locator) はウェブページの住所を表します。例: https://example.com"
  },
  {
    question: "Google スプレッドシートで使うプログラミング言語は？",
    choices: ["Python", "JavaScript", "Google Apps Script", "Ruby"],
    correct: 2,
    explanation: "Google Apps Script（GAS）は JavaScriptベースの言語で、Google サービスを自動化できます。"
  }
];
