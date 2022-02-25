<template>
  <div class="container">
    <section>
      <input name="fbCodigo" class="freeinput" v-model="filtroCodigo" placeholder="Codigo" style="width:80px;">
      <label>Fecha Inicial
        <select v-model="fechaInicial">
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        <input type="checkbox" id="checkbox1" v-model="fiExacta" style="width:20px">
        <label for="checkbox1">=</label>
      </label>
      <label>Fecha Final
        <select v-model="fechaFinal">
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        <input type="checkbox" id="checkbox2" v-model="ffExacta" style="width:20px">
        <label for="checkbox2">=</label>
      </label>
      <input id="marca" class="freeinput" v-model="marca" placeholder="Marca">
      <input id="lote" class="freeinput" v-model="lote" placeholder="Lote">
      <button type="submit">Ok</button>
    </section>
    <DemoGrid
    :data="gridData"
    :columns="gridColumns"
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
    gridColumns: ['Codigo','FechaInicial','FechaFinal','PesoInicial','PesoFinal','Ganancia'],
    gridData: [],
    hispesajes: [],
    fechasPesajes: [],
    fechaInicial : new Date(),
    fiExacta: false,
    fechaFinal : new Date(),
    ffExacta: false,
    filtroLote: '*',
    filtroMarca: '*',
    filtroCodigo: ''
  }},
  methods: {
  ganancias(hispesajes)
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

    results = results.filter(result=>result.pesajes.length>1)

    var minmaxPesajes = [];
    results.forEach(result => {
      let datafilter = result.pesajes;
      let minP = datafilter[0];
      let maxP = datafilter[datafilter.length-1];
      let minMaxPesajes = [minP,maxP]
      let objresult = {Codigo: result.Codigo, pi: minMaxPesajes[0],pf: minMaxPesajes[1]};
      minmaxPesajes.push(objresult);
    });

    var r = minmaxPesajes.map(w=> {return {"Codigo":w.Codigo,
    "FechaInicial":w.pi.Fecha,
    "FechaFinal":w.pf.Fecha,
    "PesoInicial":w.pi.Peso,
    "PesoFinal":w.pf.Peso,
    "Ganancia": Math.round((w.pf.Peso-w.pi.Peso)/ ((new Date(w.pf.Fecha)-new Date(w.pi.Fecha))/86400000)*1000)
    }});

    return r
  }
  },
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        axios.get(url).then(response => {
                            this.hispesajes = response.data;
                            this.gridData = this.ganancias(this.hispesajes);
                            this.fechasPesaje = [...new Set( this.hispesajes.map(obj => obj.Fecha)) ];
//                            this.fechaInicial = this.fechasPesajes[0]??this.fechaInicial
//                            this.fechaFinal = this.fechasPesajes[this.fechasPesajes.length-1]??this.fechaFinal
        });
  },
}
</script>

<style>
section {
  display: flex;
  margin-bottom: 10px;
  justify-content:inherit;
}
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
label{
  text-align: right;
  align-content: center;
}
.freeinput{
  margin-left:5px;
  width:120px;
  height:30px;
}
button{
  border: 2px solid #42b983;
  background: #42b983;
  color:white;
  width:50px;
  margin-left: 5px;
}
</style>




