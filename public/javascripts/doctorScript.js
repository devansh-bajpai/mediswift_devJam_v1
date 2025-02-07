const searchButton = document.getElementById('searchButton');
const inputField = document.getElementById('searchInput');
const clearFilterButton = document.getElementById('clearFilterButton');
const noResultText = document.getElementById('noResultText');

searchButton.addEventListener('click', () => {
    noResultText.style.display = 'none';
    let value = inputField.value.toLowerCase().trim();
    console.log(value);
    inputField.value = '';

    
    if (value){
        let isEmpty = true;
        
        clearFilterButton.style.display = 'block';
    
        let cards = document.querySelectorAll('.card');
        // console.log(cards);
        cards.forEach((card) => {
            const cityElement = card.querySelector('#doctorCity');
            if (cityElement.innerText.toLowerCase() != value){
                card.style.display = 'none';
            }
            else{
                card.style.display = 'flex';
                isEmpty = false;
            }
    
        })

        if (isEmpty){
            noResultText.style.display = 'block';
        }
        
    }


})

clearFilterButton.addEventListener('click', () => {
    let cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.style.display = 'flex';
    })
    noResultText.style.display = 'none';
    clearFilterButton.style.display = 'none';
})