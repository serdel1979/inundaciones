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
      <l-marker :lat-lng="markerLatLng"> </l-marker>
    </l-map>
  </n-layout>
  <div>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(zona, index) in zonas" :key="`zonas-${index}`">
          <td>{{ zona.name }}</td>
          <td>
            <router-link to="/detalle-zona/{{zona.id}}">ver</router-link>
          </td>
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
      markerLatLng: [-34.9187, -57.956],
      puntos: [],
      zonas: [],
      pageActual: 0,
      pageActualPuntos: 0,
      errors: [],
    };
  },
  created() {
    axios
      .get(
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/zonas-inundables"
      )
      .then((response) => {
        this.zonas = response.data.Zonas;
        this.pageActual = response.data.Pagina;
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
          "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/zonas-inundables/?page=" +
          pag;
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
        "https://admin-grupo2.proyecto2021.linti.unlp.edu.ar/api/zonas-inundables/?page=" +
        pag;
      axios
        .get(url)
        .then((response) => {
          this.zonas = response.data.Zonas;
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