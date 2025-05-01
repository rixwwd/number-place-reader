import cv, { type bool } from '@techstark/opencv-js';


const CELL_SIZE = 64;
const FRAME_SIZE = CELL_SIZE * 9;

export class Reader {

  private grayImg = new cv.Mat(FRAME_SIZE, FRAME_SIZE, cv.CV_8UC1);
  private monoImg = new cv.Mat(FRAME_SIZE, FRAME_SIZE, cv.CV_8UC1);
  private removeNoiseImg = new cv.Mat(FRAME_SIZE, FRAME_SIZE, cv.CV_8U);
  private kernel = cv.Mat.ones(2, 2, cv.CV_8U);

  private frameImg = new cv.Mat(FRAME_SIZE, FRAME_SIZE, cv.CV_8UC4);

  constructor() {

  }

  destroy() {

    this.grayImg.delete();
    this.monoImg.delete();
    this.kernel.delete();
    this.removeNoiseImg.delete();

    this.frameImg.delete();
  }

  toCanvas(dst: HTMLCanvasElement) {
    cv.imshow(dst, this.frameImg);
  }

  detect(srcImg: cv.Mat): bool {
    const monochromatizedImage = this.monochromatize(srcImg);

    const frame = this.detectFrame(monochromatizedImage);
    if (frame) {
      this.extractFrame(monochromatizedImage, frame);
    } else {
      return false;
    }

    frame.delete();
    return true;
  }

  /**
   * モノクロ化
   * @param {cv.Mat} srcImg 入力画像
   * @preturn {cv.Mat} モノクロ化した画像
   */
  private monochromatize(srcImg: cv.Mat): cv.Mat {
    cv.cvtColor(srcImg, this.grayImg, cv.COLOR_BGR2GRAY);

    cv.adaptiveThreshold(
      this.grayImg,
      this.monoImg,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      31,
      21
    );


    // 枠を抜き出す際の変形でノイズが広がらないよう、細かいノイズを除去しておく
    cv.morphologyEx(this.monoImg, this.removeNoiseImg, cv.MORPH_OPEN, this.kernel);

    return this.removeNoiseImg;
  }

  /**
   * 枠の検出
   * @param {cv.Mat} srcImg 入力画像
   * @return {cv.Mat} 検出した枠の座標。検出できなかったときはnull。
   */
  private detectFrame(srcImg: cv.Mat): cv.Mat | null {
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(srcImg, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_TC89_L1);

    let maxArea = -1;
    let largeContour;
    for (let i = 0; i < contours.size(); i++) {
      const c = contours.get(i);
      const area = cv.contourArea(c);
      if (area > maxArea) {
        maxArea = area;
        largeContour = c;
      }
    }

    contours.delete();
    hierarchy.delete();

    if (maxArea < 0) {
      return null;
    }

    // https://labs.eecs.tottori-u.ac.jp/sd/Member/oyamada/OpenCV/html/py_tutorials/py_imgproc/py_contours/py_contour_features/py_contour_features.html#id5
    const epsilon = 0.1 * cv.arcLength(largeContour!, true);
    const quadrangle = new cv.Mat(largeContour!.size(), largeContour!.type());
    cv.approxPolyDP(largeContour!, quadrangle, epsilon, true);



    return quadrangle.size().height == 4 ? quadrangle : null;
  }

  /**
   * 枠を抜き出す
   * @param {cv.Mat} srcImg 元の画像
   * @param {cv.Mat} frame 枠の座標
   */
  private extractFrame(srcImg: cv.Mat, frame: cv.Mat): void {
    const points: number[][] = [];

    for (let i = 0; i < frame.size().height; i++) {
      const row = frame.row(i);
      const x = row.data32S.at(0);
      const y = row.data32S.at(1);
      points.push([x!, y!]);
    }

    const sortedY = points.sort((a, b) => a[1]! - b[1]!);
    const [topLeft, topRight] =
      sortedY[0][0] < sortedY[1][0] ? [sortedY[0], sortedY[1]] : [sortedY[1], sortedY[0]];
    const [bottomLeft, bottomRight] =
      sortedY[2][0] < sortedY[3][0] ? [sortedY[2], sortedY[3]] : [sortedY[3], sortedY[2]];

    // 変換前の座標(左上から時計回り)
    const src = cv.matFromArray(4, 1, cv.CV_32FC2, [
      ...topLeft,
      ...topRight,
      ...bottomRight,
      ...bottomLeft
    ]);
    // 変換後の座標(変換前と対応させて左上から時計回り)
    const dst = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0,
      0,
      FRAME_SIZE - 1,
      0,
      FRAME_SIZE - 1,
      FRAME_SIZE - 1,
      0,
      FRAME_SIZE - 1
    ]);
    const matrix = cv.getPerspectiveTransform(src, dst);
    src.delete();
    dst.delete();

    cv.warpPerspective(srcImg, this.frameImg, matrix, new cv.Size(FRAME_SIZE, FRAME_SIZE));
    matrix.delete();
  }

}
