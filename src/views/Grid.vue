<template>
  <table v-if="filteredData.length" >
    <thead>
      <tr>
        <th v-for="key in headers" 
        :style="colwidth(key)"
          @click="sortBy(headerKeyMapping(key))"
          :class="{ active: sortKey == key }">
          {{ capitalize(key) }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData">
        <td v-for="key in columns">
          {{entry[key]}}
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else></p>
</template>
<script>
export default {
  props: {
    data: Array,
    columns: Array,
    headers: Array,
    headerwidthpct: Array,
    excludeFilter: String,
    filterKey: String
  },
  data() {
    return {
      sortKey: '',
      sortOrders: this.columns.reduce((o, key) => ((o[key] = 1), o), {})
    }
  },
  computed: {
    filteredData() {
      const sortKey = this.sortKey
      const filterKey = this.filterKey && this.filterKey.toLowerCase()
      const order = this.sortOrders[sortKey] || 1
      let data = this.data
      if (filterKey) {
        data = data.filter((row) => {
          return Object.keys(row).filter(w=>w!==this.excludeFilter).some((key) => {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort((a, b) => {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  methods: {
    headerKeyMapping(headerKey)
    {
      var index = this.headers.indexOf(headerKey); 
      return this.columns[index];
    },
    colwidth(key)
    {
      var index = this.headers.indexOf(key); 
      console.log(this.headerwidthpct);
      return `column-width:${this.headerwidthpct[index]}%`;
    },
    sortBy(key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
}
</script>

<style>
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}
th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
  text-align: center;
  padding: 5px 10px;
  font-size: 18px;
}
td {
  background-color: #f9f9f9;
  text-align: center;
  padding: 5px 10px;
}
th.active {
  color: #fff;
}
th.active .arrow {
  opacity: 1;
}
.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}
.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}
.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>