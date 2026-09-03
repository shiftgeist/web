<script lang="ts">
import { ExternalLink, Image, Menu } from '@lucide/svelte'
import { onMount } from 'svelte'

type TrailerType = 'menu' | 'image' | 'link'

const iconMap: Record<TrailerType, typeof Menu> = {
  link: ExternalLink,
  image: Image,
  menu: Menu,
}

const sizeMap: Record<TrailerType, number> = {
  link: 6,
  image: 6,
  menu: 4,
}

let trailer: HTMLDivElement
let trailerType = $state<TrailerType | ''>('')

onMount(() => {
  function handleMouseMove(event: MouseEvent) {
    const interactive = (event.target as HTMLElement).closest(
      '.trailer-interact',
    ) as HTMLElement | null
    const interacting = interactive !== null

    const x = event.clientX - trailer.offsetWidth / 2
    const y = event.clientY - trailer.offsetHeight / 2
    const type = interacting
      ? (interactive.dataset.type as TrailerType)
      : undefined

    trailer.animate(
      {
        transform: `translate(${x}px, ${y}px) scale(${
          interacting ? sizeMap[type as TrailerType] : 1
        })`,
      },
      { duration: 800, fill: 'forwards' },
    )

    trailerType = type ?? ''
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<div
  id="trailer"
  bind:this={trailer}
  class="pointer-events-none fixed left-0 right-0 z-50 grid h-5 w-5 place-items-center rounded-full bg-teal-100 transition-opacity duration-500"
>
  {#if trailerType}
    {@const TrailerIcon = iconMap[trailerType]}
    <TrailerIcon class="absolute w-2 text-zinc-900" size={16} />
  {/if}
</div>
