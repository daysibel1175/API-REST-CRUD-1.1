const prompt = prompt()
const buttonDinamic = document.getElementById("menu") 

buttonDinamic.addEventListener('click', () => {
    buttonDinamic.classList.toggle('close')
})