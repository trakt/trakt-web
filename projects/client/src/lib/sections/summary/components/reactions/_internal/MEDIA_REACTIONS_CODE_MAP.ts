/**
 * The media reaction set, keyed by wire name, in picker order. The server
 * summary carries every one of these at zero, so this map is the only place
 * the client needs the emoji. Values are Noto animated emoji codes
 * (https://googlefonts.github.io/noto-emoji-animation/), derived from the
 * glyph's code points.
 */
export const MEDIA_REACTIONS_CODE_MAP = {
  heart_eyes: '1f60d', // 😍
  love: '2764_fe0f', // ❤️
  rofl: '1f923', // 🤣
  holding_back_tears: '1f979', // 🥹
  partying: '1f973', // 🥳
  mind_blown: '1f92f', // 🤯
  cursing: '1f92c', // 🤬
  weary: '1f629', // 😩
  woozy: '1f974', // 🥴
  yawning: '1f971', // 🥱
  spoiler: '1fae3', // 🫣
  shushing: '1f92b', // 🤫
  smiling_tear: '1f972', // 🥲
  neutral: '1f610', // 😐
  shocked: '1f631', // 😱
  anxious: '1f630', // 😰
  thinking: '1f914', // 🤔
  flushed: '1f633', // 😳
  melting: '1fae0', // 🫠
  grimacing: '1f62c', // 😬
  vomiting: '1f92e', // 🤮
  eye_roll: '1f644', // 🙄
  like: '1f44d', // 👍
  rock_on: '1f918', // 🤘
  dislike: '1f44e', // 👎
  bravo: '1f44f', // 👏
  skull: '1f480', // 💀
  popcorn: '1f37f', // 🍿
  fire: '1f525', // 🔥
  crying: '1f62d', // 😭
  pinched_fingers: '1f90c', // 🤌
  broken_heart: '1f494', // 💔
  freezing: '1f976', // 🥶
  disguised: '1f978', // 🥸
  nerd: '1f913', // 🤓
  monocle: '1f9d0', // 🧐
} as const;

export type MediaReactionType = keyof typeof MEDIA_REACTIONS_CODE_MAP;
