<script setup>
import { defineProps, defineEmits } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';

const props = defineProps({
  transaction: Object
});

const emit = defineEmits(['editTransaction', 'deleteTransaction']);

const walletStore = useWalletStore();

// Función para editar la transacción
const editTransaction = () => {
  emit('editTransaction', props.transaction);
};

// Función para eliminar la transacción
const deleteTransaction = () => {
  if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
    walletStore.removeTransaction(props.transaction.transactionId);  // Corregido
  }
};
</script>

<template>
  <div class="transaction-details">
    <h3>Detalles de la Transacción</h3>
    <p><strong>ID:</strong> {{ transaction.transactionId }}</p>
    <p><strong>Tipo:</strong> {{ transaction.type }}</p>
    <p><strong>Criptomoneda:</strong> {{ transaction.cryptoName }}</p>
    <p><strong>Cantidad:</strong> {{ transaction.quantity }}</p>
    <p><strong>Precio:</strong> ${{ transaction.price.toFixed(2) }}</p>
    <p><strong>Total:</strong> ${{ transaction.total.toFixed(2) }}</p>
    <button @click="editTransaction" class="btn edit">Editar</button>
    <button @click="deleteTransaction" class="btn delete">Eliminar</button>
  </div>
</template>

<style scoped>
.transaction-details {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background: #f9f9f9;
}  
</style>
