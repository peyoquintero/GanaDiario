<template>
  <div class="container">
    <section>
      <label>Codigo
        <input style="display:block" name="fbCodigo" class="freeinput" v-model="filtroCodigo" placeholder="">
        </label>
      <label>Marca 
       <input style="display:block" id="marca" class="freeinputsmall" v-model="filtroMarca"></label>
       <label style="display:block">Revisar
               <input style="display:block" type="checkbox" id="checkboxVx" v-model="filtroHuerfanos" >
       </label>
       <label>Fecha Venta
        <select style=" display:block; width:120px; height:30px" v-model="fechaVenta" >
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
      </label>

      <button @click="applyFilters">Ok</button>
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
import shared from './shared.js';

export default {
  components: {
    DemoGrid
  },
  data() {return {
    searchQuery: '',
    gridColumns: ['Codigo','FechaInicial','FechaFinal','Marca'],
    gridHeaders: ['Codigo','Fecha Entrada','Fecha Salida','Marca'],
    gridHeaderwidthpct: [25,25,25,25],
    gridData: [],
    excludeColumn:'Peso',
    excludeChar:'?',
    hisPesajes: [],
    fechasPesaje: [],
    fechaVenta: new Date(),
    filtroMarca: '*',
    filtroCodigo: '',
    filtroHuerfanos: false,
    hisPesajesFiltered: [],
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
    this.hispesajesFiltered = this.hisPesajes.filter(pesaje=>pesaje.Lote !== 'MUERTO'); 
    if (this.filtroMarca!=="*" && this.filtroMarca!=="") 
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Marca===this.filtroMarca); 
    }
    if (this.filtroCodigo!="")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Codigo.startsWith(this.filtroCodigo)); 
    }
    if (this.filtroHuerfanos)
    {
//      this.hispesajesFiltered = 
      var ventas = this.hispesajesFiltered.filter(pesaje=>pesaje.Operacion === 'Venta' && pesaje.Fecha === this.fechaVenta);
      var otrasOperaciones = this.hispesajesFiltered.filter(pesaje=>pesaje.Operacion !== 'Venta' && pesaje.Fecha < this.fechaVenta);
      this.hispesajesFiltered =  ventas.filter(function(element) {
      for (var j = 0; j < otrasOperaciones.length; j++) {
        if (element.Codigo == otrasOperaciones[j].Codigo) {
          return false;
        }
      }
       return true;
      });
     this.gridData = this.master(this.hispesajesFiltered);
  }
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
      let fechaSalida = datafilter.length > 1 ? datafilter[datafilter.length-1].Fecha : null;
      let objresult = {Codigo: result.Codigo, FechaInicial:minP.Fecha,FechaFinal:fechaSalida,Marca:minP.Marca,Activo:minP.Lote!=='MUERTO'};
      {datos.push(objresult)};
    });

    return datos
  }
  },
  mounted() {
      var url = "https://sheets.googleapis.com/v4/spreadsheets/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/values/PesajesPorCodigo?key=AIzaSyCGW3gRbBisLX950bZJDylH-_QJTR7ogd8";
      axios.get(url).then(response => {const apiResult = response.data; 
                                          this.hisPesajes = shared.transform(apiResult);
                                          this.gridData = this.master(this.hisPesajes);
                                          this.fechasPesaje = [...new Set( this.hisPesajes.map(obj => obj.Fecha)) ];
                                        });
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
