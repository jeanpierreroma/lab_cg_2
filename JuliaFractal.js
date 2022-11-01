//
// JavaScript methods to draw Mandelbrot and Julia Sets
//
// version 1.5 - featuring LSM, DEM, BDM, TDM and BDM2 methods, iterations slider, colour palettes, auto draw julia set mode, and zoom mode
//
// (c) 2009-2022 Mike Harris; (c) 1987-1990 Mike Harris & Dan Grace
// Free software released under GNU Public Licence v2.0.
//

// set up colour palettes for colouring the levels outside the set itself
let colourPalettes =[getcolor()]

    function getcolor()
    {
         var hex=document.getElementById("color_choose").value;
         let n=15;
         var hsl=toHSL(hex);
          var stepS=5;
          var stepL=5;
         var arr = [
             hex
         ]; 
         for(;n!==0;n--)
         {
             hsl=toHSL(hex);
             hsl[1]-=stepS;
             hsl[2]+=stepL;
             hex=toHex(hsl[0],hsl[1],hsl[2]);
             arr.push(hex);
         }
         return arr;
     }
 
     function zoomin() {
        var GFG = document.getElementById("jset_canvass");
        var currWidth = GFG.clientWidth;
        GFG.style.width = (currWidth + 100) + "px";
    }
      
    function zoomout() {
        var GFG = document.getElementById("jset_canvass");
        var currWidth = GFG.clientWidth;
        GFG.style.width = (currWidth - 100) + "px";
    }

    function draw(scale, translatePos) {
        var canvas = document.getElementById("jset_canvass");
        var context = canvas.getContext("2d");
  
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
  
        context.save();
        context.translate(translatePos.x, translatePos.y);
        context.scale(scale, scale);
        context.beginPath(); // begin custom shape
        context.moveTo(-119, -20);
        context.bezierCurveTo(-159, 0, -159, 50, -59, 50);
        context.bezierCurveTo(-39, 80, 31, 80, 51, 50);
        context.bezierCurveTo(131, 50, 131, 20, 101, 0);
        context.bezierCurveTo(141, -60, 81, -70, 51, -50);
        context.bezierCurveTo(31, -95, -39, -80, -39, -50);
        context.bezierCurveTo(-89, -95, -139, -80, -119, -20);
        context.closePath(); // complete custom shape
        var grd = context.createLinearGradient(-59, -100, 81, 100);
        grd.addColorStop(0, "#8ED6FF"); // light blue
        grd.addColorStop(1, "#004CB3"); // dark blue
        context.fillStyle = grd;
        context.fill();
  
        context.lineWidth = 5;
        context.strokeStyle = "#0000ff";
        context.stroke();
        context.restore();
      }


      var scale = 1.0;
      var scaleMultiplier = 0.8;
      var startDragOffset = {};
      var mouseDown = false;

    const selectElement = document.getElementById("zoomm");

    selectElement.addEventListener('change', (event) => {
        var canvas = document.getElementById("jset_canvass");

        var translatePos = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        var val=event.target.value;
        console.log(val);

        scale /= scaleMultiplier;
            draw(scale, translatePos);

    });

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


const xResolution = document.getElementById("mset_canvas").clientWidth
const yResolution = document.getElementById("mset_canvas").clientHeight

const defaultMsetPlane = {x_min: -2.5, y_min: -1.25, x_max: 0.8, y_max: 1.25}
const defaultJsetPlane = {x_min: -2.0, y_min: -1.5, x_max: 2.0, y_max: 1.5}

let paletteNumber = 0

const ZOOM_MODE = 'zoom'
const EXPLORE_MODE = 'explore'
let mode = EXPLORE_MODE

