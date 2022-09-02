<template>
  <div class="container">
    <section>
      <label>Codigo
        <input style="display:block" name="fbCodigo" class="freeinput" v-model="filtroCodigo" placeholder="Codigo">
      </label>
      <label>Marca 
        <input style="display:block" id="marca" class="freeinputsmall" v-model="filtroMarca">
      </label>
      <label>Rango Peso 
        <input style="display:block" id="pesoI" class="freeinput" v-model="filtroPeso">
      </label>
      <label>Lote
        <select style="display:block" v-model="filtroLote" class="freeinput">
        <option v-for="option in lotes" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
      </label>
      <label style="margin-left:30px;">Fecha Inicial
        <select style="display:block; width:120px; height:30px" v-model="fechaInicial" >
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
      </label>
          <input style="margin-top:25px;" type="checkbox" id="checkbox1" v-model="fiExacta" >
          <label style="margin-top:30px;">=</label>
      <label>Fecha Final
        <select style=" display:block; width:120px; height:30px" v-model="fechaFinal" >
        <option v-for="option in fechasPesaje" v-bind:value="option" v-bind:key="option" style="background:lightgrey">
        {{ option }}
        </option>
        </select>
      </label>
        <input style="margin-top:25px;" type="checkbox" id="checkbox2" v-model="ffExacta" >
        <label style="margin-top:30px;">=</label>
      <label for="">Solo Ventas
        <input style="margin-top:25px;" type="checkbox" id="checkbox3" v-model="filtroVentas" >
      </label>
      <button @click="applyFilters">Ok</button>
    </section>
    <section class="totals">
      <item >{{resultCabezas}} </item> 
      <item>{{resultGanancia}}</item> 
      <item>{{resultMedia}}</item>   
      <item>{{resultUltPeso}}</item>
      <item>{{resultDias}}</item> 
    </section>
    <DemoGrid
    :data="gridData"
    :columns="gridColumns"
    :headers="gridHeaders"
    :headerwidthpct="gridHeaderwidthpct"
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
    gridColumns: ['Codigo','FechaInicial','FechaFinal','PesoInicial','PesoFinal','Ganancia','PesoHoy'],
    gridHeaders: ['Codigo','Inicio','Final','Peso(I)','Peso(F)','Ganancia','Peso Hoy'],
    gridHeaderwidthpct:[15,20,20,15,15,15],
    excludeChar: "",
    gridData: [],
    hispesajes: [],
    fechasPesaje: [],
    fechaInicial : new Date('2020-01-01T00:00:00'),
    fiExacta: false,
    fechaFinal : new Date(),
    ffExacta: false,
    filtroLote: '*',
    filtroMarca: '*',
    filtroPeso: '*',
    filtroCodigo: '',
    filtroVentas: false,
    lotes:[]
  }},
  computed: {
    cleanData()
    {
      return this.gridData.filter(w=>(w.Ganancia>-1000 && w.Ganancia<2000 && w.PesoInicial>0 && w.PesoFinal>0)) ;
    },
    resultCabezas()
    { var cabezas = this.cleanData.length>0 ? ` Cabezas: ${this.gridData.length}`: `No hay datos disponibles`;
      return cabezas;
    },
    resultGanancia()
    {
      let totalDias = this.cleanData.reduce((ac,a) => this.daysBetweenDates(a.FechaInicial,a.FechaFinal) + ac,0);
      let avgGd = Math.round(this.cleanData.reduce((ac,a) => (a.Ganancia*this.daysBetweenDates(a.FechaInicial,a.FechaFinal)) + ac,0)/totalDias);
      var ganancia = this.cleanData.length>0 ? `Ganancia(grs):  ${avgGd}`:"";
      return ganancia;
    },
    resultMedia()
    { let media =  this.median(this.cleanData.map(function(element){return element.Ganancia}));
      var mediana = this.cleanData.length>0 ? `Media: ${media??""} `: "";
      return mediana;
    },
    resultDias()
    { let avgDias = Math.round(this.cleanData.reduce((ac,a) => a.Dias + ac,0)/this.gridData.length);
      var dias = this.cleanData.length>0 ? `Dias:  ${avgDias}`: "";
      return dias;
    },
    resultUltPeso()
    { let promUltPeso = this.median(this.cleanData.map(function(element){return element.PesoFinal}));
      let labelPromUltPeso = promUltPeso>500? '' : `Prom. Ultimo Peso:  ${promUltPeso}`
      var ultpeso = this.cleanData.length>0 ? `${labelPromUltPeso}`: ""; 
      return ultpeso;
    },
  },
  methods: {
  median(arr)  {
    const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  },
  daysBetweenDates(fechaInicial,fechaFinal)
  {
    let fi = new Date(fechaInicial);
    let ff = new Date(fechaFinal);
    let diffTime = Math.abs(ff - fi);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays>0?diffDays:0;    
  },
  validLoteOptions(lotes)
  {
    lotes.push('*');
    return lotes.filter(w=>(w!=='NULL' && w!='MUERTO'))
  },
  applyFilters(event)
  {
    this.hispesajesFiltered = this.hispesajes.filter(pesaje=>pesaje.Lote!=='MUERTO') 
    if (this.filtroMarca!=="*" && this.filtroMarca!=="") 
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Marca.toLowerCase()===this.filtroMarca.toLowerCase()) 
    }
    if (this.filtroLote!=="*"&&this.filtroLote!=="")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Lote===this.filtroLote) 
    }
    if (this.filtroCodigo!="")
    {
      this.hispesajesFiltered = this.hispesajesFiltered.filter(pesaje=>pesaje.Codigo.toLowerCase().startsWith(this.filtroCodigo.toLowerCase())) 
    }

     this.gridData = this.ganancias(this.hispesajesFiltered,this.fechaInicial,this.fiExacta,this.fechaFinal,this.ffExacta,this.filtroVentas)

    if (this.filtroPeso!=="*" && this.filtroPeso.trim()!=="") 
    {
      const array=this.filtroPeso.split("-");
      if (array.length==2)
      { 
        this.gridData = this.gridData.filter(pesaje=>parseInt(pesaje.PesoInicial)>=parseInt(array[0]) && parseInt(pesaje.PesoInicial)<=parseInt(array[1]));
      } 
    }

     this.gridData = this.gridData.map(obj=> ({ ...obj, PesoHoy: this.pesoProyectado(obj.FechaFinal,new Date().toDateString(),obj.PesoFinal,obj.Ganancia) }))
  },  
  pesoProyectado(fechaInicial,fechaFinal,PesoInicial,gananciaDia)
  {
    return parseInt(PesoInicial) + Math.round(((new Date(fechaFinal)-new Date(fechaInicial))/86400000)*gananciaDia/1000);
  },
  gananciaDiaria(pesoInicial,pesoFinal)
  {
    return Math.round((pesoFinal.Peso-pesoInicial.Peso)/ ((new Date(pesoFinal.Fecha)-new Date(pesoInicial.Fecha))/86400000)*1000)
  },
  ganancias(hispesajes,fechaInicial,fiExacta,fechaFinal,ffExacta,filtroVentas)
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

    results = results.filter(result=>result.pesajes.length>1) // Excluir semovientes con un solo pesaje
    
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
      if (filtroVentas)
      {
              maxP = datafilter.find(w=>w.Operacion.toLowerCase()==="venta") 
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
    "Ganancia": this.gananciaDiaria(w.pi,w.pf),
    "Dias": Math.round((new Date(w.pf.Fecha)-new Date(w.pi.Fecha))/86400000)
    }});

    return datos
  }
  },
    mounted() {
        var url = "https://opensheet.elk.sh/1ZfXM4qnajw8QSaxrx6aXKa_xbMDZe3ryWt8E3alSyEE/1?key=AIzaSyCGW3gRbBisLX950bZJDylH-_QJTR7ogd8";
            axios.get(url).then(
              response => {
    console.log(response.data);
      this.hispesajes = response.data;
      this.fechasPesaje = [...new Set( this.hispesajes.map(obj => obj.Fecha)) ];
      this.fechaInicial = this.fechasPesaje[0]??this.fechaInicial;
      this.fechaFinal = this.fechasPesaje[this.fechasPesaje.length-1]??this.fechaFinal;
      this.lotes = this.validLoteOptions([...new Set( this.hispesajes.map(obj => obj.Lote))]);
      localStorage.setItem('hispesajes', JSON.stringify(this.hispesajes));
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
item{
  font-weight:normal;
  font-style: oblique;
  font-weight: bold;
  font-family: arial;
  color:darkslategrey;
}
label{
  font-family: arial;
  font-size:14px;
  font-weight: bold;
  margin: 5px;
}
.freeinput{
  width:80px;
  height:30px;
}
.freeinputsmall{
  width:50px;
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




