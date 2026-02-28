// Create floating particles
function createParticles() {
  const container = document.getElementById('particles');
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

function getSeason(month) {
  if (month >= 2 && month <= 4) return { name: 'Spring', icon: '🌸', class: 'spring' };
  if (month >= 5 && month <= 7) return { name: 'Summer', icon: '☀️', class: 'summer' };
  if (month >= 8 && month <= 10) return { name: 'Autumn', icon: '🍂', class: 'autumn' };
  return { name: 'Winter', icon: '❄️', class: 'winter' };
}

function getNextMilestone(percent) {
  const milestones = [25, 50, 75, 100];
  for (let milestone of milestones) {
    if (percent < milestone) {
      return milestone;
    }
  }
  return 100;
}

function updateAll() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  const start = new Date(currentYear, 0, 1);
  const end = new Date(currentYear + 1, 0, 1);
  const oneHourAfterYear = new Date(end.getTime() + 60 * 60 * 1000);
  
  // Update year badge
  document.getElementById('yearBadge').textContent = currentYear;
  
  // Update season
  const season = getSeason(currentMonth);
  document.getElementById('seasonIndicator').innerHTML = `
    <span class="season-icon">${season.icon}</span>
    <span class="season-name">${season.name}</span>
  `;
  document.getElementById('seasonalOverlay').className = `seasonal-overlay ${season.class}`;
  
  // Calculate progress
  let percent = 0;
  let displayYear = currentYear;
  let isCompleted = false;
  
  if (now < start) {
    percent = 0;
  } else if (now >= end && now <= oneHourAfterYear) {
    percent = 100;
    isCompleted = true;
  } else if (now > oneHourAfterYear) {
    displayYear = currentYear + 1;
    const nextStart = new Date(displayYear, 0, 1);
    const nextEnd = new Date(displayYear + 1, 0, 1);
    percent = ((now - nextStart) / (nextEnd - nextStart)) * 100;
    document.getElementById('yearBadge').textContent = displayYear;
  } else {
    percent = ((now - start) / (end - start)) * 100;
  }
  
  // Update circular progress
  const circle = document.getElementById('progressRingFill');
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = offset;
  
  // Update percentage display
  document.getElementById('percentageDisplay').textContent = percent.toFixed(2) + '%';
  
  // Update stats
  const daysPassed = Math.floor((now - (now < start ? start : new Date(displayYear, 0, 1))) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil((new Date(displayYear + 1, 0, 1) - now) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.ceil(daysPassed / 7);
  
  document.getElementById('daysPassed').textContent = Math.max(0, daysPassed).toLocaleString();
  document.getElementById('daysRemaining').textContent = Math.max(0, daysRemaining).toLocaleString();
  document.getElementById('weekNumber').textContent = Math.max(1, weekNumber);
  
  // Update linear progress
  document.getElementById('linearFill').style.width = percent + '%';
  document.getElementById('monthProgress').textContent = `${currentMonth + 1}/12 months`;
  
  // Update month markers
  const markers = document.querySelectorAll('.month-marker');
  markers.forEach((marker, index) => {
    if (index <= currentMonth) {
      marker.classList.add('active');
    } else {
      marker.classList.remove('active');
    }
  });
  
  // Update datetime
  const months = ["January", "February", "March", "April", "May", "June", 
                  "July", "August", "September", "October", "November", "December"];
  
  document.getElementById('dateDisplay').textContent = 
    `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');
  
  document.getElementById('timeDisplay').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
  
  // Update timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  document.getElementById('timezone').textContent = timeZone;
  
  // Update milestone
  const nextMilestone = getNextMilestone(percent);
  const milestoneText = percent >= 100 ? 'Year completed! 🎉' : `Next milestone: ${nextMilestone}%`;
  document.getElementById('milestoneText').textContent = milestoneText;
  
  // Handle completion
  const banner = document.getElementById('completionBanner');
  if (isCompleted) {
    banner.classList.add('show');
    const remainingMs = oneHourAfterYear - now;
    const hrs = String(Math.floor(remainingMs / 3600000)).padStart(2, '0');
    const mins = String(Math.floor((remainingMs % 3600000) / 60000)).padStart(2, '0');
    const secs = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, '0');
    document.getElementById('countdown').textContent = `${hrs}:${mins}:${secs}`;
  } else {
    banner.classList.remove('show');
  }
}

// Initialize
createParticles();
updateAll();
setInterval(updateAll, 1000);

// Add smooth transitions on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.year-card').style.opacity = '1';
  }, 100);
});