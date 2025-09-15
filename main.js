const booksCompleted = [];
const booksUnCompleted = [];
const editBooksCompletedData = [];
const editBooksUnCompletedData = [];
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
const save = "save";
const fieldSearch = document.getElementById("searchBookTitle");

document.addEventListener("DOMContentLoaded", function () {

  /* adding data to localstorage and show data */

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

  /* search data on array */

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

  /* if browser don't support localstorage page is showing red text */

  if (typeof localStorage === "undefined") {
    body.innerHTML =
      '<h1 style="color: red">Browser Tidak Support Local Storage</h1>';
  } else {
    loadStorageData();
  }

  showUnCompleted();
  showCompleted();
});

/* if the input column isn't have value, then the button will disabled */

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

/* add data to array then set to localstorage */

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

/* add data to local storage */

function addBooksData() {
  const completedParsed = JSON.stringify(booksCompleted);
  const unCompletedParsed = JSON.stringify(booksUnCompleted);

  if (buttonSpan.innerText === "selesai dibaca") {
    localStorage.setItem("Completed", completedParsed);
  } else {
    localStorage.setItem("Uncompleted", unCompletedParsed);
  }
}

/* when there is data on localstorage but there's no data on array, then push data to array*/

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

/* adding data to completed or uncompleted bookshelf */

bookFormIsComplete.addEventListener("click", function () {
  if (bookFormIsComplete.checked == true) {
    buttonSpan.innerText = "selesai dibaca";
  } else {
    buttonSpan.innerText = "Belum selesai dibaca";
  }
});

/* i forgot what is this for */

document.addEventListener(render, function () {});

/* showing data UnCompleted */

