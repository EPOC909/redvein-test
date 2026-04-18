const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer } = require('ws');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const CARD_JSON_PATH = path.join(ROOT_DIR, 'data', 'redvein_cards.json');
const UNLOCK_TOKEN_SECRET = process.env.REDVEIN_UNLOCK_SECRET || 'redvein-unlock-secret-v18';

const SPECIAL_CARDS = [
  {
    card_id: 'SP-001',
    card_name: '禁書・魂断の頁',
    type: 'item',
    rarity: 'SP',
    hp: null,
    atk: null,
    move: null,
    effect_text: '敵1体を破壊する。この効果で破壊されたユニットは復活できない。',
    effect_type: 'destroy_single_no_revive',
    image_file: 'SP-001.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-002',
    card_name: '血月の杯',
    type: 'item',
    rarity: 'SP',
    hp: null,
    atk: null,
    move: null,
    effect_text: '味方1体のHPを3回復し、このターンATKを+1する。',
    effect_type: 'heal_single_3_atk_up_turn_1',
    image_file: 'SP-002.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-003',
    card_name: '王冠の勅命',
    type: 'item',
    rarity: 'SP',
    hp: null,
    atk: null,
    move: null,
    effect_text: '味方1体を選ぶ。そのユニットはこの手番中、追加で1回移動できる。さらに、移動後の最初の攻撃で攻撃力+1。',
    effect_type: 'royal_command_single',
    image_file: 'SP-003.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-004',
    card_name: '不滅の黒騎兵',
    type: 'battle',
    rarity: 'SP',
    hp: 5,
    atk: 2,
    move: 2,
    effect_text: '倒されるダメージを受けた時、1度だけHP1で耐える。',
    effect_type: 'survive_once_at_1',
    image_file: 'SP-004.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-005',
    card_name: '断罪の聖騎士',
    type: 'battle',
    rarity: 'SP',
    hp: 5,
    atk: 2,
    move: 1,
    effect_text: '自分より攻撃力の高い敵から受ける戦闘ダメージを-1する。',
    effect_type: 'reduce_damage_from_stronger_enemy_1',
    image_file: 'SP-005.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-006',
    card_name: '紅蓮の魔装兵',
    type: 'battle',
    rarity: 'SP',
    hp: 4,
    atk: 3,
    move: 1,
    effect_text: '攻撃時、対象に隣接する敵1体にも1ダメージを与える。',
    effect_type: 'splash_adjacent_enemy_1_on_attack',
    image_file: 'SP-006.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-007',
    card_name: '月影の処刑人',
    type: 'battle',
    rarity: 'SP',
    hp: 2,
    atk: 4,
    move: 2,
    effect_text: '斜めにも移動できる。',
    effect_type: 'diagonal_move',
    image_file: 'SP-007.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-008',
    card_name: '血月',
    type: 'field',
    rarity: 'SP',
    hp: null,
    atk: null,
    move: null,
    effect_text: '味方は中央9マスで戦う間、ATK+2。',
    effect_type: 'field_center_ally_atk_plus_2',
    image_file: 'SP-008.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-009',
    card_name: '王の玉座',
    type: 'field',
    rarity: 'SP',
    hp: null,
    atk: null,
    move: null,
    effect_text: '中央9マスにいる味方は受けるダメージ-1、ATK+1。',
    effect_type: 'field_center_ally_guard_1_atk_plus_1',
    image_file: 'SP-009.png',
    unlock_only: true,
  },
  {
    card_id: 'SP-010',
    card_name: '真祖血姫 ヴェイン',
    type: 'battle',
    rarity: 'SP',
    hp: 6,
    atk: 3,
    move: 2,
    effect_text: '敵を破壊するたび、自身のHPを1回復する。HPが満タンならATK+1。',
    effect_type: 'on_kill_heal_1_else_atk_plus_1',
    image_file: 'SP-010.png',
    unlock_only: true,
  },
  {
    card_id: "RV-051",
    card_name: "幽灯の仮面",
    type: "item",
    rarity: "N",
    hp: null,
    atk: null,
    move: null,
    effect_text: "次の相手ラウンド終了時まで、敵の環境カードの効果を無効にする。",
    effect_type: "negate_enemy_field_until_next_opponent_round",
    image_file: "RV-051.png",
    unlock_only: true,
  },
  {
    card_id: "RV-052",
    card_name: "灰冠の籠手",
    type: "item",
    rarity: "N",
    hp: null,
    atk: null,
    move: null,
    effect_text: "味方1体を選ぶ。このターン、そのユニットは敵アイテムの対象にならない。",
    effect_type: "untargetable_by_enemy_items_turn_1",
    image_file: "RV-052.png",
    unlock_only: true,
  },
  {
    card_id: "RV-053",
    card_name: "宵喰の呪鎖",
    type: "item",
    rarity: "R",
    hp: null,
    atk: null,
    move: null,
    effect_text: "中央9マスにいる敵1体を選ぶ。次の相手ラウンド終了時まで、そのユニットは攻撃力上昇・ダメージ軽減・HP回復を受けず、効果も失う。",
    effect_type: "center_silence_and_negate_buffs_heal_until_next_opponent_round",
    image_file: "RV-053.png",
    unlock_only: true,
  },
  {
    card_id: "RV-054",
    card_name: "竜骨の戦冠",
    type: "item",
    rarity: "R",
    hp: null,
    atk: null,
    move: null,
    effect_text: "味方1体を選ぶ。次にそのユニットが受ける「破壊」「行動不能」「攻撃不能」のいずれか1つを無効にする。",
    effect_type: "negate_next_destroy_or_stun_or_disable_attack_once",
    image_file: "RV-054.png",
    unlock_only: true,
  },
  {
    card_id: "RV-055",
    card_name: "神授の杯冠",
    type: "item",
    rarity: "R",
    hp: null,
    atk: null,
    move: null,
    effect_text: "味方1体のHPを2回復し、「攻撃不能」「行動不能」「移動力-1」のいずれか1つを解除する。",
    effect_type: "heal_2_and_cleanse_one_status",
    image_file: "RV-055.png",
    unlock_only: true,
  },
  {
    card_id: "RV-056",
    card_name: "朱蓮の鳳刀",
    type: "battle",
    rarity: "R",
    hp: 3,
    atk: 2,
    move: 2,
    effect_text: "HPが満タンの敵、またはこのラウンドにHPを回復した敵を攻撃すると攻撃力+1。",
    effect_type: "atk_plus_1_vs_full_or_healed_enemy",
    image_file: "RV-056.png",
    unlock_only: true,
  },
  {
    card_id: "RV-057",
    card_name: "天輝の細剣",
    type: "battle",
    rarity: "R",
    hp: 2,
    atk: 2,
    move: 2,
    effect_text: "このユニットは移動の代わりに、隣接する味方1体と位置を入れ替えてよい。位置を入れ替えたターン、隣接する味方1体の「攻撃不能」「行動不能」「移動力-1」のいずれか1つを解除する。",
    effect_type: "swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap",
    image_file: "RV-057.png",
    unlock_only: true,
  },
  {
    card_id: "RV-058",
    card_name: "白鱗の皇薙",
    type: "battle",
    rarity: "R",
    hp: 4,
    atk: 2,
    move: 1,
    effect_text: "このユニットが中央9マスにいる間、隣接する味方ユニットは敵アイテムの対象にならない。",
    effect_type: "center_aura_adjacent_allies_untargetable_by_enemy_items",
    image_file: "RV-058.png",
    unlock_only: true,
  },
  {
    card_id: "RV-059",
    card_name: "蝕月の断鎌",
    type: "battle",
    rarity: "R",
    hp: 3,
    atk: 3,
    move: 2,
    effect_text: "攻撃力が上がっている敵、またはダメージ軽減を受けている敵を攻撃すると攻撃力+1。さらに、その攻撃はダメージ軽減を無視する。",
    effect_type: "atk_plus_1_vs_buffed_or_reduced_enemy_and_ignore_reduction",
    image_file: "RV-059.png",
    unlock_only: true,
  },
  {
    card_id: "RV-060",
    card_name: "炎極の宝珠",
    type: "item",
    rarity: "SR",
    hp: null,
    atk: null,
    move: null,
    effect_text: "味方1体を選ぶ。このターン、そのユニットの次の攻撃でダメージを受けた敵は、次の相手ラウンド終了時までHPを回復できず、復活もできない。",
    effect_type: "mark_attack_target_no_heal_no_revive_until_next_opponent_round",
    image_file: "RV-060.png",
    unlock_only: true,
  },
  {
    card_id: "RV-061",
    card_name: "逆鱗の印璽",
    type: "item",
    rarity: "SR",
    hp: null,
    atk: null,
    move: null,
    effect_text: "敵1体を選ぶ。次の相手ラウンド終了時まで、そのユニットが受ける攻撃力上昇・ダメージ軽減・HP回復を無効にする。",
    effect_type: "negate_buffs_and_heal_until_next_opponent_round",
    image_file: "RV-061.png",
    unlock_only: true,
  },
  {
    card_id: "RV-062",
    card_name: "深澪の蒼核",
    type: "item",
    rarity: "SR",
    hp: null,
    atk: null,
    move: null,
    effect_text: "敵1体を選ぶ。次の相手ラウンド終了時まで、そのユニットは中央9マスにいる間、効果を失い、攻撃できない。",
    effect_type: "silence_and_disable_attack_while_in_center_until_next_opponent_round",
    image_file: "RV-062.png",
    unlock_only: true,
  },
  {
    card_id: "RV-063",
    card_name: "星祈の聖槍",
    type: "battle",
    rarity: "SR",
    hp: 3,
    atk: 2,
    move: 1,
    effect_text: "隣接する味方ユニットは、敵アイテムから受けるダメージを1減らし、行動不能にならない。",
    effect_type: "aura_item_damage_minus_1_and_no_stun",
    image_file: "RV-063.png",
    unlock_only: true,
  },
  {
    card_id: "RV-064",
    card_name: "蒼淵の海剣",
    type: "battle",
    rarity: "SR",
    hp: 4,
    atk: 2,
    move: 1,
    effect_text: "このユニットは敵の環境カードの効果を受けない。さらに、中央9マスにいる間、受けるダメージ-1。",
    effect_type: "ignore_enemy_field_effects_and_center_guard_1",
    image_file: "RV-064.png",
    unlock_only: true,
  },
  {
    card_id: "RV-065",
    card_name: "降神の祭壇",
    type: "field",
    rarity: "SR",
    hp: null,
    atk: null,
    move: null,
    effect_text: "ターン開始時に中央9マスにいる味方ユニットをHP1回復、受けている攻撃不能・行動不能・移動力-1をすべて解除する。",
    effect_type: "field_start_round_heal_1_and_cleanse_center_ally",
    image_file: "RV-065.png",
    unlock_only: true,
  },
  {
    card_id: "RV-066",
    card_name: "海底継承殿",
    type: "field",
    rarity: "SR",
    hp: null,
    atk: null,
    move: null,
    effect_text: "中央9マスにいる自分のユニットは、敵アイテムの効果で破壊されない。",
    effect_type: "field_center_allies_cannot_be_destroyed_by_enemy_items",
    image_file: "RV-066.png",
    unlock_only: true,
  },
  {
    card_id: "RV-067",
    card_name: "焔継の王剣",
    type: "battle",
    rarity: "SSR",
    hp: 4,
    atk: 3,
    move: 1,
    effect_text: "中央9マスの敵を攻撃するとき、その敵が受けているダメージ軽減を無視する。さらに、その敵が環境カードによる攻撃力上昇またはダメージ軽減を受けているなら、攻撃力+1。",
    effect_type: "ignore_reduction_vs_center_enemy_and_atk_plus_1_if_field_buffed",
    image_file: "RV-067.png",
    unlock_only: true,
  },
  {
    card_id: "RV-068",
    card_name: "竜骸の覇斧",
    type: "battle",
    rarity: "SSR",
    hp: 5,
    atk: 3,
    move: 1,
    effect_text: "このユニットは試合中1回だけ、敵のアイテムまたは環境カードの効果による「破壊」「行動不能」「攻撃不能」を無効にする。さらに、このユニットが中央9マスにいる間、隣接する味方ユニットは敵アイテムの効果で破壊されない。",
    effect_type: "negate_destroy_stun_disable_once_from_enemy_item_or_field_and_center_aura_adjacent_allies_no_item_destroy",
    image_file: "RV-068.png",
    unlock_only: true,
  },
  {
    card_id: "RV-069",
    card_name: "蒼炎のレイン",
    type: "battle",
    rarity: "SSR",
    hp: 5,
    atk: 3,
    move: 2,
    effect_text: "このユニットは敵の環境カードの効果を受けない。さらに、このユニットが中央9マスにいる間、中央9マスの敵ユニットは環境カードによる攻撃力上昇・ダメージ軽減・HP回復を受けない。さらに、中央9マスの敵を攻撃するとき、その攻撃はダメージ軽減を無視する。",
    effect_type: "ignore_enemy_field_effects_self_and_center_aura_negate_enemy_field_buffs_heal_and_ignore_reduction_vs_center",
    image_file: "RV-069.png",
    unlock_only: true,
  },
  {
    card_id: "RV-070",
    card_name: "冥鎖の双刃",
    type: "battle",
    rarity: "SSR",
    hp: 4,
    atk: 3,
    move: 2,
    effect_text: "このユニットからダメージを受けた敵は、次の相手ラウンド終了時までHPを回復できない。その状態の敵が倒された場合、復活できない。さらに、HPが満タンの敵、またはこのラウンドにHPを回復した敵を攻撃すると攻撃力+1。",
    effect_type: "on_damage_apply_no_heal_until_next_opponent_round_and_no_revive_if_destroyed_plus_atk_1_vs_full_or_healed_enemy",
    image_file: "RV-070.png",
    unlock_only: true,
  },
];

