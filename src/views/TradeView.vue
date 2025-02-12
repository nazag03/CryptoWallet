<template>
  <div class="trade-view">
    <h1>Compra y Venta de Criptomonedas</h1>
    
    
    <p>Saldo disponible: ${{ balance }} USD</p>

    <div v-if="loading">Cargando precios...</div>
    <div v-else class="crypto-list">
      <div v-for="crypto in cryptos" :key="crypto.id" class="crypto-item">
        <h2>{{ crypto.name }} ({{ crypto.id }})</h2>
        <p>Precio actual: ${{ crypto.price }}</p>
        
        <button @click="openTrade(crypto, 'buy')">Comprar</button>
        <button @click="openTrade(crypto, 'sell')" :disabled="crypto.quantity <= 0">Vender</button>
        
        <p v-if="crypto.quantity > 0">Cantidad en cartera: {{ crypto.quantity }} {{ crypto.id }}</p>
      </div>
    </div>

    <!-- Modal de Compra/Venta -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ selectedAction === 'buy' ? 'Comprar' : 'Vender' }} {{ selectedCrypto.name }}</h2>
        <p>Precio: ${{ selectedCrypto.price }}</p>
        <input v-model="selectedQuantity" type="number" min="0.01" step="0.01" placeholder="Ingrese cantidad" />
        <div class="modal-buttons">
          <button @click="confirmTrade">Confirmar</button>
          <button @click="showModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useWalletStore } from '@/store/useWalletStore';
import { fetchCryptoPrices } from '@/api/cryptoApi';

export default {
  setup() {
    const walletStore = useWalletStore();
    
    const cryptos = ref([
      { id: 'BTC', name: 'Bitcoin', price: 0, quantity: 0 },
      { id: 'ETH', name: 'Ethereum', price: 0, quantity: 0 },
      { id: 'XRP', name: 'Ripple', price: 0, quantity: 0 },
      { id: 'LTC', name: 'Litecoin', price: 0, quantity: 0 }
    ]);

    const loading = ref(true);
    const balance = computed(() => walletStore.balance);

    const showModal = ref(false);
    const selectedCrypto = ref({});
    const selectedAction = ref('');
    const selectedQuantity = ref(0);

    const fetchPrices = async () => {
      try {
        const prices = await fetchCryptoPrices();
        cryptos.value.forEach(crypto => {
          crypto.price = prices[crypto.id.toLowerCase()] || 0;
          const storedCrypto = walletStore.cryptocurrencies.find(c => c.id === crypto.id);
          if (storedCrypto) {
            crypto.quantity = storedCrypto.quantity;
          }
        });
        loading.value = false;
      } catch (error) {
        console.error('Error al obtener precios', error);
      }
    };

    onMounted(fetchPrices);

    const openTrade = (crypto, action) => {
      selectedCrypto.value = crypto;
      selectedAction.value = action;
      selectedQuantity.value = 0;
      showModal.value = true;
    };

    const confirmTrade = () => {
      const quantity = parseFloat(selectedQuantity.value);
      if (isNaN(quantity) || quantity <= 0) {
        alert('Cantidad inválida.');
        return;
      }

      const total = quantity * selectedCrypto.value.price;

      if (selectedAction.value === 'buy' && total > balance.value) {
        alert('Fondos insuficientes.');
        return;
      }

      if (selectedAction.value === 'sell') {
        const storedCrypto = walletStore.cryptocurrencies.find(c => c.id === selectedCrypto.value.id);
        if (!storedCrypto || storedCrypto.quantity < quantity) {
          alert('No tienes suficientes criptomonedas para vender.');
          return;
        }
      }

      walletStore.addTransaction({
        type: selectedAction.value,
        cryptoId: selectedCrypto.value.id,
        quantity,
        total
      });

      showModal.value = false;
      fetchPrices();
    };

    return {
      cryptos,
      loading,
      balance,
      showModal,
      selectedCrypto,
      selectedAction,
      selectedQuantity,
      openTrade,
      confirmTrade
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


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.modal-buttons {
  margin-top: 10px;
}
.modal-buttons button {
  margin: 5px;
}
</style>
