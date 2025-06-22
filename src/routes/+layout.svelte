<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import "../app.css";
  import Navbar from "$lib/components/custom/navbar.svelte";
  import { navHeight } from "$lib/stores/store.svelte";
  import Meteors from "$lib/components/animated/meteors.svelte";
  import { Toaster } from "$lib/components/ui/sonner/index.js";

  let { children } = $props();
</script>

<Toaster richColors />
<div class="h-screen relative overflow-x-hidden">
  <Meteors number={50} />
  <ModeWatcher />
  <Navbar />
  <div style="padding-top: {navHeight.current}px; height: 100%;">
    {@render children()}
  </div>
</div>
