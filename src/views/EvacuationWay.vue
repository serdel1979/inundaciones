<template>
  <n-layout embedded content-style="padding: 24px;">
    <l-map style="height: 700px; width: 95%" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <div v-for="(camino, index) in caminos" :key="`caminos-${index}`">
        <l-polyline :lat-lngs="camino.Coordenadas" :color="red" />
      </div>
      <div v-for="(punto, index) in puntos" :key="`puntos-${index}`">
        <l-marker :lat-lng="punto.latlong">
          <l-popup ref="popup">{{ punto.name }}</l-popup>
        </l-marker>
      </div>
    </l-map>
  </n-layout>

  <div>
    <h2>Zonas inundables</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripcion</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(camino, index) in caminos" :key="`caminos-${index}`">
          <td>{{ camino.name }}</td>
          <td>{{ camino.descripcion }}</td>
          <td>
            <a v-bind:href="url">Ver</a>
          </td>
        </tr>
      </tbody>
    </table>
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
      <button v-on:click="anterior('anterior')">&#171;</button>
      <button v-on:click="siguiente('siguiente')">&#187;</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  LMap,
  LTileLayer,
  LPolyline,
  LMarker,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import { NLayout } from "naive-ui";

export default {
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LMarker,
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
      caminos: [],
      name: "",
      descripcion: "",
      gettingLocation: false,
      puntos: [],
      pageActual: 0,
      pageActualPuntos: 0,
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
      .get(
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/recorridos-evacuacion/"
      )
      .then((response) => {
        this.caminos = response.data.Recorridos;
        this.name = response.data.name;
        this.descripcion = response.data.descripcion;
      })
      .catch((e) => {
        this.errors.push(e);
      });
    axios
      .get(
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/puntos-encuentro/"
      )
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
        this.pageActual -= 1;
        var pag = String(this.pageActual);
        var url =
          "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/recorridos-evacuacion/?page=" +
          pag;
        axios
          .get(url)
          .then((response) => {
            this.caminos = response.data.Recorridos;

          })
          .catch((e) => {
            this.pageActual = 1;
            this.errors.push(e);
          });
      }
      if (this.pageActualPuntos > 1) {
        this.pageActualPuntos -= 1;
        var pagp = String(this.pageActualPuntos);
        var urlp =
          "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/puntos-encuentro/?page=" +
          pagp;
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
    siguiente: function () {
      this.pageActual += 1;
      var pag = String(this.pageActual);
      var url =
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/recorridos-evacuacion/?page=" +
        pag;
      console.log(url);
      axios
        .get(url)
        .then((response) => {
          this.caminos = response.data.Recorridos;
        })
        .catch((e) => {
          this.pageActual -= 1;
          this.errors.push(e);
        });

      this.pageActualPuntos += 1;
      var pagp = String(this.pageActualPuntos);
      var urlp =
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/puntos-encuentro/?page=" +
        pagp;
      axios
        .get(urlp)
        .then((response) => {
          this.puntos = response.data.Puntos_encuentro;
        })
        .catch((e) => {
          this.pageActualPuntos -= 1;
          this.errors.push(e);
        });
    },
  },
};
</script>