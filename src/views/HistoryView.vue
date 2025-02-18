<template>
  <div class="history-container">
    <h1>Historial de Transacciones</h1>
    <div v-if="walletStore.transactions.length === 0">
      <p>No hay transacciones registradas.</p>
    </div>
    <div v-else class="transactions-list">
      <div v-for="(transaction, index) in walletStore.transactions" :key="index" class="transaction-card">
        <p><strong>Fecha y Hora: {{ transaction.dateTime }}</strong></p>
        <p><strong>Criptomoneda: {{ transaction.cryptoName }}</strong></p>
        <p>Tipo: {{ transaction.type === 'buy' ? 'Compra' : 'Venta' }}</p>
        <p>Cantidad: {{ transaction.quantity }}</p>
        <p>Precio Unitario: ${{ transaction.price }} USD</p>
        <p>Precio Total: ${{ transaction.total.toFixed(2) }} USD</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWalletStore } from '@/store/useWalletStore';

const walletStore = useWalletStore();
</script>

<style scoped>
.history-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.transactions-list {
  margin-top: 20px;
}

.transaction-card {
  background: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
