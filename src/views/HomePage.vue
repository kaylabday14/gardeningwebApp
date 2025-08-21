<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <h1>🌱 Welcome to Your Garden, {{ displayName }}!</h1>
        <button @click="handleProfile" class="user-controls-btn">Profile</button>
        <button @click="handleSettings" class="user-controls-btn">Settings</button>
        <button @click="handleLogout" class="user-controls-btn">Logout</button>
      </div>
    </header>
    
    <main class="main-content">
      <div class="dashboard-grid">
        <div class="card garden-overview">
          <h2>🌿 Garden Overview</h2>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">12</span>
              <span class="stat-label">Active Plants</span>
            </div>
            <div class="stat">
              <span class="stat-number">3</span>
              <span class="stat-label">Garden Beds</span>
            </div>
            <div class="stat">
              <span class="stat-number">85%</span>
              <span class="stat-label">Health Score</span>
            </div>
          </div>
        </div>
        
        <div class="card quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div class="action-buttons">
            <button class="action-btn">🌱 Add Plant</button>
            <button class="action-btn">💧 Water Plants</button>
            <button class="action-btn">📝 Log Activity</button>
            <button class="action-btn">📊 View Reports</button>
          </div>
        </div>
        
        <div class="card recent-activities">
          <h2>📅 Recent Activities</h2>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-icon">💧</span>
              <div class="activity-details">
                <span class="activity-title">Watered tomatoes</span>
                <span class="activity-time">2 hours ago</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-icon">🌱</span>
              <div class="activity-details">
                <span class="activity-title">Planted basil seeds</span>
                <span class="activity-time">1 day ago</span>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-icon">✂️</span>
              <div class="activity-details">
                <span class="activity-title">Pruned roses</span>
                <span class="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card weather-widget">
          <h2>🌤️ Weather</h2>
          <div class="weather-info">
            <div class="weather-main">
              <span class="temperature">72°F</span>
              <span class="condition">Partly Cloudy</span>
            </div>
            <div class="weather-details">
              <span>Humidity: 65%</span>
              <span>Wind: 8 mph</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const displayName = ref('Gardener')

// Add user data to the local storage for the session.
onMounted(() => {
  username.value = localStorage.getItem('username') || ''
  firstName.value = localStorage.getItem('firstName') || ''
  lastName.value = localStorage.getItem('lastName') || ''
  email.value = localStorage.getItem('email') || ''

  if (firstName.value) {
    displayName.value = firstName.value
  } else if (username.value) {
    displayName.value = username.value
  } else {
    displayName.value = 'Gardener'
  }
})

// Handle logout by removing the user data from the local storage and redirecting to the login page.
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  localStorage.removeItem('firstName')
  localStorage.removeItem('lastName')
  localStorage.removeItem('email')
  router.push('/login')
}

// Handle profile by navigating to the profile page.
const handleProfile = () => {
  router.push('/profile')
}

// Handle settings by navigating to the settings page.
const handleSettings = () => {
  router.push('/settings')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #66eac2 0%, #03754f 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.user-controls-btn {
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  margin: 0 0 0 10px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

/* Push the button group to the right */
.user-controls-btn:first-of-type {
  margin-left: 10px auto;
}

.user-controls-btn:hover {
  transform: translateY(-2px);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.card h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #66eac9;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  background: linear-gradient(135deg, #66eac9 0%, #1b3221 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(102, 234, 194, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 234, 194, 0.2);
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-details {
  display: flex;
  flex-direction: column;
}

.activity-title {
  font-weight: 600;
  color: #2c3e50;
}

.activity-time {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.weather-info {
  text-align: center;
}

.weather-main {
  margin-bottom: 16px;
}

.temperature {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: #66eac9;
}

.condition {
  display: block;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
