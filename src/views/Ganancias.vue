<template>
  <div class="container">
    <section>
      <input name="fbCodigo" v-model="filtroCodigo" placeholder="Codigo">
      <label>Fecha Inicial</label>
      <select v-model="fechaInicial">
      <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option">
        {{ option }}
      </option>
      </select>
      <input type="checkbox" id="checkbox1" v-model="fiExacta">
      <label>Fecha Final</label>
      <select v-model="fechaFinal">
      <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option">
        {{ option }}
      </option>
      </select>
      <input type="checkbox" id="checkbox2" v-model="ffExacta">
      <input id="marca" v-model="marca" placeholder="marca">
      <input id="lote" v-model="lote" placeholder="lote">
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
  justify-content: space-around;
}
.container {
  display: flex;
  flex-direction: column;
}
input{
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>