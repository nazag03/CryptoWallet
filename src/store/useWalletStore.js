import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(10000); // Saldo inicial en USD
  const transactions = ref([]);

  function addTransaction(transaction) {
    transactions.value.push(transaction);
    if (transaction.type === 'buy') {
      balance.value -= transaction.total;
    } else if (transaction.type === 'sell') {
      balance.value += transaction.total;
    }
  }

  return { balance, transactions, addTransaction };
});
