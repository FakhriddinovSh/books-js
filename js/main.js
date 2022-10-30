const elSearchForm = document.querySelector(".search-form");
const elSearchInput = document.querySelector(".search-input");
const elSelectForm  = document.querySelector(".select-form");
const elSelect = document.querySelector(".sort-select");
const elLanguageSelect = document.querySelector(".language-select");
const elBtn = document.querySelector(".book-btn");
const elList = document.querySelector(".list")
const modalList = document.querySelector(".modal-list");
const elTemplate = document.querySelector(".template").content;
const newFragment = new DocumentFragment();
const languageArr = [];

// const localStorage = JSON.parse(window.localStorage.getItem("list"));
const bookmarkArr = [];

// Render books
function renderBooks(books, regExp = ""){
    elList.innerHTML = "";
    
    books.forEach(item => {
        const clonedTemplate = elTemplate.cloneNode(true);
        clonedTemplate.querySelector(".book-image").src = item.imageLink;
        if(regExp.source !== "(?:)" && regExp){
            clonedTemplate.querySelector(".book-title").innerHTML = item.title.replace(regExp, `<mark class="p-0 bg-warning">${regExp.source}</mark>`);
        }
        else{
            clonedTemplate.querySelector(".book-title").textContent = item.title;
        }
        clonedTemplate.querySelector(".book-year").textContent = item.year;
        clonedTemplate.querySelector(".book-pages").textContent = item.pages;
        clonedTemplate.querySelector(".book-author").textContent = item.author;
        clonedTemplate.querySelector(".book-country").textContent = item.country;
        clonedTemplate.querySelector(".book-language").textContent = item.language;
        clonedTemplate.querySelector(".book-wikipedia").href = item.link;
        let li = clonedTemplate.querySelector(".list-item");
        let bookmarkBtn = clonedTemplate.querySelector(".bookmark")
        bookmarkBtn.addEventListener("click", function(evt){
            evt.preventDefault();
            bookmarkBtn.classList.toggle("text-danger")
        })
        bookmarkBtn.dataset.id = item.year;
        newFragment.appendChild(clonedTemplate)    
    });
    elList.appendChild(newFragment)
}
renderBooks(books)

// Search Books
function searchBooks(){
    elSearchForm.addEventListener("keyup", function(evt){
        evt.preventDefault();
        let elSearchInputValue = elSearchInput.value.trim();
        const regExp = new RegExp(elSearchInputValue, "gi")
        
        const findBook = books.filter(item =>{
            return item.title.match(regExp)
        })
        
        renderBooks(findBook, regExp)
        // elSearchInput.value = "";
    })
}
searchBooks()

// Sort 
elSelect.addEventListener("click", function(evt){
    evt.preventDefault();
    console.log(evt.target.value);
    if(evt.target.value == "a-z"){
        const titleAZ = books.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        renderBooks(titleAZ)
    }
    else if(evt.target.value == "z-a"){
        const titleZA = books.sort((a, b) => b.title.charCodeAt(0) - a.title.charCodeAt(0))
        renderBooks(titleZA)
    }
    else if(evt.target.value == "new"){
        const newest = books.sort((a,b) => b.year - a.year)
        renderBooks(newest)
    }
    else if(evt.target.value == "old"){
        const oldest = books.sort((a,b) => a.year - b.year)
        renderBooks(oldest)
    }
})

// Language
function language(array, select){
    for (const item of array) {
        if(!languageArr.includes(item.language)){
            languageArr.push(item.language)
        }
    }
    languageArr.sort()
    
    languageArr.forEach(item =>{
        let option = document.createElement("option")
        option.value = item;
        option.textContent = item;
        select.appendChild(option)
    })
    
    elBtn.addEventListener("click", (evt) =>{
        evt.preventDefault();
        const selectValue = select.value;
        const findLang = books.filter(item =>{
            return item.language.includes(selectValue)
        })
        renderBooks(findLang)
    })
}
language(books, elLanguageSelect)


// Bookmark
function btnBookmark(id, list, array){
    const bookmarkFinded = books.find(item =>{
        return item.year == id;
    })
    
    if(!bookmarkArr.includes(bookmarkFinded)){
        bookmarkArr.push(bookmarkFinded)
    }
    console.log(bookmarkArr);
    
    list.innerHTML = "";
    array.forEach(item => {
        const liItem = document.createElement("li")
        liItem.classList.add("d-flex", "align-items-center", "justify-content-between", "mb-4", "modal-item")
        const modalTitle = document.createElement("h4")
        modalTitle.textContent = item.title;
        const modalBtn  = document.createElement("button")
        modalBtn.classList.add("btn", "btn-danger", "modal-btn")
        modalBtn.textContent = "Delete";
        modalBtn.dataset.id = item.year;
        
        liItem.appendChild(modalTitle)
        liItem.appendChild(modalBtn)
        list.appendChild(liItem)
        
    })
}

elList.addEventListener("click", (evt)=>{
    evt.preventDefault();
    if(evt.target.matches(".bookmark")){
        btnBookmark(evt.target.dataset.id, modalList, bookmarkArr)
    }
})

// Delete Bookmark
modalList.addEventListener("click", (evt)=>{
    if(evt.target.matches(".modal-btn")){
        console.log("toptim");
        let btnId = Number(evt.target.dataset.id);
        console.log(btnId);
        let itemFind = bookmarkArr.findIndex(obj => obj.year == btnId);
        bookmarkArr.splice(itemFind, 1)
        btnBookmark(undefined, modalList, bookmarkArr)
        // window.localStorage.setItem("list", JSON.stringify(bookmarkArr))
    }
})