const UNLOCK_CODE_DEFS = [
  { code: 'SOUL-PAGE-001', normalizedCode: 'SOULPAGE001', label: '禁書・魂断の頁', cardIds: ['SP-001'] },
  { code: 'BLOOD-CUP-002', normalizedCode: 'BLOODCUP002', label: '血月の杯', cardIds: ['SP-002'] },
  { code: 'ROYAL-ORDER-003', normalizedCode: 'ROYALORDER003', label: '王冠の勅命', cardIds: ['SP-003'] },
  { code: 'BLACK-KNIGHT-004', normalizedCode: 'BLACKKNIGHT004', label: '不滅の黒騎兵', cardIds: ['SP-004'] },
  { code: 'JUDGEMENT-005', normalizedCode: 'JUDGEMENT005', label: '断罪の聖騎士', cardIds: ['SP-005'] },
  { code: 'CRIMSON-006', normalizedCode: 'CRIMSON006', label: '紅蓮の魔装兵', cardIds: ['SP-006'] },
  { code: 'MOONSHADOW-007', normalizedCode: 'MOONSHADOW007', label: '月影の処刑人', cardIds: ['SP-007'] },
  { code: 'BLOOD-MOON-008', normalizedCode: 'BLOODMOON008', label: '血月', cardIds: ['SP-008'] },
  { code: 'THRONE-009', normalizedCode: 'THRONE009', label: '王の玉座', cardIds: ['SP-009'] },
  { code: 'TRUE-VEIN-010', normalizedCode: 'TRUEVEIN010', label: '真祖血姫 ヴェイン', cardIds: ['SP-010'] },
  { code: "SHINSOU-051", normalizedCode: "SHINSOU051", label: "幽灯の仮面", cardIds: ["RV-051"] },
  { code: "SHINSOU-052", normalizedCode: "SHINSOU052", label: "灰冠の籠手", cardIds: ["RV-052"] },
  { code: "SHINSOU-053", normalizedCode: "SHINSOU053", label: "宵喰の呪鎖", cardIds: ["RV-053"] },
  { code: "SHINSOU-054", normalizedCode: "SHINSOU054", label: "竜骨の戦冠", cardIds: ["RV-054"] },
  { code: "SHINSOU-055", normalizedCode: "SHINSOU055", label: "神授の杯冠", cardIds: ["RV-055"] },
  { code: "SHINSOU-056", normalizedCode: "SHINSOU056", label: "朱蓮の鳳刀", cardIds: ["RV-056"] },
  { code: "SHINSOU-057", normalizedCode: "SHINSOU057", label: "天輝の細剣", cardIds: ["RV-057"] },
  { code: "SHINSOU-058", normalizedCode: "SHINSOU058", label: "白鱗の皇薙", cardIds: ["RV-058"] },
  { code: "SHINSOU-059", normalizedCode: "SHINSOU059", label: "蝕月の断鎌", cardIds: ["RV-059"] },
  { code: "SHINSOU-060", normalizedCode: "SHINSOU060", label: "炎極の宝珠", cardIds: ["RV-060"] },
  { code: "SHINSOU-061", normalizedCode: "SHINSOU061", label: "逆鱗の印璽", cardIds: ["RV-061"] },
  { code: "SHINSOU-062", normalizedCode: "SHINSOU062", label: "深澪の蒼核", cardIds: ["RV-062"] },
  { code: "SHINSOU-063", normalizedCode: "SHINSOU063", label: "星祈の聖槍", cardIds: ["RV-063"] },
  { code: "SHINSOU-064", normalizedCode: "SHINSOU064", label: "蒼淵の海剣", cardIds: ["RV-064"] },
  { code: "SHINSOU-065", normalizedCode: "SHINSOU065", label: "降神の祭壇", cardIds: ["RV-065"] },
  { code: "SHINSOU-066", normalizedCode: "SHINSOU066", label: "海底継承殿", cardIds: ["RV-066"] },
  { code: "SHINSOU-067", normalizedCode: "SHINSOU067", label: "焔継の王剣", cardIds: ["RV-067"] },
  { code: "SHINSOU-068", normalizedCode: "SHINSOU068", label: "竜骸の覇斧", cardIds: ["RV-068"] },
  { code: "SHINSOU-069", normalizedCode: "SHINSOU069", label: "蒼炎のレイン", cardIds: ["RV-069"] },
  { code: "SHINSOU-070", normalizedCode: "SHINSOU070", label: "冥鎖の双刃", cardIds: ["RV-070"] },
];

const UNLOCK_CODE_MAP = new Map(UNLOCK_CODE_DEFS.map((entry) => [entry.normalizedCode, entry]));

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
};

const rooms = new Map();
const ROOM_STATE_PATH = path.join(ROOT_DIR, 'rooms_state.json');
const ROOM_PERSIST_VERSION = 1;
const ROOM_PERSIST_DEBOUNCE_MS = 250;
const ROOM_STALE_DELETE_MS = 24 * 60 * 60 * 1000;
const baseCards = loadCards();
const cards = [...baseCards, ...SPECIAL_CARDS];
const cardMap = new Map(cards.map((card) => [card.card_id, card]));
const SPECIAL_CARD_IDS = new Set(SPECIAL_CARDS.map((card) => card.card_id));
const BASE_CARD_IDS = new Set(baseCards.map((card) => card.card_id));
const validCardIds = new Set(cards.map((card) => card.card_id));
const SETUP_SEQUENCE = [
  { player: 'player1', count: 3 },
  { player: 'player2', count: 2 },
  { player: 'player1', count: 2 },
  { player: 'player2', count: 3 },
];
const HOME_COLUMN = { player1: 0, player2: 4 };
const PLAYER_ROLE_MAP = { p1: 'player1', p2: 'player2' };
const DUPLICATE_WINDOW_MS = 700;
const RECONNECT_GRACE_MS = 12 * 60 * 60 * 1000;
let persistRoomsTimer = null;

function loadCards() {
  try {
    const raw = fs.readFileSync(CARD_JSON_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('カードJSONの読み込みに失敗しました。', error);
    return [];
  }
}


function normalizeSaveKey(value) {
  return String(value || '').trim().replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
}

function normalizeUnlockCode(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 128) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input) {
  const normalized = String(input || '').replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, 'base64').toString('utf-8');
}

function signUnlockBody(encodedBody) {
  return crypto.createHmac('sha256', UNLOCK_TOKEN_SECRET).update(encodedBody).digest('base64url');
}

function issueUnlockToken(saveKey, cardIds) {
  const normalizedSaveKey = normalizeSaveKey(saveKey);
  const ids = [...new Set((Array.isArray(cardIds) ? cardIds : []).map(String).filter((id) => SPECIAL_CARD_IDS.has(id)))].sort();
  const payload = {
    v: 1,
    saveKey: normalizedSaveKey,
    cardIds: ids,
  };
  const encodedBody = base64UrlEncode(JSON.stringify(payload));
  const signature = signUnlockBody(encodedBody);
  return `${encodedBody}.${signature}`;
}

function verifyUnlockToken(token, saveKey = '') {
  const source = String(token || '').trim();
  if (!source.includes('.')) return null;
  const [encodedBody, signature] = source.split('.');
  if (!encodedBody || !signature) return null;
  const expected = signUnlockBody(encodedBody);
  if (signature !== expected) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(encodedBody));
    const payloadSaveKey = normalizeSaveKey(payload?.saveKey || '');
    const expectedSaveKey = normalizeSaveKey(saveKey || payloadSaveKey);
    if (!payloadSaveKey || payloadSaveKey !== expectedSaveKey) return null;
    const cardIds = [...new Set((Array.isArray(payload?.cardIds) ? payload.cardIds : []).map(String).filter((id) => SPECIAL_CARD_IDS.has(id)))];
    if (!cardIds.length) return null;
    return {
      saveKey: payloadSaveKey,
      cardIds,
    };
  } catch (_) {
    return null;
  }
}

function sanitizeUnlockTokens(tokens) {
  if (!Array.isArray(tokens)) return [];
  const deduped = [];
  const seen = new Set();
  for (const token of tokens) {
    const value = String(token || '').trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    deduped.push(value);
    if (deduped.length >= 64) break;
  }
  return deduped;
}

function collectUnlockedCardIds(saveKey, unlockTokens) {
  const ids = new Set();
  for (const token of sanitizeUnlockTokens(unlockTokens)) {
    const verified = verifyUnlockToken(token, saveKey);
    if (!verified) continue;
    verified.cardIds.forEach((id) => ids.add(id));
  }
  return ids;
}

function buildCatalogForSaveKey(saveKey, unlockTokens) {
  const unlockedCardIds = collectUnlockedCardIds(saveKey, unlockTokens);
  const visibleCards = [
    ...baseCards,
    ...SPECIAL_CARDS.filter((card) => unlockedCardIds.has(card.card_id)),
  ];
  return {
    cards: visibleCards,
    unlockedCardIds: [...unlockedCardIds],
  };
}

function sanitizeUnlockAuth(data) {
  return {
    saveKey: normalizeSaveKey(data?.saveKey || ''),
    unlockTokens: sanitizeUnlockTokens(data?.unlockTokens),
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function send(ws, payload) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify(payload));
}

function makeRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i += 1) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function createControlRequests() {
  return {
    rematch: { p1: false, p2: false },
    reset: { p1: false, p2: false },
  };
}

function createPlayerStatus() {
  return {
    negateEnemyFieldUntilOwnTurnStart: false,
  };
}

function clearRoomControlRequests(room) {
  room.controlRequests = createControlRequests();
}

function createEmptyRoom(roomId) {
  return {
    roomId,
    roomState: 'waiting',
    p1: null,
    p2: null,
    spectator: null,
    game: null,
    controlRequests: createControlRequests(),
    updatedAt: Date.now(),
  };
}

function cloneJsonSafe(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return fallback;
  }
}

function persistableParticipant(slot) {
  if (!slot) return null;
  const { ws, ...rest } = slot;
  return {
    ...cloneJsonSafe(rest, {}),
    role: slot.role,
    reconnectToken: String(slot.reconnectToken || crypto.randomUUID()),
    disconnectedAt: Number(slot.disconnectedAt || 0),
    joinedAt: Number(slot.joinedAt || Date.now()),
  };
}

function persistableRoom(room) {
  if (!room) return null;
  return {
    roomId: String(room.roomId || '').toUpperCase(),
    roomState: computeRoomState(room),
    p1: persistableParticipant(room.p1),
    p2: persistableParticipant(room.p2),
    spectator: persistableParticipant(room.spectator),
    game: cloneJsonSafe(room.game, null),
    controlRequests: serializeControlRequests(room),
    updatedAt: Number(room.updatedAt || Date.now()),
  };
}

