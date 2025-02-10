<template>
  <div class="trade-view">
    <h1>Compra y Venta de Criptomonedas</h1>
    <div v-if="loading">Cargando precios...</div>
    <div v-else class="crypto-list">
      <div v-for="crypto in cryptos" :key="crypto.symbol" class="crypto-item">
        <h2>{{ crypto.name }} ({{ crypto.symbol.toUpperCase() }})</h2>
        <p>Precio actual: ${{ crypto.price }}</p>
        <button @click="openTrade(crypto, 'buy')">Comprar</button>
        <button @click="openTrade(crypto, 'sell')" :disabled="!wallet[crypto.symbol]">  Vender</button>

        <p v-if="wallet[crypto.symbol]">Saldo: {{ wallet[crypto.symbol] }} {{ crypto.symbol.toUpperCase() }}</p> 
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { computed } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';
import { fetchCryptoPrices } from '@/api/cryptoApi';

export default {
  setup() {
    const walletStore = useWalletStore();
    const cryptos = ref([
      { name: 'Bitcoin', symbol: 'btc', price: 0 },
      { name: 'Ethereum', symbol: 'eth', price: 0 },
      { name: 'Litecoin', symbol: 'ltc', price: 0 },
      { name: 'Ripple', symbol: 'xrp', price: 0 }
    ]);
    const loading = ref(true);
    const openTrade = (crypto, action) => {
     
    };

    const fetchPrices = async () => {
      try {
        const prices = await fetchCryptoPrices();
        cryptos.value.forEach(crypto => {
          crypto.price = prices[crypto.symbol] || 0;
        });
        loading.value = false;
      } catch (error) {
        console.error('Error al obtener precios', error);
      }
    };

    onMounted(fetchPrices);
    const wallet = computed(() => walletStore.wallet || {});
    return {
      cryptos,
      loading,
      wallet,
      openTrade
    };
  }
};
</script>

<style scoped>
.trade-view {
  text-align: center;
}
.crypto-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.crypto-item {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
}
button {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
}
</style>