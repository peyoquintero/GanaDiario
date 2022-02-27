<template>
  <div class="container">
    <section>
      <input name="fbCodigo" class="freeinput" v-model="filtroCodigo" placeholder="Codigo" style="width:80px;">
      <label>Fecha Inicial
        <select v-model="fechaInicial" class="freeinput">
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        <input type="checkbox" id="checkbox1" v-model="fiExacta" style="width:20px">
        <label for="checkbox1">=</label>
      </label>
      <label>Fecha Final
        <select v-model="fechaFinal" class="freeinput">
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        <input type="checkbox" id="checkbox2" v-model="ffExacta" style="width:20px">
        <label for="checkbox2">=</label>
      </label>
      <label>Marca</label>
      <input id="marca" class="freeinput" v-model="filtroMarca" placeholder="Marca">
      <label>Lote</label>
      <input id="lote" class="freeinput" v-model="filtroLote" placeholder="Lote">
      <button @click="applyFilters">Ok</button>
    </section>
    <div style="margin-top:5px"><span><strong>{{totals}}</strong></span></div>  
    <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :filter-key="searchQuery" style="margin-top:15px">
    </DemoGrid>
  </div>

</template>

<script>
import DemoGrid from './Grid.vue'

import axios from 'axios';
import { h } from '@vue/runtime-core';

export default {
  components: {
    DemoGrid
  },
  data() {return {
    searchQuery: '',
    gridColumns: ['Codigo','FechaInicial','FechaFinal','PesoInicial','PesoFinal','Ganancia'],
    gridData: [],
    hispesajes: [],
    fechasPesaje: [],
    fechaInicial : new Date('2020-01-01T00:00:00'),
    fiExacta: false,
    fechaFinal : new Date(),
    ffExacta: false,
    filtroLote: '*',
    filtroMarca: '*',
    filtroCodigo: ''
  }},
  computed: {
    totals()
    {
      let cleanData = this.gridData.filter(w=>(w.Ganancia>-1000 && w.Ganancia<2000 &&
      w.PesoInicial>0 && w.PesoFinal>0)) 
      let avgGd = Math.round(cleanData.reduce((ac,a) => a.Ganancia + ac,0)/this.gridData.length);
      let avgDias = Math.round(cleanData.reduce((ac,a) => a.Dias + ac,0)/this.gridData.length);
      let promUltPeso = this.median(cleanData.map(function(element){return element.PesoFinal}));
      let media =  this.median(cleanData.map(function(element){return element.Ganancia}));
      var texto = cleanData.length ? ` Cabezas:  ${this.gridData.length},   Ganancia Diaria:  ${avgGd},   Promedio Ultimo Peso:  ${promUltPeso}   Promedio dias:  ${avgDias}  Media: ${media??""}    (Excluye datos incompletos])`
                  : "No hay datos disponibles";
      return texto;
    }
  },
  methods: {
  median(arr)  {
    const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  applyFilters(event)
  {
    this.hispesajesFiltered = this.hispesajes.filter(pesaje=>pesaje.Lote!=='MUERTO') 
    if (this.filtroMarca!=="*")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Marca===this.filtroMarca) 
    }
    if (this.filtroLote!=="*")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Lote===this.filtroLote) 
    }
    if (this.filtroCodigo!="")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Codigo.startsWith(this.filtroCodigo)) 
    }
    this.gridData = this.ganancias(this.hispesajesFiltered,this.fechaInicial,this.fiExacta,this.fechaFinal,this.ffExacta)
  },  

  ganancias(hispesajes,fechaInicial,fiExacta,fechaFinal,ffExacta)
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
      datafilter = datafilter.filter(w=>w.Fecha>=fechaInicial&&w.Fecha<=fechaFinal)
      let minP = datafilter[0];
      let maxP = datafilter[datafilter.length-1];
      if (fiExacta)
      {
        minP = datafilter.find(w=>w.Fecha===fechaInicial)
      }
      if (ffExacta)
      {
        maxP = datafilter.find(w=>w.Fecha===fechaFinal)
      }

      let minMaxPesajes = [minP,maxP]
      let objresult = {Codigo: result.Codigo, pi: minMaxPesajes[0],pf: minMaxPesajes[1]};
      if((minP!==undefined)&&(maxP!==undefined)&&(maxP.Fecha>minP.Fecha)) 
      {minmaxPesajes.push(objresult)};
    });

    var datos = minmaxPesajes.map(w=> {return {"Codigo":w.Codigo,
    "FechaInicial":w.pi.Fecha,
    "FechaFinal":w.pf.Fecha,
    "PesoInicial":w.pi.Peso,
    "PesoFinal":w.pf.Peso,
    "Ganancia": Math.round((w.pf.Peso-w.pi.Peso)/ ((new Date(w.pf.Fecha)-new Date(w.pi.Fecha))/86400000)*1000),
    "Dias": Math.round((new Date(w.pf.Fecha)-new Date(w.pi.Fecha))/86400000)
    }});

    return datos
  }
  },
  mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/4";
        axios.get(url).then(response => {
                            this.hispesajes = response.data;
                            this.fechasPesaje = [...new Set( this.hispesajes.map(obj => obj.Fecha)) ];
                            this.fechaInicial = this.fechasPesaje[0]??this.fechaInicial
                            this.fechaFinal = this.fechasPesaje[this.fechasPesaje.length-1]??this.fechaFinal
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
  height:30px;
  margin-left: 5px;
}
</style>




