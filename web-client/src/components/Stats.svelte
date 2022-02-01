<script>
  import Chart from "svelte-frappe-charts";
  import {onDestroy} from "svelte";
  import { onQuote,offQuote,getQuotes, getAuthors } from "../api";

  getQuotes().then((quotes) => {
    let authorsMap = getAuthors(quotes);
    let authorsKeys = Array.from(authorsMap.keys());
    let authorsValues = Array.from(authorsMap.values());

    data.labels = authorsKeys;
    data.datasets[0].values = authorsValues;
  });

  function addAuthor(quote) {
    if (!data.labels.includes(quote.author)){
      data.labels = [...data.labels, quote.author];
      data.datasets[0].values = [...data.datasets[0].values, 1];
    }
    else{
      data.datasets[0].values[data.labels.indexOf(quote.author)] += 1;
    } 
  }

  onQuote(addAuthor);
  onDestroy(() => offQuote(addAuthor));
  let data = {
    labels: [],
    datasets: [
      {
        name: "# Quotes",
        type: "bar",
        values: [],
      },
    ],
  };
</script>

<div id="Chart" />
<Chart {data} type="bar" />
