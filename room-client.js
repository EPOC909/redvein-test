(() => {
  const DECKS_STORAGE_KEY = 'redvein_saved_decks_v1';
  const ROOM_STORAGE_KEY = 'redvein_room_session_v1';
  const UNLOCK_SAVE_KEY_STORAGE_KEY = 'redvein_unlock_save_key_v1';
  const UNLOCK_TOKENS_STORAGE_KEY = 'redvein_unlock_tokens_v1';

  const displayNameInput = document.getElementById('roomDisplayNameInput');
  const roomDeckSelect = document.getElementById('roomDeckSelect');
  const createRoomButton = document.getElementById('createRoomButton');
  const roomIdInput = document.getElementById('roomIdInput');
  const joinRoomButton = document.getElementById('joinRoomButton');
  const spectateRoomButton = document.getElementById('spectateRoomButton');
  const copyInviteButton = document.getElementById('copyInviteButton');
  const roomStartGameButton = document.getElementById('roomStartGameButton');
  const roomStartHint = document.getElementById('roomStartHint');
  const roomConnectionBadge = document.getElementById('roomConnectionBadge');
  const currentRoleLabel = document.getElementById('currentRoleLabel');
  const currentRoomLabel = document.getElementById('currentRoomLabel');
  const currentRoomStateLabel = document.getElementById('currentRoomStateLabel');
  const currentSocketStateLabel = document.getElementById('currentSocketStateLabel');
  const roomP1Label = document.getElementById('roomP1Label');
  const roomP2Label = document.getElementById('roomP2Label');
  const roomSpectatorLabel = document.getElementById('roomSpectatorLabel');
  const inviteUrlBox = document.getElementById('inviteUrlBox');
  const roomLog = document.getElementById('roomLog');
  const legacyStartMatchButton = document.getElementById('startMatchButton');
  const reloadButton = document.getElementById('reloadButton');
  const legacyResetMatchButton = document.getElementById('resetMatchButton');
  const boardSetupGrid = document.querySelector('.match-setup-grid');
  const player1DeckSelect = document.getElementById('player1DeckSelect');
  const player2DeckSelect = document.getElementById('player2DeckSelect');
  const roomSection = document.querySelector('.room-section');
  const roomSectionHeader = roomSection?.querySelector('.room-section-header') || null;
  const roomStartBox = document.querySelector('.room-start-box');

  let roomHero = null;
  let roomHeroTitle = null;
  let roomHeroText = null;
  let roomHeroStep = null;
  let roomHeroRole = null;
  let roomHeroRoomId = null;
  let roomHeroState = null;
  let roomHeroArtwork = null;
  let roomHeroArtworkFrame = null;

  if (!displayNameInput || !roomDeckSelect || !createRoomButton) {
    return;
  }

  let socket = null;
  let currentRoomId = '';
  let currentRole = '';
  let reconnectToken = '';
  let currentDeckName = '';
  let currentRoomState = '';
  let currentBattlePlayer = '';
  let currentControlRequests = {
    rematch: { p1: false, p2: false },
    reset: { p1: false, p2: false },
  };
  let reconnectTimer = null;
  let manualReconnectInFlight = false;

  let roomActionBox = null;
  let roomActionStatus = null;
  let roomRematchButton = null;
  let roomResetButton = null;
  let roomSurrenderButton = null;
  let roomCloseButton = null;

  function loadSavedDecks() {
    roomDeckSelect.innerHTML = '<option value="">保存済みデッキを選択</option>';
    try {
      const raw = localStorage.getItem(DECKS_STORAGE_KEY);
      const decks = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(decks)) return;
      decks.forEach((deck) => {
        const option = document.createElement('option');
        option.value = deck.name || '';
        option.textContent = deck.name || '名前なしデッキ';
        roomDeckSelect.appendChild(option);
      });
    } catch (error) {
      console.error(error);
    }
  }

  function readSavedDecks() {
    try {
      const raw = localStorage.getItem(DECKS_STORAGE_KEY);
      const decks = raw ? JSON.parse(raw) : [];
      return Array.isArray(decks) ? decks : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function writeLog(message) {
    const line = `[${new Date().toLocaleTimeString('ja-JP')}] ${message}`;
    roomLog.textContent = roomLog.textContent ? `${line}
${roomLog.textContent}` : line;
  }

  function updateSocketState(text, online = false) {
    currentSocketStateLabel.textContent = text;
    roomConnectionBadge.textContent = text;
    roomConnectionBadge.classList.toggle('online', online);
    updateLobbyHero();
  }

  function normalizeRole(role) {
    if (role === 'p1') return 'P1';
    if (role === 'p2') return 'P2';
    if (role === 'spectator') return '観戦';
    return '-';
  }

  function normalizeRoomStateLabel(state) {
    if (state === 'ready') return '開始待ち';
    if (state === 'playing') return '対戦中';
    if (state === 'finished') return '試合終了';
    if (state === 'closed') return '終了';
    if (state === 'setup') return '配置中';
    return state || '待機中';
  }

  function installLobbyEnhancements() {
    if (!roomSection || !roomSectionHeader || roomHero) return;

    roomSection.querySelectorAll(':scope > .room-hero').forEach((node) => node.remove());

    roomHero = document.createElement('section');
    roomHero.className = 'room-hero card-subpanel';
    roomHero.innerHTML = `
      <div class="room-hero-grid">
        <div class="room-hero-copy">
          <div class="room-hero-eyebrow">PUBLIC LOBBY</div>
          <h3 id="roomHeroTitle">RED VEIN 公開ロビー</h3>
          <p id="roomHeroText">表示名とデッキを選んで、ルーム作成・参加・観戦から始められます。</p>
          <div class="room-hero-chip-row">
            <span class="room-hero-chip">URL共有で合流</span>
            <span class="room-hero-chip">P1 / P2 / 観戦対応</span>
            <span class="room-hero-chip">同じ盤面を同期表示</span>
            <span class="room-hero-chip">ロビーイラスト差し替え対応</span>
          </div>
        </div>
        <div class="room-hero-visual">
          <div class="room-hero-artwork-frame" id="roomHeroArtworkFrame">
            <div class="room-hero-artwork-placeholder">LOBBY ART</div>
            <img id="roomHeroArtwork" class="room-hero-artwork hidden" alt="RED VEIN ロビーイラスト" />
          </div>
        </div>
        <div class="room-hero-status">
          <div class="room-hero-status-card">
            <span>いまの立場</span>
            <strong id="roomHeroRole">-</strong>
          </div>
          <div class="room-hero-status-card">
            <span>ルームID</span>
            <strong id="roomHeroRoomId">-</strong>
          </div>
          <div class="room-hero-status-card">
            <span>状態</span>
            <strong id="roomHeroState">待機中</strong>
          </div>
        </div>
      </div>
      <div class="room-hero-step-row">
        <div class="room-hero-step" id="roomHeroStep">① 名前とデッキを選ぶ → ② ルームを作る / 入る → ③ P1 が試合開始</div>
      </div>
    `;
    roomSectionHeader.insertAdjacentElement('afterend', roomHero);

    roomHeroTitle = roomHero.querySelector('#roomHeroTitle');
    roomHeroText = roomHero.querySelector('#roomHeroText');
    roomHeroStep = roomHero.querySelector('#roomHeroStep');
    roomHeroRole = roomHero.querySelector('#roomHeroRole');
    roomHeroRoomId = roomHero.querySelector('#roomHeroRoomId');
    roomHeroState = roomHero.querySelector('#roomHeroState');
    roomHeroArtwork = roomHero.querySelector('#roomHeroArtwork');
    roomHeroArtworkFrame = roomHero.querySelector('#roomHeroArtworkFrame');

    roomSection.classList.add('room-section-enhanced');
    ensureLobbyArtwork();
    roomSection.querySelectorAll('.room-box, .room-status-box').forEach((box) => box.classList.add('room-lobby-card'));
  }


  function ensureLobbyArtwork() {
    if (!roomHeroArtwork || roomHeroArtwork.dataset.bound === 'true') return;
    roomHeroArtwork.dataset.bound = 'true';
    roomHeroArtwork.addEventListener('load', () => {
      roomHeroArtwork.classList.remove('hidden');
      roomHeroArtworkFrame?.classList.add('has-artwork');
    });
    roomHeroArtwork.addEventListener('error', () => {
      roomHeroArtwork.classList.add('hidden');
      roomHeroArtworkFrame?.classList.remove('has-artwork');
    });

    const candidates = [
      'assets/ui/lobby-hero.webp',
      'assets/ui/lobby-hero.png',
      'assets/ui/lobby-hero.jpg',
      'assets/ui/lobby-hero.jpeg',
    ];

    const tryLoad = (index = 0) => {
      if (!roomHeroArtwork || index >= candidates.length) {
        roomHeroArtworkFrame?.classList.remove('has-artwork');
        return;
      }
      const candidate = candidates[index];
      const probe = new Image();
      probe.onload = () => {
        if (!roomHeroArtwork) return;
        roomHeroArtwork.src = `${candidate}?v=${Date.now()}`;
      };
      probe.onerror = () => tryLoad(index + 1);
      probe.src = `${candidate}?check=${Date.now()}`;
    };

    tryLoad(0);
  }

  function updateLobbyHero() {
    if (!roomSection) return;
    installLobbyEnhancements();

    const connected = !!socket && socket.readyState === WebSocket.OPEN;
    const roleLabel = normalizeRole(currentRole);
    const stateLabel = normalizeRoomStateLabel(currentRoomState);

    roomSection.dataset.socketState = connected ? 'online' : 'offline';
    roomSection.dataset.roomState = currentRoomState || 'idle';
    roomSection.dataset.roomRole = currentRole || 'none';
    roomStartBox?.classList.toggle('ready-to-start', connected && currentRole === 'p1' && currentRoomState === 'ready');

    if (roomHeroRole) roomHeroRole.textContent = roleLabel;
    if (roomHeroRoomId) roomHeroRoomId.textContent = currentRoomId || '-';
    if (roomHeroState) roomHeroState.textContent = stateLabel;

    if (!roomHeroTitle || !roomHeroText || !roomHeroStep) return;

    if (currentRoomState === 'playing') {
      roomHeroTitle.textContent = roleLabel === '観戦' ? '対戦観戦中' : `${roleLabel} で対戦中`;
      roomHeroText.textContent = roleLabel === '観戦'
        ? '今は観戦ビューです。盤面・ログ・スコアを見ながら試合の流れを追えます。'
        : '対戦中です。再読み込み・戻る・タブを閉じる操作はしないでください。';
      roomHeroStep.textContent = roleLabel === '観戦'
        ? '観戦中：手番表示・ログ・盤面演出を見ながら試合を追えます。'
        : '対戦中：アイテム → 移動 → 攻撃 → 手番終了の順に進行します。';
      return;
    }

    if (currentRoomState === 'ready') {
      roomHeroTitle.textContent = currentRole === 'p1' ? '開始準備完了' : 'まもなく試合開始';
      roomHeroText.textContent = currentRole === 'p1'
        ? 'P1 と P2 が揃っています。準備ができたら「ルーム対戦を開始」を押してください。'
        : 'P1 が開始すると試合が始まります。今のうちにルールと盤面を確認しておきましょう。';
      roomHeroStep.textContent = '準備完了：P1 が試合開始 → 配置フェーズ → 本戦へ進みます。';
      return;
    }

    if (currentRoomId) {
      roomHeroTitle.textContent = `${currentRoomId} に接続中`;
      roomHeroText.textContent = currentRole === 'spectator'
        ? '観戦者として接続しています。試合開始後は共有盤面が自動で切り替わります。'
        : `${roleLabel} として接続しています。相手が揃うと試合を開始できます。`;
      roomHeroStep.textContent = currentRole === 'p1'
        ? '次の手順：P2 が参加したら「ルーム対戦を開始」を押せます。'
        : '次の手順：P1 と P2 が揃うと、P1 が試合開始できます。';
      return;
    }

    roomHeroTitle.textContent = 'RED VEIN 公開ロビー';
    roomHeroText.textContent = '表示名とデッキを選んで、ルーム作成・参加・観戦から始められます。';
    roomHeroStep.textContent = '① 名前とデッキを選ぶ → ② ルームを作る / 入る → ③ P1 が試合開始';
  }

  function setMemberLabel(el, slot) {
    if (!slot) {
      el.textContent = '空き';
      return;
    }
    const name = slot.displayName || '未設定';
    const deck = slot.deckName ? ` / ${slot.deckName}` : '';
    const status = slot.connected ? '接続中' : '切断中';
    el.textContent = `${name}${deck} (${status})`;
  }

  function ensureRoomActionPanel() {
    if (roomActionBox) return;
    const anchor = document.querySelector('.room-start-box')?.parentElement || document.querySelector('.room-controls-panel');
    if (!anchor) return;

    roomActionBox = document.createElement('section');
    roomActionBox.className = 'room-status-box card-subpanel room-action-box';
    roomActionBox.innerHTML = `
      <h3>試合操作</h3>
      <div class="room-action-buttons">
        <button type="button" class="button primary" data-room-action="rematch" style="display:none" aria-hidden="true" tabindex="-1">再戦を申請（相手の承認が必要）</button>
        <button type="button" class="button secondary" data-room-action="reset" style="display:none" aria-hidden="true" tabindex="-1">リセットを申請（相手の承認が必要）</button>
        <button type="button" class="button secondary danger" data-room-action="surrender">降参する</button>
        <button type="button" class="button secondary danger" data-room-action="close">ルーム終了</button>
      </div>
      <div class="room-action-status" id="roomActionStatus">降参は対戦中のプレイヤー本人だけ実行できます。ルーム終了は P1 のみです。</div>
    `;
    anchor.appendChild(roomActionBox);

    roomActionStatus = roomActionBox.querySelector('#roomActionStatus');
    roomRematchButton = roomActionBox.querySelector('[data-room-action="rematch"]');
    roomResetButton = roomActionBox.querySelector('[data-room-action="reset"]');
    roomSurrenderButton = roomActionBox.querySelector('[data-room-action="surrender"]');
    roomCloseButton = roomActionBox.querySelector('[data-room-action="close"]');

    roomRematchButton?.addEventListener('click', requestRematchToggle);
    roomResetButton?.addEventListener('click', requestResetToggle);
    roomSurrenderButton?.addEventListener('click', requestSurrender);
    roomCloseButton?.addEventListener('click', closeCurrentRoom);
  }

  function summarizeApproval(request) {
    const p1 = request?.p1 ? 'P1承認済み' : 'P1待ち';
    const p2 = request?.p2 ? 'P2承認済み' : 'P2待ち';
    return `${p1} / ${p2}`;
  }

  function updateRoomActionUi() {
    ensureRoomActionPanel();
    if (!roomActionBox || !roomActionStatus || !roomRematchButton || !roomResetButton || !roomSurrenderButton || !roomCloseButton) return;

    const isPlayer = currentRole === 'p1' || currentRole === 'p2';
    const isP1 = currentRole === 'p1';
    const connected = socket && socket.readyState === WebSocket.OPEN;
    const hasRoom = !!currentRoomId;
    const canRematch = hasRoom && connected && isPlayer && currentRoomState === 'finished';
    const canReset = hasRoom && connected && isPlayer && (currentRoomState === 'playing' || currentRoomState === 'finished');
    const canSurrender = hasRoom && connected && isPlayer && currentRoomState === 'playing';
    const canClose = hasRoom && connected && isP1;
    const myRole = currentRole === 'p1' || currentRole === 'p2' ? currentRole : '';
    const myRematch = myRole ? !!currentControlRequests.rematch?.[myRole] : false;
    const myReset = myRole ? !!currentControlRequests.reset?.[myRole] : false;

    roomRematchButton.disabled = !canRematch;
    roomResetButton.disabled = !canReset;
    roomSurrenderButton.disabled = !canSurrender;
    roomCloseButton.disabled = !canClose;

    roomRematchButton.textContent = myRematch ? '再戦申請を取り消す' : '再戦を申請（相手の承認が必要）';
    roomResetButton.textContent = myReset ? 'リセット申請を取り消す' : 'リセットを申請（相手の承認が必要）';
    roomRematchButton.style.display = 'none';
    roomResetButton.style.display = 'none';
    roomSurrenderButton.textContent = '降参する';

    roomActionBox.classList.toggle('match-finished', currentRoomState === 'finished');
    roomActionBox.classList.toggle('match-playing', currentRoomState === 'playing');
    roomActionBox.classList.toggle('match-ready', currentRoomState === 'ready');

    if (!hasRoom) {
      roomActionStatus.textContent = '先にルームを作成または参加してください。';
      return;
    }
    if (currentRole === 'spectator') {
      roomActionStatus.textContent = '観戦者は試合操作できません。降参は対戦中のプレイヤー本人だけ、ルーム終了は P1 のみ実行できます。';
      return;
    }
    if (currentRoomState === 'finished') {
      roomActionStatus.textContent = `試合終了後です。降参は使えません。ルーム終了は P1 のみ実行できます。`;
      return;
    }
    if (currentRoomState === 'playing') {
      roomActionStatus.textContent = `対戦中です。降参はプレイヤー本人だけが即時実行できます。ルーム終了は P1 のみです。`;
      return;
    }
    if (currentRoomState === 'ready') {
      roomActionStatus.textContent = '試合開始前です。ルーム終了は P1 のみです。';
      return;
    }
    roomActionStatus.textContent = '降参は対戦中のプレイヤー本人だけが実行できます。ルーム終了は P1 のみです。';
  }

  async function sendRoomActionRequest(action, requested = true) {
    if (!currentRoomId) {
      writeLog('先にルームへ入ってください。');
      return;
    }
    try {
      await ensureSocket();
      sendMessage({
        type: 'room_action_request',
        roomId: currentRoomId,
        action,
        requested,
      });
    } catch (error) {
      console.error(error);
      writeLog('接続に失敗しました。');
    }
  }

  function requestRematchToggle() {
    const myRole = currentRole === 'p1' || currentRole === 'p2' ? currentRole : '';
    if (!myRole) {
      writeLog('観戦者は再戦申請できません。');
      return;
    }
    const requested = !currentControlRequests.rematch?.[myRole];
    writeLog(requested ? '再戦を申請しました。相手も承認すると同じルームで再戦が始まります。' : '再戦申請を取り消しました。');
    sendRoomActionRequest('rematch', requested);
  }

  function requestResetToggle() {
    const myRole = currentRole === 'p1' || currentRole === 'p2' ? currentRole : '';
    if (!myRole) {
      writeLog('観戦者はリセット申請できません。');
      return;
    }
    const requested = !currentControlRequests.reset?.[myRole];
    writeLog(requested ? 'リセットを申請しました。相手も承認すると盤面が最初からやり直しになります。' : 'リセット申請を取り消しました。');
    sendRoomActionRequest('reset', requested);
  }

  function requestSurrender() {
    const myRole = currentRole === 'p1' || currentRole === 'p2' ? currentRole : '';
    if (!myRole) {
      writeLog('観戦者は降参できません。');
      return;
    }
    if (currentRoomState !== 'playing') {
      writeLog('降参は対戦中だけ実行できます。');
      return;
    }
    const ok = confirm('この試合を降参します。押した側の敗北で即終了します。よろしいですか？');
    if (!ok) return;
    writeLog('降参を送信しました。');
    sendRoomActionRequest('surrender', true);
  }

  function leaveClosedRoomLocally(message) {
    const api = window.REDVEIN_ROOM_API;
    currentRoomId = '';
    currentRole = '';
    reconnectToken = '';
    currentDeckName = '';
    currentRoomState = '';
    currentBattlePlayer = '';
    currentControlRequests = {
      rematch: { p1: false, p2: false },
      reset: { p1: false, p2: false },
    };
    currentRoomLabel.textContent = '-';
    currentRoleLabel.textContent = '-';
    currentRoomStateLabel.textContent = '-';
    roomIdInput.value = '';
    setMemberLabel(roomP1Label, null);
    setMemberLabel(roomP2Label, null);
    setMemberLabel(roomSpectatorLabel, null);
    updateInviteUrl();
    updateStartUi();
    updateRoomActionUi();
    updateLobbyHero();
    localStorage.removeItem(ROOM_STORAGE_KEY);
    if (api && typeof api.resetTestMatch === 'function') {
      api.resetTestMatch();
    }
    if (api && typeof api.setRoomSyncConfig === 'function') {
      api.setRoomSyncConfig({ enabled: false, role: '', battleControlsEnabled: false });
    }
    if (message) writeLog(message);
  }

  function closeCurrentRoom() {
    if (currentRole !== 'p1') {
      writeLog('ルーム終了は P1 だけが実行できます。');
      return;
    }
    const ok = confirm('このルームを終了します。P2 と観戦者もルームから外れます。よろしいですか？');
    if (!ok) return;
    sendRoomActionRequest('close_room', true);
  }

  function updateInviteUrl() {
    if (!currentRoomId) {
      inviteUrlBox.textContent = '-';
      return;
    }
    inviteUrlBox.textContent = `${location.origin}${location.pathname}?room=${currentRoomId}`;
  }

  function saveSession() {
    const payload = {
      roomId: currentRoomId,
      role: currentRole,
      reconnectToken,
      displayName: displayNameInput.value.trim(),
      deckName: currentDeckName,
    };
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(payload));
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(ROOM_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function updateLegacyBoardUi(playing = false) {
    legacyStartMatchButton?.classList.add('public-room-legacy-hidden');
    legacyResetMatchButton?.classList.add('public-room-legacy-hidden');
    reloadButton?.classList.add('public-room-legacy-hidden');
    boardSetupGrid?.classList.add('board-setup-locked');
    if (player1DeckSelect) {
      player1DeckSelect.disabled = true;
      if (player1DeckSelect.options.length) player1DeckSelect.options[0].textContent = 'ルーム開始時に自動反映';
    }
    if (player2DeckSelect) {
      player2DeckSelect.disabled = true;
      if (player2DeckSelect.options.length) player2DeckSelect.options[0].textContent = 'ルーム開始時に自動反映';
    }
    if (!playing) return;
    legacyStartMatchButton?.classList.add('public-room-legacy-hidden');
    legacyResetMatchButton?.classList.add('public-room-legacy-hidden');
    reloadButton?.classList.add('public-room-legacy-hidden');
  }

  function updateStartUi(data = {}) {
    if (!roomStartGameButton || !roomStartHint) return;
    const connected = socket && socket.readyState === WebSocket.OPEN;
    const isP1 = currentRole === 'p1';
    const ready = currentRoomState === 'ready';
    const playing = currentRoomState === 'playing';
    const p1Exists = Boolean(data.p1 || roomP1Label.textContent !== '空き');
    const p2Exists = Boolean(data.p2 || roomP2Label.textContent !== '空き');

    roomStartGameButton.disabled = !connected || !isP1 || !ready || !p1Exists || !p2Exists;
    roomStartHint.classList.toggle('is-warning', ready || playing);
    roomStartBox?.classList.toggle('ready-to-start', !roomStartGameButton.disabled);

    if (playing) {
      roomStartHint.textContent = '試合中です。再読み込み・戻る・タブを閉じる操作はしないでください。';
    } else if (!connected) {
      roomStartHint.textContent = '先にルームへ接続してください。';
    } else if (currentRole === 'spectator') {
      roomStartHint.textContent = '観戦者は試合開始できません。';
    } else if (!isP1) {
      roomStartHint.textContent = 'P1 のみが試合開始できます。';
    } else if (!ready) {
      roomStartHint.textContent = 'P1 と P2 が揃うと試合開始できます。';
    } else {
      roomStartHint.textContent = '準備完了です。開始後は再読み込み・戻る禁止です。P1 が「ルーム対戦を開始」を押してください。';
    }
  }

  function applyRoomSnapshot(data) {
    currentRoomId = data.roomId || currentRoomId;
    currentRole = data.role || currentRole;
    currentRoomState = data.roomState || currentRoomState;
    currentControlRequests = data.controlRequests || currentControlRequests;
    currentRoomLabel.textContent = currentRoomId || '-';
    currentRoleLabel.textContent = normalizeRole(currentRole);
    currentRoomStateLabel.textContent = currentRoomState || '-';
    setMemberLabel(roomP1Label, data.p1);
    setMemberLabel(roomP2Label, data.p2);
    setMemberLabel(roomSpectatorLabel, data.spectator);
    updateInviteUrl();
    roomIdInput.value = currentRoomId || roomIdInput.value;
    updateStartUi(data);
    updateRoomActionUi();
    updateLobbyHero();
    configureRoomSync();
    saveSession();
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  async function tryReconnectSilently() {
    const saved = readSession();
    if (!saved || !saved.roomId || !saved.reconnectToken) return;
    if (manualReconnectInFlight) return;
    manualReconnectInFlight = true;
    try {
      await ensureSocket();
      sendMessage({
        type: 'reconnect_room',
        roomId: saved.roomId,
        reconnectToken: saved.reconnectToken,
      });
      writeLog(`切断を検知したため、ルーム ${saved.roomId} への自動復帰を試しています。`);
    } catch (error) {
      console.error(error);
    } finally {
      manualReconnectInFlight = false;
    }
  }

  function scheduleReconnectAttempt() {
    const saved = readSession();
    if (!saved || !saved.roomId || !saved.reconnectToken) return;
    clearReconnectTimer();
    reconnectTimer = setTimeout(() => {
      tryReconnectSilently();
    }, 1500);
  }

  function ensureSocket() {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        resolve(socket);
        return;
      }

      const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
      socket = new WebSocket(`${protocol}${location.host}`);
      updateSocketState('接続中...', false);

      socket.addEventListener('open', () => {
        clearReconnectTimer();
        updateSocketState('接続済み', true);
        updateStartUi();
        resolve(socket);
      }, { once: true });

      socket.addEventListener('error', (error) => {
        updateSocketState('接続失敗', false);
        updateStartUi();
        reject(error);
      }, { once: true });

      socket.addEventListener('close', () => {
        socket = null;
        updateSocketState('切断', false);
        updateStartUi();
        scheduleReconnectAttempt();
      });

      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          handleServerMessage(data);
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  function sendMessage(payload) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      writeLog('サーバーに接続できていません。');
      return;
    }
    socket.send(JSON.stringify(payload));
  }

  function currentRoleToPlayerKey() {
    if (currentRole === 'p1') return 'player1';
    if (currentRole === 'p2') return 'player2';
    return '';
  }

  function syncPublicStateIfActor(actionPlayerKey) {
    const api = window.REDVEIN_ROOM_API;
    const localPlayerKey = currentRoleToPlayerKey();
    if (!api || typeof api.exportRoomSyncSnapshot !== 'function') return;
    if (!currentRoomId || !actionPlayerKey || localPlayerKey !== actionPlayerKey) return;
    sendMessage({
      type: 'sync_public_state',
      roomId: currentRoomId,
      snapshot: api.exportRoomSyncSnapshot(),
    });
  }

  function readUnlockAuthPayload() {
    const apiPayload = window.REDVEIN_ROOM_API && typeof window.REDVEIN_ROOM_API.getUnlockAuthPayload === 'function'
      ? window.REDVEIN_ROOM_API.getUnlockAuthPayload()
      : null;
    if (apiPayload && typeof apiPayload === 'object') {
      return {
        saveKey: String(apiPayload.saveKey || '').trim(),
        unlockTokens: Array.isArray(apiPayload.unlockTokens) ? apiPayload.unlockTokens.map(String).filter(Boolean) : [],
      };
    }
    let unlockTokens = [];
    try {
      const raw = localStorage.getItem(UNLOCK_TOKENS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      unlockTokens = Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch (error) {
      console.error(error);
    }
    return {
      saveKey: String(localStorage.getItem(UNLOCK_SAVE_KEY_STORAGE_KEY) || '').trim(),
      unlockTokens,
    };
  }

  function getDisplayName() {
    return displayNameInput.value.trim() || '名無しプレイヤー';
  }

  function getDeckName() {
    return roomDeckSelect.value || '';
  }

  function getSelectedDeckPayload(required = true) {
    const deckName = getDeckName();
    if (!deckName) {
      if (required) writeLog('先に保存済みデッキを選んでください。');
      return null;
    }
    const deck = readSavedDecks().find((item) => item.name === deckName);
    if (!deck) {
      if (required) writeLog('選択したデッキが見つかりません。');
      return null;
    }
    const payload = {
      name: String(deck.name || '').trim(),
      battle: Array.isArray(deck.battle) ? [...deck.battle] : [],
      item: Array.isArray(deck.item) ? [...deck.item] : [],
      field: Array.isArray(deck.field) ? [...deck.field] : [],
    };
    if (required && (payload.battle.length !== 5 || payload.item.length !== 4 || payload.field.length !== 1)) {
      writeLog('デッキは バトル5 / アイテム4 / 環境1 ちょうどで保存してください。');
      return null;
    }
    return payload;
  }

  function getBattleControlsEnabled() {
    const rolePlayer = currentRole === 'p1' ? 'player1' : currentRole === 'p2' ? 'player2' : '';
    return !!rolePlayer && currentRoomState === 'playing' && currentBattlePlayer === rolePlayer;
  }

  function configureRoomSync() {
    const api = window.REDVEIN_ROOM_API;
    if (!api || typeof api.setRoomSyncConfig !== 'function') return;
    api.setRoomSyncConfig({
      enabled: !!currentRoomId,
      role: currentRole,
      battleControlsEnabled: getBattleControlsEnabled(),
      onSetupPlaceRequest: ({ player, cardId, targetIndex }) => {
        sendMessage({
          type: 'place_setup_unit',
          roomId: currentRoomId,
          player,
          cardId,
          targetIndex,
        });
      },
      onMoveRequest: ({ player, unitId, sourceIndex, targetIndex }) => {
        sendMessage({
          type: 'move_unit',
          roomId: currentRoomId,
          player,
          unitId,
          sourceIndex,
          targetIndex,
        });
      },
      onAttackRequest: ({ player, unitId, sourceIndex, targetIndex }) => {
        sendMessage({
          type: 'attack_unit',
          roomId: currentRoomId,
          player,
          unitId,
          sourceIndex,
          targetIndex,
        });
      },
      onItemUseRequest: ({ player, cardId, targetIndex }) => {
        sendMessage({
          type: 'use_item',
          roomId: currentRoomId,
          player,
          cardId,
          targetIndex,
        });
      },
      onFinishItemPhaseRequest: ({ player }) => {
        sendMessage({
          type: 'finish_item_phase',
          roomId: currentRoomId,
          player,
        });
      },
      onEndTurnRequest: ({ player }) => {
        sendMessage({
          type: 'end_turn',
          roomId: currentRoomId,
          player,
        });
      },
    });
  }

  function handleGameStarted(data) {
    currentRoomState = data.roomState || 'playing';
    currentBattlePlayer = data.currentPlayer || 'player1';
    currentControlRequests = {
      rematch: { p1: false, p2: false },
      reset: { p1: false, p2: false },
    };
    currentRoomStateLabel.textContent = currentRoomState;
    updateStartUi();
    updateRoomActionUi();
    updateLegacyBoardUi(true);
    const api = window.REDVEIN_ROOM_API;
    if (!api || typeof api.startMatchFromDeckData !== 'function') {
      writeLog('盤面開始APIが見つかりません。');
      return;
    }
    if (typeof api.importRoomDeckCards === 'function' && Array.isArray(data.deckCards) && data.deckCards.length) {
      api.importRoomDeckCards(data.deckCards);
    }
    configureRoomSync();
    const ok = api.startMatchFromDeckData(data.p1Deck, data.p2Deck, 'ルーム対戦');
    if (ok) {
      const placements = Array.isArray(data.placements) ? data.placements : [];
      placements.forEach((placement) => {
        if (typeof api.applyRoomSetupPlacement === 'function') {
          api.applyRoomSetupPlacement(placement);
        }
      });
      writeLog('ルーム対戦を開始しました。配置フェーズはサーバー同期です。');
      document.querySelector('.board-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleServerMessage(data) {
    if (data.type === 'room_joined') {
      clearReconnectTimer();
      reconnectToken = data.reconnectToken || reconnectToken;
      currentRole = data.role || currentRole;
      currentDeckName = data.deckName || currentDeckName;
      applyRoomSnapshot(data);
      writeLog(`${normalizeRole(currentRole)} としてルーム ${data.roomId} に入りました。`);
      if (data.game) {
        handleGameStarted(data.game);
      }
      return;
    }

    if (data.type === 'room_snapshot') {
      applyRoomSnapshot(data);
      return;
    }

    if (data.type === 'game_started') {
      handleGameStarted(data);
      return;
    }

    if (data.type === 'setup_unit_placed') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (data.phase === 'battle') {
        currentRoomState = 'playing';
        currentRoomStateLabel.textContent = currentRoomState;
      }
      if (api && typeof api.applyRoomSetupPlacement === 'function') {
        api.applyRoomSetupPlacement(data);
      }
      syncPublicStateIfActor(data.player);
      configureRoomSync();
      return;
    }

    if (data.type === 'move_applied') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomMove === 'function') {
        api.applyRoomMove(data);
      }
      syncPublicStateIfActor(data.player);
      configureRoomSync();
      return;
    }

    if (data.type === 'attack_applied') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomAttack === 'function') {
        api.applyRoomAttack(data);
      }
      syncPublicStateIfActor(data.player);
      configureRoomSync();
      return;
    }

    if (data.type === 'item_used') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomItemUse === 'function') {
        api.applyRoomItemUse(data);
      }
      syncPublicStateIfActor(data.player);
      configureRoomSync();
      return;
    }

    if (data.type === 'item_phase_finished') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomFinishItemPhase === 'function') {
        api.applyRoomFinishItemPhase(data);
      }
      syncPublicStateIfActor(data.player);
      configureRoomSync();
      return;
    }

    if (data.type === 'turn_ended') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomEndTurn === 'function') {
        api.applyRoomEndTurn(data);
      }
      syncPublicStateIfActor(data.previousPlayer);
      configureRoomSync();
      return;
    }

    if (data.type === 'battle_state_synced') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      if (api && typeof api.applyRoomStateSync === 'function') {
        api.applyRoomStateSync(data);
      }
      configureRoomSync();
      return;
    }

    if (data.type === 'game_finished') {
      const api = window.REDVEIN_ROOM_API;
      currentBattlePlayer = data.currentPlayer || currentBattlePlayer;
      currentRoomState = 'finished';
      currentRoomStateLabel.textContent = currentRoomState;
      updateRoomActionUi();
      updateLobbyHero();
      if (api && typeof api.applyRoomGameFinished === 'function') {
        api.applyRoomGameFinished(data);
      } else if (api && typeof api.applyRoomStateSync === 'function') {
        api.applyRoomStateSync({
          phase: 'finished',
          winner: data.message || '',
          currentPlayer: data.currentPlayer || currentBattlePlayer,
          round: data.round,
        });
      }
      configureRoomSync();
      return;
    }

    if (data.type === 'room_closed') {
      leaveClosedRoomLocally(data.message || 'ルームが終了しました。');
      return;
    }

    if (data.type === 'server_notice') {
      writeLog(data.message || 'サーバー通知');
      return;
    }

    if (data.type === 'error') {
      const api = window.REDVEIN_ROOM_API;
      if (api && typeof api.notifyRoomRequestError === 'function') {
        api.notifyRoomRequestError();
      }
      writeLog(`エラー: ${data.message || '不明なエラー'}`);
      return;
    }

    if (data.type === 'error') {
      writeLog(`エラー: ${data.message || '不明なエラー'}`);
      updateRoomActionUi();
    }
  }

  async function createRoom() {
    const deckPayload = getSelectedDeckPayload(true);
    if (!deckPayload) return;
    try {
      currentDeckName = deckPayload.name;
      await ensureSocket();
      const unlockAuth = readUnlockAuthPayload();
      sendMessage({
        type: 'create_room',
        displayName: getDisplayName(),
        deckName: currentDeckName,
        deckPayload,
        saveKey: unlockAuth.saveKey,
        unlockTokens: unlockAuth.unlockTokens,
      });
    } catch (error) {
      console.error(error);
      writeLog('接続に失敗しました。');
    }
  }

  async function joinRoom(joinType) {
    const roomId = roomIdInput.value.trim().toUpperCase();
    if (!roomId) {
      writeLog('先にルームIDを入れてください。');
      return;
    }
    const isSpectator = joinType === 'spectator';
    const deckPayload = isSpectator ? null : getSelectedDeckPayload(true);
    if (!isSpectator && !deckPayload) return;
    try {
      currentDeckName = deckPayload?.name || '';
      await ensureSocket();
      const unlockAuth = readUnlockAuthPayload();
      sendMessage({
        type: isSpectator ? 'spectate_room' : 'join_room',
        roomId,
        displayName: getDisplayName(),
        deckName: deckPayload?.name || '',
        deckPayload,
        saveKey: unlockAuth.saveKey,
        unlockTokens: unlockAuth.unlockTokens,
      });
    } catch (error) {
      console.error(error);
      writeLog('接続に失敗しました。');
    }
  }

  async function reconnectIfPossible() {
    const params = new URLSearchParams(location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl) {
      roomIdInput.value = roomFromUrl.toUpperCase();
    }

    const saved = readSession();
    if (!saved || !saved.roomId || !saved.reconnectToken) {
      return;
    }
    if (roomFromUrl && saved.roomId !== roomFromUrl.toUpperCase()) {
      return;
    }

    displayNameInput.value = saved.displayName || '';
    currentDeckName = saved.deckName || '';
    if (currentDeckName) {
      roomDeckSelect.value = currentDeckName;
    }

    try {
      await ensureSocket();
      sendMessage({
        type: 'reconnect_room',
        roomId: saved.roomId,
        reconnectToken: saved.reconnectToken,
      });
      writeLog(`前回のルーム ${saved.roomId} へ復帰を試しています。`);
    } catch (error) {
      console.error(error);
    }
  }

  async function copyInviteUrl() {
    const roomId = roomIdInput.value.trim().toUpperCase() || currentRoomId;
    if (!roomId) {
      writeLog('先にルームを作るか、ルームIDを入れてください。');
      return;
    }
    const url = `${location.origin}${location.pathname}?room=${roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      inviteUrlBox.textContent = url;
      writeLog('招待URLをコピーしました。');
    } catch (error) {
      console.error(error);
      inviteUrlBox.textContent = url;
      writeLog('コピーに失敗しました。URLを手動でコピーしてください。');
    }
  }

  function shouldWarnBeforeLeave() {
    return currentRoomState === 'playing';
  }

  function showNoReloadMessage() {
    alert('試合中は再読み込み・戻る・タブを閉じる操作をしないでください。\n進行不能になる場合があります。');
  }

  async function startRoomGame() {
    if (currentRole !== 'p1') {
      writeLog('P1 だけが試合開始できます。');
      return;
    }
    if (!currentRoomId) {
      writeLog('先にルームへ入ってください。');
      return;
    }
    const ok = confirm('試合開始後は、再読み込み・戻る・タブを閉じる操作をしないでください。\nこのままルーム対戦を開始しますか？');
    if (!ok) return;
    try {
      await ensureSocket();
      sendMessage({ type: 'start_game', roomId: currentRoomId });
    } catch (error) {
      console.error(error);
      writeLog('接続に失敗しました。');
    }
  }

  loadSavedDecks();
  const lastName = localStorage.getItem('redvein_room_display_name_v1');
  if (lastName) displayNameInput.value = lastName;

  displayNameInput.addEventListener('change', () => {
    localStorage.setItem('redvein_room_display_name_v1', displayNameInput.value.trim());
  });

  createRoomButton.addEventListener('click', createRoom);
  joinRoomButton.addEventListener('click', () => joinRoom('player'));
  spectateRoomButton.addEventListener('click', () => joinRoom('spectator'));
  copyInviteButton.addEventListener('click', copyInviteUrl);
  roomStartGameButton?.addEventListener('click', startRoomGame);

  window.addEventListener('beforeunload', (event) => {
    saveSession();
    if (shouldWarnBeforeLeave()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  window.addEventListener('keydown', (event) => {
    if (!shouldWarnBeforeLeave()) return;
    const key = (event.key || '').toLowerCase();
    const isReload = key === 'f5' || ((event.ctrlKey || event.metaKey) && key === 'r');
    if (!isReload) return;
    event.preventDefault();
    showNoReloadMessage();
  });

  window.addEventListener('popstate', () => {
    if (!shouldWarnBeforeLeave()) return;
    history.pushState({ redveinLock: true }, '', location.href);
    showNoReloadMessage();
  });

  history.pushState({ redveinLock: true }, '', location.href);

  ensureRoomActionPanel();
  updateLegacyBoardUi(false);
  updateStartUi();
  updateRoomActionUi();
  configureRoomSync();
  reconnectIfPossible();
})();
