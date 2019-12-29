import { Key, TweenState, Animation, ImageAsset } from "./types";

const images: HTMLImageElement[] = [];
const sounds: HTMLAudioElement[] = [];
const svgs: HTMLObjectElement[] = [];

let allLoaded = 0;

export const addImage = (img: HTMLImageElement) => {
  allLoaded++;
  images.push(img);
};

export const addSound = (sound: HTMLAudioElement) => {
  allLoaded++;
  sounds.push(sound);
};

export const addSvg = (svg: HTMLObjectElement) => {
  allLoaded++;
  svgs.push(svg);
};

export const finishLoad = () => {
  allLoaded--;
};

export const isLoaded = () => allLoaded === 0;

export const getImageAssets = () => {
  return images;
};

export const getSoundAssets = () => {
  return sounds;
};

export const getSvgAssets = () => {
  return svgs;
};

export const isMobile = (() => {
  const userAgent = navigator.userAgent;
  if (
    (userAgent.indexOf("iPhone") > 0 && userAgent.indexOf("iPad") == -1) ||
    userAgent.indexOf("iPod") > 0 ||
    userAgent.indexOf("Android") > 0
  ) {
    return true;
  }
  return false;
})();

export const orientation = (e => {
  const mq = window.matchMedia("(orientation: portrait)");
  if (mq.matches) {
    return "portrait";
  }
  return "landscape";
})();

export const setKeyState = (ret: Key, e: KeyboardEvent) => {
  const which = e.which;
  switch (which) {
    case 13:
      ret.enter = true;
      break;
    case 16:
      ret.shift = true;
      break;
    case 32:
      ret.space = true;
      break;
    case 39: // Key[→]
      ret.right = true;
      break;
    case 37: // Key[←]
      ret.left = true;
      break;
    case 38: // Key[↑]
      ret.up = true;
      break;
    case 40: // Key[↓]
      ret.down = true;
      break;
    case 8:
      ret.backspace = true;
      break;
  }
  if (e.metaKey) {
    ret.command = true;
  }
  for (let i = 0; i < 26; i++) {
    if (i + 65 == which) {
      const chr = String.fromCharCode(i + 97);
      //@ts-ignore
      ret[chr] = true;
      break;
    }
  }
};

export const clearKeyState = (ret: Key) => {
  ret.enter = false;
  ret.command = false;
  ret.shift = false;
  ret.space = false;
  ret.right = false;
  ret.left = false;
  ret.up = false;
  ret.down = false;
  ret.backspace = false;
  for (let i = 0; i < 26; i++) {
    //@ts-ignore
    ret[String.fromCharCode(i + 97)] = false;
  }
};

const keydown = (() => {
  const ret = {} as Key;
  clearKeyState(ret);
  return ret;
})();

export const getKeydown = () => keydown;

export const Tween = (that: any, kind: Animation, frame: number) => {
  const mover = that.mover;
  const target = mover[mover.length - 1];
  let obj = {} as TweenState;
  if (target && target.and) {
    obj = target;
  }
  obj.time = 0;
  if (frame) {
    obj.frame = frame;
  }
  obj.loop = false;
  obj.and = false;
  obj[kind] = true;
  return obj;
};
