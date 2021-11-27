<template>
  <n-layout embedded content-style="padding: 24px;">
 <n-space vertical justify="center">
   <h1 >Ingresa los datos del riesgo:</h1>
    <label for="">titulo</label>
    <input placeholder="titulo" v-model.trim="title" type="text">
    <label for="">descripcion</label>
    <textarea placeholder="descripcion" v-model.trim="desc" type="text"></textarea>
    <label for="">categoría</label>
    <select v-model="category">
      <option v-for="option in categories" v-bind:value="option.value" v-bind:key="option.value">
        {{ option.text }}
      </option>
    </select>
    <h1 for="">Escoja la direccion en el mapa:</h1>
    <l-map style="height: 400px; width:50%; margin: 0 auto;" :zoom="zoom" :center="center" @click="onClick">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="markerLatLng"></l-marker>
  </l-map>
  </n-space>
  <h1 for="">Ingresa tus datos:</h1><br>
  <n-space horizontal justify="center">
    <label for="">nombre</label>
    <input placeholder="nombre" v-model.trim="name" type="text">
    <label for="">apellido</label>
    <input placeholder="apellido" v-model.trim="surname" type="text">
    <label for="">email</label>
    <input placeholder="email" v-model.trim="email" type="email">
    <label for="">telefono</label>
    <input placeholder="telefono" v-model.trim="phone" type="text">
  </n-space> 
  <br>
  <n-space horizontal justify="center">
  <button @click="save">Guardar</button>
  </n-space>
  </n-layout>
</template>

<script>
import {LMap, LTileLayer, LMarker} from '@vue-leaflet/vue-leaflet';
import { NLayout, NSpace } from 'naive-ui'


export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    NLayout,
    NSpace
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 14,
      center: [-34.9187, -57.956],
      markerLatLng: [-34.9187, -57.956],
      categories: {},
      title: '',
      name: '', 
      surname: '',
      category: '',
      desc: '',
      phone: '',
      email: '',
      gettingLocation: false,
      errorStr:null
    };
  },
  mounted() {

    if(!("geolocation" in navigator)) {
      this.errorStr = 'Geolocación no esta disponible.';
      return;
    }
    this.gettingLocation = true;
    // get position
    navigator.geolocation.getCurrentPosition(pos => {
      this.gettingLocation = false;
      this.center = pos;
    }, err => {
      this.gettingLocation = false;
      this.errorStr = err.message;
    })
    fetch('https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/categories')
    .then(response => response.json())
    .then(data => {this.categories = data;
    console.log(this.categories)})
    .catch(e =>
      console.log(e)
    );

  },
  methods: {
      onClick({latlng}){
          if (latlng) {
              this.markerLatLng = latlng
          }
      },
      save(){
        const url = "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/denuncias/"
        const denuncia = {
          'title': this.title,
          'desc': this.desc,
          'latitude': `${this.markerLatLng.lat ? this.markerLatLng.lat : this.markerLatLng[0]}`,
          'longitude': `${this.markerLatLng.lng ? this.markerLatLng.lng : this.markerLatLng[1]}`,
          'name': this.name,
          'surname': this.surname,
          'phone': this.phone,
          'email': this.email,
          'category': this.category
        };
        const request = new Request(url, {
          method: 'POST',
          body: JSON.stringify(denuncia),
          headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8"'
          })
        });

        fetch(request)
        .then(res => {
            if (!res.ok) throw res;
            return res.json()
        })
        .then(res => {console.log(JSON.stringify(res));
                      alert(`Se ha recibido su denuncia ${this.title} exitosamente`)
                      })
        .then(() => this.$router.push('/'))
        .catch(e => { e.json()
                      .then((body) => {
                              alert(`Hay errores:${JSON.stringify(body)}`)
                          }
                    );
        });
      } 
  }
}
</script>
