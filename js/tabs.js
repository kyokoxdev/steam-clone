/**
 * Tabs System for Game Details Page
 * 
 * This script handles the tabbed interface for the game details page,
 * allowing users to switch between different content sections.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize tabs on the game details page
  initTabs();

  // Initialize system requirements tabs
  initRequirementTabs();

  // Initialize system comparison tool
  initSystemComparison();
});

/**
 * Initialize the main content tabs
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  if (!tabButtons.length || !tabPanels.length) return;
  
  // Add click event to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the tab ID from the data attribute
      const tabId = button.dataset.tab;
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Add active class to corresponding panel
      const targetPanel = document.getElementById(`${tabId}-tab`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
      
      // Store the active tab in session storage for persistence
      sessionStorage.setItem('activeGameTab', tabId);
    });
  });
  
  // Check for saved tab preference
  const savedTab = sessionStorage.getItem('activeGameTab');
  if (savedTab) {
    const savedButton = document.querySelector(`.tab-button[data-tab="${savedTab}"]`);
    if (savedButton) {
      savedButton.click();
    }
  }
}

/**
 * Initialize the system requirements tabs
 */
function initRequirementTabs() {
  const reqTabs = document.querySelectorAll('.req-tab');
  const reqPanels = document.querySelectorAll('.req-panel');
  
  if (!reqTabs.length || !reqPanels.length) return;
  
  reqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      // Remove active class from all tabs and panels
      reqTabs.forEach(t => t.classList.remove('active'));
      reqPanels.forEach(p => p.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Add active class to corresponding panel
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * Initialize the system comparison tool
 */
function initSystemComparison() {
  const compareBtn = document.getElementById('compare-specs');
  const resultsContainer = document.querySelector('.comparison-results');
  
  if (!compareBtn || !resultsContainer) return;
  
  compareBtn.addEventListener('click', () => {
    // Get user input values
    const cpuInput = document.getElementById('cpu').value;
    const gpuInput = document.getElementById('gpu').value;
    const ramInput = document.getElementById('ram').value;
    
    // Simple validation
    if (!cpuInput || !gpuInput || !ramInput) {
      alert('Please fill in all system specification fields.');
      return;
    }
    
    // Show results container
    resultsContainer.style.display = 'block';
    
    // In a real implementation, we would compare against a database
    // For this demo, we'll just do some simple string matching
    
    // CPU comparison
    const cpuResult = document.querySelector('.result-item:nth-child(1) .result-status');
    setComparisonResult(cpuResult, cpuInput, [
      'i7', 'i9', 'ryzen 7', 'ryzen 9', '5800', '5900', '3800', '3900',
      'ryzen 5', 'i5-9', 'i5-10', 'i5-11', 'i5-12'
    ]);
    
    // GPU comparison
    const gpuResult = document.querySelector('.result-item:nth-child(2) .result-status');
    setComparisonResult(gpuResult, gpuInput, [
      'rtx', 'gtx 1660', 'gtx 1070', 'gtx 1080', 'rx 580', 'rx 590',
      'rx 5700', 'rx 6700', 'radeon 6', 'radeon 7'
    ]);
    
    // RAM comparison
    const ramResult = document.querySelector('.result-item:nth-child(3) .result-status');
    const ramValue = parseInt(ramInput);
    if (!isNaN(ramValue)) {
      if (ramValue >= 16) {
        setResultStatus(ramResult, 'Exceeds recommended', 'excellent');
      } else if (ramValue >= 12) {
        setResultStatus(ramResult, 'Meets recommended', 'good');
      } else if (ramValue >= 8) {
        setResultStatus(ramResult, 'Meets minimum', 'ok');
      } else {
        setResultStatus(ramResult, 'Below minimum', 'poor');
      }
    } else {
      // Try to extract numbers from the string
      const ramMatch = ramInput.match(/\d+/);
      if (ramMatch) {
        const extractedRam = parseInt(ramMatch[0]);
        if (extractedRam >= 16) {
          setResultStatus(ramResult, 'Exceeds recommended', 'excellent');
        } else if (extractedRam >= 12) {
          setResultStatus(ramResult, 'Meets recommended', 'good');
        } else if (extractedRam >= 8) {
          setResultStatus(ramResult, 'Meets minimum', 'ok');
        } else {
          setResultStatus(ramResult, 'Below minimum', 'poor');
        }
      } else {
        setResultStatus(ramResult, 'Unable to determine', 'unknown');
      }
    }
    
    // Calculate overall result
    const overallResult = document.querySelector('.overall-result .result-status');
    const statusElements = document.querySelectorAll('.result-item .result-status');
    const statusClasses = Array.from(statusElements).map(el => {
      if (el.classList.contains('excellent')) return 3;
      if (el.classList.contains('good')) return 2;
      if (el.classList.contains('ok')) return 1;
      return 0;
    });
    
    const avgStatus = statusClasses.reduce((sum, val) => sum + val, 0) / statusClasses.length;
    
    if (avgStatus >= 2.5) {
      setResultStatus(overallResult, 'Excellent - Game should run smoothly at high settings', 'excellent');
    } else if (avgStatus >= 1.5) {
      setResultStatus(overallResult, 'Good - Game should run well at medium/high settings', 'good');
    } else if (avgStatus >= 0.8) {
      setResultStatus(overallResult, 'OK - Game should run at low/medium settings', 'ok');
    } else {
      setResultStatus(overallResult, 'Below minimum requirements', 'poor');
    }
  });
}

/**
 * Set comparison result based on keyword matching
 */
function setComparisonResult(element, input, keywords) {
  const lowerInput = input.toLowerCase();
  
  // Check for high-end indicators
  const highEndKeywords = keywords.slice(0, Math.ceil(keywords.length / 2));
  const meetMinKeywords = keywords.slice(Math.ceil(keywords.length / 2));
  
  if (highEndKeywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
    setResultStatus(element, 'Exceeds recommended', 'excellent');
  } else if (meetMinKeywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))) {
    setResultStatus(element, 'Meets recommended', 'good');
  } else if (lowerInput.length > 3) {
    setResultStatus(element, 'Likely meets minimum', 'ok');
  } else {
    setResultStatus(element, 'Unknown compatibility', 'unknown');
  }
}

/**
 * Set the result status with appropriate styling
 */
function setResultStatus(element, text, className) {
  element.textContent = text;
  element.className = 'result-status';
  element.classList.add(className);
}