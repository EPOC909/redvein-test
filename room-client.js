(() => {
  const DECKS_STORAGE_KEY = 'redvein_saved_decks_v1';
  const ROOM_STORAGE_KEY = 'redvein_room_session_v1';

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
  let reconnectTimer = null;
  let manualReconnectInFlight = false;

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
  }

  function normalizeRole(role) {
    if (role === 'p1') return 'P1';
    if (role === 'p2') return 'P2';
    if (role === 'spectator') return '観戦';
    return '-';
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
    currentRoomLabel.textContent = currentRoomId || '-';
    currentRoleLabel.textContent = normalizeRole(currentRole);
    currentRoomStateLabel.textContent = currentRoomState || '-';
    setMemberLabel(roomP1Label, data.p1);
    setMemberLabel(roomP2Label, data.p2);
    setMemberLabel(roomSpectatorLabel, data.spectator);
    updateInviteUrl();
    roomIdInput.value = currentRoomId || roomIdInput.value;
    updateStartUi(data);
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
    currentRoomStateLabel.textContent = currentRoomState;
    updateStartUi();
    updateLegacyBoardUi(true);
    const api = window.REDVEIN_ROOM_API;
    if (!api || typeof api.startMatchFromDeckData !== 'function') {
      writeLog('盤面開始APIが見つかりません。');
      return;
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
      currentRoomState = 'finished';
      currentRoomStateLabel.textContent = currentRoomState;
      if (api && typeof api.applyRoomStateSync === 'function') {
        api.applyRoomStateSync({
          phase: 'finished',
          currentPlayer: data.currentPlayer || currentBattlePlayer,
          round: data.round,
          winner: data.message || '',
        });
      }
      if (data.message) writeLog(data.message);
      updateStartUi();
      configureRoomSync();
      return;
    }

    if (data.type === 'server_notice') {
      writeLog(data.message || 'サーバー通知');
      return;
    }

    if (data.type === 'error') {
      writeLog(`エラー: ${data.message || '不明なエラー'}`);
    }
  }

  async function createRoom() {
    const deckPayload = getSelectedDeckPayload(true);
    if (!deckPayload) return;
    try {
      currentDeckName = deckPayload.name;
      await ensureSocket();
      sendMessage({
        type: 'create_room',
        displayName: getDisplayName(),
        deckName: currentDeckName,
        deckPayload,
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
      sendMessage({
        type: isSpectator ? 'spectate_room' : 'join_room',
        roomId,
        displayName: getDisplayName(),
        deckName: deckPayload?.name || '',
        deckPayload,
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

  updateLegacyBoardUi(false);
  updateStartUi();
  configureRoomSync();
  reconnectIfPossible();
})();
