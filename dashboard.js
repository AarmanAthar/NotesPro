// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = 'index.html';
        return;
    }

    // Check subscription status
    if (!loggedInUser.subscribed) {
        alert('Your subscription has expired! Please renew to access premium content.');
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard(loggedInUser);
    setupEventListeners();
    loadDailyUpdates(); // Load updates by default
});

function initializeDashboard(user) {
    // Set user info
    document.getElementById('userWelcome').textContent = `Welcome, ${user.name}`;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('subscriptionStatus').textContent = user.subscribed ? '✅ Active Subscription' : '❌ Subscription Expired';
    document.getElementById('watermarkUser').textContent = user.name;
}

function setupEventListeners() {
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    });

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            const section = this.dataset.section;
            const subject = this.dataset.subject;

            // Hide sidebar on mobile after selection
            if (window.innerWidth < 1024) {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }

            loadContent(section, subject);
        });
    });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        }
    });

    // File modal functionality
    document.getElementById('closeModal').addEventListener('click', closeFileModal);
    document.getElementById('fileModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeFileModal();
        }
    });
}

function loadContent(section, subject = null) {
    const contentArea = document.getElementById('contentArea');
    
    switch(section) {
        case 'updates':
            loadDailyUpdates();
            break;
        case 'notes':
            loadNotes(subject);
            break;
        case 'assignments':
            loadAssignments(subject);
            break;
        case 'quizzes':
            loadQuizzes();
            break;
        case 'papers':
            loadPastPapers();
            break;
        case 'cheatsheets':
            loadCheatSheets();
            break;
        case 'doubts':
            loadDoubts();
            break;
        default:
            loadDailyUpdates();
    }
}

function loadDailyUpdates() {
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-bell text-blue-500 mr-2"></i>Daily Updates
            </h2>
            <p class="text-gray-600">Stay updated with the latest announcements and resources</p>
        </div>
        <div class="space-y-4">
    `;

    updates.forEach(update => {
        const typeColors = {
            success: 'border-green-200 bg-green-50',
            warning: 'border-yellow-200 bg-yellow-50', 
            info: 'border-blue-200 bg-blue-50',
            tip: 'border-purple-200 bg-purple-50'
        };

        const typeIcons = {
            success: 'fas fa-check-circle text-green-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500',
            tip: 'fas fa-lightbulb text-purple-500'
        };

        html += `
            <div class="border-l-4 ${typeColors[update.type]} p-4 rounded-r-lg">
                <div class="flex items-start">
                    <i class="${typeIcons[update.type]} mr-3 mt-1"></i>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-sm font-medium text-gray-500">${formatDate(update.date)}</span>
                            ${update.priority === 'high' ? '<span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">High Priority</span>' : ''}
                        </div>
                        <p class="text-gray-700">${update.message}</p>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    contentArea.innerHTML = html;
}

function loadNotes(subject) {
    const contentArea = document.getElementById('contentArea');
    const notes = notesData[subject] || [];
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-book text-green-500 mr-2"></i>${subject} - Notes
            </h2>
            <p class="text-gray-600">Access your premium study materials</p>
        </div>
    `;

    if (notes.length === 0) {
        html += `
            <div class="text-center py-12">
                <i class="fas fa-folder-open text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No notes available for this subject yet.</p>
            </div>
        `;
    } else {
        html += '<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">';
        notes.forEach((note, index) => {
            html += createFileCard(note, index, 'note');
        });
        html += '</div>';
    }

    contentArea.innerHTML = html;
    attachFileCardListeners();
}

function loadAssignments(subject) {
    const contentArea = document.getElementById('contentArea');
    const assignments = assignmentsData[subject] || [];
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-tasks text-orange-500 mr-2"></i>${subject} - Assignments
            </h2>
            <p class="text-gray-600">Complete your assignments and track progress</p>
        </div>
    `;

    if (assignments.length === 0) {
        html += `
            <div class="text-center py-12">
                <i class="fas fa-clipboard-list text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No assignments available for this subject yet.</p>
            </div>
        `;
    } else {
        html += '<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">';
        assignments.forEach((assignment, index) => {
            html += createAssignmentCard(assignment, index);
        });
        html += '</div>';
    }

    contentArea.innerHTML = html;
    attachFileCardListeners();
}

