<template>
  <div class="transaction-history">
    <h3>Historial de Transacciones</h3>
    <ul>
      <li v-for="(transaction, index) in transactions" :key="index">
        <button @click="selectTransaction(transaction)">
          <strong>{{ transaction.dateTime }}</strong> <br>
          <strong>{{ transaction.type === 'buy' ? 'Compra' : 'Venta' }}</strong>: 
          {{ transaction.quantity }} {{ transaction.cryptoName }} <br>
          Precio: ${{ transaction.price }} USD | Total: ${{ transaction.total.toFixed(2) }} USD
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    transactions: Array,
  },
  methods: {
    selectTransaction(transaction) {
      this.$emit("transactionSelected", transaction);
    },
  },
};
</script>

<style scoped>
.transaction-history {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
button {
  width: 100%;
  text-align: left;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #f5f5f5;
}
</style>
