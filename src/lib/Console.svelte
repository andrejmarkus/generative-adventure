<script>
	import Message from "./Message.svelte";

    export let messages = [];
    
    // const scrollToBottom = () => {
    //     container.scrollTop = container.scrollHeight;
    // }
</script>

<form method="post" class="font-pixel-operator text-lg size-full flex flex-col items-stretch p-4 font">
    <div class="h-full flex flex-col overflow-y-auto">
        {#if messages}
            {#each messages as message, i}
                <Message message={message.content} user={i % 2 == 1} />
            {/each}
        {/if}
    </div>
    <input name="prompt" class="input bg-primary-content w-full" type="text">
</form>