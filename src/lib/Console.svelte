<script>
	import Message from "./Message.svelte";
    import { page } from '$app/stores';
	import { onMount } from "svelte";

    export let messages = [];

    let prompt;
    let loading = false;
    let result = '';
    let scrollToDiv;

    onMount(async () => {
        if (messages.length == 1) {
            loading = true;
            const response = await fetch(`/api/app/${$page.params.slug}/init`, {
                method: 'POST'
            });
            
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    loading = false;
                    break;
                }
                result += value;
            }
            messages = [...messages, {
                role: "assistant",
                content: result
            }];
            result = "";

            await updateDatabase();
        }
    });

    const handleSubmit = async () => {
        loading = true;
        messages = [...messages, { role: 'user', content: prompt }];

        const response = await fetch('/api/app/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        prompt = "";

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                loading = false; 
                break;
            }
            result += value;
            scrollToBottom();
        }
        messages = [...messages, {
            role: "assistant",
            content: result
        }];
        result = "";
        
        await updateDatabase();
        scrollToBottom();
    }

    const updateDatabase = async () => {
        await fetch(`/api/app/${$page.params.slug}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });
    }
    
    const scrollToBottom = () => {
        setTimeout(() => {
            scrollToDiv.scrollIntoView({ behaviour: 'smooth', block: 'end', inline: 'nearest' });
        }, 100);
    }
</script>

<div class="font-pixel-operator text-lg size-full flex flex-col items-stretch p-4">
    <div class="h-full flex flex-col overflow-y-auto">
        {#if messages}
            {#each messages.slice(1) as message, i}
                <Message message={message.content} user={i % 2 == 1} />
            {/each}
        {/if}
        {#if loading}
            <Message message={result} user={false} />
        {/if}
        <div bind:this={scrollToDiv}></div>
    </div>
    <form method="post" on:submit|preventDefault={handleSubmit}>
        <input bind:value={prompt} name="prompt" class="input bg-primary-content w-full" type="text">
    </form>
</div>