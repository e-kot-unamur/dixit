<script>
  import Switch from "./Switch.svelte";
  import { onDestroy } from "svelte";
  import { offQuote, onQuote, postQuote, getQuotes, getAuthors } from "../api";

  let response = [];
  getQuotes().then((quotes) => {
    let authorsMap = getAuthors(quotes);
    response = Array.from(authorsMap.keys());
  });

  function addAuthor(quote) {
    if (!response.includes(quote.author)) {
      response = [...response, quote.author];
    }
  }

  onQuote(addAuthor);
  onDestroy(() => offQuote(addAuthor));
  let new_author = false;
  let author = "";
  let text = "";
  let context = "";

  $: disabled = !author.trim() || !text.trim();

  async function handleSubmit(e) {
    postQuote(text, author, context);
    author = "";
    text = "";
    context = "";
  }
</script>

<div class="container">
  <h1>Dixit</h1>
  <form on:submit|preventDefault={handleSubmit}>

    Ajouter nouvel auteur<br />
    <Switch bind:checked={new_author} />

    {#if new_author === false}
      {#await response then authorsList}
        <label>Auteur : <br/> 
          <select bind:value={author}>
            {#each authorsList as author}
              <option value={author}> {author} </option>
            {/each}</select></label>

      {:catch error}
        <div class="message"><span class="error">{error}</span></div>
      {/await}

    {:else}
      <label> Auteur : <input bind:value={author} /> </label>
    {/if}

    <label> Contexte : <input bind:value={context} /> </label>
    <label> Texte : <textarea id="author-input" bind:value={text} /> </label>
    <button type="submit" {disabled}> Publier </button>
  </form>
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
  }

  h1 {
    flex-basis: 100%;
    text-align: center;
    font-weight: 100;
    margin-top: 5vh;
    margin-bottom: 10vh;
  }

  form {
    padding: 20px;
    background-color: #f2f2f2;
    width: 65vw;
  }

  input,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-top: 6px;
    margin-bottom: 16px;
  }

  select,
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-top: 6px;
    margin-bottom: 16px;
  }
  textarea {
    height: 30vh;
  }

  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 60px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
