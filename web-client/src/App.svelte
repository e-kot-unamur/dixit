<script>
  import Tabs from "./components/Tabs.svelte";
  import Form from "./components/Form.svelte";
  import Messages from "./components/Messages.svelte";
  import Stats from "./components/Stats.svelte";
  import { checkPass, checkPassword } from "./api";

  let show;

  function setShow(state){

    if (state){
      show = state;
      let temp = document.getElementById("temp");
      temp.remove();
    }
  }

  
  checkPass(setShow)

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
  <div id="temp">
    <div class="container">
      <h1>Dixit</h1>
        <div class = "card">

        
          <label> Password : <input id="pwd" type="password" on:input={checkPassword}/> </label>
        </div>
    </div>
  </div>
  {#if show}
    <Form/>
    <Tabs {items}/>
  {/if}
</main>

<style>
  main {
    margin: auto;
    max-width: 35rem;
  }
.container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    align-content: flex-start;
    width: 100%;
  }
.card{
    padding: 20px;
    background-color: #f2f2f2;
    width: 65vw;
}
  h1 {
  flex-basis: 100%;
  text-align: center;
  font-weight: 100;
  margin-top: 5vh;
  margin-bottom: 10vh;
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
</style>