function writeRoomsToDisk() {
  persistRoomsTimer = null;
  try {
    const payload = {
      v: ROOM_PERSIST_VERSION,
      savedAt: Date.now(),
      rooms: Array.from(rooms.values())
        .map((room) => persistableRoom(room))
        .filter(Boolean),
    };
    fs.writeFileSync(ROOM_STATE_PATH, JSON.stringify(payload), 'utf-8');
  } catch (error) {
    console.error('ルーム保存に失敗しました。', error);
  }
}

function scheduleRoomsPersist() {
  if (persistRoomsTimer) clearTimeout(persistRoomsTimer);
  persistRoomsTimer = setTimeout(writeRoomsToDisk, ROOM_PERSIST_DEBOUNCE_MS);
  if (typeof persistRoomsTimer.unref === 'function') persistRoomsTimer.unref();
}

function markRoomChanged(room) {
  if (room) {
    room.updatedAt = Date.now();
    room.roomState = computeRoomState(room);
  }
  scheduleRoomsPersist();
}

function hydrateParticipant(raw, role, hydratedAt) {
  if (!raw || typeof raw !== 'object') return null;
  const deckPayload = role === 'spectator' ? null : sanitizeDeckPayload(raw.deckPayload);
  return {
    role,
    displayName: String(raw.displayName || '名無しプレイヤー'),
    deckName: String(raw.deckName || deckPayload?.name || 'デッキ未選択'),
    deckPayload,
    saveKey: normalizeSaveKey(raw.saveKey || ''),
    unlockTokens: sanitizeUnlockTokens(raw.unlockTokens),
    reconnectToken: String(raw.reconnectToken || crypto.randomUUID()),
    ws: null,
    disconnectedAt: Number(raw.disconnectedAt || hydratedAt || Date.now()),
    joinedAt: Number(raw.joinedAt || hydratedAt || Date.now()),
  };
}

function hydratePersistedRoom(raw, hydratedAt = Date.now()) {
  if (!raw || typeof raw !== 'object') return null;
  const roomId = String(raw.roomId || '').toUpperCase();
  if (!roomId) return null;
  const room = createEmptyRoom(roomId);
  room.p1 = hydrateParticipant(raw.p1, 'p1', hydratedAt);
  room.p2 = hydrateParticipant(raw.p2, 'p2', hydratedAt);
  room.spectator = hydrateParticipant(raw.spectator, 'spectator', hydratedAt);
  room.game = raw.game && typeof raw.game === 'object' ? cloneJsonSafe(raw.game, null) : null;
  room.controlRequests = serializeControlRequests({ controlRequests: raw.controlRequests });
  room.updatedAt = Number(raw.updatedAt || hydratedAt || Date.now());
  room.roomState = computeRoomState(room);
  return room;
}

function loadPersistedRooms() {
  try {
    if (!fs.existsSync(ROOM_STATE_PATH)) return;
    const raw = fs.readFileSync(ROOM_STATE_PATH, 'utf-8');
    if (!raw.trim()) return;
    const payload = JSON.parse(raw);
    const list = Array.isArray(payload?.rooms) ? payload.rooms : [];
    const hydratedAt = Date.now();
    let restoredCount = 0;
    list.forEach((entry) => {
      const room = hydratePersistedRoom(entry, hydratedAt);
      if (!room) return;
      const staleAge = hydratedAt - Number(room.updatedAt || hydratedAt);
      if (!room.p1 && !room.p2 && !room.spectator) return;
      if (staleAge > ROOM_STALE_DELETE_MS) return;
      rooms.set(room.roomId, room);
      restoredCount += 1;
    });
    if (restoredCount > 0) {
      console.log(`保存済みルームを ${restoredCount} 件復元しました。`);
      scheduleRoomsPersist();
    }
  } catch (error) {
    console.error('保存済みルームの復元に失敗しました。', error);
  }
}

function sanitizeDeckPayload(deck) {
  if (!deck || typeof deck !== 'object') return null;
  return {
    name: String(deck.name || '').trim(),
    battle: Array.isArray(deck.battle) ? deck.battle.map(String) : [],
    item: Array.isArray(deck.item) ? deck.item.map(String) : [],
    field: Array.isArray(deck.field) ? deck.field.map(String) : [],
  };
}


function collectDeckCardIds(deck) {
  if (!deck || typeof deck !== 'object') return [];
  const ids = [];
  for (const key of ['battle', 'item', 'field']) {
    const list = Array.isArray(deck[key]) ? deck[key] : [];
    for (const rawId of list) {
      const id = String(rawId || '').trim();
      if (id) ids.push(id);
    }
  }
  return ids;
}

function collectCardsForDecks(...decks) {
  const seen = new Set();
  const result = [];
  for (const deck of decks) {
    for (const id of collectDeckCardIds(deck)) {
      if (seen.has(id)) continue;
      seen.add(id);
      const card = cardMap.get(id);
      if (card) result.push(card);
    }
  }
  return result;
}

function validateDeckPayload(deck, saveKey = '', unlockTokens = []) {
  if (!deck) return false;
  if (deck.battle.length !== 5 || deck.item.length !== 4 || deck.field.length !== 1) return false;
  const ids = [...deck.battle, ...deck.item, ...deck.field];
  const unlockedCardIds = collectUnlockedCardIds(saveKey, unlockTokens);
  return ids.every((id) => {
    if (BASE_CARD_IDS.has(id)) return true;
    if (SPECIAL_CARD_IDS.has(id)) return unlockedCardIds.has(id);
    return false;
  });
}

function participantSnapshot(slot) {
  if (!slot) return null;
  const connected = Boolean(slot.ws && slot.ws.readyState === 1);
  const disconnectedAt = connected ? 0 : Number(slot.disconnectedAt || 0);
  const reconnectRemainingMs = disconnectedAt ? Math.max(0, RECONNECT_GRACE_MS - (Date.now() - disconnectedAt)) : 0;
  return {
    displayName: slot.displayName,
    deckName: slot.deckName,
    connected,
    disconnectedAt,
    reconnectRemainingMs,
  };
}

function computeRoomState(room) {
  if (room.game?.phase === 'finished') return 'finished';
  if (room.game) return 'playing';
  if (room.p1 && room.p2) return 'ready';
  return 'waiting';
}

function serializeControlRequests(room) {
  const source = room?.controlRequests || createControlRequests();
  return {
    rematch: {
      p1: !!source.rematch?.p1,
      p2: !!source.rematch?.p2,
    },
    reset: {
      p1: !!source.reset?.p1,
      p2: !!source.reset?.p2,
    },
  };
}

function roomSnapshot(room, role) {
  return {
    type: 'room_snapshot',
    roomId: room.roomId,
    roomState: room.roomState,
    role,
    p1: participantSnapshot(room.p1),
    p2: participantSnapshot(room.p2),
    spectator: participantSnapshot(room.spectator),
    controlRequests: serializeControlRequests(room),
  };
}

function broadcastRoom(room, noticeMessage = '') {
  markRoomChanged(room);
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([role, slot]) => {
    if (slot?.ws) {
      send(slot.ws, roomSnapshot(room, role));
      if (noticeMessage) send(slot.ws, { type: 'server_notice', message: noticeMessage });
    }
  });
}

function startRoomGameRound(room, startNotice = '') {
  if (!room || !room.p1 || !room.p2) return { ok: false, message: 'P1 と P2 が揃ってから開始してください。' };
  if (!validateDeckPayload(room.p1.deckPayload, room.p1.saveKey, room.p1.unlockTokens) || !validateDeckPayload(room.p2.deckPayload, room.p2.saveKey, room.p2.unlockTokens)) {
    return { ok: false, message: 'どちらかのデッキが不正です。入り直してください。' };
  }
  clearRoomControlRequests(room);
  room.game = createInitialGameState(room);
  markRoomChanged(room);
  const payload = makeGameStartedPayload(room);
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([role, slot]) => {
    if (slot?.ws) {
      send(slot.ws, payload);
      send(slot.ws, roomSnapshot(room, role));
      if (startNotice) send(slot.ws, { type: 'server_notice', message: startNotice });
    }
  });
  return { ok: true };
}

function makeGameStartedPayload(room) {
  if (!room.game) return null;
  return {
    type: 'game_started',
    roomId: room.roomId,
    roomState: room.roomState,
    p1Deck: room.game.p1Deck,
    p2Deck: room.game.p2Deck,
    deckCards: collectCardsForDecks(room.game.p1Deck, room.game.p2Deck),
    phase: room.game.phase,
    currentPlayer: room.game.currentPlayer,
    round: room.game.round,
    setupStepIndex: room.game.setupStepIndex,
    placedInCurrentStep: room.game.placedInCurrentStep,
    placements: room.game.placements || [],
  };
}

function attachParticipant(room, role, data, ws) {
  const reconnectToken = crypto.randomUUID();
  const deckPayload = role === 'spectator' ? null : sanitizeDeckPayload(data.deckPayload);
  room[role] = {
    role,
    displayName: data.displayName || '名無しプレイヤー',
    deckName: data.deckName || deckPayload?.name || 'デッキ未選択',
    deckPayload,
    saveKey: normalizeSaveKey(data.saveKey || ''),
    unlockTokens: sanitizeUnlockTokens(data.unlockTokens),
    reconnectToken,
    ws,
    disconnectedAt: 0,
    joinedAt: Date.now(),
  };
  ws.meta = { roomId: room.roomId, role, reconnectToken };
  room.roomState = computeRoomState(room);
  send(ws, {
    type: 'room_joined',
    roomId: room.roomId,
    roomState: room.roomState,
    role,
    reconnectToken,
    deckName: room[role].deckName,
    p1: participantSnapshot(room.p1),
    p2: participantSnapshot(room.p2),
    spectator: participantSnapshot(room.spectator),
    game: makeGameStartedPayload(room),
  });
  broadcastRoom(room, `${role.toUpperCase()} が参加しました。`);
}

function createTurnState() {
  return {
    moved: false,
    movedUnitId: null,
    attacked: false,
    attackCount: 0,
    attackUnitId: null,
    itemWindowOpen: true,
    itemUsed: false,
    acceleratedUnitId: null,
    acceleratedMovesRemaining: 0,
    royalCommandUnitId: null,
    royalCommandAttackReady: false,
    postAttackMoveUnitId: null,
    lastActionByPlayer: {
      player1: { signature: '', at: 0 },
      player2: { signature: '', at: 0 },
    },
  };
}

