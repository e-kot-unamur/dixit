<script>
    let author = '';
    let text = '';

    $: disabled = !author.trim() || !text.trim();

    async function handleSubmit(e) {
        await fetch('http://localhost:8000/messages', {
            method: 'POST',
            body: JSON.stringify({ author, text })
        });
        author = '';
        text = '';
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label>
        Auteur :
        <input bind:value={author}>
    </label>
    <label>
        Texte :
        <input bind:value={text}>
    </label>
    <button type="submit" {disabled}>
        Publier
    </button>
</form>