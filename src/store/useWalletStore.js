import { ref, computed, onMounted } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(10000);
  const transactions = ref([]);
  const cryptocurrencies = ref([
    { id: 'BTC', name: 'Bitcoin', quantity: 0, price: 30000 },
    { id: 'ETH', name: 'Ethereum', quantity: 0, price: 2000 },
    { id: 'XRP', name: 'Ripple', quantity: 0, price: 0.5 },
    { id: 'LTC', name: 'Litecoin', quantity: 0, price: 150 },
  ]);
  
  // Estado para los precios históricos de las criptomonedas
  const cryptoPrices = ref({});
  const loading = ref(false);

  function addTransaction(transaction) {
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
      dateTime: new Date().toLocaleString(),
      cryptoId: transaction.cryptoId,
      cryptoName: crypto.name,
      type: transaction.type,
      quantity: transaction.quantity,
      total: transaction.total,
      price: crypto.price,
    });

    console.log("Historial actualizado:", transactions.value);
  }

  // Obtener precios históricos de CoinGecko
  async function fetchHistoricalPrices() {
    loading.value = true;
    const cryptoMapping = { BTC: 'bitcoin', ETH: 'ethereum', XRP: 'ripple', LTC: 'litecoin' };
    
    try {
      const promises = Object.keys(cryptoMapping).map(async (symbol) => {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${cryptoMapping[symbol]}/market_chart`,
          { params: { vs_currency: "usd", days: "1", interval: "hourly" } }
        );
        return {
          symbol,
          data: response.data.prices.map(([timestamp, price]) => ({ timestamp, price }))
        };
      });

      const results = await Promise.all(promises);
      cryptoPrices.value = results.reduce((acc, { symbol, data }) => {
        acc[symbol] = data;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error al obtener precios históricos", error);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchHistoricalPrices();
  });

  const formattedBalance = computed(() => balance.value.toFixed(2));

  return { 
    balance, transactions, cryptocurrencies, addTransaction, formattedBalance,
    cryptoPrices, fetchHistoricalPrices, loading
  };
});
