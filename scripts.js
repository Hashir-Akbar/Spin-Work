const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const form = document.querySelector('.form');
const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const errorDisplay = document.querySelector('.error-message');
//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: '0€' },
  { minDegree: 31, maxDegree: 90, value: '100€' },
  { minDegree: 91, maxDegree: 150, value: '0€' },
  { minDegree: 151, maxDegree: 210, value: '250€' },
  { minDegree: 211, maxDegree: 270, value: '0€' },
  { minDegree: 271, maxDegree: 330, value: '500€' },
  { minDegree: 331, maxDegree: 360, value: '0€' },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "rgb(12, 156, 46)",
  "rgb(10, 107, 32)",
  "rgb(12, 156, 46)",
  "rgb(10, 107, 32)",
  "rgb(12, 156, 46)",
  "rgb(10, 107, 32)",
];
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: ['100€', '0€', '250€', '0€', '500€', '0€'],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});
//display value based on the randomAngle
//display value based on the randomAngle
const valueGenerator = () => {
  finalValue.innerHTML = `<p>Value:0€</p>`;
};

function isFormFilled() {
  return nameInput.value.trim() !== '' && phoneInput.value.trim() !== '';
}

// Event listener for form submission
form.addEventListener('submit', (event) => {
  if (!isFormFilled()) {
      console.error('Please fill out the form.');
      event.preventDefault(); // Prevent form submission
  }
});

//Start spinning
spinBtn.addEventListener("click", () => {


  if (!isFormFilled()) {
    errorDisplay.innerHTML = 'Please fill out the form.';
    errorDisplay.style.marginTop = '1em';
    return; // Stop further execution
}

errorDisplay.innerHTML = ''
errorDisplay.style.marginTop = '0em';
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  let spinCount = 0; // Counter to track number of spins
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    myChart.options.rotation = myChart.options.rotation + 3; // Increase rotation speed
    //Update chart with new value;
    myChart.update();
    if (myChart.options.rotation >= 1080) { // 3 spins * 360 degrees per spin
      spinCount++; // Increase the spin count
      if (spinCount >= 3) { // Check if 3 spins are completed
        myChart.options.rotation = 0; // Reset rotation to 0
        valueGenerator(); // Display the result (always 0€ as per your current code)
        clearInterval(rotationInterval); // Stop the rotation
        spinBtn.disabled = false; // Enable the spin button again
      }
    }
  }, 5); // Decreased interval duration for faster spin
});


function saveData() {
  const usernameInput = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  
  const formData = {
    username: usernameInput.value.trim(), // Trim whitespace
    number: phoneInput.value.trim() // Trim whitespace
  };

  // Check if inputs are empty
  if (formData.username === '' || formData.number === '') {
    console.log('Empty inputs. Not saving.');
    return;
  }

  fetch('/save-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (response.ok) {
      // Clear form inputs on successful submission
      usernameInput.value = '';
      phoneInput.value = '';
      console.log('Form inputs cleared.');
      return response.text();
    } else {
      throw new Error('Failed to save data');
    }
  })
  .then(text => console.log(text)) // Handle server response
  .catch(error => console.error(error));
}
