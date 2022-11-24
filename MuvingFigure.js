// const canvas = document.getElementById('tutorial');
// const ctx = canvas.getContext('2d');
const canvas = document.getElementById("tutorial");
const ctx = canvas.getContext("2d");

let myScale = 25;
const speed = 1;

let chooseVariant = document.getElementById('myIterations');
let variantForOne = document.getElementById('myIterations_forOne');
let variantForTwo = document.getElementById('myIterations_forTwo');
let variantForThree = document.getElementById('myIterations_forThree');


function changeVariantOfTransformation() {
    variantForOne.style.display = 'none';
    variantForTwo.style.display = 'none';
    variantForThree.style.display = 'none';

    if(chooseVariant.value === '1') {
        variantForOne.style.display = 'inline-block';
        variantForOne.style.visibility = 'visible';
    } else if(chooseVariant.value === '2') {
        variantForTwo.style.display = 'inline-block';
    } else if(chooseVariant.value === "") {
        variantForOne.style.display = 'inline-block';
        variantForOne.style.visibility = 'hidden';
    } else {
        variantForThree.style.display = 'inline-block';
    }
}

class Square {
    constructor(A, B, C, D, midPoint, lenth) {
        this.A = A;
        this.B = B;
        this.C = C;
        this.D = D;

        this.midPoint = midPoint;
        
        this.lenth = lenth;

        this.dx = 1 * speed;
        this.dy = 1 * speed;
    }

    drawSquare() {
        ctx.beginPath();
        ctx.moveTo(this.A.x, this.A.y);
        ctx.lineTo(this.B.x, this.B.y);
        ctx.lineTo(this.C.x, this.C.y);
        ctx.lineTo(this.D.x, this.D.y);
        ctx.lineTo(this.A.x, this.A.y);
        ctx.stroke();
    }

    //Задається вектор V(m, n)
    moving(_square, m, n, myScale) {
        let A_array = [[_square.A.x / myScale, _square.A.y / myScale * (-1), 1]];
        let C_array = [[_square.C.x / myScale, _square.C.y / myScale * (-1), 1]];

        let identityMatrix = [[1, 0, 0], [0, 1, 0], [m, n, 1]];

        var newA = MultiplyMatrix(A_array, identityMatrix);
        var newA = new Point(newA[0][0] * myScale, newA[0][1] * myScale * (-1));

        var newC = MultiplyMatrix(C_array, identityMatrix);
        var newC = new Point(newC[0][0] * myScale, newC[0][1] * myScale * (-1));
        
        let newSquare = determiningTheCoordinatesOfTheSquare(newA, newC, myScale)

        return newSquare;
    }

    //
    scaling(_square, a, d, myScale) {
        var A_array = [[_square.A.x / myScale, _square.A.y / myScale * (-1), 1]];
        var C_array = [[_square.C.x / myScale, _square.C.y / myScale * (-1), 1]];

        let Matrix = [[a, 0, 0], [0, d, 0], [0, 0, 1]];

        var newA = MultiplyMatrix(A_array, Matrix);
        var newA = new Point(newA[0][0] * myScale, newA[0][1] * myScale * (-1));

        var newC = MultiplyMatrix(C_array, Matrix);
        var newC = new Point(newC[0][0] * myScale, newC[0][1] * myScale * (-1));
        
        let newSquare = determiningTheCoordinatesOfTheSquare(newA, newC, myScale)

        console.log(_square);
        console.log(newSquare);
        // newSquare = newSquare.moving(newSquare, (-1) * _square.midPoint.x / myScale, _square.midPoint.y / myScale, myScale)

        return newSquare;
    }

    //
    rotation(_square, angle, myScale) {
        // let tmpMidPoint = _square.midPoint;
        // _square = _square.moving(_square, (-1) * _square.midPoint.x / myScale, _square.midPoint.y / myScale, myScale)

        var A_array = [[_square.A.x / myScale, _square.A.y / myScale * (-1), 1]];
        var C_array = [[_square.C.x / myScale, _square.C.y / myScale * (-1), 1]];

        let Matrix = [
            [Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180), 0], 
            [-Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180), 0], 
            [0, 0, 1]];

        var newA = MultiplyMatrix(A_array, Matrix);
        var newA = new Point(newA[0][0] * myScale, newA[0][1] * myScale * (-1));

        var newC = MultiplyMatrix(C_array, Matrix);
        var newC = new Point(newC[0][0] * myScale, newC[0][1] * myScale * (-1));
        
        let newSquare = determiningTheCoordinatesOfTheSquare(newA, newC, myScale)

        // newSquare = newSquare.moving(newSquare, tmpMidPoint.x / myScale, tmpMidPoint.y / myScale * (-1), myScale)

        // newSquare.drawSquare();

        return newSquare;
    }

    // update() {
    //     ctx.clearRect(-canvas.width, -canvas.height, canvas.width, canvas.height);
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.clearRect(-canvas.width, 0, canvas.width, canvas.height);
    //     ctx.clearRect(0, -canvas.height, canvas.width, canvas.height);
    //     // ctx.clearRect(0, 0, canvas.width, canvas.height)





    //     // this.A.x += this.dx;
    //     // this.A.y += this.dy;

    //     // this.B.x += this.dx;
    //     // this.B.y += this.dy;

    //     // this.C.x += this.dx;
    //     // this.C.y += this.dy;

    //     // this.D.x += this.dx;
    //     // this.D.y += this.dy;


    // }
};
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
};

