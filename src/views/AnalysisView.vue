<template>
  <div>
    <h1>Análisis de Portafolio</h1>
    <div v-if="loading">Cargando datos...</div>
    <div v-else>
      <CryptoPriceChart
        v-for="crypto in cryptocurrencies"
        :key="crypto.id"
        :cryptoName="crypto.name"
        :cryptoSymbol="crypto.id"
        :historicalData="cryptoPrices[crypto.id] || []"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useWalletStore } from "../store/useWalletStore";
import CryptoPriceChart from "../components/CryptoPriceChart.vue";

export default {
  components: { CryptoPriceChart },
  setup() {
    const walletStore = useWalletStore();

    onMounted(() => {
      walletStore.fetchHistoricalPrices();
    });

    return {
      cryptocurrencies: computed(() => walletStore.cryptocurrencies),
      cryptoPrices: computed(() => walletStore.cryptoPrices),
      loading: computed(() => walletStore.loading)
    };
  }
};
</script>
