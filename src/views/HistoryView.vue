<template>
  <div class="history-container">
    <h1>Historial de Transacciones</h1>

    <!-- Mensaje si no hay transacciones -->
    <div v-if="walletStore.transactions.length === 0">
      <p>No hay transacciones registradas.</p>
    </div>

    <!-- Listado de transacciones -->
    <div v-else class="transactions-list">
      <TransactionHistory
        :transactions="walletStore.transactions"
        @transactionSelected="selectTransaction"
      />
    </div>

    <!-- Detalles de la transacción seleccionada -->
    <TransactionDetails
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @editTransaction="editTransaction"
      @deleteTransaction="deleteTransaction"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';
import TransactionDetails from '@/components/TransactionDetails.vue';
import TransactionHistory from '@/components/TransactionHistory.vue';

const walletStore = useWalletStore();
const selectedTransaction = ref(null);

// Seleccionar una transacción al hacer clic
const selectTransaction = (transaction) => {
  selectedTransaction.value = transaction;
};

// Función para editar la transacción
const editTransaction = (transaction) => {
  walletStore.editTransaction(transaction);
  selectedTransaction.value = null; // Limpiar la selección
};

// Función para eliminar la transacción
const deleteTransaction = (transaction) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
    walletStore.removeTransaction(transaction.transactionId); // Corregido
    selectedTransaction.value = null; // Limpiar la selección
  }
};
</script>

<style scoped>
.history-container {
  padding: 20px;
}
.transactions-list {
  margin-bottom: 20px;
}
</style>