class CanvasRectangleSnapshot {
    constructor(imageData, x, y, w, h) {
        this.imageData = imageData
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

let canvasBeforeZoomBox = null

function init() {
    document.getElementById("palette").setAttribute("max", (colourPalettes.length - 1).toString())
    setMsetWindowTo(defaultMsetPlane)
    setZoomWindowTo(160, 120, 320, 240)
    var v=getcolor();
    colourPalettes.push(v)
}

function setMsetWindowTo(plane) {
    document.getElementById("x_min").value = plane.x_min
    document.getElementById("y_min").value = plane.y_min
    document.getElementById("x_max").value = plane.x_max
    document.getElementById("y_max").value = plane.y_max
}

function setZoomWindowTo(x, y, w, h) {
    document.getElementById("zoom_x").value = x
    document.getElementById("zoom_y").value = y
    document.getElementById("zoom_w").value = w
    document.getElementById("zoom_h").value = h
}

function getCurrentZoomWindow() {
    return {
        x: parseFloat(document.getElementById("zoom_x").value),
        y: parseFloat(document.getElementById("zoom_y").value),
        w: parseFloat(document.getElementById("zoom_w").value),
        h: parseFloat(document.getElementById("zoom_h").value)
    }
}

function selectMethod() {
    const method = document.getElementById('method').value
    switch (method) {
        case 'lsm':
        case 'dem':
        case 'tdm':
        case 'bdm2':
            document.getElementById("palette_chooser").style.display = 'inline'
            break
        default:
            document.getElementById("palette_chooser").style.display = 'none'
    }
    switch (method) {
        case 'dem':
            document.getElementById("dem-parameters").style.display = 'inline'
            document.getElementById("lsm-parameters").style.display = 'none'
            break
        default:
            document.getElementById("dem-parameters").style.display = 'none'
            document.getElementById("lsm-parameters").style.display = 'inline'
    }
}

function getCurrentPlane() {
    return {
        x_min: parseFloat(document.getElementById("x_min").value),
        y_min: parseFloat(document.getElementById("y_min").value),
        x_max: parseFloat(document.getElementById("x_max").value),
        y_max: parseFloat(document.getElementById("y_max").value)
    }
}

function mandelbrot() {
    const canvas = document.getElementById("mset_canvas")
    const currentPlane = getCurrentPlane()
    paletteNumber = document.getElementById('palette').value
    switch (document.getElementById('method').value) {
        case 'dem':
            mandelbrotDrawingFuncDem(canvas.getContext("2d"), document.getElementById('iterations').value, currentPlane)
            break
        default:
            drawSet(canvas, mandelbrotDrawingFuncLsm, currentPlane)
    }
}

function julia() {
    colourPalettes=[];
    var v=getcolor();
    colourPalettes.push(v);
    paletteNumber = document.getElementById('palette').value;
    drawSet(document.getElementById("jset_canvas"), juliaDrawingFuncLsm, defaultJsetPlane)
}

function drawSet(canvas, drawingFunc, plane) {
    const ctx = canvas.getContext("2d")
    ctx.reset()
    const max_iters = document.getElementById('iterations').value
    const method = document.getElementById('method').value

    drawingFunc(ctx, max_iters, getColouringFunctionForMethod(method), plane)
}

function getColouringFunctionForMethod(method) {
    switch (method) {
        case 'bdm':
            return setColourUsingBinaryDecompositionMethod
        case 'bdm2':
            return setColourUsingBinaryDecompositionMethod2
        case 'tdm':
            return setColourUsingTrinaryDecompositionMethod
        case 'lsm':
        default:
            return setColourUsingLevelSetMethod
    }
}

function setColourUsingBinaryDecompositionMethod(iterations, maxIterations, ctx, point) {
    if (iterations == maxIterations) { // we are in the set
        ctx.fillStyle = "#000"
    } else {
        // color it depending on the angle of alpha
        const alpha = Math.atan2(point.y, point.x)
        if ((alpha >= 0) && (alpha < 2 * Math.PI)) {
            ctx.fillStyle = "#000"
        } else {
            ctx.fillStyle = "#fff"
        }
    }
}

function setColourUsingTrinaryDecompositionMethod(iterations, maxIterations, ctx, point) {
    if (iterations == maxIterations) { // we are in the set
        ctx.fillStyle = "#000"
    } else {
        // color it depending on the angle of alpha
        const alpha = Math.atan2(point.y, point.x) * 180 / Math.PI
        if ((alpha > 0) && (alpha <= 90)) {
            ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length % 3]
        } else if ((alpha >= 90) && (alpha < 180)) {
            ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length % 2]
        } else {
            ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length]
        }
    }
}

function setColourUsingBinaryDecompositionMethod2(iterations, maxIterations, ctx, point) {
    if (iterations == maxIterations) { // we are in the set
        ctx.fillStyle = "#000"
    } else {
        const alpha = Math.atan(Math.abs(point.y))
        if ((alpha > 0) && (alpha <= 1.5)) {
            ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length % 2]
        } else {
            ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length]
        }
    }
}

function setColourUsingLevelSetMethod(iterations, maxIterations, ctx) {
    if (iterations == maxIterations) { // we are in the set
        ctx.fillStyle = "#000"
    } else {
        // colour it according to the number of iterations it took to get to infinity
        ctx.fillStyle = colourPalettes[paletteNumber][iterations % colourPalettes[paletteNumber].length]
    }
}

