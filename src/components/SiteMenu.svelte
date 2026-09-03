<script lang="ts">
let menuOpen = $state(false)
</script>

<nav class="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-6">
  <button
    onclick={() => (menuOpen = !menuOpen)}
    data-type="menu"
    class="
      trailer-interact pointer-events-auto h-24 w-24 rounded-[50%] shadow-sm transition-all duration-300 ease-out hover:scale-125 hover:rounded-none hover:shadow-xl active:scale-90 {menuOpen
      ? 'bg-red-100 active:bg-red-600'
      : 'bg-teal-100 active:bg-teal-600'}
    "
  >
    &nbsp;
  </button>
</nav>
