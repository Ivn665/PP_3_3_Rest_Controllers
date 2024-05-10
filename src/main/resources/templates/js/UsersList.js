export class UsersList {
    list = []
    url
    allUsersTab

    constructor(url, allUsersTab) {
        this.url = url;
        this.allUsersTab = allUsersTab;
    }

    async refreshList() {
        let response = await fetch(`${this.url}/users`)
        if (response.ok) {
            this.list = await response.json()
        } else {
            alert('Не удалось получить список Юзеров')
        }
    }

    deleteUserById(id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id == id) {
                this.list.slice(i, 1)
                break
            }
        }
        this.deleteUserFromTable(id)
    }

    deleteUserFromTable(id) {
        const usersRows = this.allUsersTab.querySelectorAll('tr')
        for (let i = 0; i < usersRows.length; i++) {
            if (usersRows[i].querySelector('td').innerText == id) {
                usersRows[i].remove()
                break
            }
        }
    }
}