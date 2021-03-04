<script>
  import { getQuotes, onQuote } from "../api";

  let response = [];
  
  getQuotes().then((quotes) => response = quotes);
  onQuote((quote) => response = [...response, quote]);
</script>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    flex-direction: column-reverse;
    width: 100%;
    min-height: 100vh;
  }

  .message {
    width: 85%;
    margin: 0.7rem;
    padding: 1rem;
    position: relative;
    background-color: #f2f2f2;
    height: fit-content;
    border-radius: 3px;
  }


  .message-text {
    width: 100%;
    display: block;
    margin-bottom: 0.5rem;
  }

  .message-author {
    display: block;
    font-weight: 100;
    font-size: 1.5em;
  }

  .message-date {
    position: absolute;
    top: 5px;
    right: 5px;
    font-weight: 100;
    font-size: 0.75em;
  }

  .error {
    font-weight: 100;
  }
</style>

<div class="container">
  {#await response then messages}
    {#each messages as message}
      <div class="message" key={message.text}>
        <span class="message-date">
          {(new Date(message.date).toLocaleString('en-GB', { timeZone: 'UTC' }))}
        </span>
        <span class="message-text"><p />
          {message.text}</span>
        <span class="message-author"> - {message.author}</span>
      </div>
    {:else}
      <div class="message"><span class="error">Aucun dixit.</span></div>
    {/each}
  {:catch error}
    <div class="message"><span class="error">{error}</span></div>
  {/await}
</div>
