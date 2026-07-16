interface Income {
    id: number;
    amount: number;
    paymentMode: string;
    description: string;
    date: string;
    fileName: string;
}

// ===============================
// DOM ELEMENTS
// ===============================

const incomeForm =
    document.getElementById("incomeForm") as HTMLFormElement;

const incomeAmount =
    document.getElementById("amount") as HTMLInputElement;

const incomeDescription =
    document.getElementById("description") as HTMLTextAreaElement;

const incomeDate =
    document.getElementById("date") as HTMLInputElement;

const incomeAttachment =
    document.getElementById("attachment") as HTMLInputElement;

const incomeDescriptionCount =
    document.getElementById("descriptionCount") as HTMLParagraphElement;

const incomeFileNameDisplay =
    document.getElementById("fileNameDisplay") as HTMLParagraphElement;

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

let incomes: Income[] = JSON.parse(

    localStorage.getItem("income") || "[]"

);

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

    const income = incomes.find(

        item => item.id === Number(incomeEditId)

    );

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

    const payment = document.querySelector(

        `input[value="${income.paymentMode}"]`

    ) as HTMLInputElement;

    if (payment) {

        payment.checked = true;

    }

    const saveButton = document.querySelector(

        ".save-btn"

    ) as HTMLButtonElement;

    if (saveButton) {

        saveButton.textContent = "Update Income";

    }

}

// ===============================
// VALIDATION
// ===============================

function validateIncomeForm(): boolean {

    if (

        incomeAmount.value.trim() === "" ||

        Number(incomeAmount.value) <= 0

    ) {

        alert("Please enter a valid amount.");

        incomeAmount.focus();

        return false;

    }

    if (

        incomeDescription.value.trim() === ""

    ) {

        alert("Please enter a description.");

        incomeDescription.focus();

        return false;

    }

    if (

        incomeDate.value === ""

    ) {

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

    const paymentMode = (
        document.querySelector(
            'input[name="payment"]:checked'
        ) as HTMLInputElement
    ).value;

    const selectedFile = incomeAttachment.files?.[0];

    // ===============================
    // UPDATE EXISTING INCOME
    // ===============================

    if (incomeEditId) {

        const index = incomes.findIndex(

            income => income.id === Number(incomeEditId)

        );

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

        const newIncome: Income = {

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

    localStorage.setItem(

        "income",

        JSON.stringify(incomes)

    );

    alert(

        incomeEditId
            ? "Income Updated Successfully!"
            : "Income Saved Successfully!"

    );

    window.location.href = "dashboard.html";

});

export {};