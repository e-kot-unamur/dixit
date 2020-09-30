<script>
  import { postQuote } from "../api";

  let author = "";
  let text = "";

  $: disabled = !author.trim() || !text.trim();

  async function handleSubmit(e) {
    postQuote(text, author);
    author = "";
    text = "";
  }
</script>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
    height: 100vh;
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

<div class="container">
  <h1>Dixit</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <label> Auteur : <input bind:value={author} /> </label>
    <label> Texte : <textarea id="author-input" bind:value={text} /> </label>
    <button type="submit" {disabled}> Publier </button>
  </form>
</div>
