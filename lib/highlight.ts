/**
 * A very small highlighter for the code samples on each page. It only colours
 * comments, strings, keywords and JSX tags, which is all the samples need.
 */
const KEYWORDS = new Set([
  "import", "from", "export", "function", "return", "const", "let", "await", "async",
  "if", "else", "new", "true", "false", "null", "default", "type", "interface",
]);

function escape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(code: string): string {
  const pattern = /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.]*|\/?>)|\b([A-Za-z_]\w*)\b/g;
  let out = "";
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    out += escape(code.slice(last, match.index));
    const [text, comment, string, tag, word] = match;
    if (comment) out += `<span class="c">${escape(comment)}</span>`;
    else if (string) out += `<span class="s">${escape(string)}</span>`;
    else if (tag) out += `<span class="t">${escape(tag)}</span>`;
    else if (word && KEYWORDS.has(word)) out += `<span class="k">${word}</span>`;
    else out += escape(text);
    last = (match.index ?? 0) + text.length;
  }
  return out + escape(code.slice(last));
}
