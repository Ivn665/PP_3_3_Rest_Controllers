//Заполняем поля в модальных окнах
export function fillForm(user, form) {
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

export function makeUserObject(form) {
    let user = {
        firstName: form.querySelector(`input[name$="firstName"]`).value,
        lastName: form.querySelector(`input[name$="lastName"]`).value,
        age: form.querySelector(`input[name$="age"]`).value,
        email: form.querySelector(`input[name$="email"]`).value,
        password: form.querySelector(`input[name$="password"]`).value,
        roles: []
    }
    for (let role of form.querySelectorAll(`select[name$="roles"] > option`)) {
        if (role.selected == true) {
            user.roles.push(
                {
                    id : role.value,
                    name : 'ROLE_' +role.text
                })
        }
    }
    try {
        user.id = form.querySelector(`input[name$="id"]`).value
    } catch {
        //
    }
    return user
}

export function updateCurrenUser(user) {
    const currenUserRow = document.querySelectorAll('#currentUserRow > td')
    currenUserRow[0].innerText = user.id
    currenUserRow[1].innerText = user.firstName
    currenUserRow[2].innerText = user.lastName
    currenUserRow[3].innerText = user.age
    currenUserRow[4].innerText = user.email
    let rolesValue = []
    for (let role of user.roles) {
        rolesValue.push(`
                <span>
                    <span>${role.name.replace('ROLE_', '')}</span>
                </span>`)
    }
    currenUserRow[5].innerHTML = rolesValue.join('\n')


    const navbarHeader = document.querySelector('div.navbar-header')
    navbarHeader.innerHTML = `
        <span><b>${user.email}</b></span>
        <span>with roles:</span>
        ${rolesValue.join('\n')}
        `
}
