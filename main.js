const booksCompleted = [];
const booksUnCompleted = [];
const body = document.getElementById("myBody");
const bookForm = document.getElementById("bookForm");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const bookFormSubmit = document.getElementById("bookFormSubmit");
const buttonSpan = document.getElementById("buttonSpan");
const titleInput = document.querySelector('[data-testid="bookFormTitleInput"]');
const authorInput = document.querySelector(
  '[data-testid="bookFormAuthorInput"]'
);
const yearInput = document.querySelector('[data-testid="bookFormYearInput"]');
const searchBook = document.getElementById("searchBook");
const render = "render";

document.addEventListener("DOMContentLoaded", function () {
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    addValueBooks();
    addBooksData();
    showUnCompleted();
    showCompleted();
    
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    
    checkInput();
  });
  
  searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchBookTitle = document
    .getElementById("searchBookTitle")
      .value.trim();
    const resultTitle = document.getElementById("resultTitle");
    const resultAuthor = document.getElementById("resultAuthor");
    const resultYear = document.getElementById("resultYear");
    const resultIsCompleted = document.getElementById("resultIsCompleted");
    const searchInCompleted = booksCompleted.find(
      (data) => data.title === searchBookTitle
    );

    const searchInUnCompleted = booksUnCompleted.find(
      (data) => data.title === searchBookTitle
    );

    if (Array.isArray(booksCompleted) || Array.isArray(booksUnCompleted)) {
      if (searchInCompleted) {
        resultTitle.innerText = `${searchInCompleted.title}`;
        resultAuthor.innerText = `Penulis: ${searchInCompleted.author}`;
        resultYear.innerText = `Tahun: ${searchInCompleted.year}`;
        resultIsCompleted.innerText = "Status: sudah selesai";
      } else if (searchInUnCompleted) {
        resultTitle.innerText = `${searchInUnCompleted.title}`;
        resultAuthor.innerText = `Penulis: ${searchInUnCompleted.author}`;
        resultYear.innerText = `Tahun: ${searchInUnCompleted.year}`;
        resultIsCompleted.innerText = "Status: belum selesai";
      } else {
        if (searchBookTitle === "") {
          resultTitle.innerText = "";
          resultAuthor.innerText = "";
          resultYear.innerText = "";
          resultIsCompleted.innerText = "";
        } else {
          resultTitle.innerText = `Buku \"${searchBookTitle}\" tidak ada dalam rak manapun`;
          resultAuthor.innerText = "";
          resultYear.innerText = "";
          resultIsCompleted.innerText = "";
        }
      }
    }
  });
  
  if (typeof localStorage === "undefined") {
    body.innerHTML =
      '<h1 style="color: red">Browser Tidak Support Local Storage</h1>';
    } else {
      loadStorageData();
    }
    
    showUnCompleted();
    showCompleted();
});

function checkInput() {
  if (
    titleInput.value.trim() === "" ||
    authorInput.value.trim() === "" ||
    yearInput.value.trim() === ""
  ) {
    bookFormSubmit.disabled = true;
  } else {
    bookFormSubmit.disabled = false;
  }
}

titleInput.addEventListener("input", checkInput);
authorInput.addEventListener("input", checkInput);
yearInput.addEventListener("input", checkInput);

function addValueBooks() {
  const id = Number(new Date());
  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);

  const booksObject = {
    id,
    title,
    author,
    year,
    isComplete: false,
  };

  if (buttonSpan.innerText === "selesai dibaca") {
    booksObject.isComplete = true;
  }

  const sameShelfCompleted = booksCompleted.some(
    (data) => data.title === booksObject.title
  );
  const sameShelfUnCompleted = booksUnCompleted.some(
    (data) => data.title === booksObject.title
  );
  const differentShelf = booksObject.isComplete
    ? booksUnCompleted.some((data) => data.title === booksObject.title)
    : booksCompleted.some((data) => data.title === booksObject.title);

  if (booksObject.isComplete) {
    if (sameShelfCompleted) {
      alert("Terjadi duplikasi buku di rak Completed, mohon untuk diganti!");
    } else if (differentShelf) {
      alert(
        "Data sudah ada di rak Uncompleted, mohon untuk diubah atau diganti!"
      );
    } else {
      booksCompleted.push(booksObject);
      addBooksData();
    }
  } else {
    if (sameShelfUnCompleted) {
      alert("Terjadi duplikasi buku di rak Uncompleted, mohon untuk diganti!");
    } else if (differentShelf) {
      alert(
        "Data sudah ada di rak Completed, mohon untuk diubah atau diganti!"
      );
    } else {
      booksUnCompleted.push(booksObject);
      addBooksData();
    }
  }
}

function addBooksData() {
  const completedParsed = JSON.stringify(booksCompleted);
  const unCompletedParsed = JSON.stringify(booksUnCompleted);

  if (buttonSpan.innerText === "selesai dibaca") {
    localStorage.setItem("Completed", completedParsed);
  } else {
    localStorage.setItem("Uncompleted", unCompletedParsed);
  }
}

