const download_img = () => {
    const canvas = document.getElementById("panel");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

var canvas;
var ctx1;
var canvas2;
var ctx2;
var pixels 
var pixels2

// var images = [ // Массив используемых изображений
//     'bilders/pic1.jpg',
//     'bilders/pic2.jpg',
//     'bilders/pic3.jpg',
//     'bilders/pic4.jpg'
// ];

// function load(){

//     var image = new Image();
//     image.onload = function () {
//         ctx1.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
//     }
//     image.src = images[1];
//     canvas1 = document.getElementById('panel');
//     ctx1 = canvas1.getContext('2d');

//     var image2 = new Image();
//     image2.onload = function () {
//         ctx2.drawImage(image2, 0, 0, image2.width, image2.height); // draw the image on the canvas
//     }
//     image2.src = images[1];
//     canvas2 = document.getElementById('panel2');
//     ctx2 = canvas2.getContext('2d');

// }

    document.getElementById('start-button').addEventListener('click', () => {
        const resultElement = document.getElementById('result');      
        const eyeDropper = new EyeDropper();
      
        eyeDropper.open().then((result) => {

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



    function toHSL(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
    
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
            s = s*100;
            s = Math.round(s);
            l = l*100;
            l = Math.round(l);
            h = Math.round(360*h);
            var arr =[h,s,l];
        return arr;
    }

document.getElementById("picField").onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
      files = tgt.files;
  
    // FileReader support
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {
        var img = document.getElementById("outImage");
  
        img.src = fr.result;
        context = document.getElementById("panel").getContext("2d");
  
        img.addEventListener("load", function () {

          context.drawImage(img, 0, 0, 400, 300);
  
          pixels = new Array();
  
          for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
              var pixel = context.getImageData(x, y, 1, 1).data;
              var hsl = RGBToHSL(pixel[0], pixel[1], pixel[2]);
              pixel["luma"] =
                0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
              pixel["hue"] = hsl[0];
              pixel["saturation"] = hsl[1];
              pixel["lightness"] = hsl[2];
              pixels.push(pixel);
            } 
          }

        //   console.log(pixels[0].hue);
        //   console.log(pixels[0].saturation);
        //   console.log(pixels[0].lightness);
        //   console.log(pixels[0][0]);
        //   console.log(pixels[0][1]);
        //   console.log(pixels[0][2]);

        //   console.log(pixels.length);

        console.log(pixels[0][0],pixels[0][1],pixels[0][2]);
       console.log(pixels[0].hue,pixels[0].saturation,pixels[0].lightness);

          console.log(canvas.width);
          console.log(canvas.height);
        });
      };
      fr.readAsDataURL(files[0]);
    }
    else {
      // fallback -- perhaps submit the input to an iframe and temporarily store
      // them on the server until the user's session ends.
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
        context2 = document.getElementById("panel2").getContext("2d");
  
        img.addEventListener("load", function () {
          canvas2.height = (canvas2.width * img.height) / img.width;
          context2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
  
         pixels2 = new Array();
  
          for (var x = 0; x < canvas2.width; x++) {
            for (var y = 0; y < canvas2.height; y++) {
              var pixel = context2.getImageData(x, y, 1, 1).data;
              var hsl = RGBToHSL(pixel[0], pixel[1], pixel[2]);
              pixel["luma"] =
                0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
              pixel["hue"] = hsl[0];
              pixel["saturation"] = hsl[1];
              pixel["lightness"] = hsl[2];
              pixels2.push(pixel);
            } 
          }
        });
      };
      fr.readAsDataURL(files[0]);
    }
    else { }
};

const RGBToHSL = (r, g, b) => {
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
  
  const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

    function use()
    {
        for(var x = 0; x < 400; x++)
          {
            for (var y = 0; y < 300; y++)
            {
                if(pixels[x+y].hue>190&&pixels[x+y].hue<280)
                {
                    pixels[x+y].saturation -=30; 
                    pixels[x+y].lightness +=30; 
                    //console.log("found");
                    if(pixels[x+y].saturation<0)
                        pixels[x+y].saturation=0;
                    if(pixels[x+y.lightness]>100)
                        pixels[x+y.lightness]=100;
                }
                var rgb=HSLToRGB(pixels[x+y].hue,pixels[x+y].saturation,pixels[x+y].lightness);
                pixels[x+y][0]=rgb[0];
                pixels[x+y][1]=rgb[1];
                pixels[x+y][2]=rgb[2];                
            }
          }

        //   console.log(pixels[0]);
       console.log(pixels[0][0],pixels[0][1],pixels[0][2]);
       console.log(pixels[0].hue,pixels[0].saturation,pixels[0].lightness);

const canvass = document.getElementById('canvas');
const ctxx = canvass.getContext('2d');
const imageData = ctxx.createImageData(canvass.width,canvass.height);

// Iterate through every pixel
var c=0;
for (let i = 0; i < imageData.data.length; i += 4) {
  // Modify pixel data
  imageData.data[i + 0] = 100;  // R value
  imageData.data[i + 1] = 100;    // G value
  imageData.data[i + 2] = 100;  // B value
  imageData.data[i + 3] = 100;  // A value
}

// Draw image data to the canvas
ctxx.putImageData(imageData, 0, 0);


    }