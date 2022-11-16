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
var pixels=new Array();
var pixels2=new Array();

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


    // function toHSL(hex) {
    //     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    //     var r = parseInt(result[1], 16);
    //     var g = parseInt(result[2], 16);
    //     var b = parseInt(result[3], 16);
    
    //     r /= 255, g /= 255, b /= 255;
    //     var max = Math.max(r, g, b), min = Math.min(r, g, b);
    //     var h, s, l = (max + min) / 2;
    
    //     if(max == min){
    //         h = s = 0; // achromatic
    //     } else {
    //         var d = max - min;
    //         s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    //         switch(max) {
    //             case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    //             case g: h = (b - r) / d + 2; break;
    //             case b: h = (r - g) / d + 4; break;
    //         }
    //         h /= 6;
    //     }
    //         s = s*100;
    //         s = Math.round(s);
    //         l = l*100;
    //         l = Math.round(l);
    //         h = Math.round(360*h);
    //         var arr =[h,s,l];
    //     return arr;
    // }

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

          context.drawImage(img, 0, 0, 300, 200);
  
          pixels = new Array();
  
          for (var x = 0; x < 300; x++) {
            for (var y = 0; y < 200; y++) {
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
          console.log(pixels[0]);
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
          // canvas2.height = (canvas2.width * img.height) / img.width;
          context2.drawImage(img, 0, 0, 300, 200);
  
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
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

    function use()
    {
      const canvas = document.getElementById('panel');
      var context = document.getElementById("panel").getContext("2d");

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

      //console.log(pixels[1]);

        for(var x = 0; x < canvas.height; x++)
          {
            for (var y = 0; y < canvas.width; y++)
            {
              //console.log(pixels[0].hue);
                if(pixels[x*canvas.width+y].hue>190&&pixels[x*canvas.width+y].hue<280)
                {
                    pixels[x*canvas.width+y].saturation -=30; 
                    pixels[x*canvas.width+y].lightness +=30; 
                    //console.log("found");
                    if(pixels[x*canvas.width+y].saturation<0)
                        pixels[x*canvas.width+y].saturation=0;
                    if(pixels[x*canvas.width+y].lightness>100)
                        pixels[x*canvas.width+y].lightness=100;
                }
               // console.log(pixels[3000].hue);
                var rgb=HSLToRGB(pixels[x*canvas.width+y].hue,pixels[x*canvas.width+y].saturation,pixels[x*canvas.width+y].lightness);
                pixels[x*canvas.width+y][0]=rgb[0];
                pixels[x*canvas.width+y][1]=rgb[1];
                pixels[x*canvas.width+y][2]=rgb[2];                
            }
          }

    
    const imageData = context.createImageData(300,200);
    console.log(imageData.data.length);
    console.log(pixels.length);
    console.log(canvas.width,canvas.height);
    // Iterate through every pixel
    var c=0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      // Modify pixel data
      imageData.data[i + 0] = 255;  // R value
      imageData.data[i + 1] = pixels[c][1];    // G value
      imageData.data[i + 2] = pixels[c][2];  // B value
      imageData.data[i + 3] = pixels[c][3];  // A value
      c++;
    }

    // Draw image data to the canvas
    context.putImageData(imageData, 0, 0);

}







  //   document.getElementById("_c").onchange = function () {
  //     update_cmyk();
  //   }
  //   document.getElementById("_m").onchange = function () {
  //     update_cmyk();
  //   }
  //   document.getElementById("_y").onchange = function () {
  //     update_cmyk();
  //   }
  //   document.getElementById("_k").onchange = function () {
  //     update_cmyk();
  //   }

  //   function update_cmyk()
  //   {
  //     var _c=document.getElementById("_c");
  //     var _m=document.getElementById("_m");
  //     var _y=document.getElementById("_y");
  //     var _k=document.getElementById("_k");

  //     var c=_c.value;
  //     var m=_m.value;
  //     var y=_y.value;
  //     var k=_k.value;

  //     var cmyk=[c,m,y,k];
  //     console.log(cmyk);

  //     var rgb=cmyk2rgb(cmyk[0],cmyk[1],cmyk[2],cmyk[3]);
  //     console.log(rgb);
  //     var hsv=rgb2hsv(rgb[0],rgb[1],rgb[2]);
  //     console.log(hsv);

  //     // document.getElementById("_c").value=cmyk.c;
  //     // document.getElementById("_m").value=cmyk.m;
  //     // document.getElementById("_y").value=cmyk.y;
  //     // document.getElementById("_k").value=cmyk.k;

  //     // document.getElementById("h").value=hsv.h;
  //     // document.getElementById("s").value=hsv.s;
  //     // document.getElementById("v").value=hsv.v;

  //   }

  //   document.getElementById("_h").onchange = function () {
  //     update_hsv();
  //   }
  //   document.getElementById("_s").onchange = function () {
  //     update_hsv();
  //   }
  //   document.getElementById("_v").onchange = function () {
  //     update_hsv();
  //   }
  //   function update_hsv()
  //   {
  //     var _h=document.getElementById("_h");
  //     var _s=document.getElementById("_s");
  //     var _v=document.getElementById("_v");

  //     var h=_h.value;
  //     var s=_s.value;
  //     var v=_v.value;

  //     var hsv=[h,s,v];
  //     console.log(hsv);

  //     var rgb=hsv2rgb(hsv[0],hsv[1],hsv[2]);
  //     console.log(rgb);
  //     var cmyk=rgb2cmyk(rgb[0],rgb[1],rgb[2]);
  //     console.log(cmyk);

  //     // document.getElementById("_c").value=cmyk.c;
  //     // document.getElementById("_m").value=cmyk.m;
  //     // document.getElementById("_y").value=cmyk.y;
  //     // document.getElementById("_k").value=cmyk.k;

  //     // document.getElementById("h").value=hsv.h;
  //     // document.getElementById("s").value=hsv.s;
  //     // document.getElementById("v").value=hsv.v;

  //   }



  //  function cmyk2rgb(c, m, y, k){
  //     c = (c / 100);
  //     m = (m / 100);
  //     y = (y / 100);
  //     k = (k / 100);
      
  //     c = c * (1 - k) + k;
  //     m = m * (1 - k) + k;
  //     y = y * (1 - k) + k;
      
  //     var r = 1 - c;
  //     var g = 1 - m;
  //     var b = 1 - y;
      
      
  //         r = Math.round(255 * r);
  //         g = Math.round(255 * g);
  //         b = Math.round(255 * b);
      
      
  //     return {
  //         r: r,
  //         g: g,
  //         b: b
  //     }
  // }

  // function hsv2rgb(h, s, b) {
  //   s /= 100;
  //   b /= 100;
  //   const k = (n) => (n + h / 60) % 6;
  //   const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  //   return [255 * f(5), 255 * f(3), 255 * f(1)];
  // };

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