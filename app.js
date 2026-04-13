const DATA_PATH = './data/redvein_cards.json';
const CARDS_API_PATH = './api/cards';
const UNLOCK_API_PATH = './api/unlock-card';
const IMAGE_BASE_PATH = './cards/';
const OWNED_STORAGE_KEY = 'redvein_owned_cards_v1';
const DECKS_STORAGE_KEY = 'redvein_saved_decks_v1';
const UNLOCK_SAVE_KEY_STORAGE_KEY = 'redvein_unlock_save_key_v1';
const UNLOCK_TOKENS_STORAGE_KEY = 'redvein_unlock_tokens_v1';
const DECK_LIMITS = { battle: 5, item: 4, field: 1 };
const SETUP_SEQUENCE = [
  { player: 'player1', count: 3 },
  { player: 'player2', count: 2 },
  { player: 'player1', count: 2 },
  { player: 'player2', count: 3 },
];
const PLAYER_LABEL = { player1: 'プレイヤー1', player2: 'プレイヤー2' };
const HOME_COLUMN = { player1: 0, player2: 4 };

const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const rarityFilter = document.getElementById('rarityFilter');
const ownedOnlyCheckbox = document.getElementById('ownedOnlyCheckbox');
const reloadButton = document.getElementById('reloadButton');
const clearOwnedButton = document.getElementById('clearOwnedButton');
const resetDeckButton = document.getElementById('resetDeckButton');
const toggleCollectionButton = document.getElementById('toggleCollectionButton');
const toggleLogButton = document.getElementById('toggleLogButton');
const scrollToCollectionButton = document.getElementById('scrollToCollectionButton');
const collectionSection = document.getElementById('collectionSection');
const countLabel = document.getElementById('countLabel');
const ownedCountLabel = document.getElementById('ownedCountLabel');
const cardsGrid = document.getElementById('cardsGrid');
const errorBox = document.getElementById('errorBox');
const cardTemplate = document.getElementById('cardTemplate');
const deckItemTemplate = document.getElementById('deckItemTemplate');
const deckNameInput = document.getElementById('deckNameInput');
const saveDeckButton = document.getElementById('saveDeckButton');
const savedDeckSelect = document.getElementById('savedDeckSelect');
const loadDeckButton = document.getElementById('loadDeckButton');
const deleteDeckButton = document.getElementById('deleteDeckButton');
const battleDeckList = document.getElementById('battleDeckList');
const itemDeckList = document.getElementById('itemDeckList');
const fieldDeckList = document.getElementById('fieldDeckList');
const battleCountBadge = document.getElementById('battleCountBadge');
const itemCountBadge = document.getElementById('itemCountBadge');
const fieldCountBadge = document.getElementById('fieldCountBadge');
const battleCountText = document.getElementById('battleCountText');
const itemCountText = document.getElementById('itemCountText');
const fieldCountText = document.getElementById('fieldCountText');

const player1DeckSelect = document.getElementById('player1DeckSelect');
const player2DeckSelect = document.getElementById('player2DeckSelect');
const startMatchButton = document.getElementById('startMatchButton');
const resetMatchButton = document.getElementById('resetMatchButton');
const matchStatus = document.getElementById('matchStatus');
const turnInfo = document.getElementById('turnInfo');
const actionPanelLeft = document.getElementById('actionPanelLeft');
const actionPanelRight = document.getElementById('actionPanelRight');
const phaseInfo = document.getElementById('phaseInfo');
const boardGrid = document.getElementById('boardGrid');
const battleLogDrawer = document.getElementById('battleLogDrawer');
const battleLog = document.getElementById('battleLog');
const selectionInfo = document.getElementById('selectionInfo');
const moveModeButton = document.getElementById('moveModeButton');
const attackModeButton = document.getElementById('attackModeButton');
const endTurnButton = document.getElementById('endTurnButton');
const itemPhaseDoneButton = document.getElementById('itemPhaseDoneButton');
const clearSelectionButton = document.getElementById('clearSelectionButton');
const player1Summary = document.getElementById('player1Summary');
const player2Summary = document.getElementById('player2Summary');
const player1FieldCard = document.getElementById('player1FieldCard');
const player2FieldCard = document.getElementById('player2FieldCard');
const player1FieldLogButton = document.getElementById('player1FieldLogButton');
const player2FieldLogButton = document.getElementById('player2FieldLogButton');
const player1Items = document.getElementById('player1Items');
const player2Items = document.getElementById('player2Items');
const player1ItemSlot = player1Items?.closest('.item-slot') || null;
const player2ItemSlot = player2Items?.closest('.item-slot') || null;
const player1Reserve = document.getElementById('player1Reserve');
const player2Reserve = document.getElementById('player2Reserve');
const player1Box = document.getElementById('player1Box');
const player2Box = document.getElementById('player2Box');
const player1ReserveSlot = player1Reserve?.closest('.reserve-slot');
const player2ReserveSlot = player2Reserve?.closest('.reserve-slot');
const player1Defeats = document.getElementById('player1Defeats');
const player2Defeats = document.getElementById('player2Defeats');
const player1Points = document.getElementById('player1Points');
const player2Points = document.getElementById('player2Points');
const player1PointsCard = player1Points?.closest('.score-item') || null;
const player2PointsCard = player2Points?.closest('.score-item') || null;
const itemConfirmBox = document.getElementById('itemConfirmBox');
const itemConfirmTitle = document.getElementById('itemConfirmTitle');
const itemConfirmText = document.getElementById('itemConfirmText');
const confirmItemUseButton = document.getElementById('confirmItemUseButton');
const cancelItemUseButton = document.getElementById('cancelItemUseButton');
const actionConfirmBox = document.getElementById('actionConfirmBox');
const actionConfirmTitle = document.getElementById('actionConfirmTitle');
const actionConfirmText = document.getElementById('actionConfirmText');
const confirmActionButton = document.getElementById('confirmActionButton');
const cancelActionButton = document.getElementById('cancelActionButton');
const phaseInfoRight = document.getElementById('phaseInfoRight');
const selectionInfoRight = document.getElementById('selectionInfoRight');
const itemConfirmBoxRight = document.getElementById('itemConfirmBoxRight');
const itemConfirmTitleRight = document.getElementById('itemConfirmTitleRight');
const itemConfirmTextRight = document.getElementById('itemConfirmTextRight');
const confirmItemUseButtonRight = document.getElementById('confirmItemUseButtonRight');
const cancelItemUseButtonRight = document.getElementById('cancelItemUseButtonRight');
const actionConfirmBoxRight = document.getElementById('actionConfirmBoxRight');
const actionConfirmTitleRight = document.getElementById('actionConfirmTitleRight');
const actionConfirmTextRight = document.getElementById('actionConfirmTextRight');
const confirmActionButtonRight = document.getElementById('confirmActionButtonRight');
const cancelActionButtonRight = document.getElementById('cancelActionButtonRight');
const itemPhaseDoneButtonRight = document.getElementById('itemPhaseDoneButtonRight');
const moveModeButtonRight = document.getElementById('moveModeButtonRight');
const attackModeButtonRight = document.getElementById('attackModeButtonRight');
const endTurnButtonRight = document.getElementById('endTurnButtonRight');
const clearSelectionButtonRight = document.getElementById('clearSelectionButtonRight');
const actionPanels = [
  { container: actionPanelLeft, phaseInfo, selectionInfo, itemConfirmBox, itemConfirmTitle, itemConfirmText, confirmItemUseButton, cancelItemUseButton, actionConfirmBox, actionConfirmTitle, actionConfirmText, confirmActionButton, cancelActionButton, itemPhaseDoneButton, moveModeButton, attackModeButton, endTurnButton, clearSelectionButton },
  { container: actionPanelRight, phaseInfo: phaseInfoRight, selectionInfo: selectionInfoRight, itemConfirmBox: itemConfirmBoxRight, itemConfirmTitle: itemConfirmTitleRight, itemConfirmText: itemConfirmTextRight, confirmItemUseButton: confirmItemUseButtonRight, cancelItemUseButton: cancelItemUseButtonRight, actionConfirmBox: actionConfirmBoxRight, actionConfirmTitle: actionConfirmTitleRight, actionConfirmText: actionConfirmTextRight, confirmActionButton: confirmActionButtonRight, cancelActionButton: cancelActionButtonRight, itemPhaseDoneButton: itemPhaseDoneButtonRight, moveModeButton: moveModeButtonRight, attackModeButton: attackModeButtonRight, endTurnButton: endTurnButtonRight, clearSelectionButton: clearSelectionButtonRight },
].filter(panel => panel.phaseInfo);
const rightActionButtonsGrid = itemPhaseDoneButtonRight?.closest('.action-buttons-grid') || null;
let itemPhaseDoneButtonRightMirror = null;

function installRightItemPhaseDoneButtonMirror() {
  if (!rightActionButtonsGrid || !moveModeButtonRight || itemPhaseDoneButtonRightMirror) return;
  const mirror = document.createElement('button');
  mirror.type = 'button';
  mirror.id = 'itemPhaseDoneButtonRightMirror';
  mirror.className = itemPhaseDoneButtonRight?.className || 'button secondary';
  mirror.textContent = 'アイテムを使わず次へ';
  mirror.disabled = true;
  mirror.setAttribute('aria-label', 'アイテムを使わず次へ');
  mirror.style.gridColumn = '1 / -1';
  mirror.classList.add('mirrored-action-button');
  rightActionButtonsGrid.classList.add('has-mirrored-skip-button');
  rightActionButtonsGrid.insertBefore(mirror, moveModeButtonRight);
  if (itemPhaseDoneButtonRight) {
    itemPhaseDoneButtonRight.hidden = true;
    itemPhaseDoneButtonRight.style.display = 'none';
    itemPhaseDoneButtonRight.style.visibility = 'hidden';
    itemPhaseDoneButtonRight.style.position = 'absolute';
    itemPhaseDoneButtonRight.style.pointerEvents = 'none';
    itemPhaseDoneButtonRight.style.width = '1px';
    itemPhaseDoneButtonRight.style.height = '1px';
    itemPhaseDoneButtonRight.style.overflow = 'hidden';
    itemPhaseDoneButtonRight.tabIndex = -1;
    itemPhaseDoneButtonRight.setAttribute('aria-hidden', 'true');
  }
  actionPanels.forEach((panel, index) => {
    if (index === 1) panel.itemPhaseDoneButton = mirror;
  });
  itemPhaseDoneButtonRightMirror = mirror;
}

installRightItemPhaseDoneButtonMirror();

let allCards = [];
let cardMap = new Map();
let roomImportedCardMap = new Map();
let ownedCardIds = new Set();
let savedDecks = [];
let currentDeck = { name: '', battle: [], item: [], field: [] };
let instanceCounter = 0;
let collectionHidden = false;
let logHidden = true;
let matchState = createEmptyMatchState();
let roomSyncState = { enabled: false, role: '', battleControlsEnabled: false, pendingSetupRequest: false, pendingMoveRequest: false, pendingAttackRequest: false, pendingItemUseRequest: false, pendingFinishItemPhaseRequest: false, pendingEndTurnRequest: false, onSetupPlaceRequest: null, onMoveRequest: null, onAttackRequest: null, onItemUseRequest: null, onFinishItemPhaseRequest: null, onEndTurnRequest: null };

let unlockSaveKey = '';
let unlockTokens = [];
let unlockStatusState = { message: '特別なカードを持っている人は、解放コードを入力してください。', kind: 'info' };
let unlockPanelRoot = null;
let unlockSaveKeyInput = null;
let unlockCodeInput = null;
let unlockRedeemButton = null;
let unlockCopyButton = null;
let unlockResetButton = null;
let unlockStatusBox = null;
let unlockOwnedList = null;
const SFX_STORAGE_KEY = 'redvein_sfx_enabled_v1';
const SFX_MASTER_VOLUME = 0.08;
const BGM_STORAGE_KEY = 'redvein_bgm_enabled_v1';
const BGM_VOLUME_STORAGE_KEY = 'redvein_bgm_volume_level_v1';
const BGM_VOLUMES = { small: 0.06, medium: 0.10, large: 0.16 };
const BGM_VOLUME_LABELS = { small: '小', medium: '中', large: '大' };
const BGM_SRC = './assets/audio/redvein_bgm.mp3';
const ACTION_GUIDE_COLLAPSED_STORAGE_KEY = 'redvein_action_guide_collapsed_v1';
let sfxEnabled = loadSfxEnabled();
let sfxAudioContext = null;
let sfxMasterGainNode = null;
let sfxToggleButton = null;
let bgmEnabled = loadBgmEnabled();
let bgmVolumeLevel = loadBgmVolumeLevel();
let bgmAudio = null;
let bgmToggleButton = null;
let bgmVolumeButtons = new Map();
let bgmReadyForPlayback = false;
let lastFinishedSfxMessage = '';

let actionGuideCollapsed = loadActionGuideCollapsed();
let actionGuideRoot = null;
let actionGuideTitle = null;
let actionGuideMain = null;
let actionGuideSub = null;
let actionGuideMeta = null;
let actionGuideToggleButton = null;

let itemShowcaseRoot = null;
let itemShowcaseImage = null;
let itemShowcaseFallback = null;
let itemShowcaseName = null;
let itemShowcaseMeta = null;
let itemShowcaseEffect = null;
let itemShowcaseHideTimer = null;

let itemEffectRoot = null;
let itemEffectTitle = null;
let itemEffectSub = null;
let itemEffectLabel = null;

let itemPickerRoot = null;
let itemPickerGrid = null;
let itemPickerTitle = null;
let itemPickerSub = null;
let itemPickerFoot = null;
let itemPickerCloseButton = null;
let itemPickerOpen = false;
const itemPickerLaunchers = new Map();

let fieldPopupRoot = null;
let fieldPopupImage = null;
let fieldPopupFallback = null;
let fieldPopupName = null;
let fieldPopupMeta = null;
let fieldPopupEffect = null;
let fieldPopupBadge = null;
let fieldPopupOwner = null;
let fieldPopupCloseButton = null;

let spectatorHudRoot = null;
let spectatorHudTitle = null;
let spectatorHudMain = null;
let spectatorHudSub = null;
let spectatorHudMeta = null;
let spectatorHudScoreP1 = null;
let spectatorHudScoreP2 = null;

let combatFxBoardSnapshot = null;
let combatFxTurnSnapshot = null;
let combatFxTimers = new Set();
let combatFxHoldUntil = 0;
let combatFxHoldTimer = null;
let finishShowcaseReadyAt = 0;
let finishShowcaseTimer = null;
let combatFxPendingRender = false;
let combatFxSkipNextSnapshotDiff = false;

function injectFinishShowcaseStyles() {
  if (document.getElementById('redveinFinishShowcaseStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinFinishShowcaseStyle';
  style.textContent = `
    .board-grid.rv-finish-grid { position: relative; overflow: visible; }
    .board-grid.rv-finish-grid .board-cell { filter: saturate(0.7) brightness(0.72); transform: scale(0.985); transition: filter 0.28s ease, transform 0.28s ease; }
    .board-grid.rv-finish-grid .board-cell.current-turn-unit { filter: saturate(0.72) brightness(0.72); }
    .board-grid.rv-finish-grid::before {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 24px;
      background: radial-gradient(circle at top, rgba(255, 225, 164, 0.12), transparent 42%), linear-gradient(180deg, rgba(9, 6, 8, 0.28), rgba(9, 6, 8, 0.64));
      box-shadow: 0 22px 56px rgba(0, 0, 0, 0.32), inset 0 0 0 1px rgba(255, 232, 185, 0.08);
      pointer-events: none;
      z-index: 16;
    }
    .board-grid.rv-finish-grid.rv-finish-player1::before { box-shadow: 0 24px 64px rgba(0, 0, 0, 0.34), 0 0 42px rgba(179, 44, 77, 0.18), inset 0 0 0 1px rgba(255, 232, 185, 0.08); }
    .board-grid.rv-finish-grid.rv-finish-player2::before { box-shadow: 0 24px 64px rgba(0, 0, 0, 0.34), 0 0 42px rgba(72, 124, 224, 0.18), inset 0 0 0 1px rgba(255, 232, 185, 0.08); }
    .rv-finish-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      pointer-events: none;
      z-index: 22;
    }
    .rv-finish-card {
      position: relative;
      width: min(92%, 560px);
      padding: 24px 24px 20px;
      border-radius: 24px;
      border: 1px solid rgba(255, 226, 163, 0.24);
      background: linear-gradient(180deg, rgba(37, 19, 26, 0.96), rgba(19, 11, 17, 0.96));
      box-shadow: 0 26px 90px rgba(0, 0, 0, 0.48), inset 0 0 0 1px rgba(255,255,255,0.05);
      overflow: hidden;
      animation: rvFinishCardRise 520ms cubic-bezier(.2,.9,.25,1) both;
    }
    .rv-finish-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top, rgba(255, 224, 158, 0.24), transparent 48%), linear-gradient(135deg, rgba(255,255,255,0.06), transparent 42%);
      pointer-events: none;
    }
    .rv-finish-card.finish-p1 { box-shadow: 0 26px 90px rgba(0, 0, 0, 0.5), 0 0 48px rgba(179, 44, 77, 0.20), inset 0 0 0 1px rgba(255,255,255,0.05); }
    .rv-finish-card.finish-p2 { box-shadow: 0 26px 90px rgba(0, 0, 0, 0.5), 0 0 48px rgba(72, 124, 224, 0.18), inset 0 0 0 1px rgba(255,255,255,0.05); }
    .rv-finish-card.finish-draw { box-shadow: 0 26px 90px rgba(0, 0, 0, 0.5), 0 0 42px rgba(255, 214, 128, 0.14), inset 0 0 0 1px rgba(255,255,255,0.05); }
    .rv-finish-particles {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      opacity: 0.92;
    }
    .rv-finish-particle {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.96), rgba(255,255,255,0.18) 55%, transparent 70%);
      animation: rvFinishParticleFloat linear infinite;
      opacity: 0.68;
    }
    .rv-finish-card.finish-p1 .rv-finish-particle { box-shadow: 0 0 12px rgba(233, 70, 113, 0.52); }
    .rv-finish-card.finish-p2 .rv-finish-particle { box-shadow: 0 0 12px rgba(102, 151, 255, 0.44); }
    .rv-finish-card.finish-draw .rv-finish-particle { box-shadow: 0 0 12px rgba(255, 214, 128, 0.40); }
    .rv-finish-kicker {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 225, 165, 0.30);
      background: rgba(255, 225, 165, 0.10);
      color: #ffe1a5;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .rv-finish-title {
      position: relative;
      margin: 0;
      font-size: clamp(30px, 5vw, 48px);
      line-height: 1.02;
      letter-spacing: 0.04em;
      font-weight: 1000;
      color: #fff5db;
      text-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    .rv-finish-card.finish-p1 .rv-finish-title { color: #ffd5df; }
    .rv-finish-card.finish-p2 .rv-finish-title { color: #d7e6ff; }
    .rv-finish-subtitle {
      position: relative;
      margin: 10px 0 14px;
      color: #f4dfe5;
      font-size: 14px;
      line-height: 1.65;
    }
    .rv-finish-chip-row {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    .rv-finish-chip {
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
      color: #f8e9ec;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.03em;
    }
    .rv-finish-score-grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .rv-finish-score-card {
      position: relative;
      border-radius: 18px;
      padding: 14px 14px 12px;
      border: 1px solid rgba(255,255,255,0.10);
      background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
    }
    .rv-finish-score-card.is-winner {
      border-color: rgba(255, 225, 165, 0.40);
      box-shadow: 0 0 0 1px rgba(255, 225, 165, 0.12) inset, 0 16px 36px rgba(0,0,0,0.20);
    }
    .rv-finish-score-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
      color: #fbebef;
      font-weight: 900;
      letter-spacing: 0.04em;
    }
    .rv-finish-score-tag {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.07);
      color: #f6dde4;
    }
    .rv-finish-score-value {
      font-size: clamp(26px, 4vw, 34px);
      font-weight: 1000;
      color: #fff2cf;
      line-height: 1;
      margin-bottom: 10px;
    }
    .rv-finish-score-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: #e9d7dc;
      font-size: 12px;
      line-height: 1.5;
    }
    .rv-finish-footer {
      position: relative;
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,0.08);
      color: #ddc7cf;
      font-size: 12px;
      line-height: 1.6;
    }
    .rv-finish-callout {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 11px;
      border-radius: 999px;
      background: rgba(255, 225, 165, 0.10);
      border: 1px solid rgba(255, 225, 165, 0.22);
      color: #ffe1a5;
      font-weight: 900;
      margin-top: 10px;
    }
    .rv-finish-highlight-winner {
      box-shadow: 0 0 0 1px rgba(255, 225, 165, 0.18) inset, 0 0 32px rgba(255, 225, 165, 0.12);
      border-color: rgba(255, 225, 165, 0.32) !important;
      transform: translateY(-2px);
    }
    .rv-finish-highlight-loser { opacity: 0.78; filter: saturate(0.76); }
    .rv-finish-score-emphasis {
      border-color: rgba(255, 225, 165, 0.35);
      box-shadow: 0 0 0 1px rgba(255, 225, 165, 0.12) inset, 0 16px 36px rgba(0, 0, 0, 0.18);
      transform: translateY(-2px);
    }
    @keyframes rvFinishCardRise {
      0% { opacity: 0; transform: translateY(16px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes rvFinishParticleFloat {
      0% { transform: translate3d(0, 22px, 0) scale(0.8); opacity: 0; }
      15% { opacity: 0.82; }
      100% { transform: translate3d(0, -130px, 0) scale(1.22); opacity: 0; }
    }
    @media (max-width: 720px) {
      .rv-finish-overlay { padding: 10px; }
      .rv-finish-card { width: min(96%, 540px); padding: 18px 16px 16px; }
      .rv-finish-score-grid { grid-template-columns: 1fr; }
      .rv-finish-subtitle { font-size: 13px; }
    }
  `;
  document.head.appendChild(style);
}

function getFinishWinnerPlayerKey(message = matchState.winner || '') {
  if (!message) return '';
  if (message.includes('引き分け') || message.includes('両者全滅')) return '';
  if (message.includes('プレイヤー1')) return 'player1';
  if (message.includes('プレイヤー2')) return 'player2';
  return '';
}

function getFinishReasonLabel(message = matchState.winner || '') {
  if (!message) return 'FINISH';
  if (message.includes('全滅')) return 'ELIMINATION';
  if (message.includes('ポイント')) return 'POINTS';
  if (message.includes('引き分け')) return 'DRAW';
  return 'FINISH';
}

function getFinishShowcaseData() {
  const winnerKey = getFinishWinnerPlayerKey();
  const winnerLabel = winnerKey ? PLAYER_LABEL[winnerKey] : '引き分け';
  const reasonLabel = getFinishReasonLabel();
  const title = winnerKey ? `${winnerLabel} VICTORY` : 'DRAW GAME';
  const subtitle = matchState.winner || '対戦が終了しました';
  return {
    winnerKey,
    winnerLabel,
    reasonLabel,
    title,
    subtitle,
    round: matchState.round || 10,
    p1Points: calculatePoints('player1'),
    p2Points: calculatePoints('player2'),
    p1Defeats: Number(getPlayerState('player1')?.defeated || 0),
    p2Defeats: Number(getPlayerState('player2')?.defeated || 0),
    roomMode: !!roomSyncState.enabled,
  };
}

function createFinishParticleMarkup(count = 18) {
  return Array.from({ length: count }, (_, index) => {
    const left = ((index * 53) % 100) + 0.5;
    const delay = ((index % 9) * 0.18).toFixed(2);
    const duration = (2.9 + ((index * 17) % 8) * 0.18).toFixed(2);
    const size = 7 + ((index * 11) % 7);
    const opacity = (0.32 + ((index * 9) % 5) * 0.12).toFixed(2);
    return `<span class="rv-finish-particle" style="left:${left}%; bottom:-18px; width:${size}px; height:${size}px; animation-delay:${delay}s; animation-duration:${duration}s; opacity:${opacity};"></span>`;
  }).join('');
}

function renderMatchFinishOverlay() {
  injectFinishShowcaseStyles();
  if (!boardGrid) return;
  const data = getFinishShowcaseData();
  const overlay = document.createElement('div');
  overlay.className = 'rv-finish-overlay';
  const cardClass = data.winnerKey ? `finish-${data.winnerKey === 'player1' ? 'p1' : 'p2'}` : 'finish-draw';
  const p1Winner = data.winnerKey === 'player1';
  const p2Winner = data.winnerKey === 'player2';
  const kicker = data.reasonLabel === 'ELIMINATION' ? 'ELIMINATION' : data.reasonLabel === 'POINTS' ? 'POINTS DECISION' : data.reasonLabel === 'DRAW' ? 'DRAW' : 'MATCH END';
  const footerText = data.roomMode
    ? '試合操作の「再戦 / リセット / ルーム終了」から続行できます。'
    : 'テスト対戦はデッキを整えて、もう一度開始できます。';
  overlay.innerHTML = `
    <div class="rv-finish-card ${cardClass}">
      <div class="rv-finish-particles">${createFinishParticleMarkup()}</div>
      <div class="rv-finish-kicker">◆ ${kicker}</div>
      <h2 class="rv-finish-title">${data.title}</h2>
      <div class="rv-finish-subtitle">${escapeHtml(data.subtitle)}</div>
      <div class="rv-finish-chip-row">
        <span class="rv-finish-chip">ROUND ${data.round}</span>
        <span class="rv-finish-chip">P1 ${data.p1Points} PT</span>
        <span class="rv-finish-chip">P2 ${data.p2Points} PT</span>
      </div>
      <div class="rv-finish-score-grid">
        <section class="rv-finish-score-card ${p1Winner ? 'is-winner' : ''}">
          <div class="rv-finish-score-head"><span>P1</span><span class="rv-finish-score-tag">${p1Winner ? 'WINNER' : (data.winnerKey ? 'LOSE' : 'DRAW')}</span></div>
          <div class="rv-finish-score-value">${data.p1Points}</div>
          <div class="rv-finish-score-meta"><span>撃破 ${data.p1Defeats}</span><span>ポイント ${data.p1Points}</span></div>
        </section>
        <section class="rv-finish-score-card ${p2Winner ? 'is-winner' : ''}">
          <div class="rv-finish-score-head"><span>P2</span><span class="rv-finish-score-tag">${p2Winner ? 'WINNER' : (data.winnerKey ? 'LOSE' : 'DRAW')}</span></div>
          <div class="rv-finish-score-value">${data.p2Points}</div>
          <div class="rv-finish-score-meta"><span>撃破 ${data.p2Defeats}</span><span>ポイント ${data.p2Points}</span></div>
        </section>
      </div>
      <div class="rv-finish-footer">${footerText}<div class="rv-finish-callout">再戦 / リセット / ルーム終了</div></div>
    </div>
  `;
  boardGrid.classList.add('rv-finish-grid');
  boardGrid.classList.toggle('rv-finish-player1', p1Winner);
  boardGrid.classList.toggle('rv-finish-player2', p2Winner);
  boardGrid.appendChild(overlay);

  player1Box?.classList.toggle('rv-finish-highlight-winner', p1Winner);
  player2Box?.classList.toggle('rv-finish-highlight-winner', p2Winner);
  player1Box?.classList.toggle('rv-finish-highlight-loser', !!data.winnerKey && !p1Winner);
  player2Box?.classList.toggle('rv-finish-highlight-loser', !!data.winnerKey && !p2Winner);
  player1PointsCard?.classList.toggle('rv-finish-score-emphasis', p1Winner);
  player2PointsCard?.classList.toggle('rv-finish-score-emphasis', p2Winner);
}

function clearMatchFinishOverlayState() {
  boardGrid?.classList.remove('rv-finish-grid', 'rv-finish-player1', 'rv-finish-player2');
  player1Box?.classList.remove('rv-finish-highlight-winner', 'rv-finish-highlight-loser');
  player2Box?.classList.remove('rv-finish-highlight-winner', 'rv-finish-highlight-loser');
  player1PointsCard?.classList.remove('rv-finish-score-emphasis');
  player2PointsCard?.classList.remove('rv-finish-score-emphasis');
}

function clearFinishShowcaseSchedule() {
  finishShowcaseReadyAt = 0;
  if (finishShowcaseTimer) {
    clearTimeout(finishShowcaseTimer);
    finishShowcaseTimer = null;
  }
}

function isFinishShowcaseReady() {
  return matchState.phase === 'finished' && (!finishShowcaseReadyAt || Date.now() >= finishShowcaseReadyAt);
}

function scheduleFinishShowcase(delayMs = 0) {
  const delay = Math.max(0, Math.round(Number(delayMs) || 0));
  clearFinishShowcaseSchedule();
  if (matchState.phase !== 'finished') return 0;
  if (delay <= 0) return 0;
  finishShowcaseReadyAt = Date.now() + delay;
  finishShowcaseTimer = setTimeout(() => {
    finishShowcaseTimer = null;
    finishShowcaseReadyAt = 0;
    renderMatchArea();
  }, delay + 16);
  return delay;
}



function injectActionGuideStyles() {
  if (document.getElementById('redveinActionGuideStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinActionGuideStyle';
  style.textContent = `
    #redveinActionGuide {
      position: fixed;
      top: 84px;
      left: 50%;
      transform: translateX(-50%);
      width: min(760px, calc(100vw - 24px));
      z-index: 9998;
      border-radius: 18px;
      border: 1px solid rgba(255, 208, 120, 0.38);
      background: linear-gradient(180deg, rgba(36, 18, 24, 0.96), rgba(23, 12, 18, 0.94));
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(255, 214, 128, 0.08) inset;
      backdrop-filter: blur(10px);
      padding: 12px 16px 14px;
      pointer-events: none;
      transition: width 0.18s ease, padding 0.18s ease, opacity 0.18s ease;
    }
    #redveinActionGuide.rv-guide-hidden { display: none; }
    #redveinActionGuide .rv-guide-shell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 8px;
    }
    #redveinActionGuide .rv-guide-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(255, 214, 128, 0.12);
      border: 1px solid rgba(255, 214, 128, 0.26);
      color: #ffd992;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      margin-bottom: 0;
    }
    #redveinActionGuide .rv-guide-toggle {
      pointer-events: auto;
      appearance: none;
      border: 1px solid rgba(255, 220, 160, 0.22);
      background: rgba(255,255,255,0.06);
      color: #ffe8ef;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease;
    }
    #redveinActionGuide .rv-guide-toggle:hover {
      transform: translateY(-1px);
      background: rgba(255,255,255,0.1);
      border-color: rgba(255, 220, 160, 0.34);
    }
    #redveinActionGuide .rv-guide-title {
      font-size: 24px;
      line-height: 1.3;
      font-weight: 900;
      color: #fff3f6;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.28);
    }
    #redveinActionGuide .rv-guide-sub {
      margin-top: 6px;
      color: rgba(255, 234, 240, 0.88);
      line-height: 1.55;
      font-size: 14px;
    }
    #redveinActionGuide .rv-guide-meta {
      margin-top: 9px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    #redveinActionGuide.rv-guide-collapsed {
      width: min(320px, calc(100vw - 24px));
      padding: 10px 12px;
    }
    #redveinActionGuide.rv-guide-collapsed .rv-guide-title,
    #redveinActionGuide.rv-guide-collapsed .rv-guide-sub,
    #redveinActionGuide.rv-guide-collapsed .rv-guide-meta {
      display: none;
    }
    #redveinActionGuide .rv-guide-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #ffe8ef;
      font-size: 12px;
      font-weight: 700;
    }
    .rv-guide-strong {
      position: relative;
      border-color: rgba(255, 214, 128, 0.95) !important;
      box-shadow: 0 0 0 2px rgba(255, 214, 128, 0.26), 0 0 24px rgba(255, 188, 92, 0.28) !important;
      animation: rvGuidePulse 1.25s ease-in-out infinite;
    }
    .rv-guide-cell {
      box-shadow: 0 0 0 2px rgba(255, 214, 128, 0.28), inset 0 0 0 2px rgba(255, 214, 128, 0.22), 0 0 18px rgba(255, 188, 92, 0.2) !important;
      animation: rvGuidePulse 1.15s ease-in-out infinite;
    }
    .rv-guide-soft {
      box-shadow: 0 0 0 1px rgba(255, 214, 128, 0.22), 0 0 16px rgba(255, 188, 92, 0.18) !important;
    }
    .rv-guide-panel-focus {
      border-color: rgba(255, 214, 128, 0.55) !important;
      box-shadow: 0 0 0 2px rgba(255, 214, 128, 0.14), 0 8px 30px rgba(0, 0, 0, 0.25) !important;
    }
    @keyframes rvGuidePulse {
      0%, 100% { transform: translateY(0); filter: brightness(1); }
      50% { transform: translateY(-1px); filter: brightness(1.08); }
    }
    @media (max-width: 900px) {
      #redveinActionGuide {
        top: 72px;
        width: calc(100vw - 16px);
        padding: 10px 12px 12px;
      }
      #redveinActionGuide .rv-guide-title {
        font-size: 18px;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureActionGuide() {
  if (actionGuideRoot && document.body.contains(actionGuideRoot)) return actionGuideRoot;
  injectActionGuideStyles();
  if (!document.body) return null;
  actionGuideRoot = document.createElement('div');
  actionGuideRoot.id = 'redveinActionGuide';
  actionGuideRoot.className = 'rv-guide-hidden';
  actionGuideRoot.innerHTML = `
    <div class="rv-guide-shell">
      <div class="rv-guide-kicker">いまやること</div>
      <button type="button" class="rv-guide-toggle" aria-label="案内を折りたたむ"></button>
    </div>
    <div class="rv-guide-title"></div>
    <div class="rv-guide-sub"></div>
    <div class="rv-guide-meta"></div>
  `;
  document.body.appendChild(actionGuideRoot);
  actionGuideTitle = actionGuideRoot.querySelector('.rv-guide-title');
  actionGuideMain = actionGuideRoot.querySelector('.rv-guide-sub');
  actionGuideSub = actionGuideRoot.querySelector('.rv-guide-kicker');
  actionGuideMeta = actionGuideRoot.querySelector('.rv-guide-meta');
  actionGuideToggleButton = actionGuideRoot.querySelector('.rv-guide-toggle');
  actionGuideToggleButton?.addEventListener('click', () => {
    setActionGuideCollapsed(!actionGuideCollapsed);
  });
  updateActionGuideToggleButton();
  return actionGuideRoot;
}

function loadActionGuideCollapsed() {
  try {
    return localStorage.getItem(ACTION_GUIDE_COLLAPSED_STORAGE_KEY) === '1';
  } catch (_) {
    return false;
  }
}

function saveActionGuideCollapsed() {
  try {
    localStorage.setItem(ACTION_GUIDE_COLLAPSED_STORAGE_KEY, actionGuideCollapsed ? '1' : '0');
  } catch (_) {
    // no-op
  }
}

function updateActionGuideToggleButton() {
  if (!actionGuideToggleButton) return;
  actionGuideToggleButton.textContent = actionGuideCollapsed ? '案内を開く' : '案内を閉じる';
  actionGuideToggleButton.setAttribute('aria-label', actionGuideCollapsed ? '案内を開く' : '案内を閉じる');
}

function setActionGuideCollapsed(nextValue) {
  actionGuideCollapsed = !!nextValue;
  saveActionGuideCollapsed();
  if (actionGuideRoot) {
    actionGuideRoot.classList.toggle('rv-guide-collapsed', actionGuideCollapsed);
  }
  updateActionGuideToggleButton();
}

function clearActionGuideHighlights() {
  document.querySelectorAll('.rv-guide-strong, .rv-guide-cell, .rv-guide-soft, .rv-guide-panel-focus').forEach((node) => {
    node.classList.remove('rv-guide-strong', 'rv-guide-cell', 'rv-guide-soft', 'rv-guide-panel-focus');
  });
}

function getGuideLocalPlayerKey() {
  const roomPlayerKey = getRoomPlayerKey();
  if (roomSyncState.enabled) return roomPlayerKey || '';
  return matchState.currentPlayer || 'player1';
}

function getGuideSideLabel(playerKey) {
  if (playerKey === 'player1') return '左側の P1';
  if (playerKey === 'player2') return '右側の P2';
  return 'この画面';
}

function isGuideInteractiveForLocal() {
  if (!matchState.active) return false;
  if (!roomSyncState.enabled) return true;
  const roomPlayerKey = getRoomPlayerKey();
  return !!roomPlayerKey && roomPlayerKey === matchState.currentPlayer && roomSyncState.battleControlsEnabled;
}

function buildGuideState() {
  if (!matchState.active) {
    return {
      show: true,
      title: '対戦前です',
      detail: 'ルームを作成してプレイヤーが参加したら、試合開始で進めてください。',
      chips: ['準備中'],
      highlight: () => {},
    };
  }

  if (matchState.phase === 'finished') {
    return {
      show: true,
      title: matchState.winner || '対戦終了',
      detail: roomSyncState.enabled ? '試合操作の「再戦 / リセット / ルーム終了」から続けられます。' : '試合は終了しました。次の試合を始める場合は、もう一度対戦を開始してください。',
      chips: ['試合終了'],
      highlight: () => {},
    };
  }

  if (matchState.phase === 'setup') {
    const step = getCurrentSetupStep();
    const localPlayerKey = getGuideLocalPlayerKey();
    const isLocalStep = !roomSyncState.enabled || step?.player === localPlayerKey;
    const remaining = step ? Math.max(0, step.count - matchState.placedInCurrentStep) : 0;
    return {
      show: true,
      title: isLocalStep
        ? `${getGuideSideLabel(step?.player)} の配置待ちカードを1枚押してください`
        : `${PLAYER_LABEL[step?.player]} の配置を待っています`,
      detail: isLocalStep
        ? `① 配置待ちバトルカードから1枚選ぶ → ② 金色に光るマスへ置く。残り ${remaining} 枚です。`
        : '相手が配置中です。金色のマスにカードが置かれるまで待機してください。',
      chips: ['配置フェーズ', `残り ${remaining} 枚`],
      highlight: () => {
        if (!isLocalStep) return;
        const reserve = step?.player === 'player1' ? player1Reserve : player2Reserve;
        reserve?.closest('.reserve-slot')?.classList.add('rv-guide-panel-focus');
        reserve?.querySelectorAll('.side-card-item button:not(:disabled)').forEach((button) => button.classList.add('rv-guide-strong'));
        document.querySelectorAll('.board-cell.placeable').forEach((cell) => cell.classList.add('rv-guide-cell'));
      },
    };
  }

  const localPlayerKey = getGuideLocalPlayerKey();
  const roomPlayerKey = getRoomPlayerKey();
  const isSpectator = roomSyncState.enabled && !roomPlayerKey;
  if (isSpectator) {
    return {
      show: true,
      title: `${PLAYER_LABEL[matchState.currentPlayer]} の操作中です`,
      detail: '観戦中です。光っている場所やボタンが、いま操作している側の候補です。',
      chips: ['観戦'],
      highlight: () => {
        document.querySelectorAll('.board-cell.current-turn-unit').forEach((cell) => cell.classList.add('rv-guide-soft'));
      },
    };
  }

  if (!isGuideInteractiveForLocal()) {
    return {
      show: true,
      title: `${PLAYER_LABEL[matchState.currentPlayer]} の操作待ちです`,
      detail: 'いまは相手の手番です。自分の手番になるまで待機してください。',
      chips: ['待機中'],
      highlight: () => {},
    };
  }

  const activePanel = actionPanels[getActivePanelIndex()] || null;
  const activePlayerKey = matchState.currentPlayer;
  const pendingAction = getPendingAction();
  const selectedItem = getSelectedItemCard();
  const targetUnit = getSelectedItemTargetUnit();
  const postAttackMoveUnit = getPostAttackMoveUnit();
  const selectedUnit = getSelectedUnit();
  const activeItems = activePlayerKey === 'player1' ? player1Items : player2Items;

  if (pendingAction) {
    const actionLabel = pendingAction.type === 'attack' ? '攻撃' : '行動';
    return {
      show: true,
      title: `${actionLabel}を確定してください`,
      detail: pendingAction.type === 'attack'
        ? `「この行動を確定」を押すと、${pendingAction.unitName} が ${pendingAction.targetName} を攻撃します。`
        : `「この行動を確定」を押すと、${pendingAction.unitName} が ${pendingAction.toLabel} へ移動します。`,
      chips: [actionLabel + '確認'],
      highlight: () => {
        activePanel?.actionConfirmBox?.classList.add('rv-guide-panel-focus');
        activePanel?.confirmActionButton?.classList.add('rv-guide-strong');
        document.querySelectorAll('.board-cell.pending-target').forEach((cell) => cell.classList.add('rv-guide-cell'));
      },
    };
  }

  if (isItemWindowOpen()) {
    if (!selectedItem) {
      return {
        show: true,
        title: `${getGuideSideLabel(activePlayerKey)} のアイテムを使うか選んでください`,
        detail: '「アイテム一覧」を押すと、4枚を大きく表示できます。使わないなら「アイテムを使わず次へ」を押します。',
        chips: ['アイテムフェーズ', '1手番1枚まで'],
        highlight: () => {
          activeItems?.closest('.item-slot')?.classList.add('rv-guide-panel-focus');
          activeItems?.querySelectorAll('.side-card-item button:not(:disabled)').forEach((button) => button.classList.add('rv-guide-strong'));
          activePanel?.itemPhaseDoneButton?.classList.add('rv-guide-strong');
        },
      };
    }

    if (canConfirmSelectedItem(selectedItem)) {
      return {
        show: true,
        title: `「${selectedItem.card_name}」を使ってよければ確定してください`,
        detail: targetUnit
          ? `${targetUnit.name} が対象です。「このアイテムを使う」を押すと発動します。`
          : '対象は不要です。「このアイテムを使う」を押すとすぐ発動します。',
        chips: ['アイテム確定'],
        highlight: () => {
          activePanel?.itemConfirmBox?.classList.add('rv-guide-panel-focus');
          activePanel?.confirmItemUseButton?.classList.add('rv-guide-strong');
        },
      };
    }

    return {
      show: true,
      title: `「${selectedItem.card_name}」の対象を盤面で選んでください`,
      detail: '光っているマスの中から対象を1つ押すと、使用確認へ進みます。',
      chips: ['対象選択'],
      highlight: () => {
        document.querySelectorAll('.board-cell.item-target-ally, .board-cell.item-target-enemy, .board-cell.item-target-any').forEach((cell) => cell.classList.add('rv-guide-cell'));
        activePanel?.cancelItemUseButton?.classList.add('rv-guide-soft');
      },
    };
  }

  if (postAttackMoveUnit) {
    return {
      show: true,
      title: `${postAttackMoveUnit.name} を追加移動するなら光るマスを押してください`,
      detail: '移動しないで終えるなら「手番終了」を押してください。',
      chips: ['追加移動'],
      highlight: () => {
        document.querySelectorAll('.board-cell.move-target').forEach((cell) => cell.classList.add('rv-guide-cell'));
        activePanel?.endTurnButton?.classList.add('rv-guide-strong');
      },
    };
  }

  if (!selectedUnit) {
    return {
      show: true,
      title: `${getGuideSideLabel(activePlayerKey)} のユニットを1体選んでください`,
      detail: 'まず自分のユニットを押すと、そのあと移動か攻撃を選べます。',
      chips: ['通常行動'],
      highlight: () => {
        document.querySelectorAll('.board-cell.current-turn-unit').forEach((cell) => cell.classList.add('rv-guide-cell'));
      },
    };
  }

  if (matchState.actionMode === 'move') {
    return {
      show: true,
      title: `${selectedUnit.name} の移動先を選んでください`,
      detail: '光っている移動先を押すと、移動確認へ進みます。',
      chips: ['移動モード'],
      highlight: () => {
        activePanel?.moveModeButton?.classList.add('rv-guide-strong');
        document.querySelectorAll('.board-cell.move-target').forEach((cell) => cell.classList.add('rv-guide-cell'));
      },
    };
  }

  if (matchState.actionMode === 'attack') {
    return {
      show: true,
      title: `${selectedUnit.name} の攻撃先を選んでください`,
      detail: '光っている敵マスを押すと、攻撃確認へ進みます。',
      chips: ['攻撃モード'],
      highlight: () => {
        activePanel?.attackModeButton?.classList.add('rv-guide-strong');
        document.querySelectorAll('.board-cell.attack-target').forEach((cell) => cell.classList.add('rv-guide-cell'));
      },
    };
  }

  const attackReady = !currentPlayerCannotAttackAfterMove(selectedUnit) && !matchState.turnState?.attacked && !matchState.turnState?.attackUnitId;
  const moveReady = !matchState.turnState?.moved || (matchState.turnState?.acceleratedUnitId === selectedUnit.instanceId && matchState.turnState?.acceleratedMovesRemaining > 0);
  const options = [];
  if (moveReady) options.push('移動');
  if (attackReady) options.push('攻撃');
  options.push('手番終了');

  return {
    show: true,
    title: `${selectedUnit.name} を選択中です。次の操作を選んでください`,
    detail: `${options.join(' / ')} のどれかを押してください。迷ったら、まず「攻撃モード」か「移動モード」を押せば進めます。`,
    chips: ['ユニット選択中'],
    highlight: () => {
      activePanel?.moveModeButton?.classList.add(moveReady ? 'rv-guide-strong' : 'rv-guide-soft');
      activePanel?.attackModeButton?.classList.add(attackReady ? 'rv-guide-strong' : 'rv-guide-soft');
      activePanel?.endTurnButton?.classList.add('rv-guide-soft');
      document.querySelectorAll('.board-cell.selected-cell').forEach((cell) => cell.classList.add('rv-guide-cell'));
    },
  };
}

function updateActionGuide() {
  const root = ensureActionGuide();
  if (!root) return;
  root.classList.toggle('rv-guide-collapsed', actionGuideCollapsed);
  updateActionGuideToggleButton();
  clearActionGuideHighlights();
  const state = buildGuideState();
  if (!state || state.show === false) {
    root.classList.add('rv-guide-hidden');
    return;
  }
  root.classList.remove('rv-guide-hidden');
  if (actionGuideTitle) actionGuideTitle.textContent = state.title || '';
  if (actionGuideMain) actionGuideMain.textContent = state.detail || '';
  if (actionGuideMeta) {
    actionGuideMeta.innerHTML = '';
    const chips = Array.isArray(state.chips) ? state.chips : [];
    chips.forEach((chip) => {
      const node = document.createElement('div');
      node.className = 'rv-guide-chip';
      node.textContent = chip;
      actionGuideMeta.appendChild(node);
    });
  }
  if (typeof state.highlight === 'function') state.highlight();
}



function injectStatusBadgeStyles() {
  if (document.getElementById('redveinStatusBadgeStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinStatusBadgeStyle';
  style.textContent = `
    .unit-status-badge.field-immune {
      background: linear-gradient(180deg, rgba(66, 130, 255, 0.95), rgba(28, 78, 194, 0.95));
      border-color: rgba(186, 220, 255, 0.88);
      box-shadow: 0 0 12px rgba(73, 132, 255, 0.28);
      color: #f7fbff;
    }
    .unit-status-badge.item-untargetable {
      background: linear-gradient(180deg, rgba(24, 166, 138, 0.96), rgba(12, 120, 97, 0.96));
      border-color: rgba(176, 255, 235, 0.88);
      box-shadow: 0 0 12px rgba(27, 180, 148, 0.24);
      color: #f5fffd;
    }
    .unit-status-badge.item-destroy-immune {
      background: linear-gradient(180deg, rgba(214, 104, 39, 0.96), rgba(161, 54, 19, 0.96));
      border-color: rgba(255, 214, 179, 0.9);
      box-shadow: 0 0 12px rgba(214, 104, 39, 0.24);
      color: #fff8f3;
    }
    .unit-status-badge.no-heal-revive {
      background: linear-gradient(180deg, rgba(132, 53, 186, 0.96), rgba(90, 36, 136, 0.96));
      border-color: rgba(216, 177, 255, 0.9);
      box-shadow: 0 0 12px rgba(159, 103, 224, 0.28);
      color: #fff8ff;
    }
    .unit-status-badge.item-stun-immune {
      background: linear-gradient(180deg, rgba(57, 124, 201, 0.96), rgba(30, 78, 152, 0.96));
      border-color: rgba(180, 226, 255, 0.9);
      box-shadow: 0 0 12px rgba(74, 149, 230, 0.24);
      color: #f5fbff;
    }
    .unit-status-badge.control-guard {
      background: linear-gradient(180deg, rgba(190, 141, 48, 0.96), rgba(126, 86, 19, 0.96));
      border-color: rgba(255, 231, 181, 0.9);
      box-shadow: 0 0 12px rgba(222, 176, 73, 0.24);
      color: #fff9ef;
    }
    .unit-status-badge.center-silence {
      background: linear-gradient(180deg, rgba(78, 92, 116, 0.96), rgba(46, 56, 76, 0.96));
      border-color: rgba(186, 204, 231, 0.88);
      box-shadow: 0 0 12px rgba(125, 146, 183, 0.24);
      color: #f6f9ff;
    }
    .unit-status-badge.full-silence {
      background: linear-gradient(180deg, rgba(103, 70, 134, 0.96), rgba(65, 40, 90, 0.96));
      border-color: rgba(214, 191, 255, 0.9);
      box-shadow: 0 0 12px rgba(151, 118, 205, 0.24);
      color: #fcf8ff;
    }
    .unit-status-badge.field-immune .status-badge-icon,
    .unit-status-badge.item-untargetable .status-badge-icon,
    .unit-status-badge.item-destroy-immune .status-badge-icon,
    .unit-status-badge.item-stun-immune .status-badge-icon,
    .unit-status-badge.control-guard .status-badge-icon,
    .unit-status-badge.no-heal-revive .status-badge-icon,
    .unit-status-badge.center-silence .status-badge-icon,
    .unit-status-badge.full-silence .status-badge-icon,
    .unit-status-badge.field-immune .status-badge-value,
    .unit-status-badge.item-untargetable .status-badge-value,
    .unit-status-badge.item-destroy-immune .status-badge-value,
    .unit-status-badge.item-stun-immune .status-badge-value,
    .unit-status-badge.control-guard .status-badge-value,
    .unit-status-badge.no-heal-revive .status-badge-value,
    .unit-status-badge.center-silence .status-badge-value,
    .unit-status-badge.full-silence .status-badge-value {
      color: inherit;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
    }
  `;
  document.head.appendChild(style);
}

function injectItemPickerStyles() {
  if (document.getElementById('redveinItemPickerStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinItemPickerStyle';
  style.textContent = `
    body.rv-item-decision-active .board-center-area,
    body.rv-item-decision-active .score-bar,
    body.rv-item-decision-active .board-bottom-row,
    body.rv-item-decision-active .battle-side-panel .reserve-slot,
    body.rv-item-decision-active .battle-side-panel .field-slot {
      opacity: 1 !important;
      filter: none !important;
      transform: none !important;
    }
    .item-slot-decision-focus {
      transform: none !important;
      transform-origin: center top;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(64, 16, 29, 0.36), rgba(25, 12, 18, 0.52)) !important;
      box-shadow: 0 0 0 2px rgba(255, 196, 118, 0.20), 0 0 22px rgba(201, 71, 98, 0.12) !important;
      padding: 8px !important;
    }
    .item-slot-decision-focus::after {
      content: none !important;
    }
    .rv-item-picker-launch {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 6;
      display: none;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 218, 164, 0.42);
      background: linear-gradient(135deg, rgba(195, 61, 77, 0.96), rgba(124, 32, 57, 0.96));
      color: #fff4de;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.06em;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.30), 0 0 18px rgba(255, 124, 120, 0.16);
      cursor: pointer;
    }
    .item-slot-decision-focus .rv-item-picker-launch {
      display: inline-flex;
    }
    #redveinItemPicker {
      position: fixed;
      inset: 0;
      z-index: 10030;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
    }
    #redveinItemPicker.rv-item-picker-visible {
      display: flex;
    }
    #redveinItemPicker .rv-item-picker-backdrop {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(92, 18, 38, 0.22), rgba(6, 5, 10, 0.78));
      backdrop-filter: blur(6px);
    }
    #redveinItemPicker .rv-item-picker-panel {
      position: relative;
      width: min(980px, calc(100vw - 24px));
      max-height: min(82vh, 860px);
      overflow: auto;
      border-radius: 28px;
      padding: 18px 18px 20px;
      border: 1px solid rgba(255, 220, 170, 0.20);
      background: linear-gradient(180deg, rgba(28, 14, 20, 0.97), rgba(15, 10, 16, 0.96));
      box-shadow: 0 26px 88px rgba(0, 0, 0, 0.50), 0 0 36px rgba(255, 90, 120, 0.12);
    }
    #redveinItemPicker .rv-item-picker-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }
    #redveinItemPicker .rv-item-picker-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 220, 170, 0.18);
      background: rgba(255,255,255,0.05);
      color: #ffdca6;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.10em;
      margin-bottom: 10px;
    }
    #redveinItemPicker .rv-item-picker-title {
      margin: 0;
      color: #fff3f6;
      font-size: clamp(24px, 3vw, 34px);
      line-height: 1.1;
      font-weight: 900;
    }
    #redveinItemPicker .rv-item-picker-sub {
      margin-top: 8px;
      color: rgba(255, 231, 236, 0.84);
      font-size: 14px;
      line-height: 1.6;
    }
    #redveinItemPicker .rv-item-picker-close {
      flex: 0 0 auto;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255, 220, 170, 0.24);
      background: rgba(255,255,255,0.06);
      color: #fff0d8;
      font-weight: 800;
      cursor: pointer;
    }
    #redveinItemPicker .rv-item-picker-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    #redveinItemPicker .rv-item-picker-card {
      display: grid;
      grid-template-columns: 124px minmax(0, 1fr);
      gap: 12px;
      align-items: stretch;
      min-height: 186px;
      padding: 12px;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.10);
      background: linear-gradient(180deg, rgba(54, 22, 34, 0.92), rgba(24, 13, 19, 0.94));
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04), 0 10px 28px rgba(0,0,0,0.18);
    }
    #redveinItemPicker .rv-item-picker-card.used {
      opacity: 0.58;
      filter: grayscale(0.18);
    }
    #redveinItemPicker .rv-item-picker-image-wrap {
      border-radius: 16px;
      overflow: hidden;
      background: rgba(0,0,0,0.16);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #redveinItemPicker .rv-item-picker-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      aspect-ratio: 0.7;
    }
    #redveinItemPicker .rv-item-picker-fallback {
      display: none;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 12px;
      font-size: 18px;
      font-weight: 900;
      color: #fff4f7;
      background: radial-gradient(circle at 50% 20%, rgba(255, 118, 154, 0.18), rgba(0,0,0,0.18) 44%), linear-gradient(180deg, rgba(88, 26, 44, 1), rgba(22, 11, 17, 1));
    }
    #redveinItemPicker .rv-item-picker-body {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    #redveinItemPicker .rv-item-picker-name {
      color: #fff3f6;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 900;
    }
    #redveinItemPicker .rv-item-picker-meta {
      margin-top: 6px;
      color: rgba(255, 225, 230, 0.72);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    #redveinItemPicker .rv-item-picker-effect {
      margin-top: 10px;
      color: rgba(255, 238, 242, 0.92);
      font-size: 14px;
      line-height: 1.55;
      flex: 1 1 auto;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    #redveinItemPicker .rv-item-picker-actions {
      margin-top: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: space-between;
    }
    #redveinItemPicker .rv-item-picker-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
      color: rgba(255,236,240,0.76);
      font-size: 12px;
      font-weight: 800;
    }
    #redveinItemPicker .rv-item-picker-select {
      padding: 10px 14px;
      border-radius: 14px;
      border: 1px solid rgba(255, 218, 164, 0.28);
      background: linear-gradient(135deg, rgba(195, 61, 77, 0.94), rgba(124, 32, 57, 0.94));
      color: #fff4de;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 10px 28px rgba(0,0,0,0.22);
    }
    #redveinItemPicker .rv-item-picker-select:disabled {
      cursor: default;
      opacity: 0.5;
    }
    #redveinItemPicker .rv-item-picker-foot {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid rgba(255, 220, 170, 0.10);
      background: rgba(255,255,255,0.04);
      color: rgba(255, 233, 238, 0.78);
      font-size: 13px;
      line-height: 1.6;
    }
    body.rv-item-picker-open .board-center-area,
    body.rv-item-picker-open .score-bar,
    body.rv-item-picker-open .board-bottom-row,
    body.rv-item-picker-open .battle-side-panel,
    body.rv-item-picker-open #redveinActionGuide {
      filter: blur(1px) brightness(0.76);
      transition: filter 0.18s ease;
    }
    @media (max-width: 900px) {
      #redveinItemPicker {
        padding: 10px;
        align-items: flex-start;
      }
      #redveinItemPicker .rv-item-picker-panel {
        width: min(100%, calc(100vw - 12px));
        max-height: calc(100vh - 20px);
        padding: 14px 12px 16px;
      }
      #redveinItemPicker .rv-item-picker-grid {
        grid-template-columns: 1fr;
      }
      #redveinItemPicker .rv-item-picker-card {
        grid-template-columns: 104px minmax(0, 1fr);
        min-height: 164px;
      }
      #redveinItemPicker .rv-item-picker-name {
        font-size: 18px;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureItemPickerModal() {
  if (itemPickerRoot && document.body.contains(itemPickerRoot)) return itemPickerRoot;
  injectItemPickerStyles();
  if (!document.body) return null;
  itemPickerRoot = document.createElement('div');
  itemPickerRoot.id = 'redveinItemPicker';
  itemPickerRoot.innerHTML = `
    <div class="rv-item-picker-backdrop"></div>
    <div class="rv-item-picker-panel">
      <div class="rv-item-picker-header">
        <div>
          <div class="rv-item-picker-kicker">ITEM SELECT</div>
          <h2 class="rv-item-picker-title"></h2>
          <div class="rv-item-picker-sub"></div>
        </div>
        <button type="button" class="rv-item-picker-close" aria-label="閉じる">閉じる</button>
      </div>
      <div class="rv-item-picker-grid"></div>
      <div class="rv-item-picker-foot"></div>
    </div>
  `;
  document.body.appendChild(itemPickerRoot);
  itemPickerTitle = itemPickerRoot.querySelector('.rv-item-picker-title');
  itemPickerSub = itemPickerRoot.querySelector('.rv-item-picker-sub');
  itemPickerGrid = itemPickerRoot.querySelector('.rv-item-picker-grid');
  itemPickerFoot = itemPickerRoot.querySelector('.rv-item-picker-foot');
  itemPickerCloseButton = itemPickerRoot.querySelector('.rv-item-picker-close');
  itemPickerRoot.querySelector('.rv-item-picker-backdrop')?.addEventListener('click', () => setItemPickerOpen(false));
  itemPickerCloseButton?.addEventListener('click', () => setItemPickerOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && itemPickerOpen) {
      event.preventDefault();
      setItemPickerOpen(false);
    }
  });
  return itemPickerRoot;
}

function getItemPickerPlayerKey() {
  return hasItemDecisionFocus() && canViewPrivateZone(matchState.currentPlayer) ? matchState.currentPlayer : '';
}

function setItemPickerOpen(nextValue) {
  itemPickerOpen = !!nextValue;
  renderItemPickerModal();
}

function ensureItemPickerLaunchers() {
  [player1ItemSlot, player2ItemSlot].forEach((slot, index) => {
    if (!slot) return;
    const key = index === 0 ? 'player1' : 'player2';
    let button = itemPickerLaunchers.get(key);
    if (!button || !slot.contains(button)) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'rv-item-picker-launch';
      button.textContent = 'アイテム一覧';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (slot.dataset.itemPickerActive === '1') setItemPickerOpen(true);
      });
      slot.appendChild(button);
      itemPickerLaunchers.set(key, button);
      slot.addEventListener('click', (event) => {
        if (slot.dataset.itemPickerActive !== '1') return;
        if (event.target.closest('button, input, select, textarea, a')) return;
        if (event.target.closest('.side-card-item')) {
          setItemPickerOpen(true);
        }
      });
    }
  });
}

function renderItemPickerModal() {
  const root = ensureItemPickerModal();
  ensureItemPickerLaunchers();
  if (!root || !itemPickerGrid) return;

  const activePlayerKey = getItemPickerPlayerKey();
  if (!activePlayerKey || !itemPickerOpen) {
    root.classList.remove('rv-item-picker-visible');
    document.body.classList.remove('rv-item-picker-open');
    return;
  }

  const player = getPlayerState(activePlayerKey);
  const items = Array.isArray(player?.itemStates) ? player.itemStates : [];
  const activeLabel = getGuideSideLabel(activePlayerKey);
  if (itemPickerTitle) itemPickerTitle.textContent = `${activeLabel} のアイテムを選んでください`;
  if (itemPickerSub) itemPickerSub.textContent = '4枚をまとめて大きく表示しています。1枚選ぶと盤面へ戻って対象選択や使用確認へ進みます。';
  if (itemPickerFoot) itemPickerFoot.textContent = '今回はアイテムを使わないなら、ポップアップを閉じて「アイテムを使わず次へ」を押してください。';
  itemPickerGrid.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'rv-item-picker-foot';
    empty.textContent = '使えるアイテムがありません。';
    itemPickerGrid.appendChild(empty);
  }

  const selectedId = getSelectedItemCardId();
  items.forEach((itemState) => {
    const card = cardMap.get(itemState.cardId);
    if (!card) return;
    const cardNode = document.createElement('div');
    cardNode.className = `rv-item-picker-card ${itemState.used ? 'used' : ''}`.trim();

    const imageWrap = document.createElement('div');
    imageWrap.className = 'rv-item-picker-image-wrap';
    const image = document.createElement('img');
    image.className = 'rv-item-picker-image';
    image.alt = card.card_name || 'アイテム';
    const imagePath = getCardImagePath(card);
    const fallback = document.createElement('div');
    fallback.className = 'rv-item-picker-fallback';
    fallback.textContent = card.card_name || 'ITEM';
    if (imagePath) {
      image.src = imagePath;
      image.onerror = () => {
        image.style.display = 'none';
        fallback.style.display = 'flex';
      };
    } else {
      image.style.display = 'none';
      fallback.style.display = 'flex';
    }
    imageWrap.appendChild(image);
    imageWrap.appendChild(fallback);

    const body = document.createElement('div');
    body.className = 'rv-item-picker-body';
    const name = document.createElement('div');
    name.className = 'rv-item-picker-name';
    name.textContent = card.card_name || itemState.cardId;
    const meta = document.createElement('div');
    meta.className = 'rv-item-picker-meta';
    meta.textContent = `${typeLabel(card.type)} / ${String(card.rarity || '').toUpperCase()} / ${card.card_id || itemState.cardId}`;
    const effect = document.createElement('div');
    effect.className = 'rv-item-picker-effect';
    effect.textContent = card.effect_text || '効果なし';
    const actions = document.createElement('div');
    actions.className = 'rv-item-picker-actions';
    const pill = document.createElement('div');
    pill.className = 'rv-item-picker-pill';
    pill.textContent = itemState.used ? '使用済み' : (selectedId === itemState.cardId ? '選択中' : '未使用');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rv-item-picker-select';
    button.textContent = itemState.used ? '使用済み' : (selectedId === itemState.cardId ? '選択中' : 'このアイテムを選ぶ');
    button.disabled = !!itemState.used;
    button.addEventListener('click', () => {
      if (itemState.used) return;
      selectItemForUse(itemState.cardId);
      setItemPickerOpen(false);
    });
    actions.appendChild(pill);
    actions.appendChild(button);

    body.appendChild(name);
    body.appendChild(meta);
    body.appendChild(effect);
    body.appendChild(actions);

    cardNode.appendChild(imageWrap);
    cardNode.appendChild(body);
    itemPickerGrid.appendChild(cardNode);
  });

  root.classList.add('rv-item-picker-visible');
  document.body.classList.add('rv-item-picker-open');
}



function injectFieldPopupStyles() {
  if (document.getElementById('redveinFieldPopupStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinFieldPopupStyle';
  style.textContent = `
    #redveinFieldPopup {
      position: fixed;
      inset: 0;
      z-index: 2400;
      pointer-events: none;
      opacity: 0;
      transition: opacity 180ms ease;
    }
    #redveinFieldPopup.rv-field-popup-visible {
      opacity: 1;
      pointer-events: auto;
    }
    #redveinFieldPopup .rv-field-popup-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(7, 4, 10, 0.72);
      backdrop-filter: blur(5px);
    }
    #redveinFieldPopup .rv-field-popup-panel {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.96);
      width: min(820px, calc(100vw - 36px));
      border-radius: 28px;
      padding: 24px;
      border: 1px solid rgba(255, 184, 120, 0.38);
      background:
        radial-gradient(circle at top, rgba(160, 30, 60, 0.22), transparent 48%),
        linear-gradient(180deg, rgba(44, 14, 22, 0.96), rgba(18, 8, 12, 0.96));
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.48), 0 0 38px rgba(196, 64, 92, 0.2);
      display: grid;
      grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
      gap: 22px;
      align-items: center;
      transition: transform 220ms ease;
      color: #fff1f3;
    }
    #redveinFieldPopup.rv-field-popup-visible .rv-field-popup-panel {
      transform: translate(-50%, -50%) scale(1);
    }
    #redveinFieldPopup .rv-field-popup-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #redveinFieldPopup .rv-field-popup-card {
      width: min(100%, 260px);
      aspect-ratio: 672 / 958;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 198, 138, 0.34);
      box-shadow: 0 22px 50px rgba(0, 0, 0, 0.4), 0 0 26px rgba(255, 164, 116, 0.18);
      background: linear-gradient(180deg, rgba(30, 14, 18, 0.98), rgba(14, 8, 10, 0.98));
      position: relative;
    }
    #redveinFieldPopup .rv-field-popup-image,
    #redveinFieldPopup .rv-field-popup-fallback {
      width: 100%;
      height: 100%;
      display: block;
    }
    #redveinFieldPopup .rv-field-popup-image {
      object-fit: cover;
      background: #12090d;
    }
    #redveinFieldPopup .rv-field-popup-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 0.12em;
      color: rgba(255, 216, 172, 0.88);
      background:
        radial-gradient(circle at 50% 30%, rgba(220, 78, 92, 0.24), transparent 42%),
        linear-gradient(180deg, rgba(46, 14, 22, 0.98), rgba(16, 8, 12, 0.98));
    }
    #redveinFieldPopup .rv-field-popup-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #redveinFieldPopup .rv-field-popup-badge-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    #redveinFieldPopup .rv-field-popup-badge,
    #redveinFieldPopup .rv-field-popup-owner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 32px;
      padding: 0 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid rgba(255, 205, 152, 0.34);
      background: rgba(64, 20, 28, 0.82);
      color: #ffe0c4;
    }
    #redveinFieldPopup .rv-field-popup-title {
      font-size: clamp(28px, 3.1vw, 42px);
      font-weight: 900;
      line-height: 1.08;
      color: #fff7f2;
      text-shadow: 0 4px 18px rgba(0, 0, 0, 0.34);
    }
    #redveinFieldPopup .rv-field-popup-meta {
      font-size: 14px;
      font-weight: 700;
      color: rgba(255, 214, 184, 0.88);
      letter-spacing: 0.04em;
    }
    #redveinFieldPopup .rv-field-popup-effect {
      font-size: clamp(16px, 1.55vw, 19px);
      line-height: 1.72;
      color: #ffe7dc;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid rgba(255, 188, 118, 0.2);
      background: rgba(255, 255, 255, 0.04);
      box-shadow: inset 0 0 24px rgba(255, 255, 255, 0.02);
      white-space: pre-wrap;
    }
    #redveinFieldPopup .rv-field-popup-actions {
      display: flex;
      justify-content: flex-end;
    }
    #redveinFieldPopup .rv-field-popup-close {
      min-width: 132px;
      min-height: 46px;
      border-radius: 999px;
      border: 1px solid rgba(255, 200, 130, 0.38);
      background: linear-gradient(180deg, rgba(126, 40, 58, 0.95), rgba(82, 24, 38, 0.96));
      color: #fff6f2;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
    }
    .field-slot.field-popup-enabled .field-card-rich,
    .field-slot.field-popup-enabled .side-card-item {
      cursor: pointer;
    }
    .field-slot.field-popup-enabled .field-card-rich {
      position: relative;
    }
    .field-slot.field-popup-enabled .field-card-rich::after {
      content: '開く';
      position: absolute;
      right: 10px;
      top: 10px;
      min-width: 42px;
      min-height: 24px;
      padding: 0 10px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(70, 24, 32, 0.84);
      border: 1px solid rgba(255, 198, 128, 0.38);
      color: #ffe0c6;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.06em;
      pointer-events: none;
    }
    @media (max-width: 900px) {
      #redveinFieldPopup .rv-field-popup-panel {
        grid-template-columns: 1fr;
        width: min(92vw, 540px);
        gap: 18px;
        padding: 20px;
      }
      #redveinFieldPopup .rv-field-popup-visual {
        justify-content: center;
      }
      #redveinFieldPopup .rv-field-popup-card {
        width: min(74vw, 250px);
      }
      #redveinFieldPopup .rv-field-popup-title {
        font-size: 28px;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureFieldPopupModal() {
  if (fieldPopupRoot && document.body.contains(fieldPopupRoot)) return fieldPopupRoot;
  injectFieldPopupStyles();
  const root = document.createElement('div');
  root.id = 'redveinFieldPopup';
  root.innerHTML = `
    <div class="rv-field-popup-backdrop"></div>
    <div class="rv-field-popup-panel">
      <div class="rv-field-popup-visual">
        <div class="rv-field-popup-card">
          <img class="rv-field-popup-image" alt="環境カード">
          <div class="rv-field-popup-fallback">FIELD</div>
        </div>
      </div>
      <div class="rv-field-popup-copy">
        <div class="rv-field-popup-badge-row">
          <div class="rv-field-popup-badge">FIELD CARD</div>
          <div class="rv-field-popup-owner"></div>
        </div>
        <div class="rv-field-popup-title"></div>
        <div class="rv-field-popup-meta">環境カード</div>
        <div class="rv-field-popup-effect"></div>
        <div class="rv-field-popup-actions">
          <button type="button" class="rv-field-popup-close">閉じる</button>
        </div>
      </div>
    </div>
  `;
  fieldPopupRoot = root;
  fieldPopupImage = root.querySelector('.rv-field-popup-image');
  fieldPopupFallback = root.querySelector('.rv-field-popup-fallback');
  fieldPopupName = root.querySelector('.rv-field-popup-title');
  fieldPopupMeta = root.querySelector('.rv-field-popup-meta');
  fieldPopupEffect = root.querySelector('.rv-field-popup-effect');
  fieldPopupBadge = root.querySelector('.rv-field-popup-badge');
  fieldPopupOwner = root.querySelector('.rv-field-popup-owner');
  fieldPopupCloseButton = root.querySelector('.rv-field-popup-close');
  root.querySelector('.rv-field-popup-backdrop')?.addEventListener('click', () => setFieldPopupOpen(false));
  fieldPopupCloseButton?.addEventListener('click', () => setFieldPopupOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && fieldPopupRoot?.classList.contains('rv-field-popup-visible')) {
      setFieldPopupOpen(false);
    }
  });
  document.body.appendChild(root);
  return root;
}

function setFieldPopupOpen(open) {
  const root = ensureFieldPopupModal();
  if (!root) return;
  root.classList.toggle('rv-field-popup-visible', !!open);
}

function openFieldPopup(playerKey) {
  const player = getPlayerState(playerKey);
  const card = cardMap.get(player?.fieldId || '');
  if (!player || !card) return;
  const root = ensureFieldPopupModal();
  if (!root) return;
  if (fieldPopupImage) {
    fieldPopupImage.src = getCardImagePath(card);
    fieldPopupImage.alt = card.card_name || '環境カード';
    fieldPopupImage.hidden = false;
  }
  if (fieldPopupFallback) {
    fieldPopupFallback.hidden = true;
  }
  if (fieldPopupName) fieldPopupName.textContent = card.card_name || '環境カード';
  if (fieldPopupMeta) fieldPopupMeta.textContent = `環境カード / ${PLAYER_LABEL[playerKey]}`;
  if (fieldPopupEffect) fieldPopupEffect.textContent = card.effect_text || '効果なし';
  if (fieldPopupBadge) fieldPopupBadge.textContent = 'FIELD CARD';
  if (fieldPopupOwner) fieldPopupOwner.textContent = `${PLAYER_LABEL[playerKey]} の環境`;
  setFieldPopupOpen(true);
}

function injectItemShowcaseStyles() {
  if (document.getElementById('redveinItemShowcaseStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinItemShowcaseStyle';
  style.textContent = `
    #redveinItemShowcase {
      position: fixed;
      inset: 0;
      z-index: 10002;
      display: grid;
      place-items: center;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.22s ease;
    }
    #redveinItemShowcase.rv-item-showcase-visible {
      opacity: 1;
    }
    #redveinItemShowcase .rv-item-showcase-backdrop {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(120, 20, 44, 0.22), rgba(5, 4, 8, 0.64));
      backdrop-filter: blur(4px);
    }
    #redveinItemShowcase .rv-item-showcase-panel {
      position: relative;
      width: min(440px, calc(100vw - 28px));
      border-radius: 26px;
      padding: 18px 18px 20px;
      border: 1px solid rgba(255, 220, 160, 0.28);
      background: linear-gradient(180deg, rgba(33, 15, 23, 0.96), rgba(17, 10, 16, 0.94));
      box-shadow: 0 24px 90px rgba(0, 0, 0, 0.45), 0 0 40px rgba(255, 88, 116, 0.14);
      text-align: center;
      transform: translateY(12px) scale(0.94);
      transition: transform 0.24s ease;
      overflow: hidden;
    }
    #redveinItemShowcase.rv-item-showcase-visible .rv-item-showcase-panel {
      transform: translateY(0) scale(1);
    }
    #redveinItemShowcase .rv-item-showcase-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 216, 158, 0.28);
      background: rgba(255,255,255,0.06);
      color: #ffdca6;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    #redveinItemShowcase .rv-item-showcase-card-wrap {
      margin: 14px auto 0;
      width: min(270px, 66vw);
    }
    #redveinItemShowcase .rv-item-showcase-card {
      position: relative;
      aspect-ratio: 0.7;
      border-radius: 22px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: linear-gradient(180deg, rgba(95, 32, 49, 0.94), rgba(24, 12, 18, 0.96));
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.34), 0 0 32px rgba(255, 132, 160, 0.16);
    }
    #redveinItemShowcase .rv-item-showcase-image,
    #redveinItemShowcase .rv-item-showcase-fallback {
      width: 100%;
      height: 100%;
      display: block;
    }
    #redveinItemShowcase .rv-item-showcase-image {
      object-fit: cover;
      background: rgba(0, 0, 0, 0.2);
    }
    #redveinItemShowcase .rv-item-showcase-fallback {
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: #fff3f5;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-shadow: 0 2px 20px rgba(0,0,0,0.35);
      background: radial-gradient(circle at 50% 20%, rgba(255, 118, 154, 0.22), rgba(0,0,0,0.14) 42%), linear-gradient(180deg, rgba(88, 26, 44, 1), rgba(22, 11, 17, 1));
    }
    #redveinItemShowcase .rv-item-showcase-name {
      margin-top: 14px;
      color: #fff4f6;
      font-size: 28px;
      line-height: 1.25;
      font-weight: 900;
      text-shadow: 0 2px 12px rgba(0,0,0,0.25);
    }
    #redveinItemShowcase .rv-item-showcase-meta {
      margin-top: 8px;
      color: rgba(255, 226, 232, 0.76);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    #redveinItemShowcase .rv-item-showcase-effect {
      margin-top: 10px;
      color: rgba(255, 236, 240, 0.94);
      font-size: 14px;
      line-height: 1.55;
    }
    @media (max-width: 900px) {
      #redveinItemShowcase .rv-item-showcase-panel {
        width: min(360px, calc(100vw - 20px));
        padding: 16px 14px 18px;
      }
      #redveinItemShowcase .rv-item-showcase-name {
        font-size: 22px;
      }
      #redveinItemShowcase .rv-item-showcase-card-wrap {
        width: min(220px, 62vw);
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureItemShowcase() {
  if (itemShowcaseRoot && document.body.contains(itemShowcaseRoot)) return itemShowcaseRoot;
  injectItemShowcaseStyles();
  if (!document.body) return null;
  itemShowcaseRoot = document.createElement('div');
  itemShowcaseRoot.id = 'redveinItemShowcase';
  itemShowcaseRoot.innerHTML = `
    <div class="rv-item-showcase-backdrop"></div>
    <div class="rv-item-showcase-panel">
      <div class="rv-item-showcase-badge">ITEM USED</div>
      <div class="rv-item-showcase-card-wrap">
        <div class="rv-item-showcase-card">
          <img class="rv-item-showcase-image" alt="使用アイテム">
          <div class="rv-item-showcase-fallback"></div>
        </div>
      </div>
      <div class="rv-item-showcase-name"></div>
      <div class="rv-item-showcase-meta"></div>
      <div class="rv-item-showcase-effect"></div>
    </div>
  `;
  document.body.appendChild(itemShowcaseRoot);
  itemShowcaseImage = itemShowcaseRoot.querySelector('.rv-item-showcase-image');
  itemShowcaseFallback = itemShowcaseRoot.querySelector('.rv-item-showcase-fallback');
  itemShowcaseName = itemShowcaseRoot.querySelector('.rv-item-showcase-name');
  itemShowcaseMeta = itemShowcaseRoot.querySelector('.rv-item-showcase-meta');
  itemShowcaseEffect = itemShowcaseRoot.querySelector('.rv-item-showcase-effect');
  return itemShowcaseRoot;
}

function hideItemShowcase(immediate = false, delayMs = 1050) {
  if (itemShowcaseHideTimer) {
    clearTimeout(itemShowcaseHideTimer);
    itemShowcaseHideTimer = null;
  }
  if (!itemShowcaseRoot) return;
  if (immediate) {
    itemShowcaseRoot.classList.remove('rv-item-showcase-visible');
    return;
  }
  itemShowcaseHideTimer = setTimeout(() => {
    itemShowcaseRoot?.classList.remove('rv-item-showcase-visible');
    itemShowcaseHideTimer = null;
  }, Math.max(0, Number(delayMs || 1050)));
}

function showItemShowcase(card, options = {}) {
  if (!card || card.type !== 'item') return;
  const root = ensureItemShowcase();
  if (!root) return;
  const imagePath = getCardImagePath(card);
  if (itemShowcaseName) itemShowcaseName.textContent = card.card_name || 'アイテム';
  if (itemShowcaseMeta) itemShowcaseMeta.textContent = `${typeLabel(card.type)} / ${String(card.rarity || '').toUpperCase()} / ${card.card_id || ''}`;
  if (itemShowcaseEffect) itemShowcaseEffect.textContent = card.effect_text || '効果発動';
  if (itemShowcaseFallback) {
    itemShowcaseFallback.textContent = card.card_name || 'ITEM';
    itemShowcaseFallback.style.display = imagePath ? 'none' : 'flex';
  }
  if (itemShowcaseImage) {
    if (imagePath) {
      itemShowcaseImage.style.display = 'block';
      itemShowcaseImage.src = imagePath;
      itemShowcaseImage.alt = `${card.card_name || 'アイテム'} の画像`;
      itemShowcaseImage.onerror = () => {
        itemShowcaseImage.style.display = 'none';
        if (itemShowcaseFallback) itemShowcaseFallback.style.display = 'flex';
      };
      itemShowcaseImage.onload = () => {
        itemShowcaseImage.style.display = 'block';
        if (itemShowcaseFallback) itemShowcaseFallback.style.display = 'none';
      };
    } else {
      itemShowcaseImage.removeAttribute('src');
      itemShowcaseImage.style.display = 'none';
    }
  }
  if (itemShowcaseHideTimer) {
    clearTimeout(itemShowcaseHideTimer);
    itemShowcaseHideTimer = null;
  }
  root.classList.remove('rv-item-showcase-visible');
  void root.offsetWidth;
  root.classList.add('rv-item-showcase-visible');
  hideItemShowcase(false, Number(options.displayMs || 1050));
}

function playItemPresentationSequence(card, fx = {}) {
  if (!card || card.type !== 'item') return;
  const visual = buildItemEffectVisual(card, fx);
  const targetCount = Math.max(1, uniqueBoardIndices(visual.targets || fx.targets || []).length);
  const showcaseMs = Math.max(820, Number(fx.showcaseMs || 1080));
  const gapMs = Math.max(30, Number(fx.effectGapMs || 80));
  const effectStartDelay = showcaseMs + gapMs;
  const overlayMs = Math.max(420, Number(visual.overlayMs || 920));
  const pulseMs = Math.max(420, Number(visual.pulseMs || 940));
  const staggerMs = Math.max(0, Number(visual.staggerMs || 0));
  const pulseTailMs = targetCount > 0 ? ((targetCount - 1) * staggerMs) + pulseMs : 0;
  const impactTailMs = Array.isArray(fx.impacts) && fx.impacts.length
    ? 180 + ((fx.impacts.length - 1) * Math.max(70, staggerMs))
    : 0;
  const totalMs = effectStartDelay + Math.max(overlayMs, pulseTailMs, impactTailMs) + 220;
  holdCombatFxFor(totalMs);
  showItemShowcase(card, { displayMs: showcaseMs });
  rememberCombatFxTimer(setTimeout(() => {
    playItemEffectSequence(card, { ...fx, startDelay: 0, skipHold: true });
  }, effectStartDelay));
}

function injectItemEffectStyles() {
  if (document.getElementById('redveinItemEffectStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinItemEffectStyle';
  style.textContent = `
    #redveinItemEffectOverlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 10003;
      opacity: 0;
      transition: opacity 0.2s ease;
      --rv-item-fx-accent: rgba(255, 164, 87, 0.75);
      --rv-item-fx-accent-soft: rgba(255, 164, 87, 0.22);
      --rv-item-fx-glow: rgba(255, 164, 87, 0.42);
    }
    #redveinItemEffectOverlay.rv-item-effect-visible {
      opacity: 1;
    }
    #redveinItemEffectOverlay .rv-item-effect-wash {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 50% 44%, var(--rv-item-fx-glow), transparent 54%),
        linear-gradient(180deg, rgba(7, 4, 8, 0.02), rgba(7, 4, 8, 0.18));
      animation: rvItemEffectWash 0.85s ease forwards;
    }
    #redveinItemEffectOverlay .rv-item-effect-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      width: min(44vw, 440px);
      aspect-ratio: 1;
      border-radius: 999px;
      border: 2px solid var(--rv-item-fx-accent);
      box-shadow: 0 0 40px var(--rv-item-fx-glow), inset 0 0 30px var(--rv-item-fx-accent-soft);
      transform: translate(-50%, -50%) scale(0.62);
      animation: rvItemEffectRing 0.95s cubic-bezier(.18,.8,.2,1) forwards;
    }
    #redveinItemEffectOverlay .rv-item-effect-copy {
      position: absolute;
      left: 50%;
      top: min(24vh, 176px);
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
      filter: drop-shadow(0 8px 18px rgba(0,0,0,0.34));
      animation: rvItemEffectCopy 0.95s ease forwards;
    }
    #redveinItemEffectOverlay .rv-item-effect-label {
      padding: 6px 12px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--rv-item-fx-accent) 76%, white 24%);
      background: color-mix(in srgb, var(--rv-item-fx-accent-soft) 88%, transparent 12%);
      color: white;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.16em;
    }
    #redveinItemEffectOverlay .rv-item-effect-title {
      color: #fff6f8;
      font-size: clamp(26px, 4vw, 42px);
      font-weight: 900;
      letter-spacing: 0.08em;
      text-shadow: 0 0 18px rgba(0,0,0,0.38);
    }
    #redveinItemEffectOverlay .rv-item-effect-sub {
      color: rgba(255, 244, 247, 0.92);
      font-size: clamp(12px, 1.6vw, 16px);
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .board-cell.rv-itemfx-fire::after,
    .board-cell.rv-itemfx-heal::after,
    .board-cell.rv-itemfx-shield::after,
    .board-cell.rv-itemfx-smoke::after,
    .board-cell.rv-itemfx-haste::after,
    .board-cell.rv-itemfx-burst::after,
    .board-cell.rv-itemfx-freeze::after,
    .board-cell.rv-itemfx-power::after,
    .board-cell.rv-itemfx-break::after,
    .board-cell.rv-itemfx-bless::after {
      content: '';
      position: absolute;
      inset: 6px;
      border-radius: 16px;
      pointer-events: none;
      animation: rvItemCellPulse 0.92s ease forwards;
      z-index: 4;
    }
    .board-cell.rv-itemfx-fire::after {
      background: radial-gradient(circle, rgba(255, 184, 64, 0.26), rgba(255, 84, 32, 0.54));
      box-shadow: 0 0 22px rgba(255, 108, 46, 0.62), inset 0 0 14px rgba(255, 224, 160, 0.2);
    }
    .board-cell.rv-itemfx-heal::after {
      background: radial-gradient(circle, rgba(120, 255, 182, 0.18), rgba(45, 214, 133, 0.46));
      box-shadow: 0 0 20px rgba(78, 226, 149, 0.55), inset 0 0 12px rgba(206, 255, 232, 0.22);
    }
    .board-cell.rv-itemfx-shield::after {
      background: radial-gradient(circle, rgba(125, 198, 255, 0.18), rgba(60, 132, 255, 0.46));
      box-shadow: 0 0 20px rgba(100, 162, 255, 0.56), inset 0 0 12px rgba(208, 229, 255, 0.26);
    }
    .board-cell.rv-itemfx-smoke::after {
      background: radial-gradient(circle, rgba(195, 195, 195, 0.14), rgba(80, 80, 92, 0.46));
      box-shadow: 0 0 20px rgba(145, 145, 160, 0.34), inset 0 0 12px rgba(246, 246, 255, 0.08);
    }
    .board-cell.rv-itemfx-haste::after {
      background: radial-gradient(circle, rgba(255, 232, 98, 0.15), rgba(255, 192, 41, 0.46));
      box-shadow: 0 0 20px rgba(255, 211, 82, 0.5), inset 0 0 12px rgba(255, 244, 188, 0.18);
    }
    .board-cell.rv-itemfx-burst::after {
      background: radial-gradient(circle, rgba(255, 212, 85, 0.18), rgba(255, 83, 34, 0.56));
      box-shadow: 0 0 28px rgba(255, 98, 48, 0.66), inset 0 0 14px rgba(255, 236, 190, 0.18);
    }
    .board-cell.rv-itemfx-freeze::after {
      background: radial-gradient(circle, rgba(164, 240, 255, 0.16), rgba(77, 155, 255, 0.48));
      box-shadow: 0 0 22px rgba(102, 188, 255, 0.6), inset 0 0 12px rgba(220, 246, 255, 0.22);
    }
    .board-cell.rv-itemfx-power::after {
      background: radial-gradient(circle, rgba(255, 184, 235, 0.15), rgba(240, 82, 171, 0.48));
      box-shadow: 0 0 22px rgba(247, 110, 196, 0.6), inset 0 0 12px rgba(255, 219, 244, 0.18);
    }
    .board-cell.rv-itemfx-break::after {
      background: radial-gradient(circle, rgba(255, 230, 194, 0.14), rgba(255, 133, 89, 0.48));
      box-shadow: 0 0 22px rgba(255, 130, 80, 0.62), inset 0 0 12px rgba(255, 238, 214, 0.2);
    }
    .board-cell.rv-itemfx-bless::after {
      background: radial-gradient(circle, rgba(255, 255, 220, 0.16), rgba(255, 238, 158, 0.44));
      box-shadow: 0 0 24px rgba(255, 237, 140, 0.58), inset 0 0 14px rgba(255, 252, 214, 0.18);
    }
    .board-cell .rv-itemfx-word {
      position: absolute;
      left: 50%;
      top: 15%;
      transform: translate(-50%, -50%);
      z-index: 6;
      padding: 4px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.22);
      background: rgba(20, 10, 14, 0.78);
      color: #fff6f8;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      white-space: nowrap;
      pointer-events: none;
      text-shadow: 0 1px 6px rgba(0,0,0,0.3);
      box-shadow: 0 6px 16px rgba(0,0,0,0.24);
      animation: rvItemFxWord 0.95s ease forwards;
    }
    .board-cell .rv-itemfx-word.rv-tone-heal { background: rgba(18, 72, 48, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-fire { background: rgba(94, 36, 18, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-shield { background: rgba(20, 48, 92, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-smoke { background: rgba(48, 48, 58, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-haste { background: rgba(92, 74, 18, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-break { background: rgba(96, 42, 26, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-freeze { background: rgba(22, 62, 96, 0.84); }
    .board-cell .rv-itemfx-word.rv-tone-power { background: rgba(92, 28, 74, 0.84); }
    @keyframes rvItemEffectWash {
      0% { opacity: 0; }
      18% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes rvItemEffectRing {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.62); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.28); }
    }
    @keyframes rvItemEffectCopy {
      0% { opacity: 0; transform: translate(-50%, -10px) scale(0.96); }
      18% { opacity: 1; transform: translate(-50%, 0) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -26px) scale(1.01); }
    }
    @keyframes rvItemCellPulse {
      0% { opacity: 0; transform: scale(0.88); }
      20% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.08); }
    }
    @keyframes rvItemFxWord {
      0% { opacity: 0; transform: translate(-50%, -44%) scale(0.84); }
      18% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -92%) scale(1.02); }
    }
  `;
  document.head.appendChild(style);
}

function injectSpectatorHudStyles() {
  if (document.getElementById('redveinSpectatorHudStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinSpectatorHudStyle';
  style.textContent = `
    #redveinSpectatorHud {
      display: none;
      margin-bottom: 14px;
    }
    #redveinSpectatorHud.rv-spectator-visible {
      display: block;
    }
    #redveinSpectatorHud .rv-spectator-panel {
      border-radius: 22px;
      border: 1px solid rgba(255, 204, 150, 0.24);
      background: linear-gradient(180deg, rgba(40, 17, 26, 0.96), rgba(18, 11, 17, 0.96));
      box-shadow: 0 18px 42px rgba(0,0,0,0.24), 0 0 28px rgba(255, 105, 140, 0.08);
      padding: 14px 16px 16px;
      position: relative;
      overflow: hidden;
    }
    #redveinSpectatorHud .rv-spectator-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at top right, rgba(112, 170, 255, 0.12), transparent 38%), radial-gradient(circle at top left, rgba(255, 112, 144, 0.12), transparent 34%);
      opacity: 0.9;
    }
    #redveinSpectatorHud .rv-spectator-top,
    #redveinSpectatorHud .rv-spectator-bottom {
      position: relative;
      z-index: 1;
    }
    #redveinSpectatorHud .rv-spectator-top {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: start;
    }
    #redveinSpectatorHud .rv-spectator-title {
      color: #fff6f7;
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    #redveinSpectatorHud .rv-spectator-main {
      color: #fff4f5;
      font-size: 24px;
      line-height: 1.2;
      font-weight: 900;
      text-shadow: 0 2px 18px rgba(0,0,0,0.28);
    }
    #redveinSpectatorHud .rv-spectator-sub {
      margin-top: 8px;
      color: rgba(255, 225, 231, 0.84);
      font-size: 13px;
      line-height: 1.5;
    }
    #redveinSpectatorHud .rv-spectator-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      align-items: center;
      min-width: 180px;
    }
    #redveinSpectatorHud .rv-spectator-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: #ffe6ea;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      backdrop-filter: blur(3px);
    }
    #redveinSpectatorHud .rv-spectator-chip.turn-p1 {
      border-color: rgba(255, 126, 152, 0.4);
      background: rgba(120, 24, 46, 0.38);
      color: #ffd8e1;
    }
    #redveinSpectatorHud .rv-spectator-chip.turn-p2 {
      border-color: rgba(122, 164, 255, 0.38);
      background: rgba(24, 40, 94, 0.38);
      color: #dbe8ff;
    }
    #redveinSpectatorHud .rv-spectator-bottom {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 12px;
    }
    #redveinSpectatorHud .rv-spectator-score-card {
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.09);
      background: rgba(255,255,255,0.05);
      padding: 10px 12px;
      min-height: 78px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    #redveinSpectatorHud .rv-spectator-score-card.p1 {
      box-shadow: inset 0 0 0 1px rgba(255, 116, 150, 0.10);
    }
    #redveinSpectatorHud .rv-spectator-score-card.p2 {
      box-shadow: inset 0 0 0 1px rgba(112, 160, 255, 0.10);
    }
    #redveinSpectatorHud .rv-spectator-score-label {
      color: rgba(255, 220, 226, 0.72);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    #redveinSpectatorHud .rv-spectator-score-value {
      margin-top: 6px;
      color: #fff9fa;
      font-size: 28px;
      line-height: 1;
      font-weight: 900;
    }
    #redveinSpectatorHud .rv-spectator-score-detail {
      margin-top: 6px;
      color: rgba(255, 230, 235, 0.76);
      font-size: 12px;
      line-height: 1.4;
    }
    .player-box.rv-spectator-focus-box {
      box-shadow: 0 0 0 1px rgba(255, 212, 160, 0.16), 0 0 24px rgba(255, 178, 120, 0.10), inset 0 0 0 1px rgba(255,255,255,0.02);
      transform: translateY(-1px);
    }
    .score-item.rv-spectator-focus-score {
      border-color: rgba(255, 217, 174, 0.42) !important;
      box-shadow: 0 0 24px rgba(255, 173, 122, 0.16), inset 0 0 0 1px rgba(255,255,255,0.06);
    }
    @media (max-width: 1100px) {
      #redveinSpectatorHud .rv-spectator-top {
        grid-template-columns: 1fr;
      }
      #redveinSpectatorHud .rv-spectator-meta {
        justify-content: flex-start;
      }
      #redveinSpectatorHud .rv-spectator-main {
        font-size: 20px;
      }
      #redveinSpectatorHud .rv-spectator-bottom {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureSpectatorHud() {
  if (spectatorHudRoot) return;
  injectSpectatorHudStyles();
  const boardCenter = boardGrid?.parentElement;
  const scoreBar = document.getElementById('scoreBar');
  if (!boardCenter || !scoreBar) return;

  spectatorHudRoot = document.createElement('section');
  spectatorHudRoot.id = 'redveinSpectatorHud';
  spectatorHudRoot.innerHTML = `
    <div class="rv-spectator-panel">
      <div class="rv-spectator-top">
        <div>
          <div class="rv-spectator-title" id="redveinSpectatorHudTitle">観戦ビュー</div>
          <div class="rv-spectator-main" id="redveinSpectatorHudMain">-</div>
          <div class="rv-spectator-sub" id="redveinSpectatorHudSub">-</div>
        </div>
        <div class="rv-spectator-meta" id="redveinSpectatorHudMeta"></div>
      </div>
      <div class="rv-spectator-bottom">
        <div class="rv-spectator-score-card p1">
          <div class="rv-spectator-score-label">P1</div>
          <div class="rv-spectator-score-value" id="redveinSpectatorHudScoreP1">0</div>
          <div class="rv-spectator-score-detail" id="redveinSpectatorHudScoreP1Detail">撃破 0 / 残り 0体</div>
        </div>
        <div class="rv-spectator-score-card p2">
          <div class="rv-spectator-score-label">P2</div>
          <div class="rv-spectator-score-value" id="redveinSpectatorHudScoreP2">0</div>
          <div class="rv-spectator-score-detail" id="redveinSpectatorHudScoreP2Detail">撃破 0 / 残り 0体</div>
        </div>
      </div>
    </div>
  `;
  boardCenter.insertBefore(spectatorHudRoot, scoreBar);
  spectatorHudTitle = document.getElementById('redveinSpectatorHudTitle');
  spectatorHudMain = document.getElementById('redveinSpectatorHudMain');
  spectatorHudSub = document.getElementById('redveinSpectatorHudSub');
  spectatorHudMeta = document.getElementById('redveinSpectatorHudMeta');
  spectatorHudScoreP1 = document.getElementById('redveinSpectatorHudScoreP1');
  spectatorHudScoreP2 = document.getElementById('redveinSpectatorHudScoreP2');
}

function getSpectatorHudState() {
  if (!(roomSyncState.enabled && roomSyncState.role === 'spectator' && matchState.active)) return null;

  const currentLabel = PLAYER_LABEL[matchState.currentPlayer] || 'プレイヤー';
  const latestLog = matchState.log[0] || '最新の行動はここに表示されます。';
  const chips = ['観戦中', `Round ${matchState.round}`];
  let title = '観戦ビュー';
  let main = `${currentLabel} の手番です`;
  let sub = `${latestLog} / 手札は非公開で表示されます。`;
  let activePlayer = matchState.currentPlayer;

  if (matchState.phase === 'setup') {
    const step = getCurrentSetupStep();
    const remaining = step ? Math.max(0, step.count - matchState.placedInCurrentStep) : 0;
    title = '観戦ビュー / 配置フェーズ';
    main = `${PLAYER_LABEL[step?.player || matchState.currentPlayer]} が配置中です`;
    sub = `残り ${remaining} 枚。最新ログ: ${latestLog}`;
    chips.push('配置');
    activePlayer = step?.player || matchState.currentPlayer;
  } else if (matchState.phase === 'battle') {
    chips.push('対戦中');
    const pendingAction = getPendingAction();
    const selectedItem = getSelectedItemCard();
    if (pendingAction) {
      if (pendingAction.type === 'move' || pendingAction.type === 'postAttackMove') {
        main = `${currentLabel} が移動を確定中です`;
        sub = `${pendingAction.unitName} を ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ移動予定。`;
        chips.push('移動確認');
      } else {
        main = `${currentLabel} が攻撃を確定中です`;
        sub = `${pendingAction.unitName} → ${pendingAction.targetName} / 最新ログ: ${latestLog}`;
        chips.push('攻撃確認');
      }
    } else if (getPostAttackMoveUnit()) {
      const unit = getPostAttackMoveUnit();
      main = `${currentLabel} が攻撃後移動を選択中です`;
      sub = `${unit?.name || 'ユニット'} の追加移動先を選んでいます。`;
      chips.push('追加移動');
    } else if (isItemWindowOpen()) {
      if (selectedItem) {
        const selectedTarget = getSelectedItemTargetUnit();
        main = `${currentLabel} がアイテムを使用中です`;
        sub = selectedTarget
          ? `${selectedItem.card_name} → ${selectedTarget.name} / 確定待ちです。`
          : `${selectedItem.card_name} の対象を選択中です。`;
        chips.push('アイテム');
      } else {
        main = `${currentLabel} のアイテムフェーズです`;
        sub = 'アイテムを使うか、そのまま次へ進むかを選んでいます。';
        chips.push('アイテム');
      }
    } else {
      const moveText = matchState.turnState?.moved ? '移動済み' : '移動可能';
      let attackText = matchState.turnState?.attacked ? '攻撃済み' : '攻撃可能';
      if (currentPlayerCannotAttackAfterMove(getCurrentUnitForFieldRestrictionCheck())) attackText = '移動後攻撃不可';
      main = `${currentLabel} が盤面を操作中です`;
      sub = `${moveText} / ${attackText} / 最新ログ: ${latestLog}`;
      chips.push(matchState.currentPlayer === 'player1' ? 'P1 TURN' : 'P2 TURN');
    }
  } else if (matchState.phase === 'finished') {
    title = '試合結果';
    main = matchState.winner || '対戦が終了しました';
    sub = `再戦・リセットの申請状況は下の試合操作から確認できます。`;
    chips.push('終了');
    if ((matchState.winner || '').includes('プレイヤー1')) activePlayer = 'player1';
    else if ((matchState.winner || '').includes('プレイヤー2')) activePlayer = 'player2';
    else activePlayer = '';
  }

  return {
    title,
    main,
    sub,
    chips,
    activePlayer,
    p1Points: calculatePoints('player1'),
    p2Points: calculatePoints('player2'),
    p1Defeated: Number(getPlayerState('player1').defeated || 0),
    p2Defeated: Number(getPlayerState('player2').defeated || 0),
    p1Living: getLivingUnits('player1').length,
    p2Living: getLivingUnits('player2').length,
  };
}

function updateSpectatorHud() {
  ensureSpectatorHud();
  const state = getSpectatorHudState();

  player1Box?.classList.remove('rv-spectator-focus-box');
  player2Box?.classList.remove('rv-spectator-focus-box');
  player1PointsCard?.classList.remove('rv-spectator-focus-score');
  player2PointsCard?.classList.remove('rv-spectator-focus-score');

  if (!spectatorHudRoot) return;
  if (!state) {
    spectatorHudRoot.classList.remove('rv-spectator-visible');
    return;
  }

  spectatorHudRoot.classList.add('rv-spectator-visible');
  if (spectatorHudTitle) spectatorHudTitle.textContent = state.title;
  if (spectatorHudMain) spectatorHudMain.textContent = state.main;
  if (spectatorHudSub) spectatorHudSub.textContent = state.sub;
  if (spectatorHudMeta) {
    spectatorHudMeta.innerHTML = '';
    state.chips.forEach((chip) => {
      const node = document.createElement('div');
      const turnClass = chip === 'P1 TURN' ? ' turn-p1' : chip === 'P2 TURN' ? ' turn-p2' : '';
      node.className = `rv-spectator-chip${turnClass}`;
      node.textContent = chip;
      spectatorHudMeta.appendChild(node);
    });
  }
  if (spectatorHudScoreP1) spectatorHudScoreP1.textContent = String(state.p1Points);
  if (spectatorHudScoreP2) spectatorHudScoreP2.textContent = String(state.p2Points);
  const p1Detail = spectatorHudRoot.querySelector('#redveinSpectatorHudScoreP1Detail');
  const p2Detail = spectatorHudRoot.querySelector('#redveinSpectatorHudScoreP2Detail');
  if (p1Detail) p1Detail.textContent = `撃破 ${state.p1Defeated} / 残り ${state.p1Living}体`;
  if (p2Detail) p2Detail.textContent = `撃破 ${state.p2Defeated} / 残り ${state.p2Living}体`;

  if (state.activePlayer === 'player1') {
    player1Box?.classList.add('rv-spectator-focus-box');
    player1PointsCard?.classList.add('rv-spectator-focus-score');
  } else if (state.activePlayer === 'player2') {
    player2Box?.classList.add('rv-spectator-focus-box');
    player2PointsCard?.classList.add('rv-spectator-focus-score');
  }
}

function ensureItemEffectOverlay() {
  if (itemEffectRoot && document.body.contains(itemEffectRoot)) return itemEffectRoot;
  injectItemEffectStyles();
  if (!document.body) return null;
  itemEffectRoot = document.createElement('div');
  itemEffectRoot.id = 'redveinItemEffectOverlay';
  itemEffectRoot.innerHTML = `
    <div class="rv-item-effect-wash"></div>
    <div class="rv-item-effect-ring"></div>
    <div class="rv-item-effect-copy">
      <div class="rv-item-effect-label"></div>
      <div class="rv-item-effect-title"></div>
      <div class="rv-item-effect-sub"></div>
    </div>
  `;
  document.body.appendChild(itemEffectRoot);
  itemEffectLabel = itemEffectRoot.querySelector('.rv-item-effect-label');
  itemEffectTitle = itemEffectRoot.querySelector('.rv-item-effect-title');
  itemEffectSub = itemEffectRoot.querySelector('.rv-item-effect-sub');
  return itemEffectRoot;
}

function uniqueBoardIndices(indices = []) {
  const seen = new Set();
  const result = [];
  indices.forEach((value) => {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0 || seen.has(num)) return;
    seen.add(num);
    result.push(num);
  });
  return result;
}

function spawnItemCellWord(index, text, tone = '', delay = 0) {
  const run = () => {
    const cell = getBoardCellElement(index);
    if (!cell || !text) return;
    const word = document.createElement('div');
    word.className = `rv-itemfx-word ${tone ? `rv-tone-${tone}` : ''}`.trim();
    word.textContent = text;
    cell.appendChild(word);
    rememberCombatFxTimer(setTimeout(() => word.remove(), 980));
  };
  if (delay > 0) {
    rememberCombatFxTimer(setTimeout(run, delay));
  } else {
    run();
  }
}

function scheduleSfx(kind, delayMs = 0) {
  const run = () => playSfx(kind);
  if (delayMs > 0) {
    rememberCombatFxTimer(setTimeout(run, delayMs));
  } else {
    run();
  }
}



function getCardSignatureProfile(cardId, context = '', extra = {}) {
  const ctx = String(context || '');
  switch (String(cardId || '')) {
    case 'RV-007':
      if (ctx === 'postmove' || ctx === 'move') {
        return { mark: 'AMBUSH', word: 'AMBUSH', tone: 'power', cellClass: 'rv-itemfx-smoke', duration: 860 };
      }
      break;
    case 'RV-014':
      if (ctx === 'move') {
        return { mark: 'SCOUT', word: 'SCOUT', tone: 'haste', cellClass: 'rv-itemfx-haste', duration: 760 };
      }
      break;
    case 'RV-028':
      if (ctx === 'attack' && extra.backstab) {
        return { mark: 'BACKSTAB', word: 'BACKSTAB', tone: 'fire', cellClass: 'rv-itemfx-smoke', duration: 920 };
      }
      break;
    case 'RV-030':
      if (ctx === 'move' || ctx === 'attack') {
        return { mark: 'CHARGE', word: 'CHARGE', tone: 'fire', cellClass: 'rv-itemfx-haste', duration: 820 };
      }
      break;
    case 'RV-039':
      if (ctx === 'spawn' || ctx === 'attack') {
        return { mark: 'SHADOW', word: 'SHADOW', tone: 'smoke', cellClass: 'rv-itemfx-smoke', duration: 860 };
      }
      if (ctx === 'return') {
        return { mark: 'RETURN', word: 'SHADOW', tone: 'smoke', cellClass: 'rv-itemfx-smoke', duration: 980 };
      }
      break;
    case 'RV-040':
      if (ctx === 'spawn') {
        return { mark: 'INFERNO', word: 'INFERNO', tone: 'fire', cellClass: 'rv-itemfx-fire', duration: 920 };
      }
      if (ctx === 'attack') {
        return { mark: 'INFERNO', word: 'INFERNO', tone: 'fire', cellClass: 'rv-itemfx-fire', duration: 980 };
      }
      if (ctx === 'splash') {
        return { mark: 'BURN', word: 'BURN', tone: 'fire', cellClass: 'rv-itemfx-fire', duration: 760 };
      }
      break;
    case 'RV-042':
      if (ctx === 'spawn' || ctx === 'attack') {
        return { mark: 'HOLY', word: 'HOLY', tone: 'heal', cellClass: 'rv-itemfx-bless', duration: 920 };
      }
      break;
    case 'RV-043':
      if (ctx === 'spawn') {
        return { mark: 'UNDEAD', word: 'UNDEAD', tone: 'smoke', cellClass: 'rv-itemfx-smoke', duration: 820 };
      }
      if (ctx === 'revive') {
        return { mark: 'REVIVE', word: 'REVIVE', tone: 'heal', cellClass: 'rv-itemfx-heal', duration: 1080, holdMs: 1080 };
      }
      break;
    case 'RV-046':
      if (ctx === 'spawn' || ctx === 'attack' || ctx === 'buff') {
        return { mark: 'RAPID', word: 'RAPID', tone: 'haste', cellClass: 'rv-itemfx-haste', duration: 860 };
      }
      break;
    case 'RV-047':
      if (ctx === 'attack' || ctx === 'buff') {
        return { mark: 'DRAIN', word: 'DRAIN', tone: 'heal', cellClass: 'rv-itemfx-power', duration: 860 };
      }
      break;
    case 'RV-049':
      if (ctx === 'spawn') {
        return { mark: 'BLOOD', word: 'BLOOD', tone: 'power', cellClass: 'rv-itemfx-power', duration: 860 };
      }
      if (ctx === 'attack' || ctx === 'buff') {
        return { mark: 'BLOOD', word: 'BLOOD', tone: 'power', cellClass: 'rv-itemfx-power', duration: 920 };
      }
      break;
    default:
      break;
  }
  return null;
}

function scheduleCardSignatureFx(index, profile = null, delayMs = 0) {
  if (!Number.isInteger(Number(index)) || !profile) return 0;
  const boardIndex = Number(index);
  const delay = Math.max(0, Number(delayMs || 0));
  const duration = Math.max(620, Number(profile.duration || 820));
  const run = () => {
    if (profile.cellClass) pulseCellClass(boardIndex, profile.cellClass, duration);
    if (profile.mark) spawnAttackerMark(boardIndex, profile.mark);
    if (profile.word) spawnItemCellWord(boardIndex, profile.word, profile.tone || '', 40);
    if (profile.sfx) scheduleSfx(profile.sfx, 0);
  };
  if (profile.holdMs) holdCombatFxFor(Number(profile.holdMs || duration));
  if (delay > 0) {
    rememberCombatFxTimer(setTimeout(run, delay));
  } else {
    run();
  }
  return delay + duration;
}


function playItemImpactFx(card, fx = {}, visual = null, startDelay = 0) {
  const impacts = Array.isArray(fx.impacts) ? fx.impacts.filter((impact) => Number.isInteger(Number(impact?.index))) : [];
  if (!impacts.length) return;
  const fallbackVisual = visual || buildItemEffectVisual(card, fx);
  const staggerMs = Math.max(70, Number(fallbackVisual?.staggerMs || 70));
  impacts.forEach((impact, order) => {
    const index = Number(impact.index);
    const delay = Math.max(0, Number(startDelay || 0)) + 80 + (order * staggerMs);
    rememberCombatFxTimer(setTimeout(() => {
      const amount = Math.max(0, Number(impact.amount || 0));
      const kind = String(impact.kind || 'effect');
      const tone = String(impact.tone || fallbackVisual?.cellTone || '');
      if (kind === 'heal') {
        pulseCellClass(index, 'rv-itemfx-heal', 760);
        spawnDamagePopup(index, Math.max(1, amount || 1), {
          label: `+${Math.max(1, amount || 1)}`,
          heavy: amount >= 3,
          tone: 'heal',
        });
        return;
      }
      if (kind === 'guard' || impact.blocked) {
        applyDamageFxAtIndex(index, 0, { label: impact.label || 'GUARD', heavy: true, blocked: true });
        return;
      }
      if (kind === 'buff') {
        pulseCellClass(index, fallbackVisual?.cellClass || 'rv-itemfx-power', 760);
        spawnItemCellWord(index, impact.label || fallbackVisual?.cellWord || 'BOOST', tone, 0);
        return;
      }
      applyDamageFxAtIndex(index, Math.max(0, amount || 0), {
        heavy: !!impact.heavy || !!impact.defeated || amount >= 3,
        label: impact.label || (amount > 0 ? undefined : (fallbackVisual?.cellWord || 'HIT')),
        reduced: Number(impact.reduced || 0),
      });
      if (impact.defeated && impact.visualEntry) {
        rememberCombatFxTimer(setTimeout(() => {
          spawnDefeatGhost(index, impact.visualEntry);
          scheduleSfx('defeat', 0);
        }, 120));
      }
    }, delay));
  });
}

function buildItemEffectVisual(card, fx = {}) {
  const effectType = String(card?.effect_type || '');
  const name = String(card?.card_name || '');
  const targets = uniqueBoardIndices(fx.targets || []);
  const center = Number.isInteger(fx.centerIndex) ? fx.centerIndex : (targets[0] ?? null);
  const common = { targets, center, overlayMs: 920, pulseMs: 940, staggerMs: 70 };
  if (name.includes('火炎') || effectType === 'damage_single_2') {
    return { ...common, accent: 'rgba(255, 116, 62, 0.82)', soft: 'rgba(255, 116, 62, 0.22)', glow: 'rgba(255, 140, 74, 0.38)', label: 'ITEM EFFECT', title: 'BURN', subtitle: '炎の衝撃が走る', cellClass: 'rv-itemfx-fire', cellWord: 'BURN', cellTone: 'fire' };
  }
  if (name.includes('投石') || effectType === 'damage_single_1') {
    return { ...common, accent: 'rgba(255, 184, 108, 0.8)', soft: 'rgba(255, 184, 108, 0.2)', glow: 'rgba(255, 190, 120, 0.32)', label: 'ITEM EFFECT', title: 'HIT', subtitle: '投射攻撃が命中', cellClass: 'rv-itemfx-break', cellWord: 'HIT', cellTone: 'break' };
  }
  if (effectType === 'damage_aoe_target_radius_1') {
    return { ...common, accent: 'rgba(255, 102, 68, 0.82)', soft: 'rgba(255, 102, 68, 0.24)', glow: 'rgba(255, 132, 82, 0.42)', label: 'ITEM EFFECT', title: 'BLAST', subtitle: '爆裂が周囲に広がる', cellClass: 'rv-itemfx-burst', cellWord: 'BLAST', cellTone: 'fire' };
  }
  if (effectType === 'destroy_single' || effectType === 'destroy_single_no_revive') {
    return { ...common, accent: 'rgba(255, 154, 98, 0.82)', soft: 'rgba(255, 154, 98, 0.2)', glow: 'rgba(255, 170, 112, 0.38)', label: 'ITEM EFFECT', title: 'BREAK', subtitle: '破壊の力が発動', cellClass: 'rv-itemfx-break', cellWord: 'BREAK', cellTone: 'break' };
  }
  if (effectType === 'heal_single_2' || effectType === 'full_heal_single' || effectType === 'heal_single_3_atk_up_turn_1') {
    return { ...common, accent: 'rgba(84, 226, 148, 0.82)', soft: 'rgba(84, 226, 148, 0.2)', glow: 'rgba(116, 255, 186, 0.36)', label: 'ITEM EFFECT', title: effectType === 'heal_single_3_atk_up_turn_1' ? 'BLOOD' : 'HEAL', subtitle: effectType === 'heal_single_3_atk_up_turn_1' ? '血の杯が力を満たす' : '生命力が戻る', cellClass: 'rv-itemfx-heal', cellWord: 'HEAL', cellTone: 'heal' };
  }
  if (name.includes('天使') || effectType === 'heal_all_1') {
    return { ...common, accent: 'rgba(255, 240, 150, 0.86)', soft: 'rgba(255, 240, 150, 0.24)', glow: 'rgba(255, 240, 156, 0.38)', label: 'ITEM EFFECT', title: 'BLESS', subtitle: '祝福の光が降り注ぐ', cellClass: 'rv-itemfx-bless', cellWord: 'BLESS', cellTone: 'heal', overlayMs: 980, pulseMs: 1020, staggerMs: 85 };
  }
  if (name.includes('煙幕') || effectType === 'disable_attack_next_round') {
    return { ...common, accent: 'rgba(170, 170, 184, 0.8)', soft: 'rgba(170, 170, 184, 0.18)', glow: 'rgba(170, 170, 184, 0.32)', label: 'ITEM EFFECT', title: 'SMOKE', subtitle: '視界を奪う煙が立ち込める', cellClass: 'rv-itemfx-smoke', cellWord: 'SMOKE', cellTone: 'smoke' };
  }
  if (effectType === 'stun_single_1_turn') {
    return { ...common, accent: 'rgba(120, 200, 255, 0.82)', soft: 'rgba(120, 200, 255, 0.2)', glow: 'rgba(126, 214, 255, 0.36)', label: 'ITEM EFFECT', title: 'FREEZE', subtitle: '時が凍りつく', cellClass: 'rv-itemfx-freeze', cellWord: 'FREEZE', cellTone: 'freeze' };
  }
  if (effectType === 'buff_move_atk_turn_1') {
    return { ...common, accent: 'rgba(244, 110, 190, 0.82)', soft: 'rgba(244, 110, 190, 0.2)', glow: 'rgba(248, 132, 204, 0.36)', label: 'ITEM EFFECT', title: 'BOOST', subtitle: '力がみなぎる', cellClass: 'rv-itemfx-power', cellWord: 'BOOST', cellTone: 'power' };
  }
  if (effectType === 'shield_single_2_once' || effectType === 'team_damage_minus_1_until_next_round') {
    return { ...common, accent: 'rgba(104, 166, 255, 0.82)', soft: 'rgba(104, 166, 255, 0.2)', glow: 'rgba(116, 182, 255, 0.36)', label: 'ITEM EFFECT', title: 'GUARD', subtitle: '防壁が展開される', cellClass: 'rv-itemfx-shield', cellWord: 'GUARD', cellTone: 'shield' };
  }
  if (effectType === 'move_twice_single' || effectType === 'royal_command_single') {
    return { ...common, accent: 'rgba(255, 214, 92, 0.84)', soft: 'rgba(255, 214, 92, 0.2)', glow: 'rgba(255, 222, 108, 0.34)', label: 'ITEM EFFECT', title: effectType === 'royal_command_single' ? 'ORDER' : 'HASTE', subtitle: effectType === 'royal_command_single' ? '王命が下される' : '加速の力が宿る', cellClass: 'rv-itemfx-haste', cellWord: 'HASTE', cellTone: 'haste' };
  }
  return { ...common, accent: 'rgba(220, 145, 255, 0.8)', soft: 'rgba(220, 145, 255, 0.18)', glow: 'rgba(220, 145, 255, 0.32)', label: 'ITEM EFFECT', title: name || 'MAGIC', subtitle: 'アイテム効果が発動', cellClass: 'rv-itemfx-power', cellWord: 'ITEM', cellTone: 'power' };
}

function playItemEffectSequence(card, fx = {}) {
  if (!card || card.type !== 'item') return;
  const root = ensureItemEffectOverlay();
  if (!root) return;
  const visual = buildItemEffectVisual(card, fx);
  const targets = uniqueBoardIndices(visual.targets || fx.targets || []);
  if (Number.isInteger(visual.center) && !targets.includes(visual.center)) targets.unshift(visual.center);
  const staggerMs = Math.max(0, Number(visual.staggerMs || 0));
  const overlayMs = Math.max(420, Number(visual.overlayMs || 920));
  const pulseMs = Math.max(420, Number(visual.pulseMs || 940));
  const baseDelay = 90;
  const startDelay = Math.max(0, Number(fx.startDelay || 0));
  const totalMs = startDelay + Math.max(overlayMs, baseDelay + (targets.length > 0 ? ((targets.length - 1) * staggerMs) + pulseMs : 0)) + 120;
  if (!fx.skipHold) {
    holdCombatFxFor(totalMs);
  }
  rememberCombatFxTimer(setTimeout(() => {
    root.style.setProperty('--rv-item-fx-accent', visual.accent);
    root.style.setProperty('--rv-item-fx-accent-soft', visual.soft);
    root.style.setProperty('--rv-item-fx-glow', visual.glow);
    if (itemEffectLabel) itemEffectLabel.textContent = visual.label || 'ITEM EFFECT';
    if (itemEffectTitle) itemEffectTitle.textContent = visual.title || (card.card_name || 'ITEM');
    if (itemEffectSub) itemEffectSub.textContent = visual.subtitle || 'アイテム効果が発動';
    root.classList.remove('rv-item-effect-visible');
    void root.offsetWidth;
    root.classList.add('rv-item-effect-visible');
    scheduleSfx('item', 20);
    playItemImpactFx(card, fx, visual, 24);
    rememberCombatFxTimer(setTimeout(() => root.classList.remove('rv-item-effect-visible'), overlayMs));
    rememberCombatFxTimer(setTimeout(() => {
      targets.forEach((index, order) => {
        const delay = order * staggerMs;
        if (delay > 0) {
          rememberCombatFxTimer(setTimeout(() => pulseCellClass(index, visual.cellClass, pulseMs), delay));
        } else {
          pulseCellClass(index, visual.cellClass, pulseMs);
        }
        spawnItemCellWord(index, visual.cellWord, visual.cellTone, delay);
      });
    }, baseDelay));
  }, startDelay));
}

function clearCombatFxTimers() {
  combatFxTimers.forEach((timer) => clearTimeout(timer));
  combatFxTimers.clear();
}

function rememberCombatFxTimer(timer) {
  combatFxTimers.add(timer);
  return timer;
}

function resetCombatFxTracking() {
  clearCombatFxTimers();
  if (combatFxHoldTimer) {
    clearTimeout(combatFxHoldTimer);
    combatFxHoldTimer = null;
  }
  combatFxHoldUntil = 0;
  combatFxPendingRender = false;
  combatFxSkipNextSnapshotDiff = false;
  combatFxBoardSnapshot = null;
  combatFxTurnSnapshot = null;
  clearFinishShowcaseSchedule();
}

function getCombatFxHoldMsRemaining() {
  return Math.max(0, Number(combatFxHoldUntil || 0) - Date.now());
}

function holdCombatFxFor(duration = 0) {
  const ms = Math.max(0, Math.round(Number(duration) || 0));
  if (ms <= 0) return 0;
  combatFxHoldUntil = Math.max(Number(combatFxHoldUntil || 0), Date.now() + ms);
  if (combatFxHoldTimer) clearTimeout(combatFxHoldTimer);
  combatFxHoldTimer = rememberCombatFxTimer(setTimeout(() => {
    combatFxHoldTimer = null;
    combatFxHoldUntil = 0;
    if (combatFxPendingRender) {
      combatFxPendingRender = false;
      renderMatchArea();
    }
  }, ms + 16));
  return ms;
}

function queueRenderAfterCombatFx() {
  combatFxPendingRender = true;
}


function injectCombatFxStyles() {
  if (document.getElementById('redveinCombatFxStyle')) return;
  const style = document.createElement('style');
  style.id = 'redveinCombatFxStyle';
  style.textContent = `
    .board-cell {
      overflow: visible;
    }
    #boardGrid.rv-hitstop {
      animation: rvFxBoardHitstop var(--rv-hitstop-ms, 120ms) ease-out 1;
      transform-origin: center center;
    }
    .board-cell .unit-card-visual {
      transform-origin: center center;
      will-change: transform, filter, opacity, box-shadow;
    }
    .rv-combat-fx-overlay {
      position: fixed;
      pointer-events: none;
      z-index: 1400;
      overflow: visible;
      contain: layout style paint;
    }
    .rv-combat-fx-overlay .rv-fx-board-flash {
      position: absolute;
      inset: -4%;
      border-radius: 28px;
      opacity: 0;
      animation: rvFxBoardFlash 0.32s ease-out forwards;
      box-shadow: inset 0 0 84px rgba(255, 255, 255, 0.06), 0 0 56px rgba(255, 112, 124, 0.16);
    }
    .rv-combat-fx-overlay .rv-fx-board-flash.rv-tone-attack {
      background: radial-gradient(circle at center, rgba(255, 238, 196, 0.22), rgba(255, 84, 102, 0.16) 48%, rgba(255, 255, 255, 0) 76%);
    }
    .rv-combat-fx-overlay .rv-fx-board-flash.rv-tone-shadow {
      background: radial-gradient(circle at center, rgba(182, 108, 255, 0.2), rgba(72, 32, 120, 0.16) 46%, rgba(255, 255, 255, 0) 74%);
    }
    .rv-combat-fx-overlay .rv-fx-board-flash.rv-tone-holy {
      background: radial-gradient(circle at center, rgba(255, 248, 196, 0.22), rgba(255, 232, 136, 0.15) 48%, rgba(255, 255, 255, 0) 76%);
    }
    .rv-combat-fx-overlay .rv-fx-board-flash.rv-tone-inferno {
      background: radial-gradient(circle at center, rgba(255, 194, 122, 0.22), rgba(255, 92, 52, 0.2) 46%, rgba(255, 255, 255, 0) 74%);
    }
    .rv-combat-fx-overlay .rv-fx-board-flash.rv-tone-guard {
      background: radial-gradient(circle at center, rgba(178, 220, 255, 0.22), rgba(102, 168, 255, 0.16) 46%, rgba(255, 255, 255, 0) 74%);
    }
    .rv-combat-fx-overlay .rv-fx-travel {
      --rv-travel-duration: 320ms;
      position: absolute;
      left: 0;
      top: 0;
      height: 14px;
      transform-origin: 0 50%;
      pointer-events: none;
      filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.18));
      opacity: 0;
    }
    .rv-combat-fx-overlay .rv-fx-travel::before,
    .rv-combat-fx-overlay .rv-fx-travel::after {
      content: '';
      position: absolute;
      inset: 50% auto auto 0;
      transform: translateY(-50%);
      pointer-events: none;
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-slash::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-pierce::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-shadow::before {
      width: 100%;
      height: 4px;
      border-radius: 999px;
      transform-origin: 0 50%;
      animation: rvFxTravelLine var(--rv-travel-duration) cubic-bezier(.16,.84,.24,1) forwards;
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-slash::after,
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-pierce::after,
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-shadow::after,
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-projectile::after {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: rvFxTravelHead var(--rv-travel-duration) cubic-bezier(.16,.84,.24,1) forwards;
      box-shadow: 0 0 22px currentColor;
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-projectile::before {
      width: 100%;
      height: 3px;
      border-radius: 999px;
      opacity: 0.7;
      transform-origin: 0 50%;
      animation: rvFxTravelTrail var(--rv-travel-duration) cubic-bezier(.16,.84,.24,1) forwards;
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-pierce::before {
      height: 5px;
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-kind-shadow::before {
      height: 5px;
      filter: blur(1px);
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-attack { color: #ffd39e; }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-attack::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-attack::after {
      background: linear-gradient(90deg, rgba(255, 244, 214, 0.0), rgba(255, 217, 140, 0.92) 16%, rgba(255, 132, 98, 0.98) 72%, rgba(255, 255, 255, 0));
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-shadow { color: #bf8cff; }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-shadow::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-shadow::after {
      background: linear-gradient(90deg, rgba(50, 16, 88, 0.0), rgba(180, 112, 255, 0.96) 18%, rgba(108, 54, 182, 0.96) 74%, rgba(255, 255, 255, 0));
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-inferno { color: #ffb06f; }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-inferno::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-inferno::after {
      background: linear-gradient(90deg, rgba(98, 22, 14, 0.0), rgba(255, 190, 102, 0.95) 16%, rgba(255, 108, 66, 0.98) 74%, rgba(255, 255, 255, 0));
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-holy { color: #fff0ad; }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-holy::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-holy::after {
      background: linear-gradient(90deg, rgba(255, 232, 138, 0.0), rgba(255, 252, 220, 0.96) 18%, rgba(255, 222, 118, 0.96) 74%, rgba(255, 255, 255, 0));
    }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-guard { color: #a8ddff; }
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-guard::before,
    .rv-combat-fx-overlay .rv-fx-travel.rv-tone-guard::after {
      background: linear-gradient(90deg, rgba(112, 188, 255, 0.0), rgba(214, 239, 255, 0.96) 18%, rgba(110, 176, 255, 0.96) 74%, rgba(255, 255, 255, 0));
    }
    .board-cell.rv-fx-attacker-burst::after,
    .board-cell.rv-fx-target-impact::after {
      content: '';
      position: absolute;
      inset: -10%;
      border-radius: 22px;
      pointer-events: none;
    }
    .board-cell.rv-fx-attacker-burst::after {
      border: 2px solid rgba(255, 224, 156, 0.85);
      box-shadow: 0 0 28px rgba(255, 224, 156, 0.34), 0 0 54px rgba(255, 122, 86, 0.26);
      animation: rvFxAttackerBurst 0.52s ease-out forwards;
    }
    .board-cell.rv-fx-target-impact::after {
      background: radial-gradient(circle at center, rgba(255, 226, 166, 0.48), rgba(255, 74, 108, 0.26) 42%, rgba(255, 255, 255, 0) 72%);
      box-shadow: 0 0 22px rgba(255, 84, 118, 0.28);
      animation: rvFxTargetImpact 0.44s ease-out forwards;
    }
    .board-cell.rv-fx-target-hit .unit-card-visual {
      animation: rvFxHitShake 0.46s cubic-bezier(.36,.07,.19,.97) both;
      filter: saturate(1.06) brightness(1.08);
    }
    .board-cell .rv-fx-attacker-mark {
      position: absolute;
      left: 50%;
      top: 14%;
      transform: translate(-50%, 0);
      z-index: 6;
      pointer-events: none;
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 224, 156, 0.42);
      background: rgba(20, 10, 12, 0.78);
      color: #ffe7b8;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.16em;
      text-shadow: 0 3px 18px rgba(0, 0, 0, 0.38), 0 0 16px rgba(255, 180, 96, 0.22);
      animation: rvFxAttackerMark 0.92s ease-out forwards;
      white-space: nowrap;
    }
    .board-cell .rv-fx-damage-pop {
      --rv-pop-color: #fff4f6;
      --rv-pop-glow: rgba(255, 80, 114, 0.26);
      position: absolute;
      left: 50%;
      top: 12%;
      transform: translate(-50%, 0);
      z-index: 6;
      pointer-events: none;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 0.02em;
      color: var(--rv-pop-color);
      text-shadow: 0 3px 18px rgba(0, 0, 0, 0.38), 0 0 16px var(--rv-pop-glow);
      animation: rvFxDamagePop 0.82s ease-out forwards;
      white-space: nowrap;
    }
    .board-cell .rv-fx-damage-pop.rv-fx-damage-heavy {
      font-size: 24px;
    }
    .board-cell .rv-fx-damage-pop.rv-tone-damage {
      --rv-pop-color: #ff8ea8;
      --rv-pop-glow: rgba(255, 80, 114, 0.34);
    }
    .board-cell .rv-fx-damage-pop.rv-tone-heal {
      --rv-pop-color: #92ffbf;
      --rv-pop-glow: rgba(90, 235, 154, 0.34);
    }
    .board-cell .rv-fx-damage-pop.rv-tone-reduce {
      --rv-pop-color: #8ac5ff;
      --rv-pop-glow: rgba(95, 170, 255, 0.34);
    }
    .board-cell .rv-fx-damage-pop.rv-tone-guard {
      --rv-pop-color: #d8ebff;
      --rv-pop-glow: rgba(122, 192, 255, 0.38);
    }
    .board-cell .rv-fx-damage-pop.rv-tone-buff {
      --rv-pop-color: #ffe08d;
      --rv-pop-glow: rgba(255, 212, 92, 0.34);
    }
    .board-cell .rv-fx-defeat-ghost {
      position: absolute;
      inset: 8px;
      z-index: 5;
      pointer-events: none;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.12);
      background: linear-gradient(180deg, rgba(55, 18, 31, 0.92), rgba(17, 10, 16, 0.96));
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.34), 0 0 28px rgba(255, 88, 118, 0.16);
      animation: rvFxDefeatGhost 0.72s ease-out forwards;
    }
    .board-cell .rv-fx-defeat-ghost img,
    .board-cell .rv-fx-defeat-ghost .rv-fx-defeat-fallback {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }
    .board-cell .rv-fx-defeat-ghost .rv-fx-defeat-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      text-align: center;
      color: #fff6f8;
      font-weight: 900;
      font-size: 18px;
      line-height: 1.3;
      background: radial-gradient(circle at 50% 18%, rgba(255, 124, 154, 0.26), rgba(0, 0, 0, 0.14) 44%), linear-gradient(180deg, rgba(93, 29, 46, 1), rgba(22, 11, 17, 1));
    }
    .board-cell .rv-fx-defeat-mark {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 7;
      pointer-events: none;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(10, 6, 10, 0.72);
      border: 1px solid rgba(255, 205, 154, 0.22);
      color: #ffdcb0;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.12em;
      animation: rvFxDefeatMark 0.76s ease-out forwards;
      white-space: nowrap;
    }
    @keyframes rvFxBoardHitstop {
      0% { transform: scale(1); filter: brightness(1); }
      40% { transform: scale(1.012); filter: brightness(1.06); }
      100% { transform: scale(1); filter: brightness(1); }
    }
    @keyframes rvFxBoardFlash {
      0% { opacity: 0; }
      22% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes rvFxTravelLine {
      0% { opacity: 0; transform: translateY(-50%) scaleX(0.18); filter: brightness(0.92); }
      16% { opacity: 1; }
      58% { opacity: 1; transform: translateY(-50%) scaleX(1.02); filter: brightness(1.08); }
      100% { opacity: 0; transform: translateY(-50%) scaleX(1.08); filter: brightness(0.96); }
    }
    @keyframes rvFxTravelHead {
      0% { opacity: 0; left: 0%; transform: translate(-50%, -50%) scale(0.68); }
      12% { opacity: 1; }
      60% { opacity: 1; }
      100% { opacity: 0; left: 100%; transform: translate(-50%, -50%) scale(1.12); }
    }
    @keyframes rvFxTravelTrail {
      0% { opacity: 0; transform: translateY(-50%) scaleX(0.08); }
      14% { opacity: 0.9; }
      80% { opacity: 0.72; transform: translateY(-50%) scaleX(0.98); }
      100% { opacity: 0; transform: translateY(-50%) scaleX(1.04); }
    }
    @keyframes rvFxAttackerBurst {
      0% { opacity: 0; transform: scale(0.78); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: scale(1.18); }
    }
    @keyframes rvFxTargetImpact {
      0% { opacity: 0; transform: scale(0.7); }
      18% { opacity: 1; }
      100% { opacity: 0; transform: scale(1.22); }
    }
    @keyframes rvFxHitShake {
      0% { transform: translate3d(0,0,0) scale(1); }
      20% { transform: translate3d(-4px, 1px, 0) rotate(-1.1deg) scale(0.985); }
      36% { transform: translate3d(4px, -1px, 0) rotate(1.1deg) scale(0.985); }
      54% { transform: translate3d(-3px, 1px, 0) rotate(-0.7deg) scale(0.99); }
      72% { transform: translate3d(2px, -1px, 0) rotate(0.5deg) scale(0.996); }
      100% { transform: translate3d(0,0,0) scale(1); }
    }
    @keyframes rvFxAttackerMark {
      0% { opacity: 0; transform: translate(-50%, 6px) scale(0.84); }
      18% { opacity: 1; transform: translate(-50%, -2px) scale(1); }
      72% { opacity: 1; transform: translate(-50%, -10px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -18px) scale(0.98); }
    }
    @keyframes rvFxDamagePop {
      0% { opacity: 0; transform: translate(-50%, 8px) scale(0.7); }
      18% { opacity: 1; transform: translate(-50%, -2px) scale(1.06); }
      70% { opacity: 1; transform: translate(-50%, -18px) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -30px) scale(0.96); }
    }
    @keyframes rvFxDefeatGhost {
      0% { opacity: 0.98; transform: scale(1); filter: saturate(1) blur(0); }
      55% { opacity: 0.9; transform: scale(1.03); }
      100% { opacity: 0; transform: scale(0.88); filter: saturate(0.3) blur(8px); }
    }
    @keyframes rvFxDefeatMark {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
      20% { opacity: 1; transform: translate(-50%, -52%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -66%) scale(0.96); }
    }
  `;
  document.head.appendChild(style);
}


function ensureCombatFxReady() {
  if (!document?.head) return;
  injectCombatFxStyles();
}

function captureBoardVisualSnapshot() {
  return (matchState.board || []).map((unit, index) => {
    if (!unit) return null;
    const meta = cardMap.get(unit.cardId);
    return {
      index,
      instanceId: unit.instanceId,
      cardId: unit.cardId,
      owner: unit.owner,
      name: unit.name,
      hp: Number(unit.currentHp || 0),
      maxHp: Number(unit.maxHp || 0),
      imagePath: getCardImagePath(meta) || '',
    };
  });
}

function captureTurnVisualSnapshot() {
  return {
    phase: matchState.phase,
    currentPlayer: matchState.currentPlayer,
    attackCount: Number(matchState.turnState?.attackCount || 0),
    attackUnitId: matchState.turnState?.attackUnitId || null,
    postAttackMoveUnitId: matchState.turnState?.postAttackMoveUnitId || null,
    winner: matchState.winner || '',
  };
}

function getBoardCellElement(index) {
  return boardGrid?.querySelector(`.board-cell[data-board-index="${index}"]`) || null;
}


function getBoardCellCenter(index) {
  const cell = getBoardCellElement(index);
  if (!cell) return null;
  const rect = cell.getBoundingClientRect();
  return {
    x: rect.left + (rect.width / 2),
    y: rect.top + (rect.height / 2),
    width: rect.width,
    height: rect.height,
    rect,
  };
}

function ensureCombatFxOverlay() {
  if (!document?.body || !boardGrid) return null;
  let overlay = document.getElementById('redveinCombatFxOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'redveinCombatFxOverlay';
    overlay.className = 'rv-combat-fx-overlay';
    document.body.appendChild(overlay);
  }
  const rect = boardGrid.getBoundingClientRect();
  overlay.style.left = `${Math.round(rect.left)}px`;
  overlay.style.top = `${Math.round(rect.top)}px`;
  overlay.style.width = `${Math.round(rect.width)}px`;
  overlay.style.height = `${Math.round(rect.height)}px`;
  return overlay;
}

function pulseBoardHitstop(duration = 120) {
  if (!boardGrid) return;
  const safeDuration = Math.max(72, Number(duration || 120));
  boardGrid.style.setProperty('--rv-hitstop-ms', `${safeDuration}ms`);
  boardGrid.classList.remove('rv-hitstop');
  void boardGrid.offsetWidth;
  boardGrid.classList.add('rv-hitstop');
  rememberCombatFxTimer(setTimeout(() => {
    boardGrid.classList.remove('rv-hitstop');
  }, safeDuration + 16));
}

function spawnBoardFlash(tone = 'attack', duration = 320) {
  const overlay = ensureCombatFxOverlay();
  if (!overlay) return;
  const flash = document.createElement('div');
  flash.className = `rv-fx-board-flash rv-tone-${tone}`.trim();
  overlay.appendChild(flash);
  rememberCombatFxTimer(setTimeout(() => {
    flash.remove();
  }, Math.max(260, Number(duration || 320))));
}

function lungeAttackerVisual(index, targetIndex, profile = {}) {
  const cell = getBoardCellElement(index);
  const visual = cell?.querySelector('.unit-card-visual');
  if (!visual || typeof visual.animate !== 'function') return;
  const source = getBoardCellCenter(index);
  const target = getBoardCellCenter(targetIndex);
  if (!source || !target) return;

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const magnitude = Math.min(Number(profile.lungePx || 38), distance * (profile.projectile ? 0.08 : 0.16));
  const moveX = (dx / distance) * magnitude;
  const moveY = (dy / distance) * magnitude;
  const duration = Math.max(220, Number(profile.lungeDuration || (profile.projectile ? 240 : 320)));
  const startScale = Number(profile.startScale || 1);
  const peakScale = Number(profile.peakScale || (profile.projectile ? 1.03 : 1.08));

  try {
    visual.animate([
      { transform: `translate3d(0px, 0px, 0px) scale(${startScale})`, filter: 'brightness(1) saturate(1)' },
      { transform: `translate3d(${moveX}px, ${moveY}px, 0px) scale(${peakScale})`, filter: 'brightness(1.08) saturate(1.05)', offset: 0.34 },
      { transform: `translate3d(${moveX * 0.24}px, ${moveY * 0.24}px, 0px) scale(1.02)`, filter: 'brightness(1.03) saturate(1.02)', offset: 0.72 },
      { transform: 'translate3d(0px, 0px, 0px) scale(1)', filter: 'brightness(1) saturate(1)' },
    ], {
      duration,
      easing: 'cubic-bezier(.16,.84,.24,1)',
      fill: 'none',
    });
  } catch (_) {
    // no-op
  }
}

function spawnTravelFx(sourceIndex, targetIndex, profile = {}) {
  const overlay = ensureCombatFxOverlay();
  const source = getBoardCellCenter(sourceIndex);
  const target = getBoardCellCenter(targetIndex);
  if (!overlay || !source || !target) return;

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const length = Math.max(24, Math.hypot(dx, dy));
  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
  const kind = String(profile.kind || 'slash');
  const tone = String(profile.tone || 'attack');
  const duration = Math.max(220, Number(profile.travelDuration || (kind === 'projectile' ? 360 : 300)));

  const effect = document.createElement('div');
  effect.className = `rv-fx-travel rv-kind-${kind} rv-tone-${tone}`.trim();
  effect.style.setProperty('--rv-travel-duration', `${duration}ms`);
  effect.style.width = `${Math.round(length)}px`;
  effect.style.left = `${Math.round(source.x - overlay.getBoundingClientRect().left)}px`;
  effect.style.top = `${Math.round(source.y - overlay.getBoundingClientRect().top)}px`;
  effect.style.transform = `translateY(-50%) rotate(${angleDeg}deg)`;
  overlay.appendChild(effect);

  rememberCombatFxTimer(setTimeout(() => {
    effect.remove();
  }, duration + 60));
}

function getAttackPresentationProfile(attacker, sourceIndex, targetIndex, defender, options = {}) {
  const base = {
    kind: 'slash',
    tone: 'attack',
    projectile: false,
    lunge: true,
    travelDuration: 280,
    hitDelay: 200,
    staggerMs: 240,
    hitstopMs: 110,
    boardFlashDuration: 300,
    chainFromSource: true,
  };
  if (!attacker || !defender) return base;

  if (unitHasEffectType(attacker, 'range_2') || unitHasEffectType(attacker, 'row_range_attack')) {
    return {
      ...base,
      kind: 'projectile',
      tone: (isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-045') ? 'holy' : 'attack',
      projectile: true,
      lunge: false,
      travelDuration: 360,
      hitDelay: 270,
      hitstopMs: 96,
      boardFlashDuration: 280,
    };
  }

  if ((isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-033') || unitHasEffectType(attacker, 'pierce_line_2')) {
    return {
      ...base,
      kind: 'pierce',
      tone: 'attack',
      projectile: true,
      lunge: true,
      travelDuration: 320,
      hitDelay: 220,
      staggerMs: 180,
      hitstopMs: 108,
      boardFlashDuration: 300,
    };
  }

  if (isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-039') {
    return {
      ...base,
      kind: 'shadow',
      tone: 'shadow',
      projectile: false,
      lunge: true,
      travelDuration: 300,
      hitDelay: 210,
      hitstopMs: 120,
      boardFlashDuration: 320,
    };
  }

  if (isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-040') {
    return {
      ...base,
      kind: 'slash',
      tone: 'inferno',
      projectile: false,
      lunge: true,
      travelDuration: 300,
      hitDelay: 210,
      staggerMs: 180,
      hitstopMs: 124,
      boardFlashDuration: 340,
    };
  }

  if (isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-028' && options.backstab) {
    return {
      ...base,
      kind: 'shadow',
      tone: 'shadow',
      projectile: false,
      lunge: true,
      travelDuration: 280,
      hitDelay: 200,
      hitstopMs: 118,
      boardFlashDuration: 300,
    };
  }

  return base;
}


function pulseCellClass(index, className, duration = 520) {
  const cell = getBoardCellElement(index);
  if (!cell) return;
  cell.classList.remove(className);
  void cell.offsetWidth;
  cell.classList.add(className);
  rememberCombatFxTimer(setTimeout(() => {
    cell.classList.remove(className);
  }, duration));
}

function createCombatVisualEntry(unit, index = -1) {
  if (!unit) return null;
  const meta = cardMap.get(unit.cardId);
  return {
    index,
    instanceId: unit.instanceId,
    cardId: unit.cardId,
    owner: unit.owner,
    name: unit.name,
    hp: Number(unit.currentHp || 0),
    maxHp: Number(unit.maxHp || 0),
    imagePath: getCardImagePath(meta) || '',
  };
}

function spawnAttackerMark(index, label = 'ATTACK') {
  const cell = getBoardCellElement(index);
  if (!cell) return;
  const mark = document.createElement('div');
  mark.className = 'rv-fx-attacker-mark';
  mark.textContent = label;
  cell.appendChild(mark);
  rememberCombatFxTimer(setTimeout(() => {
    mark.remove();
  }, 940));
}

function spawnDamagePopup(index, amount, options = {}) {
  const cell = getBoardCellElement(index);
  if (!cell) return;
  const popup = document.createElement('div');
  popup.className = 'rv-fx-damage-pop';
  const tone = String(options.tone || '').trim();
  if (tone) popup.classList.add(`rv-tone-${tone}`);
  if (Number(amount) >= 3 || options.heavy) popup.classList.add('rv-fx-damage-heavy');
  popup.textContent = options.label || `-${amount}`;
  if (Number.isFinite(Number(options.xOffset))) popup.style.marginLeft = `${Number(options.xOffset)}px`;
  if (Number.isFinite(Number(options.yOffset))) popup.style.marginTop = `${Number(options.yOffset)}px`;
  cell.appendChild(popup);
  rememberCombatFxTimer(setTimeout(() => {
    popup.remove();
  }, 840));
}

function spawnDefeatGhost(index, entry) {
  const cell = getBoardCellElement(index);
  if (!cell || !entry) return;
  const ghost = document.createElement('div');
  ghost.className = 'rv-fx-defeat-ghost';
  if (entry.imagePath) {
    const img = document.createElement('img');
    img.src = entry.imagePath;
    img.alt = entry.name || '撃破ユニット';
    img.loading = 'eager';
    ghost.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.className = 'rv-fx-defeat-fallback';
    fallback.textContent = entry.name || 'DEFEATED';
    ghost.appendChild(fallback);
  }
  const mark = document.createElement('div');
  mark.className = 'rv-fx-defeat-mark';
  mark.textContent = '撃破';
  cell.appendChild(ghost);
  cell.appendChild(mark);
  rememberCombatFxTimer(setTimeout(() => {
    ghost.remove();
    mark.remove();
  }, 760));
}

function applyDamageFxAtIndex(index, amount, options = {}) {
  const safeAmount = Math.max(0, Number(amount || 0));
  const reducedAmount = Math.max(0, Number(options.reduced || 0));
  const blocked = !!options.blocked;
  if (blocked) {
    pulseCellClass(index, 'rv-itemfx-shield', 700);
    spawnDamagePopup(index, 0, {
      label: options.label || 'GUARD',
      heavy: true,
      tone: options.tone || 'guard',
    });
    return;
  }
  if (safeAmount > 0) {
    pulseCellClass(index, 'rv-fx-target-impact', 520);
    pulseCellClass(index, 'rv-fx-target-hit', 600);
    spawnDamagePopup(index, safeAmount, {
      ...options,
      label: options.label || `-${safeAmount}`,
      tone: options.tone || 'damage',
    });
  } else if (options.label) {
    spawnDamagePopup(index, 0, {
      ...options,
      tone: options.tone || 'damage',
    });
  }
  if (reducedAmount > 0) {
    pulseCellClass(index, 'rv-itemfx-shield', 700);
    const showBlueOnly = safeAmount <= 0;
    rememberCombatFxTimer(setTimeout(() => {
      spawnDamagePopup(index, reducedAmount, {
        label: options.reductionLabel || `-${reducedAmount}`,
        heavy: reducedAmount >= 3,
        tone: 'reduce',
        xOffset: showBlueOnly ? 0 : 28,
        yOffset: showBlueOnly ? 0 : 24,
      });
    }, showBlueOnly ? 0 : 70));
  }
}


function playResolvedAttackFxSequence(sourceIndex, hits = [], options = {}) {
  ensureCombatFxReady();
  const resolvedHits = (Array.isArray(hits) ? hits : []).filter((hit) => Number.isInteger(hit?.index) && hit.index >= 0 && hit.index < 25);
  const extraEffects = (Array.isArray(options.extraEffects) ? options.extraEffects : [])
    .filter((effect) => Number.isInteger(Number(effect?.index)) && Number(effect.index) >= 0 && Number(effect.index) < 25 && effect.profile);
  const presentation = options.presentation || {};
  const primaryTargetIndex = resolvedHits[0]?.index;
  const baseHitDelay = Math.max(140, Number(presentation.hitDelay || 200));
  const staggerMs = Math.max(140, Number(presentation.staggerMs || 240));
  const travelDuration = Math.max(220, Number(presentation.travelDuration || 300));
  const baseAttackDuration = primaryTargetIndex != null ? (baseHitDelay + Math.max(260, resolvedHits.length * staggerMs) + 260) : 960;
  const extraTailMs = extraEffects.reduce((maxMs, effect) => {
    const delay = Math.max(0, Number(effect.delay || 0));
    const duration = Math.max(620, Number(effect.profile?.duration || effect.duration || 820));
    return Math.max(maxMs, delay + duration);
  }, 0);
  const totalDuration = Math.max(1080, baseAttackDuration, extraTailMs + 280);
  holdCombatFxFor(totalDuration);

  if (Number.isInteger(sourceIndex) && sourceIndex >= 0) {
    const pulseClass = options.attackerPulseClass || 'rv-fx-attacker-burst';
    pulseCellClass(sourceIndex, pulseClass, Math.max(760, Number(options.attackerPulseMs || 760)));
    spawnAttackerMark(sourceIndex, options.attackerLabel || 'ATTACK');
    if (options.attackerWord) {
      spawnItemCellWord(sourceIndex, options.attackerWord, options.attackerTone || '', 40);
    }
    if (primaryTargetIndex != null && presentation.lunge !== false) {
      rememberCombatFxTimer(setTimeout(() => {
        lungeAttackerVisual(sourceIndex, primaryTargetIndex, presentation);
      }, 28));
    }
    if (primaryTargetIndex != null) {
      rememberCombatFxTimer(setTimeout(() => {
        spawnTravelFx(sourceIndex, primaryTargetIndex, presentation);
      }, Math.max(34, Math.min(110, Math.floor(baseHitDelay * 0.42)))));
    }
  }

  resolvedHits.forEach((hit, order) => {
    const delay = baseHitDelay + (order * staggerMs);
    rememberCombatFxTimer(setTimeout(() => {
      if (Number.isInteger(sourceIndex) && sourceIndex >= 0 && Number.isInteger(hit.index) && hit.index >= 0) {
        if (order > 0 && primaryTargetIndex !== hit.index && presentation.chainFromSource !== false) {
          spawnTravelFx(sourceIndex, hit.index, {
            ...presentation,
            travelDuration: Math.max(220, travelDuration - 40),
          });
        }
      }
      pulseBoardHitstop(Number(presentation.hitstopMs || 110));
      spawnBoardFlash(hit.blocked ? 'guard' : (presentation.tone || 'attack'), Number(presentation.boardFlashDuration || 300));
      const primaryLabel = hit.blocked ? (hit.label || 'GUARD') : (hit.damage > 0 ? (hit.label || undefined) : (hit.label || undefined));
      applyDamageFxAtIndex(hit.index, Math.max(0, Number(hit.damage || 0)), {
        heavy: !!hit.heavy || !!hit.defeated || Number(hit.damage || 0) >= 3,
        label: primaryLabel,
        blocked: !!hit.blocked,
        reduced: Number(hit.reduced || 0),
      });
      if (hit.defeated && hit.visualEntry) {
        rememberCombatFxTimer(setTimeout(() => {
          spawnDefeatGhost(hit.index, hit.visualEntry);
        }, 110));
      }
    }, delay));
  });

  extraEffects.forEach((effect) => {
    scheduleCardSignatureFx(Number(effect.index), effect.profile, Number(effect.delay || 0));
  });
  return totalDuration;
}


function findSnapshotIndexByUnitId(snapshot, unitId) {
  if (!Array.isArray(snapshot) || !unitId) return -1;
  return snapshot.findIndex((entry) => entry && entry.instanceId === unitId);
}

function applyCombatFxFromSnapshots(prevBoard, nextBoard, prevTurn, nextTurn) {
  ensureCombatFxReady();
  if (!Array.isArray(prevBoard) || !Array.isArray(nextBoard)) return;

  const nextPositions = new Map();
  nextBoard.forEach((entry, idx) => {
    if (entry?.instanceId) nextPositions.set(entry.instanceId, idx);
  });

  const attackTriggered = !!(
    prevTurn
    && nextTurn
    && nextTurn.phase === 'battle'
    && prevTurn.phase === 'battle'
    && nextTurn.currentPlayer === prevTurn.currentPlayer
    && Number(nextTurn.attackCount || 0) > Number(prevTurn.attackCount || 0)
    && nextTurn.attackUnitId
  );
  if (attackTriggered) {
    const attackerIndex = findSnapshotIndexByUnitId(nextBoard, nextTurn.attackUnitId);
    if (attackerIndex >= 0) pulseCellClass(attackerIndex, 'rv-fx-attacker-burst', 520);
  }

  prevBoard.forEach((prevEntry, index) => {
    if (!prevEntry) return;
    const nextEntry = nextBoard[index];

    if (nextEntry && nextEntry.instanceId === prevEntry.instanceId) {
      const hpLoss = Number(prevEntry.hp || 0) - Number(nextEntry.hp || 0);
      if (hpLoss > 0) {
        applyDamageFxAtIndex(index, hpLoss, { heavy: hpLoss >= 3 });
      }
      return;
    }

    const movedIndex = nextPositions.get(prevEntry.instanceId);
    if (typeof movedIndex === 'number') return;

    const vanishedAmount = Math.max(1, Number(prevEntry.hp || 1));
    applyDamageFxAtIndex(index, vanishedAmount, { heavy: true, label: `-${vanishedAmount}` });
    spawnDefeatGhost(index, prevEntry);
  });
}

function loadSfxEnabled() {
  try {
    const raw = localStorage.getItem(SFX_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== '0';
  } catch (_) {
    return true;
  }
}

function loadBgmEnabled() {
  try {
    const raw = localStorage.getItem(BGM_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== '0';
  } catch (_) {
    return true;
  }
}

function loadBgmVolumeLevel() {
  try {
    const raw = String(localStorage.getItem(BGM_VOLUME_STORAGE_KEY) || 'medium');
    return Object.prototype.hasOwnProperty.call(BGM_VOLUMES, raw) ? raw : 'medium';
  } catch (_) {
    return 'medium';
  }
}

function saveBgmEnabled() {
  try {
    localStorage.setItem(BGM_STORAGE_KEY, bgmEnabled ? '1' : '0');
  } catch (_) {
    // no-op
  }
}

function saveBgmVolumeLevel() {
  try {
    localStorage.setItem(BGM_VOLUME_STORAGE_KEY, bgmVolumeLevel);
  } catch (_) {
    // no-op
  }
}

function shouldPlayBgm() {
  if (document.hidden) return false;
  const phase = String(matchState?.phase || '');
  if (matchState?.active && phase && phase !== 'idle') return true;
  if (roomSyncState?.enabled && phase && phase !== 'idle') return true;
  return false;
}

function getBgmVolumeValue() {
  return BGM_VOLUMES[bgmVolumeLevel] ?? BGM_VOLUMES.medium;
}

function getBgmAudio() {
  if (!bgmAudio) {
    const audio = new Audio(BGM_SRC);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = getBgmVolumeValue();
    bgmAudio = audio;
  }
  return bgmAudio;
}

function updateBgmToggleButton() {
  if (!bgmToggleButton) return;
  const waiting = bgmEnabled && !bgmReadyForPlayback;
  const volumeLabel = BGM_VOLUME_LABELS[bgmVolumeLevel] || '中';
  bgmToggleButton.textContent = bgmEnabled ? (waiting ? `BGM ON * (${volumeLabel})` : `BGM ON (${volumeLabel})`) : 'BGM OFF';
  bgmToggleButton.title = waiting ? '最初のクリック後にBGMが再生されます' : '対戦BGMのオンオフ';
  bgmToggleButton.style.opacity = bgmEnabled ? '0.95' : '0.65';
  bgmToggleButton.style.borderColor = bgmEnabled ? 'rgba(255, 214, 130, 0.6)' : 'rgba(255, 255, 255, 0.18)';
  bgmVolumeButtons.forEach((button, level) => {
    const isActive = level === bgmVolumeLevel;
    button.style.opacity = bgmEnabled ? '0.95' : '0.55';
    button.style.borderColor = isActive ? 'rgba(255, 214, 130, 0.72)' : 'rgba(255, 255, 255, 0.18)';
    button.style.background = isActive ? 'rgba(124, 31, 54, 0.92)' : 'rgba(23, 10, 18, 0.82)';
    button.style.color = isActive ? '#fff6de' : '#e8d9c0';
    button.style.boxShadow = isActive ? '0 0 0 1px rgba(255, 214, 130, 0.22), 0 6px 16px rgba(0, 0, 0, 0.24)' : '0 6px 16px rgba(0, 0, 0, 0.18)';
  });
}

function syncBgmPlayback(forcePause = false) {
  const audio = getBgmAudio();
  if (!audio) return;
  audio.volume = getBgmVolumeValue();

  if (forcePause || !bgmEnabled || !bgmReadyForPlayback || !shouldPlayBgm()) {
    if (!audio.paused) audio.pause();
    updateBgmToggleButton();
    return;
  }

  if (audio.paused) {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // no-op
      });
    }
  }
  updateBgmToggleButton();
}

function markBgmInteractionReady() {
  if (bgmReadyForPlayback) return;
  bgmReadyForPlayback = true;
  updateBgmToggleButton();
  syncBgmPlayback();
}

function setBgmEnabled(nextValue) {
  bgmEnabled = !!nextValue;
  saveBgmEnabled();
  updateBgmToggleButton();
  if (bgmEnabled) {
    markBgmInteractionReady();
    syncBgmPlayback();
  } else {
    syncBgmPlayback(true);
  }
}

function setBgmVolumeLevel(nextLevel) {
  if (!Object.prototype.hasOwnProperty.call(BGM_VOLUMES, nextLevel)) return;
  bgmVolumeLevel = nextLevel;
  saveBgmVolumeLevel();
  if (bgmAudio) {
    bgmAudio.volume = getBgmVolumeValue();
  }
  updateBgmToggleButton();
  syncBgmPlayback();
}

function createBgmToggleButton() {
  if (!document.body || document.getElementById('redveinBgmToggleWrap')) return;

  const wrap = document.createElement('div');
  wrap.id = 'redveinBgmToggleWrap';
  Object.assign(wrap.style, {
    position: 'fixed',
    right: '14px',
    bottom: '56px',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 'calc(100vw - 24px)',
  });

  bgmToggleButton = document.createElement('button');
  bgmToggleButton.id = 'redveinBgmToggle';
  bgmToggleButton.type = 'button';
  bgmToggleButton.setAttribute('aria-label', '対戦BGMのオンオフ');
  Object.assign(bgmToggleButton.style, {
    padding: '8px 12px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 214, 130, 0.45)',
    background: 'rgba(23, 10, 18, 0.86)',
    color: '#fff0cc',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.28)',
    backdropFilter: 'blur(6px)',
  });
  bgmToggleButton.addEventListener('click', () => {
    markBgmInteractionReady();
    setBgmEnabled(!bgmEnabled);
  });
  wrap.appendChild(bgmToggleButton);

  const volumeWrap = document.createElement('div');
  volumeWrap.id = 'redveinBgmVolumeWrap';
  Object.assign(volumeWrap.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 6px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 214, 130, 0.18)',
    background: 'rgba(14, 7, 12, 0.72)',
    backdropFilter: 'blur(6px)',
  });

  [['small', '小'], ['medium', '中'], ['large', '大']].forEach(([level, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', `BGM音量 ${label}`);
    Object.assign(button.style, {
      minWidth: '32px',
      padding: '6px 10px',
      borderRadius: '999px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      background: 'rgba(23, 10, 18, 0.82)',
      color: '#e8d9c0',
      fontSize: '12px',
      fontWeight: '700',
      letterSpacing: '0.04em',
      cursor: 'pointer',
      transition: 'transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, background 0.12s ease',
    });
    button.addEventListener('click', () => {
      markBgmInteractionReady();
      setBgmVolumeLevel(level);
    });
    button.addEventListener('pointerdown', () => {
      button.style.transform = 'scale(0.96)';
    });
    const resetScale = () => { button.style.transform = 'scale(1)'; };
    button.addEventListener('pointerup', resetScale);
    button.addEventListener('pointerleave', resetScale);
    bgmVolumeButtons.set(level, button);
    volumeWrap.appendChild(button);
  });

  wrap.appendChild(volumeWrap);
  document.body.appendChild(wrap);
  updateBgmToggleButton();
}

function setupBgm() {
  createBgmToggleButton();
  const unlockHandler = () => {
    markBgmInteractionReady();
  };
  window.addEventListener('pointerdown', unlockHandler, { passive: true });
  window.addEventListener('keydown', unlockHandler, { passive: true });
  window.addEventListener('touchstart', unlockHandler, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      syncBgmPlayback(true);
      return;
    }
    syncBgmPlayback();
  });
  syncBgmPlayback();
}

function saveSfxEnabled() {
  try {
    localStorage.setItem(SFX_STORAGE_KEY, sfxEnabled ? '1' : '0');
  } catch (_) {
    // no-op
  }
}

function getSfxAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!sfxAudioContext) {
    sfxAudioContext = new AudioContextClass();
    sfxMasterGainNode = sfxAudioContext.createGain();
    sfxMasterGainNode.gain.value = SFX_MASTER_VOLUME;
    sfxMasterGainNode.connect(sfxAudioContext.destination);
  }
  return sfxAudioContext;
}

function updateSfxToggleButton() {
  if (!sfxToggleButton) return;
  sfxToggleButton.textContent = sfxEnabled ? 'SE ON' : 'SE OFF';
  sfxToggleButton.style.opacity = sfxEnabled ? '0.95' : '0.65';
  sfxToggleButton.style.borderColor = sfxEnabled ? 'rgba(255, 160, 160, 0.55)' : 'rgba(255, 255, 255, 0.18)';
}

async function unlockSfx() {
  const context = getSfxAudioContext();
  if (!context) return;
  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch (_) {
      // no-op
    }
  }
}

function setSfxEnabled(nextValue) {
  sfxEnabled = !!nextValue;
  saveSfxEnabled();
  updateSfxToggleButton();
  if (sfxEnabled) {
    unlockSfx();
    playSfx('confirm');
  }
}

function createSfxToggleButton() {
  if (!document.body || document.getElementById('redveinSfxToggle')) return;
  sfxToggleButton = document.createElement('button');
  sfxToggleButton.id = 'redveinSfxToggle';
  sfxToggleButton.type = 'button';
  sfxToggleButton.setAttribute('aria-label', '効果音のオンオフ');
  Object.assign(sfxToggleButton.style, {
    position: 'fixed',
    right: '14px',
    bottom: '14px',
    zIndex: '9999',
    padding: '8px 12px',
    borderRadius: '999px',
    border: '1px solid rgba(255, 160, 160, 0.45)',
    background: 'rgba(23, 10, 18, 0.86)',
    color: '#ffe7ee',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.28)',
    backdropFilter: 'blur(6px)',
  });
  sfxToggleButton.addEventListener('click', () => {
    setSfxEnabled(!sfxEnabled);
  });
  document.body.appendChild(sfxToggleButton);
  updateSfxToggleButton();
}

function setupSfx() {
  createSfxToggleButton();
  const unlockHandler = () => {
    if (!sfxEnabled) return;
    unlockSfx();
  };
  window.addEventListener('pointerdown', unlockHandler, { passive: true });
  window.addEventListener('keydown', unlockHandler, { passive: true });
  window.addEventListener('touchstart', unlockHandler, { passive: true });
}

function scheduleTone(context, options = {}) {
  if (!context || !sfxMasterGainNode) return;
  const {
    start = context.currentTime,
    duration = 0.1,
    release = 0.08,
    frequency = 440,
    endFrequency = null,
    type = 'sine',
    gain = 0.5,
  } = options;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(Math.max(40, Number(frequency) || 440), start);
  if (endFrequency != null && Number(endFrequency) > 0) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, Number(endFrequency)), start + duration);
  }

  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.linearRampToValueAtTime(Math.max(0.0001, gain), start + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration + release);

  oscillator.connect(gainNode);
  gainNode.connect(sfxMasterGainNode);

  oscillator.start(start);
  oscillator.stop(start + duration + release + 0.02);
}

function playSfx(kind) {
  if (!sfxEnabled) return;
  const context = getSfxAudioContext();
  if (!context || !sfxMasterGainNode) return;
  if (context.state === 'suspended') {
    context.resume().catch(() => {});
  }

  const start = context.currentTime + 0.005;

  switch (kind) {
    case 'attack':
      scheduleTone(context, { start, duration: 0.08, release: 0.06, frequency: 210, endFrequency: 120, type: 'sawtooth', gain: 0.85 });
      scheduleTone(context, { start: start + 0.012, duration: 0.05, release: 0.04, frequency: 520, endFrequency: 260, type: 'square', gain: 0.2 });
      break;
    case 'item':
      scheduleTone(context, { start, duration: 0.05, release: 0.03, frequency: 520, endFrequency: 620, type: 'triangle', gain: 0.35 });
      scheduleTone(context, { start: start + 0.05, duration: 0.05, release: 0.03, frequency: 660, endFrequency: 760, type: 'triangle', gain: 0.35 });
      scheduleTone(context, { start: start + 0.1, duration: 0.07, release: 0.05, frequency: 880, endFrequency: 980, type: 'triangle', gain: 0.4 });
      break;
    case 'confirm':
      scheduleTone(context, { start, duration: 0.035, release: 0.03, frequency: 740, endFrequency: 780, type: 'square', gain: 0.28 });
      scheduleTone(context, { start: start + 0.045, duration: 0.045, release: 0.04, frequency: 980, endFrequency: 1040, type: 'square', gain: 0.22 });
      break;
    case 'defeat':
      scheduleTone(context, { start, duration: 0.18, release: 0.08, frequency: 220, endFrequency: 72, type: 'sawtooth', gain: 0.55 });
      scheduleTone(context, { start: start + 0.03, duration: 0.14, release: 0.08, frequency: 160, endFrequency: 55, type: 'triangle', gain: 0.35 });
      break;
    case 'victory':
      scheduleTone(context, { start, duration: 0.08, release: 0.08, frequency: 164.81, endFrequency: 110, type: 'sawtooth', gain: 0.34 });
      scheduleTone(context, { start: start + 0.015, duration: 0.06, release: 0.05, frequency: 523.25, endFrequency: 523.25, type: 'triangle', gain: 0.28 });
      scheduleTone(context, { start: start + 0.075, duration: 0.07, release: 0.05, frequency: 659.25, endFrequency: 659.25, type: 'triangle', gain: 0.3 });
      scheduleTone(context, { start: start + 0.14, duration: 0.08, release: 0.06, frequency: 783.99, endFrequency: 783.99, type: 'triangle', gain: 0.32 });
      scheduleTone(context, { start: start + 0.23, duration: 0.12, release: 0.08, frequency: 1046.5, endFrequency: 1046.5, type: 'triangle', gain: 0.42 });
      scheduleTone(context, { start: start + 0.23, duration: 0.12, release: 0.08, frequency: 1318.51, endFrequency: 1318.51, type: 'square', gain: 0.16 });
      scheduleTone(context, { start: start + 0.38, duration: 0.15, release: 0.1, frequency: 1567.98, endFrequency: 1567.98, type: 'triangle', gain: 0.22 });
      scheduleTone(context, { start: start + 0.41, duration: 0.18, release: 0.12, frequency: 1046.5, endFrequency: 2093, type: 'sine', gain: 0.14 });
      scheduleTone(context, { start: start + 0.56, duration: 0.1, release: 0.08, frequency: 2093, endFrequency: 1760, type: 'square', gain: 0.12 });
      break;
    case 'defeat_match':
      scheduleTone(context, { start, duration: 0.1, release: 0.05, frequency: 220, endFrequency: 190, type: 'triangle', gain: 0.26 });
      scheduleTone(context, { start: start + 0.11, duration: 0.12, release: 0.06, frequency: 174.61, endFrequency: 146.83, type: 'triangle', gain: 0.28 });
      scheduleTone(context, { start: start + 0.23, duration: 0.14, release: 0.08, frequency: 130.81, endFrequency: 98, type: 'triangle', gain: 0.3 });
      break;
    case 'deploy':
      scheduleTone(context, { start, duration: 0.045, release: 0.03, frequency: 410, endFrequency: 320, type: 'square', gain: 0.22 });
      scheduleTone(context, { start: start + 0.028, duration: 0.07, release: 0.04, frequency: 240, endFrequency: 180, type: 'triangle', gain: 0.18 });
      break;
    case 'move':
      scheduleTone(context, { start, duration: 0.05, release: 0.03, frequency: 680, endFrequency: 520, type: 'triangle', gain: 0.12 });
      scheduleTone(context, { start: start + 0.02, duration: 0.08, release: 0.05, frequency: 240, endFrequency: 180, type: 'sine', gain: 0.14 });
      break;
    default:
      break;
  }
}

function getFinishSfxKind(message = '') {
  const roomPlayerKey = getRoomPlayerKey();
  if (!roomPlayerKey) return 'victory';
  const p1Win = message.includes('プレイヤー1の全滅勝ち') || message.includes('プレイヤー1のポイント勝ち');
  const p2Win = message.includes('プレイヤー2の全滅勝ち') || message.includes('プレイヤー2のポイント勝ち');
  if ((roomPlayerKey === 'player1' && p1Win) || (roomPlayerKey === 'player2' && p2Win)) return 'victory';
  if ((roomPlayerKey === 'player1' && p2Win) || (roomPlayerKey === 'player2' && p1Win)) return 'defeat_match';
  return 'victory';
}


function createEmptyMatchState() {
  return {
    active: false,
    phase: 'idle',
    currentPlayer: 'player1',
    round: 1,
    setupStepIndex: 0,
    placedInCurrentStep: 0,
    selectedReserveCardId: null,
    selectedUnitId: null,
    actionMode: null,
    turnState: { moved: false, movedUnitId: null, attacked: false, attackCount: 0, attackUnitId: null, itemWindowOpen: true, itemUsed: false, selectedItemCardId: null, selectedItemTargetIndex: null, pendingAction: null, acceleratedUnitId: null, acceleratedMovesRemaining: 0, royalCommandUnitId: null, royalCommandAttackReady: false, postAttackMoveUnitId: null, pendingRedeployCardId: null, pendingRedeployOwner: null },
    board: Array(25).fill(null),
    pendingRevives: [],
    pendingRedeploys: [],
    log: [],
    winner: null,
    players: {
      player1: createEmptyPlayerState(),
      player2: createEmptyPlayerState(),
    },
  };
}

function createEmptyPlayerState() {
  return {
    deckName: '',
    battleDeckIds: [],
    reserveBattleIds: [],
    fieldId: '',
    itemStates: [],
    defeated: 0,
    teamDamageReduction: 0,
    teamDamageReductionExpiresOnOwnTurnStart: false,
    negateEnemyFieldUntilOwnTurnStart: false,
  };
}

function getRoomPlayerKey() {
  if (roomSyncState.role === 'p1') return 'player1';
  if (roomSyncState.role === 'p2') return 'player2';
  return '';
}

function canViewPrivateZone(playerKey) {
  if (!roomSyncState.enabled) return true;
  const roomPlayerKey = getRoomPlayerKey();
  return !!roomPlayerKey && roomPlayerKey === playerKey;
}

function isRoomActiveBattlePlayer() {
  const playerKey = getRoomPlayerKey();
  return !!playerKey && playerKey === matchState.currentPlayer;
}

function clearRoomPendingRequests() {
  roomSyncState.pendingSetupRequest = false;
  roomSyncState.pendingMoveRequest = false;
  roomSyncState.pendingAttackRequest = false;
  roomSyncState.pendingItemUseRequest = false;
  roomSyncState.pendingFinishItemPhaseRequest = false;
  roomSyncState.pendingEndTurnRequest = false;
}

function isRoomBattleLocked() {
  return roomSyncState.enabled && matchState.phase === 'battle' && !roomSyncState.battleControlsEnabled;
}

function setRoomSyncConfig(config = {}) {
  roomSyncState.enabled = !!config.enabled;
  roomSyncState.role = config.role || '';
  roomSyncState.battleControlsEnabled = !!config.battleControlsEnabled;
  roomSyncState.onSetupPlaceRequest = typeof config.onSetupPlaceRequest === 'function' ? config.onSetupPlaceRequest : null;
  roomSyncState.onMoveRequest = typeof config.onMoveRequest === 'function' ? config.onMoveRequest : null;
  roomSyncState.onAttackRequest = typeof config.onAttackRequest === 'function' ? config.onAttackRequest : null;
  roomSyncState.onItemUseRequest = typeof config.onItemUseRequest === 'function' ? config.onItemUseRequest : null;
  roomSyncState.onFinishItemPhaseRequest = typeof config.onFinishItemPhaseRequest === 'function' ? config.onFinishItemPhaseRequest : null;
  roomSyncState.onEndTurnRequest = typeof config.onEndTurnRequest === 'function' ? config.onEndTurnRequest : null;
  clearRoomPendingRequests();
  if (getCombatFxHoldMsRemaining() > 0) {
    queueRenderAfterCombatFx();
    return;
  }
  renderMatchArea();
}

function applyRoomSetupPlacement(data = {}) {
  if (!matchState.active) return false;
  const playerKey = data.player;
  const cardId = data.cardId;
  const targetIndex = Number(data.targetIndex);
  if (!playerKey || !cardId || Number.isNaN(targetIndex) || targetIndex < 0 || targetIndex >= 25) return false;

  const player = getPlayerState(playerKey);
  if (!player) return false;
  if (!matchState.board[targetIndex]) {
    matchState.board[targetIndex] = createUnitInstance(cardId, playerKey, data.instanceId || '');
  }
  player.reserveBattleIds = player.reserveBattleIds.filter((id) => id !== cardId);
  matchState.selectedReserveCardId = null;
  matchState.selectedUnitId = null;
  matchState.actionMode = null;
  roomSyncState.pendingSetupRequest = false;

  if (typeof data.setupStepIndex === 'number') matchState.setupStepIndex = data.setupStepIndex;
  if (typeof data.placedInCurrentStep === 'number') matchState.placedInCurrentStep = data.placedInCurrentStep;
  if (data.currentPlayer) matchState.currentPlayer = data.currentPlayer;

  const previousPhase = matchState.phase;
  if (data.phase) matchState.phase = data.phase;

  const placedCard = cardMap.get(cardId);
  addLog(`${PLAYER_LABEL[playerKey]} が ${(placedCard && placedCard.card_name) || cardId} を配置しました`);
  playSfx('deploy');

  if (previousPhase !== 'battle' && matchState.phase === 'battle') {
    beginTurn('player1');
    addLog('配置完了。次の段階で手番同期を入れます。この版では配置フェーズ同期まで対応しています');
  } else if (matchState.phase === 'setup') {
    const nextStep = getCurrentSetupStep();
    if (nextStep) addLog(`${PLAYER_LABEL[nextStep.player]} の配置フェーズです`);
  }

  renderMatchArea();
  return true;
}

function getAdjacentGuardianReduction(targetIndex, ownerKey) {
  if (targetIndex == null || targetIndex < 0) return 0;
  const { row, col } = indexToCoord(targetIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  let count = 0;
  for (const [r, c] of neighbors) {
    if (r < 0 || r > 4 || c < 0 || c > 4) continue;
    const unit = matchState.board[coordToIndex(r, c)];
    if (!unit) continue;
    if (unit.owner === ownerKey && unit.cardId === 'RV-013' && isUnitCardEffectActive(unit, coordToIndex(r, c))) count += 1;
  }
  return count;
}

function getAdjacentEnemySentryReduction(targetIndex, ownerKey) {
  if (targetIndex == null || targetIndex < 0) return 0;
  const { row, col } = indexToCoord(targetIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  let count = 0;
  for (const [r, c] of neighbors) {
    if (r < 0 || r > 4 || c < 0 || c > 4) continue;
    const unit = matchState.board[coordToIndex(r, c)];
    if (!unit) continue;
    if (unit.owner !== ownerKey && unit.cardId === 'RV-011' && isUnitCardEffectActive(unit, coordToIndex(r, c))) count += 1;
  }
  return count;
}

function findAdjacentGuardianKnight(targetIndex, ownerKey) {
  if (targetIndex == null || targetIndex < 0) return null;
  const { row, col } = indexToCoord(targetIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  for (const [r, c] of neighbors) {
    if (r < 0 || r > 4 || c < 0 || c > 4) continue;
    const idx = coordToIndex(r, c);
    const unit = matchState.board[idx];
    if (!unit) continue;
    if (unit.owner === ownerKey && unitHasEffectType(unit, 'guard_adjacent_ally_once') && !unit.guardBlockUsed) {
      return { unit, index: idx };
    }
  }
  return null;
}


function findAdjacentKingCommander(targetIndex, ownerKey) {
  if (targetIndex == null || targetIndex < 0) return null;
  const { row, col } = indexToCoord(targetIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  for (const [r, c] of neighbors) {
    if (r < 0 || r > 4 || c < 0 || c > 4) continue;
    const idx = coordToIndex(r, c);
    const unit = matchState.board[idx];
    if (!unit) continue;
    if (unit.owner === ownerKey && unitHasEffectType(unit, 'intercept_and_counter_1')) {
      return { unit, index: idx };
    }
  }
  return null;
}

function isBackAttack(attackerIndex, defenderIndex, defenderOwner) {
  if (attackerIndex == null || defenderIndex == null) return false;
  const attacker = indexToCoord(attackerIndex);
  const defender = indexToCoord(defenderIndex);
  if (attacker.row != defender.row) return false;
  if (defenderOwner === 'player1') return attacker.col === defender.col - 1;
  return attacker.col === defender.col + 1;
}

function targetHasAtkBuffOrReduction(defender, defenderIndex) {
  if (!defender) return false;
  const hasAtkBuff = !isUnitBuffsAndHealNegated(defender)
    && (Number(defender.tempAtkBuff || 0) > 0 || getFieldAttackBonus(defender, defenderIndex) > 0);
  const hasReduction = getUnitDamageReductionTotal(defender, defenderIndex) > 0;
  return hasAtkBuff || hasReduction;
}

function targetHasFieldBuffOrReduction(defender, defenderIndex) {
  if (!defender) return false;
  const hasFieldAtkBuff = !isUnitBuffsAndHealNegated(defender) && getFieldAttackBonus(defender, defenderIndex) > 0;
  const hasFieldReduction = defenderIndex != null && isPointZone(defenderIndex)
    && playerHasFieldEffect(defender.owner, 'field_center_ally_guard_1_atk_plus_1');
  return hasFieldAtkBuff || hasFieldReduction;
}

function getTargetedAttackBonus(attacker, attackerIndex, defender, defenderIndex) {
  if (!attacker || !defender || isUnitBuffsAndHealNegated(attacker) || isUnitCenterSilenced(attacker, attackerIndex)) return 0;
  let bonus = 0;
  if (isUnitCardEffectActive(attacker, attackerIndex) && attacker.cardId === 'RV-028' && isBackAttack(attackerIndex, defenderIndex, defender.owner)) bonus += 1;
  if (unitHasEffectType(attacker, 'atk_plus_1_vs_full_or_healed_enemy') || unitHasEffectType(attacker, 'on_damage_apply_no_heal_until_next_opponent_round_and_no_revive_if_destroyed_plus_atk_1_vs_full_or_healed_enemy')) {
    const isFull = Number(defender.currentHp || 0) >= Number(defender.maxHp || 0);
    const healedThisRound = Number(defender.healedInRound || 0) === Number(matchState.round || 0);
    if (isFull || healedThisRound) bonus += 1;
  }
  if (unitHasEffectType(attacker, 'atk_plus_1_vs_buffed_or_reduced_enemy_and_ignore_reduction') && targetHasAtkBuffOrReduction(defender, defenderIndex)) bonus += 1;
  if (unitHasEffectType(attacker, 'ignore_reduction_vs_center_enemy_and_atk_plus_1_if_field_buffed') && isPointZone(defenderIndex) && targetHasFieldBuffOrReduction(defender, defenderIndex)) bonus += 1;
  return bonus;
}

function getConditionalAttackBonus(unit, boardIndex) {
  if (!unit || isUnitBuffsAndHealNegated(unit) || isUnitCenterSilenced(unit, boardIndex)) return 0;
  let bonus = 0;
  if (unit.cardId === 'RV-012' && isPointZone(boardIndex)) bonus += 1;
  if (unit.cardId === 'RV-030' && matchState.phase === 'battle' && matchState.turnState?.movedUnitId === unit.instanceId) bonus += 1;
  return bonus;
}


function getActivePanelIndex() {
  return matchState.currentPlayer === 'player2' ? 1 : 0;
}

function getWaitingPanelText() {
  const activeLabel = matchState.currentPlayer === 'player2' ? 'プレイヤー2' : 'プレイヤー1';
  if (matchState.phase === 'idle') return 'デッキを選んで開始してください';
  if (matchState.phase === 'finished') return '対戦終了。こちらの操作はありません。';
  return `${activeLabel} の操作中です。こちらは待機してください。`;
}

function typeLabel(type) {
  if (type === 'battle') return 'バトル';
  if (type === 'item') return 'アイテム';
  if (type === 'field') return '環境';
  return type;
}

function statsLabel(card) {
  if (card.type !== 'battle') return 'ステータスなし';
  return `ATK ${card.atk} / HP ${card.hp} / MOVE ${card.move}`;
}

function getCardImagePath(card) {
  if (!card || !card.image_file) return '';
  return IMAGE_BASE_PATH + card.image_file;
}

function getHpClass(currentHp, maxHp) {
  const ratio = maxHp > 0 ? currentHp / maxHp : 0;
  if (ratio <= 0.34) return 'hp-low';
  if (ratio <= 0.67) return 'hp-mid';
  return 'hp-high';
}


function getUnitDamageReductionParts(unit, boardIndex = null, options = {}) {
  if (!unit) return [];
  if (isUnitBuffsAndHealNegated(unit)) return [];
  const player = getPlayerState(unit.owner);
  const parts = [];
  const shieldReduction = Number(unit.singleUseDamageReduction || 0);
  const teamReduction = Number(player?.teamDamageReduction || 0);
  const guardianReduction = boardIndex != null ? getAdjacentGuardianReduction(boardIndex, unit.owner) : 0;
  const attacker = options?.attacker || null;
  const sourceType = String(options?.sourceType || '');
  const strongerEnemyReduction = attacker
    && attacker.owner !== unit.owner
    && unitHasEffectType(unit, 'reduce_damage_from_stronger_enemy_1')
    && Number(attacker.atk || 0) > Number(unit.atk || 0)
      ? 1
      : 0;
  if (shieldReduction > 0) parts.push({ label: '防護符', value: shieldReduction });
  if (teamReduction > 0) parts.push({ label: '防壁展開', value: teamReduction });
  if (guardianReduction > 0) parts.push({ label: guardianReduction > 1 ? `守護兵×${guardianReduction}` : '守護兵', value: guardianReduction });
  if (strongerEnemyReduction > 0) parts.push({ label: '断罪の聖騎士', value: strongerEnemyReduction });
  if (sourceType === 'enemy_item' && boardIndex != null && hasAdjacentHolyLanceAura(unit, boardIndex)) {
    parts.push({ label: '星祈の聖槍', value: 1 });
  }
  if (boardIndex != null && isPointZone(boardIndex) && unitHasEffectType(unit, 'ignore_enemy_field_effects_and_center_guard_1')) {
    parts.push({ label: '蒼淵の海剣', value: 1 });
  }
  if (boardIndex != null && isPointZone(boardIndex) && !isEnemyCenterFieldBuffHealNegated(unit, boardIndex)) {
    const fieldCard = getPlayerFieldCard(unit.owner);
    if (fieldCard?.effect_type === 'field_center_ally_guard_1_atk_plus_1') {
      parts.push({ label: '王の玉座', value: 1 });
    }
  }
  return parts;
}

function getUnitDamageReductionTotal(unit, boardIndex = null) {
  return getUnitDamageReductionParts(unit, boardIndex).reduce((sum, part) => sum + Number(part.value || 0), 0);
}

function getUnitDamageReductionTitle(unit, boardIndex = null) {
  const parts = getUnitDamageReductionParts(unit, boardIndex);
  if (!parts.length) return '';
  return parts.map((part) => `${part.label} -${part.value}`).join(' / ');
}



function getPendingAttackBonusForUnit(unit) {
  const pendingAction = getPendingAction();
  if (!unit || !pendingAction || pendingAction.type !== 'attack' || pendingAction.unitId !== unit.instanceId) return 0;
  const attackerIndex = findUnitIndexById(unit.instanceId);
  const defender = matchState.board[pendingAction.targetIndex];
  if (attackerIndex < 0 || !defender) return 0;
  return getTargetedAttackBonus(unit, attackerIndex, defender, pendingAction.targetIndex);
}

function getUnitAttackBonusParts(unit, boardIndex = null) {
  if (!unit) return [];
  if (isUnitBuffsAndHealNegated(unit)) return [];
  const parts = [];
  if (Number(unit.tempAtkBuff || 0) > 0) parts.push({ label: '一時攻撃補正', value: Number(unit.tempAtkBuff || 0) });
  const fieldBonus = getFieldAttackBonus(unit, boardIndex);
  if (fieldBonus > 0) parts.push({ label: '環境補正', value: fieldBonus });
  if (!isUnitCenterSilenced(unit, boardIndex) && unit.cardId === 'RV-012' && isPointZone(boardIndex)) parts.push({ label: '斬撃兵', value: 1 });
  if (!isUnitCenterSilenced(unit, boardIndex) && unit.cardId === 'RV-030' && matchState.phase === 'battle' && matchState.turnState?.movedUnitId === unit.instanceId) parts.push({ label: '騎馬兵', value: 1 });
  const pendingBonus = getPendingAttackBonusForUnit(unit);
  if (pendingBonus > 0) {
    const effectType = getUnitMeta(unit)?.effect_type || '';
    let label = '背後攻撃';
    if (effectType === 'atk_plus_1_vs_full_or_healed_enemy') label = '朱蓮の鳳刀';
    if (effectType === 'atk_plus_1_vs_buffed_or_reduced_enemy_and_ignore_reduction') label = '蝕月の断鎌';
    if (effectType === 'ignore_reduction_vs_center_enemy_and_atk_plus_1_if_field_buffed') label = '焔継の王剣';
    parts.push({ label, value: pendingBonus });
  }
  if (getRoyalCommandAttackBonus(unit) > 0) parts.push({ label: '王冠の勅命', value: getRoyalCommandAttackBonus(unit) });
  return parts;
}

function getUnitDisplayedMoveDelta(unit, boardIndex = null) {
  if (!unit) return 0;
  const meta = cardMap.get(unit.cardId);
  if (!meta || typeof meta.move !== 'number') return 0;
  return getEffectiveMove(unit, boardIndex) - Number(meta.move || 0);
}

function getStatusBadgeIcon(kind) {
  if (kind === 'reduction') return '🛡';
  if (kind === 'guard-ready') return '🛡';
  if (kind === 'attack-up') return '⚔';
  if (kind === 'move-up' || kind === 'move-down') return '➜';
  if (kind === 'move-lock') return '⛔';
  if (kind === 'action-lock' || kind === 'attack-lock') return '🚫';
  if (kind === 'field-immune') return '界';
  if (kind === 'item-untargetable') return '的';
  if (kind === 'item-destroy-immune') return '破';
  if (kind === 'item-stun-immune') return '止';
  if (kind === 'control-guard') return '防';
  if (kind === 'no-heal-revive') return '癒';
  if (kind === 'center-silence') return '黙';
  if (kind === 'full-silence') return '封';
  return '•';
}

function getUnitAbilityBadges(unit) {
  const meta = getUnitMeta(unit);
  if (!meta) return [];
  if (isUnitCenterSilenced(unit) || isUnitFullySilenced(unit)) return [];
  const effectType = String(meta.effect_type || '');
  const badges = [];
  const push = (kind, label, title) => badges.push({ kind, label, title });

  if (['range_2', 'row_range_attack', 'pierce_line_2'].includes(effectType)) {
    push('ability-range', '遠', effectType === 'row_range_attack' ? '遠距離攻撃: 同じ横一列の敵を攻撃できます' : effectType === 'pierce_line_2' ? '遠距離攻撃: 直線2マス先まで攻撃できます' : '遠距離攻撃: 2マス先の敵も攻撃できます');
  }
  if (effectType === 'pierce_line_2') push('ability-pierce', '貫', '貫通攻撃: 軽減無視の直線攻撃です');
  if (effectType === 'double_attack') push('ability-speed', '連', '連撃: 1ターンに2回攻撃できます');
  if (effectType === 'move_after_attack_1') push('ability-speed', '迅', '攻撃後移動: 攻撃後に1マス移動できます');
  if (['return_to_home_row_after_attack', 'return_and_redeploy_full_heal'].includes(effectType)) push('ability-shadow', '影', '影の暗殺者: 攻撃後、自陣の同じ段に戻ります。戻り先が埋まっている場合は戻りません');
  if (effectType === 'revive_next_turn_from_base') push('ability-revive', '復', '復活: 次の自身の手番開始時に自陣から復活します');
  if (['guard_adjacent_ally_once', 'intercept_and_counter_1'].includes(effectType)) push('ability-guard', '護', '護衛効果を持つユニットです');
  if (['self_center_aoe_1_on_attack', 'splash_adjacent_enemy_on_attack'].includes(effectType)) push('ability-aoe', '範', '範囲ダメージ効果を持つユニットです');

  return badges;
}

function getExtraMoveSourceName(unitId) {
  if (!unitId || !matchState.turnState) return '加速術';
  return matchState.turnState.royalCommandUnitId === unitId ? '王冠の勅命' : '加速術';
}

function getAccelerationStatusBadge(unit) {
  if (!unit || matchState.phase !== 'battle' || !matchState.turnState) return null;
  if (matchState.turnState.acceleratedUnitId !== unit.instanceId || matchState.turnState.acceleratedMovesRemaining <= 0) return null;
  return {
    kind: 'move-up',
    value: String(matchState.turnState.acceleratedMovesRemaining),
    title: `${getExtraMoveSourceName(unit.instanceId)}: 残り ${matchState.turnState.acceleratedMovesRemaining} 回移動できます`
  };
}


function findAdjacentReadyGuardianKnight(boardIndex, ownerKey) {
  const { row, col } = indexToCoord(boardIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  for (const [r, c] of neighbors) {
    if (r < 0 || r > 4 || c < 0 || c > 4) continue;
    const idx = coordToIndex(r, c);
    const unit = matchState.board[idx];
    if (!unit || unit.owner !== ownerKey) continue;
    if (unitHasEffectType(unit, 'guard_adjacent_ally_once') && unit.guardBlockUsed !== true) {
      return { unit, index: idx };
    }
  }
  return null;
}

function getUnitStatusBadges(unit, boardIndex = null) {
  if (!unit) return [];
  const badges = [];
  const reduction = getUnitDamageReductionTotal(unit, boardIndex);
  if (reduction > 0) {
    badges.push({ kind: 'reduction', value: String(reduction), title: getUnitDamageReductionTitle(unit, boardIndex) });
  }
  if (canNegateDamageOnce(unit)) {
    badges.push({ kind: 'guard-ready', value: '1', title: '騎士: 試合中1回だけダメージを無効化します' });
  }
  const selfGuardReady = unitHasEffectType(unit, 'guard_adjacent_ally_once') && unit.guardBlockUsed !== true;
  const protectedByGuardian = boardIndex != null ? findAdjacentReadyGuardianKnight(boardIndex, unit.owner) : null;
  if (selfGuardReady || (protectedByGuardian && protectedByGuardian.unit.instanceId !== unit.instanceId)) {
    badges.push({ kind: 'guard-ready', value: '1', title: selfGuardReady ? '守護騎士: 隣接する味方への攻撃を1回だけ完全防御' : `${protectedByGuardian.unit.name}: このユニットへの攻撃を1回だけ完全防御` });
  }
  const selfCounterGuard = unitHasEffectType(unit, 'intercept_and_counter_1');
  const protectedByKingCommander = boardIndex != null ? findAdjacentKingCommander(boardIndex, unit.owner) : null;
  if (selfCounterGuard || (protectedByKingCommander && protectedByKingCommander.unit.instanceId !== unit.instanceId)) {
    badges.push({ kind: 'guard-ready', value: '反', title: selfCounterGuard ? '王国騎士長: 隣接する味方への攻撃を引き受け、1ダメージで反撃します' : `${protectedByKingCommander.unit.name}: このユニットへの攻撃を引き受け、1ダメージで反撃します` });
  }
  const attackParts = getUnitAttackBonusParts(unit, boardIndex);
  const attackBonus = attackParts.reduce((sum, part) => sum + Number(part.value || 0), 0);
  if (attackBonus > 0) {
    badges.push({ kind: 'attack-up', value: `+${attackBonus}`, title: attackParts.map((part) => `${part.label} +${part.value}`).join(' / ') });
  }
  const moveDelta = getUnitDisplayedMoveDelta(unit, boardIndex);
  if (moveDelta !== 0) {
    badges.push({ kind: moveDelta > 0 ? 'move-up' : 'move-down', value: `${moveDelta > 0 ? '+' : ''}${moveDelta}`, title: `移動補正 ${moveDelta > 0 ? '+' : ''}${moveDelta}` });
  }
  const accelBadge = getAccelerationStatusBadge(unit);
  if (accelBadge) badges.push(accelBadge);
  if (cannotMoveByEffect(unit)) {
    badges.push({ kind: 'move-lock', value: '×', title: '防壁兵: このユニットは移動できません' });
  }
  if (unit.actionLocked) {
    badges.push({ kind: 'action-lock', value: '×', title: 'この手番は行動不可' });
  } else if (unit.attackLocked) {
    badges.push({ kind: 'attack-lock', value: '×', title: 'この手番は攻撃不可' });
  }
  if (unitIgnoresEnemyFieldEffects(unit)) {
    badges.push({ kind: 'field-immune', title: '敵の環境カードの効果を受けません' });
  }
  if (isUnitUntargetableByEnemyItems(unit)) {
    badges.push({ kind: 'item-untargetable', title: '次の相手ラウンド終了時まで、敵アイテムの対象になりません' });
  }
  if (boardIndex != null && hasAdjacentHolyLanceAura(unit, boardIndex)) {
    badges.push({ kind: 'item-stun-immune', value: '1', title: '星祈の聖槍: 敵アイテムのダメージを1軽減し、行動不能になりません' });
  }
  if (isUnitProtectedFromEnemyItemDestroy(unit, boardIndex)) {
    badges.push({ kind: 'item-destroy-immune', title: '敵アイテムの破壊効果を受けません' });
  }
  if (unit.negateNextDestroyStunDisableAttackUntilTurnStartOf) {
    badges.push({ kind: 'control-guard', value: '1', title: '竜骨の戦冠: 次に受ける破壊・行動不能・攻撃不能のいずれか1つを無効化します' });
  }
  if (unitHasEffectType(unit, 'negate_destroy_stun_disable_once_from_enemy_item_or_field_and_center_aura_adjacent_allies_no_item_destroy') && unit.itemFieldNegateControlUsed !== true) {
    badges.push({ kind: 'control-guard', value: '1', title: '竜骸の覇斧: 敵アイテムまたは環境による破壊・行動不能・攻撃不能を試合中1回だけ無効化します' });
  }
  if (unitHasNoHealNoRevive(unit)) {
    badges.push({ kind: 'no-heal-revive', title: '次の相手ラウンド終了時まで HPを回復できず、倒された場合は復活できません' });
  }
  if (isUnitFullySilenced(unit)) {
    badges.push({ kind: 'full-silence', title: '次の相手ラウンド終了時まで、このユニットのカード効果は無効です' });
  }
  if (isUnitCenterSilenced(unit, boardIndex)) {
    badges.push({ kind: 'center-silence', title: '次の相手ラウンド終了時まで、中央9マスにいる間は効果を失い攻撃できません' });
  }
  return badges;
}

function setCollectionHidden(hidden) {
  collectionHidden = hidden;
  document.body.classList.toggle('collection-hidden', hidden);
  if (toggleCollectionButton) toggleCollectionButton.textContent = hidden ? 'コレクションを表示' : 'コレクションを隠す';
}

function setLogHidden(hidden) {
  logHidden = hidden;
  document.body.classList.toggle('log-hidden', hidden);
  if (toggleLogButton) toggleLogButton.textContent = hidden ? 'ログを表示' : 'ログを隠す';
}

function setPhaseInfoText(text) {
  const activeIndex = getActivePanelIndex();
  actionPanels.forEach((panel, index) => {
    if (!panel.phaseInfo) return;
    panel.phaseInfo.textContent = index === activeIndex ? text : getWaitingPanelText();
  });
}

function setSelectionInfoText(text) {
  const activeIndex = getActivePanelIndex();
  actionPanels.forEach((panel, index) => {
    if (!panel.selectionInfo) return;
    panel.selectionInfo.textContent = index === activeIndex ? text : '相手ターン中は操作できません';
  });
}


function enforceStaticActionButtonLabels() {
  [
    [itemPhaseDoneButton, 'アイテムを使わず次へ'],
    [itemPhaseDoneButtonRight, 'アイテムを使わず次へ'],
    [confirmItemUseButton, 'このアイテムを使う'],
    [confirmItemUseButtonRight, 'このアイテムを使う'],
    [cancelItemUseButton, 'キャンセル'],
    [cancelItemUseButtonRight, 'キャンセル'],
  ].forEach(([button, label]) => {
    if (!button) return;
    if ((button.textContent || '').trim() !== label) {
      button.textContent = label;
    }
    button.hidden = false;
    button.style.display = '';
    button.style.visibility = 'visible';
    button.style.opacity = '';
    button.setAttribute('aria-label', label);
  });
}

function syncActionButtonsState(config) {
  enforceStaticActionButtonLabels();
  const activeIndex = getActivePanelIndex();
  actionPanels.forEach((panel, index) => {
    const isActiveSide = index === activeIndex;
    panel.container && panel.container.classList.toggle('panel-inactive', !isActiveSide);
    const withSideLock = (disabled) => disabled || !isActiveSide;
    panel.itemPhaseDoneButton && (panel.itemPhaseDoneButton.disabled = withSideLock(config.itemPhaseDoneDisabled));
    panel.moveModeButton && (panel.moveModeButton.disabled = withSideLock(config.moveDisabled));
    panel.attackModeButton && (panel.attackModeButton.disabled = withSideLock(config.attackDisabled));
    panel.endTurnButton && (panel.endTurnButton.disabled = withSideLock(config.endTurnDisabled));
    panel.clearSelectionButton && (panel.clearSelectionButton.disabled = withSideLock(config.clearDisabled));
    panel.confirmItemUseButton && (panel.confirmItemUseButton.disabled = withSideLock(config.confirmItemDisabled));
    panel.cancelItemUseButton && (panel.cancelItemUseButton.disabled = withSideLock(config.cancelItemDisabled));
    panel.confirmActionButton && (panel.confirmActionButton.disabled = withSideLock(config.confirmActionDisabled));
    panel.cancelActionButton && (panel.cancelActionButton.disabled = withSideLock(config.cancelActionDisabled));
    panel.moveModeButton && panel.moveModeButton.classList.toggle('active-mode', isActiveSide && config.moveActive);
    panel.attackModeButton && panel.attackModeButton.classList.toggle('active-mode', isActiveSide && config.attackActive);
    if (index === 1) {
      panel.itemPhaseDoneButton && panel.itemPhaseDoneButton.classList.toggle('mirrored-action-button', true);
      panel.moveModeButton && panel.moveModeButton.classList.toggle('mirrored-action-button', true);
      panel.attackModeButton && panel.attackModeButton.classList.toggle('mirrored-action-button', true);
      panel.endTurnButton && panel.endTurnButton.classList.toggle('mirrored-action-button', true);
      panel.clearSelectionButton && panel.clearSelectionButton.classList.toggle('mirrored-action-button', true);
      if (panel.itemPhaseDoneButton) {
        panel.itemPhaseDoneButton.hidden = false;
        panel.itemPhaseDoneButton.style.visibility = 'visible';
      }
    }
  });
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function clearError() {
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
}

function generateUnlockSaveKey() {
  return `RV-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function normalizeUnlockTokens(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((entry) => String(entry || '').trim()).filter(Boolean))].slice(0, 64);
}


function normalizeRoomImportedCards(value) {
  return Array.isArray(value)
    ? value.filter((card) => card && typeof card === 'object' && String(card.card_id || '').trim())
        .map((card) => ({ ...card, card_id: String(card.card_id).trim() }))
    : [];
}

function applyRoomImportedCardsToCardMap() {
  if (!(cardMap instanceof Map)) cardMap = new Map();
  roomImportedCardMap.forEach((card, id) => {
    if (card && id) cardMap.set(id, card);
  });
}

function importRoomDeckCards(cards) {
  const normalized = normalizeRoomImportedCards(cards);
  let changed = false;
  normalized.forEach((card) => {
    const id = String(card.card_id || '').trim();
    if (!id) return;
    const prev = roomImportedCardMap.get(id);
    const nextSerialized = JSON.stringify(card);
    const prevSerialized = prev ? JSON.stringify(prev) : '';
    if (prevSerialized !== nextSerialized) {
      roomImportedCardMap.set(id, card);
      changed = true;
    }
  });
  applyRoomImportedCardsToCardMap();
  return changed;
}

function loadUnlockSaveKey() {
  const raw = String(localStorage.getItem(UNLOCK_SAVE_KEY_STORAGE_KEY) || '').trim();
  if (/^[A-Za-z0-9_-]{4,40}$/.test(raw)) return raw;
  const generated = generateUnlockSaveKey();
  localStorage.setItem(UNLOCK_SAVE_KEY_STORAGE_KEY, generated);
  return generated;
}

function saveUnlockSaveKey() {
  localStorage.setItem(UNLOCK_SAVE_KEY_STORAGE_KEY, unlockSaveKey);
}

function loadUnlockTokens() {
  try {
    const raw = localStorage.getItem(UNLOCK_TOKENS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return normalizeUnlockTokens(parsed);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveUnlockTokens() {
  localStorage.setItem(UNLOCK_TOKENS_STORAGE_KEY, JSON.stringify(unlockTokens));
}

function getUnlockAuthPayload() {
  return {
    saveKey: unlockSaveKey,
    unlockTokens: [...unlockTokens],
  };
}

function getUnlockedSpecialCards() {
  return allCards.filter((card) => card && card.unlock_only);
}

function ensureUnlockedCardsOwned() {
  let changed = false;
  getUnlockedSpecialCards().forEach((card) => {
    if (!ownedCardIds.has(card.card_id)) {
      ownedCardIds.add(card.card_id);
      changed = true;
    }
  });
  if (changed) saveOwnedCards();
}

function setUnlockStatus(message, kind = 'info') {
  unlockStatusState = { message, kind };
  if (!unlockStatusBox) return;
  unlockStatusBox.textContent = message;
  unlockStatusBox.className = `unlock-status-box ${kind}`;
}

async function copyTextSafely(value, okMessage) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      setUnlockStatus(okMessage, 'success');
      return;
    }
  } catch (error) {
    console.error(error);
  }
  window.prompt('コピーしてください', value);
}

function renderUnlockPanel() {
  if (!unlockPanelRoot) return;
  if (unlockSaveKeyInput) unlockSaveKeyInput.value = unlockSaveKey;
  const unlockedCards = getUnlockedSpecialCards();
  if (unlockOwnedList) {
    if (!unlockedCards.length) {
      unlockOwnedList.innerHTML = '<div class="unlock-owned-empty">まだ特別カードは解放されていません。</div>';
    } else {
      unlockOwnedList.innerHTML = '';
      unlockedCards.forEach((card) => {
        const chip = document.createElement('div');
        chip.className = 'unlock-owned-chip';
        chip.innerHTML = `<strong>${card.card_name}</strong><span>${card.card_id}</span>`;
        unlockOwnedList.appendChild(chip);
      });
    }
  }
  setUnlockStatus(unlockStatusState.message, unlockStatusState.kind);
}

function ensureUnlockPanel() {
  if (unlockPanelRoot) return;
  const roomSection = document.querySelector('.room-section');
  if (!roomSection) return;
  const anchor = roomSection.querySelector('.room-status-grid') || roomSection.querySelector('.room-grid');
  unlockPanelRoot = document.createElement('section');
  unlockPanelRoot.className = 'room-status-box card-subpanel unlock-card-panel';
  unlockPanelRoot.innerHTML = `
    <div class="unlock-panel-head">
      <div>
        <h3>特別カード解放</h3>
        <p class="panel-note">解放コードを知っている人だけ、ネタバレなしでカードを追加できます。</p>
      </div>
      <div class="unlock-panel-badge">SECRET</div>
    </div>
    <div class="unlock-savekey-row">
      <label>保存キー</label>
      <input id="unlockSaveKeyInput" type="text" readonly />
      <button id="unlockCopyButton" class="button secondary" type="button">コピー</button>
      <button id="unlockResetButton" class="button danger" type="button">新しい保存キー</button>
    </div>
    <div class="unlock-code-row">
      <label for="unlockCodeInput">解放コード</label>
      <input id="unlockCodeInput" type="text" placeholder="解放コードを入力" />
      <button id="unlockRedeemButton" class="button primary" type="button">解放する</button>
    </div>
    <div id="unlockStatusBox" class="unlock-status-box info"></div>
    <div class="unlock-owned-block">
      <div class="unlock-owned-title">解放済みの特別カード</div>
      <div id="unlockOwnedList" class="unlock-owned-list"></div>
    </div>
  `;
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(unlockPanelRoot, anchor.nextSibling);
  else roomSection.appendChild(unlockPanelRoot);

  unlockSaveKeyInput = unlockPanelRoot.querySelector('#unlockSaveKeyInput');
  unlockCodeInput = unlockPanelRoot.querySelector('#unlockCodeInput');
  unlockRedeemButton = unlockPanelRoot.querySelector('#unlockRedeemButton');
  unlockCopyButton = unlockPanelRoot.querySelector('#unlockCopyButton');
  unlockResetButton = unlockPanelRoot.querySelector('#unlockResetButton');
  unlockStatusBox = unlockPanelRoot.querySelector('#unlockStatusBox');
  unlockOwnedList = unlockPanelRoot.querySelector('#unlockOwnedList');

  unlockCopyButton?.addEventListener('click', () => {
    copyTextSafely(unlockSaveKey, '保存キーをコピーしました。');
  });

  unlockResetButton?.addEventListener('click', async () => {
    const confirmed = window.confirm('保存キーを新しくすると、今の解放証明は使えなくなります。続けますか？');
    if (!confirmed) return;
    unlockSaveKey = generateUnlockSaveKey();
    unlockTokens = [];
    saveUnlockSaveKey();
    saveUnlockTokens();
    setUnlockStatus('保存キーを新しくしました。必要なコードをもう一度入力してください。', 'warning');
    await loadCards();
  });

  async function redeemUnlockCode() {
    const code = String(unlockCodeInput?.value || '').trim();
    if (!code) {
      setUnlockStatus('先に解放コードを入力してください。', 'warning');
      return;
    }
    if (unlockRedeemButton) unlockRedeemButton.disabled = true;
    setUnlockStatus('解放コードを確認しています…', 'info');
    try {
      const response = await fetch(UNLOCK_API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveKey: unlockSaveKey, code }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || '解放コードを確認できませんでした。');
      }
      const token = String(payload.token || '').trim();
      if (token && !unlockTokens.includes(token)) {
        unlockTokens.push(token);
        unlockTokens = normalizeUnlockTokens(unlockTokens);
        saveUnlockTokens();
      }
      const unlockedCards = Array.isArray(payload.unlockedCards) ? payload.unlockedCards : [];
      unlockedCards.forEach((card) => {
        if (card?.card_id) ownedCardIds.add(card.card_id);
      });
      saveOwnedCards();
      if (unlockCodeInput) unlockCodeInput.value = '';
      await loadCards();
      const names = unlockedCards.map((card) => card.card_name).filter(Boolean).join(' / ');
      setUnlockStatus(names ? `解放成功: ${names}` : '特別カードを解放しました。', 'success');
      renderUnlockPanel();
    } catch (error) {
      console.error(error);
      setUnlockStatus(error.message || '解放に失敗しました。', 'error');
    } finally {
      if (unlockRedeemButton) unlockRedeemButton.disabled = false;
    }
  }

  unlockRedeemButton?.addEventListener('click', redeemUnlockCode);
  unlockCodeInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      redeemUnlockCode();
    }
  });

  renderUnlockPanel();
}

function loadOwnedCards() {
  try {
    const raw = localStorage.getItem(OWNED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch (error) {
    console.error(error);
    return new Set();
  }
}

function saveOwnedCards() {
  localStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify([...ownedCardIds]));
}

function toCardIdArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') return entry;
        if (entry && typeof entry === 'object') return entry.cardId || entry.card_id || entry.id || '';
        return '';
      })
      .filter(Boolean);
  }
  if (typeof value === 'string') return value ? [value] : [];
  if (value && typeof value === 'object') {
    const maybe = value.cardId || value.card_id || value.id || '';
    return maybe ? [maybe] : [];
  }
  return [];
}

function normalizeDeckRecord(deck, index) {
  if (!deck || typeof deck !== 'object') return null;

  const name = String(deck.name || deck.deckName || `デッキ${index + 1}`).trim();
  const battle = toCardIdArray(deck.battle || deck.battles || deck.battleCards);
  const item = toCardIdArray(deck.item || deck.items || deck.itemCards);
  const field = toCardIdArray(deck.field || deck.fields || deck.environment || deck.environmentCards);

  const unique = (arr) => [...new Set(arr)].filter((id) => cardMap.has(id));

  return {
    name,
    battle: unique(battle),
    item: unique(item),
    field: unique(field).slice(0, 1),
  };
}

function loadSavedDecks() {
  try {
    const raw = localStorage.getItem(DECKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .map((deck, index) => normalizeDeckRecord(deck, index))
      .filter(Boolean)
      .filter((deck) => deck.name);

    const hasChanges = JSON.stringify(parsed) !== JSON.stringify(normalized);
    if (hasChanges) {
      localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveSavedDecks() {
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(savedDecks));
}

function updateOwnedCountLabel() {
  ownedCountLabel.textContent = `所持${ownedCardIds.size}枚`;
}

function getDeckArrayByType(type) {
  return currentDeck[type];
}

function isInCurrentDeck(cardId) {
  return currentDeck.battle.includes(cardId) || currentDeck.item.includes(cardId) || currentDeck.field.includes(cardId);
}

function validateDeckShape(deck) {
  if (!deck || !Array.isArray(deck.battle) || !Array.isArray(deck.item) || !Array.isArray(deck.field)) return false;
  return deck.battle.length === DECK_LIMITS.battle &&
    deck.item.length === DECK_LIMITS.item &&
    deck.field.length === DECK_LIMITS.field;
}

function currentDeckComplete() {
  return validateDeckShape(currentDeck);
}

function updateDeckCounts() {
  const battleCount = currentDeck.battle.length;
  const itemCount = currentDeck.item.length;
  const fieldCount = currentDeck.field.length;

  battleCountBadge.textContent = `バトル ${battleCount} / ${DECK_LIMITS.battle}`;
  itemCountBadge.textContent = `アイテム ${itemCount} / ${DECK_LIMITS.item}`;
  fieldCountBadge.textContent = `環境 ${fieldCount} / ${DECK_LIMITS.field}`;
  battleCountText.textContent = `${battleCount} / ${DECK_LIMITS.battle}`;
  itemCountText.textContent = `${itemCount} / ${DECK_LIMITS.item}`;
  fieldCountText.textContent = `${fieldCount} / ${DECK_LIMITS.field}`;
}

function renderDeckList(type, targetElement) {
  const ids = getDeckArrayByType(type);
  targetElement.innerHTML = '';

  if (!ids.length) {
    targetElement.classList.add('empty');
    return;
  }

  targetElement.classList.remove('empty');
  for (const cardId of ids) {
    const card = cardMap.get(cardId);
    if (!card) continue;
    const node = deckItemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.deck-item-title').textContent = `${card.card_name} (${card.card_id})`;
    node.querySelector('.deck-item-meta').textContent = `${typeLabel(card.type)} / ${card.rarity || '-'} / ${card.effect_type || 'none'}`;
    node.querySelector('.remove-deck-item').addEventListener('click', () => removeFromCurrentDeck(cardId));
    targetElement.appendChild(node);
  }
}

function renderSavedDeckOptions() {
  const previousValue = savedDeckSelect.value;
  const p1PreviousValue = player1DeckSelect.value;
  const p2PreviousValue = player2DeckSelect.value;
  const optionHtml = '<option value="">保存済みデッキを選択</option>';

  savedDeckSelect.innerHTML = optionHtml;
  player1DeckSelect.innerHTML = optionHtml;
  player2DeckSelect.innerHTML = optionHtml;

  for (const deck of savedDecks) {
    if (!deck || !deck.name) continue;
    const option1 = document.createElement('option');
    option1.value = deck.name;
    option1.textContent = deck.name;
    savedDeckSelect.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = deck.name;
    option2.textContent = deck.name;
    player1DeckSelect.appendChild(option2);

    const option3 = document.createElement('option');
    option3.value = deck.name;
    option3.textContent = deck.name;
    player2DeckSelect.appendChild(option3);
  }

  if (savedDecks.some((deck) => deck.name === previousValue)) savedDeckSelect.value = previousValue;
  if (savedDecks.some((deck) => deck.name === p1PreviousValue)) player1DeckSelect.value = p1PreviousValue;
  if (savedDecks.some((deck) => deck.name === p2PreviousValue)) player2DeckSelect.value = p2PreviousValue;
}

function renderDeckPanel() {
  deckNameInput.value = currentDeck.name || '';
  updateDeckCounts();
  renderDeckList('battle', battleDeckList);
  renderDeckList('item', itemDeckList);
  renderDeckList('field', fieldDeckList);
  saveDeckButton.disabled = !currentDeckComplete();
}

function toggleOwned(cardId) {
  if (ownedCardIds.has(cardId)) {
    const inDeck = isInCurrentDeck(cardId);
    if (inDeck) {
      const confirmed = window.confirm('このカードは現在のデッキに入っています。所持解除するとデッキからも外れます。続けますか？');
      if (!confirmed) return;
      removeFromCurrentDeck(cardId, false);
    }
    ownedCardIds.delete(cardId);
  } else {
    ownedCardIds.add(cardId);
  }

  saveOwnedCards();
  updateOwnedCountLabel();
  renderCards();
  renderDeckPanel();
}

function addToCurrentDeck(cardId) {
  const card = cardMap.get(cardId);
  if (!card) return;

  if (!ownedCardIds.has(cardId)) {
    window.alert('このカードは所持にしてから追加してください。');
    return;
  }
  if (isInCurrentDeck(cardId)) {
    window.alert('同じカードは1枚までです。');
    return;
  }

  const targetDeck = getDeckArrayByType(card.type);
  const limit = DECK_LIMITS[card.type];
  if (targetDeck.length >= limit) {
    window.alert(`${typeLabel(card.type)}は ${limit} 枚までです。`);
    return;
  }

  targetDeck.push(cardId);
  renderDeckPanel();
  renderCards();
}

function removeFromCurrentDeck(cardId, rerender = true) {
  currentDeck.battle = currentDeck.battle.filter((id) => id !== cardId);
  currentDeck.item = currentDeck.item.filter((id) => id !== cardId);
  currentDeck.field = currentDeck.field.filter((id) => id !== cardId);

  if (rerender) {
    renderDeckPanel();
    renderCards();
  }
}

function resetCurrentDeck() {
  currentDeck = { name: '', battle: [], item: [], field: [] };
  renderDeckPanel();
  renderCards();
}

function createCardElement(card) {
  const node = cardTemplate.content.firstElementChild.cloneNode(true);
  const isOwned = ownedCardIds.has(card.card_id);
  const inDeck = isInCurrentDeck(card.card_id);

  if (isOwned) node.classList.add('owned');
  if (inDeck) node.classList.add('in-deck');

  const image = node.querySelector('.card-image');
  image.src = IMAGE_BASE_PATH + card.image_file;
  image.alt = `${card.card_name} の画像`;
  image.onerror = () => {
    image.alt = `${card.card_name} の画像が見つかりません`;
  };

  node.querySelector('.card-id').textContent = card.card_id;
  node.querySelector('.card-rarity').textContent = card.rarity || '-';
  node.querySelector('.card-name').textContent = card.card_name || '名前未設定';
  node.querySelector('.card-type').textContent = typeLabel(card.type);
  node.querySelector('.card-stats').textContent = statsLabel(card);
  node.querySelector('.card-effect').textContent = card.effect_text || '効果なし';
  node.querySelector('.card-effect-type').textContent = `effect_type: ${card.effect_type || 'none'}`;

  const ownedButton = node.querySelector('.owned-button');
  if (card.unlock_only) {
    ownedButton.textContent = '解放済みカード';
    ownedButton.disabled = true;
    ownedButton.classList.add('is-owned', 'unlock-owned-button');
    node.classList.add('unlock-card-visible');
  } else {
    ownedButton.textContent = isOwned ? '所持済み（クリックで解除）' : '所持にする';
    if (isOwned) ownedButton.classList.add('is-owned');
    ownedButton.addEventListener('click', () => toggleOwned(card.card_id));
  }

  const deckButton = node.querySelector('.deck-button');
  if (!isOwned) {
    deckButton.textContent = '所持カードのみ追加可能';
    deckButton.disabled = true;
  } else if (inDeck) {
    deckButton.textContent = 'デッキから外す';
    deckButton.classList.add('in-deck');
    deckButton.addEventListener('click', () => removeFromCurrentDeck(card.card_id));
  } else {
    deckButton.textContent = 'デッキに追加';
    deckButton.addEventListener('click', () => addToCurrentDeck(card.card_id));
  }

  return node;
}

function filteredCards() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedRarity = rarityFilter.value;
  const ownedOnly = ownedOnlyCheckbox.checked;

  return allCards.filter((card) => {
    const matchesKeyword = !keyword ||
      String(card.card_name || '').toLowerCase().includes(keyword) ||
      String(card.card_id || '').toLowerCase().includes(keyword) ||
      String(card.effect_text || '').toLowerCase().includes(keyword);

    const matchesType = selectedType === 'all' || card.type === selectedType;
    const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
    const matchesOwned = !ownedOnly || ownedCardIds.has(card.card_id);
    return matchesKeyword && matchesType && matchesRarity && matchesOwned;
  });
}

function renderCards() {
  const cards = filteredCards();
  cardsGrid.innerHTML = '';
  for (const card of cards) {
    cardsGrid.appendChild(createCardElement(card));
  }
  countLabel.textContent = `${cards.length}枚表示`;
  updateOwnedCountLabel();
}

function collectCurrentDeckForSave() {
  return {
    name: deckNameInput.value.trim(),
    battle: [...currentDeck.battle],
    item: [...currentDeck.item],
    field: [...currentDeck.field],
  };
}

function saveCurrentDeck() {
  const deck = collectCurrentDeckForSave();
  if (!deck.name) {
    window.alert('デッキ名を入力してください。');
    return;
  }
  if (!validateDeckShape(deck)) {
    window.alert('バトル5枚 / アイテム4枚 / 環境1枚 ちょうどで保存してください。');
    return;
  }

  const duplicate = savedDecks.findIndex((item) => item.name === deck.name);
  if (duplicate >= 0) {
    const confirmed = window.confirm('同じ名前のデッキがあります。上書きしますか？');
    if (!confirmed) return;
    savedDecks[duplicate] = deck;
  } else {
    savedDecks.push(deck);
  }

  currentDeck.name = deck.name;
  saveSavedDecks();
  renderSavedDeckOptions();
  savedDeckSelect.value = deck.name;
  renderDeckPanel();
  window.alert('デッキを保存しました。');
}

function loadSelectedDeck() {
  const selectedName = savedDeckSelect.value;
  if (!selectedName) {
    window.alert('読み込むデッキを選んでください。');
    return;
  }

  const deck = savedDecks.find((item) => item.name === selectedName);
  if (!deck) {
    window.alert('デッキが見つかりません。');
    return;
  }

  const allIds = [...(deck.battle || []), ...(deck.item || []), ...(deck.field || [])];
  const missing = allIds.filter((id) => !ownedCardIds.has(id));
  if (missing.length) {
    window.alert(`このデッキには未所持カードが含まれています: ${missing.join(', ')}`);
    return;
  }

  currentDeck = {
    name: deck.name,
    battle: [...deck.battle],
    item: [...deck.item],
    field: [...deck.field],
  };

  renderDeckPanel();
  renderCards();
}

function deleteSelectedDeck() {
  const selectedName = savedDeckSelect.value;
  if (!selectedName) {
    window.alert('削除するデッキを選んでください。');
    return;
  }

  const confirmed = window.confirm(`「${selectedName}」を削除します。よろしいですか？`);
  if (!confirmed) return;

  savedDecks = savedDecks.filter((deck) => deck.name !== selectedName);
  saveSavedDecks();
  renderSavedDeckOptions();
  if (currentDeck.name === selectedName) resetCurrentDeck();
}

function getSavedDeckByName(name) {
  return savedDecks.find((deck) => deck.name === name) || null;
}

function addLog(message) {
  matchState.log.unshift(message);
  renderBattleLog();
}

function renderBattleLog() {
  battleLog.innerHTML = '';
  if (!matchState.log.length) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = 'まだログはありません';
    battleLog.appendChild(entry);
    return;
  }

  for (const message of matchState.log) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    battleLog.appendChild(entry);
  }
}

function indexToCoord(index) {
  return { row: Math.floor(index / 5), col: index % 5 };
}

function coordToIndex(row, col) {
  return row * 5 + col;
}

function formatCellLabel(index) {
  const { row, col } = indexToCoord(index);
  return `${row + 1}-${col + 1}`;
}

function isPointZone(index) {
  const { row, col } = indexToCoord(index);
  return row >= 1 && row <= 3 && col >= 1 && col <= 3;
}

function getCurrentSetupStep() {
  return SETUP_SEQUENCE[matchState.setupStepIndex] || null;
}

function createUnitInstance(cardId, owner, forcedInstanceId = '') {
  const card = cardMap.get(cardId);
  instanceCounter += 1;
  const instanceId = forcedInstanceId || `unit-${instanceCounter}`;
  return {
    instanceId,
    cardId,
    owner,
    name: card.card_name,
    atk: Number(card.atk) || 0,
    move: Number(card.move) || 1,
    currentHp: Number(card.hp) || 1,
    maxHp: Number(card.hp) || 1,
    tempAtkBuff: 0,
    tempMoveBuff: 0,
    skipAttackTurns: 0,
    skipActionTurns: 0,
    actionLocked: false,
    attackLocked: false,
    singleUseDamageReduction: 0,
    guardBlockUsed: false,
    negateDamageUsed: false,
    surviveOnceUsed: false,
    healedInRound: 0,
    untargetableByEnemyItemsUntilTurnStartOf: '',
    negateBuffsAndHealUntilTurnStartOf: '',
    noHealNoReviveUntilTurnStartOf: '',
    centerSilenceDisableAttackUntilTurnStartOf: '',
    fullSilenceUntilTurnStartOf: '',
    negateNextDestroyStunDisableAttackUntilTurnStartOf: '',
    itemFieldNegateControlUsed: false,
    nextAttackAppliesNoHealNoRevive: false,
  };
}

function getPlayerState(playerKey) {
  return matchState.players[playerKey];
}

function getOpponent(playerKey) {
  return playerKey === 'player1' ? 'player2' : 'player1';
}

function hasAdjacentCenterAuraItemUntargetable(unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  return getOrthogonalNeighbors(boardIndex).some((idx) => {
    const ally = matchState.board[idx];
    return ally
      && ally.owner === unit.owner
      && ally.instanceId !== unit.instanceId
      && isPointZone(idx)
      && unitHasEffectType(ally, 'center_aura_adjacent_allies_untargetable_by_enemy_items');
  });
}

function hasAdjacentCenterAuraNoItemDestroy(unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  return getOrthogonalNeighbors(boardIndex).some((idx) => {
    const ally = matchState.board[idx];
    return ally
      && ally.owner === unit.owner
      && ally.instanceId !== unit.instanceId
      && isPointZone(idx)
      && unitHasEffectType(ally, 'negate_destroy_stun_disable_once_from_enemy_item_or_field_and_center_aura_adjacent_allies_no_item_destroy');
  });
}

function hasAdjacentHolyLanceAura(unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  return getOrthogonalNeighbors(boardIndex).some((idx) => {
    const ally = matchState.board[idx];
    return ally
      && ally.owner === unit.owner
      && ally.instanceId !== unit.instanceId
      && unitHasEffectType(ally, 'aura_item_damage_minus_1_and_no_stun');
  });
}

function isEnemyCenterFieldBuffHealNegated(unit, boardIndex = null) {
  if (!unit || boardIndex == null || !isPointZone(boardIndex)) return false;
  return matchState.board.some((otherUnit, idx) => {
    if (!otherUnit || otherUnit.owner === unit.owner || !isPointZone(idx)) return false;
    return unitHasEffectType(otherUnit, 'ignore_enemy_field_effects_self_and_center_aura_negate_enemy_field_buffs_heal_and_ignore_reduction_vs_center', idx);
  });
}

function isUnitUntargetableByEnemyItems(unit, boardIndex = null) {
  if (!unit) return false;
  if (unit.untargetableByEnemyItemsUntilTurnStartOf) return true;
  const resolvedIndex = boardIndex == null ? getBoardIndexForUnit(unit) : boardIndex;
  return resolvedIndex >= 0 && hasAdjacentCenterAuraItemUntargetable(unit, resolvedIndex);
}

function isUnitFullySilenced(unit) {
  return !!(unit && unit.fullSilenceUntilTurnStartOf);
}

function isUnitBuffsAndHealNegated(unit) {
  return !!(unit && (unit.negateBuffsAndHealUntilTurnStartOf || unit.fullSilenceUntilTurnStartOf));
}

function unitIgnoresEnemyFieldEffects(unit) {
  if (!unit || isUnitCenterSilenced(unit) || isUnitFullySilenced(unit)) return false;
  const effectType = getUnitMeta(unit)?.effect_type || '';
  return effectType === 'ignore_enemy_field_effects_and_center_guard_1'
    || effectType.startsWith('ignore_enemy_field_effects_self');
}

function isUnitProtectedFromEnemyItemDestroy(unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  if (isPointZone(boardIndex) && playerHasFieldEffect(unit.owner, 'field_center_allies_cannot_be_destroyed_by_enemy_items')) {
    return true;
  }
  if (hasAdjacentCenterAuraNoItemDestroy(unit, boardIndex)) {
    return true;
  }
  return false;
}

function isUnitProtectedFromEnemyItemStun(unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  return hasAdjacentHolyLanceAura(unit, boardIndex);
}

function tryConsumeDestroyStunDisableProtection(unit, boardIndex, triggerKind, sourceType, sourceLabel = '') {
  if (!unit) return false;
  const triggerNameMap = {
    destroy: '破壊',
    stun: '行動不能',
    disable_attack: '攻撃不能',
  };
  const triggerName = triggerNameMap[triggerKind] || '効果';
  if (unit.negateNextDestroyStunDisableAttackUntilTurnStartOf) {
    unit.negateNextDestroyStunDisableAttackUntilTurnStartOf = '';
    addLog(`${sourceLabel}${unit.name} は ${triggerName} を無効化しました`);
    return true;
  }
  if ((sourceType === 'enemy_item' || sourceType === 'enemy_field')
    && unitHasEffectType(unit, 'negate_destroy_stun_disable_once_from_enemy_item_or_field_and_center_aura_adjacent_allies_no_item_destroy', boardIndex)
    && unit.itemFieldNegateControlUsed !== true) {
    unit.itemFieldNegateControlUsed = true;
    addLog(`${sourceLabel}${unit.name} は試合中1回の耐性で ${triggerName} を無効化しました`);
    return true;
  }
  return false;
}

function getCurrentUnitForFieldRestrictionCheck() {
  const selected = getSelectedUnit();
  if (selected && selected.owner === matchState.currentPlayer) return selected;
  const movedUnitId = matchState.turnState?.movedUnitId || null;
  if (!movedUnitId) return null;
  const movedIndex = findUnitIndexById(movedUnitId);
  if (movedIndex < 0) return null;
  const movedUnit = matchState.board[movedIndex];
  return movedUnit && movedUnit.owner === matchState.currentPlayer ? movedUnit : null;
}

function markUnitHealedThisRound(unit) {
  if (!unit) return;
  unit.healedInRound = Number(matchState.round || 0);
}

function healUnitForEffect(unit, amount) {
  if (!unit || amount <= 0) return { healed: 0, blocked: false };
  const boardIndex = getBoardIndexForUnit(unit);
  if (isUnitBuffsAndHealNegated(unit) || unitHasNoHealNoRevive(unit) || isEnemyCenterFieldBuffHealNegated(unit, boardIndex)) return { healed: 0, blocked: true };
  const before = Number(unit.currentHp || 0);
  unit.currentHp = Math.min(Number(unit.maxHp || 0), before + Number(amount || 0));
  const healed = Math.max(0, unit.currentHp - before);
  if (healed > 0) markUnitHealedThisRound(unit);
  return { healed, blocked: false };
}

function getCleansableStatusKinds(unit) {
  if (!unit) return [];
  const kinds = [];
  if (unit.actionLocked || Number(unit.skipActionTurns || 0) > 0) kinds.push('action');
  if (unit.attackLocked || Number(unit.skipAttackTurns || 0) > 0) kinds.push('attack');
  if (Number(unit.tempMoveBuff || 0) < 0) kinds.push('move');
  return kinds;
}

function clearCleansableStatus(unit, kind) {
  if (!unit || !kind) return false;
  if (kind === 'action') {
    const had = !!unit.actionLocked || Number(unit.skipActionTurns || 0) > 0;
    unit.actionLocked = false;
    unit.skipActionTurns = 0;
    return had;
  }
  if (kind === 'attack') {
    const had = !!unit.attackLocked || Number(unit.skipAttackTurns || 0) > 0;
    unit.attackLocked = false;
    unit.skipAttackTurns = 0;
    return had;
  }
  if (kind === 'move') {
    const had = Number(unit.tempMoveBuff || 0) < 0;
    if (had) unit.tempMoveBuff = 0;
    return had;
  }
  return false;
}

function clearOneCleansableStatus(unit) {
  for (const kind of ['action', 'attack', 'move']) {
    if (clearCleansableStatus(unit, kind)) return kind;
  }
  return '';
}

function clearAllCleansableStatuses(unit) {
  const cleared = [];
  ['action', 'attack', 'move'].forEach((kind) => {
    if (clearCleansableStatus(unit, kind)) cleared.push(kind);
  });
  return cleared;
}

function getCleanseStatusLabel(kind) {
  if (kind === 'action') return '行動不能';
  if (kind === 'attack') return '攻撃不能';
  if (kind === 'move') return '移動力-1';
  return '状態異常';
}

function chooseFieldStartCenterAlly(playerKey) {
  let best = null;
  for (let index = 0; index < matchState.board.length; index += 1) {
    const unit = matchState.board[index];
    if (!unit || unit.owner !== playerKey || !isPointZone(index)) continue;
    const cleanseCount = getCleansableStatusKinds(unit).length;
    const missingHp = Math.max(0, Number(unit.maxHp || 0) - Number(unit.currentHp || 0));
    const score = cleanseCount * 100 + missingHp * 10 + (24 - index);
    if (!best || score > best.score) best = { index, unit, score };
  }
  return best;
}

function chooseAdjacentAllyForSwapCleanse(unitIndex, ownerKey, excludeUnitId = '') {
  let best = null;
  getOrthogonalNeighbors(unitIndex).forEach((idx) => {
    const ally = matchState.board[idx];
    if (!ally || ally.owner !== ownerKey || ally.instanceId === excludeUnitId) return;
    const statusKinds = getCleansableStatusKinds(ally);
    if (!statusKinds.length) return;
    const priority = statusKinds.includes('action') ? 3 : statusKinds.includes('attack') ? 2 : 1;
    const score = priority * 100 + statusKinds.length * 10 + (24 - idx);
    if (!best || score > best.score) best = { index: idx, unit: ally, score };
  });
  return best;
}

function applyFieldStartOfTurnEffects(playerKey) {
  if (!playerHasFieldEffect(playerKey, 'field_start_round_heal_1_and_cleanse_center_ally')) return;
  const target = chooseFieldStartCenterAlly(playerKey);
  if (!target?.unit) return;
  const healResult = healUnitForEffect(target.unit, 1);
  const clearedKinds = clearAllCleansableStatuses(target.unit);
  const parts = [];
  if (healResult.healed > 0) parts.push(`HPを ${healResult.healed} 回復`);
  if (healResult.blocked) parts.push('HP回復は無効');
  if (clearedKinds.length) parts.push(`${clearedKinds.map(getCleanseStatusLabel).join(' / ')} を解除`);
  addLog(`${PLAYER_LABEL[playerKey]}: 降神の祭壇により ${target.unit.name}${parts.length ? ` は ${parts.join('、')} しました` : ' を選びました'}`);
}

function clearExpiredUnitStatusEffectsForPlayer(playerKey) {
  matchState.board.forEach((unit) => {
    if (!unit) return;
    if (unit.untargetableByEnemyItemsUntilTurnStartOf === playerKey) {
      unit.untargetableByEnemyItemsUntilTurnStartOf = '';
    }
    if (unit.negateBuffsAndHealUntilTurnStartOf === playerKey) {
      unit.negateBuffsAndHealUntilTurnStartOf = '';
    }
    if (unit.noHealNoReviveUntilTurnStartOf === playerKey) {
      unit.noHealNoReviveUntilTurnStartOf = '';
    }
    if (unit.centerSilenceDisableAttackUntilTurnStartOf === playerKey) {
      unit.centerSilenceDisableAttackUntilTurnStartOf = '';
    }
    if (unit.fullSilenceUntilTurnStartOf === playerKey) {
      unit.fullSilenceUntilTurnStartOf = '';
    }
    if (unit.negateNextDestroyStunDisableAttackUntilTurnStartOf === playerKey) {
      unit.negateNextDestroyStunDisableAttackUntilTurnStartOf = '';
    }
  });
}


function findUnitIndexById(instanceId) {
  return matchState.board.findIndex((unit) => unit && unit.instanceId === instanceId);
}

function findUnitIndexByIdOwned(instanceId, owner = '') {
  if (!instanceId) return -1;
  const ownedIndex = matchState.board.findIndex((unit) => unit && unit.instanceId === instanceId && (!owner || unit.owner === owner));
  if (ownedIndex >= 0) return ownedIndex;
  return findUnitIndexById(instanceId);
}

function getUnitMeta(unit) {
  if (!unit) return null;
  return cardMap.get(unit.cardId) || null;
}

function getBoardIndexForUnit(unit) {
  if (!unit?.instanceId) return -1;
  return findUnitIndexById(unit.instanceId);
}

function isUnitCenterSilenced(unit, boardIndex = null) {
  if (!unit?.centerSilenceDisableAttackUntilTurnStartOf) return false;
  const resolvedIndex = boardIndex == null ? getBoardIndexForUnit(unit) : boardIndex;
  return resolvedIndex >= 0 && isPointZone(resolvedIndex);
}

function unitHasNoHealNoRevive(unit) {
  return !!(unit && unit.noHealNoReviveUntilTurnStartOf);
}

function isUnitCardEffectActive(unit, boardIndex = null) {
  return !!unit && !isUnitCenterSilenced(unit, boardIndex) && !isUnitFullySilenced(unit);
}

function unitHasEffectType(unit, effectType) {
  if (!unit) return false;
  if (isUnitCenterSilenced(unit)) return false;
  if (isUnitFullySilenced(unit)) return false;
  return getUnitMeta(unit)?.effect_type === effectType;
}

function unitHasShadowReturnEffect(unit) {
  if (!unit) return false;
  if (isUnitCenterSilenced(unit)) return false;
  if (isUnitFullySilenced(unit)) return false;
  const effectType = getUnitMeta(unit)?.effect_type;
  return effectType === 'return_to_home_row_after_attack' || effectType === 'return_and_redeploy_full_heal';
}

function getShadowReturnCellIndexForSource(playerKey, sourceIndex) {
  if (!playerKey || sourceIndex == null || sourceIndex < 0) return -1;
  const { row } = indexToCoord(sourceIndex);
  return coordToIndex(row, HOME_COLUMN[playerKey]);
}

function canNegateDamageOnce(unit) {
  return !!(unitHasEffectType(unit, 'negate_damage_once') && unit.negateDamageUsed !== true);
}

function cannotMoveByEffect(unit) {
  return !!unitHasEffectType(unit, 'cannot_move');
}

function getMoveNeighborOffsets(unit) {
  if (unitHasEffectType(unit, 'diagonal_move')) {
    return [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ];
  }
  return [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];
}

function getLivingUnits(playerKey) {
  return matchState.board.filter((unit) => unit && unit.owner === playerKey);
}

function getPendingRevivesForPlayer(playerKey) {
  return (matchState.pendingRevives || []).filter((entry) => entry.owner === playerKey);
}

function getPendingRedeploysForPlayer(playerKey) {
  return (matchState.pendingRedeploys || []).filter((entry) => entry.owner === playerKey);
}

function getPendingRedeployCardId() {
  return matchState.turnState?.pendingRedeployCardId || '';
}

function getPendingRedeployOwner() {
  return matchState.turnState?.pendingRedeployOwner || '';
}

function clearPendingRedeployPrompt(options = {}) {
  if (!matchState.turnState) return;
  matchState.turnState.pendingRedeployCardId = null;
  matchState.turnState.pendingRedeployOwner = null;
  if (matchState.phase === 'battle' && options.keepItemWindowClosed !== true) {
    matchState.turnState.itemWindowOpen = true;
  }
}

function getPendingRedeployCard() {
  const cardId = getPendingRedeployCardId();
  const owner = getPendingRedeployOwner();
  if (!cardId || !owner) return null;
  const exists = (matchState.pendingRedeploys || []).some((entry) => entry.owner === owner && entry.cardId === cardId);
  if (!exists) {
    clearPendingRedeployPrompt();
    return null;
  }
  if (owner !== matchState.currentPlayer) {
    clearPendingRedeployPrompt();
    return null;
  }
  const openCells = getHomeRespawnCells(owner).filter((idx) => !matchState.board[idx]);
  if (!openCells.length) {
    clearPendingRedeployPrompt();
    return null;
  }
  return cardMap.get(cardId) || null;
}

function getHomeRespawnCells(playerKey) {
  const col = HOME_COLUMN[playerKey];
  return [0, 1, 2, 3, 4].map((row) => coordToIndex(row, col));
}

function queueUnitRevive(unit) {
  if (!unit || !unitHasEffectType(unit, 'revive_next_turn_from_base')) return;
  matchState.pendingRevives = matchState.pendingRevives || [];
  matchState.pendingRevives.push({
    owner: unit.owner,
    cardId: unit.cardId,
    name: unit.name,
  });
  addLog(`${unit.name} は倒されましたが、次の ${PLAYER_LABEL[unit.owner]} の手番開始時に自陣から復活します`);
}

function queueUnitRedeploy(unit) {
  if (!unit || !unitHasEffectType(unit, 'return_and_redeploy_full_heal')) return;
  matchState.pendingRedeploys = matchState.pendingRedeploys || [];
  const exists = matchState.pendingRedeploys.some((entry) => entry.owner === unit.owner && entry.cardId === unit.cardId);
  if (!exists) {
    matchState.pendingRedeploys.push({
      owner: unit.owner,
      cardId: unit.cardId,
      name: unit.name,
    });
  }
  addLog(`${unit.name} は効果で手元に戻りました。次の ${PLAYER_LABEL[unit.owner]} の手番開始時に自陣へ再配置できます`);
}

function clearPendingRedeployForUnit(unit) {
  if (!unit || !matchState.pendingRedeploys) return;
  matchState.pendingRedeploys = matchState.pendingRedeploys.filter((entry) => !(entry.owner === unit.owner && entry.cardId === unit.cardId));
}

function revivePendingUnitsForPlayer(playerKey) {
  const pendingRevives = getPendingRevivesForPlayer(playerKey);
  if (!pendingRevives.length) return;

  const remaining = [];
  (matchState.pendingRevives || []).forEach((entry) => {
    if (entry.owner !== playerKey) remaining.push(entry);
  });

  pendingRevives.forEach((entry) => {
    const spawnIndex = getHomeRespawnCells(playerKey).find((idx) => !matchState.board[idx]);
    if (spawnIndex == null || spawnIndex < 0) {
      remaining.push(entry);
      addLog(`${entry.name} は復活待機中ですが、自陣に空きがないため今回は復活できません`);
      return;
    }
    matchState.board[spawnIndex] = createUnitInstance(entry.cardId, playerKey);
    addLog(`${entry.name} が ${formatCellLabel(spawnIndex)} に復活しました`);
    const revivedUnit = matchState.board[spawnIndex];
    const reviveSignature = getCardSignatureProfile(revivedUnit?.cardId, 'revive');
    if (reviveSignature) {
      holdCombatFxFor(Math.max(900, Number(reviveSignature.holdMs || reviveSignature.duration || 1080)));
      rememberCombatFxTimer(setTimeout(() => {
        scheduleCardSignatureFx(spawnIndex, reviveSignature, 0);
      }, 70));
    }
  });

  matchState.pendingRevives = remaining;
}

function getRedeployableCells(playerKey = matchState.currentPlayer) {
  const pendingCard = getPendingRedeployCard();
  const pendingOwner = getPendingRedeployOwner();
  if (matchState.phase !== 'battle' || !pendingCard || pendingOwner !== playerKey) return [];
  return getHomeRespawnCells(playerKey).filter((idx) => !matchState.board[idx]);
}

function preparePendingRedeployForPlayer(playerKey) {
  if (!matchState.turnState) return;
  matchState.turnState.pendingRedeployCardId = null;
  matchState.turnState.pendingRedeployOwner = null;
  const pending = getPendingRedeploysForPlayer(playerKey);
  if (!pending.length) return;
  const openCells = getHomeRespawnCells(playerKey).filter((idx) => !matchState.board[idx]);
  if (!openCells.length) {
    addLog(`${PLAYER_LABEL[playerKey]} の再配置待機ユニットがありますが、自陣に空きがないため今回は再配置できません`);
    return;
  }
  const entry = pending[0];
  matchState.turnState.pendingRedeployCardId = entry.cardId;
  matchState.turnState.pendingRedeployOwner = entry.owner;
  matchState.turnState.itemWindowOpen = false;
  addLog(`${PLAYER_LABEL[playerKey]} は ${entry.name} を自陣の空きマスへ再配置できます`);
}

function placePendingRedeploy(targetIndex) {
  const cardId = getPendingRedeployCardId();
  const pendingOwner = getPendingRedeployOwner();
  if (!cardId || !pendingOwner) return;
  const playerKey = matchState.currentPlayer;
  if (pendingOwner !== playerKey) {
    matchState.turnState.pendingRedeployCardId = null;
    matchState.turnState.pendingRedeployOwner = null;
    renderMatchArea();
    return;
  }
  const validTargets = getRedeployableCells(playerKey);
  if (!validTargets.includes(targetIndex)) return;

  const pendingIndex = (matchState.pendingRedeploys || []).findIndex((entry) => entry.owner === playerKey && entry.cardId === cardId);
  if (pendingIndex < 0) {
    matchState.turnState.pendingRedeployCardId = null;
    matchState.turnState.pendingRedeployOwner = null;
    renderMatchArea();
    return;
  }
  matchState.pendingRedeploys.splice(pendingIndex, 1);

  const unit = createUnitInstance(cardId, playerKey);
  unit.currentHp = unit.maxHp;
  matchState.board[targetIndex] = unit;
  matchState.turnState.pendingRedeployCardId = null;
  matchState.turnState.pendingRedeployOwner = null;
  addLog(`${PLAYER_LABEL[playerKey]} の ${unit.name} を ${formatCellLabel(targetIndex)} に再配置しました（HP全回復）`);

  if (getPendingRedeploysForPlayer(playerKey).length > 0) {
    preparePendingRedeployForPlayer(playerKey);
  } else {
    matchState.turnState.itemWindowOpen = true;
  }

  renderMatchArea();
}

function getPlayerFieldCard(playerKey) {
  const fieldId = getPlayerState(playerKey)?.fieldId;
  return fieldId ? cardMap.get(fieldId) : null;
}

function getPlayerFieldEffectType(playerKey) {
  return getPlayerFieldCard(playerKey)?.effect_type || '';
}

function playerHasFieldEffect(playerKey, effectType) {
  const opponent = getOpponent(playerKey);
  if (getPlayerState(opponent)?.negateEnemyFieldUntilOwnTurnStart) return false;
  return getPlayerFieldEffectType(playerKey) === effectType;
}

function isGlobalFieldEffectActive(effectType) {
  return playerHasFieldEffect('player1', effectType) || playerHasFieldEffect('player2', effectType);
}

function countActiveFieldEffects(effectType) {
  return ['player1', 'player2'].reduce((count, playerKey) => count + (playerHasFieldEffect(playerKey, effectType) ? 1 : 0), 0);
}

function getItemEffectBoost(playerKey, effectType = '') {
  if (!playerHasFieldEffect(playerKey, 'field_item_effect_plus_1')) return 0;
  if (['destroy_single', 'destroy_single_no_revive', 'disable_attack_next_round', 'stun_single_1_turn', 'full_heal_single', 'heal_single_3_atk_up_turn_1', 'royal_command_single'].includes(effectType)) return 0;
  return 1;
}

function hasAdjacentUnitOwnedBy(centerIndex, ownerKey) {
  const { row, col } = indexToCoord(centerIndex);
  const neighbors = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];
  return neighbors
    .filter(([r, c]) => r >= 0 && r <= 4 && c >= 0 && c <= 4)
    .some(([r, c]) => {
      const unit = matchState.board[coordToIndex(r, c)];
      return !!unit && unit.owner === ownerKey;
    });
}

function currentPlayerCannotAttackAfterMove(unit = null) {
  if (!(matchState.phase === 'battle' && matchState.turnState?.moved)) return false;
  const actingPlayer = matchState.currentPlayer;
  const ownFieldBlocks = playerHasFieldEffect(actingPlayer, 'field_no_attack_after_move');
  const enemyFieldBlocks = playerHasFieldEffect(getOpponent(actingPlayer), 'field_no_attack_after_move')
    && !(unit && unitIgnoresEnemyFieldEffects(unit));
  return !!(ownFieldBlocks || enemyFieldBlocks);
}

function isOffensiveItemCard(card) {
  if (!card) return false;
  return ['damage_single_1', 'damage_single_2', 'damage_aoe_target_radius_1', 'disable_attack_next_round', 'stun_single_1_turn', 'destroy_single', 'destroy_single_no_revive'].includes(card.effect_type);
}

function isFogProtectedTargetForItem(card, attackerPlayerKey, targetIndex) {
  if (!card || !isOffensiveItemCard(card)) return false;
  const targetUnit = matchState.board[targetIndex];
  if (!targetUnit || targetUnit.owner === attackerPlayerKey) return false;
  if (!playerHasFieldEffect(targetUnit.owner, 'field_range_limit_adjacent_only')) return false;
  return !hasAdjacentUnitOwnedBy(targetIndex, attackerPlayerKey);
}

function getFieldAttackBonus(unit, boardIndex) {
  if (!unit) return 0;
  if (isEnemyCenterFieldBuffHealNegated(unit, boardIndex)) return 0;
  const playerKey = unit.owner;
  const ownField = getPlayerFieldCard(playerKey);
  let bonus = 0;
  if (ownField?.effect_type === 'field_center_ally_atk_plus_1' && isPointZone(boardIndex)) bonus += 1;
  if (ownField?.effect_type === 'field_center_ally_atk_plus_2' && isPointZone(boardIndex)) bonus += 2;
  if (ownField?.effect_type === 'field_center_ally_guard_1_atk_plus_1' && isPointZone(boardIndex)) bonus += 1;
  if (playerHasFieldEffect(playerKey, 'field_all_atk_plus_1')) bonus += 1;
  if (playerHasFieldEffect(getOpponent(playerKey), 'field_all_atk_plus_1') && !unitIgnoresEnemyFieldEffects(unit)) bonus += 1;
  return bonus;
}

function getEffectiveAtk(unit, boardIndex) {
  if (!unit) return 0;
  const tempAtkBuff = isUnitBuffsAndHealNegated(unit) ? 0 : Number(unit.tempAtkBuff || 0);
  const fieldBonus = isUnitBuffsAndHealNegated(unit) ? 0 : getFieldAttackBonus(unit, boardIndex);
  const conditionalBonus = isUnitBuffsAndHealNegated(unit) ? 0 : getConditionalAttackBonus(unit, boardIndex);
  return Math.max(0, Number(unit.atk || 0) + tempAtkBuff + fieldBonus + conditionalBonus);
}

function getEffectiveMove(unit, boardIndex = null) {
  if (!unit) return 0;
  if (cannotMoveByEffect(unit)) return 0;
  const sentryReduction = boardIndex != null ? getAdjacentEnemySentryReduction(boardIndex, unit.owner) : 0;
  return Math.max(0, Number(unit.move || 0) + Number(unit.tempMoveBuff || 0) - sentryReduction);
}

function getRoyalCommandAttackBonus(attacker) {
  if (!attacker || !matchState.turnState) return 0;
  return matchState.turnState.royalCommandUnitId === attacker.instanceId && matchState.turnState.royalCommandAttackReady ? 1 : 0;
}

function getAttackDamageAgainst(attacker, attackerIndex, defender, defenderIndex) {
  const targetedBonus = isUnitBuffsAndHealNegated(attacker) ? 0 : getTargetedAttackBonus(attacker, attackerIndex, defender, defenderIndex);
  const royalBonus = isUnitBuffsAndHealNegated(attacker) ? 0 : getRoyalCommandAttackBonus(attacker);
  return Math.max(0, getEffectiveAtk(attacker, attackerIndex) + targetedBonus + royalBonus);
}

function shouldAttackIgnoreReduction(attacker, attackerIndex, defender, defenderIndex) {
  if (!attacker || !defender || isUnitCenterSilenced(attacker, attackerIndex)) return false;
  if (unitHasEffectType(attacker, 'atk_plus_1_vs_buffed_or_reduced_enemy_and_ignore_reduction') && targetHasAtkBuffOrReduction(defender, defenderIndex)) return true;
  if (unitHasEffectType(attacker, 'ignore_reduction_vs_center_enemy_and_atk_plus_1_if_field_buffed') && isPointZone(defenderIndex)) return true;
  if (unitHasEffectType(attacker, 'ignore_enemy_field_effects_self_and_center_aura_negate_enemy_field_buffs_heal_and_ignore_reduction_vs_center') && isPointZone(defenderIndex)) return true;
  return false;
}

function getAttackLimitForUnit(unit) {
  return unitHasEffectType(unit, 'double_attack') ? 2 : 1;
}

function clearTemporaryEffects(playerKey) {
  for (const unit of matchState.board) {
    if (!unit || unit.owner !== playerKey) continue;
    unit.tempAtkBuff = 0;
    unit.tempMoveBuff = 0;
    unit.nextAttackAppliesNoHealNoRevive = false;
  }
}

function refreshTurnStatusForPlayer(playerKey) {
  for (const unit of matchState.board) {
    if (!unit) continue;
    if (unit.owner !== playerKey) {
      unit.actionLocked = false;
      unit.attackLocked = false;
      continue;
    }
    if ((unit.skipActionTurns || 0) > 0) {
      unit.actionLocked = true;
      unit.attackLocked = true;
      unit.skipActionTurns -= 1;
      if ((unit.skipAttackTurns || 0) > 0) unit.skipAttackTurns -= 1;
      continue;
    }
    unit.actionLocked = false;
    if ((unit.skipAttackTurns || 0) > 0) {
      unit.attackLocked = true;
      unit.skipAttackTurns -= 1;
    } else {
      unit.attackLocked = false;
    }
  }
}

function getSelectedItemTargetIndex() {
  return matchState.turnState?.selectedItemTargetIndex ?? null;
}

function getSelectedItemTargetUnit() {
  const idx = getSelectedItemTargetIndex();
  if (idx == null || idx < 0) return null;
  return matchState.board[idx] || null;
}

function getChebyshevNeighbors(centerIndex, radius = 1) {
  const { row, col } = indexToCoord(centerIndex);
  const result = [];
  for (let r = row - radius; r <= row + radius; r += 1) {
    for (let c = col - radius; c <= col + radius; c += 1) {
      if (r < 0 || r > 4 || c < 0 || c > 4) continue;
      result.push(coordToIndex(r, c));
    }
  }
  return result;
}


function getOrthogonalNeighbors(centerIndex) {
  const { row, col } = indexToCoord(centerIndex);
  return [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ]
    .filter(([r, c]) => r >= 0 && r <= 4 && c >= 0 && c <= 4)
    .map(([r, c]) => coordToIndex(r, c));
}

function getPostAttackMoveUnitId() {
  return matchState.turnState?.postAttackMoveUnitId || null;
}

function getPostAttackMoveUnit() {
  const unitId = getPostAttackMoveUnitId();
  if (!unitId) return null;
  const index = findUnitIndexById(unitId);
  if (index < 0) return null;
  return matchState.board[index] || null;
}

function clearPostAttackMoveOpportunity() {
  if (!matchState.turnState) return;
  matchState.turnState.postAttackMoveUnitId = null;
}

function getPostAttackMoveCells(instanceId) {
  if (!instanceId || matchState.phase !== 'battle') return [];
  const startIndex = findUnitIndexById(instanceId);
  if (startIndex < 0) return [];
  return getOrthogonalNeighbors(startIndex).filter((idx) => !matchState.board[idx]);
}

function getLineIndicesFromAttack(attackerIndex, targetIndex, maxDistance = 2) {
  if (attackerIndex == null || targetIndex == null) return [];
  const attacker = indexToCoord(attackerIndex);
  const target = indexToCoord(targetIndex);
  let stepRow = 0;
  let stepCol = 0;
  if (attacker.row === target.row && attacker.col !== target.col) {
    stepCol = target.col > attacker.col ? 1 : -1;
  } else if (attacker.col === target.col && attacker.row !== target.row) {
    stepRow = target.row > attacker.row ? 1 : -1;
  } else {
    return [];
  }

  const result = [];
  for (let distance = 1; distance <= maxDistance; distance += 1) {
    const r = attacker.row + stepRow * distance;
    const c = attacker.col + stepCol * distance;
    if (r < 0 || r > 4 || c < 0 || c > 4) break;
    result.push(coordToIndex(r, c));
  }
  return result;
}

function clearExpiredStartOfTurnEffects(playerKey) {
  const player = getPlayerState(playerKey);
  if (!player) return;
  if (player.teamDamageReductionExpiresOnOwnTurnStart) {
    player.teamDamageReduction = 0;
    player.teamDamageReductionExpiresOnOwnTurnStart = false;
    addLog(`${PLAYER_LABEL[playerKey]} の「防壁展開」の効果が終了しました`);
  }
  if (player.negateEnemyFieldUntilOwnTurnStart) {
    player.negateEnemyFieldUntilOwnTurnStart = false;
    addLog(`${PLAYER_LABEL[playerKey]} の「幽灯の仮面」の効果が終了しました`);
  }
  clearExpiredUnitStatusEffectsForPlayer(playerKey);
}

function applyRoundEndFieldEffects() {
  const triggerOwners = ['player1', 'player2'].filter((playerKey) => playerHasFieldEffect(playerKey, 'field_end_round_damage_all_1'));
  if (!triggerOwners.length) return false;

  for (const ownerKey of triggerOwners) {
    if (matchState.phase !== 'battle') return true;
    const fieldCard = getPlayerFieldCard(ownerKey);
    const targets = matchState.board
      .map((unit, index) => (unit ? index : -1))
      .filter((index) => index >= 0);

    if (!targets.length) continue;
    addLog(`${PLAYER_LABEL[ownerKey]} の環境カード「${fieldCard?.card_name || '???'}」が発動し、ラウンド終了時に全ユニットへ1ダメージを与えます`);

    targets.forEach((targetIndex) => {
      const targetUnit = matchState.board[targetIndex];
      if (!targetUnit) return;
      if (targetUnit.owner !== ownerKey && unitIgnoresEnemyFieldEffects(targetUnit)) return;
      const creditPlayerKey = targetUnit.owner === ownerKey ? null : ownerKey;
      applyDamageToIndex(targetIndex, 1, `環境カード「${fieldCard?.card_name || '???'}」が`, { creditPlayerKey });
    });

    if (checkWinByElimination()) {
      return true;
    }
  }

  return false;
}

function hasLivingOrPendingRevive(playerKey) {
  return getLivingUnits(playerKey).length > 0 || getPendingRevivesForPlayer(playerKey).length > 0;
}

function getItemTargetMode(card) {
  if (!card) return 'none';
  if (['damage_single_1', 'damage_single_2', 'disable_attack_next_round', 'stun_single_1_turn', 'destroy_single', 'destroy_single_no_revive', 'negate_buffs_and_heal_until_next_opponent_round', 'silence_and_disable_attack_while_in_center_until_next_opponent_round', 'center_silence_and_negate_buffs_heal_until_next_opponent_round'].includes(card.effect_type)) return 'enemy';
  if (['heal_single_2', 'full_heal_single', 'heal_single_3_atk_up_turn_1', 'buff_move_atk_turn_1', 'shield_single_2_once', 'move_twice_single', 'royal_command_single', 'untargetable_by_enemy_items_turn_1', 'mark_attack_target_no_heal_no_revive_until_next_opponent_round', 'negate_next_destroy_or_stun_or_disable_attack_once', 'heal_2_and_cleanse_one_status'].includes(card.effect_type)) return 'ally';
  if (['damage_aoe_target_radius_1'].includes(card.effect_type)) return 'any';
  return 'none';
}

function getItemSelectableTargets(card, playerKey) {
  if (!card || matchState.phase !== 'battle' || !isItemWindowOpen()) return [];
  const mode = getItemTargetMode(card);
  if (mode === 'none') return [];
  return matchState.board
    .map((unit, index) => ({ unit, index }))
    .filter(({ unit }) => !!unit)
    .filter(({ unit, index }) => {
      if (mode === 'ally') return unit.owner === playerKey;
      if (mode === 'enemy') {
        if (unit.owner === playerKey) return false;
        if (isUnitUntargetableByEnemyItems(unit, index)) return false;
        if (card.effect_type === 'center_silence_and_negate_buffs_heal_until_next_opponent_round' && !isPointZone(index)) return false;
        if (card.effect_type === 'negate_buffs_and_heal_until_next_opponent_round' && unit.owner === playerKey) return false;
        if (card.effect_type === 'disable_attack_next_round') {
          return !isFogProtectedTargetForItem(card, playerKey, index);
        }
        return !isFogProtectedTargetForItem(card, playerKey, index);
      }
      if (mode === 'any') {
        if (unit.owner === playerKey) return true;
        if (isUnitUntargetableByEnemyItems(unit, index) && isOffensiveItemCard(card)) return false;
        return !isFogProtectedTargetForItem(card, playerKey, index);
      }
      return false;
    })
    .map(({ index }) => index);
}

function clearSelectedItemTarget() {
  if (!matchState.turnState) return;
  matchState.turnState.selectedItemTargetIndex = null;
}

function canConfirmSelectedItem(card) {
  const mode = getItemTargetMode(card);
  if (mode === 'none') return true;
  return getSelectedItemTargetIndex() !== null;
}

function applyDamageToIndex(targetIndex, damage, sourceLabel, options = {}) {
  const defender = matchState.board[targetIndex];
  if (!defender) return { defeated: false, damage: 0, reduced: 0, blocked: false };
  const ignoreReduction = !!options.ignoreReduction;
  const hasExplicitCredit = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey');
  const creditPlayerKey = hasExplicitCredit ? options.creditPlayerKey : matchState.currentPlayer;
  const reductionParts = ignoreReduction ? [] : getUnitDamageReductionParts(defender, targetIndex, { attacker: options.attacker || null, sourceType: options.sourceType || '' });
  const totalReduction = reductionParts.reduce((sum, part) => sum + Number(part.value || 0), 0);
  const requestedDamage = Math.max(0, Number(damage || 0));
  const reduced = ignoreReduction ? 0 : Math.min(requestedDamage, totalReduction);
  const actualDamage = ignoreReduction ? requestedDamage : Math.max(0, requestedDamage - totalReduction);
  const applyNoHealNoReviveUntilTurnStartOf = actualDamage > 0 && options.applyNoHealNoReviveUntilTurnStartOf
    ? String(options.applyNoHealNoReviveUntilTurnStartOf)
    : '';
  if (applyNoHealNoReviveUntilTurnStartOf) {
    defender.noHealNoReviveUntilTurnStartOf = applyNoHealNoReviveUntilTurnStartOf;
  }

  if (ignoreReduction) {
    addLog(`${sourceLabel} ${defender.name} に軽減無視で ${actualDamage} ダメージ`);
  } else if (reductionParts.length) {
    addLog(`${sourceLabel} ${defender.name} へのダメージを軽減（${reductionParts.map((part) => `${part.label} -${part.value}`).join(' / ')}）`);
  }

  if (actualDamage > 0 && canNegateDamageOnce(defender)) {
    defender.negateDamageUsed = true;
    addLog(`${defender.name} の「試合中1回ダメージ無効」が発動しました`);
    return { blocked: true, defeated: false, damage: 0, reduced };
  }

  if (!ignoreReduction && Number(defender.singleUseDamageReduction || 0) > 0) {
    defender.singleUseDamageReduction = 0;
    addLog(`${defender.name} の防護符が発動しました`);
  }

  defender.currentHp -= actualDamage;
  if (!ignoreReduction) addLog(`${sourceLabel} ${defender.name} に ${actualDamage} ダメージ`);
  if (defender.currentHp <= 0 && unitHasEffectType(defender, 'survive_once_at_1') && !defender.surviveOnceUsed) {
    defender.surviveOnceUsed = true;
    defender.currentHp = 1;
    addLog(`${defender.name} は一度だけ HP1 で踏みとどまりました`);
    return { defeated: false, damage: actualDamage, reduced, blocked: false, survivedOnce: true };
  }
  if (defender.currentHp <= 0) {
    matchState.board[targetIndex] = null;
    clearPendingRedeployForUnit(defender);
    if (creditPlayerKey) {
      getPlayerState(creditPlayerKey).defeated += 1;
    }
    if (!options.suppressDefeatSfx) playSfx('defeat');
    addLog(`${defender.name} が撃破されました`);
    if (!options.noRevive && !unitHasNoHealNoRevive(defender)) {
      queueUnitRevive(defender);
    } else if (!options.noRevive && unitHasEffectType(defender, 'revive_next_turn_from_base')) {
      addLog(`${defender.name} は復活できません`);
    }
    return { defeated: true, damage: actualDamage, reduced, blocked: false };
  }
  addLog(`${defender.name} の残りHPは ${defender.currentHp}`);
  return { defeated: false, damage: actualDamage, reduced, blocked: false };
}


function applyAttackDamageToIndex(attacker, targetIndex, damage, options = {}) {
  const defender = matchState.board[targetIndex];
  if (!attacker || !defender || defender.owner === attacker.owner) return { blocked: false, defeated: false, damage: 0, resolvedTargetIndex: targetIndex, visualEntry: null };
  const defenderVisualEntry = createCombatVisualEntry(defender, targetIndex);
  const guardianKnight = findAdjacentGuardianKnight(targetIndex, defender.owner);
  if (guardianKnight && guardianKnight.unit.instanceId !== defender.instanceId) {
    guardianKnight.unit.guardBlockUsed = true;
    addLog(`${guardianKnight.unit.name} が ${defender.name} への攻撃を1回だけ完全防御しました`);
    return { blocked: true, defeated: false, damage: 0, resolvedTargetIndex: targetIndex, visualEntry: defenderVisualEntry };
  }
  const kingCommander = findAdjacentKingCommander(targetIndex, defender.owner);
  if (kingCommander && kingCommander.unit.instanceId !== defender.instanceId) {
    const kingInstanceId = kingCommander.unit.instanceId;
    const interceptedVisualEntry = createCombatVisualEntry(kingCommander.unit, kingCommander.index);
    const redirectedDamage = typeof options.attackerIndex === 'number'
      ? getAttackDamageAgainst(attacker, options.attackerIndex, kingCommander.unit, kingCommander.index)
      : damage;
    const redirectOptions = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey')
      ? { ...options }
      : { ...options, creditPlayerKey: attacker.owner };
    if (typeof options.attackerIndex === 'number' && shouldAttackIgnoreReduction(attacker, options.attackerIndex, kingCommander.unit, kingCommander.index)) {
      redirectOptions.ignoreReduction = true;
    }
    delete redirectOptions.attackerIndex;
    addLog(`${kingCommander.unit.name} が ${defender.name} への攻撃を引き受けます`);
    const result = applyDamageToIndex(kingCommander.index, redirectedDamage, `${PLAYER_LABEL[attacker.owner]} の ${attacker.name} が`, { ...redirectOptions, attacker });
    const kingAliveIndex = findUnitIndexById(kingInstanceId);
    const attackerAliveIndex = findUnitIndexById(attacker.instanceId);
    let counterDamage = 0;
    if (kingAliveIndex >= 0 && attackerAliveIndex >= 0) {
      const kingAlive = matchState.board[kingAliveIndex];
      addLog(`${kingAlive.name} が反撃し、${attacker.name} に 1 ダメージを与えます`);
      const counterResult = applyDamageToIndex(attackerAliveIndex, 1, `${kingAlive.name} の反撃で`, { creditPlayerKey: kingAlive.owner });
      counterDamage = Number(counterResult.damage || 0);
      var counterReduced = Number(counterResult.reduced || 0);
      var counterBlocked = !!counterResult.blocked;
    }
    return {
      ...result,
      intercepted: true,
      resolvedTargetIndex: kingCommander.index,
      visualEntry: interceptedVisualEntry,
      counterTargetIndex: attackerAliveIndex >= 0 ? attackerAliveIndex : null,
      counterDamage,
      counterReduced,
      counterBlocked,
    };
  }
  const damageOptions = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey')
    ? { ...options }
    : { ...options, creditPlayerKey: attacker.owner };
  if (typeof options.attackerIndex === 'number' && shouldAttackIgnoreReduction(attacker, options.attackerIndex, defender, targetIndex)) {
    damageOptions.ignoreReduction = true;
  }
  delete damageOptions.attackerIndex;
  const result = applyDamageToIndex(targetIndex, damage, `${PLAYER_LABEL[attacker.owner]} の ${attacker.name} が`, { ...damageOptions, attacker });
  return { ...result, resolvedTargetIndex: targetIndex, visualEntry: defenderVisualEntry };
}

function applyItemEffect(card, playerKey) {
  const targetIndex = getSelectedItemTargetIndex();
  const targetUnit = getSelectedItemTargetUnit();
  const actorLabel = PLAYER_LABEL[playerKey];
  const effectBoost = getItemEffectBoost(playerKey, card.effect_type);
  const success = (fx = {}) => ({ ok: true, fx });
  switch (card.effect_type) {
    case 'heal_single_2': {
      if (!targetUnit) return false;
      const amount = 2 + effectBoost;
      const result = healUnitForEffect(targetUnit, amount);
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      if (result.blocked) {
        addLog(`${actorLabel}: ${card.card_name} は ${targetUnit.name} に使われましたが、回復は無効化されました`);
      } else {
        addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} を ${result.healed} 回復しました${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      }
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount, impacts: resolvedIndex >= 0 && result.healed > 0 ? [{ index: resolvedIndex, kind: 'heal', amount: result.healed }] : [] });
    }
    case 'full_heal_single': {
      if (!targetUnit) return false;
      const amount = Math.max(0, Number(targetUnit.maxHp || 0) - Number(targetUnit.currentHp || 0));
      const result = healUnitForEffect(targetUnit, amount);
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      if (result.blocked) {
        addLog(`${actorLabel}: ${card.card_name} は ${targetUnit.name} に使われましたが、回復は無効化されました`);
      } else {
        addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} の HP を全回復しました（+${result.healed}）`);
      }
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount: result.healed, impacts: resolvedIndex >= 0 && result.healed > 0 ? [{ index: resolvedIndex, kind: 'heal', amount: result.healed }] : [] });
    }
    case 'heal_single_3_atk_up_turn_1': {
      if (!targetUnit) return false;
      const healResult = healUnitForEffect(targetUnit, 3);
      if (!isUnitBuffsAndHealNegated(targetUnit)) {
        targetUnit.tempAtkBuff = Number(targetUnit.tempAtkBuff || 0) + 1;
      }
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      if (healResult.blocked) {
        addLog(`${actorLabel}: ${card.card_name} は ${targetUnit.name} に使われましたが、回復は無効化されました`);
      } else {
        addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} を ${healResult.healed} 回復し、この手番の ATK を +1 しました`);
      }
      return success({
        targets: resolvedIndex >= 0 ? [resolvedIndex] : [],
        amount: healResult.healed,
        impacts: resolvedIndex >= 0 ? [
          ...(healResult.healed > 0 ? [{ index: resolvedIndex, kind: 'heal', amount: healResult.healed }] : []),
          { index: resolvedIndex, kind: 'buff', label: 'BLOOD' },
        ] : [],
      });
    }
    case 'heal_all_1': {
      const allies = getLivingUnits(playerKey);
      let healed = 0;
      const targets = [];
      const impacts = [];
      allies.forEach((unit) => {
        const healResult = healUnitForEffect(unit, 1 + effectBoost);
        const healedAmount = healResult.healed;
        healed += healedAmount;
        const idx = findUnitIndexByIdOwned(unit.instanceId, unit.owner);
        if (idx >= 0) targets.push(idx);
        if (idx >= 0 && healedAmount > 0) impacts.push({ index: idx, kind: 'heal', amount: healedAmount });
      });
      addLog(`${actorLabel}: ${card.card_name} で味方全体を回復しました（合計 +${healed}）${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      return success({ targets, amount: healed, impacts });
    }
    case 'damage_single_1': {
      if (targetIndex == null) return false;
      const visualEntry = createCombatVisualEntry(matchState.board[targetIndex], targetIndex);
      const result = applyDamageToIndex(targetIndex, 1 + effectBoost, `${actorLabel}: ${card.card_name} で`, { suppressDefeatSfx: true, sourceType: 'enemy_item' });
      return success({ targets: [targetIndex], amount: Number(result.damage || 0), defeated: !!result.defeated, impacts: [{ index: targetIndex, kind: result.blocked ? 'guard' : 'damage', amount: Number(result.damage || 0), reduced: Number(result.reduced || 0), blocked: !!result.blocked, defeated: !!result.defeated, visualEntry, label: result.blocked ? 'GUARD' : undefined }] });
    }
    case 'damage_single_2': {
      if (targetIndex == null) return false;
      const visualEntry = createCombatVisualEntry(matchState.board[targetIndex], targetIndex);
      const result = applyDamageToIndex(targetIndex, 2 + effectBoost, `${actorLabel}: ${card.card_name} で`, { suppressDefeatSfx: true, sourceType: 'enemy_item' });
      return success({ targets: [targetIndex], amount: Number(result.damage || 0), defeated: !!result.defeated, impacts: [{ index: targetIndex, kind: result.blocked ? 'guard' : 'damage', amount: Number(result.damage || 0), reduced: Number(result.reduced || 0), blocked: !!result.blocked, defeated: !!result.defeated, visualEntry, label: result.blocked ? 'GUARD' : undefined }] });
    }
    case 'destroy_single': {
      if (targetIndex == null) return false;
      const destroyedUnit = matchState.board[targetIndex];
      if (!destroyedUnit) return false;
      if (isUnitProtectedFromEnemyItemDestroy(destroyedUnit, targetIndex)) {
        addLog(`${actorLabel}: ${card.card_name} は ${destroyedUnit.name} に使われましたが、破壊を防がれました`);
        return success({ targets: [targetIndex], impacts: [{ index: targetIndex, kind: 'buff', label: 'GUARD' }] });
      }
      if (tryConsumeDestroyStunDisableProtection(destroyedUnit, targetIndex, 'destroy', 'enemy_item', `${actorLabel}: ${card.card_name} により `)) {
        return success({ targets: [targetIndex], impacts: [{ index: targetIndex, kind: 'buff', label: 'WARD' }] });
      }
      const visualEntry = createCombatVisualEntry(destroyedUnit, targetIndex);
      const removedHp = Math.max(1, Number(destroyedUnit.currentHp || 1));
      matchState.board[targetIndex] = null;
      clearPendingRedeployForUnit(destroyedUnit);
      getPlayerState(playerKey).defeated += 1;
      addLog(`${actorLabel}: ${card.card_name} で ${destroyedUnit.name} を即座に破壊しました`);
      queueUnitRevive(destroyedUnit);
      return success({ targets: [targetIndex], defeated: true, impacts: [{ index: targetIndex, kind: 'damage', amount: removedHp, defeated: true, visualEntry, label: 'BREAK', heavy: true }] });
    }
    case 'destroy_single_no_revive': {
      if (targetIndex == null) return false;
      const destroyedUnit = matchState.board[targetIndex];
      if (!destroyedUnit) return false;
      if (isUnitProtectedFromEnemyItemDestroy(destroyedUnit, targetIndex)) {
        addLog(`${actorLabel}: ${card.card_name} は ${destroyedUnit.name} に使われましたが、破壊を防がれました`);
        return success({ targets: [targetIndex], impacts: [{ index: targetIndex, kind: 'buff', label: 'GUARD' }] });
      }
      if (tryConsumeDestroyStunDisableProtection(destroyedUnit, targetIndex, 'destroy', 'enemy_item', `${actorLabel}: ${card.card_name} により `)) {
        return success({ targets: [targetIndex], impacts: [{ index: targetIndex, kind: 'buff', label: 'WARD' }] });
      }
      const visualEntry = createCombatVisualEntry(destroyedUnit, targetIndex);
      const removedHp = Math.max(1, Number(destroyedUnit.currentHp || 1));
      matchState.board[targetIndex] = null;
      clearPendingRedeployForUnit(destroyedUnit);
      getPlayerState(playerKey).defeated += 1;
      addLog(`${actorLabel}: ${card.card_name} で ${destroyedUnit.name} を破壊し、復活を封じました`);
      return success({ targets: [targetIndex], defeated: true, impacts: [{ index: targetIndex, kind: 'damage', amount: removedHp, defeated: true, visualEntry, label: 'SEAL', heavy: true }] });
    }
    case 'disable_attack_next_round': {
      if (!targetUnit) return false;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      if (tryConsumeDestroyStunDisableProtection(targetUnit, resolvedIndex, 'disable_attack', 'enemy_item', `${actorLabel}: ${card.card_name} により `)) {
        return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'WARD' }] : [] });
      }
      targetUnit.skipAttackTurns = Math.max(targetUnit.skipAttackTurns || 0, 1);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の自身の手番で攻撃不可になります`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'SMOKE' }] : [] });
    }
    case 'stun_single_1_turn': {
      if (!targetUnit) return false;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      if (isUnitProtectedFromEnemyItemStun(targetUnit, resolvedIndex)) {
        addLog(`${actorLabel}: ${card.card_name} は ${targetUnit.name} に使われましたが、行動不能を防がれました`);
        return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'GUARD' }] : [] });
      }
      if (tryConsumeDestroyStunDisableProtection(targetUnit, resolvedIndex, 'stun', 'enemy_item', `${actorLabel}: ${card.card_name} により `)) {
        return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'WARD' }] : [] });
      }
      targetUnit.skipActionTurns = Math.max(Number(targetUnit.skipActionTurns || 0), 1);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の自身の手番で行動できなくなります`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'FREEZE' }] : [] });
    }
    case 'buff_move_atk_turn_1': {
      if (!targetUnit) return false;
      const amount = 1 + effectBoost;
      targetUnit.tempAtkBuff = (targetUnit.tempAtkBuff || 0) + amount;
      targetUnit.tempMoveBuff = (targetUnit.tempMoveBuff || 0) + amount;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} の ATK/MOVE をこの手番だけ +${amount} しました`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount, impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'BOOST' }] : [] });
    }
    case 'shield_single_2_once': {
      if (!targetUnit) return false;
      const amount = 2 + effectBoost;
      targetUnit.singleUseDamageReduction = Math.max(Number(targetUnit.singleUseDamageReduction || 0), amount);
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次に受けるダメージを ${amount} 軽減します`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount, impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'GUARD' }] : [] });
    }
    case 'heal_2_and_cleanse_one_status': {
      if (!targetUnit || targetUnit.owner !== playerKey) return false;
      const healResult = healUnitForEffect(targetUnit, 2);
      const clearedKind = clearOneCleansableStatus(targetUnit);
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      const parts = [];
      if (healResult.healed > 0) parts.push(`HPを ${healResult.healed} 回復`);
      if (healResult.blocked) parts.push('HP回復は無効');
      if (clearedKind) parts.push(`${getCleanseStatusLabel(clearedKind)} を解除`);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name}${parts.length ? ` は ${parts.join('、')} しました` : ' に変化はありませんでした'}`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'CLEAN' }] : [] });
    }
    case 'move_twice_single': {
      if (!targetUnit || targetUnit.owner !== playerKey) return false;
      matchState.turnState.acceleratedUnitId = targetUnit.instanceId;
      const amount = 2 + effectBoost;
      matchState.turnState.acceleratedMovesRemaining = amount;
      matchState.selectedUnitId = targetUnit.instanceId;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} はこの手番に ${amount} 回移動できます`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount, impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'HASTE' }] : [] });
    }
    case 'royal_command_single': {
      if (!targetUnit || targetUnit.owner !== playerKey) return false;
      matchState.turnState.acceleratedUnitId = targetUnit.instanceId;
      matchState.turnState.acceleratedMovesRemaining = Math.max(Number(matchState.turnState.acceleratedMovesRemaining || 0), 2);
      matchState.turnState.royalCommandUnitId = targetUnit.instanceId;
      matchState.turnState.royalCommandAttackReady = false;
      matchState.selectedUnitId = targetUnit.instanceId;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} により ${targetUnit.name} はこの手番、追加で1回移動でき、移動後の最初の攻撃が +1 されます`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], amount: 2, impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'ORDER' }] : [] });
    }
    case 'team_damage_minus_1_until_next_round': {
      const player = getPlayerState(playerKey);
      const amount = 1 + effectBoost;
      player.teamDamageReduction = Math.max(Number(player.teamDamageReduction || 0), amount);
      player.teamDamageReductionExpiresOnOwnTurnStart = true;
      const targets = getLivingUnits(playerKey)
        .map((unit) => findUnitIndexByIdOwned(unit.instanceId, unit.owner))
        .filter((idx) => idx >= 0);
      addLog(`${actorLabel}: ${card.card_name} で味方全体が次の自分のラウンド開始時までダメージ -${amount} になりました`);
      return success({ targets, amount, impacts: targets.map((index) => ({ index, kind: 'buff', label: 'GUARD' })) });
    }
    case 'damage_aoe_target_radius_1': {
      if (targetIndex == null) return false;
      const affected = getChebyshevNeighbors(targetIndex, 1)
        .filter((idx) => !!matchState.board[idx]);
      if (!affected.length) return false;
      const impacts = [];
      addLog(`${actorLabel}: ${card.card_name} が ${formatCellLabel(targetIndex)} を中心に炸裂しました${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      affected.forEach((idx) => {
        const visualEntry = createCombatVisualEntry(matchState.board[idx], idx);
        const result = applyDamageToIndex(idx, 1 + effectBoost, `${actorLabel}: ${card.card_name} で`, { suppressDefeatSfx: true, sourceType: 'enemy_item' });
        impacts.push({ index: idx, kind: result.blocked ? 'guard' : 'damage', amount: Number(result.damage || 0), reduced: Number(result.reduced || 0), blocked: !!result.blocked, defeated: !!result.defeated, visualEntry, label: result.blocked ? 'GUARD' : undefined });
      });
      return success({ targets: affected, centerIndex: targetIndex, amount: 1 + effectBoost, impacts });
    }
    case 'negate_enemy_field_until_next_opponent_round': {
      const player = getPlayerState(playerKey);
      if (!player) return false;
      player.negateEnemyFieldUntilOwnTurnStart = true;
      const enemyField = getPlayerFieldCard(getOpponent(playerKey));
      addLog(`${actorLabel}: ${card.card_name} により、${enemyField ? `敵の環境カード「${enemyField.card_name}」` : '敵の環境カード'}の効果を次の相手ラウンド終了時まで無効にします`);
      return success({ targets: [] });
    }
    case 'untargetable_by_enemy_items_turn_1': {
      if (!targetUnit) return false;
      targetUnit.untargetableByEnemyItemsUntilTurnStartOf = playerKey;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の相手ラウンド終了時まで、敵アイテムの対象になりません`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'SAFE' }] : [] });
    }
    case 'negate_next_destroy_or_stun_or_disable_attack_once': {
      if (!targetUnit) return false;
      targetUnit.negateNextDestroyStunDisableAttackUntilTurnStartOf = playerKey;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の相手ラウンド終了時まで、次に受ける破壊・行動不能・攻撃不能のいずれか1つを無効化します`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'WARD' }] : [] });
    }
    case 'mark_attack_target_no_heal_no_revive_until_next_opponent_round': {
      if (!targetUnit) return false;
      targetUnit.nextAttackAppliesNoHealNoRevive = true;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} の次の攻撃でダメージを受けた敵は、次の相手ラウンド終了時までHPを回復できず、倒された場合は復活できません`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'CURSE' }] : [] });
    }
    case 'silence_and_disable_attack_while_in_center_until_next_opponent_round': {
      if (!targetUnit) return false;
      targetUnit.centerSilenceDisableAttackUntilTurnStartOf = playerKey;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の相手ラウンド終了時まで、中央9マスにいる間は効果を失い攻撃できません`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'SEAL' }] : [] });
    }
    case 'center_silence_and_negate_buffs_heal_until_next_opponent_round': {
      if (!targetUnit) return false;
      targetUnit.negateBuffsAndHealUntilTurnStartOf = playerKey;
      targetUnit.fullSilenceUntilTurnStartOf = playerKey;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の相手ラウンド終了時まで、攻撃力上昇・ダメージ軽減・HP回復を受けず、カード効果を失います`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'SEAL' }] : [] });
    }
    case 'negate_buffs_and_heal_until_next_opponent_round': {
      if (!targetUnit) return false;
      targetUnit.negateBuffsAndHealUntilTurnStartOf = playerKey;
      const resolvedIndex = findUnitIndexByIdOwned(targetUnit.instanceId, targetUnit.owner);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の相手ラウンド終了時まで、攻撃力上昇・ダメージ軽減・HP回復を受けません`);
      return success({ targets: resolvedIndex >= 0 ? [resolvedIndex] : [], impacts: resolvedIndex >= 0 ? [{ index: resolvedIndex, kind: 'buff', label: 'SEAL' }] : [] });
    }
    default:
      addLog(`${actorLabel}: アイテム「${card.card_name}」を使用しました（この効果はまだ手動処理です）`);
      return success({ targets: targetIndex == null ? [] : [targetIndex] });
  }
}

function calculatePoints(playerKey) {
  const defeatedPoints = getPlayerState(playerKey).defeated * 2;
  const pointZoneUnits = matchState.board.reduce((count, unit, index) => {
    if (unit && unit.owner === playerKey && isPointZone(index)) return count + 1;
    return count;
  }, 0);
  return defeatedPoints + pointZoneUnits;
}

function getPlaceableCellsForCurrentStep() {
  const step = getCurrentSetupStep();
  if (!step) return [];
  const column = HOME_COLUMN[step.player];
  const cells = [];
  for (let row = 0; row < 5; row += 1) {
    const index = coordToIndex(row, column);
    if (!matchState.board[index]) cells.push(index);
  }
  return cells;
}

function getReachableMoveCells(instanceId) {
  if (matchState.phase !== 'battle') return [];
  const startIndex = findUnitIndexById(instanceId);
  if (startIndex < 0) return [];
  const unit = matchState.board[startIndex];
  if (!unit || unit.owner !== matchState.currentPlayer || unit.actionLocked) return [];

  const hasAcceleratedMoves = !!(matchState.turnState?.acceleratedUnitId && matchState.turnState.acceleratedMovesRemaining > 0);
  if (hasAcceleratedMoves) {
    if (unit.instanceId !== matchState.turnState.acceleratedUnitId) return [];
  } else if (matchState.turnState.moved) {
    return [];
  }

  const maxSteps = getEffectiveMove(unit, startIndex);
  if (maxSteps <= 0) return [];
  const visited = new Set([startIndex]);
  const queue = [{ index: startIndex, steps: 0 }];
  const result = [];
  const neighborOffsets = getMoveNeighborOffsets(unit);

  while (queue.length) {
    const current = queue.shift();
    const { row, col } = indexToCoord(current.index);

    for (const [offsetRow, offsetCol] of neighborOffsets) {
      const nextRow = row + offsetRow;
      const nextCol = col + offsetCol;
      if (nextRow < 0 || nextRow > 4 || nextCol < 0 || nextCol > 4) continue;
      const nextIndex = coordToIndex(nextRow, nextCol);
      if (visited.has(nextIndex)) continue;
      if (matchState.board[nextIndex]) continue;
      const nextSteps = current.steps + 1;
      if (nextSteps > maxSteps) continue;
      visited.add(nextIndex);
      result.push(nextIndex);
      queue.push({ index: nextIndex, steps: nextSteps });
    }
  }

  if (unitHasEffectType(unit, 'swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap', startIndex)) {
    getOrthogonalNeighbors(startIndex).forEach((idx) => {
      const ally = matchState.board[idx];
      if (ally && ally.owner === unit.owner && ally.instanceId !== unit.instanceId && !result.includes(idx)) {
        result.push(idx);
      }
    });
  }

  return result;
}

function getAttackTargets(instanceId) {
  if (matchState.phase !== 'battle') return [];
  const startIndex = findUnitIndexById(instanceId);
  if (startIndex < 0) return [];
  const unit = matchState.board[startIndex];
  if (!unit || unit.owner !== matchState.currentPlayer || unit.actionLocked || unit.attackLocked || isUnitCenterSilenced(unit, startIndex)) return [];
  if (currentPlayerCannotAttackAfterMove(unit)) return [];

  const turnState = matchState.turnState || {};
  const attackUnitId = turnState.attackUnitId || null;
  const attackCount = Number(turnState.attackCount || 0);
  if (attackUnitId && attackUnitId !== unit.instanceId) return [];
  if (attackCount >= getAttackLimitForUnit(unit)) return [];

  const { row, col } = indexToCoord(startIndex);
  const candidates = [
    [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1],
  ];

  const targetSet = new Set(
    candidates
      .filter(([r, c]) => r >= 0 && r <= 4 && c >= 0 && c <= 4)
      .map(([r, c]) => coordToIndex(r, c))
      .filter((index) => matchState.board[index] && matchState.board[index].owner !== matchState.currentPlayer)
  );

  if (unitHasEffectType(unit, 'range_2') || unitHasEffectType(unit, 'pierce_line_2')) {
    const lines = [
      [[row - 1, col], [row - 2, col]],
      [[row + 1, col], [row + 2, col]],
      [[row, col - 1], [row, col - 2]],
      [[row, col + 1], [row, col + 2]],
    ];
    lines.forEach((line) => {
      line.forEach(([r, c]) => {
        if (r < 0 || r > 4 || c < 0 || c > 4) return;
        const idx = coordToIndex(r, c);
        if (matchState.board[idx] && matchState.board[idx].owner !== matchState.currentPlayer) targetSet.add(idx);
      });
    });
  }

  if (unitHasEffectType(unit, 'row_range_attack')) {
    for (let targetCol = 0; targetCol < 5; targetCol += 1) {
      if (targetCol === col) continue;
      const idx = coordToIndex(row, targetCol);
      if (matchState.board[idx] && matchState.board[idx].owner !== matchState.currentPlayer) {
        targetSet.add(idx);
      }
    }
  }

  const enemyFogActive = playerHasFieldEffect(getOpponent(unit.owner), 'field_range_limit_adjacent_only')
    && !unitIgnoresEnemyFieldEffects(unit);
  if (!enemyFogActive) return [...targetSet];
  const adjacent = new Set(getOrthogonalNeighbors(startIndex));
  return [...targetSet].filter((index) => adjacent.has(index));
}

function getSelectedUnit() {
  if (!matchState.selectedUnitId) return null;
  const index = findUnitIndexById(matchState.selectedUnitId);
  return index >= 0 ? matchState.board[index] : null;
}

function isItemWindowOpen() {
  return !!(matchState.turnState && matchState.turnState.itemWindowOpen);
}

function hasItemDecisionFocus() {
  return matchState.phase === 'battle'
    && isItemWindowOpen()
    && !getSelectedItemCard()
    && !getPendingAction()
    && !getPendingRedeployCard()
    && !getPostAttackMoveUnit();
}

function getSelectedItemCardId() {
  return matchState.turnState?.selectedItemCardId || null;
}

function getSelectedItemCard() {
  const selectedCardId = getSelectedItemCardId();
  return selectedCardId ? cardMap.get(selectedCardId) : null;
}

function getPendingAction() {
  return matchState.turnState?.pendingAction || null;
}

function clearPendingAction() {
  if (!matchState.turnState) return;
  matchState.turnState.pendingAction = null;
}

function setPendingAction(action) {
  if (!matchState.turnState) return;
  matchState.turnState.pendingAction = action;
}

function selectItemForUse(cardId) {
  if (matchState.phase !== 'battle' || !isItemWindowOpen() || matchState.turnState.itemUsed) return;
  itemPickerOpen = false;
  roomSyncState.pendingItemUseRequest = false;
  const nextValue = matchState.turnState.selectedItemCardId === cardId ? null : cardId;
  matchState.turnState.selectedItemCardId = nextValue;
  matchState.turnState.selectedItemTargetIndex = null;
  renderMatchArea();
}

function cancelSelectedItemUse() {
  if (!matchState.turnState) return;
  itemPickerOpen = false;
  matchState.turnState.selectedItemCardId = null;
  matchState.turnState.selectedItemTargetIndex = null;
  renderMatchArea();
}

function closeItemWindow() {
  if (!matchState.turnState) return;
  itemPickerOpen = false;
  matchState.turnState.itemWindowOpen = false;
  matchState.turnState.selectedItemCardId = null;
  matchState.turnState.selectedItemTargetIndex = null;
  matchState.selectedUnitId = null;
  matchState.actionMode = null;
  clearPostAttackMoveOpportunity();
  clearPendingAction();
}

function performItemUseLocal(selectedCardId, targetIndex = null, playerKey = matchState.currentPlayer) {
  if (matchState.phase !== 'battle' || !matchState.turnState) return false;
  if (!selectedCardId) return false;

  matchState.currentPlayer = playerKey || matchState.currentPlayer;
  matchState.turnState.selectedItemCardId = selectedCardId;
  matchState.turnState.selectedItemTargetIndex = targetIndex == null ? null : Number(targetIndex);

  const player = getPlayerState(matchState.currentPlayer);
  const itemState = player.itemStates.find((item) => item.cardId === selectedCardId && !item.used);
  if (!itemState) return false;

  const card = cardMap.get(selectedCardId);
  if (!card || !canConfirmSelectedItem(card)) return false;

  const applied = applyItemEffect(card, matchState.currentPlayer);
  if (!applied) return false;

  itemState.used = true;
  matchState.turnState.itemUsed = true;
  closeItemWindow();
  combatFxSkipNextSnapshotDiff = true;
  renderMatchArea();
  playItemPresentationSequence(card, applied.fx || {});
  if (checkWinByElimination()) return true;
  return true;
}

function confirmSelectedItemUse() {
  if (matchState.phase !== 'battle' || !isItemWindowOpen() || !matchState.turnState) return;
  const selectedCardId = getSelectedItemCardId();
  if (!selectedCardId) {
    window.alert('先に使うアイテムを1枚選んでください。');
    return;
  }

  const card = cardMap.get(selectedCardId);
  if (!canConfirmSelectedItem(card)) {
    window.alert('このアイテムの対象を先に選んでください。');
    return;
  }

  const selectedTargetIndex = getSelectedItemTargetIndex();
  if (roomSyncState.enabled && isRoomActiveBattlePlayer() && typeof roomSyncState.onItemUseRequest === 'function') {
    roomSyncState.pendingItemUseRequest = true;
    renderMatchArea();
    roomSyncState.onItemUseRequest({
      player: matchState.currentPlayer,
      cardId: selectedCardId,
      targetIndex: selectedTargetIndex,
    });
    return;
  }

  performItemUseLocal(selectedCardId, selectedTargetIndex, matchState.currentPlayer);
}

function clearMatchSelection() {
  matchState.selectedReserveCardId = null;
  matchState.selectedUnitId = null;
  matchState.actionMode = null;
  clearPostAttackMoveOpportunity();
  clearPendingAction();
  renderMatchArea();
}

function updateSelectionInfo() {
  if (matchState.phase === 'setup') {
    const step = getCurrentSetupStep();
    if (matchState.selectedReserveCardId) {
      const card = cardMap.get(matchState.selectedReserveCardId);
      setSelectionInfoText(`手順2: 「${card.card_name}」を選択中です。盤面の金色に光るマスへ置いてください。`);
      return;
    }
    if (step) {
      setSelectionInfoText(`手順1: ${PLAYER_LABEL[step.player]} の「配置待ちバトルカード」から1枚選んでください。`);
      return;
    }
  }

  const selectedUnit = getSelectedUnit();
  const pendingAction = getPendingAction();
  const pendingRedeployCard = getPendingRedeployCard();
  if (pendingAction) {
    if (pendingAction.type === 'move' || pendingAction.type === 'postAttackMove') {
      selectionInfo.textContent = `移動確認中: ${pendingAction.unitName} を ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ移動`;
    } else {
      selectionInfo.textContent = `攻撃確認中: ${pendingAction.unitName} が ${pendingAction.targetName} を攻撃`;
    }
    return;
  }

  if (pendingRedeployCard) {
    const cells = getRedeployableCells(matchState.currentPlayer);
    setSelectionInfoText(`再配置待ち: ${pendingRedeployCard.card_name} を自陣の空きマスへ置いてください${cells.length ? '' : '（現在は空きマスがありません）'}`);
    return;
  }

  const postAttackMoveUnit = getPostAttackMoveUnit();
  if (postAttackMoveUnit) {
    const moveCells = getPostAttackMoveCells(postAttackMoveUnit.instanceId);
    setSelectionInfoText(`攻撃後移動: ${postAttackMoveUnit.name} は攻撃後に1マス移動できます。${moveCells.length ? '移動先を1つ選ぶか、手番終了でそのまま終了してください。' : '空きマスがないため移動できません。'}`);
    return;
  }

  if (selectedUnit) {
    const idx = findUnitIndexById(selectedUnit.instanceId);
    const extraAttackText = matchState.turnState?.attackUnitId === selectedUnit.instanceId && unitHasEffectType(selectedUnit, 'double_attack') && Number(matchState.turnState.attackCount || 0) > 0 && Number(matchState.turnState.attackCount || 0) < getAttackLimitForUnit(selectedUnit)
      ? ` / 神速剣士: 残り${getAttackLimitForUnit(selectedUnit) - Number(matchState.turnState.attackCount || 0)}回攻撃可`
      : '';
    setSelectionInfoText(`${selectedUnit.name} を選択中 / HP ${selectedUnit.currentHp}/${selectedUnit.maxHp} / ATK ${getEffectiveAtk(selectedUnit, idx)} / MOVE ${getEffectiveMove(selectedUnit, idx)}${selectedUnit.actionLocked ? ' / この手番は行動不可' : (selectedUnit.attackLocked ? ' / この手番は攻撃不可' : '')}${cannotMoveByEffect(selectedUnit) ? ' / このユニットは移動不可' : ''}${currentPlayerCannotAttackAfterMove(selectedUnit) ? ' / 暴風域: 移動後は攻撃不可' : ''}${matchState.turnState?.acceleratedUnitId === selectedUnit.instanceId && matchState.turnState.acceleratedMovesRemaining > 0 ? ` / ${getExtraMoveSourceName(selectedUnit.instanceId)}: 残り${matchState.turnState.acceleratedMovesRemaining}回移動可` : ''}${matchState.turnState?.royalCommandUnitId === selectedUnit.instanceId ? (matchState.turnState.royalCommandAttackReady ? ' / 王冠の勅命: 次の攻撃+1待機中' : ' / 王冠の勅命: 移動後の初回攻撃+1') : ''}${extraAttackText}`);
    return;
  }

  if (matchState.phase === 'battle' && isItemWindowOpen()) {
    const selectedItemCard = getSelectedItemCard();
    if (selectedItemCard) {
      const targetMode = getItemTargetMode(selectedItemCard);
      const targetUnit = getSelectedItemTargetUnit();
      if (targetMode === 'none') {
        setSelectionInfoText(`アイテム「${selectedItemCard.card_name}」を選択中です。確認して使用するか、キャンセルしてください。`);
      } else if (targetUnit) {
        setSelectionInfoText(`アイテム「${selectedItemCard.card_name}」の対象に ${targetUnit.name} を選択中です。確認して使用するか、キャンセルしてください。`);
      } else if (targetMode === 'any') {
        setSelectionInfoText(`アイテム「${selectedItemCard.card_name}」を選択中です。盤面から中心にするユニットを1体選んでください。`);
      } else {
        setSelectionInfoText(`アイテム「${selectedItemCard.card_name}」を選択中です。盤面から対象ユニットを1体選んでください。`);
      }
      return;
    }
    setSelectionInfoText('アイテム使用フェーズです。「アイテム一覧」から1枚選ぶか、「アイテムを使わず次へ」を押してください。');
    return;
  }

  setSelectionInfoText('ユニット未選択');
}

function createMiniImage(imagePath, altText, extraClass = '') {
  const image = document.createElement('img');
  image.className = `mini-card-image ${extraClass}`.trim();
  image.src = imagePath;
  image.alt = altText;
  image.loading = 'lazy';
  return image;
}

function createMiniCardMeta(card, effectFallback = '効果なし', compact = false) {
  const wrapper = document.createElement('div');
  wrapper.className = `side-card-text ${compact ? 'compact-text' : ''}`.trim();
  wrapper.innerHTML = compact
    ? `<div class="side-card-title">${card.card_name}</div>`
    : `
      <div class="side-card-title">${card.card_name}</div>
      <div class="side-card-meta">${card.effect_text || effectFallback}</div>
    `;
  return wrapper;
}

function createHiddenPrivateRow(title, metaText) {
  const row = document.createElement('div');
  row.className = 'side-card-item hidden-private-row';
  row.innerHTML = `
    <div class="hidden-private-badge">非公開</div>
    <div>
      <div class="side-card-title">${title}</div>
      <div class="side-card-meta">${metaText}</div>
    </div>
  `;
  return row;
}

function renderItems(playerKey, targetElement) {
  const player = getPlayerState(playerKey);
  targetElement.innerHTML = '';
  if (!player.itemStates.length) {
    targetElement.classList.add('empty-list');
    return;
  }
  targetElement.classList.remove('empty-list');

  if (!canViewPrivateZone(playerKey)) {
    const remainingCount = player.itemStates.filter((item) => !item.used).length;
    const usedCount = player.itemStates.length - remainingCount;
    targetElement.appendChild(createHiddenPrivateRow('相手のアイテム', `残り ${remainingCount} 枚 / 使用済み ${usedCount} 枚`));
    return;
  }

  const currentPlayersTurn = matchState.active && matchState.phase === 'battle' && matchState.currentPlayer === playerKey;
  const canUseItemsNow = currentPlayersTurn && isItemWindowOpen() && !matchState.turnState.itemUsed;
  const compactMode = !canUseItemsNow;
  const summaryMode = canUseItemsNow;
  const selectedItemCardId = getSelectedItemCardId();
  const decisionFocusActive = canUseItemsNow && !selectedItemCardId && hasItemDecisionFocus();

  targetElement.classList.toggle('item-phase-decision-list', decisionFocusActive);

  for (const itemState of player.itemStates) {
    const card = cardMap.get(itemState.cardId);
    const row = document.createElement('div');
    row.className = `side-card-item ${summaryMode ? 'compact-item-row item-name-only-row' : 'with-image'} ${compactMode ? 'compact-item-row' : ''}`.trim();
    if (selectedItemCardId === itemState.cardId) row.classList.add('selected-side-card');
    if (decisionFocusActive && !itemState.used) row.classList.add('item-phase-choice-card');

    const info = document.createElement('div');
    info.className = `side-card-info ${(compactMode || summaryMode) ? 'compact-item-info' : ''}`.trim();
    if (!summaryMode) {
      info.appendChild(createMiniImage(getCardImagePath(card), card.card_name));
    }
    info.appendChild(createMiniCardMeta(card, '効果なし', compactMode || summaryMode));
    row.appendChild(info);

    if (itemState.used) {
      row.classList.add('used-item-row');
      const usedBadge = document.createElement('div');
      usedBadge.className = 'used-item-badge';
      usedBadge.textContent = '使用済み';
      row.appendChild(usedBadge);
    } else if (!compactMode && !summaryMode) {
      const button = document.createElement('button');
      button.className = `button secondary small ${decisionFocusActive ? 'item-phase-choice-button' : ''}`.trim();
      button.textContent = selectedItemCardId === itemState.cardId ? '選択中' : '使う';
      button.addEventListener('click', () => {
        if (itemState.used || !canUseItemsNow) return;
        selectItemForUse(itemState.cardId);
      });
      row.appendChild(button);
    }

    targetElement.appendChild(row);
  }
}

function renderReserve(playerKey, targetElement) {
  const player = getPlayerState(playerKey);
  targetElement.innerHTML = '';
  if (!player.reserveBattleIds.length) {
    targetElement.classList.add('empty-list');
    return;
  }
  targetElement.classList.remove('empty-list');

  if (!canViewPrivateZone(playerKey)) {
    targetElement.appendChild(createHiddenPrivateRow('相手の配置待ちカード', `${player.reserveBattleIds.length} 枚`));
    return;
  }

  const roomPlayerKey = getRoomPlayerKey();
  const isCurrentSetupPlayer = matchState.phase === 'setup' && getCurrentSetupStep()?.player === playerKey && (!roomSyncState.enabled || roomPlayerKey === playerKey);

  for (const cardId of player.reserveBattleIds) {
    const card = cardMap.get(cardId);
    const row = document.createElement('div');
    row.className = `side-card-item ${matchState.selectedReserveCardId === cardId ? 'selected-side-card' : ''} ${isCurrentSetupPlayer ? 'setup-choice-card' : ''}`.trim();
    row.innerHTML = `
      <div>
        <div class="side-card-title">${card.card_name}</div>
        <div class="side-card-meta">ATK ${card.atk} / HP ${card.hp} / MOVE ${card.move}</div>
      </div>
    `;
    const button = document.createElement('button');
    button.className = 'button secondary small';
    button.textContent = roomSyncState.pendingSetupRequest && matchState.selectedReserveCardId === cardId ? '送信中' : (matchState.selectedReserveCardId === cardId ? '選択中' : (isCurrentSetupPlayer ? 'ここを押す' : '待機中'));
    button.disabled = !isCurrentSetupPlayer || roomSyncState.pendingSetupRequest;
    button.addEventListener('click', () => {
      matchState.selectedReserveCardId = cardId;
      matchState.selectedUnitId = null;
      matchState.actionMode = null;
      renderMatchArea();
    });
    row.appendChild(button);
    targetElement.appendChild(row);
  }
}

function renderPlayerPanels() {
  const p1 = getPlayerState('player1');
  const p2 = getPlayerState('player2');
  player1Summary.textContent = p1.deckName ? `${p1.deckName} / 撃破 ${p1.defeated} / 残り ${getLivingUnits('player1').length}体` : 'デッキ未選択';
  player2Summary.textContent = p2.deckName ? `${p2.deckName} / 撃破 ${p2.defeated} / 残り ${getLivingUnits('player2').length}体` : 'デッキ未選択';

  const p1Field = cardMap.get(p1.fieldId);
  const p2Field = cardMap.get(p2.fieldId);

  player1FieldCard.innerHTML = '';
  if (p1Field) {
    player1FieldCard.classList.add('field-card-rich');
    player1FieldCard.appendChild(createMiniImage(getCardImagePath(p1Field), p1Field.card_name, 'field-mini-image'));
    player1FieldCard.appendChild(createMiniCardMeta(p1Field));
  } else {
    player1FieldCard.classList.remove('field-card-rich');
    player1FieldCard.textContent = '-';
  }

  player2FieldCard.innerHTML = '';
  if (p2Field) {
    player2FieldCard.classList.add('field-card-rich');
    player2FieldCard.appendChild(createMiniImage(getCardImagePath(p2Field), p2Field.card_name, 'field-mini-image'));
    player2FieldCard.appendChild(createMiniCardMeta(p2Field));
  } else {
    player2FieldCard.classList.remove('field-card-rich');
    player2FieldCard.textContent = '-';
  }

  player1FieldLogButton.disabled = !matchState.active || !p1.fieldId;
  player2FieldLogButton.disabled = !matchState.active || !p2.fieldId;
  player1FieldCard.classList.toggle('field-popup-enabled', !!p1Field);
  player2FieldCard.classList.toggle('field-popup-enabled', !!p2Field);
  if (player1FieldCard) {
    player1FieldCard.title = p1Field ? 'クリックで環境カードを大きく表示' : '';
    player1FieldCard.setAttribute('role', p1Field ? 'button' : 'presentation');
    player1FieldCard.tabIndex = p1Field ? 0 : -1;
  }
  if (player2FieldCard) {
    player2FieldCard.title = p2Field ? 'クリックで環境カードを大きく表示' : '';
    player2FieldCard.setAttribute('role', p2Field ? 'button' : 'presentation');
    player2FieldCard.tabIndex = p2Field ? 0 : -1;
  }

  [player1ReserveSlot, player2ReserveSlot, player1Box, player2Box].forEach((node) => node?.classList.remove('setup-focus-slot', 'setup-focus-player'));
  if (matchState.phase === 'setup') {
    const step = getCurrentSetupStep();
    const focusReserve = step?.player === 'player1' ? player1ReserveSlot : player2ReserveSlot;
    const focusBox = step?.player === 'player1' ? player1Box : player2Box;
    focusReserve?.classList.add('setup-focus-slot');
    focusBox?.classList.add('setup-focus-player');
  }

  renderItems('player1', player1Items);
  renderItems('player2', player2Items);
  renderReserve('player1', player1Reserve);
  renderReserve('player2', player2Reserve);
}

function renderBoard() {
  injectStatusBadgeStyles();
  const moveTargets = matchState.actionMode === 'move' && matchState.selectedUnitId ? getReachableMoveCells(matchState.selectedUnitId) : [];
  const attackTargets = matchState.actionMode === 'attack' && matchState.selectedUnitId ? getAttackTargets(matchState.selectedUnitId) : [];
  const postAttackMoveTargets = getPostAttackMoveUnitId() ? getPostAttackMoveCells(getPostAttackMoveUnitId()) : [];
  const placeableCells = matchState.phase === 'setup' ? getPlaceableCellsForCurrentStep() : [];
  const redeployCells = getRedeployableCells(matchState.currentPlayer);
  const pendingAction = getPendingAction();
  const selectedItemCard = getSelectedItemCard();
  const itemTargetMode = getItemTargetMode(selectedItemCard);
  const itemTargets = selectedItemCard ? getItemSelectableTargets(selectedItemCard, matchState.currentPlayer) : [];
  const selectedItemTargetIndex = getSelectedItemTargetIndex();

  boardGrid.classList.toggle('setup-board-active', matchState.phase === 'setup');
  boardGrid.innerHTML = '';
  clearMatchFinishOverlayState();

  for (let index = 0; index < 25; index += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'board-cell';
    cell.dataset.boardIndex = String(index);
    if (isPointZone(index)) cell.classList.add('point-zone');
    if (placeableCells.includes(index) || redeployCells.includes(index)) cell.classList.add('placeable');
    if (moveTargets.includes(index) || postAttackMoveTargets.includes(index)) cell.classList.add('move-target');
    if (attackTargets.includes(index)) cell.classList.add('attack-target');
    if (pendingAction && pendingAction.targetIndex === index) cell.classList.add('pending-target');
    if (itemTargets.includes(index)) {
      const targetClass = itemTargetMode === 'ally'
        ? 'item-target-ally'
        : itemTargetMode === 'enemy'
          ? 'item-target-enemy'
          : 'item-target-any';
      cell.classList.add(targetClass);
    }
    if (selectedItemTargetIndex === index) cell.classList.add('pending-target');

    const unit = matchState.board[index];
    const selectedUnit = getSelectedUnit();
    if (unit) {
      cell.classList.add(unit.owner === 'player1' ? 'unit-p1' : 'unit-p2');
      if (matchState.phase === 'battle') {
        if (unit.owner === matchState.currentPlayer) {
          cell.classList.add('current-turn-unit');
        } else if (matchState.actionMode !== 'attack' && itemTargetMode !== 'enemy') {
          cell.classList.add('enemy-dim');
        }
      }
    }
    if (selectedUnit && unit && selectedUnit.instanceId === unit.instanceId) {
      cell.classList.add('selected-cell');
    }

    const { row, col } = indexToCoord(index);
    const coord = document.createElement('div');
    coord.className = 'cell-coord';
    coord.textContent = `${row + 1}-${col + 1}`;
    cell.appendChild(coord);

    if (unit) {
      const unitCardMeta = cardMap.get(unit.cardId);
      const badge = document.createElement('div');
      badge.className = `unit-owner-badge ${unit.owner === 'player1' ? 'p1' : 'p2'}`;
      badge.textContent = unit.owner === 'player1' ? '1' : '2';
      cell.appendChild(badge);

      const statusBadges = getUnitStatusBadges(unit, index);
      if (statusBadges.length) {
        const statusStack = document.createElement('div');
        statusStack.className = 'unit-status-stack';
        statusBadges.forEach((badgeInfo) => {
          const badge = document.createElement('div');
          badge.className = `unit-status-badge ${badgeInfo.kind}`;
          if (badgeInfo.title) badge.title = badgeInfo.title;

          const icon = document.createElement('span');
          icon.className = 'status-icon';
          icon.textContent = getStatusBadgeIcon(badgeInfo.kind);
          badge.appendChild(icon);

          if (badgeInfo.value) {
            const value = document.createElement('span');
            value.className = 'status-value';
            value.textContent = badgeInfo.value;
            badge.appendChild(value);
          }
          statusStack.appendChild(badge);
        });
        cell.appendChild(statusStack);
      }

      const visual = document.createElement('div');
      visual.className = `unit-card-visual ${unit.owner === 'player1' ? 'p1' : 'p2'}`;
      const hoverEffectText = String(unitCardMeta?.effect_text || '効果なし').trim() || '効果なし';
      visual.title = `${unit.name}
${hoverEffectText}`;
      const abilityBadges = getUnitAbilityBadges(unit);
      visual.innerHTML = `
        <img class="board-card-image" src="${getCardImagePath(unitCardMeta)}" alt="${unit.name}" loading="lazy" />
        <div class="board-card-overlay top">
          <div class="unit-name">${unit.name}</div>
        </div>
        <div class="board-card-overlay bottom">
          <span class="stat-chip stat-atk">ATK ${getEffectiveAtk(unit, index)}</span>
          <span class="stat-chip stat-hp ${getHpClass(unit.currentHp, unit.maxHp)}">HP ${unit.currentHp}/${unit.maxHp}</span>
          <span class="stat-chip stat-mv">MV ${getEffectiveMove(unit, index)}</span>
        </div>
      `;
      if (abilityBadges.length) {
        const abilityStack = document.createElement('div');
        abilityStack.className = 'unit-ability-stack';
        abilityBadges.forEach((badgeInfo) => {
          const badge = document.createElement('div');
          badge.className = `unit-ability-badge ${badgeInfo.kind}`;
          badge.textContent = badgeInfo.label;
          badge.title = badgeInfo.title || hoverEffectText;
          abilityStack.appendChild(badge);
        });
        visual.appendChild(abilityStack);
      }
      cell.appendChild(visual);
    }

    cell.addEventListener('click', () => handleBoardCellClick(index));
    boardGrid.appendChild(cell);
  }

  if (isFinishShowcaseReady()) {
    renderMatchFinishOverlay();
  }
}


function renderItemConfirmBox() {
  const itemWindowOpen = matchState.phase === 'battle' && isItemWindowOpen();
  const selectedItemCard = getSelectedItemCard();
  actionPanels.forEach((panel) => {
    if (!panel.itemConfirmBox || !panel.itemConfirmTitle || !panel.itemConfirmText) return;
    if (!itemWindowOpen) {
      panel.itemConfirmBox.classList.add('hidden');
      return;
    }

    panel.itemConfirmBox.classList.remove('hidden');
    if (selectedItemCard) {
      const targetMode = getItemTargetMode(selectedItemCard);
      const targetUnit = getSelectedItemTargetUnit();
      panel.itemConfirmTitle.textContent = `選択中アイテム: ${selectedItemCard.card_name}`;
      if (targetMode === 'none') {
        panel.itemConfirmText.textContent = selectedItemCard.effect_text || '効果なし';
      } else if (targetUnit) {
        panel.itemConfirmText.textContent = `${selectedItemCard.effect_text || '効果なし'} / 対象: ${targetUnit.name}`;
      } else {
        panel.itemConfirmText.textContent = `${selectedItemCard.effect_text || '効果なし'} / 盤面から対象を選んでください`;
      }
    } else {
      panel.itemConfirmTitle.textContent = 'アイテムを1枚選んでください';
      panel.itemConfirmText.textContent = '左右の手札から1枚選ぶと、ここに確認ボタンが出ます。誤操作した時はキャンセルできます。';
    }
  });
}

function renderActionConfirmBox() {
  const pendingAction = getPendingAction();
  actionPanels.forEach((panel) => {
    if (!panel.actionConfirmBox || !panel.actionConfirmTitle || !panel.actionConfirmText) return;
    if (!pendingAction || matchState.phase !== 'battle') {
      panel.actionConfirmBox.classList.add('hidden');
      return;
    }

    panel.actionConfirmBox.classList.remove('hidden');
    if (pendingAction.type === 'move' || pendingAction.type === 'postAttackMove') {
      panel.actionConfirmTitle.textContent = `移動確認: ${pendingAction.unitName}`;
      panel.actionConfirmText.textContent = `${pendingAction.fromLabel} から ${pendingAction.toLabel} へ移動します。よければ確定してください。`;
    } else {
      panel.actionConfirmTitle.textContent = `攻撃確認: ${pendingAction.unitName}`;
      panel.actionConfirmText.textContent = pendingAction.previewText || `${pendingAction.targetName} に ${pendingAction.damage} ダメージで攻撃します${pendingAction.bonusText ? `（${pendingAction.bonusText}）` : ''}。よければ確定してください。`;
    }
  });
}

function cancelPendingBoardAction() {
  clearPendingAction();
  renderMatchArea();
}

function renderMatchMeta() {
  if (!matchState.active) {
    matchStatus.textContent = '未開始';
    turnInfo.textContent = '-';
    setPhaseInfoText('保存済みデッキを2つ選んで「テスト対戦を開始」を押してください');
    player1Defeats.textContent = '0';
    player2Defeats.textContent = '0';
    player1Points.textContent = '0';
    player2Points.textContent = '0';
    itemPhaseDoneButton.disabled = true;
    moveModeButton.disabled = true;
    attackModeButton.disabled = true;
    endTurnButton.disabled = true;
    clearSelectionButton.disabled = true;
    moveModeButton.classList.remove('active-mode');
    attackModeButton.classList.remove('active-mode');
    updateSelectionInfo();
    return;
  }

  player1Defeats.textContent = String(getPlayerState('player1').defeated);
  player2Defeats.textContent = String(getPlayerState('player2').defeated);
  player1Points.textContent = String(calculatePoints('player1'));
  player2Points.textContent = String(calculatePoints('player2'));

  const activeLabel = PLAYER_LABEL[matchState.currentPlayer];
  turnInfo.textContent = `Round ${matchState.round} / ${activeLabel}`;

  if (matchState.phase === 'setup') {
    const step = getCurrentSetupStep();
    const remaining = step ? step.count - matchState.placedInCurrentStep : 0;
    const sideText = step?.player === 'player1' ? '左側の' : '右側の';
    matchStatus.textContent = '配置フェーズ';
    setPhaseInfoText(`${PLAYER_LABEL[step.player]} の配置です。① ${sideText}「配置待ちバトルカード」から1枚選ぶ ② 盤面の金色に光るマスへ置く（あと ${remaining} 枚）`);
  } else if (matchState.phase === 'battle') {
    matchStatus.textContent = '対戦中';
    const pendingAction = getPendingAction();
    if (pendingAction) {
      setPhaseInfoText((pendingAction.type === 'move' || pendingAction.type === 'postAttackMove')
        ? `${activeLabel} の移動確認です。「${pendingAction.unitName}」を ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ移動しますか？`
        : `${activeLabel} の攻撃確認です。「${pendingAction.unitName}」で「${pendingAction.targetName}」を攻撃しますか？`);
    } else if (getPendingRedeployCard()) {
      const redeployCard = getPendingRedeployCard();
      setPhaseInfoText(`${activeLabel} の再配置です。「${redeployCard.card_name}」を自陣の縦1列の空きマスへ置いてください。再配置後に通常の手番へ進みます。`);
    } else if (isItemWindowOpen()) {
      const selectedItem = getSelectedItemCard();
      if (selectedItem) {
        const targetMode = getItemTargetMode(selectedItem);
        const targetUnit = getSelectedItemTargetUnit();
        if (targetMode === 'none') {
          setPhaseInfoText(`${activeLabel} のアイテムフェーズです。「${selectedItem.card_name}」を使うか、キャンセルしてください。1手番で使えるアイテムは1枚までです。`);
        } else if (targetUnit) {
          setPhaseInfoText(`${activeLabel} のアイテムフェーズです。「${selectedItem.card_name}」の対象に ${targetUnit.name} を選択中です。確認して使用してください。`);
        } else {
          setPhaseInfoText(`${activeLabel} のアイテムフェーズです。「${selectedItem.card_name}」の対象を盤面から1体選んでください。`);
        }
      } else {
        setPhaseInfoText(`${activeLabel} の手番です。まずアイテムを1枚選ぶか、「アイテムを使わず次へ」を押してください。`);
      }
    } else if (getPostAttackMoveUnit()) {
      const postAttackMoveUnit = getPostAttackMoveUnit();
      setPhaseInfoText(`${activeLabel} の追加処理です。「${postAttackMoveUnit.name}」は攻撃後に1マス移動できます。盤面の光ったマスを選ぶか、「手番終了」で移動せずに終えてください。`);
    } else {
      const hasAccel = matchState.turnState.acceleratedUnitId && matchState.turnState.acceleratedMovesRemaining > 0;
      const accelLabel = hasAccel ? getExtraMoveSourceName(matchState.turnState.acceleratedUnitId) : '加速術';
      const moveText = hasAccel ? `移動可能（${accelLabel}: 残り${matchState.turnState.acceleratedMovesRemaining}回）` : (matchState.turnState.moved ? '移動済み' : '移動可能');
      const currentFieldCheckUnit = getCurrentUnitForFieldRestrictionCheck();
      let attackText = '攻撃可能';
      if (currentPlayerCannotAttackAfterMove(currentFieldCheckUnit)) {
        attackText = '暴風域により移動後は攻撃不可';
      } else if (matchState.turnState.attackUnitId) {
        const attackIndex = findUnitIndexById(matchState.turnState.attackUnitId);
        const attackUnit = attackIndex >= 0 ? matchState.board[attackIndex] : null;
        if (attackUnit && unitHasEffectType(attackUnit, 'double_attack') && Number(matchState.turnState.attackCount || 0) < getAttackLimitForUnit(attackUnit)) {
          attackText = `${attackUnit.name} はあと ${getAttackLimitForUnit(attackUnit) - Number(matchState.turnState.attackCount || 0)} 回攻撃可能`;
        } else {
          attackText = '攻撃済み';
        }
      } else if (matchState.turnState.attacked) {
        attackText = '攻撃済み';
      }
      setPhaseInfoText(`${activeLabel} の手番です。${moveText} / ${attackText}。移動先や攻撃先を選んだら確認して確定します。`);
    }
  } else if (matchState.phase === 'finished') {
    matchStatus.textContent = '対戦終了';
    setPhaseInfoText(roomSyncState.enabled ? `${matchState.winner || '対戦が終了しました'} / 試合操作の「再戦 / リセット / ルーム終了」から続行できます。` : (matchState.winner || '対戦が終了しました'));
  }

  const battleActive = matchState.phase === 'battle';
  const itemWindowOpen = battleActive && isItemWindowOpen();
  const pendingRedeployActive = battleActive && !!getPendingRedeployCard();
  const selectedItemCard = getSelectedItemCard();
  const itemSelected = !!selectedItemCard;
  const itemCanConfirm = !!(selectedItemCard && canConfirmSelectedItem(selectedItemCard));
  const pendingAction = getPendingAction();
  const postAttackMoveActive = !!getPostAttackMoveUnit();
  const roomBattleLocked = isRoomBattleLocked();
  const roomMovePending = roomSyncState.enabled && roomSyncState.pendingMoveRequest;
  const roomAttackPending = roomSyncState.enabled && roomSyncState.pendingAttackRequest;
  const roomItemPending = roomSyncState.enabled && (roomSyncState.pendingItemUseRequest || roomSyncState.pendingFinishItemPhaseRequest || roomSyncState.pendingEndTurnRequest);
  const roomActionPending = roomMovePending || roomAttackPending || roomItemPending;
  const currentFieldCheckUnit = getCurrentUnitForFieldRestrictionCheck();
  syncActionButtonsState({
    itemPhaseDoneDisabled: roomBattleLocked || roomActionPending || !itemWindowOpen || itemSelected || !!pendingAction,
    moveDisabled: roomBattleLocked || roomActionPending || !battleActive || itemWindowOpen || pendingRedeployActive || !!pendingAction || postAttackMoveActive,
    attackDisabled: roomBattleLocked || roomActionPending || !battleActive || itemWindowOpen || pendingRedeployActive || !!pendingAction || postAttackMoveActive || currentPlayerCannotAttackAfterMove(currentFieldCheckUnit),
    endTurnDisabled: roomBattleLocked || roomActionPending || !battleActive || itemWindowOpen || pendingRedeployActive || !!pendingAction,
    clearDisabled: !matchState.active,
    confirmItemDisabled: roomBattleLocked || roomActionPending || !itemWindowOpen || !itemCanConfirm,
    cancelItemDisabled: roomBattleLocked || roomActionPending || !itemWindowOpen || !itemSelected,
    confirmActionDisabled: roomBattleLocked || roomActionPending || !pendingAction,
    cancelActionDisabled: roomBattleLocked || roomActionPending || !pendingAction,
    moveActive: !roomBattleLocked && !itemWindowOpen && !pendingRedeployActive && !pendingAction && !postAttackMoveActive && matchState.actionMode === 'move',
    attackActive: !roomBattleLocked && !itemWindowOpen && !pendingRedeployActive && !pendingAction && !postAttackMoveActive && matchState.actionMode === 'attack',
  });
  updateSelectionInfo();
}

function updateItemDecisionFocus() {
  const decisionFocusActive = hasItemDecisionFocus();
  const pickerEligiblePlayer = getItemPickerPlayerKey();
  if (!pickerEligiblePlayer) itemPickerOpen = false;
  document.body.classList.toggle('rv-item-decision-active', decisionFocusActive && !itemPickerOpen);
  document.body.classList.toggle('rv-item-picker-open', !!(pickerEligiblePlayer && itemPickerOpen));

  const activePlayer = decisionFocusActive ? matchState.currentPlayer : null;
  const slotMap = [
    { player: 'player1', slot: player1ItemSlot, panel: actionPanelLeft, button: itemPhaseDoneButton, launcher: itemPickerLaunchers.get('player1') },
    { player: 'player2', slot: player2ItemSlot, panel: actionPanelRight, button: itemPhaseDoneButtonRightMirror || itemPhaseDoneButtonRight, launcher: itemPickerLaunchers.get('player2') },
  ];

  slotMap.forEach(({ player, slot, panel, button, launcher }) => {
    const isActive = decisionFocusActive && activePlayer === player;
    if (slot) slot.dataset.itemPickerActive = isActive ? '1' : '0';
    slot?.classList.toggle('item-slot-decision-focus', isActive && !itemPickerOpen);
    panel?.classList.toggle('item-phase-decision-panel', isActive && !itemPickerOpen);
    button?.classList.toggle('item-phase-skip-highlight', isActive && !itemPickerOpen);
    if (launcher) launcher.style.display = isActive && !itemPickerOpen ? 'inline-flex' : 'none';
  });
}

function renderMatchArea() {
  const shouldAnimateCombatFx = matchState.phase === 'battle' || matchState.phase === 'finished';
  const nextBoardSnapshot = shouldAnimateCombatFx ? captureBoardVisualSnapshot() : null;
  const nextTurnSnapshot = shouldAnimateCombatFx ? captureTurnVisualSnapshot() : null;

  renderMatchMeta();
  renderPlayerPanels();
  updateItemDecisionFocus();
  renderItemPickerModal();
  renderBoard();
  renderBattleLog();
  renderItemConfirmBox();
  renderActionConfirmBox();
  updateActionGuide();
  updateSpectatorHud();

  if (shouldAnimateCombatFx && combatFxBoardSnapshot && combatFxTurnSnapshot) {
    if (combatFxSkipNextSnapshotDiff) {
      combatFxSkipNextSnapshotDiff = false;
    } else {
      applyCombatFxFromSnapshots(combatFxBoardSnapshot, nextBoardSnapshot, combatFxTurnSnapshot, nextTurnSnapshot);
    }
  }
  combatFxBoardSnapshot = nextBoardSnapshot;
  combatFxTurnSnapshot = nextTurnSnapshot;
  syncBgmPlayback();
}

function beginTurn(playerKey) {
  matchState.currentPlayer = playerKey;
  clearRoomPendingRequests();
  clearExpiredStartOfTurnEffects(playerKey);
  matchState.turnState = { moved: false, movedUnitId: null, attacked: false, attackCount: 0, attackUnitId: null, itemWindowOpen: true, itemUsed: false, selectedItemCardId: null, selectedItemTargetIndex: null, pendingAction: null, acceleratedUnitId: null, acceleratedMovesRemaining: 0, royalCommandUnitId: null, royalCommandAttackReady: false, postAttackMoveUnitId: null, pendingRedeployCardId: null, pendingRedeployOwner: null };
  revivePendingUnitsForPlayer(playerKey);
  applyFieldStartOfTurnEffects(playerKey);
  refreshTurnStatusForPlayer(playerKey);
  preparePendingRedeployForPlayer(playerKey);
  matchState.selectedUnitId = null;
  matchState.selectedReserveCardId = null;
  matchState.actionMode = null;
}

function finishMatch(message) {
  matchState.phase = 'finished';
  matchState.active = true;
  matchState.winner = message;
  if (lastFinishedSfxMessage !== message) {
    playSfx(getFinishSfxKind(message));
    lastFinishedSfxMessage = message;
  }
  addLog(message);
  const showcaseDelay = Math.max(720, getCombatFxHoldMsRemaining() + 180);
  scheduleFinishShowcase(showcaseDelay);
  renderMatchArea();
}

function checkWinByElimination() {
  const p1Alive = getLivingUnits('player1').length;
  const p2Alive = getLivingUnits('player2').length;
  const p1Active = p1Alive > 0 || getPendingRedeploysForPlayer('player1').length > 0;
  const p2Active = p2Alive > 0 || getPendingRedeploysForPlayer('player2').length > 0;
  if (!p1Active && !p2Active) {
    finishMatch('両者全滅により引き分けです');
    return true;
  }
  if (!p1Active) {
    finishMatch('プレイヤー2の全滅勝ちです');
    return true;
  }
  if (!p2Active) {
    finishMatch('プレイヤー1の全滅勝ちです');
    return true;
  }
  return false;
}

function finishByPoints() {
  const p1 = calculatePoints('player1');
  const p2 = calculatePoints('player2');
  if (p1 > p2) {
    finishMatch(`10ラウンド終了。プレイヤー1のポイント勝ちです（${p1} - ${p2}）`);
  } else if (p2 > p1) {
    finishMatch(`10ラウンド終了。プレイヤー2のポイント勝ちです（${p2} - ${p1}）`);
  } else {
    finishMatch(`10ラウンド終了。引き分けです（${p1} - ${p2}）`);
  }
}

function finishItemPhaseLocal() {
  if (matchState.phase !== 'battle' || !isItemWindowOpen()) return false;
  closeItemWindow();
  playSfx('confirm');
  addLog(`${PLAYER_LABEL[matchState.currentPlayer]} はアイテム使用を終了しました`);
  renderMatchArea();
  return true;
}

function finishItemPhase() {
  if (matchState.phase !== 'battle' || !isItemWindowOpen()) return;
  if (roomSyncState.enabled && isRoomActiveBattlePlayer() && typeof roomSyncState.onFinishItemPhaseRequest === 'function') {
    roomSyncState.pendingFinishItemPhaseRequest = true;
    renderMatchArea();
    roomSyncState.onFinishItemPhaseRequest({ player: matchState.currentPlayer });
    return;
  }
  finishItemPhaseLocal();
}

function endTurnLocal() {
  if (matchState.phase !== 'battle') return false;
  playSfx('confirm');
  clearPostAttackMoveOpportunity();
  const nextPlayer = getOpponent(matchState.currentPlayer);
  const previousPlayer = matchState.currentPlayer;
  clearTemporaryEffects(previousPlayer);
  if (previousPlayer === 'player2') {
    if (applyRoundEndFieldEffects()) {
      return true;
    }
    matchState.round += 1;
    if (matchState.round > 10) {
      finishByPoints();
      return true;
    }
  }
  beginTurn(nextPlayer);
  addLog(`${PLAYER_LABEL[nextPlayer]} の手番になりました`);
  renderMatchArea();
  return true;
}

function endTurn() {
  if (matchState.phase !== 'battle') return;
  if (roomSyncState.enabled && isRoomActiveBattlePlayer() && typeof roomSyncState.onEndTurnRequest === 'function') {
    roomSyncState.pendingEndTurnRequest = true;
    renderMatchArea();
    roomSyncState.onEndTurnRequest({ player: matchState.currentPlayer });
    return;
  }
  endTurnLocal();
}

function placeSelectedReserveCard(targetIndex) {
  const step = getCurrentSetupStep();
  if (!step || step.player !== matchState.currentPlayer) return;
  if (!matchState.selectedReserveCardId) {
    window.alert('先に配置するバトルカードを選んでください。');
    return;
  }
  if (!getPlaceableCellsForCurrentStep().includes(targetIndex)) return;

  const player = getPlayerState(step.player);
  const cardId = matchState.selectedReserveCardId;
  matchState.board[targetIndex] = createUnitInstance(cardId, step.player);
  player.reserveBattleIds = player.reserveBattleIds.filter((id) => id !== cardId);
  matchState.selectedReserveCardId = null;
  matchState.placedInCurrentStep += 1;
  const placedCard = cardMap.get(cardId);
  addLog(`${PLAYER_LABEL[step.player]} が ${(placedCard && placedCard.card_name) || cardId} を配置しました`);
  playSfx('deploy');

  const placedUnit = matchState.board[targetIndex];
  const placedSignature = getCardSignatureProfile(placedUnit?.cardId, 'spawn');
  if (placedSignature) {
    holdCombatFxFor(Math.max(760, Number(placedSignature.holdMs || placedSignature.duration || 820)));
  }

  if (matchState.placedInCurrentStep >= step.count) {
    matchState.setupStepIndex += 1;
    matchState.placedInCurrentStep = 0;
    const nextStep = getCurrentSetupStep();
    if (nextStep) {
      matchState.currentPlayer = nextStep.player;
      addLog(`${PLAYER_LABEL[nextStep.player]} の配置フェーズです`);
    } else {
      matchState.phase = 'battle';
      beginTurn('player1');
      addLog('配置完了。プレイヤー1から対戦開始です');
    }
  }

  renderMatchArea();
  if (placedSignature) {
    scheduleCardSignatureFx(targetIndex, placedSignature, 40);
  }
}

function moveSelectedUnit(targetIndex) {
  if (matchState.phase !== 'battle' || !matchState.selectedUnitId) return;
  const sourceIndex = findUnitIndexById(matchState.selectedUnitId);
  if (sourceIndex < 0) return;
  if (!getReachableMoveCells(matchState.selectedUnitId).includes(targetIndex)) return;

  const unit = matchState.board[sourceIndex];
  const targetUnit = matchState.board[targetIndex];
  const isSwap = !!(targetUnit
    && targetUnit.owner === unit.owner
    && targetUnit.instanceId !== unit.instanceId
    && unitHasEffectType(unit, 'swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap', sourceIndex)
    && getOrthogonalNeighbors(sourceIndex).includes(targetIndex));
  setPendingAction({
    type: 'move',
    unitId: unit.instanceId,
    unitName: unit.name,
    sourceIndex,
    targetIndex,
    isSwap,
    swapTargetUnitId: isSwap ? targetUnit.instanceId : '',
    fromLabel: formatCellLabel(sourceIndex),
    toLabel: formatCellLabel(targetIndex),
  });
  renderMatchArea();
}

function applyPendingMove(pendingAction) {
  const sourceIndex = findUnitIndexById(pendingAction.unitId);
  if (sourceIndex < 0) return;
  const unit = matchState.board[sourceIndex];
  if (!unit) return;
  const targetUnit = matchState.board[pendingAction.targetIndex];
  const isSwap = !!(pendingAction.isSwap && targetUnit && targetUnit.owner === unit.owner && targetUnit.instanceId !== unit.instanceId);
  if (isSwap) {
    matchState.board[sourceIndex] = targetUnit;
    matchState.board[pendingAction.targetIndex] = unit;
  } else {
    matchState.board[pendingAction.targetIndex] = unit;
    matchState.board[sourceIndex] = null;
  }

  const acceleratedThisTurn = matchState.turnState?.acceleratedUnitId === unit.instanceId && matchState.turnState.acceleratedMovesRemaining > 0;
  const extraMoveSourceName = getExtraMoveSourceName(unit.instanceId);
  matchState.turnState.movedUnitId = unit.instanceId;
  if (acceleratedThisTurn) {
    matchState.turnState.acceleratedMovesRemaining -= 1;
    if (matchState.turnState.royalCommandUnitId === unit.instanceId && !matchState.turnState.royalCommandAttackReady) {
      matchState.turnState.royalCommandAttackReady = true;
      addLog(`${unit.name} は王冠の勅命により、移動後の最初の攻撃が +1 されます`);
    }
    if (matchState.turnState.acceleratedMovesRemaining <= 0) {
      matchState.turnState.acceleratedMovesRemaining = 0;
      matchState.turnState.acceleratedUnitId = null;
      matchState.turnState.moved = true;
      addLog(`${unit.name} の${extraMoveSourceName}による追加移動を使い切りました`);
    } else {
      matchState.turnState.moved = false;
      addLog(`${unit.name} は${extraMoveSourceName}により、あと ${matchState.turnState.acceleratedMovesRemaining} 回移動できます`);
    }
  } else {
    matchState.turnState.moved = true;
  }

  if (isSwap && unitHasEffectType(unit, 'swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap', pendingAction.targetIndex)) {
    const cleanseTarget = chooseAdjacentAllyForSwapCleanse(pendingAction.targetIndex, unit.owner, unit.instanceId);
    if (cleanseTarget?.unit) {
      const clearedKind = clearOneCleansableStatus(cleanseTarget.unit);
      if (clearedKind) {
        addLog(`${unit.name} は天輝の細剣の効果で ${cleanseTarget.unit.name} の ${getCleanseStatusLabel(clearedKind)} を解除しました`);
      }
    }
  }

  matchState.actionMode = null;
  clearPendingAction();
  addLog(`${PLAYER_LABEL[unit.owner]} の ${unit.name} が ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ${isSwap ? '位置を入れ替えました' : '移動しました'}`);
  playSfx('move');
  if (isGlobalFieldEffectActive('field_no_attack_after_move')) {
    addLog('環境カード「暴風域」により、移動したユニットはこの手番に攻撃できません');
  }
  const moveSignature = getCardSignatureProfile(unit.cardId, 'move');
  if (moveSignature) {
    holdCombatFxFor(Math.max(720, Number(moveSignature.holdMs || moveSignature.duration || 820)));
  }
  renderMatchArea();
  if (moveSignature) {
    scheduleCardSignatureFx(pendingAction.targetIndex, moveSignature, 40);
  }
}

function moveAfterAttackWithSelectedUnit(targetIndex) {
  const unitId = getPostAttackMoveUnitId();
  if (!unitId) return;
  const sourceIndex = findUnitIndexById(unitId);
  if (sourceIndex < 0) return;
  const unit = matchState.board[sourceIndex];
  if (!unit) {
    clearPostAttackMoveOpportunity();
    renderMatchArea();
    return;
  }
  const validTargets = getPostAttackMoveCells(unitId);
  if (!validTargets.includes(targetIndex)) return;

  setPendingAction({
    type: 'postAttackMove',
    unitId: unit.instanceId,
    unitName: unit.name,
    sourceIndex,
    targetIndex,
    fromLabel: formatCellLabel(sourceIndex),
    toLabel: formatCellLabel(targetIndex),
  });
  renderMatchArea();
}

function applyPendingPostAttackMove(pendingAction) {
  const sourceIndex = findUnitIndexById(pendingAction.unitId);
  if (sourceIndex < 0) {
    clearPostAttackMoveOpportunity();
    clearPendingAction();
    renderMatchArea();
    endTurn();
    return;
  }
  const unit = matchState.board[sourceIndex];
  if (!unit) {
    clearPostAttackMoveOpportunity();
    clearPendingAction();
    renderMatchArea();
    endTurn();
    return;
  }

  matchState.board[pendingAction.targetIndex] = unit;
  matchState.board[sourceIndex] = null;
  matchState.turnState.movedUnitId = unit.instanceId;
  matchState.turnState.moved = true;
  clearPostAttackMoveOpportunity();
  matchState.actionMode = null;
  matchState.selectedUnitId = null;
  clearPendingAction();
  addLog(`${PLAYER_LABEL[unit.owner]} の ${unit.name} が効果で ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ追加移動しました`);
  playSfx('move');
  const postMoveSignature = getCardSignatureProfile(unit.cardId, 'postmove');
  if (postMoveSignature) {
    holdCombatFxFor(Math.max(760, Number(postMoveSignature.holdMs || postMoveSignature.duration || 860)));
  }
  renderMatchArea();
  if (postMoveSignature) {
    scheduleCardSignatureFx(pendingAction.targetIndex, postMoveSignature, 40);
  }
  endTurn();
}

function attackWithSelectedUnit(targetIndex) {
  if (matchState.phase !== 'battle' || !matchState.selectedUnitId) return;
  const sourceIndex = findUnitIndexById(matchState.selectedUnitId);
  if (sourceIndex < 0) return;
  if (!getAttackTargets(matchState.selectedUnitId).includes(targetIndex)) return;

  const attacker = matchState.board[sourceIndex];
  const defender = matchState.board[targetIndex];
  if (!attacker || !defender) return;

  const pending = {
    type: 'attack',
    unitId: attacker.instanceId,
    unitName: attacker.name,
    sourceIndex,
    targetIndex,
    targetName: defender.name,
    damage: getAttackDamageAgainst(attacker, sourceIndex, defender, targetIndex),
    bonusText: isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-028' && isBackAttack(sourceIndex, targetIndex, defender.owner) ? '背後攻撃 +1' : '',
  };

  if (isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-017') {
    pending.previewText = `${defender.name} を攻撃し、同じ方向の2マス目に敵がいれば追加ダメージを与えます。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'range_2')) {
    const distance = getLineIndicesFromAttack(sourceIndex, targetIndex, 2).indexOf(targetIndex) + 1;
    pending.previewText = distance >= 2
      ? `${defender.name} は2マス先の敵ですが、弓兵の効果で攻撃できます。よければ確定してください。`
      : `${defender.name} を攻撃します。よければ確定してください。`;
  } else if (isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-031') {
    pending.previewText = `${defender.name} を攻撃します。攻撃後、狂戦士は自身に1ダメージを受けます。よければ確定してください。`;
  } else if (isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-033') {
    pending.previewText = `${formatCellLabel(targetIndex)} 方向へ貫通攻撃します。1マス目と2マス目の敵に軽減無視ダメージを与えます。よければ確定してください。`;
  } else if ((isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-034') || unitHasEffectType(attacker, 'splash_adjacent_enemy_1_on_attack')) {
    pending.previewText = `${defender.name} を攻撃し、その対象に隣接する他の敵にも1ダメージを与えます。よければ確定してください。`;
  } else if (isUnitCardEffectActive(attacker) && attacker.cardId === 'RV-040') {
    pending.previewText = `${defender.name} を攻撃し、さらに炎魔剣士の周囲1マスにいる全ユニットへ1ダメージを与えます（敵味方両方）。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'on_kill_permanent_atk_plus_1')) {
    pending.previewText = `${defender.name} を攻撃します。血王 ヴェインが敵を撃破すると、攻撃力が1永続で上昇します。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'on_kill_heal_1_else_atk_plus_1')) {
    pending.previewText = `${defender.name} を攻撃します。真祖血姫 ヴェインが敵を撃破すると、HPを1回復します。すでに最大なら攻撃力が1上昇します。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'gain_hp_1_on_attack_permanent')) {
    pending.previewText = `${defender.name} を攻撃します。攻撃後、魔王騎士の最大HPと現在HPが1ずつ永続で上昇します。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'row_range_attack')) {
    const attackerCoord = indexToCoord(sourceIndex);
    const targetCoord = indexToCoord(targetIndex);
    pending.previewText = attackerCoord.row === targetCoord.row && Math.abs(attackerCoord.col - targetCoord.col) >= 2
      ? `${defender.name} は同じ横一列にいるため、聖弓士の効果で遠距離攻撃できます。よければ確定してください。`
      : `${defender.name} を攻撃します。よければ確定してください。`;
  }

  setPendingAction(pending);
  renderMatchArea();
}

function applyPendingAttack(pendingAction) {
  const sourceIndex = findUnitIndexById(pendingAction.unitId);
  if (sourceIndex < 0) return;
  playSfx('attack');
  const attacker = matchState.board[sourceIndex];
  const defender = matchState.board[pendingAction.targetIndex];
  if (!attacker || !defender || defender.owner === attacker.owner) return;

  const backstabTriggered = isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-028' && isBackAttack(sourceIndex, pendingAction.targetIndex, defender.owner);
  const royalCommandAttackBoost = getRoyalCommandAttackBonus(attacker);
  const markedAttackPrimed = !!attacker.nextAttackAppliesNoHealNoRevive;
  const intrinsicNoHealOnDamage = unitHasEffectType(attacker, 'on_damage_apply_no_heal_until_next_opponent_round_and_no_revive_if_destroyed_plus_atk_1_vs_full_or_healed_enemy');
  const applyNoHealNoReviveUntilTurnStartOf = (markedAttackPrimed || intrinsicNoHealOnDamage) ? attacker.owner : '';
  let markedAttackConsumed = false;
  let defeatedByAttack = 0;
  const attackFxHits = [];
  const specialAttackFxQueue = [];
  let infernoSplashIndices = [];
  let shadowReturnIndex = null;
  const resolveAttackHit = (targetIndex, damage, options = {}) => {
    const attackOptions = { ...options, attackerIndex: sourceIndex };
    if (applyNoHealNoReviveUntilTurnStartOf) attackOptions.applyNoHealNoReviveUntilTurnStartOf = applyNoHealNoReviveUntilTurnStartOf;
    const result = applyAttackDamageToIndex(attacker, targetIndex, damage, attackOptions);
    if (result.damage > 0 && markedAttackPrimed) markedAttackConsumed = true;
    if (result.defeated) defeatedByAttack += 1;
    const resolvedTargetIndex = Number.isInteger(result.resolvedTargetIndex) ? result.resolvedTargetIndex : targetIndex;
    attackFxHits.push({
      index: resolvedTargetIndex,
      damage: Number(result.damage || 0),
      reduced: Number(result.reduced || 0),
      defeated: !!result.defeated,
      blocked: !!result.blocked,
      heavy: !!result.defeated || Number(result.damage || 0) >= 3,
      label: result.blocked ? 'GUARD' : (Number(result.damage || 0) > 0 ? undefined : (result.intercepted ? 'HIT' : 'HIT')),
      visualEntry: result.visualEntry || null,
    });
    if (Number.isInteger(result.counterTargetIndex) && result.counterTargetIndex >= 0 && Number(result.counterDamage || 0) > 0) {
      attackFxHits.push({
        index: result.counterTargetIndex,
        damage: Number(result.counterDamage || 0),
        reduced: Number(result.counterReduced || 0),
        defeated: false,
        blocked: !!result.counterBlocked,
        heavy: false,
        label: result.counterBlocked ? 'GUARD' : undefined,
        visualEntry: null,
      });
    }
    if (result.intercepted) {
      specialAttackFxQueue.push({
        index: resolvedTargetIndex,
        profile: { mark: 'COUNTER', word: 'COUNTER', tone: 'shield', cellClass: 'rv-itemfx-shield', duration: 860 },
        delay: 180,
      });
    }
    return result;
  };

  if (isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-017') {
    const line = getLineIndicesFromAttack(sourceIndex, pendingAction.targetIndex, 2);
    line.forEach((idx) => {
      const target = matchState.board[idx];
      if (!target || target.owner === attacker.owner) return;
      const damage = getAttackDamageAgainst(attacker, sourceIndex, target, idx);
      resolveAttackHit(idx, damage);
    });
  } else if (isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-033') {
    const line = getLineIndicesFromAttack(sourceIndex, pendingAction.targetIndex, 2);
    line.forEach((idx) => {
      const target = matchState.board[idx];
      if (!target || target.owner === attacker.owner) return;
      const damage = getEffectiveAtk(attacker, sourceIndex);
      resolveAttackHit(idx, damage, { ignoreReduction: true });
    });
  } else if ((isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-034') || unitHasEffectType(attacker, 'splash_adjacent_enemy_1_on_attack')) {
    const originalTargetIndex = pendingAction.targetIndex;
    const splashTargets = getOrthogonalNeighbors(originalTargetIndex)
      .filter((idx) => idx !== originalTargetIndex)
      .filter((idx) => matchState.board[idx] && matchState.board[idx].owner !== attacker.owner);
    const primaryDamage = getAttackDamageAgainst(attacker, sourceIndex, defender, originalTargetIndex);
    resolveAttackHit(originalTargetIndex, primaryDamage);
    splashTargets.forEach((idx) => {
      const splashTarget = matchState.board[idx];
      if (!splashTarget || splashTarget.owner === attacker.owner) return;
      resolveAttackHit(idx, 1);
    });
  } else {
    const damage = getAttackDamageAgainst(attacker, sourceIndex, defender, pendingAction.targetIndex);
    resolveAttackHit(pendingAction.targetIndex, damage);
  }

  const attackerAfterPrimaryIndex = findUnitIndexById(pendingAction.unitId);
  const attackerAfterPrimary = attackerAfterPrimaryIndex >= 0 ? matchState.board[attackerAfterPrimaryIndex] : null;
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'on_kill_heal_1') && defeatedByAttack > 0) {
    const healResult = healUnitForEffect(attackerAfterPrimary, defeatedByAttack);
    if (healResult.healed > 0) {
      addLog(`${attackerAfterPrimary.name} は撃破効果で HP を ${healResult.healed} 回復しました`);
    }
  }
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'on_kill_permanent_atk_plus_1') && defeatedByAttack > 0) {
    attackerAfterPrimary.atk += defeatedByAttack;
    addLog(`${attackerAfterPrimary.name} は撃破効果で攻撃力が ${defeatedByAttack} 上昇しました（ATK ${attackerAfterPrimary.atk}）`);
  }
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'on_kill_heal_1_else_atk_plus_1') && defeatedByAttack > 0) {
    let totalHealed = 0;
    let totalAtkUp = 0;
    for (let i = 0; i < defeatedByAttack; i += 1) {
      if (attackerAfterPrimary.currentHp < attackerAfterPrimary.maxHp && !isUnitBuffsAndHealNegated(attackerAfterPrimary)) {
        attackerAfterPrimary.currentHp += 1;
        totalHealed += 1;
      } else {
        attackerAfterPrimary.atk += 1;
        totalAtkUp += 1;
      }
    }
    if (totalHealed > 0) {
      markUnitHealedThisRound(attackerAfterPrimary);
      addLog(`${attackerAfterPrimary.name} は撃破効果で HP を ${totalHealed} 回復しました`);
    }
    if (totalAtkUp > 0) addLog(`${attackerAfterPrimary.name} は撃破効果で攻撃力が ${totalAtkUp} 上昇しました（ATK ${attackerAfterPrimary.atk}）`);
  }
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'gain_hp_1_on_attack_permanent')) {
    attackerAfterPrimary.maxHp += 1;
    attackerAfterPrimary.currentHp += 1;
    addLog(`${attackerAfterPrimary.name} は攻撃効果で最大HPと現在HPが 1 上昇しました（${attackerAfterPrimary.currentHp}/${attackerAfterPrimary.maxHp}）`);
  }

  const attackerStillAliveIndex = findUnitIndexById(pendingAction.unitId);
  const attackerStillAlive = attackerStillAliveIndex >= 0 ? matchState.board[attackerStillAliveIndex] : null;

  if (attackerStillAlive && isUnitCardEffectActive(attackerStillAlive, attackerStillAliveIndex) && attackerStillAlive.cardId === 'RV-040') {
    const aroundTargets = getChebyshevNeighbors(attackerStillAliveIndex, 1)
      .filter((idx) => idx !== attackerStillAliveIndex)
      .filter((idx) => !!matchState.board[idx]);

    if (aroundTargets.length) {
      infernoSplashIndices = aroundTargets.slice();
      addLog(`${PLAYER_LABEL[attackerStillAlive.owner]} の ${attackerStillAlive.name} の効果が発動し、周囲1マスの全ユニットに炎が広がります`);
      aroundTargets.forEach((idx) => {
        const splashTarget = matchState.board[idx];
        if (!splashTarget) return;
        const creditPlayerKey = splashTarget.owner === attackerStillAlive.owner ? null : attackerStillAlive.owner;
        applyDamageToIndex(idx, 1, `${PLAYER_LABEL[attackerStillAlive.owner]} の ${attackerStillAlive.name} の炎が`, { creditPlayerKey });
      });
    }
  }

  if (markedAttackConsumed) {
    attacker.nextAttackAppliesNoHealNoRevive = false;
    addLog(`${attacker.name} の次の攻撃による回復・復活封じが発動しました`);
  }

  if (royalCommandAttackBoost > 0 && matchState.turnState?.royalCommandUnitId === pendingAction.unitId) {
    addLog(`${attacker.name} は王冠の勅命により、移動後の最初の攻撃が +1 されました`);
    matchState.turnState.royalCommandAttackReady = false;
    matchState.turnState.royalCommandUnitId = null;
  }

  const attackerAfterEffectsIndex = findUnitIndexById(pendingAction.unitId);
  const attackerAfterEffects = attackerAfterEffectsIndex >= 0 ? matchState.board[attackerAfterEffectsIndex] : null;
  if (attackerAfterEffects && isUnitCardEffectActive(attackerAfterEffects, attackerAfterEffectsIndex) && attackerAfterEffects.cardId === 'RV-031') {
    addLog(`${attackerAfterEffects.name} は狂戦士の反動で自身に1ダメージを受けます`);
    applyDamageToIndex(attackerAfterEffectsIndex, 1, `${attackerAfterEffects.name} の反動で`, { creditPlayerKey: null });
  }

  matchState.turnState.attackUnitId = pendingAction.unitId;
  matchState.turnState.attackCount = Number(matchState.turnState.attackCount || 0) + 1;
  matchState.turnState.attacked = true;
  matchState.actionMode = null;
  clearPendingAction();

  let attackerAfterAllEffects = (() => {
    const idx = findUnitIndexById(pendingAction.unitId);
    return idx >= 0 ? matchState.board[idx] : null;
  })();

  if (attackerAfterAllEffects && unitHasShadowReturnEffect(attackerAfterAllEffects)) {
    const currentIndex = findUnitIndexByIdOwned(attackerAfterAllEffects.instanceId, attackerAfterAllEffects.owner);
    const returnIndex = getShadowReturnCellIndexForSource(attackerAfterAllEffects.owner, pendingAction.sourceIndex);
    if (currentIndex >= 0 && returnIndex >= 0 && currentIndex !== returnIndex) {
      if (!matchState.board[returnIndex]) {
        matchState.board[returnIndex] = matchState.board[currentIndex];
        matchState.board[currentIndex] = null;
        attackerAfterAllEffects = matchState.board[returnIndex];
        shadowReturnIndex = returnIndex;
        addLog(`${attackerAfterAllEffects.name} は影に紛れ、${formatCellLabel(returnIndex)} に戻りました`);
      } else {
        addLog(`${attackerAfterAllEffects.name} は戻り先の ${formatCellLabel(returnIndex)} が埋まっているため戻れませんでした`);
      }
    }
  }

  const attackerSignature = getCardSignatureProfile(attacker.cardId, 'attack', { backstab: backstabTriggered });
  const attackPresentation = getAttackPresentationProfile(attacker, sourceIndex, pendingAction.targetIndex, defender, { backstab: backstabTriggered });
  const attackerCurrentIndex = findUnitIndexById(pendingAction.unitId);
  if (infernoSplashIndices.length) {
    const infernoProfile = getCardSignatureProfile('RV-040', 'splash');
    infernoSplashIndices.forEach((idx, order) => {
      specialAttackFxQueue.push({ index: idx, profile: infernoProfile, delay: 300 + (order * 90) });
    });
  }
  if (shadowReturnIndex != null) {
    const shadowProfile = getCardSignatureProfile('RV-039', 'return');
    if (shadowProfile) specialAttackFxQueue.push({ index: shadowReturnIndex, profile: shadowProfile, delay: 520 });
  }
  if (attackerAfterAllEffects && attackerCurrentIndex >= 0) {
    if (isUnitCardEffectActive(attackerAfterAllEffects, attackerCurrentIndex) && attackerAfterAllEffects.cardId === 'RV-047') {
      const drainProfile = getCardSignatureProfile('RV-047', 'buff');
      if (drainProfile) specialAttackFxQueue.push({ index: attackerCurrentIndex, profile: drainProfile, delay: 380 });
    }
    if (isUnitCardEffectActive(attackerAfterAllEffects, attackerCurrentIndex) && attackerAfterAllEffects.cardId === 'RV-049' && defeatedByAttack > 0) {
      const bloodProfile = getCardSignatureProfile('RV-049', 'buff');
      if (bloodProfile) specialAttackFxQueue.push({ index: attackerCurrentIndex, profile: bloodProfile, delay: 420 });
    }
    if (isUnitCardEffectActive(attackerAfterAllEffects, attackerCurrentIndex) && attackerAfterAllEffects.cardId === 'RV-046') {
      const rapidProfile = getCardSignatureProfile('RV-046', 'buff');
      if (rapidProfile) specialAttackFxQueue.push({ index: attackerCurrentIndex, profile: rapidProfile, delay: 360 });
    }
  }

  combatFxSkipNextSnapshotDiff = true;
  renderMatchArea();
  const attackFxDuration = playResolvedAttackFxSequence(sourceIndex, attackFxHits, {
    attackerLabel: attackerSignature?.mark || 'ATTACK',
    attackerPulseClass: attackerSignature?.cellClass || 'rv-fx-attacker-burst',
    attackerPulseMs: attackerSignature?.duration || 760,
    attackerWord: attackerSignature?.word || '',
    attackerTone: attackerSignature?.tone || '',
    extraEffects: specialAttackFxQueue,
    presentation: attackPresentation,
  });

  const continueAfterAttackFx = () => {
    if (checkWinByElimination()) return;

    if (attackerAfterAllEffects && unitHasEffectType(attackerAfterAllEffects, 'double_attack')) {
      const attackLimit = getAttackLimitForUnit(attackerAfterAllEffects);
      const usedCount = Number(matchState.turnState.attackCount || 0);
      if (usedCount < attackLimit) {
        const remainingTargets = getAttackTargets(attackerAfterAllEffects.instanceId);
        if (remainingTargets.length > 0) {
          matchState.selectedUnitId = attackerAfterAllEffects.instanceId;
          matchState.actionMode = 'attack';
          addLog(`${attackerAfterAllEffects.name} は神速剣士の効果で、あと ${attackLimit - usedCount} 回攻撃できます`);
          renderMatchArea();
          return;
        }
        addLog(`${attackerAfterAllEffects.name} は追加攻撃を行える敵がいません`);
      }
    }

    if (attackerAfterAllEffects && unitHasEffectType(attackerAfterAllEffects, 'move_after_attack_1')) {
      const postMoveCells = getPostAttackMoveCells(attackerAfterAllEffects.instanceId);
      if (postMoveCells.length > 0) {
        matchState.turnState.postAttackMoveUnitId = attackerAfterAllEffects.instanceId;
        matchState.selectedUnitId = attackerAfterAllEffects.instanceId;
        addLog(`${attackerAfterAllEffects.name} は効果により攻撃後に1マス移動できます`);
        renderMatchArea();
        return;
      }
      addLog(`${attackerAfterAllEffects.name} は攻撃後移動を行える空きマスがありません`);
    }

    endTurn();
  };

  if (attackFxDuration > 0) {
    rememberCombatFxTimer(setTimeout(continueAfterAttackFx, attackFxDuration + 24));
    return;
  }
  continueAfterAttackFx();
}


function confirmPendingBoardAction() {
  const pendingAction = getPendingAction();
  if (!pendingAction || matchState.phase !== 'battle') return;

  if (pendingAction.type === 'move') {
    if (roomSyncState.enabled && isRoomActiveBattlePlayer() && typeof roomSyncState.onMoveRequest === 'function') {
      roomSyncState.pendingMoveRequest = true;
      renderMatchArea();
      roomSyncState.onMoveRequest({
        player: matchState.currentPlayer,
        unitId: pendingAction.unitId,
        sourceIndex: pendingAction.sourceIndex,
        targetIndex: pendingAction.targetIndex,
      });
      return;
    }
    applyPendingMove(pendingAction);
    return;
  }
  if (pendingAction.type === 'postAttackMove') {
    applyPendingPostAttackMove(pendingAction);
    return;
  }
  if (pendingAction.type === 'attack') {
    if (roomSyncState.enabled && isRoomActiveBattlePlayer() && typeof roomSyncState.onAttackRequest === 'function') {
      roomSyncState.pendingAttackRequest = true;
      renderMatchArea();
      roomSyncState.onAttackRequest({
        player: matchState.currentPlayer,
        unitId: pendingAction.unitId,
        sourceIndex: pendingAction.sourceIndex,
        targetIndex: pendingAction.targetIndex,
      });
      return;
    }
    applyPendingAttack(pendingAction);
  }
}

function handleBoardCellClick(index) {
  if (!matchState.active) return;

  if (matchState.phase === 'setup') {
    if (!roomSyncState.enabled) {
      placeSelectedReserveCard(index);
      return;
    }
    const step = getCurrentSetupStep();
    const roomPlayerKey = getRoomPlayerKey();
    if (!step || step.player !== roomPlayerKey) return;
    if (!matchState.selectedReserveCardId) {
      window.alert('先に配置するバトルカードを選んでください。');
      return;
    }
    if (roomSyncState.pendingSetupRequest) return;
    if (!getPlaceableCellsForCurrentStep().includes(index)) return;
    roomSyncState.pendingSetupRequest = true;
    renderMatchArea();
    if (typeof roomSyncState.onSetupPlaceRequest === 'function') {
      roomSyncState.onSetupPlaceRequest({
        player: roomPlayerKey,
        cardId: matchState.selectedReserveCardId,
        targetIndex: index,
      });
    }
    return;
  }

  if (matchState.phase !== 'battle' || isRoomBattleLocked() || roomSyncState.pendingMoveRequest || roomSyncState.pendingAttackRequest) return;

  if (getPendingRedeployCard()) {
    if (!matchState.board[index] && getRedeployableCells(matchState.currentPlayer).includes(index)) {
      placePendingRedeploy(index);
    }
    return;
  }

  if (isItemWindowOpen()) {
    const selectedItemCard = getSelectedItemCard();
    if (selectedItemCard) {
      const validTargets = getItemSelectableTargets(selectedItemCard, matchState.currentPlayer);
      if (validTargets.includes(index)) {
        roomSyncState.pendingItemUseRequest = false;
        matchState.turnState.selectedItemTargetIndex = index;
        renderMatchArea();
      }
    }
    return;
  }

  const unit = matchState.board[index];
  const selectedUnit = getSelectedUnit();
  const pendingAction = getPendingAction();
  const postAttackMoveUnitId = getPostAttackMoveUnitId();
  const lockedAttackUnitId = matchState.turnState?.attackUnitId || null;

  if (postAttackMoveUnitId) {
    const validPostAttackMoveCells = getPostAttackMoveCells(postAttackMoveUnitId);
    if (pendingAction) {
      if (pendingAction.type === 'postAttackMove' && !unit && validPostAttackMoveCells.includes(index)) {
        moveAfterAttackWithSelectedUnit(index);
        return;
      }
      if (unit && unit.instanceId === postAttackMoveUnitId) {
        clearPendingAction();
        renderMatchArea();
      }
      return;
    }

    if (!unit && validPostAttackMoveCells.includes(index)) {
      moveAfterAttackWithSelectedUnit(index);
    }
    return;
  }

  if (pendingAction) {
    if (pendingAction.type === 'move' && matchState.actionMode === 'move' && selectedUnit && ((!unit) || (unit.owner === matchState.currentPlayer)) && getReachableMoveCells(matchState.selectedUnitId).includes(index)) {
      moveSelectedUnit(index);
      return;
    }
    if (pendingAction.type === 'attack' && matchState.actionMode === 'attack' && selectedUnit && unit && unit.owner !== matchState.currentPlayer && getAttackTargets(matchState.selectedUnitId).includes(index)) {
      attackWithSelectedUnit(index);
      return;
    }
    if (unit && unit.owner === matchState.currentPlayer) {
      clearPendingAction();
      matchState.selectedUnitId = unit.instanceId;
      renderMatchArea();
    }
    return;
  }

  if (matchState.actionMode === 'move' && selectedUnit && ((!unit) || (unit.owner === matchState.currentPlayer)) && getReachableMoveCells(matchState.selectedUnitId).includes(index)) {
    moveSelectedUnit(index);
    return;
  }

  if (matchState.actionMode === 'attack' && selectedUnit && unit && unit.owner !== matchState.currentPlayer) {
    attackWithSelectedUnit(index);
    return;
  }

  if (unit && unit.owner === matchState.currentPlayer) {
    if (lockedAttackUnitId && lockedAttackUnitId !== unit.instanceId) {
      return;
    }
    matchState.selectedUnitId = unit.instanceId;
    renderMatchArea();
    return;
  }
}

function normalizeDeckPayload(deck) {
  if (!deck || typeof deck !== 'object') return null;
  return {
    name: String(deck.name || '').trim(),
    battle: Array.isArray(deck.battle) ? [...deck.battle] : [],
    item: Array.isArray(deck.item) ? [...deck.item] : [],
    field: Array.isArray(deck.field) ? [...deck.field] : [],
  };
}

function startMatchFromDeckData(p1DeckInput, p2DeckInput, sourceLabel = 'テスト対戦') {
  const p1Deck = normalizeDeckPayload(p1DeckInput);
  const p2Deck = normalizeDeckPayload(p2DeckInput);
  if (!p1Deck || !p2Deck) {
    window.alert('デッキ情報の読み込みに失敗しました。');
    return false;
  }
  if (!validateDeckShape(p1Deck) || !validateDeckShape(p2Deck)) {
    window.alert('どちらかのデッキが 5 / 4 / 1 の形になっていません。');
    return false;
  }

  const p1Missing = [...p1Deck.battle, ...p1Deck.item, ...p1Deck.field].filter((id) => !cardMap.has(id));
  const p2Missing = [...p2Deck.battle, ...p2Deck.item, ...p2Deck.field].filter((id) => !cardMap.has(id));
  if (p1Missing.length || p2Missing.length) {
    window.alert(`デッキ内に存在しないカードがあります。\nP1: ${p1Missing.join(', ') || 'なし'}\nP2: ${p2Missing.join(', ') || 'なし'}`);
    return false;
  }

  resetCombatFxTracking();
  matchState = createEmptyMatchState();
  lastFinishedSfxMessage = '';
  matchState.active = true;
  matchState.phase = 'setup';
  matchState.currentPlayer = 'player1';
  matchState.players.player1 = {
    ...createEmptyPlayerState(),
    deckName: p1Deck.name,
    battleDeckIds: [...p1Deck.battle],
    reserveBattleIds: [...p1Deck.battle],
    fieldId: p1Deck.field[0] || '',
    itemStates: p1Deck.item.map((cardId) => ({ cardId, used: false })),
  };
  matchState.players.player2 = {
    ...createEmptyPlayerState(),
    deckName: p2Deck.name,
    battleDeckIds: [...p2Deck.battle],
    reserveBattleIds: [...p2Deck.battle],
    fieldId: p2Deck.field[0] || '',
    itemStates: p2Deck.item.map((cardId) => ({ cardId, used: false })),
  };
  addLog(`${sourceLabel}を開始しました`);
  addLog(`P1デッキ: ${p1Deck.name || '名前なし'} / P2デッキ: ${p2Deck.name || '名前なし'}`);
  addLog('配置順: P1が3枚 → P2が2枚 → P1が2枚 → P2が3枚');
  renderMatchArea();
  return true;
}

function startTestMatch() {
  const p1Name = player1DeckSelect.value;
  const p2Name = player2DeckSelect.value;
  if (!p1Name || !p2Name) {
    window.alert('プレイヤー1とプレイヤー2のデッキを選んでください。');
    return;
  }

  const p1Deck = getSavedDeckByName(p1Name);
  const p2Deck = getSavedDeckByName(p2Name);
  if (!p1Deck || !p2Deck) {
    window.alert('選択したデッキが見つかりません。');
    return;
  }

  startMatchFromDeckData(p1Deck, p2Deck, 'テスト対戦');
}

function resetTestMatch() {
  hideItemShowcase(true);
  resetCombatFxTracking();
  matchState = createEmptyMatchState();
  lastFinishedSfxMessage = '';
  renderMatchArea();
}

function renderFieldLog(playerKey) {
  const player = getPlayerState(playerKey);
  const field = cardMap.get(player.fieldId);
  if (!field) return;
  if (field.effect_type === 'field_range_limit_adjacent_only') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、相手は隣接する敵にしか通常攻撃できず、攻撃アイテムも同様です`);
    return;
  }
  if (field.effect_type === 'field_no_attack_after_move') {
    addLog(`環境カード「${field.card_name}」により、移動したユニットは敵味方ともにその手番攻撃できません`);
    return;
  }
  if (field.effect_type === 'field_all_atk_plus_1') {
    const count = countActiveFieldEffects('field_all_atk_plus_1');
    addLog(`環境カード「${field.card_name}」により、すべてのユニットの攻撃力が ${count} 上昇しています`);
    return;
  }
  if (field.effect_type === 'field_end_round_damage_all_1') {
    const count = countActiveFieldEffects('field_end_round_damage_all_1');
    addLog(`環境カード「${field.card_name}」により、各ラウンド終了時に全ユニットへ ${count} ダメージが発生します`);
    return;
  }
  if (field.effect_type === 'field_item_effect_plus_1') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、自分が使う数値系アイテム効果が +1 されています（破壊・行動不能・全回復は除く）`);
    return;
  }
  if (field.effect_type === 'field_center_ally_atk_plus_2') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、中央9マスの味方ユニットは攻撃力が 2 上昇します`);
    return;
  }
  if (field.effect_type === 'field_center_ally_guard_1_atk_plus_1') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、中央9マスの味方ユニットは受けるダメージ -1、攻撃力 +1 になります`);
    return;
  }
  if (field.effect_type === 'field_center_allies_cannot_be_destroyed_by_enemy_items') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、中央9マスの味方ユニットは敵アイテムの効果で破壊されません`);
    return;
  }
  if (field.effect_type === 'field_start_round_heal_1_and_cleanse_center_ally') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、自分のラウンド開始時に中央9マスの味方1体のHPを1回復し、攻撃不能・行動不能・移動力-1を解除します`);
    return;
  }
  addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」の処理を記録しました`);
}

async function loadCards() {
  try {
    clearError();
    const response = await fetch(CARDS_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify(getUnlockAuthPayload()),
    });
    if (!response.ok) throw new Error(`カード一覧の取得に失敗しました: ${response.status}`);

    const payload = await response.json();
    const data = Array.isArray(payload?.cards) ? payload.cards : [];
    if (!Array.isArray(data)) throw new Error('カード一覧の形式が不正です。');

    allCards = data;
    cardMap = new Map(allCards.map((card) => [card.card_id, card]));
    applyRoomImportedCardsToCardMap();
    ownedCardIds = loadOwnedCards();
    ensureUnlockedCardsOwned();
    savedDecks = loadSavedDecks();
    renderSavedDeckOptions();
    renderDeckPanel();
    renderCards();
    renderMatchArea();
    renderUnlockPanel();
  } catch (error) {
    console.error(error);
    showError('カード一覧または解放カードの読み込みで問題がありました。サーバー更新後に再読み込みしてください。');
  }
}

searchInput.addEventListener('input', renderCards);
typeFilter.addEventListener('change', renderCards);
rarityFilter.addEventListener('change', renderCards);
ownedOnlyCheckbox.addEventListener('change', renderCards);
reloadButton.addEventListener('click', loadCards);
clearOwnedButton.addEventListener('click', () => {
  const confirmed = window.confirm('所持チェックをすべて解除します。よろしいですか？');
  if (!confirmed) return;
  ownedCardIds = new Set();
  ensureUnlockedCardsOwned();
  saveOwnedCards();
  resetCurrentDeck();
  renderCards();
  renderUnlockPanel();
});
resetDeckButton.addEventListener('click', () => {
  const confirmed = window.confirm('現在作成中のデッキを初期化します。よろしいですか？');
  if (!confirmed) return;
  resetCurrentDeck();
});
saveDeckButton.addEventListener('click', saveCurrentDeck);
loadDeckButton.addEventListener('click', loadSelectedDeck);
deleteDeckButton.addEventListener('click', deleteSelectedDeck);
deckNameInput.addEventListener('input', () => {
  currentDeck.name = deckNameInput.value;
  renderDeckPanel();
});

startMatchButton.addEventListener('click', startTestMatch);
resetMatchButton.addEventListener('click', () => {
  const confirmed = window.confirm('現在のテスト対戦をリセットします。よろしいですか？');
  if (!confirmed) return;
  resetTestMatch();
});
itemPhaseDoneButton.addEventListener('click', () => { if (isRoomBattleLocked()) return; finishItemPhase(); });
itemPhaseDoneButtonRightMirror?.addEventListener('click', () => { if (isRoomBattleLocked()) return; finishItemPhase(); });
itemPhaseDoneButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; finishItemPhase(); });
confirmItemUseButton?.addEventListener('click', () => { if (isRoomBattleLocked()) return; confirmSelectedItemUse(); });
confirmItemUseButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; confirmSelectedItemUse(); });
cancelItemUseButton?.addEventListener('click', () => { if (isRoomBattleLocked()) return; cancelSelectedItemUse(); });
cancelItemUseButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; cancelSelectedItemUse(); });

confirmActionButton?.addEventListener('click', () => { if (isRoomBattleLocked()) return; confirmPendingBoardAction(); });
confirmActionButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; confirmPendingBoardAction(); });
cancelActionButton?.addEventListener('click', () => { if (isRoomBattleLocked()) return; cancelPendingBoardAction(); });
cancelActionButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; cancelPendingBoardAction(); });

function toggleMoveMode() {
  if (isRoomBattleLocked() || matchState.phase !== 'battle' || isItemWindowOpen() || getPostAttackMoveUnit()) return;
  matchState.actionMode = matchState.actionMode === 'move' ? null : 'move';
  renderMatchArea();
}

function toggleAttackMode() {
  if (isRoomBattleLocked() || matchState.phase !== 'battle' || isItemWindowOpen() || getPostAttackMoveUnit()) return;
  const currentFieldCheckUnit = getCurrentUnitForFieldRestrictionCheck();
  if (currentPlayerCannotAttackAfterMove(currentFieldCheckUnit)) {
    window.alert('暴風域の効果により、移動後は攻撃できません。');
    return;
  }
  matchState.actionMode = matchState.actionMode === 'attack' ? null : 'attack';
  renderMatchArea();
}

moveModeButton.addEventListener('click', toggleMoveMode);
moveModeButtonRight?.addEventListener('click', toggleMoveMode);
attackModeButton.addEventListener('click', toggleAttackMode);
attackModeButtonRight?.addEventListener('click', toggleAttackMode);
endTurnButton.addEventListener('click', () => { if (isRoomBattleLocked()) return; endTurn(); });
endTurnButtonRight?.addEventListener('click', () => { if (isRoomBattleLocked()) return; endTurn(); });
clearSelectionButton.addEventListener('click', clearMatchSelection);
clearSelectionButtonRight?.addEventListener('click', clearMatchSelection);
player1FieldLogButton.addEventListener('click', () => renderFieldLog('player1'));
player2FieldLogButton.addEventListener('click', () => renderFieldLog('player2'));
player1FieldCard?.addEventListener('click', () => openFieldPopup('player1'));
player2FieldCard?.addEventListener('click', () => openFieldPopup('player2'));
player1FieldCard?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openFieldPopup('player1');
  }
});
player2FieldCard?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openFieldPopup('player2');
  }
});

if (toggleCollectionButton) {
  toggleCollectionButton.addEventListener('click', () => setCollectionHidden(!collectionHidden));
}
if (toggleLogButton) {
  toggleLogButton.addEventListener('click', () => setLogHidden(!logHidden));
}
if (scrollToCollectionButton) {
  scrollToCollectionButton.addEventListener('click', () => {
    collectionSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

setCollectionHidden(false);
setLogHidden(true);


function applyRoomMove(data = {}) {
  const unitId = String(data.unitId || '');
  const sourceIndex = Number(data.sourceIndex);
  const targetIndex = Number(data.targetIndex);
  if (!unitId || Number.isNaN(sourceIndex) || Number.isNaN(targetIndex)) return false;

  const pendingAction = getPendingAction();
  clearRoomPendingRequests();
  if (data.currentPlayer) matchState.currentPlayer = data.currentPlayer;

  if (pendingAction && pendingAction.type === 'move' && pendingAction.unitId === unitId && Number(pendingAction.targetIndex) === targetIndex) {
    applyPendingMove(pendingAction);
    return true;
  }

  const actorPlayer = String(data.player || '');
  const actualSourceIndex = findUnitIndexByIdOwned(unitId, actorPlayer);
  const resolvedSourceIndex = actualSourceIndex >= 0 ? actualSourceIndex : sourceIndex;
  const unit = matchState.board[resolvedSourceIndex];
  if (!unit || (actorPlayer && unit.owner !== actorPlayer)) return false;

  applyPendingMove({
    type: 'move',
    unitId,
    targetIndex,
    fromLabel: formatCellLabel(resolvedSourceIndex),
    toLabel: formatCellLabel(targetIndex),
  });
  return true;
}

function applyRoomAttack(data = {}) {
  const unitId = String(data.unitId || '');
  const targetIndex = Number(data.targetIndex);
  clearRoomPendingRequests();
  if (data.currentPlayer) matchState.currentPlayer = data.currentPlayer;
  if (!unitId || Number.isNaN(targetIndex)) return false;

  const pendingAction = getPendingAction();
  if (pendingAction && pendingAction.type === 'attack' && pendingAction.unitId === unitId && Number(pendingAction.targetIndex) === targetIndex) {
    applyPendingAttack(pendingAction);
    return true;
  }

  const actorPlayer = String(data.player || '');
  const sourceIndex = findUnitIndexByIdOwned(unitId, actorPlayer);
  if (sourceIndex < 0) return false;
  const attacker = matchState.board[sourceIndex];
  const defender = matchState.board[targetIndex];
  if (!attacker || (actorPlayer && attacker.owner !== actorPlayer) || !defender || attacker.owner === defender.owner) return false;

  applyPendingAttack({
    type: 'attack',
    unitId,
    unitName: attacker.name,
    sourceIndex,
    targetIndex,
    targetName: defender.name,
    actorPlayer,
    damage: getAttackDamageAgainst(attacker, sourceIndex, defender, targetIndex),
    bonusText: isUnitCardEffectActive(attacker, sourceIndex) && attacker.cardId === 'RV-028' && isBackAttack(sourceIndex, targetIndex, defender.owner) ? '背後攻撃 +1' : '',
  });
  return true;
}

function applyRoomItemUse(data = {}) {
  clearRoomPendingRequests();
  return performItemUseLocal(String(data.cardId || ''), data.targetIndex ?? null, data.player || matchState.currentPlayer);
}

function applyRoomFinishItemPhase(data = {}) {
  clearRoomPendingRequests();
  if (data.player) matchState.currentPlayer = data.player;
  return finishItemPhaseLocal();
}

function applyRoomEndTurn(data = {}) {
  clearRoomPendingRequests();
  const ok = endTurnLocal();
  if (ok && typeof data.round === 'number') {
    matchState.round = data.round;
  }
  renderMatchArea();
  return ok;
}

function notifyRoomRequestError() {
  clearRoomPendingRequests();
  if (getCombatFxHoldMsRemaining() > 0) {
    queueRenderAfterCombatFx();
    return true;
  }
  renderMatchArea();
  return true;
}

function exportRoomSyncSnapshot() {
  return {
    phase: matchState.phase,
    currentPlayer: matchState.currentPlayer,
    round: matchState.round,
    setupStepIndex: matchState.setupStepIndex,
    placedInCurrentStep: matchState.placedInCurrentStep,
    itemPhaseOpen: !!(matchState.turnState && matchState.turnState.itemWindowOpen),
    itemUsed: !!(matchState.turnState && matchState.turnState.itemUsed),
    board: matchState.board.map((unit) => unit ? {
      instanceId: unit.instanceId,
      cardId: unit.cardId,
      owner: unit.owner,
      name: unit.name,
      atk: unit.atk,
      move: unit.move,
      currentHp: unit.currentHp,
      maxHp: unit.maxHp,
      tempAtkBuff: unit.tempAtkBuff,
      tempMoveBuff: unit.tempMoveBuff,
      skipAttackTurns: unit.skipAttackTurns,
      skipActionTurns: unit.skipActionTurns,
      actionLocked: unit.actionLocked,
      attackLocked: unit.attackLocked,
      singleUseDamageReduction: unit.singleUseDamageReduction,
      guardBlockUsed: unit.guardBlockUsed,
      negateDamageUsed: unit.negateDamageUsed,
      surviveOnceUsed: unit.surviveOnceUsed,
      healedInRound: Number(unit.healedInRound || 0),
      untargetableByEnemyItemsUntilTurnStartOf: unit.untargetableByEnemyItemsUntilTurnStartOf || '',
      negateBuffsAndHealUntilTurnStartOf: unit.negateBuffsAndHealUntilTurnStartOf || '',
      noHealNoReviveUntilTurnStartOf: unit.noHealNoReviveUntilTurnStartOf || '',
      centerSilenceDisableAttackUntilTurnStartOf: unit.centerSilenceDisableAttackUntilTurnStartOf || '',
      fullSilenceUntilTurnStartOf: unit.fullSilenceUntilTurnStartOf || '',
      negateNextDestroyStunDisableAttackUntilTurnStartOf: unit.negateNextDestroyStunDisableAttackUntilTurnStartOf || '',
      itemFieldNegateControlUsed: !!unit.itemFieldNegateControlUsed,
      nextAttackAppliesNoHealNoRevive: !!unit.nextAttackAppliesNoHealNoRevive,
    } : null),
    turnState: {
      moved: !!matchState.turnState?.moved,
      movedUnitId: matchState.turnState?.movedUnitId || null,
      attacked: !!matchState.turnState?.attacked,
      attackCount: Number(matchState.turnState?.attackCount || 0),
      attackUnitId: matchState.turnState?.attackUnitId || null,
      itemWindowOpen: !!matchState.turnState?.itemWindowOpen,
      itemUsed: !!matchState.turnState?.itemUsed,
      acceleratedUnitId: matchState.turnState?.acceleratedUnitId || null,
      acceleratedMovesRemaining: Number(matchState.turnState?.acceleratedMovesRemaining || 0),
      royalCommandUnitId: matchState.turnState?.royalCommandUnitId || null,
      royalCommandAttackReady: !!matchState.turnState?.royalCommandAttackReady,
      postAttackMoveUnitId: matchState.turnState?.postAttackMoveUnitId || null,
      pendingRedeployOwner: matchState.turnState?.pendingRedeployOwner || null,
    },
    players: {
      player1: {
        reserveBattleIds: [...(matchState.players.player1.reserveBattleIds || [])],
        fieldId: matchState.players.player1.fieldId || '',
        itemStates: (matchState.players.player1.itemStates || []).map((item) => ({ cardId: item.cardId, used: !!item.used })),
        negateEnemyFieldUntilOwnTurnStart: !!matchState.players.player1.negateEnemyFieldUntilOwnTurnStart,
      },
      player2: {
        reserveBattleIds: [...(matchState.players.player2.reserveBattleIds || [])],
        fieldId: matchState.players.player2.fieldId || '',
        itemStates: (matchState.players.player2.itemStates || []).map((item) => ({ cardId: item.cardId, used: !!item.used })),
        negateEnemyFieldUntilOwnTurnStart: !!matchState.players.player2.negateEnemyFieldUntilOwnTurnStart,
      },
    },
    pendingRevives: Array.isArray(matchState.pendingRevives) ? [...matchState.pendingRevives] : [],
    pendingRedeploys: Array.isArray(matchState.pendingRedeploys) ? [...matchState.pendingRedeploys] : [],
  };
}


function buildDefaultRoomTurnState() {
  return {
    moved: false,
    movedUnitId: null,
    attacked: false,
    attackCount: 0,
    attackUnitId: null,
    itemWindowOpen: true,
    itemUsed: false,
    selectedItemCardId: null,
    selectedItemTargetIndex: null,
    pendingAction: null,
    acceleratedUnitId: null,
    acceleratedMovesRemaining: 0,
    royalCommandUnitId: null,
    royalCommandAttackReady: false,
    postAttackMoveUnitId: null,
    pendingRedeployCardId: null,
    pendingRedeployOwner: null,
  };
}

function importRoomSyncSnapshot(snapshot = {}) {
  if (!snapshot || typeof snapshot !== 'object') return false;
  if (Array.isArray(snapshot.board) && snapshot.board.length === 25) {
    matchState.board = snapshot.board.map((unit) => unit ? { ...unit } : null);
  }
  if (snapshot.players && typeof snapshot.players === 'object') {
    ['player1', 'player2'].forEach((key) => {
      const source = snapshot.players[key];
      if (!source || typeof source !== 'object') return;
      const target = matchState.players[key] || createEmptyPlayerState();
      if (Array.isArray(source.reserveBattleIds)) target.reserveBattleIds = source.reserveBattleIds.map(String);
      if (Array.isArray(source.battleDeckIds)) target.battleDeckIds = source.battleDeckIds.map(String);
      if (typeof source.fieldId === 'string') target.fieldId = source.fieldId;
      if (Array.isArray(source.itemStates)) {
        target.itemStates = source.itemStates.map((item) => ({ cardId: String(item.cardId || ''), used: !!item.used }));
      }
      if (typeof source.defeated === 'number') target.defeated = Number(source.defeated || 0);
      if (typeof source.teamDamageReduction === 'number') target.teamDamageReduction = Number(source.teamDamageReduction || 0);
      if (typeof source.teamDamageReductionExpiresOnOwnTurnStart === 'boolean') target.teamDamageReductionExpiresOnOwnTurnStart = !!source.teamDamageReductionExpiresOnOwnTurnStart;
      if (typeof source.negateEnemyFieldUntilOwnTurnStart === 'boolean') target.negateEnemyFieldUntilOwnTurnStart = !!source.negateEnemyFieldUntilOwnTurnStart;
      matchState.players[key] = target;
    });
  }
  if (snapshot.turnState && typeof snapshot.turnState === 'object') {
    matchState.turnState = {
      ...buildDefaultRoomTurnState(),
      ...snapshot.turnState,
      itemWindowOpen: !!snapshot.turnState.itemWindowOpen,
      itemUsed: !!snapshot.turnState.itemUsed,
      moved: !!snapshot.turnState.moved,
      attacked: !!snapshot.turnState.attacked,
      attackCount: Number(snapshot.turnState.attackCount || 0),
      acceleratedMovesRemaining: Number(snapshot.turnState.acceleratedMovesRemaining || 0),
      royalCommandAttackReady: !!snapshot.turnState.royalCommandAttackReady,
    };
  }
  if (Array.isArray(snapshot.pendingRevives)) matchState.pendingRevives = [...snapshot.pendingRevives];
  if (Array.isArray(snapshot.pendingRedeploys)) matchState.pendingRedeploys = [...snapshot.pendingRedeploys];
  if (typeof snapshot.phase === 'string') matchState.phase = snapshot.phase;
  if (typeof snapshot.currentPlayer === 'string') matchState.currentPlayer = snapshot.currentPlayer;
  if (typeof snapshot.round === 'number') matchState.round = Number(snapshot.round || 1);
  if (typeof snapshot.setupStepIndex === 'number') matchState.setupStepIndex = Number(snapshot.setupStepIndex || 0);
  if (typeof snapshot.placedInCurrentStep === 'number') matchState.placedInCurrentStep = Number(snapshot.placedInCurrentStep || 0);
  if (Object.prototype.hasOwnProperty.call(snapshot, 'winner')) matchState.winner = snapshot.winner || null;
  matchState.selectedUnitId = null;
  matchState.selectedReserveCardId = null;
  matchState.actionMode = null;
  return true;
}

function applyRoomStateSync(data = {}) {
  clearRoomPendingRequests();
  if (data.snapshot && typeof data.snapshot === 'object') {
    importRoomSyncSnapshot(data.snapshot);
  }
  const wasFinished = matchState.phase === 'finished';
  if (typeof data.currentPlayer === 'string') matchState.currentPlayer = data.currentPlayer;
  if (typeof data.round === 'number') matchState.round = data.round;
  if (typeof data.phase === 'string') matchState.phase = data.phase;
  if (typeof data.winner === 'string' && data.winner.trim()) matchState.winner = data.winner.trim();
  if (matchState.turnState) {
    if (typeof data.itemPhaseOpen === 'boolean') matchState.turnState.itemWindowOpen = data.itemPhaseOpen;
    if (typeof data.itemUsed === 'boolean') matchState.turnState.itemUsed = data.itemUsed;
  }
  if (matchState.phase === 'finished' && !wasFinished) {
    const showcaseDelay = Math.max(720, getCombatFxHoldMsRemaining() + 180);
    scheduleFinishShowcase(showcaseDelay);
  } else if (matchState.phase !== 'finished') {
    clearFinishShowcaseSchedule();
  }
  if (getCombatFxHoldMsRemaining() > 0 || (matchState.phase === 'finished' && !isFinishShowcaseReady() && finishShowcaseReadyAt > 0)) {
    queueRenderAfterCombatFx();
    return true;
  }
  renderMatchArea();
  return true;
}


function applyRoomGameFinished(data = {}) {
  clearRoomPendingRequests();
  if (typeof data.currentPlayer === 'string') matchState.currentPlayer = data.currentPlayer;
  if (typeof data.round === 'number') matchState.round = data.round;
  matchState.phase = 'finished';
  matchState.active = true;
  const message = String(data.message || data.winner || matchState.winner || '対戦が終了しました').trim();
  const wasSameMessage = matchState.winner === message;
  matchState.winner = message;
  if (message && !wasSameMessage) {
    addLog(message);
  }
  if (lastFinishedSfxMessage !== message) {
    playSfx(getFinishSfxKind(message));
    lastFinishedSfxMessage = message;
  }
  const showcaseDelay = Math.max(780, getCombatFxHoldMsRemaining() + 220);
  scheduleFinishShowcase(showcaseDelay);
  renderMatchArea();
  return true;
}

window.REDVEIN_ROOM_API = {
  startMatchFromDeckData,
  resetTestMatch,
  renderMatchArea,
  setRoomSyncConfig,
  applyRoomSetupPlacement,
  applyRoomMove,
  applyRoomAttack,
  applyRoomItemUse,
  applyRoomFinishItemPhase,
  applyRoomEndTurn,
  exportRoomSyncSnapshot,
  applyRoomStateSync,
  applyRoomGameFinished,
  getCombatFxHoldMsRemaining,
  notifyRoomRequestError,
  getUnlockAuthPayload,
  importRoomDeckCards,
};

unlockSaveKey = loadUnlockSaveKey();
unlockTokens = loadUnlockTokens();
setupSfx();
setupBgm();
ensureActionGuide();
ensureItemShowcase();
ensureItemPickerModal();
ensureFieldPopupModal();
ensureItemPickerLaunchers();
ensureSpectatorHud();
ensureCombatFxReady();
ensureUnlockPanel();
loadCards();
