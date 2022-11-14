const download_img = () => {
    const canvas = document.getElementById("panel");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

var canvas1;
var ctx1;
var canvas2;
var ctx2;

var images = [ // Массив используемых изображений
    'bilders/pic1.jpg',
    'bilders/pic2.jpg',
    'bilders/pic3.jpg',
    'bilders/pic4.jpg'
];

function load(){

    var image = new Image();
    image.onload = function () {
        ctx1.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }
    image.src = images[1];
    canvas1 = document.getElementById('panel');
    ctx1 = canvas1.getContext('2d');

    var image2 = new Image();
    image2.onload = function () {
        ctx2.drawImage(image2, 0, 0, image2.width, image2.height); // draw the image on the canvas
    }
    image2.src = images[1];
    canvas2 = document.getElementById('panel2');
    ctx2 = canvas2.getContext('2d');

}

    document.getElementById('start-button').addEventListener('click', () => {
        const resultElement = document.getElementById('result');      
        const eyeDropper = new EyeDropper();
      
        eyeDropper.open().then((result) => {
            document.getElementById("preview").style.backgroundColor = result.sRGBHex;

            var color=result.sRGBHex;
            console.log(color);
            var rgb=color.match(/\d+/g);
            console.log(rgb);
            var hsv=rgb2hsv(rgb[0],rgb[1],rgb[2]);
            console.log(hsv);

            var cmyk=rgb2cmyk(rgb[0],rgb[1],rgb[2]);
            console.log(cmyk);

            document.getElementById("_c").value=cmyk.c;
            document.getElementById("_m").value=cmyk.m;
            document.getElementById("_y").value=cmyk.y;
            document.getElementById("_k").value=cmyk.k;

            document.getElementById("h").value=hsv.h;
            document.getElementById("s").value=hsv.s;
            document.getElementById("v").value=hsv.v;

        }).catch((e) => {
          resultElement.textContent = e;
        });
      });

      function rgb2hsv (r, g, b) {
        let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
        rabs = r / 255;
        gabs = g / 255;
        babs = b / 255;
        v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
        diffc = c => (v - c) / 6 / diff + 1 / 2;
        percentRoundFn = num => Math.round(num * 100) / 100;
        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(rabs);
            gg = diffc(gabs);
            bb = diffc(babs);
    
            if (rabs === v) {
                h = bb - gg;
            } else if (gabs === v) {
                h = (1 / 3) + rr - bb;
            } else if (babs === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        h=Math.round(h * 360);
        s=percentRoundFn(s * 100);
        v= percentRoundFn(v * 100);

        s=Math.round(s);
        v=Math.round(v);

        return {
            h: h,
            s: s,
            v: v
        };
    }

    var rgb2cmyk = function(r, g, b){
        var c = 1 - (r / 255);
        var m = 1 - (g / 255);
        var y = 1 - (b / 255);
        var k = Math.min(c, Math.min(m, y));
        
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);
        
        c = isNaN(c) ? 0 : c;
        m = isNaN(m) ? 0 : m;
        y = isNaN(y) ? 0 : y;
        k = isNaN(k) ? 0 : k;

        c*=100;m*=100;y*=100;k*=100;

        c=Math.round(c);
        m=Math.round(m);
        y=Math.round(y);
        k=Math.round(k);
        
        return {
            c: c,
            m: m,
            y: y,
            k: k
        }
    }