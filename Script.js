
let participants = [];
let expenses = [];

const addParticipantName = document.getElementById("participantName");
const addParticipantBtn = document.getElementById("addParticipant");
const addParticipantList = document.getElementById("participantsList");
const payerSelector = document.getElementById("payerSelect");

const expenseDescInput = document.getElementById("expenseDesc");
const expenseAmountInput = document.getElementById("expenseAmount");
const payerSelectorExpense = document.getElementById("payerSelect"); 
const addExpenseBtn = document.getElementById("addExpense");
const expensesList = document.getElementById("expensesList");

const calculateBtn = document.getElementById("calculate");
const resultsDiv = document.getElementById("results");


addParticipantBtn.addEventListener("click", () => {
  const name = addParticipantName.value.trim();
  if (!name) return; 
  if (participants.includes(name)) {
    resultsDiv.innerHTML = `<p style="color:#ffd369;">${name} is already added.</p>`;
    return;
  }

  participants.push(name);


  const li = document.createElement("li");
  li.textContent = name;
  addParticipantList.appendChild(li);

  
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  payerSelector.appendChild(option);

  
  addParticipantName.value = "";
  resultsDiv.innerHTML = ""; 
});


addExpenseBtn.addEventListener("click", () => {
  const description = expenseDescInput.value.trim();
  const rawAmount = expenseAmountInput.value.trim().replace(/,/g, "");
  const amount = parseFloat(rawAmount);
  const payer = payerSelectorExpense.value;

  
  if (!description || isNaN(amount) || amount <= 0 || !payer) {
    resultsDiv.innerHTML = "<p>Please enter a valid description, amount (>0) and select a payer.</p>";
    return;
  }


  const expense = { description, amount, payer };
  expenses.push(expense);


  const li = document.createElement("li");
  li.textContent = `${payer} paid ${amount.toFixed(2)} for ${description}`;
  expensesList.appendChild(li);


  expenseDescInput.value = "";
  expenseAmountInput.value = "";
  payerSelectorExpense.value = "";
  resultsDiv.innerHTML = "";
});


function calculateBalance() {
  if (!participants || participants.length === 0) {
    resultsDiv.innerHTML = "<p>Please add at least one participant.</p>";
    return;
  }
  if (!expenses || expenses.length === 0) {
    resultsDiv.innerHTML = "<p>Please add at least one expense.</p>";
    return;
  }

  
  const total = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  
  const share = total / participants.length;

  
  const paid = {};
  participants.forEach(p => (paid[p] = 0));
  expenses.forEach(exp => {
    if (!paid.hasOwnProperty(exp.payer)) paid[exp.payer] = 0;
    paid[exp.payer] += Number(exp.amount) || 0;
  });

  
  const balances = {};
  participants.forEach(p => {
    const raw = (paid[p] || 0) - share;
    balances[p] = Math.round((raw + Number.EPSILON) * 100) / 100; 
  });

  
  resultsDiv.innerHTML = `
    <div style="text-align:left">
      <p><strong>Total:</strong> ${total.toFixed(2)}</p>
      <p><strong>Each pays:</strong> ${share.toFixed(2)}</p>
      <hr>
      <h4>Balances:</h4>
    </div>
  `;

  participants.forEach(p => {
    const b = balances[p];
if (b > 0) {
  resultsDiv.innerHTML += `<div class="balance-card receive">💰 <strong>${p}</strong> should receive PKR ${b.toFixed(2)}</div>`;
} else if (b < 0) {
  resultsDiv.innerHTML += `<div class="balance-card pay">💸 <strong>${p}</strong> should pay PKR ${Math.abs(b).toFixed(2)}</div>`;
} else {
  resultsDiv.innerHTML += `<div class="balance-card settled">✅ <strong>${p}</strong> is settled up</div>`;
}

  });

  return balances;
}


calculateBtn.addEventListener("click", calculateBalance);
