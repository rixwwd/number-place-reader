import Tesseract from 'tesseract.js';

const FRAME_SIZE = 64 * 9;

export class Ocr {

  /**
   * 数字を読む
   * @return 読み取り結果
   */
  async readDigit(srcCanvas: HTMLCanvasElement): Promise<string[][]> {
    const ctx = srcCanvas.getContext('2d');
    if (ctx == null) {
      console.log("failed getContext");
      return [];
    }

    const pixel = ctx.getImageData(0, 0, srcCanvas.width, srcCanvas.height).data;
    const startPos = Math.floor(64 / 2);

    const worker = await Tesseract.createWorker('eng');
    worker.setParameters({ tessedit_char_whitelist: '0123456789' });

    const rows: string[][] = [];
    for (let y = 0; y < 9; y++) {
      const cols: string[] = [];
      for (let x = 0; x < 9; x++) {
        const [countX, countY] = this.countNonZero(pixel, x * 64, y * 64);
        const left = this.findBorder(countX, startPos, -1);
        const right = this.findBorder(countX, startPos, 1);
        const top = this.findBorder(countY, startPos, -1);
        const bottom = this.findBorder(countY, startPos, 1);

        const result = await worker.recognize(
          srcCanvas,
          {
            rectangle: {
              top: top + y * 64,
              left: left + x * 64,
              width: right - left,
              height: bottom - top
            }
          },
          { text: true, blocks: true }
        );
        const text = result.data.text.trim();
        const digit = text.length === 0 ? '' : text;
        cols.push(digit);
      }
      rows.push(cols);
    }
    console.log(rows);
    return rows;
  }

  /**
   * 0ではないピクセルデータを数える
   * @param {pixelData}
   * @param {x}
   * @param {y}
   */
  private countNonZero(pixelData: Uint8ClampedArray<ArrayBufferLike>, x: number, y: number): number[][] {
    const countX: number[] = [];
    const countY: number[] = [];
    for (let i = 0; i < 64; i++) {
      countX[i] = 0;
      countY[i] = 0;
    }
    for (let i = 0; i < 64; i++) {
      for (let j = 0; j < 64; j++) {
        const baseIndex = ((y + i) * FRAME_SIZE + (x + j)) * 4;
        const r = pixelData[baseIndex];
        const g = pixelData[baseIndex + 1];
        const b = pixelData[baseIndex + 2];
        if (r !== 0 || g !== 0 || b !== 0) {
          countX[j]++;
          countY[i]++;
        }
      }
    }
    return [countX, countY];
  }

  private findBorder(countArray: number[], start: number, step: number): number {
    const ZERO_THREASHOLD = 8;
    const PADDING = 8;
    let zeroCount = 0;
    let padding = 0;
    for (let i = start; i >= 0 && i < countArray.length; i += step) {
      if (countArray[i] <= ZERO_THREASHOLD) {
        zeroCount++;
        if (zeroCount >= PADDING) padding = i;
      } else {
        zeroCount = 0;
      }
    }

    return padding;
  }
}