function createUnitState(cardId, owner, forcedInstanceId = '') {
  const card = cardMap.get(cardId);
  return {
    instanceId: forcedInstanceId || `unit-${crypto.randomUUID().slice(0, 8)}`,
    cardId,
    owner,
    name: card?.card_name || cardId,
    atk: Number(card?.atk) || 0,
    move: Number(card?.move) || 1,
    currentHp: Number(card?.hp) || 1,
    maxHp: Number(card?.hp) || 1,
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

function createInitialGameState(room) {
  return {
    startedAt: Date.now(),
    p1Deck: room.p1.deckPayload,
    p2Deck: room.p2.deckPayload,
    phase: 'setup',
    currentPlayer: 'player1',
    round: 1,
    itemPhaseOpen: false,
    itemUsed: false,
    setupStepIndex: 0,
    placedInCurrentStep: 0,
    board: Array(25).fill(null),
    reserveBattleIds: {
      player1: [...room.p1.deckPayload.battle],
      player2: [...room.p2.deckPayload.battle],
    },
    itemHands: {
      player1: [...room.p1.deckPayload.item],
      player2: [...room.p2.deckPayload.item],
    },
    fieldIds: {
      player1: room.p1.deckPayload.field[0] || '',
      player2: room.p2.deckPayload.field[0] || '',
    },
    placements: [],
    turnState: createTurnState(),
    pendingRevives: [],
    pendingRedeploys: [],
    winner: '',
    playerStatus: {
      player1: createPlayerStatus(),
      player2: createPlayerStatus(),
    },
  };
}

function getEliminationFinishMessage(game) {
  if (!game || !['battle', 'finished'].includes(game.phase)) return '';
  const p1Alive = game.board.filter((unit) => unit && unit.owner === 'player1').length;
  const p2Alive = game.board.filter((unit) => unit && unit.owner === 'player2').length;
  const p1Active = p1Alive > 0 || (Array.isArray(game.pendingRedeploys) && game.pendingRedeploys.some((item) => item && item.owner === 'player1'));
  const p2Active = p2Alive > 0 || (Array.isArray(game.pendingRedeploys) && game.pendingRedeploys.some((item) => item && item.owner === 'player2'));
  if (!p1Active && !p2Active) return '両者全滅により引き分けです';
  if (!p1Active) return 'プレイヤー2の全滅勝ちです';
  if (!p2Active) return 'プレイヤー1の全滅勝ちです';
  return '';
}

function finalizeRoomGameIfNeeded(room, explicitMessage = '') {
  if (!room?.game || room.game.phase === 'finished') return false;
  const finishMessage = explicitMessage || getEliminationFinishMessage(room.game);
  if (!finishMessage) return false;
  room.game.phase = 'finished';
  room.game.winner = finishMessage;
  room.roomState = 'finished';
  markRoomChanged(room);
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([role, slot]) => {
    if (!slot?.ws) return;
    send(slot.ws, roomSnapshot(room, role));
    send(slot.ws, {
      type: 'game_finished',
      roomId: room.roomId,
      message: finishMessage,
      phase: room.game.phase,
      currentPlayer: room.game.currentPlayer,
      round: room.game.round,
    });
  });
  return true;
}

function indexToCoord(index) {
  return { row: Math.floor(index / 5), col: index % 5 };
}

function coordToIndex(row, col) {
  return row * 5 + col;
}

function isPointZoneIndex(index) {
  const { row, col } = indexToCoord(index);
  return row >= 1 && row <= 3 && col >= 1 && col <= 3;
}

function getOrthogonalNeighbors(index) {
  const { row, col } = indexToCoord(index);
  const cells = [];
  [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    if (r < 0 || r > 4 || c < 0 || c > 4) return;
    cells.push(coordToIndex(r, c));
  });
  return cells;
}

function getCurrentSetupStep(game) {
  return SETUP_SEQUENCE[game.setupStepIndex] || null;
}

function getPlaceableCells(game) {
  const step = getCurrentSetupStep(game);
  if (!step) return [];
  const column = HOME_COLUMN[step.player];
  const cells = [];
  for (let row = 0; row < 5; row += 1) {
    const index = row * 5 + column;
    if (!game.board[index]) cells.push(index);
  }
  return cells;
}

function getCardMeta(cardId) {
  return cardMap.get(cardId) || null;
}

function findUnitIndexById(game, unitId) {
  return game.board.findIndex((unit) => unit && unit.instanceId === unitId);
}

function getBoardIndexForUnit(game, unit) {
  if (!unit?.instanceId) return -1;
  return findUnitIndexById(game, unit.instanceId);
}

function isUnitCenterSilenced(game, unit, boardIndex = null) {
  if (!unit?.centerSilenceDisableAttackUntilTurnStartOf) return false;
  const resolvedIndex = boardIndex == null ? getBoardIndexForUnit(game, unit) : boardIndex;
  return resolvedIndex >= 0 && isPointZoneIndex(resolvedIndex);
}

function isUnitFullySilenced(unit) {
  return !!(unit && unit.fullSilenceUntilTurnStartOf);
}

function unitHasEffectType(unit, effectType, game = null, boardIndex = null) {
  if (!unit) return false;
  if (game && isUnitCenterSilenced(game, unit, boardIndex)) return false;
  if (isUnitFullySilenced(unit)) return false;
  return getCardMeta(unit?.cardId)?.effect_type === effectType;
}

function unitIgnoresEnemyFieldEffects(unit, game = null, boardIndex = null) {
  if (!unit) return false;
  if (game && isUnitCenterSilenced(game, unit, boardIndex)) return false;
  if (isUnitFullySilenced(unit)) return false;
  const effectType = getCardMeta(unit?.cardId)?.effect_type || '';
  return effectType === 'ignore_enemy_field_effects_and_center_guard_1'
    || effectType.startsWith('ignore_enemy_field_effects_self');
}

function getPlayerStatus(game, playerKey) {
  if (!game.playerStatus) {
    game.playerStatus = { player1: createPlayerStatus(), player2: createPlayerStatus() };
  }
  if (!game.playerStatus[playerKey]) game.playerStatus[playerKey] = createPlayerStatus();
  return game.playerStatus[playerKey];
}

function playerHasFieldEffect(game, playerKey, effectType) {
  const opponentStatus = getPlayerStatus(game, playerKey === 'player1' ? 'player2' : 'player1');
  if (opponentStatus?.negateEnemyFieldUntilOwnTurnStart) return false;
  return getCardMeta(game.fieldIds?.[playerKey])?.effect_type === effectType;
}

function countFieldEffects(game, effectType) {
  return ['player1', 'player2'].reduce((count, playerKey) => count + (playerHasFieldEffect(game, playerKey, effectType) ? 1 : 0), 0);
}

function hasAdjacentUnitOwnedBy(game, targetIndex, ownerKey) {
  return getOrthogonalNeighbors(targetIndex).some((idx) => game.board[idx] && game.board[idx].owner === ownerKey);
}

function isEnemyCenterFieldBuffHealNegated(game, unit, boardIndex = null) {
  if (!unit || boardIndex == null || !isPointZoneIndex(boardIndex)) return false;
  return game.board.some((otherUnit, idx) => {
    if (!otherUnit || otherUnit.owner === unit.owner || !isPointZoneIndex(idx)) return false;
    return unitHasEffectType(otherUnit, 'ignore_enemy_field_effects_self_and_center_aura_negate_enemy_field_buffs_heal_and_ignore_reduction_vs_center', game, idx);
  });
}

function getAdjacentEnemySentryReduction(game, boardIndex, ownerKey) {
  return getOrthogonalNeighbors(boardIndex).reduce((count, idx) => {
    const unit = game.board[idx];
    return count + (unit && unit.owner !== ownerKey && unitHasEffectType(unit, 'aura_enemy_move_minus_1', game, idx) ? 1 : 0);
  }, 0);
}

function cannotMoveByEffect(unit) {
  return unitHasEffectType(unit, 'cannot_move');
}

function getMoveNeighborOffsets(unit) {
  if (unitHasEffectType(unit, 'diagonal_move')) {
    return [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1],
    ];
  }
  return [[-1, 0], [1, 0], [0, -1], [0, 1]];
}

function getEffectiveMove(game, unit, boardIndex) {
  if (!unit) return 0;
  if (cannotMoveByEffect(unit)) return 0;
  const sentryReduction = boardIndex != null ? getAdjacentEnemySentryReduction(game, boardIndex, unit.owner) : 0;
  return Math.max(0, Number(unit.move || 0) + Number(unit.tempMoveBuff || 0) - sentryReduction);
}

function getAttackLimitForUnit(unit) {
  return unitHasEffectType(unit, 'double_attack') ? 2 : 1;
}

function currentPlayerCannotAttackAfterMove(game, unit = null) {
  if (!(game.phase === 'battle' && game.turnState?.moved)) return false;
  const playerKey = game.currentPlayer;
  const ownFieldBlocks = playerHasFieldEffect(game, playerKey, 'field_no_attack_after_move');
  const enemyFieldBlocks = playerHasFieldEffect(game, playerKey === 'player1' ? 'player2' : 'player1', 'field_no_attack_after_move')
    && !(unit && unitIgnoresEnemyFieldEffects(unit));
  return !!(ownFieldBlocks || enemyFieldBlocks);
}

function getReachableMoveCells(game, unitId) {
  if (game.phase !== 'battle') return [];
  const startIndex = findUnitIndexById(game, unitId);
  if (startIndex < 0) return [];
  const unit = game.board[startIndex];
  if (!unit || unit.owner !== game.currentPlayer || unit.actionLocked) return [];

  if (game.turnState.postAttackMoveUnitId) {
    if (game.turnState.postAttackMoveUnitId !== unit.instanceId) return [];
    return getOrthogonalNeighbors(startIndex).filter((idx) => !game.board[idx]);
  }

  const hasAcceleratedMoves = !!(game.turnState.acceleratedUnitId && game.turnState.acceleratedMovesRemaining > 0);
  if (hasAcceleratedMoves) {
    if (unit.instanceId !== game.turnState.acceleratedUnitId) return [];
  } else if (game.turnState.moved) {
    return [];
  }

  const maxSteps = getEffectiveMove(game, unit, startIndex);
  if (maxSteps <= 0) return [];
  const visited = new Set([startIndex]);
  const queue = [{ index: startIndex, steps: 0 }];
  const result = [];
  const neighborOffsets = getMoveNeighborOffsets(unit);

  while (queue.length) {
    const current = queue.shift();
    const { row, col } = indexToCoord(current.index);
    for (const [dr, dc] of neighborOffsets) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || r > 4 || c < 0 || c > 4) continue;
      const idx = coordToIndex(r, c);
      if (visited.has(idx) || game.board[idx]) continue;
      const steps = current.steps + 1;
      if (steps > maxSteps) continue;
      visited.add(idx);
      result.push(idx);
      queue.push({ index: idx, steps });
    }
  }
  if (unitHasEffectType(unit, 'swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap', game, startIndex)) {
    getOrthogonalNeighbors(startIndex).forEach((idx) => {
      const ally = game.board[idx];
      if (ally && ally.owner === unit.owner && ally.instanceId !== unit.instanceId && !result.includes(idx)) {
        result.push(idx);
      }
    });
  }
  return result;
}

