import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(10000);
  const transactions = ref([]);
  const cryptocurrencies = ref([
    { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
    { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
    { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
    { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
  ]);

  function addTransaction(transaction) {
    console.log("Agregando transacción:", transaction); // DEBUG

    const crypto = cryptocurrencies.value.find(c => c.id === transaction.cryptoId);
    if (!crypto) {
      console.error('Criptomoneda no encontrada');
      return;
    }

    if (transaction.type === 'buy') {
      if (balance.value < transaction.total) {
        console.error('Saldo insuficiente para la compra');
        return;
      }
      balance.value -= transaction.total;
      crypto.quantity += transaction.quantity;
    } else if (transaction.type === 'sell') {
      if (crypto.quantity < transaction.quantity) {
        console.error('Cantidad insuficiente para la venta');
        return;
      }
      balance.value += transaction.total;
      crypto.quantity -= transaction.quantity;
    }

    transactions.value.push({
      cryptoId: transaction.cryptoId,
      cryptoName: crypto.name, // Guardar el nombre de la criptomoneda
      type: transaction.type,
      quantity: transaction.quantity,
      total: transaction.total
    });

    console.log("Historial actualizado:", transactions.value); // DEBUG
  }

  const formattedBalance = computed(() => balance.value.toFixed(2));

  return { balance, transactions, cryptocurrencies, addTransaction, formattedBalance };
});
