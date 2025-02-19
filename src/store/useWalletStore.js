import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
  // El ID del usuario actualmente logueado
  const currentUser = ref(null);

  // Datos financieros
  const balance = ref(10000);
  const transactions = ref([]);
  const cryptocurrencies = ref([
    { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
    { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
    { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
    { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
  ]);

  // 1) Asignar un usuario y cargar sus datos
  function setUser(userId) {
    currentUser.value = userId;
    loadUserData(); // Cargar los datos desde localStorage
  }

  // 2) Cargar datos desde localStorage, usando el userId como parte de la clave
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

  // 3) Guardar datos en localStorage
  function saveUserData() {
    if (!currentUser.value) return; // Si no hay usuario, no guardamos
    localStorage.setItem(`transactions_${currentUser.value}`, JSON.stringify(transactions.value));
    localStorage.setItem(`balance_${currentUser.value}`, balance.value.toString());
    localStorage.setItem(`cryptos_${currentUser.value}`, JSON.stringify(cryptocurrencies.value));
  }

  // Restablecer la cantidad de criptomonedas a 0 (manteniendo los precios)
  function resetCryptoQuantities() {
    cryptocurrencies.value = cryptocurrencies.value.map(crypto => ({
      ...crypto,
      quantity: 0,
    }));
  }

  // Restablecer todos los datos a sus valores iniciales
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

  // Logout: Limpia el usuario actual y resetea los datos
  function logout() {
    currentUser.value = null;
    resetStoreData();
  }

  // 4) Añadir transacción (compra/venta) y actualizar el balance
  function addTransaction(transaction) {
    const crypto = cryptocurrencies.value.find(c => c.id === transaction.cryptoId);
    if (!crypto) {
      console.error('Criptomoneda no encontrada');
      return;
    }

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
      dateTime: new Date().toLocaleString(),
      cryptoId: transaction.cryptoId,
      cryptoName: crypto.name,
      type: transaction.type,
      quantity: transaction.quantity,
      total: transaction.total,
      price: crypto.price,
    });

    // Guardar inmediatamente después de cada transacción
    saveUserData();
  }

  // Computed para mostrar el balance con 2 decimales
  const formattedBalance = computed(() => balance.value.toFixed(2));

  // Opcional: Observar cambios en currentUser y cargar/guardar datos
  watch(currentUser, (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loadUserData();
    }
  });

  return {
    // Estado
    currentUser,
    balance,
    transactions,
    cryptocurrencies,

    // Métodos
    setUser,
    loadUserData,
    saveUserData,
    resetStoreData,
    resetCryptoQuantities,
    logout,
    addTransaction,

    // Computed
    formattedBalance,
  };
});
