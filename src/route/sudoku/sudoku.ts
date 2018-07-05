import { uniq } from 'lodash';

function makeRow(v: number = 0): number[] {
  return Array(9).fill(v);
}

function makeMatrix(v: number = 0): Array<number[]> {
  return Array.from({ length: 9 }, () => makeRow(v));
}

/**
 *  Fisher-Yates 洗牌算法
 */
function shuffle(arr: number[]) {
  const len = arr.length;
  const endIdx = arr.length - 2;
  for (let i = 0; i <= endIdx; i++) {
    const j = i + Math.floor(Math.random() * (len - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 数独初始化
 */
export function initial(level: number = 3): Array<number[]> {
  let matrix = generate();
  while (!matrix) {
    matrix = generate();
  }
  // 挖洞
  let count = 0;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (count > 65) { break; }
      if (Math.random() * 9 < level) {
        matrix[i][j] = 0;
        count++;
      }
    }
  }
  return matrix;
}

/**
 * 数据校验
 */
export function check(arr: Array<number[]>): Array<[number, number]> | boolean {
  let res: Array<[number, number]> = [];
  // 行检查
  arr.forEach((row, rowIndex) => {
    const list = Array.from(row);
    const flag = Array.from(list).sort().join('') === '123456789';
    if (!flag) {
      const errIdxs: Array<[number, number]> = figureoutErrorIdx(list)
        .map((colIdx: number) => [rowIndex, colIdx]) as Array<[number, number]>;
      res = res.concat(errIdxs);
    }
  });

  // 列检查
  arr[0].forEach((v, colIndex) => {
    const list = arr.map(row => row[colIndex]);
    const flag = Array.from(list).sort().join('') === '123456789';
    if (!flag) {
      const errIdxs: Array<[number, number]> = figureoutErrorIdx(list)
        .map((rowIndex: number) => [rowIndex, colIndex]) as Array<[number, number]>;
      res = res.concat(errIdxs);
    }
  });

  // 宫检查
  Array.from({ length: 9 }).forEach((_, idx) => {
    const box = getBoxCoordinates(idx % 3 * 3, idx);
    const list = box.map(([r, c]) => arr[r][c]);
    const flag = Array.from(list).sort().join('') === '123456789';
    if (!flag) {
      const errIdxs: Array<[number, number]> = figureoutErrorIdx(list)
        .map((index: number) => box[index]) as Array<[number, number]>;
      res = res.concat(errIdxs);
    }
  });

  return res.length > 0 ? res : true;
}

function figureoutErrorIdx(arr: number[]): Array<number> {
  const len = arr.length;
  const res: number[] = [];
  for (let i = 0; i < len; i++) {
    const num = arr[i];
    if (!(num > 0 && num < 10)) { res.push(i); continue; }

    if (i === len - 1) { continue; }

    for (let j = i + 1; j < len; j++) {
      const nextNum = arr[j];
      if (num === nextNum) {
        res.push(i);
        res.push(j);
      }
    }
  }
  return uniq(res);
}

function generate(): Array<number[]> | false {
  const matrix = makeMatrix();
  for (let n = 1; n <= 9; n++) {
    if (!fillNumber(matrix, n)) {
      return false;
    }
  }

  return matrix;
}

function fillNumber(matrix: Array<number[]>, n: number) {
  return fillRow(matrix, n, 0);
}

function fillRow(matrix: Array<number[]>, n: number, rowIndex: number): boolean {
  if (rowIndex > 8) { return true; }

  const row = matrix[rowIndex];
  const idxList = shuffle(Array.from({ length: 9 }).map((_, idx) => idx));

  for (let i = 0; i < 9; i++) {
    const colIndex = idxList[i];

    if (row[colIndex] > 0) { continue; }

    if (!checkFillable(matrix, rowIndex, colIndex, n)) { continue; }

    row[colIndex] = n;

    if (!fillRow(matrix, n, rowIndex + 1)) {
      row[colIndex] = 0;
      continue;
    }
    return true;
  }

  return false;
}

function checkFillable(matrix: Array<number[]>, rowIndex: number, colIndex: number, n: number): boolean {
  const row = matrix[rowIndex];
  if (row.indexOf(n) !== -1) { return false; }

  const col = matrix.map(r => r[colIndex]);
  if (col.indexOf(n) !== -1) { return false; }

  const box = getBoxCoordinates(rowIndex, colIndex).map(([r, c]) => matrix[r][c]);
  if (box.indexOf(n) !== -1) { return false; }

  return true;
}

function getBoxCoordinates(rowIndex: number, colIndex: number): Array<[number, number]> {
  const x = Math.floor(rowIndex / 3);
  const y = Math.floor(colIndex / 3);
  const arr: Array<[number, number]> = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      arr.push([x * 3 + i, y * 3 + j]);
    }
  }
  return arr;
}