function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}

//Не забувати про мінус до Y
ctx.save();
drawCoordinatesScale(myScale);
let square = null;
function draw() {
    if (canvas.getContext) {
        if(chooseVariant.value === '') {
            ctx.restore();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            let A_x = Number.parseInt(document.getElementById('A_x').value), 
                A_y = (-1) * Number.parseInt(document.getElementById('A_y').value), 
                C_x = Number.parseInt(document.getElementById('C_x').value), 
                C_y = (-1) * Number.parseInt(document.getElementById('C_y').value);
            let A = new Point(A_x * myScale, A_y * myScale);
            let C = new Point(C_x * myScale, C_y * myScale);

            square = determiningTheCoordinatesOfTheSquare(A, C, myScale)

            drawCoordinatesScale(myScale);
            square.drawSquare();
        } else if(chooseVariant.value === '1') {
            if(variantForOne.value === '1') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                drawCoordinatesScale(myScale);

                square = createIfNull(square);

                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '2') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                drawCoordinatesScale(myScale);

                square = createIfNull(square);

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                square.drawSquare();
            } else {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let angle = document.getElementById('rotation-angle').value;

                drawCoordinatesScale(myScale);

                square = createIfNull(square);

                square = square.rotation(square, Number.parseInt(angle), myScale);
                square.drawSquare();
            }
        } else if(chooseVariant.value === '2') {
            if(variantForOne.value === '1,2') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                drawCoordinatesScale(myScale);
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '1,3') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                drawCoordinatesScale(myScale);
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                
                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '2,1') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
    
                drawCoordinatesScale(myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                
                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;

                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '2,3') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                drawCoordinatesScale(myScale);
                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);

                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '3,1') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let angle = document.getElementById('rotation-angle').value;

                drawCoordinatesScale(myScale);
                square = square.rotation(square, Number.parseInt(angle), myScale);

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);

                square.drawSquare();
            } else {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let angle = document.getElementById('rotation-angle').value;

                drawCoordinatesScale(myScale);
                square = square.rotation(square, Number.parseInt(angle), myScale);

                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                square.drawSquare();
            }
        } else {
            if(variantForOne.value === '1,2,3') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                drawCoordinatesScale(myScale);
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                
                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);                
                square.drawSquare();
            } else if(variantForOne.value === '1,3,2') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                drawCoordinatesScale(myScale);
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                
                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '2,1,3') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
    
                drawCoordinatesScale(myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                
                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;

                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '2,3,1') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                drawCoordinatesScale(myScale);
                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);

                let angle = document.getElementById('rotation-angle').value;

                square = square.rotation(square, Number.parseInt(angle), myScale);
                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                square.drawSquare();
            } else if(variantForOne.value === '3,1,2') {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let angle = document.getElementById('rotation-angle').value;

                drawCoordinatesScale(myScale);
                square = square.rotation(square, Number.parseInt(angle), myScale);

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                
                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);
                square.drawSquare();
            } else {
                ctx.restore();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();

                let angle = document.getElementById('rotation-angle').value;

                drawCoordinatesScale(myScale);
                square = square.rotation(square, Number.parseInt(angle), myScale);

                let a = document.getElementById('scale_a').value;
                let d = document.getElementById('scale_b').value;

                square = square.scaling(square, Number.parseFloat(a), Number.parseFloat(d), myScale);

                let m = document.getElementById('cx').value;
                let n = document.getElementById('cy').value;
    
                square = square.moving(square, Number.parseFloat(m), Number.parseFloat(n), myScale);
                square.drawSquare();
            }
        }
    }
}

//Функція визначення координат квадрата
function determiningTheCoordinatesOfTheSquare(A, C, scale) {
    let midPoint = new Point((A.x + C.x) / 2, (A.y + C.y) / 2);

    let D_x = midPoint.x + (C.y - midPoint.y);
    let D_y = midPoint.y - (C.x - midPoint.x);

    let B_x = midPoint.x - (C.y - midPoint.y);
    let B_y = midPoint.y + (C.x - midPoint.x);

    let B = new Point(B_x, B_y);
    let D = new Point(D_x, D_y);

    let lenth = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));

    let square = new Square(A, B, C, D, midPoint, lenth);

    return square;
}

