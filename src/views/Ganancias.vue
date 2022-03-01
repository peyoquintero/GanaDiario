<template>
  <div class="container">
    <section>
      <label >Codigo
        <input style="display:block" name="fbCodigo" class="freeinput" v-model="filtroCodigo" placeholder="Codigo"></label>
      <label>Marca 
        <input style="display:block" id="marca" class="freeinputsmall" v-model="filtroMarca"></label>
      <label>Lote
        <select style="display:block" v-model="filtroLote" class="freeinput">
        <option v-for="option in lotes" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        </label>
        <label>Fecha Inicial
        <select style="display:block; width:120px; height:30px" v-model="fechaInicial" >
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
        </label>
          <input style="margin-top:35px;" type="checkbox" id="checkbox1" v-model="fiExacta" >
          <label style="margin-top:30px;">=</label>
      <label>Fecha Final
        <select style=" display:block; width:120px; height:30px" v-model="fechaFinal" >
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
      </label>
      <input style="margin-top:35px;" type="checkbox" id="checkbox2" v-model="ffExacta" >
      <label style="margin-top:30px;">=</label>
      <button @click="applyFilters">Ok</button>
    </section>
    <div style="margin-top:5px"><span><strong>{{totals}}</strong></span></div>  
    <div>
    <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :headers="gridHeaders"
    :headerwidthpct="gridHeaderwidthpct"
    :filter-key="searchQuery" style="margin-top:15px">
    </DemoGrid>
  </div>
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
    gridHeaders: ['Codigo','Inicio','Final','Peso(I)','Peso(F)','Ganancia'],
    gridHeaderwidthpct:[15,20,20,15,15,15],
    gridData: [],
    hispesajes: [],
    fechasPesaje: [],
    fechaInicial : new Date('2020-01-01T00:00:00'),
    fiExacta: false,
    fechaFinal : new Date(),
    ffExacta: false,
    filtroLote: '*',
    filtroMarca: '*',
    filtroCodigo: '',
    lotes:[]
  }},
  computed: {
    totals()
    {
      console.log('Recalc lotas');
      let cleanData = this.gridData.filter(w=>(w.Ganancia>-1000 && w.Ganancia<2000 &&
      w.PesoInicial>0 && w.PesoFinal>0)) 
      let avgGd = Math.round(cleanData.reduce((ac,a) => a.Ganancia + ac,0)/this.gridData.length);
      let avgDias = Math.round(cleanData.reduce((ac,a) => a.Dias + ac,0)/this.gridData.length);
      let promUltPeso = this.median(cleanData.map(function(element){return element.PesoFinal}));
      let labelPromUltPeso = promUltPeso>500? '' : `Promedio Ultimo Peso:  ${promUltPeso}`
      let media =  this.median(cleanData.map(function(element){return element.Ganancia}));
      var texto = cleanData.length>0 ? ` Cabezas: ${this.gridData.length}, Ganancia(grs):  ${avgGd}, Media: ${media??""}  Dias:  ${avgDias}  ${labelPromUltPeso}` : `No hay datos disponibles`;
      return texto;
    }
  },
  methods: {
  median(arr)  {
    const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  validLoteOptions(lotes)
  {
    lotes.push('*');
    return lotes.filter(w=>(w!=='NULL' && w!='MUERTO'))
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
        try{
        axios.get(url).then(response => {
                            this.hispesajes = response.data;
                            this.fechasPesaje = [...new Set( this.hispesajes.map(obj => obj.Fecha)) ];
                            this.fechaInicial = this.fechasPesaje[0]??this.fechaInicial;
                            this.fechaFinal = this.fechasPesaje[this.fechasPesaje.length-1]??this.fechaFinal;
                            this.lotes = this.validLoteOptions([...new Set( this.hispesajes.map(obj => obj.Lote))]);
                                  localStorage.setItem('hispesajes', JSON.stringify(this.hispesajes));
        });
        }
        catch{
          this.hispesajes = JSON.parse(localStorage.getItem('hispesajes'));
        }
  },
}
</script>

<style>
.container {
  display:flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  margin:0%;
}
section {
  display: flex;
  align-items:center;
  border-radius: 5px;
  border-width:2px;
  border-style:solid;
  border-color:lightgray;
  justify-content: center;
  width:100%;
}
label{
  font-size:14px;
  font-weight: bold;
  margin: 0.2rem;
}
.freeinput{
  margin-left:5px;
  width:80px;
  height:30px;
}
.freeinputsmall{
  margin-left:5px;
  width:30px;
  height:30px;
}
button{
  border: 2px solid #42b983;
  background: #42b983;
  color:white;
  width:40px;
  height:40px;
  margin-top:25px;
  margin-right: 5px;
  border-radius: 5px;
}
</style>




