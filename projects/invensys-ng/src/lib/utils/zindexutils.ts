interface ZIndexUtilsInterface {
  get: (el: HTMLElement | null) => number;
  set: (key: string, el: HTMLElement | null, baseZIndex: number) => void;
  clear: (el: HTMLElement | null) => void;
  getCurrent: () => number;
}

export function ZIndexUtils(): ZIndexUtilsInterface {
  interface ZIndexEntry {
    key: string;
    value: number;
  }

  let zIndexes: ZIndexEntry[] = [];

  const generateZIndex = (key: string, baseZIndex: number): number => {
    let lastZIndex =
      zIndexes.length > 0
        ? zIndexes[zIndexes.length - 1]
        : { key, value: baseZIndex };
    let newZIndex =
      lastZIndex.value + (lastZIndex.key === key ? 0 : baseZIndex) + 2;

    zIndexes.push({ key, value: newZIndex });

    return newZIndex;
  };

  const revertZIndex = (zIndex: number): void => {
    zIndexes = zIndexes.filter((obj: ZIndexEntry) => obj.value !== zIndex);
  };

  const getCurrentZIndex = (): number => {
    return zIndexes.length > 0 ? zIndexes[zIndexes.length - 1].value : 0;
  };

  const getZIndex = (el: HTMLElement | null): number => {
    return el ? parseInt(el.style.zIndex, 10) || 0 : 0;
  };

  return {
    get: getZIndex,
    set: (key: string, el: HTMLElement | null, baseZIndex: number): void => {
      if (el) {
        el.style.zIndex = String(generateZIndex(key, baseZIndex));
      }
    },
    clear: (el: HTMLElement | null): void => {
      if (el) {
        revertZIndex(getZIndex(el));
        el.style.zIndex = '';
      }
    },
    getCurrent: () => getCurrentZIndex(),
  };
}

export default ZIndexUtils();
