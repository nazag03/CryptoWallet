<template>
  <div class="history-view">
    <h2>Historial de Transacciones</h2>
    <div class="content">
      <!-- Lista de transacciones -->
      <TransactionHistory :transactions="transactions" @transactionSelected="setSelectedTransaction" />

      <!-- Detalles de la transacción seleccionada -->
      <TransactionDetails v-if="selectedTransaction" :transaction="selectedTransaction" />
    </div>
  </div>
</template>

<script>
import TransactionHistory from "@/components/TransactionHistory.vue";
import TransactionDetails from "@/components/TransactionDetails.vue";

export default {
  components: {
    TransactionHistory,
    TransactionDetails,
  },

  data() {
    return {
      transactions: [
        { date: "2025-02-10", time: "14:30", type: "Compra", amount: 0.5, currency: "BTC", price: 45000, total: 22500 },
        { date: "2025-02-11", time: "09:15", type: "Venta", amount: 1, currency: "ETH", price: 3200, total: 3200 },
      ],
      selectedTransaction: null,
    };
  },
  methods: {
    setSelectedTransaction(transaction) {
      this.selectedTransaction = transaction;
    },
  },
};
</script>

<style scoped>
.history-view {
  padding: 20px;
}
.content {
  display: flex;
  gap: 20px;
}
</style>
