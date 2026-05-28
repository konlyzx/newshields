<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { Toaster } from 'svelte-sonner';
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import ColorBends from '$lib/components/core/ColorBends.svelte';
  import { initSmoothScroll } from '$lib/utils/smooth-scroll';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

  injectSpeedInsights();

  let { children } = $props();

  const isAppShell = $derived($page.url.pathname.startsWith('/create'));
  const isHome = $derived($page.url.pathname === '/');
  const transitionKey = $derived(isAppShell ? 'app' : 'site');

  onMount(() => initSmoothScroll());
</script>

<svelte:head>
  <title>New Shields</title>
</svelte:head>

<div class="relative min-h-screen">
  {#if isHome}
    <ColorBends />
  {/if}

  {#if !isAppShell}
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute inset-0 dot-bg opacity-70"></div>
      <div class="absolute inset-0 grid-bg opacity-30"></div>
      <div class="absolute left-1/2 top-[-10%] h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-violet-500/12 blur-[140px]"></div>
      <div class="absolute right-[-10%] top-1/4 h-[500px] w-[700px] rounded-full bg-cyan-500/8 blur-[140px]"></div>
      <div class="absolute bottom-[-10%] left-[-10%] h-[500px] w-[700px] rounded-full bg-fuchsia-500/8 blur-[140px]"></div>
      <div class="light-ray right-0 top-0 h-[420px] w-[420px] md:h-[640px] md:w-[640px] opacity-60"></div>
    </div>
    <Navbar />
  {/if}

  {#key transitionKey}
    <main class="relative overflow-x-hidden" in:fade={{ duration: 300, delay: 150 }} out:fade={{ duration: 150 }}>
      {@render children()}
    </main>
  {/key}

  {#if !isAppShell}
    <Footer />
  {/if}

  <Toaster
    theme="dark"
    position="bottom-right"
    richColors
    toastOptions={{
      style: 'background: rgba(20,20,24,0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); color: white;'
    }}
  />
</div>