function getAttackTargets(game, unitId) {
  if (game.phase !== 'battle') return [];
  const startIndex = findUnitIndexById(game, unitId);
  if (startIndex < 0) return [];
  const unit = game.board[startIndex];
  if (!unit || unit.owner !== game.currentPlayer || unit.actionLocked || unit.attackLocked || isUnitCenterSilenced(game, unit, startIndex)) return [];
  if (currentPlayerCannotAttackAfterMove(game, unit)) return [];

  const attackUnitId = game.turnState.attackUnitId || null;
  const attackCount = Number(game.turnState.attackCount || 0);
  if (attackUnitId && attackUnitId !== unit.instanceId) return [];
  if (attackCount >= getAttackLimitForUnit(unit)) return [];

  const { row, col } = indexToCoord(startIndex);
  const targetSet = new Set(
    [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
      .filter(([r, c]) => r >= 0 && r <= 4 && c >= 0 && c <= 4)
      .map(([r, c]) => coordToIndex(r, c))
      .filter((idx) => game.board[idx] && game.board[idx].owner !== game.currentPlayer)
  );

  if (unitHasEffectType(unit, 'range_2', game, startIndex) || unitHasEffectType(unit, 'pierce_line_2', game, startIndex)) {
    [
      [[row - 1, col], [row - 2, col]],
      [[row + 1, col], [row + 2, col]],
      [[row, col - 1], [row, col - 2]],
      [[row, col + 1], [row, col + 2]],
    ].forEach((line) => {
      line.forEach(([r, c]) => {
        if (r < 0 || r > 4 || c < 0 || c > 4) return;
        const idx = coordToIndex(r, c);
        if (game.board[idx] && game.board[idx].owner !== game.currentPlayer) targetSet.add(idx);
      });
    });
  }

  if (unitHasEffectType(unit, 'row_range_attack', game, startIndex)) {
    for (let targetCol = 0; targetCol < 5; targetCol += 1) {
      if (targetCol === col) continue;
      const idx = coordToIndex(row, targetCol);
      if (game.board[idx] && game.board[idx].owner !== game.currentPlayer) targetSet.add(idx);
    }
  }

  const enemyFogActive = playerHasFieldEffect(game, game.currentPlayer === 'player1' ? 'player2' : 'player1', 'field_range_limit_adjacent_only')
    && !unitIgnoresEnemyFieldEffects(unit, game, startIndex);
  if (!enemyFogActive) return [...targetSet];
  const adjacent = new Set(getOrthogonalNeighbors(startIndex));
  return [...targetSet].filter((idx) => adjacent.has(idx));
}

function effectBoostForItems(game, playerKey) {
  return playerHasFieldEffect(game, playerKey, 'field_item_effect_plus_1') ? 1 : 0;
}

function isDuplicateAction(game, playerKey, signature) {
  const tracker = game.turnState?.lastActionByPlayer?.[playerKey];
  const now = Date.now();
  if (tracker && tracker.signature === signature && now - tracker.at < DUPLICATE_WINDOW_MS) return true;
  if (game.turnState?.lastActionByPlayer?.[playerKey]) {
    game.turnState.lastActionByPlayer[playerKey] = { signature, at: now };
  }
  return false;
}

function clearTempEffectsForPlayer(game, playerKey) {
  game.board.forEach((unit) => {
    if (!unit || unit.owner !== playerKey) return;
    unit.tempAtkBuff = 0;
    unit.tempMoveBuff = 0;
    unit.nextAttackAppliesNoHealNoRevive = false;
  });
}

function clearExpiredStartOfTurnEffects(game, playerKey) {
  const playerStatus = getPlayerStatus(game, playerKey);
  if (playerStatus?.negateEnemyFieldUntilOwnTurnStart) {
    playerStatus.negateEnemyFieldUntilOwnTurnStart = false;
  }
  game.board.forEach((unit) => {
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

function healUnitForServer(unit, amount, round, game = null, boardIndex = null) {
  if (!unit || amount <= 0) return { healed: 0, blocked: false };
  const resolvedIndex = boardIndex == null && game ? getBoardIndexForUnit(game, unit) : boardIndex;
  if (unit.negateBuffsAndHealUntilTurnStartOf || unit.noHealNoReviveUntilTurnStartOf || unit.fullSilenceUntilTurnStartOf || (game && isEnemyCenterFieldBuffHealNegated(game, unit, resolvedIndex))) return { healed: 0, blocked: true };
  const before = Number(unit.currentHp || 0);
  unit.currentHp = Math.min(Number(unit.maxHp || 0), before + Number(amount || 0));
  const healed = Math.max(0, unit.currentHp - before);
  if (healed > 0) unit.healedInRound = Number(round || 0);
  return { healed, blocked: false };
}

function getCleansableStatusKindsForServer(unit) {
  if (!unit) return [];
  const kinds = [];
  if (unit.actionLocked || Number(unit.skipActionTurns || 0) > 0) kinds.push('action');
  if (unit.attackLocked || Number(unit.skipAttackTurns || 0) > 0) kinds.push('attack');
  if (Number(unit.tempMoveBuff || 0) < 0) kinds.push('move');
  return kinds;
}

function clearCleansableStatusForServer(unit, kind) {
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

function clearOneCleansableStatusForServer(unit) {
  for (const kind of ['action', 'attack', 'move']) {
    if (clearCleansableStatusForServer(unit, kind)) return kind;
  }
  return '';
}

function clearAllCleansableStatusesForServer(unit) {
  const cleared = [];
  ['action', 'attack', 'move'].forEach((kind) => {
    if (clearCleansableStatusForServer(unit, kind)) cleared.push(kind);
  });
  return cleared;
}

function chooseFieldStartCenterAllyForServer(game, playerKey) {
  let best = null;
  for (let index = 0; index < game.board.length; index += 1) {
    const unit = game.board[index];
    if (!unit || unit.owner !== playerKey || !isPointZoneIndex(index)) continue;
    const cleanseCount = getCleansableStatusKindsForServer(unit).length;
    const missingHp = Math.max(0, Number(unit.maxHp || 0) - Number(unit.currentHp || 0));
    const score = cleanseCount * 100 + missingHp * 10 + (24 - index);
    if (!best || score > best.score) best = { index, unit, score };
  }
  return best;
}

function chooseAdjacentAllyForSwapCleanseForServer(game, unitIndex, ownerKey, excludeUnitId = '') {
  let best = null;
  getOrthogonalNeighbors(unitIndex).forEach((idx) => {
    const ally = game.board[idx];
    if (!ally || ally.owner !== ownerKey || ally.instanceId === excludeUnitId) return;
    const statusKinds = getCleansableStatusKindsForServer(ally);
    if (!statusKinds.length) return;
    const priority = statusKinds.includes('action') ? 3 : statusKinds.includes('attack') ? 2 : 1;
    const score = priority * 100 + statusKinds.length * 10 + (24 - idx);
    if (!best || score > best.score) best = { index: idx, unit: ally, score };
  });
  return best;
}

function applyFieldStartOfTurnEffectsForServer(game, playerKey) {
  if (!playerHasFieldEffect(game, playerKey, 'field_start_round_heal_1_and_cleanse_center_ally')) return;
  const target = chooseFieldStartCenterAllyForServer(game, playerKey);
  if (!target?.unit) return;
  healUnitForServer(target.unit, 1, game.round, game, target.index);
  clearAllCleansableStatusesForServer(target.unit);
}

function refreshTurnStatusForPlayer(game, playerKey) {
  game.board.forEach((unit) => {
    if (!unit) return;
    if (unit.owner !== playerKey) {
      unit.actionLocked = false;
      unit.attackLocked = false;
      return;
    }
    if ((unit.skipActionTurns || 0) > 0) {
      unit.actionLocked = true;
      unit.attackLocked = true;
      unit.skipActionTurns -= 1;
      if ((unit.skipAttackTurns || 0) > 0) unit.skipAttackTurns -= 1;
      return;
    }
    unit.actionLocked = false;
    if ((unit.skipAttackTurns || 0) > 0) {
      unit.attackLocked = true;
      unit.skipAttackTurns -= 1;
    } else {
      unit.attackLocked = false;
    }
  });
}

function beginTurn(game, playerKey) {
  game.currentPlayer = playerKey;
  game.phase = 'battle';
  game.itemPhaseOpen = true;
  game.itemUsed = false;
  clearExpiredStartOfTurnEffects(game, playerKey);
  game.turnState = createTurnState();
  clearTempEffectsForPlayer(game, playerKey);
  applyFieldStartOfTurnEffectsForServer(game, playerKey);
  refreshTurnStatusForPlayer(game, playerKey);
}

function getRequiredItemTargetType(card) {
  switch (card?.effect_type) {
    case 'heal_single_2':
    case 'full_heal_single':
    case 'heal_single_3_atk_up_turn_1':
    case 'buff_move_atk_turn_1':
    case 'shield_single_2_once':
    case 'move_twice_single':
    case 'royal_command_single':
    case 'untargetable_by_enemy_items_turn_1':
    case 'mark_attack_target_no_heal_no_revive_until_next_opponent_round':
    case 'negate_next_destroy_or_stun_or_disable_attack_once':
    case 'heal_2_and_cleanse_one_status':
      return 'ally';
    case 'damage_single_1':
    case 'damage_single_2':
    case 'destroy_single':
    case 'destroy_single_no_revive':
    case 'disable_attack_next_round':
    case 'stun_single_1_turn':
    case 'negate_buffs_and_heal_until_next_opponent_round':
    case 'silence_and_disable_attack_while_in_center_until_next_opponent_round':
    case 'center_silence_and_negate_buffs_heal_until_next_opponent_round':
      return 'enemy';
    case 'damage_aoe_target_radius_1':
      return 'occupied';
    default:
      return 'none';
  }
}

function isOffensiveItem(card) {
  return ['damage_single_1', 'damage_single_2', 'damage_aoe_target_radius_1', 'disable_attack_next_round', 'stun_single_1_turn', 'destroy_single', 'destroy_single_no_revive'].includes(card?.effect_type);
}

function hasAdjacentCenterAuraItemUntargetable(game, unit, boardIndex = null) {
  if (!unit || boardIndex == null) return false;
  return getOrthogonalNeighbors(boardIndex).some((idx) => {
    const ally = game.board[idx];
    return ally
      && ally.owner === unit.owner
      && ally.instanceId !== unit.instanceId
      && isPointZoneIndex(idx)
      && unitHasEffectType(ally, 'center_aura_adjacent_allies_untargetable_by_enemy_items', game, idx);
  });
}

function isUnitUntargetableByEnemyItems(game, unit, boardIndex = null) {
  if (!unit) return false;
  if (unit.untargetableByEnemyItemsUntilTurnStartOf) return true;
  const resolvedIndex = boardIndex == null ? getBoardIndexForUnit(game, unit) : boardIndex;
  return resolvedIndex >= 0 && hasAdjacentCenterAuraItemUntargetable(game, unit, resolvedIndex);
}

function validateItemTarget(game, playerKey, card, targetIndex) {
  const required = getRequiredItemTargetType(card);
  if (required === 'none') return targetIndex == null;
  if (targetIndex == null || targetIndex < 0 || targetIndex >= 25) return false;
  const targetUnit = game.board[targetIndex];
  if (!targetUnit) return false;

  if (isOffensiveItem(card) && playerHasFieldEffect(game, targetUnit.owner, 'field_range_limit_adjacent_only') && !hasAdjacentUnitOwnedBy(game, targetIndex, playerKey)) {
    return false;
  }
  if ((required === 'enemy' || required === 'occupied') && targetUnit.owner !== playerKey && isUnitUntargetableByEnemyItems(game, targetUnit, targetIndex) && isOffensiveItem(card)) {
    return false;
  }

  if (card?.effect_type === 'center_silence_and_negate_buffs_heal_until_next_opponent_round' && !isPointZoneIndex(targetIndex)) return false;
  if (required === 'occupied') return true;
  if (required === 'ally') return targetUnit.owner === playerKey;
  if (required === 'enemy') return targetUnit.owner !== playerKey;
  return false;
}

function applyServerSideItemEffects(game, playerKey, cardId, targetIndex) {
  const card = getCardMeta(cardId);
  const targetUnit = targetIndex == null ? null : game.board[targetIndex];
  const effectBoost = effectBoostForItems(game, playerKey);
  if (!card) return;
  switch (card.effect_type) {
    case 'buff_move_atk_turn_1': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      const amount = 1 + effectBoost;
      targetUnit.tempAtkBuff = Number(targetUnit.tempAtkBuff || 0) + amount;
      targetUnit.tempMoveBuff = Number(targetUnit.tempMoveBuff || 0) + amount;
      break;
    }
    case 'move_twice_single': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      game.turnState.acceleratedUnitId = targetUnit.instanceId;
      game.turnState.acceleratedMovesRemaining = 2 + effectBoost;
      break;
    }
    case 'heal_single_2': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      healUnitForServer(targetUnit, 2, game.round, game, targetIndex);
      break;
    }
    case 'heal_single_3_atk_up_turn_1': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      healUnitForServer(targetUnit, 3, game.round, game, targetIndex);
      if (!targetUnit.negateBuffsAndHealUntilTurnStartOf) {
        targetUnit.tempAtkBuff = Number(targetUnit.tempAtkBuff || 0) + 1;
      }
      break;
    }
    case 'heal_2_and_cleanse_one_status': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      healUnitForServer(targetUnit, 2, game.round, game, targetIndex);
      clearOneCleansableStatusForServer(targetUnit);
      break;
    }
    case 'royal_command_single': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      game.turnState.acceleratedUnitId = targetUnit.instanceId;
      game.turnState.acceleratedMovesRemaining = Math.max(Number(game.turnState.acceleratedMovesRemaining || 0), 2);
      game.turnState.royalCommandUnitId = targetUnit.instanceId;
      game.turnState.royalCommandAttackReady = false;
      break;
    }
    case 'disable_attack_next_round': {
      if (!targetUnit || targetUnit.owner === playerKey) return;
      targetUnit.skipAttackTurns = Math.max(Number(targetUnit.skipAttackTurns || 0), 1);
      break;
    }
    case 'stun_single_1_turn': {
      if (!targetUnit || targetUnit.owner === playerKey) return;
      targetUnit.skipActionTurns = Math.max(Number(targetUnit.skipActionTurns || 0), 1);
      break;
    }
    case 'shield_single_2_once': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      const amount = 2 + effectBoost;
      targetUnit.singleUseDamageReduction = Math.max(Number(targetUnit.singleUseDamageReduction || 0), amount);
      break;
    }
    case 'negate_enemy_field_until_next_opponent_round': {
      getPlayerStatus(game, playerKey).negateEnemyFieldUntilOwnTurnStart = true;
      break;
    }
    case 'untargetable_by_enemy_items_turn_1': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      targetUnit.untargetableByEnemyItemsUntilTurnStartOf = playerKey;
      break;
    }
    case 'negate_next_destroy_or_stun_or_disable_attack_once': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      targetUnit.negateNextDestroyStunDisableAttackUntilTurnStartOf = playerKey;
      break;
    }
    case 'mark_attack_target_no_heal_no_revive_until_next_opponent_round': {
      if (!targetUnit || targetUnit.owner !== playerKey) return;
      targetUnit.nextAttackAppliesNoHealNoRevive = true;
      break;
    }
    case 'silence_and_disable_attack_while_in_center_until_next_opponent_round': {
      if (!targetUnit || targetUnit.owner === playerKey) return;
      targetUnit.centerSilenceDisableAttackUntilTurnStartOf = playerKey;
      break;
    }
    case 'center_silence_and_negate_buffs_heal_until_next_opponent_round': {
      if (!targetUnit || targetUnit.owner === playerKey) return;
      targetUnit.negateBuffsAndHealUntilTurnStartOf = playerKey;
      targetUnit.fullSilenceUntilTurnStartOf = playerKey;
      break;
    }
    case 'negate_buffs_and_heal_until_next_opponent_round': {
      if (!targetUnit || targetUnit.owner === playerKey) return;
      targetUnit.negateBuffsAndHealUntilTurnStartOf = playerKey;
      break;
    }
    default:
      break;
  }
}

