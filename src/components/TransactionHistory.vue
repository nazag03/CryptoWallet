<template>
  <div>
    <h2>Historial de Transacciones</h2>
    <div v-for="transaction in walletStore.transactions" :key="transaction.transactionId">
      <p>
        {{ transaction.cryptoName }} - 
        {{ transaction.quantity }} unidades - 
        ${{ transaction.total.toFixed(2) }} 
        ({{ transaction.type === 'buy' ? 'Compra' : 'Venta' }})
      </p>
      <button @click="startEdit(transaction)">Editar</button>
      <button @click="walletStore.removeTransaction(transaction.transactionId)">Eliminar</button>
    </div>

    <!-- Formulario de edición -->
    <div v-if="editingTransaction">
      <h3>Editar Transacción</h3>
      <label for="editQuantity">Cantidad:</label>
      <input v-model.number="editQuantity" type="number" step="0.0001" min="0.0001" />

      <p>Total: ${{ newTotal.toFixed(2) }}</p>

      <button @click="saveEdit">Guardar</button>
      <button @click="cancelEdit">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';

const walletStore = useWalletStore();
const editingTransaction = ref(null);
const editQuantity = ref(0);

// Calcula el nuevo total basado en la cantidad editada
const newTotal = computed(() => {
  if (!editingTransaction.value) return 0;
  return editQuantity.value * editingTransaction.value.price;
});

const startEdit = (transaction) => {
  editingTransaction.value = { ...transaction };
  editQuantity.value = transaction.quantity;
};

const saveEdit = () => {
  if (!editingTransaction.value || editQuantity.value <= 0) {
    alert('Ingrese una cantidad válida.');
    return;
  }

  walletStore.editTransaction({
    ...editingTransaction.value,
    quantity: parseFloat(editQuantity.value),
    total: newTotal.value
  });

  editingTransaction.value = null;
};

const cancelEdit = () => {
  editingTransaction.value = null;
};
</script>
