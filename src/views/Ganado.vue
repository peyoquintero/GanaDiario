<template>
  <div class="container">
    <section>
        <label for input="query">Search</label>
        <input style="height:30px" name="query" v-model="searchQuery">
      <button @click="applyFilters" style="margin-top:2px" type="submit">Ok</button>
    </section>
    <section class="totals">
      <item >{{resultCabezas}} </item> 
    </section>
    <DemoGrid
      :data="gridData"
      :columns="gridColumns"
      :headers="gridHeaders"
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
    gridColumns: ['Codigo','FechaInicial','Sexo','Marca'],
    gridHeaders: ['Codigo','Fecha Entrada','Sexo','Marca'],
    gridHeaderwidthpct: [25,25,25,25],
    gridData: [],
    excludeColumn:'Peso',
    excludeChar:'?',
    hisPesajes: []
  }},
  computed: {
    resultCabezas()
    { var cabezas = this.gridData.length>0 ? ` Cabezas: ${this.gridData.length}`: `No hay datos disponibles`;
      return cabezas;
    }
  },
  methods : {
  applyFilters(event)
  {
     this.gridData = this.master(this.hisPesajes);
  },  
  master(hispesajes)
  {
    var results = hispesajes.reduce(function(h, obj) {
      h[obj.Codigo] = (h[obj.Codigo] || []).concat(obj);
      return h; 
    }, {});

    results = Object.keys(results).map(key => {
      return {
          Codigo: key, 
          pesajes : hispesajes.filter(pesaje=>pesaje.Codigo===key).sort(function(a,b){
                    return new Date(a.Fecha) - new Date(b.Fecha);
                              })}
      }
    );

    var datos = [];
    results.forEach(result => {
      let datafilter = result.pesajes;
      let minP = datafilter[0];
      let objresult = {Codigo: result.Codigo, FechaInicial:minP.Fecha,Sexo:minP.Sexo,Marca:minP.Marca,Activo:minP.Lote!=='MUERTO'};
      {datos.push(objresult)};
    });

    return datos
  }
  },
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        try{
        axios.get(url).then(response => {
          this.hisPesajes = response.data;
          this.gridData = this.master(this.hisPesajes);
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
  padding-bottom: 2px;
  margin-bottom:2px;
  background-color:rgb(211, 211, 211);
}
.totals{
  display:flex;
  justify-content: space-evenly;
  margin-top:5px;
  background-color:white;
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
