// Insight Log Landing Page Scripts

// 1. Copy command handler
document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copy-btn");
  const cloneCmd = document.getElementById("clone-cmd");

  if (copyBtn && cloneCmd) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cloneCmd.textContent.trim());
        const originalText = copyBtn.querySelector(".copy-text").textContent;
        copyBtn.querySelector(".copy-text").textContent = "已复制";
        copyBtn.classList.add("copied");

        setTimeout(() => {
          copyBtn.querySelector(".copy-text").textContent = originalText;
          copyBtn.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });
  }

  // 2. Interactive Search Simulator
  initDemoSimulator();
});

// Mock Log Dataset
const SAMPLE_LOG_FILES = [
  {
    path: "production/gateway/access.log",
    lines: [
      { ln: 104, text: "2026-09-23 10:14:01 INFO  [gateway] incoming request GET /api/v1/orders 200 OK - 12ms" },
      { ln: 105, text: "2026-09-23 10:14:02 WARN  [gateway] upstream latency degraded, response took 1280ms" },
      { ln: 106, text: "2026-09-23 10:14:05 ERROR [gateway] upstream backend connection timeout after 3000ms" },
      { ln: 107, text: "2026-09-23 10:14:06 ERROR [gateway] downstream client aborted during timeout wait" },
      { ln: 108, text: "2026-09-23 10:14:08 INFO  [gateway] circuit breaker tripped for host: payments-cluster" },
    ]
  },
  {
    path: "archive.7z/services/order_service.log",
    lines: [
      { ln: 412, text: "2026-09-23 10:14:04 INFO  [order_service] processing checkout for order_id=98721" },
      { ln: 413, text: "2026-09-23 10:14:05 ERROR [order_service] database query timeout occurred while locking row" },
      { ln: 414, text: "2026-09-23 10:14:05 ERROR [order_service] HTTP 500 returned: failed to commit transaction" },
      { ln: 415, text: "2026-09-23 10:14:07 WARN  [order_service] retrying failed connection to redis master" },
      { ln: 416, text: "2026-09-23 10:14:10 INFO  [order_service] auth token verified for user_id=44192" },
    ]
  }
];

function initDemoSimulator() {
  const input = document.getElementById("demo-input");
  const summary = document.getElementById("demo-summary");
  const resultsContainer = document.getElementById("demo-results");
  const presetButtons = document.querySelectorAll(".preset-btn");

  if (!input || !summary || !resultsContainer) return;

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderSearch() {
    const rawQuery = input.value.trim();

    // Parse pipeline terms: pattern1 | pattern2 (AND)
    const terms = rawQuery
      .split("|")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (terms.length === 0) {
      summary.textContent = "请输入关键词体验检索";
      resultsContainer.innerHTML = '<div class="demo-empty">请输入搜索词或点击上方快捷示例</div>';
      return;
    }

    let totalMatches = 0;
    let matchedFiles = 0;
    let html = "";

    SAMPLE_LOG_FILES.forEach(file => {
      const fileMatchedLines = [];

      file.lines.forEach(line => {
        const lineText = line.text;
        // Check if line satisfies ALL terms (logic AND)
        const isMatch = terms.every(term => {
          return lineText.toLowerCase().includes(term.toLowerCase());
        });

        if (isMatch) {
          totalMatches++;
          // Highlight terms
          let highlighted = escapeHtml(lineText);
          terms.forEach(term => {
            const regex = new RegExp(`(${escapeRegExp(escapeHtml(term))})`, "gi");
            highlighted = highlighted.replace(regex, "<mark>$1</mark>");
          });

          fileMatchedLines.push({
            ln: line.ln,
            html: highlighted,
            isMatch: true
          });
        }
      });

      if (fileMatchedLines.length > 0) {
        matchedFiles++;
        html += `<div class="log-file-header">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>${file.path}</span>
          <span style="margin-left: auto; color: #64748b; font-size: 11px;">${fileMatchedLines.length} 处命中</span>
        </div>`;

        fileMatchedLines.forEach(item => {
          html += `<div class="log-line matched">
            <span class="log-ln">${item.ln}</span>
            <span class="log-content">${item.html}</span>
          </div>`;
        });
      }
    });

    if (totalMatches === 0) {
      summary.textContent = `共搜索 2 个文件，0 处匹配 (耗时 1ms)`;
      resultsContainer.innerHTML = '<div class="demo-empty">未找到同时满足所有管道条件的日志行</div>';
    } else {
      summary.textContent = `在 ${matchedFiles} 个文件中找到 ${totalMatches} 处匹配 (耗时 2ms)`;
      resultsContainer.innerHTML = html;
    }
  }

  // Input event listener
  input.addEventListener("input", () => {
    // sync preset active state
    presetButtons.forEach(btn => {
      if (btn.getAttribute("data-query") === input.value.trim()) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    renderSearch();
  });

  // Preset buttons click
  presetButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      presetButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      input.value = btn.getAttribute("data-query");
      renderSearch();
    });
  });

  // Initial render
  renderSearch();
}