function mandelbrotDrawingFuncLsm(ctx, maxIterations, pointColouringFunc, plane) {
    const scalingFactor = getScalingFactors(plane)

    for (let iy = 0; iy < yResolution; iy++) {
        const cy = plane.y_min + iy * scalingFactor.y

        for (let ix = 0; ix < xResolution; ix++) {
            const cx = plane.x_min + ix * scalingFactor.x
            const currentPoint = {x: 0.0, y: 0.0}
            const iterations = computePoint(currentPoint, cx, cy, maxIterations)

            pointColouringFunc(iterations, maxIterations, ctx, currentPoint)
            ctx.fillRect(ix, iy, 1, 1)
        }
    }
}

function mandelbrotDrawingFuncDem(ctx, maxIterations, plane) {
    const scalingFactor = getScalingFactors(plane)
    const delta = document.getElementById('dem-threshold').value * scalingFactor.x

    for (let iy = 0; iy < yResolution; iy++) {
        const cy = plane.y_min + iy * scalingFactor.y

        for (let ix = 0; ix < xResolution; ix++) {
            const cx = plane.x_min + ix * scalingFactor.x
            const currentPoint = {x: 0.0, y: 0.0}
            const dist = computePointDem(currentPoint, cx, cy, maxIterations)
            if (dist < delta) {
                ctx.fillStyle = "#000000"
            } else {
                ctx.fillStyle = colourPalettes[paletteNumber][parseInt(dist * 100 % colourPalettes[paletteNumber].length)]
            }
            ctx.fillRect(ix, iy, 1, 1)
        }
    }
}

function computePointDem(point, cx, cy, maxIterations) {
    const huge = 100000.0
    let x = point.x, y = point.y, x2 = 0.0, y2 = 0.0, dist = 0.0, xorbit = [], yorbit = []
    xorbit[0] = 0.0
    yorbit[0] = 0.0

    let iterations = 0
    while ((iterations < maxIterations) && ((x2 + y2) < huge)) {
        let temp = x2 - y2 + cx
        y = 2 * x * y + cy
        x = temp
        x2 = x * x
        y2 = y * y
        iterations++
        xorbit[iterations] = x
        yorbit[iterations] = y
    }
    const overflow = document.getElementById('dem-overflow').value
    if ((x2 + y2) > huge) {
        let xder = 0.0, yder = 0.0
        let i = 0
        let flag = false
        while ((i < iterations) && !flag) {
            let temp = 2 * (xorbit[i] * xder - yorbit[i] * yder) + 1
            yder = 2 * (yorbit[i] * xder + xorbit[i] * yder)
            xder = temp
            flag = Math.max(Math.abs(xder), Math.abs(yder)) > overflow
            i++
        }
        if (!flag) {
            dist = (Math.log(x2 + y2) * Math.sqrt(x2 + y2)) / Math.sqrt(xder * xder + yder * yder)
        }
    }

    return dist
}

function getScalingFactors(plane) {
    // calculate the proportion in the difference between the points
    // on the mathematical plane and the actual canvas size (screen resolution)
    return {x: (plane.x_max - plane.x_min) / (xResolution - 1), y: (plane.y_max - plane.y_min) / (yResolution - 1)}
}

function juliaDrawingFuncLsm(ctx, maxIterations, pointColouringFunc, plane) {
    const scalingFactor = getScalingFactors(plane)

    const cx = Number(document.getElementById('cx').value)
    const cy = Number(document.getElementById('cy').value)

    for (let iy = 0; iy < yResolution; iy++) {
        const y = plane.y_min + iy * scalingFactor.y

        for (let ix = 0; ix < xResolution; ix++) {
            const currentPoint = {x: plane.x_min + ix * scalingFactor.x, y: y}
            const iterations = computePoint(currentPoint, cx, cy, maxIterations)

            pointColouringFunc(iterations, maxIterations, ctx, currentPoint)
            ctx.fillRect(ix, iy, 1, 1)
        }
    }
}

function computePoint(point, cx, cy, maxIterations) {
    const threshold = document.getElementById("lsm-threshold").value

    let x2 = point.x * point.x
    let y2 = point.y * point.y
    let iterations = 0
    while ((iterations < maxIterations) && ((x2 + y2) < threshold)) {
        let temp = x2 - y2 + cx
        point.y = 2 * point.x * point.y + cy
        point.x = temp
        x2 = point.x * point.x
        y2 = point.y * point.y
        iterations++
    }
    return iterations
}

