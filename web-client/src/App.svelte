<script>
  import Tabs from "./components/Tabs.svelte";
  import Form from "./components/Form.svelte";
  import Messages from "./components/Messages.svelte";
  import Stats from "./components/Stats.svelte";

  let items = [
    {
      label: "Messages",
      value: 1,
      component: Messages
    },
    {
      label: "Statistiques",
      value: 2,
      component: Stats
    }
  ]
</script>

<main>
  <Form/>
  <Tabs {items}/>
</main>

<style>
  main {
    margin: auto;
    max-width: 35rem;
  }
</style>
