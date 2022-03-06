<template>
  <div class="container">
    <section>
        <label for input="query">Search</label>
        <input style="height:30px" name="query" v-model="searchQuery">
      <button style="margin-top:2px" type="submit">Ok</button>
    </section>
    <DemoGrid
      :data="gridData"
      :columns="gridColumns"
      :headers="gridColumns"
      :headerwidthpct="gridHeaderwidthpct"
      :exclude-filter="excludeColumn"
      :exclude-char="excludeChar"
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
    excludeColumn:'Peso',
    excludeChar:''
  }},
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        try{
        axios.get(url).then(response => {this.gridData = response.data;
                                        localStorage.setItem('hispesajes', JSON.stringify(this.gridData));})
        .catch(err=>this.hispesajes = JSON.parse(localStorage.getItem('hispesajes')))
        }
        catch(error){
          console.log('Problema trayendo datos');
        }
  }
}
</script>
<style scoped>
.container {
  display:flex;
  flex-direction:column;
  justify-content: center;
}
section {
  display: flex;
  justify-content: center;
  align-items:center;
  flex-wrap:wrap;
  border-radius: 5px;
  border-width:2px;
  border-style:solid;
  border-color:lightgray;
  padding: 5px;
  margin-bottom: 5px;
  background-color:rgb(211, 211, 211);
}
label{
  font-family: arial;
  font-size:14px;
  font-weight: bold;
  margin: 5px;
}
input{
  width:120px;
  height:30px;
}
button{
  border: 2px solid #42b983;
  border-radius: 5px;
  background: #42b983;
  color:white;
  width:40px;
  height:30px;
  margin-top:20px;
  margin-left: 10px;
}
</style>
