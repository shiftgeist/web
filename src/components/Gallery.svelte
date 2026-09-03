<script lang="ts">
import { onMount } from 'svelte'

const loops = ['a', 'b', 'c', 'd']
const cells = Array.from({ length: 6 }, (_, i) => i + 1)

let gridContainer: HTMLDivElement
let colSpacesBottom: number[] = []

function findBottomSpace() {
  for (const [index, col] of [...gridContainer.children].entries()) {
    const lastElement = col.children[col.children.length - 1] as HTMLElement
    colSpacesBottom[index] = gridContainer.offsetHeight
      - (lastElement.offsetTop + lastElement.offsetHeight)
  }
}

function calculateScrollPercent() {
  const bch = document.documentElement.clientHeight
  const bst = document.documentElement.scrollTop
  const bsh = document.documentElement.scrollHeight
  return bst / (bsh - bch)
}

function setSpaceBottom() {
  const scrollPercent = calculateScrollPercent()

  for (const [index, col] of [...gridContainer.children].entries()) {
    const spaceToBottom = colSpacesBottom[index]

    if (spaceToBottom) {
      ;(col as HTMLElement).style.marginTop = `${
        (spaceToBottom * scrollPercent).toFixed()
      }px`
    }
  }
}

function handleMouseMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
  target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
}

onMount(() => {
  const timer = setTimeout(findBottomSpace, 1000)
  window.addEventListener('scroll', setSpaceBottom)
  return () => {
    clearTimeout(timer)
    window.removeEventListener('scroll', setSpaceBottom)
  }
})
</script>

<div class="grid grid-cols-4 gap-clamp" bind:this={gridContainer}>
  {#each loops as loop (loop)}
    <div class="flex flex-col gap-clamp">
      {#each cells as i (i)}
        <div
          onmousemove={handleMouseMove}
          data-type="image"
          class="trailer-interact relative bg-center bg-[length:100%] transition-[all,background-size] duration-400 before:absolute before:inset-0 before:z-10 before:h-full before:w-full before:opacity-0 before:transition-opacity before:duration-500 hover:bg-[length:105%] before:hover:opacity-100"
          style={`background-image: url('https://picsum.photos/seed/${loop}${i}/600/600')`}
        >
          <img
            src={`https://picsum.photos/seed/${loop}${i}/600/600`}
            class="invisible"
            alt=""
          />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
[data-type="image"]::before {
  background: radial-gradient(
    800px circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.1),
    transparent 40%
  );
}
</style>
