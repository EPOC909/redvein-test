const DATA_PATH = './data/redvein_cards.json';
const IMAGE_BASE_PATH = './cards/';
const OWNED_STORAGE_KEY = 'redvein_owned_cards_v1';
const DECKS_STORAGE_KEY = 'redvein_saved_decks_v1';
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

let allCards = [];
let cardMap = new Map();
let ownedCardIds = new Set();
let savedDecks = [];
let currentDeck = { name: '', battle: [], item: [], field: [] };
let instanceCounter = 0;
let collectionHidden = false;
let logHidden = true;
let matchState = createEmptyMatchState();
let roomSyncState = { enabled: false, role: '', battleControlsEnabled: false, pendingSetupRequest: false, pendingMoveRequest: false, pendingAttackRequest: false, pendingItemUseRequest: false, pendingFinishItemPhaseRequest: false, pendingEndTurnRequest: false, onSetupPlaceRequest: null, onMoveRequest: null, onAttackRequest: null, onItemUseRequest: null, onFinishItemPhaseRequest: null, onEndTurnRequest: null };


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
    turnState: { moved: false, movedUnitId: null, attacked: false, attackCount: 0, attackUnitId: null, itemWindowOpen: true, itemUsed: false, selectedItemCardId: null, selectedItemTargetIndex: null, pendingAction: null, acceleratedUnitId: null, acceleratedMovesRemaining: 0, postAttackMoveUnitId: null, pendingRedeployCardId: null, pendingRedeployOwner: null },
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
    if (unit.owner === ownerKey && unit.cardId === 'RV-013') count += 1;
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
    if (unit.owner !== ownerKey && unit.cardId === 'RV-011') count += 1;
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
    if (unit.owner === ownerKey && unit.cardId === 'RV-032' && !unit.guardBlockUsed) {
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

function getTargetedAttackBonus(attacker, attackerIndex, defender, defenderIndex) {
  if (!attacker || !defender) return 0;
  let bonus = 0;
  if (attacker.cardId === 'RV-028' && isBackAttack(attackerIndex, defenderIndex, defender.owner)) bonus += 1;
  return bonus;
}

function getConditionalAttackBonus(unit, boardIndex) {
  if (!unit) return 0;
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


function getUnitDamageReductionParts(unit, boardIndex = null) {
  if (!unit) return [];
  const player = getPlayerState(unit.owner);
  const parts = [];
  const shieldReduction = Number(unit.singleUseDamageReduction || 0);
  const teamReduction = Number(player?.teamDamageReduction || 0);
  const guardianReduction = boardIndex != null ? getAdjacentGuardianReduction(boardIndex, unit.owner) : 0;
  if (shieldReduction > 0) parts.push({ label: '防護符', value: shieldReduction });
  if (teamReduction > 0) parts.push({ label: '防壁展開', value: teamReduction });
  if (guardianReduction > 0) parts.push({ label: guardianReduction > 1 ? `守護兵×${guardianReduction}` : '守護兵', value: guardianReduction });
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
  const parts = [];
  if (Number(unit.tempAtkBuff || 0) > 0) parts.push({ label: '一時攻撃補正', value: Number(unit.tempAtkBuff || 0) });
  const fieldBonus = getFieldAttackBonus(unit.owner, boardIndex);
  if (fieldBonus > 0) parts.push({ label: '環境補正', value: fieldBonus });
  if (unit.cardId === 'RV-012' && isPointZone(boardIndex)) parts.push({ label: '斬撃兵', value: 1 });
  if (unit.cardId === 'RV-030' && matchState.phase === 'battle' && matchState.turnState?.movedUnitId === unit.instanceId) parts.push({ label: '騎馬兵', value: 1 });
  const pendingBonus = getPendingAttackBonusForUnit(unit);
  if (pendingBonus > 0) parts.push({ label: '背後攻撃', value: pendingBonus });
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
  return '•';
}

function getUnitAbilityBadges(unit) {
  const meta = getUnitMeta(unit);
  if (!meta) return [];
  const effectType = String(meta.effect_type || '');
  const badges = [];
  const push = (kind, label, title) => badges.push({ kind, label, title });

  if (['range_2', 'row_range_attack', 'pierce_line_2'].includes(effectType)) {
    push('ability-range', '遠', effectType === 'row_range_attack' ? '遠距離攻撃: 同じ横一列の敵を攻撃できます' : effectType === 'pierce_line_2' ? '遠距離攻撃: 直線2マス先まで攻撃できます' : '遠距離攻撃: 2マス先の敵も攻撃できます');
  }
  if (effectType === 'pierce_line_2') push('ability-pierce', '貫', '貫通攻撃: 軽減無視の直線攻撃です');
  if (effectType === 'double_attack') push('ability-speed', '連', '連撃: 1ターンに2回攻撃できます');
  if (effectType === 'move_after_attack_1') push('ability-speed', '迅', '攻撃後移動: 攻撃後に1マス移動できます');
  if (unitHasShadowReturnEffect(unit)) push('ability-shadow', '影', '影の暗殺者: 攻撃後、自陣の同じ段に戻ります。戻り先が埋まっている場合は戻りません');
  if (effectType === 'revive_next_turn_from_base') push('ability-revive', '復', '復活: 次の自身の手番開始時に自陣から復活します');
  if (['guard_adjacent_ally_once', 'intercept_and_counter_1'].includes(effectType)) push('ability-guard', '護', '護衛効果を持つユニットです');
  if (['self_center_aoe_1_on_attack', 'splash_adjacent_enemy_on_attack'].includes(effectType)) push('ability-aoe', '範', '範囲ダメージ効果を持つユニットです');

  return badges;
}

function getAccelerationStatusBadge(unit) {
  if (!unit || matchState.phase !== 'battle' || !matchState.turnState) return null;
  if (matchState.turnState.acceleratedUnitId !== unit.instanceId || matchState.turnState.acceleratedMovesRemaining <= 0) return null;
  return {
    kind: 'move-up',
    value: String(matchState.turnState.acceleratedMovesRemaining),
    title: `加速術: 残り ${matchState.turnState.acceleratedMovesRemaining} 回移動できます`
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
    if ((unit.cardId === 'RV-032' || unit.name === '守護騎士') && unit.guardBlockUsed !== true) {
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
  const selfGuardReady = (unit.cardId === 'RV-032' || unit.name === '守護騎士') && unit.guardBlockUsed !== true;
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

function syncActionButtonsState(config) {
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
  ownedButton.textContent = isOwned ? '所持済み（クリックで解除）' : '所持にする';
  if (isOwned) ownedButton.classList.add('is-owned');
  ownedButton.addEventListener('click', () => toggleOwned(card.card_id));

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
  };
}

function getPlayerState(playerKey) {
  return matchState.players[playerKey];
}

function getOpponent(playerKey) {
  return playerKey === 'player1' ? 'player2' : 'player1';
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

function unitHasEffectType(unit, effectType) {
  return getUnitMeta(unit)?.effect_type === effectType;
}

function unitHasShadowReturnEffect(unit) {
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
  return [];
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
  matchState.pendingRedeploys = [];
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
  });

  matchState.pendingRevives = remaining;
}

function getRedeployableCells(playerKey = matchState.currentPlayer) {
  return [];
}

function preparePendingRedeployForPlayer(playerKey) {
  clearPendingRedeployPrompt();
  matchState.pendingRedeploys = [];
}

function placePendingRedeploy(targetIndex) {
  clearPendingRedeployPrompt();
  matchState.pendingRedeploys = [];
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
  if (['destroy_single', 'disable_attack_next_round', 'stun_single_1_turn', 'full_heal_single'].includes(effectType)) return 0;
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

function currentPlayerCannotAttackAfterMove() {
  return !!(matchState.phase === 'battle' && matchState.turnState?.moved && isGlobalFieldEffectActive('field_no_attack_after_move'));
}

function isOffensiveItemCard(card) {
  if (!card) return false;
  return ['damage_single_1', 'damage_single_2', 'damage_aoe_target_radius_1', 'disable_attack_next_round', 'stun_single_1_turn', 'destroy_single'].includes(card.effect_type);
}

function isFogProtectedTargetForItem(card, attackerPlayerKey, targetIndex) {
  if (!card || !isOffensiveItemCard(card)) return false;
  const targetUnit = matchState.board[targetIndex];
  if (!targetUnit || targetUnit.owner === attackerPlayerKey) return false;
  if (!playerHasFieldEffect(targetUnit.owner, 'field_range_limit_adjacent_only')) return false;
  return !hasAdjacentUnitOwnedBy(targetIndex, attackerPlayerKey);
}

function getFieldAttackBonus(playerKey, boardIndex) {
  const fieldCard = getPlayerFieldCard(playerKey);
  let bonus = 0;
  if (fieldCard?.effect_type === 'field_center_ally_atk_plus_1' && isPointZone(boardIndex)) bonus += 1;
  bonus += countActiveFieldEffects('field_all_atk_plus_1');
  return bonus;
}

function getEffectiveAtk(unit, boardIndex) {
  if (!unit) return 0;
  return Math.max(0, Number(unit.atk || 0) + Number(unit.tempAtkBuff || 0) + getFieldAttackBonus(unit.owner, boardIndex) + getConditionalAttackBonus(unit, boardIndex));
}

function getEffectiveMove(unit, boardIndex = null) {
  if (!unit) return 0;
  if (cannotMoveByEffect(unit)) return 0;
  const sentryReduction = boardIndex != null ? getAdjacentEnemySentryReduction(boardIndex, unit.owner) : 0;
  return Math.max(0, Number(unit.move || 0) + Number(unit.tempMoveBuff || 0) - sentryReduction);
}

function getAttackDamageAgainst(attacker, attackerIndex, defender, defenderIndex) {
  return Math.max(0, getEffectiveAtk(attacker, attackerIndex) + getTargetedAttackBonus(attacker, attackerIndex, defender, defenderIndex));
}

function getAttackLimitForUnit(unit) {
  return unitHasEffectType(unit, 'double_attack') ? 2 : 1;
}

function clearTemporaryEffects(playerKey) {
  for (const unit of matchState.board) {
    if (!unit || unit.owner !== playerKey) continue;
    unit.tempAtkBuff = 0;
    unit.tempMoveBuff = 0;
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
  if (['damage_single_1', 'damage_single_2', 'disable_attack_next_round', 'stun_single_1_turn', 'destroy_single'].includes(card.effect_type)) return 'enemy';
  if (['heal_single_2', 'full_heal_single', 'buff_move_atk_turn_1', 'shield_single_2_once', 'move_twice_single'].includes(card.effect_type)) return 'ally';
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
        if (card.effect_type === 'disable_attack_next_round') {
          return !isFogProtectedTargetForItem(card, playerKey, index);
        }
        return !isFogProtectedTargetForItem(card, playerKey, index);
      }
      if (mode === 'any') {
        if (unit.owner === playerKey) return true;
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
  if (!defender) return { defeated: false, damage: 0 };
  const ignoreReduction = !!options.ignoreReduction;
  const hasExplicitCredit = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey');
  const creditPlayerKey = hasExplicitCredit ? options.creditPlayerKey : matchState.currentPlayer;
  const reductionParts = ignoreReduction ? [] : getUnitDamageReductionParts(defender, targetIndex);
  const totalReduction = reductionParts.reduce((sum, part) => sum + Number(part.value || 0), 0);
  const actualDamage = ignoreReduction ? Math.max(0, damage) : Math.max(0, damage - totalReduction);

  if (ignoreReduction) {
    addLog(`${sourceLabel} ${defender.name} に軽減無視で ${actualDamage} ダメージ`);
  } else if (reductionParts.length) {
    addLog(`${sourceLabel} ${defender.name} へのダメージを軽減（${reductionParts.map((part) => `${part.label} -${part.value}`).join(' / ')}）`);
  }

  if (actualDamage > 0 && canNegateDamageOnce(defender)) {
    defender.negateDamageUsed = true;
    addLog(`${defender.name} の「試合中1回ダメージ無効」が発動しました`);
    return { blocked: true, defeated: false, damage: 0 };
  }

  if (!ignoreReduction && Number(defender.singleUseDamageReduction || 0) > 0) {
    defender.singleUseDamageReduction = 0;
    addLog(`${defender.name} の防護符が発動しました`);
  }

  defender.currentHp -= actualDamage;
  if (!ignoreReduction) addLog(`${sourceLabel} ${defender.name} に ${actualDamage} ダメージ`);
  if (defender.currentHp <= 0) {
    matchState.board[targetIndex] = null;
    clearPendingRedeployForUnit(defender);
    if (creditPlayerKey) {
      getPlayerState(creditPlayerKey).defeated += 1;
    }
    addLog(`${defender.name} が撃破されました`);
    queueUnitRevive(defender);
    return { defeated: true, damage: actualDamage };
  }
  addLog(`${defender.name} の残りHPは ${defender.currentHp}`);
  return { defeated: false, damage: actualDamage };
}


function applyAttackDamageToIndex(attacker, targetIndex, damage, options = {}) {
  const defender = matchState.board[targetIndex];
  if (!attacker || !defender || defender.owner === attacker.owner) return { blocked: false, defeated: false, damage: 0 };
  const guardianKnight = findAdjacentGuardianKnight(targetIndex, defender.owner);
  if (guardianKnight && guardianKnight.unit.instanceId !== defender.instanceId) {
    guardianKnight.unit.guardBlockUsed = true;
    addLog(`${guardianKnight.unit.name} が ${defender.name} への攻撃を1回だけ完全防御しました`);
    return { blocked: true, defeated: false, damage: 0 };
  }
  const kingCommander = findAdjacentKingCommander(targetIndex, defender.owner);
  if (kingCommander && kingCommander.unit.instanceId !== defender.instanceId) {
    const kingInstanceId = kingCommander.unit.instanceId;
    const redirectedDamage = typeof options.attackerIndex === 'number'
      ? getAttackDamageAgainst(attacker, options.attackerIndex, kingCommander.unit, kingCommander.index)
      : damage;
    const redirectOptions = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey')
      ? { ...options }
      : { ...options, creditPlayerKey: attacker.owner };
    delete redirectOptions.attackerIndex;
    addLog(`${kingCommander.unit.name} が ${defender.name} への攻撃を引き受けます`);
    const result = applyDamageToIndex(kingCommander.index, redirectedDamage, `${PLAYER_LABEL[attacker.owner]} の ${attacker.name} が`, redirectOptions);
    const kingAliveIndex = findUnitIndexById(kingInstanceId);
    const attackerAliveIndex = findUnitIndexById(attacker.instanceId);
    if (kingAliveIndex >= 0 && attackerAliveIndex >= 0) {
      const kingAlive = matchState.board[kingAliveIndex];
      addLog(`${kingAlive.name} が反撃し、${attacker.name} に 1 ダメージを与えます`);
      applyDamageToIndex(attackerAliveIndex, 1, `${kingAlive.name} の反撃で`, { creditPlayerKey: kingAlive.owner });
    }
    return { ...result, intercepted: true };
  }
  const damageOptions = Object.prototype.hasOwnProperty.call(options, 'creditPlayerKey')
    ? { ...options }
    : { ...options, creditPlayerKey: attacker.owner };
  delete damageOptions.attackerIndex;
  return applyDamageToIndex(targetIndex, damage, `${PLAYER_LABEL[attacker.owner]} の ${attacker.name} が`, damageOptions);
}

function applyItemEffect(card, playerKey) {
  const targetIndex = getSelectedItemTargetIndex();
  const targetUnit = getSelectedItemTargetUnit();
  const actorLabel = PLAYER_LABEL[playerKey];
  const effectBoost = getItemEffectBoost(playerKey, card.effect_type);
  switch (card.effect_type) {
    case 'heal_single_2': {
      if (!targetUnit) return false;
      const before = targetUnit.currentHp;
      const amount = 2 + effectBoost;
      targetUnit.currentHp = Math.min(targetUnit.maxHp, targetUnit.currentHp + amount);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} を ${targetUnit.currentHp - before} 回復しました${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      return true;
    }
    case 'full_heal_single': {
      if (!targetUnit) return false;
      const before = targetUnit.currentHp;
      targetUnit.currentHp = targetUnit.maxHp;
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} の HP を全回復しました（+${targetUnit.currentHp - before}）`);
      return true;
    }
    case 'heal_all_1': {
      const allies = getLivingUnits(playerKey);
      let healed = 0;
      allies.forEach((unit) => {
        const before = unit.currentHp;
        unit.currentHp = Math.min(unit.maxHp, unit.currentHp + 1 + effectBoost);
        healed += unit.currentHp - before;
      });
      addLog(`${actorLabel}: ${card.card_name} で味方全体を回復しました（合計 +${healed}）${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      return true;
    }
    case 'damage_single_1': {
      if (targetIndex == null) return false;
      applyDamageToIndex(targetIndex, 1 + effectBoost, `${actorLabel}: ${card.card_name} で`);
      return true;
    }
    case 'damage_single_2': {
      if (targetIndex == null) return false;
      applyDamageToIndex(targetIndex, 2 + effectBoost, `${actorLabel}: ${card.card_name} で`);
      return true;
    }
    case 'destroy_single': {
      if (targetIndex == null) return false;
      const destroyedUnit = matchState.board[targetIndex];
      if (!destroyedUnit) return false;
      matchState.board[targetIndex] = null;
      clearPendingRedeployForUnit(destroyedUnit);
      getPlayerState(playerKey).defeated += 1;
      addLog(`${actorLabel}: ${card.card_name} で ${destroyedUnit.name} を即座に破壊しました`);
      queueUnitRevive(destroyedUnit);
      return true;
    }
    case 'disable_attack_next_round': {
      if (!targetUnit) return false;
      targetUnit.skipAttackTurns = Math.max(targetUnit.skipAttackTurns || 0, 1);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の自身の手番で攻撃不可になります`);
      return true;
    }
    case 'stun_single_1_turn': {
      if (!targetUnit) return false;
      targetUnit.skipActionTurns = Math.max(Number(targetUnit.skipActionTurns || 0), 1);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次の自身の手番で行動できなくなります`);
      return true;
    }
    case 'buff_move_atk_turn_1': {
      if (!targetUnit) return false;
      const amount = 1 + effectBoost;
      targetUnit.tempAtkBuff = (targetUnit.tempAtkBuff || 0) + amount;
      targetUnit.tempMoveBuff = (targetUnit.tempMoveBuff || 0) + amount;
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} の ATK/MOVE をこの手番だけ +${amount} しました`);
      return true;
    }
    case 'shield_single_2_once': {
      if (!targetUnit) return false;
      const amount = 2 + effectBoost;
      targetUnit.singleUseDamageReduction = Math.max(Number(targetUnit.singleUseDamageReduction || 0), amount);
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} は次に受けるダメージを ${amount} 軽減します`);
      return true;
    }
    case 'move_twice_single': {
      if (!targetUnit || targetUnit.owner !== playerKey) return false;
      matchState.turnState.acceleratedUnitId = targetUnit.instanceId;
      const amount = 2 + effectBoost;
      matchState.turnState.acceleratedMovesRemaining = amount;
      matchState.selectedUnitId = targetUnit.instanceId;
      addLog(`${actorLabel}: ${card.card_name} で ${targetUnit.name} はこの手番に ${amount} 回移動できます`);
      return true;
    }
    case 'team_damage_minus_1_until_next_round': {
      const player = getPlayerState(playerKey);
      const amount = 1 + effectBoost;
      player.teamDamageReduction = Math.max(Number(player.teamDamageReduction || 0), amount);
      player.teamDamageReductionExpiresOnOwnTurnStart = true;
      addLog(`${actorLabel}: ${card.card_name} で味方全体が次の自分のラウンド開始時までダメージ -${amount} になりました`);
      return true;
    }
    case 'damage_aoe_target_radius_1': {
      if (targetIndex == null) return false;
      const affected = getChebyshevNeighbors(targetIndex, 1)
        .filter((idx) => !!matchState.board[idx]);
      if (!affected.length) return false;
      addLog(`${actorLabel}: ${card.card_name} が ${formatCellLabel(targetIndex)} を中心に炸裂しました${effectBoost > 0 ? '（補給路で +1 強化）' : ''}`);
      affected.forEach((idx) => {
        applyDamageToIndex(idx, 1 + effectBoost, `${actorLabel}: ${card.card_name} で`);
      });
      return true;
    }
    default:
      addLog(`${actorLabel}: アイテム「${card.card_name}」を使用しました（この効果はまだ手動処理です）`);
      return true;
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

  return result;
}

function getAttackTargets(instanceId) {
  if (matchState.phase !== 'battle' || currentPlayerCannotAttackAfterMove()) return [];
  const startIndex = findUnitIndexById(instanceId);
  if (startIndex < 0) return [];
  const unit = matchState.board[startIndex];
  if (!unit || unit.owner !== matchState.currentPlayer || unit.actionLocked || unit.attackLocked) return [];

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

  return [...targetSet];
}

function getSelectedUnit() {
  if (!matchState.selectedUnitId) return null;
  const index = findUnitIndexById(matchState.selectedUnitId);
  return index >= 0 ? matchState.board[index] : null;
}

function isItemWindowOpen() {
  return !!(matchState.turnState && matchState.turnState.itemWindowOpen);
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
  const nextValue = matchState.turnState.selectedItemCardId === cardId ? null : cardId;
  matchState.turnState.selectedItemCardId = nextValue;
  matchState.turnState.selectedItemTargetIndex = null;
  renderMatchArea();
}

function cancelSelectedItemUse() {
  if (!matchState.turnState) return;
  matchState.turnState.selectedItemCardId = null;
  matchState.turnState.selectedItemTargetIndex = null;
  renderMatchArea();
}

function closeItemWindow() {
  if (!matchState.turnState) return;
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
  renderMatchArea();
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
    setSelectionInfoText(`${selectedUnit.name} を選択中 / HP ${selectedUnit.currentHp}/${selectedUnit.maxHp} / ATK ${getEffectiveAtk(selectedUnit, idx)} / MOVE ${getEffectiveMove(selectedUnit, idx)}${selectedUnit.actionLocked ? ' / この手番は行動不可' : (selectedUnit.attackLocked ? ' / この手番は攻撃不可' : '')}${cannotMoveByEffect(selectedUnit) ? ' / このユニットは移動不可' : ''}${currentPlayerCannotAttackAfterMove() ? ' / 暴風域: 移動後は攻撃不可' : ''}${matchState.turnState?.acceleratedUnitId === selectedUnit.instanceId && matchState.turnState.acceleratedMovesRemaining > 0 ? ` / 加速術: 残り${matchState.turnState.acceleratedMovesRemaining}回移動可` : ''}${extraAttackText}`);
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
    setSelectionInfoText('アイテム使用フェーズです。左右の手札から1枚選ぶか、「アイテムを使わず次へ」を押してください。');
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
  const selectedItemCardId = getSelectedItemCardId();

  for (const itemState of player.itemStates) {
    const card = cardMap.get(itemState.cardId);
    const row = document.createElement('div');
    row.className = `side-card-item with-image ${compactMode ? 'compact-item-row' : ''}`.trim();
    if (!compactMode && selectedItemCardId === itemState.cardId) row.classList.add('selected-side-card');

    const info = document.createElement('div');
    info.className = `side-card-info ${compactMode ? 'compact-item-info' : ''}`.trim();
    info.appendChild(createMiniImage(getCardImagePath(card), card.card_name));
    info.appendChild(createMiniCardMeta(card, '効果なし', compactMode));
    row.appendChild(info);

    if (itemState.used) {
      row.classList.add('used-item-row');
      const usedBadge = document.createElement('div');
      usedBadge.className = 'used-item-badge';
      usedBadge.textContent = '使用済み';
      row.appendChild(usedBadge);
    } else if (!compactMode) {
      const button = document.createElement('button');
      button.className = 'button secondary small';
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

  for (let index = 0; index < 25; index += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'board-cell';
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
      const moveText = hasAccel ? `移動可能（加速術: 残り${matchState.turnState.acceleratedMovesRemaining}回）` : (matchState.turnState.moved ? '移動済み' : '移動可能');
      let attackText = '攻撃可能';
      if (currentPlayerCannotAttackAfterMove()) {
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
    setPhaseInfoText(matchState.winner || '対戦が終了しました');
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
  syncActionButtonsState({
    itemPhaseDoneDisabled: roomBattleLocked || roomActionPending || !itemWindowOpen || itemSelected || !!pendingAction,
    moveDisabled: roomBattleLocked || roomActionPending || !battleActive || itemWindowOpen || pendingRedeployActive || !!pendingAction || postAttackMoveActive,
    attackDisabled: roomBattleLocked || roomActionPending || !battleActive || itemWindowOpen || pendingRedeployActive || !!pendingAction || postAttackMoveActive || currentPlayerCannotAttackAfterMove(),
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

function renderMatchArea() {
  renderMatchMeta();
  renderPlayerPanels();
  renderBoard();
  renderBattleLog();
  renderItemConfirmBox();
  renderActionConfirmBox();
}

function beginTurn(playerKey) {
  matchState.currentPlayer = playerKey;
  clearRoomPendingRequests();
  clearExpiredStartOfTurnEffects(playerKey);
  matchState.turnState = { moved: false, movedUnitId: null, attacked: false, attackCount: 0, attackUnitId: null, itemWindowOpen: true, itemUsed: false, selectedItemCardId: null, selectedItemTargetIndex: null, pendingAction: null, acceleratedUnitId: null, acceleratedMovesRemaining: 0, postAttackMoveUnitId: null, pendingRedeployCardId: null, pendingRedeployOwner: null };
  matchState.pendingRedeploys = [];
  revivePendingUnitsForPlayer(playerKey);
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
  addLog(message);
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
}

function moveSelectedUnit(targetIndex) {
  if (matchState.phase !== 'battle' || !matchState.selectedUnitId) return;
  const sourceIndex = findUnitIndexById(matchState.selectedUnitId);
  if (sourceIndex < 0) return;
  if (!getReachableMoveCells(matchState.selectedUnitId).includes(targetIndex)) return;

  const unit = matchState.board[sourceIndex];
  setPendingAction({
    type: 'move',
    unitId: unit.instanceId,
    unitName: unit.name,
    sourceIndex,
    targetIndex,
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
  matchState.board[pendingAction.targetIndex] = unit;
  matchState.board[sourceIndex] = null;

  const acceleratedThisTurn = matchState.turnState?.acceleratedUnitId === unit.instanceId && matchState.turnState.acceleratedMovesRemaining > 0;
  matchState.turnState.movedUnitId = unit.instanceId;
  if (acceleratedThisTurn) {
    matchState.turnState.acceleratedMovesRemaining -= 1;
    if (matchState.turnState.acceleratedMovesRemaining <= 0) {
      matchState.turnState.acceleratedMovesRemaining = 0;
      matchState.turnState.acceleratedUnitId = null;
      matchState.turnState.moved = true;
      addLog(`${unit.name} の加速術による追加移動を使い切りました`);
    } else {
      matchState.turnState.moved = false;
      addLog(`${unit.name} は加速術により、あと ${matchState.turnState.acceleratedMovesRemaining} 回移動できます`);
    }
  } else {
    matchState.turnState.moved = true;
  }

  matchState.actionMode = null;
  clearPendingAction();
  addLog(`${PLAYER_LABEL[unit.owner]} の ${unit.name} が ${pendingAction.fromLabel} から ${pendingAction.toLabel} へ移動しました`);
  if (isGlobalFieldEffectActive('field_no_attack_after_move')) {
    addLog('環境カード「暴風域」により、移動したユニットはこの手番に攻撃できません');
  }
  renderMatchArea();
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
  renderMatchArea();
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
    bonusText: attacker.cardId === 'RV-028' && isBackAttack(sourceIndex, targetIndex, defender.owner) ? '背後攻撃 +1' : '',
  };

  if (attacker.cardId === 'RV-017') {
    pending.previewText = `${defender.name} を攻撃し、同じ方向の2マス目に敵がいれば追加ダメージを与えます。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'range_2')) {
    const distance = getLineIndicesFromAttack(sourceIndex, targetIndex, 2).indexOf(targetIndex) + 1;
    pending.previewText = distance >= 2
      ? `${defender.name} は2マス先の敵ですが、弓兵の効果で攻撃できます。よければ確定してください。`
      : `${defender.name} を攻撃します。よければ確定してください。`;
  } else if (attacker.cardId === 'RV-031') {
    pending.previewText = `${defender.name} を攻撃します。攻撃後、狂戦士は自身に1ダメージを受けます。よければ確定してください。`;
  } else if (attacker.cardId === 'RV-033') {
    pending.previewText = `${formatCellLabel(targetIndex)} 方向へ貫通攻撃します。1マス目と2マス目の敵に軽減無視ダメージを与えます。よければ確定してください。`;
  } else if (attacker.cardId === 'RV-034') {
    pending.previewText = `${defender.name} を攻撃し、その対象に隣接する他の敵にも1ダメージを与えます。よければ確定してください。`;
  } else if (attacker.cardId === 'RV-040') {
    pending.previewText = `${defender.name} を攻撃し、さらに炎魔剣士の周囲1マスにいる全ユニットへ1ダメージを与えます（敵味方両方）。よければ確定してください。`;
  } else if (unitHasEffectType(attacker, 'on_kill_permanent_atk_plus_1')) {
    pending.previewText = `${defender.name} を攻撃します。血王 ヴェインが敵を撃破すると、攻撃力が1永続で上昇します。よければ確定してください。`;
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
  const attacker = matchState.board[sourceIndex];
  const defender = matchState.board[pendingAction.targetIndex];
  if (!attacker || !defender || defender.owner === attacker.owner) return;

  let defeatedByAttack = 0;
  const resolveAttackHit = (targetIndex, damage, options = {}) => {
    const result = applyAttackDamageToIndex(attacker, targetIndex, damage, { ...options, attackerIndex: sourceIndex });
    if (result.defeated) defeatedByAttack += 1;
    return result;
  };

  if (attacker.cardId === 'RV-017') {
    const line = getLineIndicesFromAttack(sourceIndex, pendingAction.targetIndex, 2);
    line.forEach((idx) => {
      const target = matchState.board[idx];
      if (!target || target.owner === attacker.owner) return;
      const damage = getAttackDamageAgainst(attacker, sourceIndex, target, idx);
      resolveAttackHit(idx, damage);
    });
  } else if (attacker.cardId === 'RV-033') {
    const line = getLineIndicesFromAttack(sourceIndex, pendingAction.targetIndex, 2);
    line.forEach((idx) => {
      const target = matchState.board[idx];
      if (!target || target.owner === attacker.owner) return;
      const damage = getEffectiveAtk(attacker, sourceIndex);
      resolveAttackHit(idx, damage, { ignoreReduction: true });
    });
  } else if (attacker.cardId === 'RV-034') {
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
    const before = attackerAfterPrimary.currentHp;
    attackerAfterPrimary.currentHp = Math.min(attackerAfterPrimary.maxHp, attackerAfterPrimary.currentHp + defeatedByAttack);
    const healed = attackerAfterPrimary.currentHp - before;
    if (healed > 0) {
      addLog(`${attackerAfterPrimary.name} は撃破効果で HP を ${healed} 回復しました`);
    }
  }
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'on_kill_permanent_atk_plus_1') && defeatedByAttack > 0) {
    attackerAfterPrimary.atk += defeatedByAttack;
    addLog(`${attackerAfterPrimary.name} は撃破効果で攻撃力が ${defeatedByAttack} 上昇しました（ATK ${attackerAfterPrimary.atk}）`);
  }
  if (attackerAfterPrimary && unitHasEffectType(attackerAfterPrimary, 'gain_hp_1_on_attack_permanent')) {
    attackerAfterPrimary.maxHp += 1;
    attackerAfterPrimary.currentHp += 1;
    addLog(`${attackerAfterPrimary.name} は攻撃効果で最大HPと現在HPが 1 上昇しました（${attackerAfterPrimary.currentHp}/${attackerAfterPrimary.maxHp}）`);
  }

  const attackerStillAliveIndex = findUnitIndexById(pendingAction.unitId);
  const attackerStillAlive = attackerStillAliveIndex >= 0 ? matchState.board[attackerStillAliveIndex] : null;

  if (attackerStillAlive && attackerStillAlive.cardId === 'RV-040') {
    const aroundTargets = getChebyshevNeighbors(attackerStillAliveIndex, 1)
      .filter((idx) => idx !== attackerStillAliveIndex)
      .filter((idx) => !!matchState.board[idx]);

    if (aroundTargets.length) {
      addLog(`${PLAYER_LABEL[attackerStillAlive.owner]} の ${attackerStillAlive.name} の効果が発動し、周囲1マスの全ユニットに炎が広がります`);
      aroundTargets.forEach((idx) => {
        const splashTarget = matchState.board[idx];
        if (!splashTarget) return;
        const creditPlayerKey = splashTarget.owner === attackerStillAlive.owner ? null : attackerStillAlive.owner;
        applyDamageToIndex(idx, 1, `${PLAYER_LABEL[attackerStillAlive.owner]} の ${attackerStillAlive.name} の炎が`, { creditPlayerKey });
      });
    }
  }

  const attackerAfterEffectsIndex = findUnitIndexById(pendingAction.unitId);
  const attackerAfterEffects = attackerAfterEffectsIndex >= 0 ? matchState.board[attackerAfterEffectsIndex] : null;
  if (attackerAfterEffects && attackerAfterEffects.cardId === 'RV-031') {
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
        addLog(`${attackerAfterAllEffects.name} は影に紛れ、${formatCellLabel(returnIndex)} に戻りました`);
      } else {
        addLog(`${attackerAfterAllEffects.name} は戻り先の ${formatCellLabel(returnIndex)} が埋まっているため戻れませんでした`);
      }
    }
  }

  renderMatchArea();

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
    if (pendingAction.type === 'move' && matchState.actionMode === 'move' && selectedUnit && !unit && getReachableMoveCells(matchState.selectedUnitId).includes(index)) {
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

  if (matchState.actionMode === 'move' && selectedUnit && !unit) {
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

  matchState = createEmptyMatchState();
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
  matchState = createEmptyMatchState();
  renderMatchArea();
}

function renderFieldLog(playerKey) {
  const player = getPlayerState(playerKey);
  const field = cardMap.get(player.fieldId);
  if (!field) return;
  if (field.effect_type === 'field_range_limit_adjacent_only') {
    addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」により、攻撃アイテムは自軍ユニットに隣接する敵にしか使えません`);
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
  addLog(`${PLAYER_LABEL[playerKey]}: 環境カード「${field.card_name}」の処理を記録しました`);
}

async function loadCards() {
  try {
    clearError();
    const response = await fetch(DATA_PATH, { cache: 'no-store' });
    if (!response.ok) throw new Error(`JSONの読み込みに失敗しました: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('JSONの形式が配列ではありません。');

    allCards = data;
    cardMap = new Map(allCards.map((card) => [card.card_id, card]));
    ownedCardIds = loadOwnedCards();
    savedDecks = loadSavedDecks();
    renderSavedDeckOptions();
    renderDeckPanel();
    renderCards();
    renderMatchArea();
  } catch (error) {
    console.error(error);
    showError('カードまたは保存済みデッキの読み込みで問題がありました。data/redvein_cards.json と保存済みデッキを確認してください。');
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
  saveOwnedCards();
  resetCurrentDeck();
  renderCards();
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
  if (currentPlayerCannotAttackAfterMove()) {
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
    bonusText: attacker.cardId === 'RV-028' && isBackAttack(sourceIndex, targetIndex, defender.owner) ? '背後攻撃 +1' : '',
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
      postAttackMoveUnitId: matchState.turnState?.postAttackMoveUnitId || null,
      pendingRedeployOwner: matchState.turnState?.pendingRedeployOwner || null,
    },
    players: {
      player1: {
        reserveBattleIds: [...(matchState.players.player1.reserveBattleIds || [])],
        fieldId: matchState.players.player1.fieldId || '',
        itemStates: (matchState.players.player1.itemStates || []).map((item) => ({ cardId: item.cardId, used: !!item.used })),
      },
      player2: {
        reserveBattleIds: [...(matchState.players.player2.reserveBattleIds || [])],
        fieldId: matchState.players.player2.fieldId || '',
        itemStates: (matchState.players.player2.itemStates || []).map((item) => ({ cardId: item.cardId, used: !!item.used })),
      },
    },
    pendingRevives: Array.isArray(matchState.pendingRevives) ? [...matchState.pendingRevives] : [],
    pendingRedeploys: [],
  };
}

function applyRoomStateSync(data = {}) {
  clearRoomPendingRequests();
  if (typeof data.currentPlayer === 'string') matchState.currentPlayer = data.currentPlayer;
  if (typeof data.round === 'number') matchState.round = data.round;
  if (typeof data.phase === 'string') matchState.phase = data.phase;
  if (matchState.turnState) {
    if (typeof data.itemPhaseOpen === 'boolean') matchState.turnState.itemWindowOpen = data.itemPhaseOpen;
    if (typeof data.itemUsed === 'boolean') matchState.turnState.itemUsed = data.itemUsed;
  }
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
};

loadCards();
