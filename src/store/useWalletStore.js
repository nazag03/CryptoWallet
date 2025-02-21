import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  const currentUser = ref(null);
  const balance = ref(10000);
  const transactions = ref([]);
  const cryptocurrencies = ref([
    { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
    { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
    { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
    { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
  ]);

  // Funciones existentes para cargar y guardar datos del usuario
  function setUser(userId) {
    currentUser.value = userId;
    loadUserData();
  }

  function loadUserData() {
    if (!currentUser.value) {
      resetStoreData();
      return;
    }

    const storedTransactions = localStorage.getItem(`transactions_${currentUser.value}`);
    transactions.value = storedTransactions ? JSON.parse(storedTransactions) : [];

    const storedBalance = localStorage.getItem(`balance_${currentUser.value}`);
    balance.value = storedBalance ? parseFloat(storedBalance) : 10000;

    const storedCryptos = localStorage.getItem(`cryptos_${currentUser.value}`);
    if (storedCryptos) {
      cryptocurrencies.value = JSON.parse(storedCryptos);
    } else {
      resetCryptoQuantities();
    }
  }

  function saveUserData() {
    if (!currentUser.value) return;
    localStorage.setItem(`transactions_${currentUser.value}`, JSON.stringify(transactions.value));
    localStorage.setItem(`balance_${currentUser.value}`, balance.value.toString());
    localStorage.setItem(`cryptos_${currentUser.value}`, JSON.stringify(cryptocurrencies.value));
  }

  // Función para restablecer cantidades de criptomonedas
  function resetCryptoQuantities() {
    cryptocurrencies.value = cryptocurrencies.value.map(crypto => ({
      ...crypto,
      quantity: 0,
    }));
  }

  // Función para restablecer los datos cuando el usuario cierra sesión
  function resetStoreData() {
    balance.value = 10000;
    transactions.value = [];
    cryptocurrencies.value = [
      { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
      { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
      { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
      { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
    ];
  }

  // Función para cerrar sesión
  function logout() {
    currentUser.value = null;
    resetStoreData();
  }

  // Función para agregar una nueva transacción
  function addTransaction(transaction) {
    const crypto = cryptocurrencies.value.find(c => c.id === transaction.cryptoId);
    if (!crypto) {
      console.error('Criptomoneda no encontrada');
      return;
    }

    // Agregar la transacción con el precio de la criptomoneda
    if (transaction.type === 'buy') {
      if (balance.value < transaction.total) {
        console.error('Saldo insuficiente');
        return;
      }
      balance.value -= transaction.total;
      crypto.quantity += transaction.quantity;
    } else if (transaction.type === 'sell') {
      if (crypto.quantity < transaction.quantity) {
        console.error('Cantidad insuficiente');
        return;
      }
      balance.value += transaction.total;
      crypto.quantity -= transaction.quantity;
    }

    transactions.value.push({
      transactionId: Date.now(),
      dateTime: new Date().toLocaleString(),
      cryptoId: transaction.cryptoId,
      cryptoName: crypto.name,
      type: transaction.type,
      quantity: transaction.quantity,
      total: transaction.total,
      price: crypto.price, // Guardar el precio de la criptomoneda al momento de la transacción
    });

    saveUserData();
  }

  // Función para eliminar una transacción
  function removeTransaction(transactionId) {
    const transaction = transactions.value.find(t => t.transactionId === transactionId);
    if (!transaction) return;

    const crypto = cryptocurrencies.value.find(c => c.id === transaction.cryptoId);
    if (!crypto) return;

    // Revertir los efectos de la transacción utilizando el precio guardado
    if (transaction.type === 'buy') {
      balance.value += transaction.total;
      crypto.quantity -= transaction.quantity;
    } else if (transaction.type === 'sell') {
      balance.value -= transaction.total;
      crypto.quantity += transaction.quantity;
    }

    // Eliminar la transacción
    transactions.value = transactions.value.filter(t => t.transactionId !== transactionId);
    saveUserData();
  }

  // Función para editar una transacción
  function editTransaction(updatedTransaction) {
    const index = transactions.value.findIndex(t => t.transactionId === updatedTransaction.transactionId);
    if (index === -1) return;

    const oldTransaction = transactions.value[index];
    const crypto = cryptocurrencies.value.find(c => c.id === oldTransaction.cryptoId);
    if (!crypto) return;

    // Revertir los efectos de la transacción anterior utilizando el precio guardado
    if (oldTransaction.type === 'buy') {
      balance.value += oldTransaction.total;
      crypto.quantity -= oldTransaction.quantity;
    } else if (oldTransaction.type === 'sell') {
      balance.value -= oldTransaction.total;
      crypto.quantity += oldTransaction.quantity;
    }

    // Aplicar los cambios de la nueva transacción
    transactions.value[index] = { ...oldTransaction, ...updatedTransaction };

    if (updatedTransaction.type === 'buy') {
      balance.value -= updatedTransaction.total;
      crypto.quantity += updatedTransaction.quantity;
    } else if (updatedTransaction.type === 'sell') {
      balance.value += updatedTransaction.total;
      crypto.quantity -= updatedTransaction.quantity;
    }

    saveUserData();
  }

  // Función para obtener el balance formateado
  const formattedBalance = computed(() => balance.value.toFixed(2));

  // Escucha cambios en el usuario para cargar sus datos
  watch(currentUser, (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loadUserData();
    }
  });

  return {
    currentUser,
    balance,
    transactions,
    cryptocurrencies,

    setUser,
    loadUserData,
    saveUserData,
    resetStoreData,
    resetCryptoQuantities,
    logout,
    addTransaction,
    removeTransaction,
    editTransaction,

    formattedBalance,
  };
});
