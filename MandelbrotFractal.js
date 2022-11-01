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

function belongs(re, im, iterations) {
    var z = new Complex(0, 0);
    var c = new Complex(re, im);
    var i = 0;
    while(z.abs() < 2 && i < iterations) {
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
    var tmp = hexToRgb(myColor).g;

    console.log("Функція пішла!")
    // Беремо відстань між максимум та мінімум
    // Знаходимо середину (для реальної частини це 0.5, а для уявної 0)
    // Відстань ділимо на наше збільшення
    // Отримане число ще раз ділимо на 2
    // Щоб отримати праве число, ми додаємо до середини, а для лівої віднімаємо від неї

    var minRe = (3 / (2 * zoom) + 0.5) * (-1), maxRe = 3 / (2 * zoom) - 0.5, minIm = 2 / (2 * zoom) * (-1), maxIm = 2 / (2 * zoom);

    var reStep = (maxRe - minRe) / width, imStep = (maxIm - minIm) / height;
    var re = minRe;
    while (re < maxRe) {
        var im = minIm;
        while (im < maxIm) {
            var result = belongs(re, im, maxIterations);
            var x = (re - minRe) / reStep, y = (im - minIm) / imStep;
            if (result == maxIterations) {
                pixel(x, y, 'black');
            } else {
                var h = tmp + Math.round(120 * result * 1.0 / maxIterations);
                var color = 'hsl(' + h + ', 100%, 50%)';
                pixel(x, y, color);
            }
            im += imStep;
        }
        re += reStep;
    }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}