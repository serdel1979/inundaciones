<template>
  <n-layout embedded content-style="padding: 24px;">
    <l-map style="height: 700px; width: 95%" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <div v-for="(camino, index) in caminos" :key="`caminos-${index}`">
        <l-polyline :lat-lngs="camino.Coordenadas" :color='red' />
      </div>
      <div v-for="(punto, index) in puntos" :key="`puntos-${index}`">
        <l-marker :lat-lng="punto.latlong">
          <l-popup ref="popup">{{ punto.name }}</l-popup>
        </l-marker>
      </div>
    </l-map>
  </n-layout>

  <div>
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
            <a v-bind:href=(url)>Ver</a>
          </td>
        </tr>
      </tbody>
    </table>
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
      markerLatLng: [-34.9187, -57.956],
      caminos: [],
      name: "",
      descripcion: "",
      gettingLocation: false,
      puntos: [],
      errors: [],
    };
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
};
</script>