<template>
  <n-layout embedded content-style="padding: 24px;">
    <l-map style="height: 700px; width: 95%" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <div v-for="(zona, index) in zonas" :key="`zonas-${index}`">
        <l-polygon
          :lat-lngs="[zona.Coordenadas]"
          :color="zona.colour"
          :fill="true"
          :fillColor="zona.colour"
          :fillOpacity="0.5"
        />
      </div>
      <div v-for="(punto, index) in puntos" :key="`puntos-${index}`">
        <l-marker :lat-lng="punto.latlong">
          <l-popup ref="popup">{{ punto.name }}</l-popup>
        </l-marker>
      </div>
     
    </l-map>
  </n-layout>
  <div>
    <h2>Zonas de inundación</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(zona, index) in zonas" :key="`zonas-${index}`">
          <td>{{ zona.name }}</td>
          <td>
            <router-link to="/detalle-zona/`zona.id`">ver</router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="pages">
      <button v-on:click="anterior()">&#171;</button>
      <button v-on:click="siguiente()">&#187;</button>
    </div>
    <h2>Puntos de encuentro</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(punto, index) in puntos" :key="`puntos-${index}`">
          <td>{{ punto.name }}</td>
          <td>{{ punto.descripcion }}</td>
        </tr>
      </tbody>
    </table>
    <div id="pages">
      <button v-on:click="panterior()">&#171;</button>
      <button v-on:click="psiguiente()">&#187;</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolygon,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import { NLayout } from "naive-ui";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LPopup,
    NLayout,
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 14,
      center: [-34.9187, -57.956],
      puntos: [],
      zonas: [],
      pageActual: 0,
      pageActualPuntos: 0,
      puntosSiguiente: true,
      zonasSiguientes: true,
      errors: [],
    };
  },
  mounted() {
    if (!("geolocation" in navigator)) {
      this.errorStr = "Geolocación no esta disponible.";
      return;
    }
    this.gettingLocation = true;
    // get position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.gettingLocation = false;
        this.center = [pos.coords.latitude,pos.coords.longitude];
        console.log(this.center);
      },
      (err) => {
        this.gettingLocation = false;
        this.errorStr = err.message;
      }
    );
  },
  created() {
    axios
      .get("http://localhost:5000/api/zonas-inundables")
      .then((response) => {
        this.zonas = response.data.Zonas;
        this.pageActual = response.data.Pagina;
      })
      .catch((e) => {
        this.errors.push(e);
      });
    axios
      .get("http://localhost:5000/api/puntos-encuentro/")
      .then((response) => {
        this.puntos = response.data.Puntos_encuentro;
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },
  methods: {
    anterior: function () {
      if (this.pageActual > 1) {
        this.zonasSiguientes = true;
        this.pageActual -= 1;
        var pag = String(this.pageActual);
        var url = "http://localhost:5000/api/zonas-inundables/?page=" + pag;
        axios
          .get(url)
          .then((response) => {
            this.zonas = response.data.Zonas;
          })
          .catch((e) => {
            this.pageActual = 1;
            this.errors.push(e);
          });
      }
    },
    siguiente: function () {
      if (this.zonasSiguientes) {
        this.pageActual += 1;
        var pag = String(this.pageActual);
        var url = "http://localhost:5000/api/zonas-inundables/?page=" + pag;
        axios
          .get(url)
          .then((response) => {
            this.zonas = response.data.Zonas;
          })
          .catch((e) => {
            this.pageActual -= 1;
            this.zonasSiguientes = false;
            this.errors.push(e);
          });
      }
    },
    panterior: function () {
      if (this.pageActualPuntos > 1) {
        this.puntosSiguiente = true;
        this.pageActualPuntos -= 1;
        var pagp = String(this.pageActualPuntos);
        var urlp = "http://localhost:5000/api/puntos-encuentro/?page=" + pagp;
        axios
          .get(urlp)
          .then((response) => {
            this.puntos = response.data.Puntos_encuentro;
          })
          .catch((e) => {
            this.pageActualPuntos = 1;
            this.errors.push(e);
          });
      }
    },
    psiguiente: function () {
      if (this.puntosSiguiente) {
        this.pageActualPuntos += 1;
        var pagp = String(this.pageActualPuntos);
        var urlp = "http://localhost:5000/api/puntos-encuentro/?page=" + pagp;
        axios
          .get(urlp)
          .then((response) => {
            this.puntos = response.data.Puntos_encuentro;
          })
          .catch((e) => {
            this.puntosSiguiente = false;
            this.pageActualPuntos -= 1;
            this.errors.push(e);
          });
      }
    },
  },
};
</script>