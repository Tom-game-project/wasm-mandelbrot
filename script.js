//これは挙動のテスト
import init, { mandelblot_set } from "./pkg/wasm_mandelbrot.js";

const width = 512;
const height = 512;

let scaleX = 4.0;
let scaleY = 4.0;

let draw_x = -2;
let draw_y = -2;

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.style.backgroundColor="black";

function draw() {
    //マンデルブロ集合をキャンバス内に表示する
    const start = performance.now();
    // 実行時間を計測した処理
    let data = mandelblot_set(
        width, height / 2,//描画する時の実際の幅と高さ

        scaleX, scaleY / 2,//スケール

        // スケールを変えることによってshape(512/2,512/2)の画像データが返却された
        // 実際に期待する形状の画像データはshape(512/2,512)である。
        // lib.rsに問題がある可能性がある
        draw_x, draw_y,//
        200  //計算回数
    )
    console.log(data);
    let a = new Uint8ClampedArray(
        data
    )
    const Image = new ImageData(a, width);

    //情報表示
    let scale_width = document.getElementById("scale_width");
    let scale_height = document.getElementById("scale_height");
    let drawX = document.getElementById("draw_x");
    let drawY = document.getElementById("draw_y");
    scale_width.innerHTML = "width:" + scaleX;
    scale_height.innerHTML = "height:" + scaleY;
    drawX.innerHTML = "左上real:" + draw_x;
    drawY.innerHTML = "左上imag:" + draw_y;

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(Image, 0, 0, 0, 0, width, height);

    const end = performance.now();
    const draw_time = document.getElementById("draw_time");
    draw_time.innerHTML = (end - start) + "ms";
}

init().then(() => {
    draw()
});