function loadQuizzes() {
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-question-circle text-yellow-500 mr-2"></i>Weekly Quizzes
            </h2>
            <p class="text-gray-600">Test your knowledge with our weekly assessments</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    `;

    quizzesData.forEach((quiz, index) => {
        html += `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="font-semibold text-lg text-gray-800">${quiz.title}</h3>
                    <i class="fas fa-calendar-alt text-yellow-500"></i>
                </div>
                <p class="text-gray-600 text-sm mb-4">${quiz.description}</p>
                <div class="space-y-2 text-sm text-gray-500 mb-4">
                    <div><i class="fas fa-question mr-2"></i>${quiz.questions} questions</div>
                    <div><i class="fas fa-clock mr-2"></i>${quiz.timeLimit}</div>
                    <div><i class="fas fa-calendar mr-2"></i>Due: ${formatDate(quiz.date)}</div>
                </div>
                <button class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    <i class="fas fa-play mr-2"></i>Start Quiz
                </button>
            </div>
        `;
    });

    html += '</div>';
    contentArea.innerHTML = html;
}

function loadPastPapers() {
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-file-alt text-red-500 mr-2"></i>Past Papers
            </h2>
            <p class="text-gray-600">Previous year examination papers for practice</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    `;

    pastPapersData.forEach((paper, index) => {
        html += createFileCard(paper, index, 'paper', {
            year: paper.year,
            semester: paper.semester
        });
    });

    html += '</div>';
    contentArea.innerHTML = html;
    attachFileCardListeners();
}

function loadCheatSheets() {
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-sticky-note text-pink-500 mr-2"></i>Cheat Sheets
            </h2>
            <p class="text-gray-600">Quick reference guides for all subjects</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    `;

    cheatSheetsData.forEach((sheet, index) => {
        html += createFileCard(sheet, index, 'cheatsheet', {
            subject: sheet.subject
        });
    });

    html += '</div>';
    contentArea.innerHTML = html;
    attachFileCardListeners();
}

function loadDoubts() {
    const contentArea = document.getElementById('contentArea');
    
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                <i class="fas fa-comments text-teal-500 mr-2"></i>Doubts & Updates
            </h2>
            <p class="text-gray-600">Community Q&A and discussion forum</p>
        </div>
        <div class="space-y-4">
    `;

    doubtsData.forEach(doubt => {
        const statusColor = doubt.resolved ? 'text-green-600' : 'text-orange-600';
        const statusIcon = doubt.resolved ? 'fas fa-check-circle' : 'fas fa-clock';
        
        html += `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center space-x-2">
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">${doubt.subject}</span>
                        <span class="${statusColor}">
                            <i class="${statusIcon} mr-1"></i>
                            ${doubt.resolved ? 'Resolved' : 'Pending'}
                        </span>
                    </div>
                    <span class="text-sm text-gray-500">${formatDate(doubt.date)}</span>
                </div>
                <h3 class="font-semibold text-lg mb-2">${doubt.question}</h3>
                <p class="text-gray-600 mb-3">${doubt.answer}</p>
                <div class="text-sm text-gray-500">
                    Asked by: ${doubt.askedBy}
                </div>
            </div>
        `;
    });

    html += '</div>';
    contentArea.innerHTML = html;
}

