// =================================
// CHECK EDIT MODE
// =================================
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");
let expenses = JSON.parse(localStorage.getItem("expense") || "[]");
const form = document.getElementById("expenseForm");
const amount = document.getElementById("amount");
const description = document.getElementById("description");
const date = document.getElementById("date");
const attachment = document.getElementById("attachment");
const descriptionCount = document.getElementById("descriptionCount");
const fileNameDisplay = document.getElementById("fileNameDisplay");
date.value = new Date().toISOString().split("T")[0];
description.addEventListener("input", () => {
    descriptionCount.textContent =
        `${description.value.length} / 200 Characters`;
});
attachment.addEventListener("change", () => {
    const file = attachment.files?.[0];
    fileNameDisplay.textContent =
        file ? file.name : "No file selected";
});
function validateForm() {
    if (amount.value.trim() === "") {
        alert("Enter Amount");
        return false;
    }
    if (Number(amount.value) <= 0) {
        alert("Amount must be greater than zero");
        return false;
    }
    if (description.value.trim() === "") {
        alert("Enter Description");
        return false;
    }
    return true;
}
loadExpenseForEdit();
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }
    const paymentMode = document.querySelector('input[name="payment"]:checked').value;
    const selectedFile = attachment.files?.[0];
    // ==========================
    // EDIT MODE
    // ==========================
    if (editId) {
        const index = expenses.findIndex(expense => expense.id === Number(editId));
        if (index !== -1) {
            expenses[index] = {
                ...expenses[index],
                amount: Number(amount.value),
                paymentMode,
                description: description.value,
                date: date.value,
                fileName: selectedFile
                    ? selectedFile.name
                    : expenses[index].fileName
            };
        }
    }
    // ==========================
    // ADD MODE
    // ==========================
    else {
        const newExpense = {
            id: Date.now(),
            amount: Number(amount.value),
            paymentMode,
            description: description.value,
            date: date.value,
            fileName: selectedFile
                ? selectedFile.name
                : ""
        };
        expenses.push(newExpense);
    }
    localStorage.setItem("expense", JSON.stringify(expenses));
    alert(editId
        ? "Expense Updated Successfully!"
        : "Expense Saved Successfully!");
    window.location.href = "dashboard.html";
});
function loadExpenseForEdit() {
    if (!editId)
        return;
    const expense = expenses.find(item => item.id === Number(editId));
    if (!expense)
        return;
    amount.value = expense.amount.toString();
    description.value =
        expense.description;
    date.value =
        expense.date;
    const payment = document.querySelector(`input[value="${expense.paymentMode}"]`);
    if (payment) {
        payment.checked = true;
    }
    fileNameDisplay.textContent =
        expense.fileName || "No file selected";
    descriptionCount.textContent =
        `${expense.description.length} / 200 Characters`;
    const button = document.querySelector(".save-btn");
    button.textContent = "Update Expense";
}
export {};
