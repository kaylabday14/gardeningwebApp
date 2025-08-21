<template>
    <div class="settings-container">
      <div class="settings-card">
        <div class="settings-header">
            <button @click="handleBack" class="back-btn">← Back</button>
            <h1>⚙️ Settings</h1>
        </div>
        <div class="settings-content">
          <h2>Application Settings</h2>
          <div class="setting-item">
            <label>Theme</label>
            <select v-model="selectedTheme" class="setting-input">
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Notifications</label>
            <input type="checkbox" v-model="notificationsEnabled" class="setting-checkbox">
          </div>
          <div class="setting-item">
            <label>Language</label>
            <select v-model="selectedLanguage" class="setting-input">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <div class="settings-actions">
          <button @click="saveSettings" class="save-btn">Save Settings</button>
          <button @click="resetSettings" class="reset-btn">Reset to Default</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Settings state
const selectedTheme = ref('light')
const notificationsEnabled = ref(true)
const selectedLanguage = ref('en')

onMounted(() => {
  // Load saved settings from localStorage
  selectedTheme.value = localStorage.getItem('theme') || 'light'
  notificationsEnabled.value = localStorage.getItem('notifications') !== 'false'
  selectedLanguage.value = localStorage.getItem('language') || 'en'
})

const handleBack = () => {
  router.push('/home')
}

const saveSettings = () => {
  // Save settings to localStorage
  localStorage.setItem('theme', selectedTheme.value)
  localStorage.setItem('notifications', notificationsEnabled.value.toString())
  localStorage.setItem('language', selectedLanguage.value)
  
  // TODO: Send to backend if needed
  alert('Settings saved successfully!')
}

const resetSettings = () => {
  selectedTheme.value = 'light'
  notificationsEnabled.value = true
  selectedLanguage.value = 'en'
  
  // Clear localStorage
  localStorage.removeItem('theme')
  localStorage.removeItem('notifications')
  localStorage.removeItem('language')
}
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #66eac2 0%, #03754f 100%);
  padding: 20px;
}

.settings-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.settings-header {
  position: relative;
  text-align: left;
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

.settings-header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 2rem;
}

.settings-content {
  margin-bottom: 32px;
}

.settings-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.4rem;
  border-bottom: 2px solid #66eac9;
  padding-bottom: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  padding: 16px;
  background: rgba(102, 234, 194, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(102, 234, 194, 0.2);
}

.setting-item label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1rem;
}

.setting-input {
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: #2c3e50;
}

.setting-input:focus {
  outline: none;
  border-color: #66eac9;
}

.setting-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #66eac9;
}

.settings-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
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

.reset-btn {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .settings-actions {
    flex-direction: column;
  }
  
  .back-btn {
    position: static;
    transform: none;
    margin-bottom: 16px;
    align-self: flex-start;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
