<script>
import SidebarLink from "./SidebarLink"
import { collapsed, toggleSidebar, sidebarWidth } from "./state"

export default {
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth }
  }
}
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <h1>
      <span v-if="collapsed">
        <div>M</div>
      </span>
      <span v-else>Menu</span>
    </h1>

    <SidebarLink to="/" icon="cube">Home</SidebarLink>
    <SidebarLink to="/sobre-nosotros">Sobre Nosotros</SidebarLink>
    <SidebarLink to="/denuncias">Denuncias</SidebarLink>
    <SidebarLink to="/zonas-inundables">Zonas Inundables</SidebarLink>
    <SidebarLink to="/recorridos-evacuacion">Evacuacion</SidebarLink>
    <SidebarLink to="/gestion">Gestion Ayuda</SidebarLink>
    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left" />
    </span>
  </div>
</template>



<style>
:root {
  --sidebar-bg-color: #212221;
  --sidebar-item-hover: #292c2a;
  --sidebar-item-active: #313533;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar h1 {
  height: 2.5em;
}
.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
}
.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>