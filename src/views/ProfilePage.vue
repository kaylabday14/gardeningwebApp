<template>
    <div class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <button @click="handleBack" class="back-btn">← Back</button>
          <h1>Profile</h1>
        </div>
        
        <!-- View Mode -->
        <div v-if="!isEditing" class="profile-content">
          <h2>User Information</h2>
          <p>Username: {{ username }}</p>
          <p>First Name: {{ firstName }}</p>
          <p>Last Name: {{ lastName }}</p>
          <p>Email: {{ email }}</p>
          <div class="profile-actions">
            <button @click="startEditing" class="edit-btn">Edit Profile</button>
            <button @click="handleDeleteAccount" class="delete-btn">Delete Account</button>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div v-if="isEditing" class="profile-content">
          <h2>Edit Profile</h2>
          <form @submit.prevent="saveChanges">
            <div class="form-group">
              <label>Username (read-only)</label>
              <input type="text" :value="username" disabled />
            </div>
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="editFirstName" required />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="editLastName" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="editEmail" required />
            </div>
            <div class="profile-actions">
              <button type="submit" class="save-btn">Save Changes</button>
              <button @click="cancelEditing" class="cancel-btn">Cancel</button>
              <button @click="deleteAccount" class="delete-btn">Delete Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="delete-modal-overlay">
      <div class="delete-modal">
        <div class="modal-header">
          <h3>��️ Delete Account</h3>
          <button @click="cancelDelete" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-content">
          <p class="warning-text">⚠️ This action cannot be undone!</p>
          <p>All your data will be permanently deleted from the system.</p>
          
          <div class="form-group">
            <label for="delete-password">Enter your password to confirm:</label>
            <input 
              type="password" 
              id="delete-password"
              v-model="deletePassword"
              placeholder="Enter your password"
              required
              class="delete-password-input"
            />
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="confirmDelete" class="confirm-delete-btn" :disabled="!deletePassword">
            Delete Account
          </button>
          <button @click="cancelDelete" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted  } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state variables
const username = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const isEditing = ref(false)
const editFirstName = ref('')
const editLastName = ref('')
const editEmail = ref('')
const showDeleteModal = ref(false)
const deletePassword = ref('')

// Add user data to the local storage for the session.
onMounted(() => {
  username.value = localStorage.getItem('username') || ''
  firstName.value = localStorage.getItem('firstName') || ''
  lastName.value = localStorage.getItem('lastName') || ''
  email.value = localStorage.getItem('email') || ''
  
  // Initialize edit form with current values
  editFirstName.value = firstName.value
  editLastName.value = lastName.value
  editEmail.value = email.value
})

// Handle back navigation to return to home page
const handleBack = () => {
  router.push('/home')
}

// Start editing mode
const startEditing = () => {
  isEditing.value = true
  editFirstName.value = firstName.value
  editLastName.value = lastName.value
  editEmail.value = email.value
}

// Cancel editing and revert changes
const cancelEditing = () => {
  isEditing.value = false
  editFirstName.value = firstName.value
  editLastName.value = lastName.value
  editEmail.value = email.value
}

// Save profile changes
const saveChanges = async () => {
  try {
    // Show loading state
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;

    // Call backend API to update profile
    const response = await fetch('http://localhost:3001/api/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        first_name: editFirstName.value,
        last_name: editLastName.value,
        email: editEmail.value
      })
    });

    const data = await response.json();

    if (data.success) {
      // Update local state
      firstName.value = editFirstName.value;
      lastName.value = editLastName.value;
      email.value = editEmail.value;
      
      // Update localStorage
      localStorage.setItem('firstName', firstName.value);
      localStorage.setItem('lastName', lastName.value);
      localStorage.setItem('email', email.value);
      
      isEditing.value = false;
      alert('Profile updated successfully!');
    } else {
      alert(data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Profile update error:', error);
    alert('Failed to update profile. Please try again.')
  } finally {
    // Reset button state
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
      saveBtn.textContent = 'Save Changes';
      saveBtn.disabled = false;
    }
  }
}

// Handle delete account
const handleDeleteAccount = () => {
  showDeleteModal.value = true
  deletePassword.value = ''
}

// Cancel delete account modal
const cancelDelete = () => {
  showDeleteModal.value = false
  deletePassword.value = ''
}

// Confirm and execute account deletion
const confirmDelete = async () => {
  if (!deletePassword.value) {
    alert('Please enter your password');
    return;
  }

  try {
    const response = await fetch('http://localhost:3001/api/delete-account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: deletePassword.value
      })
    });

    const data = await response.json();

    if (data.success) {
      // Clear localStorage and redirect to login
      localStorage.clear();
      alert('Account deleted successfully. You will be redirected to login.');
      router.push('/login');
    } else {
      alert(data.message || 'Failed to delete account');
      deletePassword.value = ''; // Clear password field on error
    }
  } catch (error) {
    console.error('Delete account error:', error);
    alert('Network error. Please try again.');
  }
}

// Delete account (for edit mode)
const deleteAccount = () => {
  handleDeleteAccount()
}

</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #66eac2 0%, #03754f 100%);
  padding: 20px;
}

.profile-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-header {
  position: relative;
  text-align: center;
  margin-bottom: 32px;
}

.back-btn {
  position: absolute;
  left: 70%;
  top: 1%;
  transform: none;
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
}

.profile-header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 2rem;
}

.profile-content {
  margin-bottom: 32px;
}

.profile-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.4rem;
  border-bottom: 2px solid #66eac9;
  padding-bottom: 8px;
}

.profile-content p {
  color: #2c3e50;
  margin: 12px 0;
  padding: 12px;
  background: rgba(102, 234, 194, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 234, 194, 0.2);
  font-size: 1rem;
}

.profile-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.edit-btn {
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.edit-btn:hover {
  transform: translateY(-2px);
}

.save-btn {
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.cancel-btn:hover {
  transform: translateY(-2px);
}

.delete-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.delete-btn:hover {
  transform: translateY(-2px);
}

/* Form styling for edit mode */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
  color: #2c3e50;
}

.form-group input:focus {
  outline: none;
  border-color: #66eac9;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

/* Form submit handling */
form {
  display: flex;
  flex-direction: column;
}

form .profile-actions {
  margin-top: 24px;
}

/* Delete Account Modal Styles */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.delete-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-content {
  padding: 24px;
}

.warning-text {
  color: #e74c3c;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.modal-content p {
  color: #2c3e50;
  margin: 8px 0;
  line-height: 1.5;
}

.modal-content .form-group {
  margin-top: 20px;
}

.delete-password-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
  color: #2c3e50;
}

.delete-password-input:focus {
  outline: none;
  border-color: #e74c3c;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
  justify-content: flex-end;
}

.confirm-delete-btn {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.confirm-delete-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.confirm-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.modal-actions .cancel-btn {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.modal-actions .cancel-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-actions {
    flex-direction: column;
  }
  
  .back-btn {
    position: static;
    transform: none;
    margin-bottom: 16px;
    align-self: flex-start;
  }
}
</style>