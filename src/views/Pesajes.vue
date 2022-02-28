<template>
  <div class="container">
    <form id="search">
      <label style="margin-left:30px">Search<input name="query" v-model="searchQuery"></label>
      <button type="submit">Ok</button>
    </form>
    <DemoGrid
      :data="gridData"
      :columns="gridColumns"
      :headers="gridColumns"
      :headerwidthpct="gridHeaderwidthpct"
      :exclude-filter="excludeColumn"
      :filter-key="searchQuery">
    </DemoGrid>
  </div>  
</template>

<script>
import DemoGrid from './Grid.vue'
import axios from 'axios';

export default {
  components: {
    DemoGrid
  },
  data() {return {
    searchQuery: '',
    gridColumns: ['Fecha','Codigo','Peso','Sexo','Marca','Lote'],
    gridHeaderwidthpct: [20,15,15,15,10,25],
    gridData: [],
    excludeColumn:'Peso'
  }},
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        try{
        axios.get(url).then(response => this.gridData = response.data);
                            localStorage.setItem('hispesajes', parsed);
        }
        catch{
          this.hispesajes = JSON.parse(localStorage.getItem('hispesajes'));
        }
  }
}
</script>

