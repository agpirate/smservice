<template>
    <div>
      <h2 class="table-title">Users</h2>
      <button @click="openCreateDialog" class="create-button">Create New User</button>
  
      <div class="filters">
        <input v-model="filterFirstname" class="filter-input" placeholder="Search First Name">
        <input v-model="filterLastname" class="filter-input" placeholder="Search Last Name">
        <input v-model="filterUsername" class="filter-input" placeholder="Search Username">
        <input v-model="filterDepartment" class="filter-input" placeholder="Search Department">
        <input v-model="filterRole" class="filter-input" placeholder="Search Role">
      </div>
  
      <table class="user-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" @click="sortByColumn(column)" :class="{ 'sorted-column': sortedColumn === column }">
              {{ column }}
              <span v-if="sortedColumn === column" :class="sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>{{ index + 1 }}</td>
              <td>{{ user.firstname }}</td>
            <td>{{ user.lastname }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.role }}</td>
            <td>
              <v-btn icon @click="editUser(user)" color="teal" small >
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon @click="deleteUser(user.id)" color="red" small>
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="pagination">
        <button color="primary">
          <router-link :to="{ path: $route.path, query: { ...$route.query, page: Math.max(1, currentPage - 1) } }" class="prev" :class="{ disabled: currentPage === 1 }">Prev</router-link>
        </button>
        <span v-for="n in totalPages" :key="n">
          <router-link :to="{ path: $route.path, query: { ...$route.query, page: n } }" :class="{ active: n === currentPage }">{{ n }}</router-link>
        </span>
        <button color="primary">
          <router-link :to="{ path: $route.path, query: { ...$route.query, page: Math.min(totalPages, currentPage + 1) } }" class="next" :class="{ disabled: currentPage === totalPages }">Next</router-link>
        </button>
      </div>
  
      <!-- Confirmation Dialog -->
      <dialog ref="confirmationDialog" class="modal">
        <h3>Are you sure you want to delete this user?</h3>
        <div class="button-group">
          <button @click="confirmDeleteUser" style="margin-right: 10px;">Yes</button>
          <button @click="cancelDeleteUser">No</button>
        </div>
      </dialog>
  
      <!-- Edit Modal -->
      <dialog ref="editDialog" class="modal">
        <h3>Edit User</h3>
        <form @submit.prevent="updateUser">
          <!-- Form inputs for editing a user -->
          <input v-model="editedUser.firstname" placeholder="First Name">
          <input v-model="editedUser.lastname" placeholder="Last Name">
          <input v-model="editedUser.username" placeholder="Username">
          <select v-model="editedUser.department" placeholder="Department" class="select-input">
                <option value="">Select Department</option>
                <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}</option>
          </select>
          <input v-model="editedUser.password" type="password" placeholder="Password">
           <!-- Role dropdown -->
          <select v-model="editedUser.role" class="select-input">
             <option value="">Select Role</option>
             <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
          </select>
  
          <div>
            <button type="submit" style="margin: 10px;">Submit</button>
            <button type="button" @click="cancelEditUser" >Cancel</button>
          </div>
        </form>
      </dialog>
  
     
    <dialog ref="createDialog" class="modal">
        <h3>Create New User</h3>
      <form @submit.prevent="createUser">
        <!-- Form inputs for creating a new user -->
        <input v-model="newUser.firstname" placeholder="First Name">
        <input v-model="newUser.lastname" placeholder="Last Name">
        <input v-model="newUser.username" placeholder="Username">
        <select v-model="newUser.department" placeholder="Department" class="select-input">
            <option value="">Select Department</option>
            <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}</option>
        </select>
        <input v-model="newUser.password" type="password" placeholder="Password">
         <!-- Role dropdown -->
        <select v-model="newUser.role" class="select-input">
        <option value="">Select Role</option>
        <option v-for="role in roleOptions" :key="role" :value="role">{{ role }}</option>
        </select>
        <div>
          <button type="submit" style="margin: 10px;">Submit</button>
          <button type="button" @click="cancelCreateUser">Cancel</button>
        </div>
      </form>
    </dialog>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        departmentOptions: ['news', 'current', 'educational', 'recreation', 'radio_news','sport','amharic_language'],
        roleOptions: ['admin', 'ict', 'member', 'official'],
        userToDelete: null,
        editedUser: {
          id: '',
          firstname: '',
          lastname: '',
          username: '',
          department: '',
          password: '',
          role: ''
        },
        createDialogVisible: false,
        newUser: {
          firstname: '',
          lastname: '',
          username: '',
          department: '',
          password: '',
          role: ''
        },
        users: [],
        currentPage: 1,
        pageSize: 10,
        sortedColumn: null,
        sortDirection: 'asc',
        filterFirstname: '',
        filterLastname: '',
        filterUsername: '',
        filterDepartment: '',
        filterRole: ''
      };
    },
    async mounted() {
      await this.fetchUsers();
    },
    watch: {
      '$route.query.page'(newValue) {
        this.currentPage = parseInt(newValue) || 1;
        this.fetchUsers();
      }
    },
    methods: {
      deleteUser(userId) {
        this.userToDelete = userId;
        this.$refs.confirmationDialog.showModal();
      },
      async confirmDeleteUser() {
        // let users = JSON.parse(localStorage.getItem('userData')) || [];
        const index = this.users.findIndex(user => user.id === this.userToDelete);
        if (index !== -1) {
          this.users.splice(index, 1);
         // localStorage.setItem('userData', JSON.stringify(users));
        }
        const uid = this.userToDelete;
        if (uid) {
          try {
              await axios.delete('http://192.168.7.5:3000/user/profile?id='+uid);
            //await axios.delete(`http://192.168.7.5:8000/user/${uid}`);
          } catch (error) {
            console.error('Error deleting user:', error);
          }
        }
        this.users = this.users.filter(user => user.id !== this.userToDelete);
        this.userToDelete = null;
        this.$refs.confirmationDialog.close();
      },
      cancelDeleteUser() {
        this.userToDelete = null;
        this.$refs.confirmationDialog.close();
      },
      editUser(user) {
        this.editedUser = { ...user };
        this.$refs.editDialog.showModal();
      },
      async updateUser() {
        try {
          const userData = this.editedUser;
          console.log(userData)
        // const response = await axios.patch(`http://192.168.7.5:8000/user/${this.editedUser.id}`, this.editedUser);
        const response = await axios.put('http://192.168.7.5:3000/user/profile', userData);
        const index = this.users.findIndex(u => u.id === this.editedUser.id);

        console.log('User updated:', response.data);
        if (index !== -1) {
          this.users[index] = { ...this.editedUser };
          this.$set(this.users, index, { ...this.editedUser });
          //localStorage.setItem('userData', JSON.stringify(users));
            
        }
        } catch (error) {
         console.log(error)   
        }
        this.$refs.editDialog.close();
      },
      cancelEditUser() {
        this.$refs.editDialog.close();
      },
      cancelCreateUser() {
        this.newUser = {
          firstname: '',
          lastname: '',
          username: '',
          department: '',
          password: '',
          role: ''
        };
        this.$refs.createDialog.close();
      },
      openCreateDialog() {
        console.log("Opening create dialog"); // Add this line

        this.$refs.createDialog.showModal();
      },
      async createUser() {
        // let users = JSON.parse(localStorage.getItem('userData')) || [];
        // users.push(this.newUser);
        // console.log(this.newUser);
        //const response = await axios.post('http://192.168.7.5:8000/user', this.newUser);
        const userData = this.newUser;
        console.log(userData)
        const response = await axios.post('http://192.168.7.5:3000/user/profile', userData);
        console.log(response.data)
        this.users.push(response.data);
        //this.users.push(response.data);
        //localStorage.setItem('userData', JSON.stringify(users));
        this.$refs.createDialog.close();
        this.newUser = {
          firstname: '',
          lastname: '',
          username: '',
          department: '',
          password: '',
          role: ''
        };
      },
      async fetchUsers() {
        try {
          if (this.users.length === 0) {
            // const response = await axios.get('http://192.168.7.5:8000/user');
            const response = await axios.get('http://192.168.7.5:3000/user/profile');

            // localStorage.setItem('userData', JSON.stringify(response.data));
            this.users = response.data;
          } else {
            const response = await axios.get('http://192.168.7.5:3000/user/profile');
            this.users = response.data;
          }
        } catch (error) {
          console.log(error);
        }
      },
      toggleSortDirection() {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      },
      sortByColumn(column) {
        if (this.sortedColumn === column) {
          this.toggleSortDirection();
        } else {
          this.sortedColumn = column;
          this.sortDirection = 'asc';
        }
        this.filteredUserList.sort((a, b) => {
          let aValue = this.getColumnValue(a, column.toLowerCase());
          let bValue = this.getColumnValue(b, column.toLowerCase());
          if (this.sortDirection === 'asc') {
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
          } else {
            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
            return 0;
          }
        });
      },
      getColumnValue(user, column) {
        switch (column) {
          case 'first name':
            return user.firstname.toLowerCase();
          case 'last name':
            return user.lastname.toLowerCase();
          case 'username':
            return user.username.toLowerCase();
          case 'department':
            return user.department.toLowerCase();
          case 'role':
            return user.role.toLowerCase();
          default:
            return '';
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      },
      handlePageChange(pageNumber) {
        this.currentPage = pageNumber;
      },
      customClickHandler(pageNumber) {
        this.currentPage = pageNumber;
      }
    },
    computed: {
      columns() {
        return ['Number', 'First Name', 'Last Name', 'Username', 'Department', 'Role', 'Action'];
      },
      filteredUserList() {
        let filteredUsers = [...this.users];
        if (this.filterFirstname) {
          filteredUsers = filteredUsers.filter(user => user.firstname.toLowerCase().includes(this.filterFirstname.toLowerCase()));
        }
        if (this.filterLastname) {
          filteredUsers = filteredUsers.filter(user => user.lastname.toLowerCase().includes(this.filterLastname.toLowerCase()));
        }
        if (this.filterUsername) {
          filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(this.filterUsername.toLowerCase()));
        }
        if (this.filterDepartment) {
          filteredUsers = filteredUsers.filter(user => user.department.toLowerCase().includes(this.filterDepartment.toLowerCase()));
        }
        if (this.filterRole) {
          filteredUsers = filteredUsers.filter(user => user.role.toLowerCase().includes(this.filterRole.toLowerCase()));
        }
        return filteredUsers;
      },
      paginatedUsers() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.filteredUserList.slice(startIndex, startIndex + this.pageSize);
      },
      totalPages() {
        return Math.ceil(this.filteredUserList.length / this.pageSize);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Your styles here... */
  .button-group {
  /* padding:70px 70px; */
  margin-left: 40%;
}
/* Styles for the button */
.create-button {
  padding: 10px 20px;
  margin: 10px 20px;
  background-color: teal; /* Green */
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.create-button:hover {
  background-color: #1d1c20; /* Darker green */
}
  .user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .user-table th,
  .user-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .user-table th {
    background-color: #f2f2f2;
    cursor: pointer;
  }
  
  .user-table th.sorted-column {
    background-color: #1797b3;
    color: white;
  }
  
  .user-table th.sorted-column span {
    margin-left: 5px;
  }
  
  .user-table th.sorted-column span.arrow-down:before {
    content: '\25bc';
  }
  
  .user-table th.sorted-column span.arrow-up:before {
    content: '\25b2';
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .pagination button {
    /* background-color: #1aa3b5; */
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
  }
  
  .pagination button.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px teal;
  width: 800px; /* Adjust the max-width as needed */

}

  
.modal h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  color: teal;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal button {
  padding: 10px 20px;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal button:hover {
  background-color: teal;
}
  
  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .filter-input {
    margin: 5px;
    padding: 10px;
  }
  
  .custom-textarea {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;
  /* Add any other custom styles you want */
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination .prev, .pagination .next {
  margin-right: 10px;
}

.pagination .disabled {
  color: #999;
}



.sorted-column {
  color: #ff2277; /* Change to desired color */
}
.table-title {
  color: teal;
  font-size: 54px;
  margin-bottom: 20px;
  text-align: center;
}

.filter-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 15px;
  margin-right: 5px;
  background-color: #f5f5f5;
  transition: border-color 0.3s;
}

.filter-input:hover,
.filter-input:focus {
  border-color: #25a0e3;
}

.filters {
  margin: 20px 20px;
}
.poll-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
}

.poll-table th,
.poll-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.poll-table th {
  cursor: pointer;
  position: relative;
  background-color: teal;
  color: #fff;
}

.poll-table th:hover {
  background-color: #343035;
}

.poll-table th .arrow-up::before,
.poll-table th .arrow-down::before {
  content: '';
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5px;
}

.poll-table th .arrow-up::before {
  border-bottom: 5px solid #fff;
}

.poll-table th .arrow-down::before {
  border-top: 5px solid #fff;
}

.poll-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.poll-table tbody tr:hover {
  background-color: #ddd;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-item {
  list-style: none;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 3px;
  display: inline-block;
}

.page-item:hover {
  background-color: #f0f0f0;
}

.page-link {
  color: #333;
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  transition: background-color 0.3s;
}

.page-link:hover {
  background-color: #e0e0e0;
}
.select-input {
  margin: 5px;
  padding: 10px;
  border: 1px solid #0e0707;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
  background-color: #fff;
}

.select-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
  </style>
  