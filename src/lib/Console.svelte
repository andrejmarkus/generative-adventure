<script>
	import Message from "./Message.svelte";
    import { messages } from "$lib/stores/messages.js"

    let storedMessages = $messages;

    $: storedMessages.shift();
    
    // const scrollToBottom = () => {
    //     container.scrollTop = container.scrollHeight;
    // }
</script>

<form class="font-pixel-operator text-lg size-full flex flex-col items-stretch p-2 font">
    <div class="h-full flex flex-col overflow-y-auto">
        {#if storedMessages}
            {#each storedMessages as message, i}
                <Message message={message.content} user={i % 2 == 1} />
            {/each}
        {/if}
    </div>
    <input name="prompt" class="input bg-primary-content w-full" type="text">
</form>