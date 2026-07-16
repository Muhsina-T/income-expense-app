// ===============================
// DOM ELEMENTS
// ===============================
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const cashInHand = document.getElementById("cashInHand");
const transactionContainer = document.getElementById("transactionContainer");
// ADD THESE TWO
const searchInput = document.getElementById("searchInput");
console.log("aaaaaaaaaaaaa");
const filterType = document.getElementById("filterType");
console.log("bbbbbbbbbbbbb");
// ===============================
// GET DATA
// ===============================
let incomes = JSON.parse(localStorage.getItem("income") || "[]");
let expenses = JSON.parse(localStorage.getItem("expense") || "[]");
let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
// ===============================
// CALCULATIONS
// ===============================
function calculateTotalIncome() {
    return incomes.reduce((total, income) => total + income.amount, 0);
}
function calculateTotalExpense() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}
// ===============================
// UPDATE CARDS
// ===============================
function updateSummary() {
    const income = calculateTotalIncome();
    const expense = calculateTotalExpense();
    totalIncome.textContent =
        `₹${income}`;
    totalExpense.textContent =
        `₹${expense}`;
    cashInHand.textContent =
        `₹${income - expense}`;
}
// ===============================
// DISPLAY TRANSACTIONS
// ===============================
function displayTransactions() {
    transactionContainer.innerHTML = "";
    const transactions = [
        ...incomes.map(item => ({
            ...item,
            type: "income"
        })),
        ...expenses.map(item => ({
            ...item,
            type: "expense"
        }))
    ];
    // Latest first
    transactions.sort((a, b) => new Date(b.date).getTime()
        -
            new Date(a.date).getTime());
    if (transactions.length === 0) {
        transactionContainer.innerHTML = `

        <div class="empty">

        <i class="fa-solid fa-folder-open"></i>

        <p>No Transactions Yet</p>

        </div>

        `;
        return;
    }
    transactions.forEach(transaction => {
        const div = document.createElement("div");
        div.className = "transaction";
        div.innerHTML = `


        <div class="left">


            <h3>

            ${transaction.description}

            </h3>


           <p>

${formatDate(transaction.date)}

|

${transaction.paymentMode}


${transaction.fileName ?
            `

<br>

<a class="file-link">

📎 ${transaction.fileName}

</a>

`
            :
                ""}

</p>


        </div>



        <div class="right">


            <span class="amount 

            ${transaction.type}">

            ${transaction.type === "income"
            ? "+"
            : "-"}

            ₹${transaction.amount}

            </span>



            <button

            class="action-btn edit-btn"

            onclick="editTransaction('${transaction.type}',${transaction.id})">

            <i class="fa-solid fa-pen"></i>

            </button>



            <button

            class="action-btn delete-btn"

            onclick="deleteTransaction('${transaction.type}',${transaction.id})">

            <i class="fa-solid fa-trash"></i>

            </button>


        </div>


        `;
        transactionContainer.appendChild(div);
    });
}
function formatDate(date) {
    return new Date(date)
        .toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}
function filterTransactions() {
    const search = searchInput.value.toLowerCase();
    const type = filterType.value;
    transactionContainer.innerHTML = "";
    const filtered = [
        ...incomes.map(item => ({
            ...item,
            type: "income"
        })),
        ...expenses.map(item => ({
            ...item,
            type: "expense"
        }))
    ].filter(item => {
        const matchText = item.description
            .toLowerCase()
            .includes(search);
        const matchType = type === "all"
            ||
                item.type === type;
        return matchText && matchType;
    });
    if (filtered.length === 0) {
        transactionContainer.innerHTML =
            `

        <div class="empty">

        <i class="fa-solid fa-search"></i>

        <p>No Matching Transactions</p>

        </div>

        `;
        return;
    }
    filtered.forEach(transaction => {
        // reuse display logic
    });
}
// ===============================
// DELETE FUNCTION
// ===============================
function deleteTransaction(type, id) {
    if (!confirm("Delete this transaction?"))
        return;
    if (type === "income") {
        incomes = incomes.filter(item => item.id !== id);
        localStorage.setItem("income", JSON.stringify(incomes));
    }
    else {
        expenses = expenses.filter(item => item.id !== id);
        localStorage.setItem("expense", JSON.stringify(expenses));
    }
    updateSummary();
    displayTransactions();
}
// ===============================
// EDIT FUNCTION
// ===============================
function editTransaction(type, id) {
    if (type === "income") {
        window.location.href =
            `add-income.html?id=${id}`;
    }
    else {
        window.location.href =
            `add-expense.html?id=${id}`;
    }
}
// Make functions available to HTML
window.deleteTransaction =
    deleteTransaction;
window.editTransaction =
    editTransaction;
// ===============================
// START APP
// ===============================
updateSummary();
displayTransactions();
// ===============================
// SEARCH & FILTER EVENTS
// ===============================
searchInput.addEventListener("input", filterTransactions);
filterType.addEventListener("change", filterTransactions);
export {};
