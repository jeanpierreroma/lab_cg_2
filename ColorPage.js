const download_img = () => {
    const canvas = document.getElementById("panel");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};
const download_img2 = () => {
    const canvas = document.getElementById("panel2");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

var canvas;
var ctx1;
var canvas2;
var ctx2;
var pixels=new Array();
var pixels2=new Array();

document.getElementById('start-button').addEventListener('click', () => {
    const resultElement = document.getElementById('result');
    const eyeDropper = new EyeDropper();

    eyeDropper.open().then((result) => {
        document.getElementById("preview").style.backgroundColor = result.sRGBHex;
        var color=result.sRGBHex;
        var rgb=color.match(/\d+/g);
        var hsv=rgb2hsv(rgb[0],rgb[1],rgb[2]);
        var cmyk=rgb2cmyk(rgb[0],rgb[1],rgb[2]);

        document.getElementById("_c").value=cmyk.c;
        document.getElementById("_m").value=cmyk.m;
        document.getElementById("_y").value=cmyk.y;
        document.getElementById("_k").value=cmyk.k;

        document.getElementById("_h").value=hsv.h;
        document.getElementById("_s").value=hsv.s;
        document.getElementById("_v").value=hsv.v;
    }).catch((e) => {
    resultElement.textContent = e;
    });
});

document.getElementById("picField").onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
    files = tgt.files;
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
          var img = document.getElementById("outImage");

          img.src = fr.result;
          context = document.getElementById("panel").getContext("2d");

          img.addEventListener("load", function () {
              context.drawImage(img, 0, 0, 300, 200);
          });
      };
      fr.readAsDataURL(files[0]);
    }
};

document.getElementById("picField2").onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
    files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            var img = document.getElementById("outImage2");
            img.src = fr.result;
            let context2 = document.getElementById("panel2").getContext("2d");
            img.addEventListener("load", function () {
                // canvas2.height = (canvas2.width * img.height) / img.width;
                context2.drawImage(img, 0, 0, 300, 200);
            });
        };
        fr.readAsDataURL(files[0]);
    }
};

function change() {
    var context2 = document.getElementById("panel2").getContext("2d");
    var imagedata = context2.getImageData(0,0,300,200);
    console.log(imagedata.data);
    for (var y = 0; y < imagedata.data.length; y+=4) {
        var cmyk = rgb2cmyk(Number.parseInt(imagedata.data[y+0]),Number.parseInt( imagedata.data[y+1]),Number.parseInt( imagedata.data[y+2]));
        var rgb=cmyk2rgb(cmyk.c,cmyk.m,cmyk.y,cmyk.k);
        imagedata.data[y+0]=rgb.r;
        imagedata.data[y+1]=rgb.g;
        imagedata.data[y+2]=rgb.b;
    }
    context2.putImageData(imagedata,0,0);
}

function RGBToHSL(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  };

function HSLToRGB(h, s, l){
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function use() {
    var context = document.getElementById("panel").getContext("2d");
    pixels = new Array();
    var imagedata = context.getImageData(0,0,300,200);

    var brightness_s=document.getElementById("zoom_b").value;
    var saturation_s=document.getElementById("zoom_s").value;

    for (var y = 0; y < imagedata.data.length; y+=4) {
        var hsl = RGBToHSL(imagedata.data[y+0], imagedata.data[y+1], imagedata.data[y+2]);
        var hue = hsl[0];
        var saturation = hsl[1];
        var lightness = hsl[2];
        if(hue>220 && hue<260) {
              saturation=saturation_s;
              lightness=brightness_s;
        }
        var rgb=HSLToRGB(hue,saturation,lightness);
        imagedata.data[y+0]=rgb[0];
        imagedata.data[y+1]=rgb[1];
        imagedata.data[y+2]=rgb[2];
    }
    context.putImageData(imagedata,0,0);
}

function cmyk2rgb(c, m, y, k){
    c = (c / 100);
    m = (m / 100);
    y = (y / 100);
    k = (k / 100);

    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;

    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;


    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);


    return {
        r: r,
        g: g,
        b: b
    }
}

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
    var c = (r / 255);
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