import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(10000); // Saldo inicial en USD
  const transactions = ref([]);
  const cryptocurrencies = ref([
    { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
    { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
    { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
    { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
  ]); 

  function addTransaction(transaction) {
    transactions.value.push(transaction);

    if (transaction.type === 'buy') {
      balance.value -= transaction.total;
      const crypto = cryptocurrencies.value.find(crypto => crypto.id === transaction.cryptoId);
      if (crypto) {
        crypto.quantity += transaction.quantity;
      }
    } else if (transaction.type === 'sell') {
      balance.value += transaction.total;
      const crypto = cryptocurrencies.value.find(crypto => crypto.id === transaction.cryptoId);
      if (crypto) {
        crypto.quantity -= transaction.quantity;
      }
    }
  }

  return { balance, transactions, cryptocurrencies, addTransaction };
});
