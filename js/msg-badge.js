/* 未读消息徽标：同标签页内跨页面同步；刷新页面即重置（演示用） */
(function () {
  var badge = document.getElementById('sidebarMsgBadge');
  if (!badge) return;

  var KEY = 'msgRead';
  // demo：刷新即恢复初始未读状态
  var navEntry = performance.getEntriesByType('navigation')[0];
  if (navEntry && navEntry.type === 'reload') sessionStorage.removeItem(KEY);

  function setRead(read) {
    badge.style.display = read ? 'none' : '';
    badge.textContent = read ? '0' : String(document.querySelectorAll('#msgList .msg-item').length);
  }

  function clearList() {
    var list = document.getElementById('msgList');
    if (list) list.innerHTML = '';
    var empty = document.getElementById('msgEmpty');
    if (empty) empty.style.display = '';
  }

  if (sessionStorage.getItem(KEY) === '1') {
    clearList();
    setRead(true);
  } else {
    setRead(false);
  }

  var clearBtn = document.getElementById('msgClearBtn');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    clearList();
    setRead(true);
    sessionStorage.setItem(KEY, '1');
  });
})();
