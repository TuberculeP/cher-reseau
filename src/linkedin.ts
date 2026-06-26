import puppeteer from "puppeteer";

interface PostData {
  displayName: string;
  avatarBase64: string;
  content: string;
}

export async function renderLinkedInPost(data: PostData): Promise<Buffer> {
  const html = buildHtml(data);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 680, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "load" });

    const element = await page.$("#post-card");
    if (!element) throw new Error("Élément #post-card introuvable");

    const buffer = await element.screenshot({ type: "png" });
    return Buffer.from(buffer);
  } finally {
    await browser.close();
  }
}

function buildHtml({ displayName, avatarBase64, content }: PostData): string {
  const escapedContent = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #f3f2ef;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 16px;
    width: 680px;
  }
  #post-card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06);
    padding: 16px 16px 0 16px;
    width: 648px;
  }
  .header {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  .header-info {
    flex: 1;
  }
  .name-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .name {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0,0,0,0.9);
    line-height: 1.4;
  }
  .badge {
    font-size: 12px;
    color: rgba(0,0,0,0.6);
    font-weight: 400;
  }
  .meta {
    font-size: 12px;
    color: rgba(0,0,0,0.6);
    line-height: 1.4;
    margin-top: 1px;
  }
  .follow-btn {
    margin-left: auto;
    font-size: 14px;
    font-weight: 600;
    color: #0a66c2;
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    padding: 4px 0;
  }
  .content {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(0,0,0,0.9);
    margin-bottom: 16px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .divider {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin: 0 -16px;
  }
  .reactions-bar {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 4px 0;
  }
  .reaction-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: rgba(0,0,0,0.6);
    padding: 10px 4px;
    border-radius: 4px;
  }
  .reaction-btn svg {
    flex-shrink: 0;
  }
</style>
</head>
<body>
<div id="post-card">
  <div class="header">
    <img class="avatar" src="data:image/png;base64,${avatarBase64}" alt="">
    <div class="header-info">
      <div class="name-row">
        <span class="name">${escapeHtml(displayName)}</span>
        <span class="badge">• 1st</span>
      </div>
    </div>
    <button class="follow-btn">+ Suivre</button>
  </div>

  <div class="content"><span class="intro">Cher réseau,</span>
${escapedContent}</div>

  <div class="divider"></div>

  <div class="reactions-bar">
    <div class="reaction-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0a4 4 0 0 0 4-4V4a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7z"/>
      </svg>
      J'aime
    </div>
    <div class="reaction-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Commenter
    </div>
    <div class="reaction-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
      Republier
    </div>
    <div class="reaction-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Envoyer
    </div>
  </div>
</div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