function sanitizeBoardSnapshot(board) {
  if (!Array.isArray(board) || board.length !== 25) return null;
  const seen = new Set();
  return board.map((cell) => {
    if (!cell) return null;
    const cardId = String(cell.cardId || '');
    const owner = cell.owner === 'player1' || cell.owner === 'player2' ? cell.owner : '';
    const instanceId = String(cell.instanceId || '');
    if (!cardId || !owner || !instanceId || !validCardIds.has(cardId) || seen.has(instanceId)) return null;
    seen.add(instanceId);
    return {
      instanceId,
      cardId,
      owner,
      name: String(cell.name || getCardMeta(cardId)?.card_name || cardId),
      atk: Number(cell.atk || getCardMeta(cardId)?.atk || 0),
      move: Number(cell.move || getCardMeta(cardId)?.move || 1),
      currentHp: Math.max(0, Number(cell.currentHp || 0)),
      maxHp: Math.max(1, Number(cell.maxHp || getCardMeta(cardId)?.hp || 1)),
      tempAtkBuff: Number(cell.tempAtkBuff || 0),
      tempMoveBuff: Number(cell.tempMoveBuff || 0),
      skipAttackTurns: Math.max(0, Number(cell.skipAttackTurns || 0)),
      skipActionTurns: Math.max(0, Number(cell.skipActionTurns || 0)),
      actionLocked: !!cell.actionLocked,
      attackLocked: !!cell.attackLocked,
      singleUseDamageReduction: Math.max(0, Number(cell.singleUseDamageReduction || 0)),
      guardBlockUsed: !!cell.guardBlockUsed,
      negateDamageUsed: !!cell.negateDamageUsed,
      surviveOnceUsed: !!cell.surviveOnceUsed,
      healedInRound: Math.max(0, Number(cell.healedInRound || 0)),
      untargetableByEnemyItemsUntilTurnStartOf: cell.untargetableByEnemyItemsUntilTurnStartOf ? String(cell.untargetableByEnemyItemsUntilTurnStartOf) : '',
      negateBuffsAndHealUntilTurnStartOf: cell.negateBuffsAndHealUntilTurnStartOf ? String(cell.negateBuffsAndHealUntilTurnStartOf) : '',
      noHealNoReviveUntilTurnStartOf: cell.noHealNoReviveUntilTurnStartOf ? String(cell.noHealNoReviveUntilTurnStartOf) : '',
      centerSilenceDisableAttackUntilTurnStartOf: cell.centerSilenceDisableAttackUntilTurnStartOf ? String(cell.centerSilenceDisableAttackUntilTurnStartOf) : '',
      fullSilenceUntilTurnStartOf: cell.fullSilenceUntilTurnStartOf ? String(cell.fullSilenceUntilTurnStartOf) : '',
      negateNextDestroyStunDisableAttackUntilTurnStartOf: cell.negateNextDestroyStunDisableAttackUntilTurnStartOf ? String(cell.negateNextDestroyStunDisableAttackUntilTurnStartOf) : '',
      itemFieldNegateControlUsed: !!cell.itemFieldNegateControlUsed,
      nextAttackAppliesNoHealNoRevive: !!cell.nextAttackAppliesNoHealNoRevive,
    };
  });
}

function sanitizeTurnStateSnapshot(turnState, fallback = createTurnState()) {
  const raw = turnState && typeof turnState === 'object' ? turnState : {};
  return {
    ...fallback,
    moved: !!raw.moved,
    movedUnitId: raw.movedUnitId ? String(raw.movedUnitId) : null,
    attacked: !!raw.attacked,
    attackCount: Math.max(0, Number(raw.attackCount || 0)),
    attackUnitId: raw.attackUnitId ? String(raw.attackUnitId) : null,
    itemWindowOpen: !!raw.itemWindowOpen,
    itemUsed: !!raw.itemUsed,
    acceleratedUnitId: raw.acceleratedUnitId ? String(raw.acceleratedUnitId) : null,
    acceleratedMovesRemaining: Math.max(0, Number(raw.acceleratedMovesRemaining || 0)),
    royalCommandUnitId: raw.royalCommandUnitId ? String(raw.royalCommandUnitId) : null,
    royalCommandAttackReady: !!raw.royalCommandAttackReady,
    postAttackMoveUnitId: raw.postAttackMoveUnitId ? String(raw.postAttackMoveUnitId) : null,
  };
}


function normalizePendingRedeploys(game) {
  const raw = Array.isArray(game.pendingRedeploys) ? game.pendingRedeploys : [];
  const seen = new Set();
  game.pendingRedeploys = raw.filter((entry) => {
    if (!entry || (entry.owner !== 'player1' && entry.owner !== 'player2') || !validCardIds.has(String(entry.cardId || ''))) return false;
    const key = `${entry.owner}:${entry.cardId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    const sameCardOnBoard = (game.board || []).some((unit) => unit && unit.owner === entry.owner && unit.cardId === entry.cardId);
    return !sameCardOnBoard;
  }).map((entry) => ({ owner: entry.owner, cardId: String(entry.cardId), name: String(entry.name || getCardMeta(entry.cardId)?.card_name || entry.cardId) }));
}

function mergePublicStateSnapshot(room, payload, playerKey) {
  if (!room.game) return false;
  const board = sanitizeBoardSnapshot(payload.board);
  if (!board) return false;
  room.game.board = board;
  room.game.phase = ['setup', 'battle', 'finished'].includes(payload.phase) ? payload.phase : room.game.phase;
  room.game.currentPlayer = payload.currentPlayer === 'player1' || payload.currentPlayer === 'player2' ? payload.currentPlayer : room.game.currentPlayer;
  room.game.winner = typeof payload.winner === 'string' ? payload.winner : (room.game.winner || '');
  room.game.round = Math.max(1, Number(payload.round || room.game.round || 1));
  room.game.setupStepIndex = Math.max(0, Number(payload.setupStepIndex || room.game.setupStepIndex || 0));
  room.game.placedInCurrentStep = Math.max(0, Number(payload.placedInCurrentStep || room.game.placedInCurrentStep || 0));
  room.game.turnState = sanitizeTurnStateSnapshot(payload.turnState, room.game.turnState || createTurnState());
  room.game.itemPhaseOpen = !!payload.itemPhaseOpen;
  room.game.itemUsed = !!payload.itemUsed;
  room.game.pendingRevives = Array.isArray(payload.pendingRevives) ? payload.pendingRevives : room.game.pendingRevives;
  normalizePendingRedeploys(room.game);

  const playerData = payload.players && typeof payload.players === 'object' ? payload.players : {};
  ['player1', 'player2'].forEach((key) => {
    const info = playerData[key];
    if (!info || typeof info !== 'object') return;
    if (Array.isArray(info.reserveBattleIds)) room.game.reserveBattleIds[key] = info.reserveBattleIds.map(String).filter((id) => validCardIds.has(id));
    if (Array.isArray(info.itemStates)) {
      room.game.itemHands[key] = info.itemStates
        .filter((item) => item && item.cardId && !item.used)
        .map((item) => String(item.cardId))
        .filter((id) => validCardIds.has(id));
    }
    if (typeof info.fieldId === 'string' && validCardIds.has(info.fieldId)) room.game.fieldIds[key] = info.fieldId;
    if (typeof info.negateEnemyFieldUntilOwnTurnStart === 'boolean') {
      getPlayerStatus(room.game, key).negateEnemyFieldUntilOwnTurnStart = info.negateEnemyFieldUntilOwnTurnStart;
    }
  });

  markRoomChanged(room);
  const finishMessage = room.game.phase === 'finished' ? (room.game.winner || getEliminationFinishMessage(room.game) || '対戦が終了しました') : getEliminationFinishMessage(room.game);
  const payloadOut = {
    type: 'battle_state_synced',
    roomId: room.roomId,
    player: playerKey,
    currentPlayer: room.game.currentPlayer,
    round: room.game.round,
    phase: room.game.phase,
    winner: room.game.winner || '',
    itemPhaseOpen: room.game.itemPhaseOpen,
    itemUsed: room.game.itemUsed,
    snapshot: payload,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([role, slot]) => {
    if (slot?.ws) {
      send(slot.ws, payloadOut);
      send(slot.ws, roomSnapshot(room, role));
    }
  });
  if (finishMessage) {
    finalizeRoomGameIfNeeded(room, finishMessage);
  }
  return true;
}

function assertRoomAndMeta(roomId, ws) {
  const room = rooms.get(roomId);
  if (!room || !room.game) {
    send(ws, { type: 'error', message: '試合中のルームが見つかりません。' });
    return null;
  }
  if (room.game.phase === 'finished' || room.roomState === 'finished') {
    send(ws, { type: 'error', message: 'この試合はすでに終了しています。' });
    return null;
  }
  const meta = ws.meta;
  if (!meta || meta.roomId !== roomId) {
    send(ws, { type: 'error', message: 'このルームの参加者ではありません。' });
    return null;
  }
  const playerKey = PLAYER_ROLE_MAP[meta.role] || '';
  return { room, meta, playerKey };
}

function handleCreateRoom(data, ws) {
  const deckPayload = sanitizeDeckPayload(data.deckPayload);
  const unlockAuth = sanitizeUnlockAuth(data);
  if (!validateDeckPayload(deckPayload, unlockAuth.saveKey, unlockAuth.unlockTokens)) {
    send(ws, { type: 'error', message: '有効な保存済みデッキを選んでからルーム作成してください。特別カードを含む場合は先に解放してください。' });
    return;
  }
  let roomId = makeRoomId();
  while (rooms.has(roomId)) roomId = makeRoomId();
  const room = createEmptyRoom(roomId);
  rooms.set(roomId, room);
  scheduleRoomsPersist();
  attachParticipant(room, 'p1', { ...data, deckPayload, ...unlockAuth }, ws);
}

function handleJoinRoom(data, ws, asSpectator = false) {
  const roomId = String(data.roomId || '').toUpperCase();
  const room = rooms.get(roomId);
  if (!room) {
    send(ws, { type: 'error', message: 'そのルームは見つかりません。' });
    return;
  }
  const unlockAuth = sanitizeUnlockAuth(data);
  if (!asSpectator) {
    const deckPayload = sanitizeDeckPayload(data.deckPayload);
    if (!validateDeckPayload(deckPayload, unlockAuth.saveKey, unlockAuth.unlockTokens)) {
      send(ws, { type: 'error', message: '有効な保存済みデッキを選んでからプレイヤー参加してください。特別カードを含む場合は先に解放してください。' });
      return;
    }
    data = { ...data, deckPayload, ...unlockAuth };
  }
  let role = null;
  if (asSpectator) role = room.spectator ? null : 'spectator';
  else if (!room.p1) role = 'p1';
  else if (!room.p2) role = 'p2';
  if (!role) {
    send(ws, { type: 'error', message: asSpectator ? '観戦枠が埋まっています。' : 'プレイヤー枠が埋まっています。' });
    return;
  }
  attachParticipant(room, role, data, ws);
}

function handleReconnectRoom(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const room = rooms.get(roomId);
  if (!room) {
    send(ws, { type: 'error', message: '復帰先ルームが見つかりません。' });
    return;
  }
  for (const role of ['p1', 'p2', 'spectator']) {
    const slot = room[role];
    if (slot && slot.reconnectToken === data.reconnectToken) {
      const disconnectedAt = Number(slot.disconnectedAt || 0);
      if (disconnectedAt && (Date.now() - disconnectedAt) > RECONNECT_GRACE_MS) {
        send(ws, { type: 'error', message: '復帰猶予を過ぎたため、この立場には戻れません。' });
        return;
      }
      slot.ws = ws;
      slot.disconnectedAt = 0;
      ws.meta = { roomId: room.roomId, role, reconnectToken: slot.reconnectToken };
      markRoomChanged(room);
      send(ws, {
        type: 'room_joined',
        roomId: room.roomId,
        roomState: room.roomState,
        role,
        reconnectToken: slot.reconnectToken,
        deckName: slot.deckName,
        p1: participantSnapshot(room.p1),
        p2: participantSnapshot(room.p2),
        spectator: participantSnapshot(room.spectator),
        game: makeGameStartedPayload(room),
      });
      broadcastRoom(room, `${slot.displayName} が復帰しました。`);
      return;
    }
  }
  send(ws, { type: 'error', message: '復帰トークンが一致しません。' });
}

function handleStartGame(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const room = rooms.get(roomId);
  if (!room) {
    send(ws, { type: 'error', message: 'そのルームは見つかりません。' });
    return;
  }
  const meta = ws.meta;
  if (!meta || meta.roomId !== roomId || meta.role !== 'p1') {
    send(ws, { type: 'error', message: 'P1 だけが試合開始できます。' });
    return;
  }
  if (room.game) {
    send(ws, { type: 'error', message: 'このルームはすでに試合開始済みです。' });
    return;
  }
  const started = startRoomGameRound(room, `P1 の ${room.p1.displayName} が試合開始しました。配置フェーズはサーバー同期です。`);
  if (!started.ok) {
    send(ws, { type: 'error', message: started.message || '試合開始に失敗しました。' });
  }
}

function handlePlaceSetupUnit(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者は配置できません。' });
    return;
  }
  if (game.phase !== 'setup') {
    send(ws, { type: 'error', message: 'いまは配置フェーズではありません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの配置番ではありません。' });
    return;
  }
  const cardId = String(data.cardId || '');
  const targetIndex = Number(data.targetIndex);
  const signature = `setup:${cardId}:${targetIndex}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じ配置操作が短時間に繰り返されました。' });
    return;
  }
  const step = getCurrentSetupStep(game);
  if (!step || step.player !== playerKey) {
    send(ws, { type: 'error', message: '配置手順が一致しません。' });
    return;
  }
  if (!cardId || Number.isNaN(targetIndex) || targetIndex < 0 || targetIndex >= 25) {
    send(ws, { type: 'error', message: '配置情報が不正です。' });
    return;
  }
  if (!(game.reserveBattleIds[playerKey] || []).includes(cardId)) {
    send(ws, { type: 'error', message: 'そのカードは配置待ちにありません。' });
    return;
  }
  if (!getPlaceableCells(game).includes(targetIndex)) {
    send(ws, { type: 'error', message: 'そのマスには置けません。' });
    return;
  }
  const unit = createUnitState(cardId, playerKey);
  game.board[targetIndex] = unit;
  game.reserveBattleIds[playerKey] = game.reserveBattleIds[playerKey].filter((id) => id !== cardId);
  game.placedInCurrentStep += 1;
  if (game.placedInCurrentStep >= step.count) {
    game.setupStepIndex += 1;
    game.placedInCurrentStep = 0;
    const nextStep = getCurrentSetupStep(game);
    if (nextStep) {
      game.currentPlayer = nextStep.player;
    } else {
      beginTurn(game, 'player1');
    }
  }
  const placement = {
    player: playerKey,
    cardId,
    targetIndex,
    instanceId: unit.instanceId,
    phase: game.phase,
    currentPlayer: game.currentPlayer,
    setupStepIndex: game.setupStepIndex,
    placedInCurrentStep: game.placedInCurrentStep,
  };
  game.placements.push(placement);
  room.roomState = computeRoomState(room);
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([role, slot]) => {
    if (slot?.ws) {
      send(slot.ws, { type: 'setup_unit_placed', roomId: room.roomId, ...placement });
      send(slot.ws, roomSnapshot(room, role));
    }
  });
}

