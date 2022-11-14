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