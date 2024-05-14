export class UsersList {
    url
    list = []
    allUsersTab

    constructor(url, allUsersTab) {
        this.url = url;
        this.allUsersTab = allUsersTab;
    }

    async updateList() {
        const response = await fetch(`${this.url}/users`)
        if (response.ok) {
            this.list = await response.json()
            this.renderUsersList()
        } else {
            alert('Не удалось получить список Юзеров')
        }
    }

    renderUsersList() {
        const table = []
        for (let i = 0; i < this.list.length; i++) {
            table.push(this.renderOneRow(this.list[i]))
        }
        this.allUsersTab.innerHTML = table.join('\n')
    }

    renderOneRow(user) {
        let row = `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>`

        for (let role of user.roles) {
            row += `
                <span>
                    <span>${role.name.replace('ROLE_', '')}</span>
                </span>`
        }

        row += `
            </td>
            <td>
                <button class="btn text-white" style="background-color: #18A7B5"
                        data-bs-toggle="modal" data-bs-target="#editPanel">Edit</button>
            </td>
            <td>
                <button class="btn btn-danger" data-bs-toggle="modal"
                        data-bs-target="#deletePanel">Delete</button>
            </td>
        </tr>
        `
        return row
    }

    deleteUserById(id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                this.list.splice(i, 1)
                this.deleteUserFromTable(i)
                break
            }
        }
    }

    deleteUserFromTable(index) {
        this.allUsersTab.querySelectorAll(`tr`)[index].remove()
    }

    async editById(id) {
        let index
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                index = i
                break
            }
        }
        const response = await fetch(`${this.url}/user/${id}`)
        this.list[index] = await response.json()
        const rows = this.allUsersTab.querySelectorAll('tr')
        rows[index].innerHTML = this.renderOneRow(this.list[index])
        return index
    }

    addNewUser(newUser) {
        this.list.push(newUser)
        this.allUsersTab.insertAdjacentHTML('beforeend', this.renderOneRow(newUser))
    }
}