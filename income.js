// ===============================
// DOM ELEMENTS
// ===============================
const incomeForm = document.getElementById("incomeForm");
const incomeAmount = document.getElementById("amount");
const incomeDescription = document.getElementById("description");
const incomeDate = document.getElementById("date");
const incomeAttachment = document.getElementById("attachment");
const incomeDescriptionCount = document.getElementById("descriptionCount");
const incomeFileNameDisplay = document.getElementById("fileNameDisplay");
// ===============================
// DESCRIPTION COUNTER
// ===============================
incomeDescription.addEventListener("input", () => {
    incomeDescriptionCount.textContent =
        `${incomeDescription.value.length} / 200 Characters`;
});
// ===============================
// FILE NAME DISPLAY
// ===============================
incomeAttachment.addEventListener("change", () => {
    const selectedFile = incomeAttachment.files?.[0];
    incomeFileNameDisplay.textContent =
        selectedFile
            ? selectedFile.name
            : "No file selected";
});
// ===============================
// GET URL PARAMETERS
// ===============================
const incomeParams = new URLSearchParams(window.location.search);
const incomeEditId = incomeParams.get("id");
// ===============================
// LOCAL STORAGE
// ===============================
let incomes = JSON.parse(localStorage.getItem("income") || "[]");
// ===============================
// SET TODAY'S DATE
// ===============================
incomeDate.value = new Date().toISOString().split("T")[0];
// ===============================
// LOAD INCOME FOR EDIT
// ===============================
function loadIncomeForEdit() {
    if (!incomeEditId) {
        return;
    }
    const income = incomes.find(item => item.id === Number(incomeEditId));
    if (!income) {
        return;
    }
    incomeAmount.value = income.amount.toString();
    incomeDescription.value = income.description;
    incomeDate.value = income.date;
    incomeDescriptionCount.textContent =
        `${income.description.length} / 200 Characters`;
    incomeFileNameDisplay.textContent =
        income.fileName || "No file selected";
    const payment = document.querySelector(`input[value="${income.paymentMode}"]`);
    if (payment) {
        payment.checked = true;
    }
    const saveButton = document.querySelector(".save-btn");
    if (saveButton) {
        saveButton.textContent = "Update Income";
    }
}
// ===============================
// VALIDATION
// ===============================
function validateIncomeForm() {
    if (incomeAmount.value.trim() === "" ||
        Number(incomeAmount.value) <= 0) {
        alert("Please enter a valid amount.");
        incomeAmount.focus();
        return false;
    }
    if (incomeDescription.value.trim() === "") {
        alert("Please enter a description.");
        incomeDescription.focus();
        return false;
    }
    if (incomeDate.value === "") {
        alert("Please select a date.");
        incomeDate.focus();
        return false;
    }
    return true;
}
// ===============================
// INITIAL LOAD
// ===============================
loadIncomeForEdit();
// ===============================
// SAVE / UPDATE INCOME
// ===============================
incomeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateIncomeForm()) {
        return;
    }
    const paymentMode = document.querySelector('input[name="payment"]:checked').value;
    const selectedFile = incomeAttachment.files?.[0];
    // ===============================
    // UPDATE EXISTING INCOME
    // ===============================
    if (incomeEditId) {
        const index = incomes.findIndex(income => income.id === Number(incomeEditId));
        if (index !== -1) {
            incomes[index] = {
                ...incomes[index],
                amount: Number(incomeAmount.value),
                paymentMode: paymentMode,
                description: incomeDescription.value,
                date: incomeDate.value,
                fileName: selectedFile
                    ? selectedFile.name
                    : incomes[index].fileName
            };
        }
    }
    // ===============================
    // ADD NEW INCOME
    // ===============================
    else {
        const newIncome = {
            id: Date.now(),
            amount: Number(incomeAmount.value),
            paymentMode: paymentMode,
            description: incomeDescription.value,
            date: incomeDate.value,
            fileName: selectedFile
                ? selectedFile.name
                : ""
        };
        incomes.push(newIncome);
    }
    localStorage.setItem("income", JSON.stringify(incomes));
    alert(incomeEditId
        ? "Income Updated Successfully!"
        : "Income Saved Successfully!");
    window.location.href = "index.html";
});
export {};
