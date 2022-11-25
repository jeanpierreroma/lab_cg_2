function Complex(re, im) {
    this.re = re;
    this.im = im;
}
Complex.prototype.add = function(other) {
    return new Complex(this.re + other.re, this.im + other.im);
}
Complex.prototype.mul = function(other) {
    return new Complex(this.re * other.re - this.im * other.im, this.re * other.im + this.im * other.re);
}
Complex.prototype.abs = function() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
}

function belongs(re, im, iterations, Cx, Cy) {
    var z = new Complex(re, im);
    var c = new Complex(Cx, Cy);
    var i = 0;
    while(z.abs() <= 2 && i < iterations) {
        z = z.mul(z).add(c);
        i++;
    }
    return i;
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function pixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

function draw(width, height, myColor, zoom) {
    var maxIterations = 500;

    var Cx = Number.parseFloat(document.getElementById('cx').value);
    var Cy = Number.parseFloat(document.getElementById('cy').value);
    if(isInLimit(Cx, Cy)) {

        console.log(getcolor(myColor))

        let arr_colors = getcolor(myColor)
        // Беремо відстань між максимум та мінімум
        // Знаходимо середину (для реальної частини це 0.5, а для уявної 0)
        // Відстань ділимо на наше збільшення
        // Отримане число ще раз ділимо на 2
        // Щоб отримати праве число, ми додаємо до середини, а для лівої віднімаємо від неї

        var minRe = (4 / (2 * zoom)) * (-1), maxRe = 4 / (2 * zoom), minIm = (4 / (2 * zoom)) * (-1), maxIm = 4 / (2 * zoom);

        var reStep = (maxRe - minRe) / width, imStep = (maxIm - minIm) / height;
        var re = minRe;
        while (re < maxRe) {
            var im = minIm;
            while (im < maxIm) {
                var result = belongs(re, im, maxIterations, Cx, Cy);
                var x = (re - minRe) / reStep, y = (im - minIm) / imStep;
                if (result == maxIterations) {
                    pixel(x, y, 'black');
                } else {
                    let color;
                    if(result % 5 == 0) {
                        color = arr_colors[0];
                    } else if (result % 5 == 1) {
                        color = arr_colors[1];
                    } else if (result % 5 == 2) {
                        color = arr_colors[2];
                    } else if (result % 5 == 3) {
                        color = arr_colors[3];
                    } else {
                        color = arr_colors[4];
                    }
                    pixel(x, y, color);
                }
                im += imStep;
            }
            re += reStep;
        }
    }
}

function getcolor(myHex)
{
    var hex = myHex;
    let n = 5;
    var hsl = toHSL(hex);
    var stepS = 5;
    var stepL = 5;
    var arr = [hex]; 
    for(;n!==0;n--) {
        hsl=toHSL(hex);
        hsl[1]-=stepS;
        hsl[2]+=stepL;
        hex=toHex(hsl[0],hsl[1],hsl[2]);
        arr.push(hex);
    }
    return arr;
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


function toHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

const download_img = () => {
    const canvas = document.getElementById("canvas");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

function sign() {
    let text = document.getElementById('sign_text');
    // document.getElementById('sign_text').style.visibility = "visible"
    if(text.style.visibility === 'hidden') {
        text.style.visibility ='visible';
    } else {
        text.style.visibility ='hidden';
    }
}
function sign_2() {
    let text = document.getElementById('sign_text_2');
    // document.getElementById('sign_text').style.visibility = "visible"
    if(text.style.visibility === 'hidden') {
        text.style.visibility ='visible';
    } else {
        text.style.visibility ='hidden';
    }
}
function isInLimit(Cx, Cy) {
    let text = document.getElementById('sign_text_3');
    // let sign = document.getElementById('sign2');
    if(Cx > 2 || Cx < -2 || Cy > 2 || Cy < -2) {
        text.style.visibility ='visible';
        setTimeout(function(){
            text.style.visibility ='hidden';
            document.getElementById('sign2').style.background = 'url(images/signt.png)';
        }, 7000);
        return false;
    }
    else {
        text.style.visibility ='hidden';
    }
    return true;
}