function changeVariantOfTransformation() {
    let chooseVariant = document.getElementById('myIterations');
    let variantForOne = document.getElementById('myIterations_forOne');
    let variantForTwo = document.getElementById('myIterations_forTwo');
    let variantForThree = document.getElementById('myIterations_forThree');

    variantForOne.style.display = 'none';
    variantForTwo.style.display = 'none';
    variantForThree.style.display = 'none';

    if(chooseVariant.value === '1') {
        variantForOne.style.display = 'inline-block';
    } else if(chooseVariant.value === '2') {
        variantForTwo.style.display = 'inline-block';
    } else {
        variantForThree.style.display = 'inline-block';
    }
}

function findSuareCoordinate() {
    let A_x = Number.parseFloat(document.getElementById('A_x'));
    let A_y = Number.parseFloat(document.getElementById('A_y'));
    let C_x = Number.parseFloat(document.getElementById('C_x'));
    let C_y = Number.parseFloat(document.getElementById('C_y'));

    let midPoint_x = (A_x + C_x) / 2;
    let midPoint_y = (A_y + C_y) / 2;

    let D_x = midPoint_x + (C_y - midPoint_y);
    let D_y = midPoint_y - (C_x - midPoint_x);

    let B_x = midPoint_x - (C_y - midPoint_y);
    let B_y = midPoint_y + (C_x - midPoint_x);
}