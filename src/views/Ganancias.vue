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
    console.log('Entering gd hispesajes count:');
    console.log(hispesajes.length);

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

    console.log(results.length);
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
    "PesoInicial":w.pi.peso,
    "PesoFinal":w.pf.peso,
    "Ganancia": Math.round((w.pf.peso-w.pi.peso)/ ((new Date(w.pf.Fecha)-new Date(w.pi.Fecha))/86400000)*1000)
    }});

    console.log(results.length);

    return r
  }
  },
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        axios.get(url).then(response => {
                            this.hispesajes = response.data;
                            this.gridData = this.ganancias(this.hispesajes)
        });
        
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