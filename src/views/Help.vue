<template>
<n-layout embedded content-style="padding: 24px;">
  <l-map style="height: 700px" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="markerLatLng"></l-marker>
  </l-map>
</n-layout>
</template>

<script>
import {LMap, LTileLayer, LMarker} from '@vue-leaflet/vue-leaflet';
import { NLayout } from "naive-ui"
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    NLayout
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 14,
      center: [-34.9187, -57.956],
      markerLatLng: [-34.9187, -57.956],
      gettingLocation: false,
      errorStr:null
    };
  },
    created() {
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

  },
}
</script>