function getMousePos(evt, canvas) {
    const rect = canvas.getBoundingClientRect()
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function setJuliaSetCoordinates(evt, canvas) {
    const pos = getMousePos(evt, canvas)
    const currentPlane = getCurrentPlane()
    const scalingFactors = getScalingFactors(currentPlane)
    const cx = currentPlane.x_min + pos.x * scalingFactors.x
    const cy = currentPlane.y_min + pos.y * scalingFactors.y
    document.getElementById('cx').value = cx
    document.getElementById('cy').value = cy
}

function zoomToNewWindow(ctx, canvas) {
    const {x, y, w, h} = getCurrentZoomWindow()
    const currentPlane = getCurrentPlane()
    const scalingFactors = getScalingFactors(currentPlane)
    const zoomedPlane = {
        x_min: currentPlane.x_min + x * scalingFactors.x,
        y_min: currentPlane.y_min + y * scalingFactors.y,
        x_max: currentPlane.x_min + (x + w) * scalingFactors.x,
        y_max: currentPlane.y_min + (y + h) * scalingFactors.y
    }

    setMsetWindowTo(zoomedPlane)
    ctx.reset()
    mandelbrot()
    mode = EXPLORE_MODE
}

function keyCommandProcessor(e) {
    const eventObject = window.event ? event : e //distinguish between IE's explicit event object (window.event) and Firefox's implicit.
    const keyCode = eventObject.charCode ? eventObject.charCode : eventObject.keyCode
    const Z_KEY_CODE = 90
    const ENTER_KEY_CODE = 13
    let canvas = document.getElementById("mset_canvas")
    let ctx = canvas.getContext("2d")
    switch (keyCode) {
        case Z_KEY_CODE:
            if (mode !== ZOOM_MODE) {
                mode = ZOOM_MODE
                drawZoomBox(ctx, getCurrentZoomWindow())
            } else {
                ctx.reset()
                mandelbrot()
                mode = EXPLORE_MODE
            }
            break
        case ENTER_KEY_CODE:
            if (mode === ZOOM_MODE) {
                zoomToNewWindow(ctx, canvas)
            }
            break
        default:
            console.log("key code is " + keyCode)
    }
}

function drawJuliaSetForCurrentC(event, canvas) {
    setJuliaSetCoordinates(event, canvas)
    julia()
}

function handleMsetMouseMove(event, canvas) {
    function moveZoomBox() {
        const {x, y, w, h} = getCurrentZoomWindow()
        let ctx = canvas.getContext("2d")
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const x_pos = event.clientX - canvas.offsetLeft
        const y_pos = event.clientY - canvas.offsetTop
        drawZoomBox(ctx, {x: x_pos, y: y_pos, w: w, h: h})
    }

    switch (mode) {
        case ZOOM_MODE:
            moveZoomBox()
            break
        default:
            if (document.getElementById('autodraw').value === 'on') {
                drawJuliaSetForCurrentC(event, canvas)
            }
    }
}

function handleMsetMouseClick(event, canvas) {
    function zoomIn(ctx) {
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const {x, y, w, h} = getCurrentZoomWindow()
        setZoomWindowTo(x, y, Math.round(w * 0.9), Math.round(h * 0.9))
        drawZoomBox(ctx, getCurrentZoomWindow())
    }

    function zoomOut(ctx) {
        if (canvasBeforeZoomBox != null) {
            ctx.putImageData(canvasBeforeZoomBox.imageData, canvasBeforeZoomBox.x, canvasBeforeZoomBox.y)
        }
        const {x, y, w, h} = getCurrentZoomWindow()
        setZoomWindowTo(x, y, Math.round(w * 1.5), Math.round(h * 1.5))
        drawZoomBox(ctx, getCurrentZoomWindow())
    }

    switch (mode) {
        case ZOOM_MODE:
            let ctx = canvas.getContext("2d")
            switch (event.button) {
                case 0:
                    zoomIn(ctx)
                    break
                case 2:
                    zoomOut(ctx)
                    break
            }
            break
        default:
            drawJuliaSetForCurrentC(event, canvas)
    }
}

function drawZoomBox(ctx, dimensions) {
    canvasBeforeZoomBox = new CanvasRectangleSnapshot(
        ctx.getImageData(dimensions.x, dimensions.y, dimensions.w, dimensions.h),
        dimensions.x, dimensions.y, dimensions.w, dimensions.h)

    ctx.beginPath()
    ctx.fillStyle = "#FFFFFF"
    ctx.globalAlpha = 0.5
    ctx.fillRect(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
    setZoomWindowTo(dimensions.x, dimensions.y, dimensions.w, dimensions.h)
}