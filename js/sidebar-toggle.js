// 移动/平板（≤1024px）侧边栏抽屉：注入汉堡按钮 + 遮罩，页面无需改结构
// 各页面已存在 .sidebar / .sidebar.open 的 transform 样式，这里只补触发入口
(function () {
  var sidebar = document.getElementById('sidebar');
  if (!sidebar) return; // login / license-import 无侧边栏

  var MQ = '(max-width:1024px)';

  var style = document.createElement('style');
  style.textContent = [
    // 桌面端兜底：两个元素都不渲染，避免遮罩裸奔
    '.m-toggle,.m-backdrop{display:none}',
    '@media' + MQ + '{',
    '.m-backdrop{display:block;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:110;',
    '  opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s}',
    '.m-backdrop.open{opacity:1;visibility:visible}',
    // 侧栏提到遮罩之上
    '.sidebar{z-index:120;box-shadow:0 0 32px rgba(0,0,0,.35)}',
    '.m-toggle{display:flex;position:fixed;top:12px;left:12px;z-index:101;width:40px;height:40px;',
    '  align-items:center;justify-content:center;background:var(--surface);border:1px solid var(--border);',
    '  border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.08);color:var(--fg);cursor:pointer;padding:0}',
    '.m-toggle svg{width:20px;height:20px}',
    // 给固定按钮让位，标题不被压住
    '.content{padding-top:64px}',
    // 新建/编辑页底部固定操作栏：移动端侧栏不占位
    '.create-action-bar{left:0}',
    '}',
    // 801-1024px：页面原本仍显示侧栏，这里改为抽屉，避免与汉堡按钮并存
    '@media(min-width:801px) and (max-width:1024px){',
    // 抽屉是浮层不占内容宽度，宽度从 180 恢复到 240，避免底部用户名折行
    ':root{--sidebar-w:240px}',
    '.sidebar{transform:translateX(-100%)}',
    '.sidebar.open{transform:translateX(0)}',
    '.main-wrap{margin-left:0}',
    '.m-toggle{top:20px;left:20px}',
    '.content{padding-top:72px}',
    '}'
  ].join('');
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'm-toggle';
  btn.setAttribute('aria-label', '打开导航菜单');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line>' +
    '<line x1="3" y1="18" x2="21" y2="18"></line></svg>';

  var backdrop = document.createElement('div');
  backdrop.className = 'm-backdrop';

  document.body.appendChild(btn);
  document.body.appendChild(backdrop);

  function close() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
  }

  btn.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) { close(); return; }
    sidebar.classList.add('open');
    backdrop.classList.add('open');
  });
  backdrop.addEventListener('click', close);
  // 点导航项后自动收起，避免新页面还是抽屉打开态
  sidebar.addEventListener('click', function (e) {
    if (e.target.closest('.sidebar-item')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
  // 用 mql 的 change 事件而非 resize：change 在媒体查询求值后触发，不会读到滞后值
  window.matchMedia(MQ).addEventListener('change', function (e) {
    if (!e.matches) close();
  });
})();