function handleMoveUnit(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者は移動できません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの手番ではありません。' });
    return;
  }
  if (game.phase !== 'battle' || game.itemPhaseOpen) {
    send(ws, { type: 'error', message: 'いまは移動できません。' });
    return;
  }
  const unitId = String(data.unitId || '');
  const sourceIndex = Number(data.sourceIndex);
  const targetIndex = Number(data.targetIndex);
  const signature = `move:${unitId}:${sourceIndex}:${targetIndex}:${game.currentPlayer}:${game.round}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じ移動操作が短時間に繰り返されました。' });
    return;
  }
  if (!unitId || Number.isNaN(sourceIndex) || Number.isNaN(targetIndex) || sourceIndex < 0 || sourceIndex >= 25 || targetIndex < 0 || targetIndex >= 25) {
    send(ws, { type: 'error', message: '移動情報が不正です。' });
    return;
  }
  const sourceUnit = game.board[sourceIndex];
  if (!sourceUnit || sourceUnit.instanceId !== unitId || sourceUnit.owner !== playerKey) {
    send(ws, { type: 'error', message: 'そのユニットは移動できません。' });
    return;
  }
  const targetUnit = game.board[targetIndex];
  const canSwap = !!(targetUnit
    && targetUnit.owner === playerKey
    && targetUnit.instanceId !== unitId
    && unitHasEffectType(sourceUnit, 'swap_with_adjacent_ally_and_cleanse_one_adjacent_status_on_swap', game, sourceIndex)
    && getOrthogonalNeighbors(sourceIndex).includes(targetIndex));
  if (targetUnit && !canSwap) {
    send(ws, { type: 'error', message: 'そのマスは埋まっています。' });
    return;
  }
  if (!getReachableMoveCells(game, unitId).includes(targetIndex)) {
    send(ws, { type: 'error', message: 'その移動先は選べません。' });
    return;
  }
  if (canSwap) {
    game.board[sourceIndex] = targetUnit;
    game.board[targetIndex] = sourceUnit;
    const cleanseTarget = chooseAdjacentAllyForSwapCleanseForServer(game, targetIndex, playerKey, unitId);
    if (cleanseTarget?.unit) {
      clearOneCleansableStatusForServer(cleanseTarget.unit);
    }
  } else {
    game.board[targetIndex] = sourceUnit;
    game.board[sourceIndex] = null;
  }
  if (game.turnState.postAttackMoveUnitId === unitId) {
    game.turnState.postAttackMoveUnitId = null;
    game.turnState.moved = true;
    game.turnState.movedUnitId = unitId;
  } else {
    const accelerated = game.turnState.acceleratedUnitId === unitId && game.turnState.acceleratedMovesRemaining > 0;
    game.turnState.movedUnitId = unitId;
    if (accelerated) {
      game.turnState.acceleratedMovesRemaining -= 1;
      if (game.turnState.royalCommandUnitId === unitId) {
        game.turnState.royalCommandAttackReady = true;
      }
      if (game.turnState.acceleratedMovesRemaining <= 0) {
        game.turnState.acceleratedMovesRemaining = 0;
        game.turnState.acceleratedUnitId = null;
        game.turnState.moved = true;
      } else {
        game.turnState.moved = false;
      }
    } else {
      game.turnState.moved = true;
    }
  }
  markRoomChanged(room);
  const payload = {
    type: 'move_applied',
    roomId: room.roomId,
    player: playerKey,
    unitId,
    sourceIndex,
    targetIndex,
    currentPlayer: game.currentPlayer,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => slot?.ws && send(slot.ws, payload));
}

function handleAttackUnit(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者は攻撃できません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの手番ではありません。' });
    return;
  }
  if (game.phase !== 'battle' || game.itemPhaseOpen) {
    send(ws, { type: 'error', message: 'いまは攻撃できません。' });
    return;
  }
  const unitId = String(data.unitId || '');
  const sourceIndex = Number(data.sourceIndex);
  const targetIndex = Number(data.targetIndex);
  const signature = `attack:${unitId}:${sourceIndex}:${targetIndex}:${game.currentPlayer}:${game.round}:${game.turnState.attackCount || 0}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じ攻撃操作が短時間に繰り返されました。' });
    return;
  }
  if (!unitId || Number.isNaN(sourceIndex) || Number.isNaN(targetIndex) || sourceIndex < 0 || sourceIndex >= 25 || targetIndex < 0 || targetIndex >= 25) {
    send(ws, { type: 'error', message: '攻撃情報が不正です。' });
    return;
  }
  const attacker = game.board[sourceIndex];
  const defender = game.board[targetIndex];
  if (!attacker || attacker.instanceId !== unitId || attacker.owner !== playerKey) {
    send(ws, { type: 'error', message: 'そのユニットは攻撃できません。' });
    return;
  }
  if (!defender || defender.owner === playerKey) {
    send(ws, { type: 'error', message: 'その攻撃先は選べません。' });
    return;
  }
  if (!getAttackTargets(game, unitId).includes(targetIndex)) {
    send(ws, { type: 'error', message: 'その攻撃先は選べません。' });
    return;
  }
  game.turnState.attackUnitId = unitId;
  game.turnState.attackCount = Number(game.turnState.attackCount || 0) + 1;
  game.turnState.attacked = true;
  if (unitHasEffectType(attacker, 'move_after_attack_1')) {
    game.turnState.postAttackMoveUnitId = unitId;
  }
  if (unitHasEffectType(attacker, 'return_and_redeploy_full_heal')) {
    const exists = game.pendingRedeploys.some((entry) => entry && entry.owner === playerKey && entry.cardId === attacker.cardId);
    if (!exists) {
      game.pendingRedeploys.push({ owner: playerKey, cardId: attacker.cardId, name: attacker.name });
    }
    game.board[sourceIndex] = null;
    game.turnState.postAttackMoveUnitId = null;
    normalizePendingRedeploys(game);
  }
  if (game.turnState.royalCommandUnitId === unitId && game.turnState.royalCommandAttackReady) {
    game.turnState.royalCommandAttackReady = false;
    game.turnState.royalCommandUnitId = null;
  }
  markRoomChanged(room);
  const payload = {
    type: 'attack_applied',
    roomId: room.roomId,
    player: playerKey,
    unitId,
    sourceIndex,
    targetIndex,
    currentPlayer: game.currentPlayer,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => slot?.ws && send(slot.ws, payload));
}

