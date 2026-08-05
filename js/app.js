// ICET API Endpoint URL Configuration
const API_BASE_URL = "https://your-api-domain.com/api/BankLoan";
const HEADERS = { "Content-Type": "application/json" };

// 1. Navigation View Switcher (SPA)
function switchTab(viewName) {
    const views = ['dashboard', 'new-app', 'check-status', 'auth'];
    views.forEach(v => {
        document.getElementById(`view-${v}`).classList.add('hidden');
        document.getElementById(`nav-${v}`).classList.remove('active');
    });

    document.getElementById(`view-${viewName}`).classList.remove('hidden');
    document.getElementById(`nav-${viewName}`).classList.add('active');

    const titleMap = {
        'dashboard': 'Bank Loan Overview Dashboard',
        'new-app': 'Submit New Bank Loan Application',
        'check-status': 'Check Loan Application Status',
        'auth': 'User Authentication & Registration'
    };
    document.getElementById('page-title').innerText = titleMap[viewName] || 'CrediCore System';
}

// 2. Auth Sub-Tab Switcher
function switchAuthSubTab(subTab) {
    const tabs = ['login', 'register-cust', 'register-bank'];
    const formMap = {
        'login': 'auth-login-form',
        'register-cust': 'auth-regcust-form',
        'register-bank': 'auth-regbank-form'
    };

    tabs.forEach(t => {
        document.getElementById(formMap[t]).classList.add('hidden');
        document.getElementById(`subtab-${t}`).classList.remove('active');
    });

    document.getElementById(formMap[subTab]).classList.remove('hidden');
    document.getElementById(`subtab-${subTab}`).classList.add('active');
}

// 3. Global Notification Alert System
function showAlert(msg, isSuccess = true) {
    const container = document.getElementById('alert-container');
    const colorClass = isSuccess ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    container.innerHTML = `
        <div class="p-4 rounded-xl border ${colorClass} text-xs font-semibold flex items-center justify-between">
            <span><i class="fa-solid fa-circle-info mr-2"></i> ${msg}</span>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white">&times;</button>
        </div>
    `;
}

// 4. API Endpoint Integration 1: Login (POST /api/BankLoan/login)
async function handleLogin(e) {
    e.preventDefault();
    const payload = {
        userName: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.result) {
            showAlert(data.message || "Login successful!", true);
            sessionStorage.setItem('user', JSON.stringify(data.data));
            switchTab('dashboard');
        } else {
            showAlert(data.message || "Invalid credentials", false);
        }
    } catch (err) {
        showAlert("Failed to connect to API server.", false);
    }
}

// 5. API Endpoint Integration 2: Submit Application (POST /api/BankLoan/AddNewApplication)
async function handleNewApplication(e) {
    e.preventDefault();
    const payload = {
        fullName: document.getElementById('app-fullName').value,
        panCard: document.getElementById('app-panCard').value,
        dateOfBirth: document.getElementById('app-dob').value,
        email: document.getElementById('app-email').value,
        phone: document.getElementById('app-phone').value,
        address: document.getElementById('app-address').value,
        annualIncome: parseFloat(document.getElementById('app-annualIncome').value),
        employmentStatus: document.getElementById('app-employmentStatus').value,
        creditScore: parseInt(document.getElementById('app-creditScore').value),
        assets: document.getElementById('app-assets').value,
        customerId: parseInt(document.getElementById('app-customerId').value),
        loans: []
    };

    try {
        const res = await fetch(`${API_BASE_URL}/AddNewApplication`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.result) {
            showAlert("Application submitted successfully!", true);
            document.getElementById('form-new-app').reset();
            switchTab('dashboard');
        } else {
            showAlert(data.message || "Failed to submit application.", false);
        }
    } catch (err) {
        showAlert("Error connecting to server.", false);
    }
}

// 6. API Endpoint Integration 3: Status Verification (GET /api/BankLoan/CheckApplicationStatus)
async function handleCheckStatus(e) {
    e.preventDefault();
    const panCard = document.getElementById('status-panCard').value;
    const status = document.getElementById('status-filter').value;

    try {
        const res = await fetch(`${API_BASE_URL}/CheckApplicationStatus?panCard=${encodeURIComponent(panCard)}&status=${encodeURIComponent(status)}`);
        const data = await res.json();

        const resultDiv = document.getElementById('status-result');
        resultDiv.classList.remove('hidden');

        if (data.result) {
            resultDiv.innerHTML = `
                <div class="text-xs space-y-2">
                    <p class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> Match Found</p>
                    <p class="text-slate-300">${data.message || 'Status query completed.'}</p>
                    <pre class="bg-slate-950 p-3 rounded-lg text-slate-400 overflow-x-auto">${JSON.stringify(data.data, null, 2)}</pre>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="text-rose-400 text-xs font-semibold"><i class="fa-solid fa-circle-xmark"></i> ${data.message || 'No record found.'}</p>`;
        }
    } catch (err) {
        showAlert("Failed to query status.", false);
    }
}

// 7. API Endpoint Integration 4: Fetch All Applications (GET /api/BankLoan/GetAllApplications)
async function fetchAllApplications() {
    try {
        const res = await fetch(`${API_BASE_URL}/GetAllApplications`);
        const data = await res.json();
        if (data.result && Array.isArray(data.data)) {
            showAlert(`Loaded ${data.data.length} records.`, true);
        }
    } catch (err) {
        console.log("Using static template records.");
    }
}