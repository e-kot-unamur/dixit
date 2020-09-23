<script>
  let response = [];

  setInterval(() => {
    response = fetch("http://localhost:8000/messages").then((res) =>
      res.json()
    );
  }, 1000);
</script>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    width: 100%;
    height: 100vh;
  }

  @media (max-width: 540px) {
    .message {
      flex-basis: 100%;
      background-color: #f2f2f2;
      width: 85%;
      height: fit-content;
      border-radius: 3px;
      margin: 0.7em;
      padding: 1em;
    }
  }

  @media (min-width: 540px) {
    .message {
      flex-basis: 25%;
      background-color: #f2f2f2;
      width: 50%;
      height: max-content;
      border-radius: 3px;
      margin: 0.7em;
      padding: 1em;
    }
  }

  .message-text {
    width: 100%;
    display: block;
  }

  .message-author {
    display: block;
    font-weight: 100;
    font-size: 1.5em;
  }

  .error {
    font-weight: 100;
  }
</style>

<div class="container">
  {#await response then messages}
    {#each messages as message}
      <div class="message" key={message.text}>
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