function handleUseItem(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者はアイテムを使えません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの手番ではありません。' });
    return;
  }
  if (game.phase !== 'battle') {
    send(ws, { type: 'error', message: 'いまは対戦フェーズではありません。' });
    return;
  }
  if (!game.itemPhaseOpen || game.itemUsed) {
    send(ws, { type: 'error', message: 'この手番ではもうアイテムを使えません。' });
    return;
  }
  const cardId = String(data.cardId || '');
  const targetIndex = data.targetIndex == null ? null : Number(data.targetIndex);
  const signature = `item:${cardId}:${targetIndex}:${game.currentPlayer}:${game.round}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じアイテム操作が短時間に繰り返されました。' });
    return;
  }
  const hand = game.itemHands[playerKey] || [];
  if (!hand.includes(cardId)) {
    send(ws, { type: 'error', message: 'そのアイテムは手札にありません。' });
    return;
  }
  const card = getCardMeta(cardId);
  if (!card || card.type !== 'item') {
    send(ws, { type: 'error', message: 'そのカードはアイテムではありません。' });
    return;
  }
  if (!validateItemTarget(game, playerKey, card, targetIndex)) {
    send(ws, { type: 'error', message: 'そのアイテム対象は選べません。' });
    return;
  }
  game.itemHands[playerKey] = hand.filter((id, index) => !(id === cardId && index === hand.indexOf(cardId)));
  game.itemPhaseOpen = false;
  game.itemUsed = true;
  game.turnState.itemWindowOpen = false;
  game.turnState.itemUsed = true;
  applyServerSideItemEffects(game, playerKey, cardId, targetIndex);
  markRoomChanged(room);
  const payload = {
    type: 'item_used',
    roomId: room.roomId,
    player: playerKey,
    currentPlayer: game.currentPlayer,
    cardId,
    targetIndex,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => slot?.ws && send(slot.ws, payload));
}

function handleFinishItemPhase(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者は操作できません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの手番ではありません。' });
    return;
  }
  if (game.phase !== 'battle' || !game.itemPhaseOpen) {
    send(ws, { type: 'error', message: 'いまはアイテムフェーズを終了できません。' });
    return;
  }
  const signature = `finish-item:${game.currentPlayer}:${game.round}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じ終了操作が短時間に繰り返されました。' });
    return;
  }
  game.itemPhaseOpen = false;
  game.turnState.itemWindowOpen = false;
  markRoomChanged(room);
  const payload = {
    type: 'item_phase_finished',
    roomId: room.roomId,
    player: playerKey,
    currentPlayer: game.currentPlayer,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => slot?.ws && send(slot.ws, payload));
}

function handleEndTurn(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  const game = room.game;
  if (!playerKey) {
    send(ws, { type: 'error', message: '観戦者は操作できません。' });
    return;
  }
  if (playerKey !== game.currentPlayer) {
    send(ws, { type: 'error', message: 'いまはあなたの手番ではありません。' });
    return;
  }
  if (game.phase !== 'battle' || game.itemPhaseOpen) {
    send(ws, { type: 'error', message: 'いまは手番終了できません。' });
    return;
  }
  const signature = `end-turn:${game.currentPlayer}:${game.round}`;
  if (isDuplicateAction(game, playerKey, signature)) {
    send(ws, { type: 'error', message: '同じ終了操作が短時間に繰り返されました。' });
    return;
  }
  const previousPlayer = game.currentPlayer;
  const nextPlayer = previousPlayer === 'player1' ? 'player2' : 'player1';
  clearTempEffectsForPlayer(game, previousPlayer);
  let nextRound = Number(game.round || 1);
  if (previousPlayer === 'player2') nextRound += 1;
  game.round = nextRound;
  beginTurn(game, nextPlayer);
  markRoomChanged(room);
  const payload = {
    type: 'turn_ended',
    roomId: room.roomId,
    previousPlayer,
    currentPlayer: nextPlayer,
    round: nextRound,
  };
  [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => slot?.ws && send(slot.ws, payload));
}

function handleSyncPublicState(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const context = assertRoomAndMeta(roomId, ws);
  if (!context) return;
  const { room, playerKey } = context;
  if (!playerKey) return;
  if (!mergePublicStateSnapshot(room, data.snapshot || {}, playerKey)) {
    send(ws, { type: 'error', message: '公開状態の同期に失敗しました。' });
  }
}


function sendRoomActionState(room, noticeMessage = '') {
  broadcastRoom(room, noticeMessage);
}

function handleRoomActionRequest(data, ws) {
  const roomId = String(data.roomId || '').toUpperCase();
  const room = rooms.get(roomId);
  if (!room) {
    send(ws, { type: 'error', message: 'そのルームは見つかりません。' });
    return;
  }
  const meta = ws.meta;
  if (!meta || meta.roomId !== roomId || !['p1', 'p2', 'spectator'].includes(meta.role)) {
    send(ws, { type: 'error', message: 'このルームの参加者ではありません。' });
    return;
  }

  const action = String(data.action || '');
  if (action === 'close_room') {
    if (meta.role !== 'p1') {
      send(ws, { type: 'error', message: 'ルーム終了は P1 だけが実行できます。' });
      return;
    }
    const message = 'P1 がルームを終了しました。必要なら新しいルームを作り直してください。';
    [['p1', room.p1], ['p2', room.p2], ['spectator', room.spectator]].forEach(([_, slot]) => {
      if (slot?.ws) {
        send(slot.ws, { type: 'room_closed', roomId: room.roomId, message });
      }
    });
    rooms.delete(room.roomId);
    scheduleRoomsPersist();
    return;
  }

  if (action === 'surrender') {
    if (!['p1', 'p2'].includes(meta.role)) {
      send(ws, { type: 'error', message: '観戦者はこの操作を実行できません。' });
      return;
    }
    if (!room.game || room.game.phase === 'finished') {
      send(ws, { type: 'error', message: '降参できる試合がありません。' });
      return;
    }
    const loser = meta.role === 'p1' ? 'player1' : 'player2';
    const winner = loser === 'player1' ? 'player2' : 'player1';
    clearRoomControlRequests(room);
    finalizeRoomGameIfNeeded(room, `${loser === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}が降参しました。${winner === 'player1' ? 'プレイヤー1' : 'プレイヤー2'}の勝利です。`);
    return;
  }

  if (!['rematch', 'reset'].includes(action)) {
    send(ws, { type: 'error', message: '未対応のルーム操作です。' });
    return;
  }
  if (!['p1', 'p2'].includes(meta.role)) {
    send(ws, { type: 'error', message: '観戦者はこの操作を実行できません。' });
    return;
  }
  if (!room.p1 || !room.p2) {
    send(ws, { type: 'error', message: 'P1 と P2 が揃っている時だけ使えます。' });
    return;
  }
  if (action === 'rematch' && room.game?.phase !== 'finished') {
    send(ws, { type: 'error', message: '再戦は試合終了後だけ申請できます。' });
    return;
  }
  if (action === 'reset' && !room.game) {
    send(ws, { type: 'error', message: 'リセットできる試合がありません。' });
    return;
  }

  if (!room.controlRequests) clearRoomControlRequests(room);
  const requested = data.requested !== false;
  room.controlRequests[action][meta.role] = requested;
  markRoomChanged(room);

  const actorLabel = meta.role.toUpperCase();
  const actionLabel = action === 'rematch' ? '再戦' : 'リセット';
  const notice = requested
    ? `${actorLabel} が ${actionLabel} を申請しました。`
    : `${actorLabel} が ${actionLabel} 申請を取り消しました。`;
  sendRoomActionState(room, notice);

  if (room.controlRequests[action].p1 && room.controlRequests[action].p2) {
    clearRoomControlRequests(room);
    const startNotice = action === 'rematch'
      ? '両者が再戦を承認したため、同じルームで再戦を開始します。'
      : '両者がリセットを承認したため、試合を最初からやり直します。';
    const started = startRoomGameRound(room, startNotice);
    if (!started.ok) {
      send(ws, { type: 'error', message: started.message || `${actionLabel} の開始に失敗しました。` });
      sendRoomActionState(room);
    }
  }
}

function removeConnection(ws) {
  const meta = ws.meta;
  if (!meta?.roomId || !meta.role) return;
  const room = rooms.get(meta.roomId);
  if (!room) return;
  const slot = room[meta.role];
  if (!slot) return;
  if (slot.reconnectToken === meta.reconnectToken) {
    slot.ws = null;
    slot.disconnectedAt = Date.now();
    broadcastRoom(room, `${slot.displayName} が切断しました。しばらく待っても同じ立場で復帰できます。`);
  }
}

function cleanupExpiredReconnectSlots() {
  const now = Date.now();
  let changed = false;
  for (const room of rooms.values()) {
    for (const role of ['p1', 'p2', 'spectator']) {
      const slot = room[role];
      if (!slot || slot.ws || !slot.disconnectedAt) continue;
      if ((now - slot.disconnectedAt) <= RECONNECT_GRACE_MS) continue;
      room[role] = null;
      changed = true
      broadcastRoom(room, `${slot.displayName} の復帰猶予が切れました。`);
    }
    const roomIdleMs = now - Number(room.updatedAt || now);
    if (!room.p1 && !room.p2 && !room.spectator && roomIdleMs > RECONNECT_GRACE_MS) {
      rooms.delete(room.roomId);
      changed = true
      continue;
    }
    if (room.game?.phase === 'finished' && roomIdleMs > ROOM_STALE_DELETE_MS) {
      rooms.delete(room.roomId);
      changed = true
    }
  }
  if (changed) scheduleRoomsPersist();
}

loadPersistedRooms();
setInterval(cleanupExpiredReconnectSlots, 15000);

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (req.method === 'POST' && pathname === '/api/cards') {
    try {
      const body = await readJsonBody(req);
      const unlockAuth = sanitizeUnlockAuth(body);
      const catalog = buildCatalogForSaveKey(unlockAuth.saveKey, unlockAuth.unlockTokens);
      sendJson(res, 200, catalog);
    } catch (error) {
      console.error(error);
      sendJson(res, 400, { error: 'カード一覧の取得に失敗しました。' });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/unlock-card') {
    try {
      const body = await readJsonBody(req);
      const saveKey = normalizeSaveKey(body?.saveKey || '');
      const normalizedCode = normalizeUnlockCode(body?.code || '');
      if (!saveKey) {
        sendJson(res, 400, { error: '保存キーを入れてください。' });
        return;
      }
      const def = UNLOCK_CODE_MAP.get(normalizedCode);
      if (!def) {
        sendJson(res, 404, { error: '解放コードが一致しません。' });
        return;
      }
      const token = issueUnlockToken(saveKey, def.cardIds);
      const unlockedCards = def.cardIds.map((id) => cardMap.get(id)).filter(Boolean);
      sendJson(res, 200, {
        ok: true,
        token,
        codeLabel: def.label,
        cardIds: def.cardIds,
        unlockedCards,
      });
    } catch (error) {
      console.error(error);
      sendJson(res, 400, { error: '解放コードの確認に失敗しました。' });
    }
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const safePath = path.normalize(pathname).replace(/^([/]*\.{1,2}[/]+)+/, '');
  const filePath = path.join(ROOT_DIR, safePath);
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mimeType });
    fs.createReadStream(filePath).pipe(res);
  });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  send(ws, { type: 'server_notice', message: 'ルームサーバーへ接続しました。' });

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      switch (data.type) {
        case 'create_room': handleCreateRoom(data, ws); break;
        case 'join_room': handleJoinRoom(data, ws, false); break;
        case 'spectate_room': handleJoinRoom(data, ws, true); break;
        case 'reconnect_room': handleReconnectRoom(data, ws); break;
        case 'start_game': handleStartGame(data, ws); break;
        case 'place_setup_unit': handlePlaceSetupUnit(data, ws); break;
        case 'move_unit': handleMoveUnit(data, ws); break;
        case 'attack_unit': handleAttackUnit(data, ws); break;
        case 'use_item': handleUseItem(data, ws); break;
        case 'finish_item_phase': handleFinishItemPhase(data, ws); break;
        case 'end_turn': handleEndTurn(data, ws); break;
        case 'sync_public_state': handleSyncPublicState(data, ws); break;
        case 'room_action_request': handleRoomActionRequest(data, ws); break;
        case 'ping': send(ws, { type: 'pong', at: Date.now() }); break;
        case 'heartbeat': send(ws, { type: 'heartbeat_ack', at: Date.now() }); break;
        default: send(ws, { type: 'error', message: '未対応のメッセージです。' }); break;
      }
    } catch (error) {
      console.error(error);
      send(ws, { type: 'error', message: 'メッセージの読み取りに失敗しました。' });
    }
  });

  ws.on('close', () => removeConnection(ws));
});

function flushRoomsNow() {
  if (persistRoomsTimer) {
    clearTimeout(persistRoomsTimer);
    persistRoomsTimer = null;
  }
  writeRoomsToDisk();
}

process.on('SIGTERM', flushRoomsNow);
process.on('SIGINT', flushRoomsNow);
process.on('beforeExit', flushRoomsNow);

server.listen(PORT, HOST, () => {
  console.log(`RED VEIN room server: http://localhost:${PORT}`);
  console.log('この黒い画面は閉じずに、そのままにしてください。');
});