function loadStorageData() {
  let completedData = JSON.parse(localStorage.getItem("Completed"));
  let unCompletedData = JSON.parse(localStorage.getItem("Uncompleted"));

  if (completedData !== null) {
    for (const data of completedData) {
      booksCompleted.push(data);
    }
  }

  if (unCompletedData !== null) {
    for (const Data of unCompletedData) {
      booksUnCompleted.push(Data);
    }
  }

  document.dispatchEvent(new Event(render));
}

bookFormIsComplete.addEventListener("click", function () {
  if (bookFormIsComplete.checked == true) {
    buttonSpan.innerText = "selesai dibaca";
  } else {
    buttonSpan.innerText = "Belum selesai dibaca";
  }
});

document.addEventListener(render, function () {});

function showUnCompleted() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  incompleteBookList.innerHTML = "";

  for (const data of booksUnCompleted) {
    const container = document.createElement("div");
    container.setAttribute("data-bookid", `${data.id}`);
    container.setAttribute("data-testid", "bookItem");
    container.classList.add('listItem');

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = `${data.title}`;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = `Penulis: ${data.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = `Tahun: ${data.year}`;

    const buttonContainer = document.createElement("div");

    const isCompletedButton = document.createElement("button");
    isCompletedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    isCompletedButton.classList.add("button1");
    isCompletedButton.innerText = "Selesai Dibaca";
    isCompletedButton.addEventListener('click', function () {
      updateStatusToCompleted(data.id);
    })

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.classList.add("button2");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener('click', function () {
      deleteDataBookUnCompleted(data.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add("button3");
    editButton.innerText = "Edit Buku";

    buttonContainer.append(isCompletedButton, deleteButton, editButton);

    container.append(title, author, year, buttonContainer);

    incompleteBookList.appendChild(container)
  }
}

function showCompleted() {
  const completeBookList = document.getElementById("completeBookList");
  completeBookList.innerHTML = "";

  for (const data of booksCompleted) {
    const container = document.createElement("div");
    container.setAttribute("data-bookid", `${data.id}`);
    container.setAttribute("data-testid", "bookItem");
    container.classList.add('listItem');

    const title = document.createElement("h3");
    title.setAttribute("data-testid", "bookItemTitle");
    title.innerText = `Judul: ${data.title}`;

    const author = document.createElement("p");
    author.setAttribute("data-testid", "bookItemAuthor");
    author.innerText = `Penulis: ${data.author}`;

    const year = document.createElement("p");
    year.setAttribute("data-testid", "bookItemYear");
    year.innerText = `Tahun: ${data.year}`;

    const buttonContainer = document.createElement("div");

    const isUnCompletedButton = document.createElement("button");
    isUnCompletedButton.setAttribute("data-testid", "bookItemIsUnCompleteButton");
    isUnCompletedButton.classList.add("button1");
    isUnCompletedButton.innerText = "Belum Selesai";
    isUnCompletedButton.addEventListener('click', function () {
      updateStatusToUnCompleted(data.id);
    })

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.classList.add("button2");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener('click', function () {
      deleteDataBookCompleted(data.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add("button3");
    editButton.innerText = "Edit Buku";

    buttonContainer.append(isUnCompletedButton, deleteButton, editButton);

    container.append(title, author, year, buttonContainer);

    completeBookList.appendChild(container);
    
  }
}

function findBookIdIsCompleted(bookId) {
  for (const index in booksCompleted) {
    if (booksCompleted[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function deleteDataBookCompleted(bookId) {
  const deletedBook = findBookIdIsCompleted(bookId);

  if (deletedBook === -1) {
    return;
  } else {
    booksCompleted.splice(deletedBook, 1);
    showCompleted();
    updateData(true);
  }
}

function updateStatusToUnCompleted(bookId) {
  const updatedBook = findBookIdIsCompleted(bookId);

  if (updatedBook === -1) {
    return;
  } else {
    booksCompleted[updatedBook].isComplete = false;
    booksUnCompleted.push(booksCompleted[updatedBook]);
    deleteDataBookCompleted(bookId);
    showCompleted();
    showUnCompleted();
    updateData(false);
  }
}

function findBookIdIsUnCompleted(bookId) {
  for (const index in booksUnCompleted) {
    if (booksUnCompleted[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function deleteDataBookUnCompleted(bookId) {
  const deletedBook = findBookIdIsUnCompleted(bookId);

  if (deletedBook === -1) {
    return;
  } else {
    booksUnCompleted.splice(deletedBook, 1);
    showUnCompleted();
    updateData(false);
  }
}

function updateStatusToCompleted(bookId) {
  const updatedBook = findBookIdIsUnCompleted(bookId);

  if (updatedBook === -1) {
    return;
  } else {
    booksUnCompleted[updatedBook].isComplete = true;
    booksCompleted.push(booksUnCompleted[updatedBook]);
    deleteDataBookUnCompleted(bookId);
    showCompleted();
    showUnCompleted();
    updateData(true);
  }
}

function updateData(isComplete) {
  const completedParsed = JSON.stringify(booksCompleted);
  const unCompletedParsed = JSON.stringify(booksUnCompleted);

  if (isComplete) {
    localStorage.setItem("Completed", completedParsed);
  } else {
    localStorage.setItem("Uncompleted", unCompletedParsed);
  }
}