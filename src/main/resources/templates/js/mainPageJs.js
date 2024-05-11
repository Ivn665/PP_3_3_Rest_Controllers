import {UsersList} from "./UsersList.js";
import {fillForm, makeUserObject, updateCurrenUser} from "./utils.js";

const allUsersTab = document.querySelector('#allUsersTab')

let deleteButtons
const deleteForm = document.querySelector('#deleteForm')
let deleteBtn = document.querySelector('#deleteBtn')

let editButtons
const editForm = document.querySelector('#editForm')
const editBtn = editForm.parentElement.querySelector('button[type$="submit"]')

const csrfHeader = document.querySelector(`meta[name$="_csrf_header"]`).content
const token = document.querySelector(`meta[name$="_csrf"]`).content

const id = document.querySelector('#currentUserRow > td').innerText
const url = 'http://localhost:8080'
const users = new UsersList(url, allUsersTab)


await users.updateList()
updateEvents()

//Обрабатываем нажатия на кнопки Delete и Edit в таблице всех Юзеров
function updateEvents() {
    console.debug('updateEvents')
    deleteButtons = allUsersTab.querySelectorAll('button[data-bs-target=\'#deletePanel\']')
    editButtons = allUsersTab.querySelectorAll('button[data-bs-target=\'#editPanel\']')
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].removeEventListener('click', customizeDeletePanel)
        editButtons[i].removeEventListener('click', customizeEditPanel)
        deleteButtons[i].addEventListener('click', customizeDeletePanel(i))
        editButtons[i].addEventListener('click', customizeEditPanel(i))
    }
}
function customizeDeletePanel(index) {
    console.debug('customizeDeletePanel')
    return function () {
        console.log(users.list)
        fillForm(users.list[index], deleteForm)
        deleteBtn.querySelector('input[name$="id"]').value = users.list[index].id
    }
}
function customizeEditPanel(index) {
    console.debug('customizeEditPanel')
    return function () {
        fillForm(users.list[index], editForm.querySelector('div'))
    }
}

//Обрабатываем нажаите delete в модальном окне
deleteBtn.addEventListener('submit', deleteUser)
async function deleteUser(event) {
    console.debug('deleteUser')
    event.preventDefault()
    const btn = deleteBtn.querySelector('input[type$="submit"]')
    btn.disabled = true;
    const deletedId = deleteBtn.querySelector('input[name$="id"]').value
    let response = await fetch(deleteBtn.action, {
        method: 'DELETE',
        body: JSON.stringify(deletedId),
        headers: {
            'Content-Type' : 'application/json',
            [csrfHeader] : token
        }
    })
    if (deletedId == id) {
        document.querySelector('#logout').querySelector('button').click()
    }
    if (response && response.ok) {
        await users.deleteUserById(deletedId)
    } else {
        alert('The user has not been deleted')
    }
    updateEvents()
    btn.disabled = false
    deleteBtn.parentElement.querySelector('button[data-bs-dismiss$="modal"]').click()
}

//Обрабатываем нажаите edit в модальном окне
editForm.addEventListener('submit', editUser)

async function editUser(event) {
    console.debug('editUser')
    event.preventDefault()
    editBtn.disabled = true
    const editUser = makeUserObject(editForm.querySelector('div'))
    let response = await fetch(editForm.action, {
        method: 'PUT',
        body: JSON.stringify(editUser),
        headers: {
            'Content-Type' : 'application/json',
            [csrfHeader] : token
        }
    })
    if (response && response.ok) {
        const index = await users.editById(editUser.id)
        if(editUser.id == id) {
            updateCurrenUser(users.list[index])
        }
    } else {
        alert('The user has not been changed')
    }
    updateEvents()
    editBtn.disabled = false
    editBtn.parentElement.querySelector('button[data-bs-dismiss$="modal"]').click()
}


