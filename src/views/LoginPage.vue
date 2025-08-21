<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🌱 Gardening App</h1>
        <p>{{ isSignup ? 'Create your garden account' : 'Welcome back! Please sign in to your garden.' }}</p>
      </div>
      
      <!-- Toggle between Login and Signup -->
      <div class="toggle-container">
        <button 
          @click="isSignup = false" 
          :class="['toggle-btn', { active: !isSignup }]"
        >
          Sign In
        </button>
        <button 
          @click="isSignup = true" 
          :class="['toggle-btn', { active: isSignup }]"
        >
          Sign Up
        </button>
      </div>
      
      <!-- Login Form -->
      <form v-if="!isSignup" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="login-username">Username</label>
          <input 
            type="text" 
            id="login-username" 
            v-model="loginUsername" 
            required 
            placeholder="Enter your username"
          />
        </div>
        
        <div class="form-group">
          <label for="login-password">Password</label>
          <input 
            type="password" 
            id="login-password" 
            v-model="loginPassword" 
            required 
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <!-- Signup Form -->
      <form v-if="isSignup" @submit.prevent="handleSignup" class="login-form">
        <div class="form-group">
          <label for="signup-first-name">First Name</label>
          <input 
            type="text" 
            id="signup-first-name" 
            v-model="signupFirstName" 
            required 
            placeholder="Enter your first name"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-last-name">Last Name</label>
          <input 
            type="text" 
            id="signup-last-name" 
            v-model="signupLastName" 
            required 
            placeholder="Enter your last name"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-username">Username</label>
          <input 
            type="text" 
            id="signup-username" 
            v-model="signupUsername" 
            required 
            placeholder="Choose a username"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-email">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            v-model="signupEmail" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            v-model="signupPassword" 
            required 
            placeholder="Choose a password"
          />
        </div>
        
        <div class="form-group">
          <label for="signup-confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="signup-confirm-password" 
            v-model="signupConfirmPassword" 
            required 
            placeholder="Confirm your password"
          />
        </div>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form state
const isSignup = ref(false)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

// Login form data
const loginUsername = ref('')
const loginPassword = ref('')

// Signup form data
const signupFirstName = ref('')
const signupLastName = ref('')
const signupUsername = ref('')
const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirmPassword = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: loginUsername.value,
        password: loginPassword.value
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('firstName', data.user.first_name)
      localStorage.setItem('lastName', data.user.last_name)
      localStorage.setItem('email', data.user.email)
      router.push('/home')
    } else {
      error.value = data.message || 'Login failed'
    }
  } catch (err) {
    error.value = 'Network error. Please check your connection.'
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Validate passwords match
    if (signupPassword.value !== signupConfirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    
    // Validate password length
    if (signupPassword.value.length < 6) {
      error.value = 'Password must be at least 6 characters long'
      return
    }
    
    const response = await fetch('http://localhost:3001/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: signupFirstName.value,
        last_name: signupLastName.value,
        username: signupUsername.value,
        email: signupEmail.value,
        password: signupPassword.value
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      success.value = 'Account created successfully! You can now sign in.'
      
      // Clear form
      signupFirstName.value = ''
      signupLastName.value = ''
      signupUsername.value = ''
      signupEmail.value = ''
      signupPassword.value = ''
      signupConfirmPassword.value = ''
      
      // Switch back to login mode
      setTimeout(() => {
        isSignup.value = false
        success.value = ''
      }, 2000)
    } else {
      error.value = data.message || 'Signup failed'
    }
    
  } catch (err) {
    error.value = 'Network error. Please check your connection.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #66eac2 0%, #03754f 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 2rem;
}

.login-header p {
  color: #7f8c8d;
  margin: 0;
}

.toggle-container {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
}

.toggle-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #7f8c8d;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: white;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toggle-btn:hover:not(.active) {
  color: #2c3e50;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #66eac9;
}

.login-btn {
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  border: 1px solid #feb2b2;
}

.success-message {
  background: #f0fff4;
  color: #38a169;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  border: 1px solid #9ae6b4;
}
</style>
