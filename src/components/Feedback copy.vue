<template>
    <div>
      <h2 class="table-title">Movies</h2>
      <div class="filters">
      <input v-model="filterTitle" class="filter-input" placeholder="Search Title">
      <input v-model="filterReleaseDate" class="filter-input" placeholder="Search Release Date">
      <input v-model="filterVoteAverage" class="filter-input" placeholder="Search Vote Average">
      <select v-model="filterGenre" class="filter-input">
        <option value="">All Genres</option>
        <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
      </select>
    </div>
      <table class="movie-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" @click="sortByColumn(column)" :class="{ 'sorted-column': sortedColumn === column }">
              {{ column }}
              <span v-if="sortedColumn === column" :class="sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movie, index) in filteredMovieList" :key="movie.id">
            <td>{{ index + 1 }}</td>
            <router-link :to="`/movie/${movie.id}`">
              <td>{{ movie.title }}</td>
            </router-link>
            <td>{{ formatDate(movie.release_date) }}</td>
            <td>{{ movie.vote_average }}</td>
            <td>
              {{ getGenreName(movie.genre_ids) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        movies: [],
        genres: [],
        sortedColumn: null,
        sortDirection: 'asc', // Default sorting direction
        filterTitle: '',
        filterReleaseDate: '',
        filterVoteAverage: '',
        filterGenre: '',
      };
    },
    async mounted() {
      await this.fetchGenres();
      await this.fetchMovies();
    },
    methods: {
      async fetchGenres() {
        try {
          const response = await this.$http.get("/genre/movie/list");
          this.genres = response.data.genres;
        } catch (error) {
          console.log(error);
        }
      },
      async fetchMovies() {
        try {
          const response = await this.$http.get("/movie/popular");
          this.movies = response.data.results;
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

        this.filteredMovieList.sort((a, b) => {
            let aValue = this.getColumnValue(a, column.toLowerCase());
            let bValue = this.getColumnValue(b, column.toLowerCase());

            if (column.toLowerCase() === 'release date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
            } else if (column.toLowerCase() === 'genre') {
            // For sorting by genre, get the genre name from the movie object
            aValue = this.getGenreName(a.genre_ids);
            bValue = this.getGenreName(b.genre_ids);
            }

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
        getColumnValue(movie, column) {
            switch (column) {
            case 'title':
                return movie.title.toLowerCase();
            case 'release date':
                return movie.release_date;
            case 'vote average':
                return movie.vote_average;
            case 'genre':
                // eslint-disable-next-line no-case-declarations
                const genre = this.genres.find(genre => genre.id === parseInt(this.filterGenre));
                return genre ? movie.genre_ids.includes(genre.id) : false;
            default:
                return '';
            }
      },
      getGenreName(genreIds) {
        return genreIds.map(genreId => {
          const genre = this.genres.find(genre => genre.id === genreId);
          return genre ? genre.name : '';
        }).join(', ');
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      }
    },
    computed: {
      columns() {
        return ['Number', 'Title', 'Release Date', 'Vote Average', 'Genre'];
      },
      filteredMovieList() {
        let filteredMovies = [...this.movies];
  
        if (this.filterTitle) {
          filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(this.filterTitle.toLowerCase()));
        }
  
        if (this.filterReleaseDate) {
          filteredMovies = filteredMovies.filter(movie => movie.release_date.includes(this.filterReleaseDate));
        }
  
        if (this.filterVoteAverage) {
          filteredMovies = filteredMovies.filter(movie => movie.vote_average.toString().includes(this.filterVoteAverage));
        }
  
        if (this.filterGenre) {
          filteredMovies = filteredMovies.filter(movie => this.getColumnValue(movie, 'genre'));
        }
  
        return filteredMovies;
      }
    }
  };
  </script>
  
  <style scoped>
  .sorted-column {
    color: #ff2277; /* Change to desired color */
  }
  .table-title {
    color: #4CAF50;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .filter-input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 15px;
  margin-right: 15px;
  background-color: #f5f5f5;
  transition: border-color 0.3s;
}

.filter-input:hover,
.filter-input:focus {
  border-color: #25a0e3;
}

.filters {
  margin-bottom: 20px;
}
  
  .movie-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
  
  .movie-table th,
  .movie-table td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  
  .movie-table th {
    cursor: pointer;
    position: relative;
    background-color: #25a0e3;
    color: #fff;
  }
  
  .movie-table th:hover {
    background-color: #1060c2;
  }
  
  .movie-table th .arrow-up::before,
  .movie-table th .arrow-down::before {
    content: '';
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 5px;
  }
  
  .movie-table th .arrow-up::before {
    border-bottom: 5px solid #fff;
  }
  
  .movie-table th .arrow-down::before {
    border-top: 5px solid #fff;
  }
  
  .movie-table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .movie-table tbody tr:hover {
    background-color: #ddd;
  }
  </style>
  