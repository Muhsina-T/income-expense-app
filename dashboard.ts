interface Income {

    id:number;

    amount:number;

    paymentMode:string;

    description:string;

    date:string;

    fileName:string;

}


interface Expense {

    id:number;

    amount:number;

    paymentMode:string;

    description:string;

    date:string;

    fileName:string;

}

interface Transaction {
    id: number;
    type: "income" | "expense";
    amount: number;
    description: string;
    date: string;
}



// ===============================
// DOM ELEMENTS
// ===============================


const totalIncome =
document.getElementById("totalIncome") as HTMLHeadingElement;


const totalExpense =
document.getElementById("totalExpense") as HTMLHeadingElement;


const cashInHand =
document.getElementById("cashInHand") as HTMLHeadingElement;


const transactionContainer =
document.getElementById("transactionContainer") as HTMLDivElement;


// ADD THESE TWO




const filterType =
document.getElementById("filterType") as HTMLSelectElement;
console.log("bbbbbbbbbbbbb");




// ===============================
// GET DATA
// ===============================


let incomes:Income[] = JSON.parse(

    localStorage.getItem("income") || "[]"

);


let expenses:Expense[] = JSON.parse(

    localStorage.getItem("expense") || "[]"

);








// ===============================
// CALCULATIONS
// ===============================


function calculateTotalIncome(){

    return incomes.reduce(

        (total,income)=>

        total + income.amount,

        0

    );

}



function calculateTotalExpense(){

    return expenses.reduce(

        (total,expense)=>

        total + expense.amount,

        0

    );

}



// ===============================
// UPDATE CARDS
// ===============================


function updateSummary(){


    const income =
    calculateTotalIncome();


    const expense =
    calculateTotalExpense();



    totalIncome.textContent =

    `₹${income}`;



    totalExpense.textContent =

    `₹${expense}`;



    cashInHand.textContent =

    `₹${income-expense}`;


}



// ===============================
// DISPLAY TRANSACTIONS
// ===============================


function displayTransactions(){


    transactionContainer.innerHTML="";



    const transactions = [


        ...incomes.map(item=>({

            ...item,

            type:"income"

        })),


        ...expenses.map(item=>({

            ...item,

            type:"expense"

        }))


    ];



    // Latest first

    transactions.sort(

        (a,b)=>

        new Date(b.date).getTime()

        -

        new Date(a.date).getTime()

    );



    if(transactions.length===0){


        transactionContainer.innerHTML=`

        <div class="empty">

        <i class="fa-solid fa-folder-open"></i>

        <p>No Transactions Yet</p>

        </div>

        `;


        return;

    }



    transactions.forEach(transaction=>{


        const div=document.createElement("div");


        div.className="transaction";



        div.innerHTML=`


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

""

}

</p>


        </div>



        <div class="right">


            <span class="amount 

            ${transaction.type}">

            ${transaction.type==="income"

            ? "+"

            : "-"

            }

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

function formatDate(date:string){

    return new Date(date)
    .toLocaleDateString(
        "en-IN",
        {
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );

}

function filterTransactions(){


    


    const type =
    filterType.value;



    transactionContainer.innerHTML="";



    const filtered = [

        ...incomes.map(item=>({

            ...item,

            type:"income"

        })),

        ...expenses.map(item=>({

            ...item,

            type:"expense"

        }))

    ].filter(item=>{


        const matchText =

        item.description
        .toLowerCase()
        



        const matchType =

        type==="all"

        ||

        item.type===type;



        return matchText && matchType;


    });



    if(filtered.length===0){


        transactionContainer.innerHTML=

        `

        <div class="empty">

        <i class="fa-solid fa-search"></i>

        <p>No Matching Transactions</p>

        </div>

        `;


        return;

    }



    filtered.forEach(transaction=>{


        // reuse display logic

    });


}



// ===============================
// DELETE FUNCTION
// ===============================


function deleteTransaction(

type:string,

id:number

){



    if(!confirm("Delete this transaction?"))

    return;



    if(type==="income"){


        incomes=incomes.filter(

            item=>item.id!==id

        );


        localStorage.setItem(

            "income",

            JSON.stringify(incomes)

        );


    }


    else{


        expenses=expenses.filter(

            item=>item.id!==id

        );


        localStorage.setItem(

            "expense",

            JSON.stringify(expenses)

        );


    }



    updateSummary();


    displayTransactions();


}



// ===============================
// EDIT FUNCTION
// ===============================


function editTransaction(

type:string,

id:number

){


    if(type==="income"){


        window.location.href=

        `add-income.html?id=${id}`;


    }

    else{


        window.location.href=

        `add-expense.html?id=${id}`;


    }


}





// Make functions available to HTML

(window as any).deleteTransaction =
deleteTransaction;


(window as any).editTransaction =
editTransaction;



// ===============================
// START APP
// ===============================

updateSummary();

displayTransactions();


// ===============================
// SEARCH & FILTER EVENTS
// ===============================




filterType.addEventListener(
    "change",
    filterTransactions
);
























export {};