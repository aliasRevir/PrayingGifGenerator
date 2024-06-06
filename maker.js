var imgb64;
var imgsrc = 2;
var delay = 45;
const w = 667;
const h = 375;


function initImg(name) {
        return new Promise(resolve => {
                let img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                img.onload = img.onerror = () => { resolve(img); document.getElementById("genstatus2").innerText = (parseInt(document.getElementById("genstatus2").innerText) + 1).toString(); };
                img.src = name;
        })
}

function createImgRoll(src) {
        let ret = [];
        let name = ["", "", "", "", "", "", "", ""], preffix = "";
        if (src == 0) {
                name = ["ffxggnnh", "odj4jl2r", "5780sxer", "nv3f0u9v", "5d4vsyf8", "bmohioy4", "l3dpfxv4", "ixjzd5yu"];
                preffix = "https://cdn.luogu.com.cn/upload/image_hosting/";
        } else if (src == 1) {
                name = ["1", "2", "3", "4", "5", "6", "7", "8"];
                preffix = "https://aliasrevir.github.io/PrayingGifGenerator/images/pray/";
        } else if (src == 2) {
                name = ["1", "2", "3", "4", "5", "6", "7", "8"];
                preffix = "https://gcore.jsdelivr.net/gh/aliasrevir/PrayingGifGenerator/images/pray/";
        } else if (src == 3) {
                name = ["pPktKZ8","pPkt3Gj","pPkt1iQ","pPktMdS","pPktQIg","pPkt8Rs","pPktGzn","pPktYMq"];
                preffix = "https://s1.ax1x.com/2023/08/05/";
        } else if (src == 4) {
                name = ["1", "2", "3", "4", "5", "6", "7", "8"];
                preffix = "https://jsd.cdn.zzko.cn/gh/aliasrevir/PrayingGifGenerator/images/pray/";
        }
        for (let i = 0; i <= 7; i++) { ret.push(initImg(preffix + name[i] + ".png")); }
        for (let i = 6; i >= 1; i--) { ret.push(initImg(preffix + name[i] + ".png")); }
        return ret;
}


function drawTrapezoidV(ctx, img, x, y, w, h, factor) {
        var idx = 0, scale = img.width / w;
        for (; idx < w; idx++) {
                ctx.drawImage(img, ((idx + 0.5) * scale - 0.5)|0, 0, 1, img.height,
                                                x + idx, y + (1 - ((w - idx) + idx * factor) / w) * h / 2,
                                                1, ((w - idx) + idx * factor) / w * h);
        }
}


function createGif() {
        
        let ret = createImgRoll(imgsrc);
        let praygif = new GIF({
                                                        width: w,
                                                        height: h,
                                                        workers: 2,
                                                        quality: 10,
                                                        workerScript: 'https://aliasrevir.github.io/PrayingGifGenerator/gifjs/gif.worker.js'
                                                });

        let canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext('2d');

        let upimg = new Image();
        upimg.src = imgb64;

        document.getElementById("genstatus1").innerText = " loading images:";
        document.getElementById("genstatus2").innerText = "0";
        document.getElementById("genstatus3").innerText = "/14";

        Promise.all(ret).then(value => {

                value.forEach((value1, index) => {
        
                        // draw
                        ctx.clearRect(0, 0, w, h);
                        ctx.setTransform(1, 0.21, 0, 1, 50, -40);
                        drawTrapezoidV(ctx, upimg, 0, 0, 236, 334, 0.81);
                        ctx.setTransform(1, 0, 0, 1, 0, 0);
                        ctx.drawImage(value1, 0, 0);
        
                        // insert as frame
                        praygif.addFrame(ctx, {
                                delay: delay,
                                copy: true
                        });
                });

                document.getElementById("genstatus1").innerText = " generating GIF";
                document.getElementById("genstatus2").innerText = "";
                document.getElementById("genstatus3").innerText = "";

                praygif.on('finished', function (blob) {
                        console.log(blob);
                        document.querySelector(".result-gif").src = URL.createObjectURL(blob);
                });
                praygif.render();

                document.getElementById("genstatus1").innerText = " finished";
        });
}

document.getElementById("genGIF").addEventListener("click", () => {
        createGif();
});


function ProcessFile(e) {
        var ufile = document.getElementById('fileupl').files[0];
        if (ufile) {
                var reader = new FileReader();
                reader.onload = function (event) {
                        imgb64 = event.target.result;
                        var img = document.createElement("img");
                        img.src = imgb64;
                        img.height = 200;
                        if (document.getElementById("uplresult").hasChildNodes()) {
                                document.getElementById("uplresult").removeChild(document.getElementById("uplresult").firstChild);
                        }
                        document.getElementById("uplresult").appendChild(img);
                        document.getElementById("genGIF").disabled = false;
                };
        }
        reader.readAsDataURL(ufile);
}

function contentLoaded() {
        document.getElementById('fileupl').addEventListener('change', ProcessFile, false);
}

window.addEventListener("DOMContentLoaded", contentLoaded, false);

function updFrameSpd() {
        if (document.getElementById('framespd').value >= 1 && document.getElementById('framespd').value <= 1000) {
                delay = document.getElementById('framespd').value;
                document.getElementById('speedviewer').innerHTML = delay;
        }
}

function changeImgOrigin(new_id) {
        if (new_id == 0 || new_id == 1 || new_id == 2 || new_id == 3 || new_id == 4) { imgsrc = new_id; }
}
