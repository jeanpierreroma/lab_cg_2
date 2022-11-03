
// const image_input = document.querySelector("#image-input");
// image_input.addEventListener("change", function() {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => {
//     const uploaded_image = reader.result;
//     document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
//   });
//   reader.readAsDataURL(this.files[0]);
// });

const download_img = () => {
    const canvas = document.getElementById("panel");
    const a = document.getElementById("a");
    a.href = canvas.toDataURL("image/png");
    a.click();
};

var canvas;
var ctx;

var images = [ // Массив используемых изображений
    'bilders/pic1.jpg',
    'bilders/pic2.jpg',
    'bilders/pic3.jpg',
    'bilders/pic4.jpg'
];
var iActiveImage = 0;

function load(){

    // Вывводим текущее изображение
    var image = new Image();
    //image.crossOrigin = "Anonymous";
    //image.setAttribute('crossOrigin', '');
    //img.crossOrigin = 'anonymous';
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }
    image.src = images[iActiveImage];
    //img.crossOrigin = 'anonymous';

    // Создаем объект canvas
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');
}

$('#panel').mousemove(function(e) { // Обработчик события mousemove (движение мыши)
    var canvasOffset = $(canvas).offset();
    var canvasX = Math.floor(e.pageX - canvasOffset.left);
    var canvasY = Math.floor(e.pageY - canvasOffset.top);
    var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    var pixel = imageData.data;
    var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
    $('#preview').css('backgroundColor', pixelColor);
});

    // panel.onmousemove =function(e) { // Обработчик события mousemove (движение мыши)
    //     var canvasOffset = document.getElementById("panel").offset();
    //     console.log("in func");
    //     var canvasX = Math.floor(e.pageX - canvasOffset.left);
    //     var canvasY = Math.floor(e.pageY - canvasOffset.top);

    //     var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    //     var pixel = imageData.data;

    //     var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
    //     var prew=document.getElementById("preview");
    //     prew.css('backgroundColor', pixelColor);
    //     console.log("in func");
    // };

    // $('#panel').click(function(e) { // Обработчик события нажатия на кнопку мыши
    //     var canvasOffset = $(canvas).offset();
    //     var canvasX = Math.floor(e.pageX - canvasOffset.left);
    //     var canvasY = Math.floor(e.pageY - canvasOffset.top);

    //     var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    //     var pixel = imageData.data;

    //     $('#rVal').val(pixel[0]);
    //     $('#gVal').val(pixel[1]);
    //     $('#bVal').val(pixel[2]);

    //     $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);
    //     $('#rgbaVal').val(pixel[0]+','+pixel[1]+','+pixel[2]+','+pixel[3]);
    //     var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
    //     $('#hexVal').val( '#' + dColor.toString(16) );
    // }); 


    // $('#panel').mousemove(function(e) { // Обработчик события mousemove (движение мыши)
    //     var canvasOffset = $(canvas).offset();
    //     var canvasX = Math.floor(e.pageX - canvasOffset.left);
    //     var canvasY = Math.floor(e.pageY - canvasOffset.top);
    //     var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
    //     var pixel = imageData.data;
    //     var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
    //     $('#preview').css('backgroundColor', pixelColor);
    // });

