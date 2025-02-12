<template>
    <div class="transaction-details">
      <h3>Detalles de la Transacción</h3>
      <p><strong>Fecha:</strong> {{ transaction.date }} - {{ transaction.time }}</p>
      <p><strong>Tipo:</strong> {{ transaction.type }}</p>
      <p><strong>Cantidad:</strong> {{ transaction.amount }} {{ transaction.currency }}</p>
      <p><strong>Precio por unidad:</strong> {{ transaction.price }} USD</p>
      <p><strong>Total:</strong> {{ transaction.total }} USD</p>
  
      <button @click="toggleDetails" class="details-button">
        {{ showDetails ? "Ocultar Detalle" : "Ver Detalle" }}
      </button>
  
      <div v-if="showDetails" class="transaction-analysis">
        <p>{{ transactionAnalysis }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      transaction: Object,
    },
    data() {
      return {
        showDetails: false,
      };
    },
    computed: {
      transactionAnalysis() {
        // Supongamos que tenemos un historial de compras previas (en una implementación real, vendría de la API)
        const previousPrice = this.getPreviousPrice(); // Obtener precio anterior
        const difference = this.transaction.price - previousPrice;
        const totalDifference = difference * this.transaction.amount;
        
        if (this.transaction.type === "Venta") {
          return difference > 0
            ? `Vendiste ${this.transaction.amount} ${this.transaction.currency} a ${this.transaction.price} USD. 
               Lo compraste a ${previousPrice} USD. ¡Ganancia de ${totalDifference.toFixed(2)} USD! 🎉`
            : `Vendiste ${this.transaction.amount} ${this.transaction.currency} a ${this.transaction.price} USD. 
               Lo compraste a ${previousPrice} USD. Pérdida de ${Math.abs(totalDifference.toFixed(2))} USD. 😞`;
        } else {
          return `Compraste ${this.transaction.amount} ${this.transaction.currency} a ${this.transaction.price} USD.`;
        }
      },
    },
    methods: {
      toggleDetails() {
        this.showDetails = !this.showDetails;
      },
      getPreviousPrice() {
        // Este es un valor simulado. En una aplicación real, lo buscarías en el historial de compras.
        const simulatedPreviousPrices = {
          BTC: 44000,
          ETH: 3100,
          XRP: 0.5,
          LTC: 150,
        };
        return simulatedPreviousPrices[this.transaction.currency] || this.transaction.price;
      },
    },
  };
  </script>
  
  <style scoped>
  .transaction-details {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .details-button {
    background-color: #007bff;
    color: white;
    padding: 8px;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  .transaction-analysis {
    margin-top: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 5px;
  }
  </style>
  