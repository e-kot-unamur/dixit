<script>
	import Form from './Form.svelte';
	
	let response = [];

	setInterval(() => {
		response =
			fetch('http://localhost:8000/messages')
			.then(res => res.json());
	}, 1000);
</script>

<Form />

{#await response then messages}
	{#each messages as message}
		<p><b>{message.author}</b>: {message.text}</p>
	{:else}
		<p><i>Aucun message.</i></p>
	{/each}
{:catch error}
	<p>{error}</p>
{/await}