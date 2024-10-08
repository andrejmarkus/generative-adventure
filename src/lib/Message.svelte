<script>
    import { onDestroy } from 'svelte'
	import { tweened } from 'svelte/motion'
	import * as easingFns from 'svelte/easing'
	
    export let message;
    export let user = false;
	
	// let easingName = "linear"
	// let positionStore
	// let position = 0
	// let cleanup = null

    // onDestroy(() => {
	// 	if (cleanup) cleanup()
	// })
	
	// $: easing = easingFns[easingName]
	// $: {
	// 	if (cleanup) cleanup()
		
	// 	positionStore = tweened(0, {easing, duration: user ? 100 : 1000})
	// 	cleanup = positionStore.subscribe(val => position = val)
		
	// 	positionStore.set(message.length)
	// }
</script>

<p class="{user ? "opacity-50" : ""} text-wrap whitespace-pre py-3">&gt {message}</p>