function createFileCard(file, index, type, extraData = {}) {
    const typeIcon = file.type === 'pdf' ? 'fas fa-file-pdf text-red-500' : 'fas fa-image text-green-500';
    const typeColor = file.type === 'pdf' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
    
    let extraInfo = '';
    if (extraData.year && extraData.semester) {
        extraInfo = `<div class="text-sm text-gray-500 mb-2">${extraData.year} - ${extraData.semester}</div>`;
    } else if (extraData.subject) {
        extraInfo = `<div class="text-sm text-gray-500 mb-2">${extraData.subject}</div>`;
    } else if (file.date) {
        extraInfo = `<div class="text-sm text-gray-500 mb-2">${formatDate(file.date)}</div>`;
    }

    return `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <i class="${typeIcon}"></i>
                    <h3 class="font-semibold text-gray-800">${file.title}</h3>
                </div>
            </div>
            ${extraInfo}
            <p class="text-gray-600 text-sm mb-4">${file.description}</p>
            <div class="flex space-x-2">
                <button onclick="viewFile('${file.localUrl}', '${file.title}', '${file.type}')" 
                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition duration-300">
                    <i class="fas fa-eye mr-1"></i>View Here
                </button>
                <button onclick="window.open('${file.driveUrl}', '_blank')" 
                        class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition duration-300">
                    <i class="fab fa-google-drive mr-1"></i>Drive View
                </button>
            </div>
        </div>
    `;
}

function createAssignmentCard(assignment, index) {
    const isUpcoming = new Date(assignment.dueDate) > new Date();
    const dueDateColor = isUpcoming ? 'text-green-600' : 'text-red-600';
    
    return `
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition duration-300">
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-file-pdf text-red-500"></i>
                    <h3 class="font-semibold text-gray-800">${assignment.title}</h3>
                </div>
            </div>
            <div class="text-sm ${dueDateColor} mb-2">
                <i class="fas fa-calendar mr-1"></i>Due: ${formatDate(assignment.dueDate)}
            </div>
            <p class="text-gray-600 text-sm mb-4">${assignment.description}</p>
            <div class="flex space-x-2">
                <button onclick="viewFile('${assignment.localUrl}', '${assignment.title}', '${assignment.type}')" 
                        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm transition duration-300">
                    <i class="fas fa-eye mr-1"></i>View Here
                </button>
                <button onclick="window.open('${assignment.driveUrl}', '_blank')" 
                        class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm transition duration-300">
                    <i class="fab fa-google-drive mr-1"></i>Drive View
                </button>
            </div>
        </div>
    `;
}

function attachFileCardListeners() {
    // This function can be used to attach any additional event listeners to file cards
    console.log('File card listeners attached');
}

function viewFile(url, title, type) {
    const modal = document.getElementById('fileModal');
    const fileTitle = document.getElementById('fileTitle');
    const fileContent = document.getElementById('fileContent');
    
    fileTitle.textContent = title;
    
    if (type === 'pdf') {
        fileContent.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-file-pdf text-6xl text-red-500 mb-4"></i>
                <p class="text-lg font-semibold mb-2">PDF Viewer</p>
                <p class="text-gray-600 mb-4">Click the button below to open the PDF</p>
                <button onclick="window.open('${url}', '_blank')" 
                        class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300">
                    <i class="fas fa-external-link-alt mr-2"></i>Open PDF
                </button>
            </div>
        `;
    } else {
        fileContent.innerHTML = `
            <div class="text-center">
                <img src="${url}" alt="${title}" class="max-w-full h-auto rounded-lg shadow-lg">
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

function closeFileModal() {
    document.getElementById('fileModal').classList.add('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Security functions
function disableShortcuts(event) {
    // Disable common shortcuts
    if (event.ctrlKey && (event.key === 's' || event.key === 'u' || event.key === 'a')) {
        event.preventDefault();
        return false;
    }
    if (event.key === 'F12') {
        event.preventDefault();
        return false;
    }
    return true;
}

// Disable console
console.log = function() {};
console.error = function() {};
console.warn = function() {};

// Basic protection against copy-paste
document.addEventListener('selectstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});