function showUnCompleted() {
  const containerUnCompleteBookList = document.getElementById("containerUnCompleteBookList");
  containerUnCompleteBookList.innerHTML = "";

  for (const data of booksUnCompleted) {
    const container = document.createElement("div");
    container.setAttribute("data-bookid", `${data.id}`);
    container.setAttribute("data-testid", "bookItem");
    container.classList.add("listItem");

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
    isCompletedButton.addEventListener("click", function () {
      updateStatusToCompleted(data.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.classList.add("button2");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      deleteDataBookUnCompleted(data.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add("button3");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editDataIsUnCompleted(data.id, data.title, data.author, data.year);
    });

    buttonContainer.append(isCompletedButton, deleteButton, editButton);

    container.append(title, author, year, buttonContainer);

    containerUnCompleteBookList.appendChild(container);
  }
}

/* showing data Completed */

function showCompleted() {
  const containerCompleteBookList = document.getElementById(
    "containerCompleteBookList"
  );
  containerCompleteBookList.innerHTML = "";

  for (const data of booksCompleted) {
    const br = document.createElement("br");

    const container = document.createElement("div");
    container.setAttribute("data-bookid", `${data.id}`);
    container.setAttribute("data-testid", "bookItem");
    container.classList.add("listItem");

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
    isUnCompletedButton.setAttribute(
      "data-testid",
      "bookItemIsUnCompleteButton"
    );
    isUnCompletedButton.classList.add("button1");
    isUnCompletedButton.innerText = "Belum Selesai";
    isUnCompletedButton.addEventListener("click", function () {
      updateStatusToUnCompleted(data.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.classList.add("button2");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      deleteDataBookCompleted(data.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.classList.add("button3");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editDataIsCompleted(data.id, data.title, data.author, data.year);
    });

    buttonContainer.append(isUnCompletedButton, deleteButton, editButton);

    container.append(title, author, year, buttonContainer);

    containerCompleteBookList.appendChild(container);
  }
}

/* search for Book id for completed shelf*/

function findBookIdIsCompleted(bookId) {
  for (const index in booksCompleted) {
    if (booksCompleted[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/* delete data on completed shelf*/

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

/* move book on Completed shelf to UnCompleted shelf */

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

/* search for Book id for uncompleted shelf*/

function findBookIdIsUnCompleted(bookId) {
  for (const index in booksUnCompleted) {
    if (booksUnCompleted[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/* delete data on uncompleted shelf*/

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

/* move book on UnCompleted shelf to Completed shelf */

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

/* update data on localstorage */

function updateData(isComplete) {
  const completedParsed = JSON.stringify(booksCompleted);
  const unCompletedParsed = JSON.stringify(booksUnCompleted);

  if (isComplete) {
    localStorage.setItem("Completed", completedParsed);
  } else {
    localStorage.setItem("Uncompleted", unCompletedParsed);
  }
}

/* data show will disappear if the values are deleted */

function searchingBook() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.trim();
  const resultTitle = document.getElementById("resultTitle");
  const resultAuthor = document.getElementById("resultAuthor");
  const resultYear = document.getElementById("resultYear");
  const resultIsCompleted = document.getElementById("resultIsCompleted");

  if (searchBookTitle == "") {
    resultTitle.innerText = "";
    resultAuthor.innerText = "";
    resultYear.innerText = "";
    resultIsCompleted.innerText = "";
  }
}

fieldSearch.addEventListener("input", function () {
  searchingBook();
});

/* show section edit data on Completed Shelf */

function editDataIsCompleted(bookId, bookTitle, bookAuthor, bookYear) {
  const id = bookId;
  const isCompleted = [];

  const containerCompleteBookList = document.getElementById(
    "containerCompleteBookList"
  );
  const editedBook = findBookIdIsCompleted(bookId);

  containerCompleteBookList.innerHTML = "";

  const form = document.createElement("form");
  form.setAttribute("id", "editBookCompleted");

  const content = document.createElement("div");
  content.setAttribute("class", "content");

  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "editBookTitle");
  labelTitle.innerText = "Judul";

  const editTitle = document.createElement("input");
  editTitle.setAttribute("type", "text");
  editTitle.setAttribute("id", "editBookTitle");
  editTitle.value = `${bookTitle}`;

  const labelAuthor = document.createElement("label");
  labelAuthor.setAttribute("for", "editBookAuthor");
  labelAuthor.innerText = "Penulis";

  const editAuthor = document.createElement("input");
  editAuthor.setAttribute("type", "text");
  editAuthor.setAttribute("id", "editBookAuthor");
  editAuthor.value = `${bookAuthor}`;

  const labelYear = document.createElement("label");
  labelYear.setAttribute("for", "editBookYear");
  labelYear.innerText = "Tahun";

  const editYear = document.createElement("input");
  editYear.setAttribute("type", "number");
  editYear.setAttribute("id", "editBookYear");
  editYear.value = `${bookYear}`;

  const submitEdit = document.createElement("button");
  submitEdit.setAttribute("type", "submit");
  submitEdit.setAttribute("id", "buttonSubmitEdit");
  submitEdit.setAttribute("class", "button1 btn-create btn-edit");
  submitEdit.setAttribute("form", "editBookCompleted");
  submitEdit.innerText = "Submit";
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    for (let i = 0; i < booksCompleted.length; i++) {
      if (booksCompleted[i].id === id) {
        if (isCompleted[0] === undefined) {
          isCompleted.push(booksCompleted[i].isComplete);
        } else {
          isCompleted[0] = booksCompleted[i].isComplete;
        }
      }
    }
    processEdit(
      id,
      editTitle.value.trim(),
      editAuthor.value.trim(),
      editYear.value.trim(),
      isCompleted[0]
    );
  });

  content.append(
    labelTitle,
    editTitle,
    labelAuthor,
    editAuthor,
    labelYear,
    editYear,
    submitEdit
  );
  form.append(content);
  containerCompleteBookList.append(form);
}

/* show section edit data on UnCompleted Shelf */

function editDataIsUnCompleted(bookId, bookTitle, bookAuthor, bookYear) {
  const id = bookId;
  const isUnCompleted = [];

  const containerUnCompleteBookList = document.getElementById(
    "containerUnCompleteBookList"
  );

  containerUnCompleteBookList.innerHTML = "";

  const form = document.createElement("form");
  form.setAttribute("id", "editBookUnCompleted");

  const content = document.createElement("div");
  content.setAttribute("class", "content");

  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "editBookTitle");
  labelTitle.innerText = "Judul";

  const editTitle = document.createElement("input");
  editTitle.setAttribute("type", "text");
  editTitle.setAttribute("id", "editBookTitle");
  editTitle.value = `${bookTitle}`;

  const labelAuthor = document.createElement("label");
  labelAuthor.setAttribute("for", "editBookAuthor");
  labelAuthor.innerText = "Penulis";

  const editAuthor = document.createElement("input");
  editAuthor.setAttribute("type", "text");
  editAuthor.setAttribute("id", "editBookAuthor");
  editAuthor.value = `${bookAuthor}`;

  const labelYear = document.createElement("label");
  labelYear.setAttribute("for", "editBookYear");
  labelYear.innerText = "Tahun";

  const editYear = document.createElement("input");
  editYear.setAttribute("type", "number");
  editYear.setAttribute("id", "editBookYear");
  editYear.value = `${bookYear}`;

  const submitEdit = document.createElement("button");
  submitEdit.setAttribute("type", "submit");
  submitEdit.setAttribute("id", "buttonSubmitEdit");
  submitEdit.setAttribute("class", "button1 btn-create btn-edit");
  submitEdit.setAttribute("form", "editBookUnCompleted");
  submitEdit.innerText = "Submit";
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    for (let i = 0; i < booksUnCompleted.length; i++) {
      if (booksUnCompleted[i].id === id) {
        if (isUnCompleted[0] === undefined) {
          isUnCompleted.push(booksUnCompleted[i].isComplete);
        } else {
          isUnCompleted[0] = booksUnCompleted[i].isComplete;
        }
      }
    }
    processEdit(
      id,
      editTitle.value.trim(),
      editAuthor.value.trim(),
      editYear.value.trim(),
      isUnCompleted[0]
    );
  });

  content.append(
    labelTitle,
    editTitle,
    labelAuthor,
    editAuthor,
    labelYear,
    editYear,
    submitEdit
  );
  form.append(content);
  containerUnCompleteBookList.append(form);
}

/* edit validation and process */

function processEdit(bookId, bookTitle, bookAuthor, bookYear, status) {
  if (status) {
    if (editBooksCompletedData[0] === undefined) {
      editBooksCompletedData.push({
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isCompleted: status,
      });
    } else {
      editBooksCompletedData[0].title = bookTitle;
      editBooksCompletedData[0].author = bookAuthor;
      editBooksCompletedData[0].year = bookYear;
      editBooksCompletedData[0].isCompleted = status;
    }
  } else {
    if (editBooksUnCompletedData[0] === undefined) {
      editBooksUnCompletedData.push({
        title: bookTitle,
        author: bookAuthor,
        year: bookYear,
        isCompleted: status,
      });
    } else {
      editBooksUnCompletedData[0].title = bookTitle;
      editBooksUnCompletedData[0].author = bookAuthor;
      editBooksUnCompletedData[0].year = bookYear;
      editBooksUnCompletedData[0].isCompleted = status;
    }
  }

  const sameShelfCompleted = booksCompleted.some(
    (data) => data.title === bookTitle && data.id !== bookId
  );

  const sameShelfUnCompleted = booksUnCompleted.some(
    (data) => data.title === bookTitle && data.id !== bookId
  );

  const differentShelf = status
    ? booksUnCompleted.some((data) => data.title === bookTitle)
    : booksCompleted.some((data) => data.title === bookTitle);

  if (status) {
    if (sameShelfCompleted) {
      alert("Terjadi duplikasi buku di rak Completed, mohon untuk diganti!");
    } else if (differentShelf) {
      alert(
        "Data sudah ada di rak Uncompleted, mohon untuk diubah atau diganti!"
      );
    } else {
      for (let i = 0; i < booksCompleted.length; i++) {
        if (booksCompleted[i].id === bookId) {
          booksCompleted[i].title = editBooksCompletedData[0].title;
          booksCompleted[i].author = editBooksCompletedData[0].author;
          booksCompleted[i].year = editBooksCompletedData[0].year;
        }
      }
      updateData(status);
      showCompleted();
    }
  } else {
    if (sameShelfUnCompleted) {
      alert("Terjadi duplikasi buku di rak UnCompleted, mohon untuk diganti!");
    } else if (differentShelf) {
      alert(
        "Data sudah ada di rak Completed, mohon untuk diubah atau diganti!"
      );
    } else {
      for (let i = 0; i < booksUnCompleted.length; i++) {
        if (booksUnCompleted[i].id === bookId) {
          booksUnCompleted[i].title = editBooksUnCompletedData[0].title;
          booksUnCompleted[i].author = editBooksUnCompletedData[0].author;
          booksUnCompleted[i].year = editBooksUnCompletedData[0].year;
        }
      }
      updateData(status);
      showUnCompleted();
    }
  }
}
