
import init, { mandelblot_set } from "./pkg/wasm_mandelbrot.js";

const width = 512;
const height = 512;

let scaleX = 4.0;
let scaleY = 4.0;

let draw_x = -2;
let draw_y = -2;

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function draw() {
    //マンデルブロ集合をキャンバス内に表示する
    const start = performance.now();
    // 実行時間を計測した処理
    let a = new Uint8ClampedArray(
        mandelblot_set(
            width, height,//描画する時の実際の幅と高さ
            scaleX, scaleY,//スケール
            draw_x, draw_y,//
            200  //計算回数
        )
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
canvas.addEventListener(
    "click",
    () => {
        let mouseX = document.getElementById("mouse_x");
        let mouseY = document.getElementById("mouse_y");
        let cmp_x = draw_x + (event.offsetX / width) * scaleX;
        let cmp_y = draw_y + (event.offsetY / height) * scaleY;
        mouseX.innerHTML = "mouse_real:" + cmp_x;
        mouseY.innerHTML = "mouse_imag:" + cmp_y;
    })
canvas.addEventListener(
    "mousewheel",
    (event) => {
        event.preventDefault();
        let delta = event.wheelDelta;
        //elem.innerHTML = Math.ceil(delta / 150);
        let e;
        if (delta > 0) {
            e = 9 / 10;
        } else if (delta < 0) {
            e = 10 / 9;
        } else {
            e = 1;
        }
        //消失点計算
        let cmp_x = draw_x + (event.offsetX / width) * scaleX;
        let cmp_y = draw_y + (event.offsetY / height) * scaleY;

        draw_x = draw_x + (cmp_x - draw_x) * (1 - e);
        draw_y = draw_y + (cmp_y - draw_y) * (1 - e);

        scaleX = scaleX * e;
        scaleY = scaleY * e;
        draw()
    });


canvas.addEventListener(
    "mousedown",
    (event) => {
        let baseX = event.offsetX;
        let baseY = event.offsetY;
        const Imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let imageX = 0;
        let imageY = 0;

        function putPaddingImage(deltaX, deltaY, drawX, drawY) {
            //余白を埋めるマンデルブロ集合のイメージ
            console.log(`${drawX},${drawY}`)
            //delta userのマウスの変化のさせ方
            //draw マウスが上がった時に用意している描画座標
            //BESIDE
            const besideWidth = Math.abs(deltaX);
            const besideHeight = height - Math.abs(deltaY);
            const besideDrawWidth = (besideWidth / width) * scaleX;
            const besideDrawHeight = (besideHeight / height) * scaleY;
            const besideDrawX = (deltaX < 0 ? drawX + ((width + deltaX) / width) * scaleX : drawX);
            const besideDrawY = (deltaY < 0 ? drawY : drawY + (deltaY / height) * scaleY);
            //絶対画角上の描画スタート位置
            const besideImageX = (deltaX < 0 ? width + deltaX : 0);
            const besideImageY = (deltaY < 0 ? 0 : deltaY);
            const besideData = new Uint8ClampedArray(
                mandelblot_set(
                    besideWidth, besideHeight,
                    besideDrawWidth, besideDrawHeight,
                    besideDrawX, besideDrawY, 200
                )
            )
            if (besideData.length == 0) {

            } else {
                const besideImage = new ImageData(besideData, besideWidth);
                ctx.putImageData(besideImage, besideImageX, besideImageY);
            }
            //UPDOWNSIDE
            const updownWidth = width;
            const updownHeight = Math.abs(deltaY);
            const updownDrawWidth = scaleX;//明示的に示すならば(1:=updownWidth/width)*scaleX
            const updownDrawHeight = (updownHeight / height) * scaleY;
            const updownDrawX = drawX;//ここも固定
            const updownDrawY = (deltaY < 0 ? drawY + ((height + deltaY) / height) * scaleY : drawY);
            //絶対画角上の描画スタート位置
            const updownsideImageX = 0;//固定。。。定数
            const updownsideImageY = (deltaY < 0 ? height + deltaY : 0);
            const updownsideData = new Uint8ClampedArray(
                mandelblot_set(
                    updownWidth, updownHeight,
                    updownDrawWidth, updownDrawHeight,
                    updownDrawX, updownDrawY, 200
                )
            )
            if (updownsideData.length == 0) {

            } else {
                const updownsideImage = new ImageData(updownsideData, updownWidth);
                //描画の実行
                ctx.putImageData(updownsideImage, updownsideImageX, updownsideImageY);

            }
        }

        function mouseMove(eventmove) {
            //padding計算
            //
            //const Image = new ImageData(a, width);
            let deltaX = eventmove.offsetX - baseX;//delta vector は必ず整数になるハズ
            let deltaY = eventmove.offsetY - baseY;//userのマウスの移動ベクトル
            imageX += deltaX;//imageが描画される絶対画角上の座標
            imageY += deltaY;//imageが描画される絶対画角上の座標

            baseX = eventmove.offsetX;
            baseY = eventmove.offsetY;
            draw_x -= (deltaX / width) * scaleX;
            draw_y -= (deltaY / height) * scaleY;
            // putPaddingImage(deltaX,deltaY)
            ctx.putImageData(Imagedata, imageX, imageY)
            putPaddingImage(imageX, imageY, draw_x, draw_y);

        }

        function mouseUp(eventup) {
            draw()
            canvas.removeEventListener(
                "mousemove",
                mouseMove
            )
            canvas.removeEventListener(
                "mouseup",
                mouseUp
            )
        }

        canvas.addEventListener(
            "mousemove",
            mouseMove
        )
        canvas.addEventListener(
            "mouseup",
            mouseUp
        )
    }
)