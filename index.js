const list = document.querySelector(".contacts");
const section = document.querySelector(".section");
let trIndex = 0;

// function to change message
const changeInvalidMessage = (evt) => {
    evt.target.setCustomValidity("Телефон состоит из цифр и тире (возможен “+” как первый символ)");
};
const clearInvalidMessage = (evt) => {
    evt.target.setCustomValidity("");
};

// fuctiont to edit item
const editItem = (evt) => {
    const changedItem = evt.target.closest(".contacts__item");
    const allItems = Array.from(document.querySelectorAll(".contacts__item"));
    trIndex = allItems.indexOf(changedItem);

    changedItem.querySelector(".buttons__delete").removeEventListener("click", deleteItem);
    changedItem.querySelector(".buttons__edit").removeEventListener("click", editItem);
    changedItem.innerHTML = "";

    const form = document.createElement("form");
    form.id = "edit-form";
    form.addEventListener("submit", saveItem);
    section.prepend(form);

    const tdInputName = document.createElement("td");
    const inputName = document.createElement("input");
    inputName.classList.add("save-name");
    inputName.placeholder = "Имя";
    inputName.autocomplete = "off";
    inputName.required = "true";
    inputName.setAttribute("form", "edit-form");
    tdInputName.append(inputName);

    const tdInputTelno = document.createElement("td");
    const inputTelno = document.createElement("input");
    inputTelno.classList.add("save-telno");
    inputTelno.placeholder = "Номер";
    inputTelno.autocomplete = "off";
    inputTelno.required = "true";
    inputTelno.pattern = "[0-9/+]{1}[0-9/-]{1,100}";
    inputTelno.setAttribute("form", "edit-form");
    inputTelno.addEventListener("invalid", changeInvalidMessage);
    inputTelno.addEventListener("input", clearInvalidMessage);
    tdInputTelno.append(inputTelno);

    const tdEmpty = document.createElement("td");
    tdEmpty.classList.add("save-empty");

    const tdSaveButton = document.createElement("td");
    const saveButton = document.createElement("button");
    saveButton.classList.add("save-button");
    saveButton.textContent = "Сохранить";
    saveButton.type = "submit";
    saveButton.setAttribute("form", "edit-form");
    tdSaveButton.append(saveButton);

    changedItem.append(tdInputName, tdInputTelno, tdEmpty, tdSaveButton);
};

// function to delete item
const deleteItem = ({ target }) => {
    const item = target.closest(".contacts__item");
    const editButton = item.querySelector(".buttons__edit");
    item.remove();
    target.removeEventListener("click", deleteItem);
    editButton.removeEventListener("click", editItem);
};

// function to save changes
const saveItem = (evt) => {
    const changedItem = Array.from(document.querySelectorAll(".contacts__item"))[trIndex];
    const form = document.getElementById("edit-form");
    const inputName = changedItem.querySelector(".save-name");
    const inputTelno = changedItem.querySelector(".save-telno");
    evt.preventDefault();
    inputTelno.removeEventListener("invalid", changeInvalidMessage);
    inputTelno.removeEventListener("input", clearInvalidMessage);
    form.removeEventListener("submit", saveItem);
    const newName = inputName.value;
    const newTelno = inputTelno.value;
    changedItem.innerHTML = "";
    createTrInner(changedItem, { name: newName, telno: newTelno });
};

// function to fill li
const createTrInner = (tr, contact) => {
    tr.classList.add("contacts__item");

    const tdName = document.createElement("td");
    tdName.classList.add("table__name");
    tdName.textContent = contact.name;

    const tdTelno = document.createElement("td");
    tdTelno.classList.add("table__telno");
    tdTelno.textContent = contact.telno;

    const tdDelete = document.createElement("td");
    tdDelete.classList.add("table__delete");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("buttons__delete");
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", deleteItem);
    tdDelete.append(deleteButton);

    const tdEdit = document.createElement("td");
    tdEdit.classList.add("table__edit");
    const editButton = document.createElement("button");
    editButton.classList.add("buttons__edit");
    editButton.textContent = "Изменить";
    editButton.addEventListener("click", editItem);
    tdEdit.append(editButton);

    tr.append(tdName, tdTelno, tdDelete, tdEdit);

    return tr;
};

// creating contacts in ul
const createContactItem = (contact) => {
    const tr = document.createElement("tr");
    createTrInner(tr, contact);
    list.append(tr);
};

// create loading appearence
const loader = document.querySelector(".loader");

function toggleLoader() {
    if (loader.hasAttribute("hidden")) {
        loader.removeAttribute("hidden");
    } else {
        loader.setAttribute("hidden", "");
    }
}

// filling ul with help of created function, used jsonplaceholder.typicode.com for request
function getContacts() {
    toggleLoader();
    const getContacts = fetch("https://jsonplaceholder.typicode.com/users");
    getContacts
        .then((response) => response.json())
        .then((json) => {
            json.slice(0, 4).forEach((item) =>
                createContactItem({ name: item.name, telno: item.phone.split(" ")[0] })
            );
        })
        .finally(() => toggleLoader());
}

// reset task
const resetButton = document.querySelector(".reset");
resetButton.addEventListener("click", () => {
    const deleteButtons = list.querySelectorAll(".buttons__delete");
    deleteButtons.forEach((item) => {
        item.removeEventListener("click", deleteItem);
    });
    const editButtons = list.querySelectorAll(".buttons__edit");
    editButtons.forEach((item) => {
        item.removeEventListener("click", editItem);
    });
    list.innerHTML = "";
    getContacts();
});

// adding contact
const form = document.querySelector(".form");
const nameInput = form.querySelector(".form__name");
const telnoInput = form.querySelector(".form__telno");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    createContactItem({ name: nameInput.value, telno: telnoInput.value });
    nameInput.value = "";
    telnoInput.value = "";
});

// change validity message of telno
telnoInput.addEventListener("invalid", changeInvalidMessage);
telnoInput.addEventListener("input", clearInvalidMessage);

// init contacts
getContacts();
