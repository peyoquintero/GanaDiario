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
    hispesajes: []
  }},
  methods: {
  ganancias(hispesajes)
  {
    const average = hispesajes.reduce((total, next) => total + next.peso, 0) / hispesajes.length;

    var results = hispesajes.reduce(function(h, obj) {
      h[obj.codigo] = (h[obj.codigo] || []).concat(obj);
      return h; 
    }, {});

    results = Object.keys(results).map(key => {
      return {
          codigo: key, 
          pesajes : hispesajes.filter(pesaje=>pesaje.codigo===key).sort(function(a,b){
                    return new Date(a.fecha) - new Date(b.fecha);
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
      let objresult = {codigo: result.codigo, pi: minMaxPesajes[0],pf: minMaxPesajes[1]};
      minmaxPesajes.push(objresult);
    });
    var r = minmaxPesajes.map(w=> {return {"Codigo":w.codigo,
    "FechaInicial":w.pi.fecha,
    "FechaFinal":w.pf.fecha,
    "PesoInicial":w.pi.peso,
    "PesoFinal":w.pf.peso,
    "Ganancia": Math.round((w.pf.peso-w.pi.peso)/ ((new Date(w.pf.fecha)-new Date(w.pi.fecha))/86400000)*1000)
    }});

    return r
  }
  },
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        axios.get(url).then(response => this.hispesajes = response.data);
        this.gridData = this.ganancias(this.hispesajes)
  },
}
</script>

<template>
  <form id="search">
    Search <input name="query" v-model="searchQuery">
  </form>
  <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery">
  </DemoGrid>
</template>