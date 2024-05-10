import {UsersList} from "./UsersList.js";

const allUsersTab = document.querySelector('#allUsersTab')

let deleteButtons = allUsersTab.querySelectorAll('button[data-bs-target=\'#deletePanel\']')
const deleteForm = document.querySelector('#deleteForm')
const deleteBtn = document.querySelector('#deleteBtn')

let editButtons = allUsersTab.querySelectorAll('button[data-bs-target=\'#editPanel\']')
const editForm = document.querySelector('#editForm')
const editBtn = editForm.querySelector('#editBtn')

const token = document.querySelector(`meta[name="_csrf"]`).content

const id = document.querySelector('#currentUserRow').querySelector('td').innerText
const url = 'http://localhost:8080'
const users = new UsersList(url, allUsersTab)


document.addEventListener('DOMContentLoaded', initialRender)

function initialRender() {
    users.refreshList()
}


//Обрабатываем нажатия на кнопки Delete и Edit в таблице всех Юзеров
for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', customizeDeletePanel(i))
}

function customizeDeletePanel(index) {
    return function () {
        fillForm(index, deleteForm)
        deleteBtn.querySelector('input[name$="id"]').value = users.list[index].id
    }
}

for (let i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener('click', customizeEditPanel(i))
}

function customizeEditPanel(index) {
    return function () {
        fillForm(index, editForm)
    }
}

//Заполняем поля в модальных окнах
function fillForm(index, form) {
    const user = users.list[index]
    const inputs = form.querySelectorAll('input')

    inputs[0].value = user.id
    inputs[1].value = user.firstName
    inputs[2].value = user.lastName
    inputs[3].value = user.age
    inputs[4].value = user.email

    const options = form.querySelectorAll('select > option')
    const roles = user.roles.map(e => e.name.replace('ROLE_', ''))
    for (let i = 0; i < options.length; i++) {
        options[i].selected = false
        for (let j = 0; j < roles.length; j++) {
            if (options[i].text === roles[j]) {
                options[i].selected = true
                break
            }
        }
    }
}

//Обрабатываем нажаите delete в модальном окне

deleteBtn.addEventListener('submit', deleteUser)

async function deleteUser(event) {
    event.preventDefault()
    const btn = deleteBtn.querySelector('input[type$="submit"]')
    btn.disabled = true;
    const deletedId = deleteBtn.querySelector('input[name$="id"]').value
    let response = await fetch(deleteBtn.action, {
        method: 'POST',
        body: JSON.stringify(deletedId),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN' : token
        }
    })
    response = await response.json()
    if (response) {
        if (deletedId == id) {
            document.querySelector('#logout').querySelector('button').click()
        }
        users.deleteUserById(deletedId)
    } else {
        alert('The user has not been deleted')
    }
    btn.disabled = false
    deleteBtn.parentElement.querySelector('button[data-bs-dismiss$="modal"]').click()
}




