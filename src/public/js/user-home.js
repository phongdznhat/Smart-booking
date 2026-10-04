document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  const timeSlots = Array.from(document.querySelectorAll('.time-slot'));
  const searchInput = document.getElementById('search-input');
  const resultText = document.getElementById('result-text');
  const payNowBtn = document.getElementById('pay-now-btn');
  const paymentModal = document.getElementById('payment-modal');
  const closePaymentBtn = document.getElementById('close-payment-modal');

  if (serviceCards.length) {
    serviceCards.forEach((card) => {
      card.addEventListener('click', () => {
        serviceCards.forEach((item) => item.classList.remove('active'));
        card.classList.add('active');
        if (resultText) {
          resultText.textContent = `Bạn đã chọn: ${card.dataset.serviceName || 'dịch vụ'}`;
        }
      });
    });
  }

  if (timeSlots.length) {
    timeSlots.forEach((slot) => {
      slot.addEventListener('click', () => {
        timeSlots.forEach((item) => item.classList.remove('active'));
        slot.classList.add('active');
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const keyword = event.target.value.toLowerCase();
      serviceCards.forEach((card) => {
        const text = (card.dataset.serviceName || '').toLowerCase();
        card.style.display = text.includes(keyword) ? 'block' : 'none';
      });
    });
  }

  const hidePaymentModal = () => {
    if (paymentModal) {
      paymentModal.classList.add('hidden');
    }
  };

  if (payNowBtn && paymentModal) {
    payNowBtn.addEventListener('click', () => {
      paymentModal.classList.remove('hidden');
    });
  }

  if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', hidePaymentModal);
  }

  if (paymentModal) {
    paymentModal.addEventListener('click', (event) => {
      if (event.target === paymentModal) {
        hidePaymentModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hidePaymentModal();
    }
  });
});
