// App State
let studentsState = [];
let editingStudentId = null;
let deletingStudentId = null;

// DOM Elements
const loader = document.getElementById('loader');
const studentsList = document.getElementById('students-list');
const emptyState = document.getElementById('empty-state');
const studentForm = document.getElementById('student-form');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

// Form Fields
const studentIdInput = document.getElementById('student-id');
const studentNameInput = document.getElementById('student-name');
const studentAgeInput = document.getElementById('student-age');
const studentEmailInput = document.getElementById('student-email');
const btnSubmit = document.getElementById('btn-submit');
const btnSubmitText = document.getElementById('btn-text');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statAvgAge = document.getElementById('stat-avg-age');
const statLatest = document.getElementById('stat-latest');
const statLatestEmail = document.getElementById('stat-latest-email');

// Modal Elements
const deleteModal = document.getElementById('delete-modal');
const deleteStudentNameSpan = document.getElementById('delete-student-name');
const btnDeleteCancel = document.getElementById('btn-delete-cancel');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');

// Shortcuts
const btnAddShortcut = document.getElementById('btn-add-shortcut');
const formContainer = document.getElementById('form-container');

// Sidebar nav items
const navDashboard = document.getElementById('nav-dashboard');
const navStudents = document.getElementById('nav-students');

// Toast Notification Helper
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'bx-check-circle';
    if (type === 'error') iconClass = 'bx-x-circle';
    if (type === 'info') iconClass = 'bx-info-circle';
    
    toast.innerHTML = `
        <i class="bx ${iconClass} toast-icon"></i>
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    // Fade out and remove
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// Show/Hide Loader
function showLoader() {
    loader.classList.add('active');
}

function hideLoader() {
    loader.classList.remove('active');
}

// Format Date Helper
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch {
        return 'N/A';
    }
}

// API Functions
async function fetchStudents() {
    showLoader();
    try {
        const response = await fetch('/students');
        const result = await response.json();
        
        if (result.success) {
            studentsState = result.data || [];
            renderUI();
        } else {
            showToast(result.message || 'Failed to fetch students', 'error');
        }
    } catch (error) {
        console.error('API Error:', error);
        showToast('Network error while loading database records', 'error');
    } finally {
        hideLoader();
    }
}

async function createStudent(data) {
    showLoader();
    try {
        const response = await fetch('/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Student enrolled successfully!');
            resetForm();
            await fetchStudents();
        } else {
            showToast(result.message || 'Failed to enroll student', 'error');
        }
    } catch (error) {
        console.error('API Error:', error);
        showToast('Network error while saving student profile', 'error');
    } finally {
        hideLoader();
    }
}

async function updateStudent(id, data) {
    showLoader();
    try {
        const response = await fetch(`/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Student profile updated successfully!');
            resetForm();
            await fetchStudents();
        } else {
            showToast(result.message || 'Failed to update student profile', 'error');
        }
    } catch (error) {
        console.error('API Error:', error);
        showToast('Network error while updating student profile', 'error');
    } finally {
        hideLoader();
    }
}

