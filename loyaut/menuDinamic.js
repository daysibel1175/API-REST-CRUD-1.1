console.log("hello");


const menu = document.getElementById("myDropdown")
console.log(menu)

const btn = document.getElementById('menu');

btn.onclick = () => {
  menu.classList.toggle('show')
}