//draw coordinates scale
function drawCoordinatesScale(grid_size) {
    var canvas_width = canvas.width;
    var canvas_height = canvas.height;
    var x_axis_distance_grid_lines = canvas_height/ (grid_size * 2);
    var y_axis_distance_grid_lines = canvas_width/ (grid_size * 2);
    var x_axis_starting_point = { number: 1, suffix: '\u03a0' };
    var y_axis_starting_point = { number: 1, suffix: '' };

    var num_lines_x = Math.floor(canvas_height/grid_size);
    var num_lines_y = Math.floor(canvas_width/grid_size);

    // Draw grid lines along X-axis
    for(var i=0; i<=num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = myScale / myScale;
        
        // If line represents X-axis draw in different color
        if(i == x_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == num_lines_x) {
            ctx.moveTo(0, grid_size*i);
            ctx.lineTo(canvas_width, grid_size*i);
        }
        else {
            ctx.moveTo(0, grid_size*i+0.5);
            ctx.lineTo(canvas_width, grid_size*i+0.5);
        }
        ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for(i=0; i<=num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        
        // If line represents X-axis draw in different color
        if(i == y_axis_distance_grid_lines) 
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";
        
        if(i == num_lines_y) {
            ctx.moveTo(grid_size*i, 0);
            ctx.lineTo(grid_size*i, canvas_height);
        }
        else {
            ctx.moveTo(grid_size*i+0.5, 0);
            ctx.lineTo(grid_size*i+0.5, canvas_height);
        }
        ctx.stroke();
    }

    // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
    ctx.translate(y_axis_distance_grid_lines*grid_size, x_axis_distance_grid_lines*grid_size);

    // Ticks marks along the positive X-axis
    for(i=1; i<(num_lines_y - y_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = myScale / myScale;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(grid_size*i+0.5, -3);
        ctx.lineTo(grid_size*i+0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = `${myScale / 2}px Arial Narrow`;
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number*i, grid_size*i-2, 15);
    }

    // Ticks marks along the negative X-axis
    for(i=1; i<y_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = myScale / myScale;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-grid_size*i+0.5, -3);
        ctx.lineTo(-grid_size*i+0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = `${myScale / 2}px Arial`;
        ctx.textAlign = 'end';
        ctx.fillText(-x_axis_starting_point.number*i , -grid_size*i+3, 15);
    }

    // Ticks marks along the positive Y-axis
    // Positive Y-axis of graph is negative Y-axis of the canvas
    for(i=1; i<(num_lines_x - x_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = myScale / myScale;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, grid_size*i+0.5);
        ctx.lineTo(3, grid_size*i+0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = `${myScale / 2}px Arial`;
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, grid_size*i+3);
    }

    // Ticks marks along the negative Y-axis
    // Negative Y-axis of graph is positive Y-axis of the canvas
    for(i=1; i<x_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = myScale / myScale;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, -grid_size*i+0.5);
        ctx.lineTo(3, -grid_size*i+0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = `${myScale / 2}px Arial`;
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number*i + y_axis_starting_point.suffix, 8, -grid_size*i+3);
    }
}

//Створює квадрат, якщо його не існує
function createIfNull(tmpSquare) {
    if(tmpSquare == null) {
        let A_x = Number.parseInt(document.getElementById('A_x').value), 
            A_y = (-1) * Number.parseInt(document.getElementById('A_y').value), 
            C_x = Number.parseInt(document.getElementById('C_x').value), 
            C_y = (-1) * Number.parseInt(document.getElementById('C_y').value);
        let A = new Point(A_x * myScale, A_y * myScale);
        let C = new Point(C_x * myScale, C_y * myScale);

        tmpSquare = determiningTheCoordinatesOfTheSquare(A, C, myScale);
    }
    return tmpSquare;
}

canvas.onwheel = function (e) {
    setTimeout(function(){
        if (e.deltaY > 0 && ((myScale - 0.5) >= 15)) {
            console.log("Зменшити")
            myScale = myScale - 0.5;
        } else if (e.deltaY < 0 && myScale < 25) {
            myScale = myScale + 2;
        }
    }, 500);
    ctx.restore();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // console.log(square)
    if(square != null) {
        console.log("Here!")
        square.drawSquare()
    }
    drawCoordinatesScale(myScale);
}

function sign1() {
    let text = document.getElementById('sign_text');
    // document.getElementById('sign_text').style.visibility = "visible"
    if(text.style.visibility === 'hidden') {
        text.style.visibility ='visible';
    } else {
        text.style.visibility ='hidden';
    }
}

function sign2() {
    let text = document.getElementById('sign_text2');
    // document.getElementById('sign_text').style.visibility = "visible"
    if(text.style.visibility === 'hidden') {
        text.style.visibility ='visible';
    } else {
        text.style.visibility ='hidden';
    }
}
function sign3() {
    let text = document.getElementById('sign_text3');
    // document.getElementById('sign_text').style.visibility = "visible"
    if(text.style.visibility === 'hidden') {
        text.style.visibility ='visible';
    } else {
        text.style.visibility ='hidden';
    }
}

const download_img = () => {
    const canvas = document.getElementById("tutorial");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

function showDegree() {
    let rangeDegree = document.getElementById('rotation-angle').value;

    let degree = document.getElementById('degree');
    degree.value = rangeDegree;
}