async function deleteStudent(id) {
    showLoader();
    try {
        const response = await fetch(`/students/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
            showToast('Student profile deleted');
            await fetchStudents();
        } else {
            showToast(result.message || 'Failed to delete student', 'error');
        }
    } catch (error) {
        console.error('API Error:', error);
        showToast('Network error while deleting student profile', 'error');
    } finally {
        hideLoader();
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = studentNameInput.value.trim();
    if (!name) {
        setFieldError('student-name', true);
        isValid = false;
    } else {
        setFieldError('student-name', false);
    }
    
    // Age validation
    const ageVal = studentAgeInput.value;
    const age = parseInt(ageVal, 10);
    if (!ageVal || isNaN(age) || age < 1 || age > 150) {
        setFieldError('student-age', true);
        isValid = false;
    } else {
        setFieldError('student-age', false);
    }
    
    // Email validation
    const email = studentEmailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        setFieldError('student-email', true);
        isValid = false;
    } else {
        setFieldError('student-email', false);
    }
    
    return isValid;
}

function setFieldError(fieldId, hasError) {
    const fieldElement = document.getElementById(fieldId);
    const formGroup = fieldElement.closest('.form-group');
    if (hasError) {
        formGroup.classList.add('has-error');
    } else {
        formGroup.classList.remove('has-error');
    }
}

// Reset Error States
function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
    });
}

// Render Operations
function renderUI() {
    updateStats();
    
    // Filter and Sort Students
    const query = searchInput.value.toLowerCase().trim();
    let filtered = studentsState.filter(student => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
    );
    
    const sortBy = sortSelect.value;
    filtered.sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortBy === 'age-asc') {
            return a.age - b.age;
        } else if (sortBy === 'age-desc') {
            return b.age - a.age;
        }
        return 0;
    });
    
    // Render list
    studentsList.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        document.getElementById('students-table').classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        document.getElementById('students-table').classList.remove('hidden');
        
        filtered.forEach(student => {
            // Get Avatar Initial
            const initial = student.name ? student.name.charAt(0).toUpperCase() : '?';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="student-name-cell">
                        <div class="student-avatar">${initial}</div>
                        <div>
                            <strong>${escapeHtml(student.name)}</strong>
                        </div>
                    </div>
                </td>
                <td>${student.age}</td>
                <td>${escapeHtml(student.email)}</td>
                <td class="student-date">${formatDate(student.createdAt)}</td>
                <td class="text-right">
                    <div class="actions-cell">
                        <button class="btn-icon btn-edit" data-id="${student.id}" title="Edit Profile">
                            <i class="bx bx-edit-alt"></i>
                        </button>
                        <button class="btn-icon btn-icon-danger btn-delete" data-id="${student.id}" title="Delete Profile">
                            <i class="bx bx-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Add Event Listeners
            tr.querySelector('.btn-edit').addEventListener('click', () => populateEditForm(student));
            tr.querySelector('.btn-delete').addEventListener('click', () => openDeleteModal(student));
            
            studentsList.appendChild(tr);
        });
    }
}

// Calculate and Update Dashboard Stats
function updateStats() {
    const total = studentsState.length;
    statTotal.textContent = total;
    
    if (total === 0) {
        statAvgAge.textContent = '0.0';
        statLatest.textContent = 'None';
        statLatestEmail.textContent = 'No records yet';
        return;
    }
    
    // Average Age
    const sumAge = studentsState.reduce((sum, s) => sum + Number(s.age), 0);
    const avg = sumAge / total;
    statAvgAge.textContent = avg.toFixed(1);
    
    // Latest Student (by createdAt)
    const sortedByDate = [...studentsState].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latest = sortedByDate[0];
    
    statLatest.textContent = latest.name;
    statLatestEmail.textContent = latest.email;
}

// Edit Mode Functions
function populateEditForm(student) {
    clearFormErrors();
    editingStudentId = student.id;
    
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentAgeInput.value = student.age;
    studentEmailInput.value = student.email;
    
    formTitle.textContent = 'Edit Profile';
    formSubtitle.textContent = 'Update student database records';
    btnSubmitText.textContent = 'Save Changes';
    btnCancelEdit.classList.remove('hidden');
    
    // Highlight Form Pane for better UX
    formContainer.scrollIntoView({ behavior: 'smooth' });
    studentNameInput.focus();
}

function resetForm() {
    clearFormErrors();
    editingStudentId = null;
    studentForm.reset();
    studentIdInput.value = '';
    
    formTitle.textContent = 'Enroll Student';
    formSubtitle.textContent = 'Create a new student profile in the system database';
    btnSubmitText.textContent = 'Submit Enrollment';
    btnCancelEdit.classList.add('hidden');
}

// Deletion Modal
function openDeleteModal(student) {
    deletingStudentId = student.id;
    deleteStudentNameSpan.textContent = student.name;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deletingStudentId = null;
    deleteModal.classList.add('hidden');
}

// Event Listeners
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const name = studentNameInput.value.trim();
    const age = parseInt(studentAgeInput.value, 10);
    const email = studentEmailInput.value.trim();
    
    const payload = { name, age, email };
    
    if (editingStudentId) {
        await updateStudent(editingStudentId, payload);
    } else {
        await createStudent(payload);
    }
});

btnCancelEdit.addEventListener('click', resetForm);

btnDeleteCancel.addEventListener('click', closeDeleteModal);

btnDeleteConfirm.addEventListener('click', async () => {
    if (deletingStudentId) {
        await deleteStudent(deletingStudentId);
        closeDeleteModal();
    }
});

// Closing Modal by clicking backdrop
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Search & Sort Inputs
searchInput.addEventListener('input', renderUI);
sortSelect.addEventListener('change', renderUI);

// Shortcut Buttons
btnAddShortcut.addEventListener('click', () => {
    resetForm();
    formContainer.scrollIntoView({ behavior: 'smooth' });
    studentNameInput.focus();
});

// Navigation logic (Mock dashboard switching)
navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    navDashboard.classList.add('active');
    navStudents.classList.remove('active');
    document.getElementById('page-title').textContent = 'Student Dashboard';
    document.getElementById('page-subtitle').textContent = 'Overview of institution enrollments and records';
    document.querySelector('.stats-row').classList.remove('hidden');
});

navStudents.addEventListener('click', (e) => {
    e.preventDefault();
    navStudents.classList.add('active');
    navDashboard.classList.remove('active');
    document.getElementById('page-title').textContent = 'Students Directory';
    document.getElementById('page-subtitle').textContent = 'Manage and filter database profiles';
    document.querySelector('.stats-row').classList.add('hidden');
});

// HTML Escaping Helper to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Initial Load
document.addEventListener('DOMContentLoaded', fetchStudents);
