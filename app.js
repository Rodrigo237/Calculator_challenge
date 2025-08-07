document.addEventListener("DOMContentLoaded", function() {
  const btn_calculate = document.querySelector(".btn-calculate");

  btn_calculate.addEventListener("click", () => {
    // First validate the form
    if (!validateForm()) return;
    const emptyScreen = document.querySelector(".payment-result-empty");
    const resultScreen = document.querySelector(".payment-result");
    emptyScreen.style.display = "none";
    resultScreen.style.display = "block";
    // Then safely get values and calculate
    const montage_amount = parseFloat(document.querySelector("#mortage-amount").value.trim());
    const montage_term = parseInt(document.querySelector("#mortage-term").value.trim());
    const interest_rate = parseFloat(document.querySelector("#interest-rate").value.trim());
    const typeInput = document.querySelector('input[name="mortage-type"]:checked');
    if(typeInput.value === "repayment") {
      const result_month = montageCalculate(montage_amount, interest_rate, montage_term);
      const result_total = montageTotal(result_month, montage_term);
      document.querySelector(".monthly-payment").textContent = `£${result_month}`;
      document.querySelector(".total-payment").textContent = `£${result_total}`;
    }else if(typeInput.value === "interest-only") {
      const monthly_interest = (montage_amount * (interest_rate / 100 / 12));
      const total_interest = (monthly_interest * montage_term * 12);
      document.querySelector(".monthly-payment").textContent = `£${monthly_interest.toFixed(2)}`;
      document.querySelector(".total-payment").textContent = `£${total_interest.toFixed(2)}`;
    }
  });


  const btn_clear = document.querySelector(".btn-clear");
  btn_clear.addEventListener("click", () => {
    document.querySelector("#mortage-amount").value = "";
    document.querySelector("#mortage-term").value = "";
    document.querySelector("#interest-rate").value = "";
    const typeInput = document.querySelector('input[name="mortage-type"]:checked');
    if (typeInput) typeInput.checked = false;
    const emptyScreen = document.querySelector(".payment-result-empty");
    const resultScreen = document.querySelector(".payment-result");
    emptyScreen.style.display = "block";
    resultScreen.style.display = "none";

    document.querySelectorAll(".error-message").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    document.querySelectorAll(".prefixbox-error").forEach(el => el.classList.remove("prefixbox-error"));
  });
});

function montageCalculate(montage_amount,interest_rate, montage_term) {
  const interest_month = interest_rate / 100 / 12;
  const number_payments = montage_term * 12;

  const monthly_payment = montage_amount * 
    (interest_month * Math.pow(1 + interest_month, number_payments)) /
    (Math.pow(1 + interest_month, number_payments) - 1);

  return monthly_payment.toFixed(2);
}

function montageTotal(result_month,montage_term){
    const number_payments = montage_term * 12;
    const total = result_month * number_payments
    return total.toFixed(2);
}


function validateForm() {
  document.querySelectorAll(".error-message").forEach(el => el.remove());
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  document.querySelectorAll(".prefixbox-error").forEach(el => el.classList.remove("prefixbox-error"));

  let isValid = true;

  const amountInput = document.querySelector("#mortage-amount");
  const termInput = document.querySelector("#mortage-term");
  const rateInput = document.querySelector("#interest-rate");
  const typeInput = document.querySelector('input[name="mortage-type"]:checked');

  const fields = [
    { input: amountInput, message: "This field is required" },
    { input: termInput, message: "This field is required" },
    { input: rateInput, message: "This field is required" }
  ];

  fields.forEach(field => {
    if (!field.input.value.trim()) {
      field.input.parentElement.classList.add("input-error");
      const prefix = field.input.parentElement.querySelector(".prefix-box");
      if (prefix) prefix.classList.add("prefixbox-error");
      const error = document.createElement("span");
      error.className = "error-message";
      error.textContent = field.message;
      field.input.parentElement.insertAdjacentElement('afterend', error);
      isValid = false;
    }
  });

  if (!typeInput) {
    const radioGroup = document.querySelector(".radio-group");
    const error = document.createElement("span");
    error.className = "error-message";
    error.textContent = "This field is required";
    radioGroup.appendChild(error);
    isValid = false;
  }

  return isValid;
}
