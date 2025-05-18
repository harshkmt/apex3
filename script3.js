// Quiz Data and Functionality
const quizData = [
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correct: 3
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Central Style Sheets",
            "Cascading Style Sheets",
            "Cascading Simple Sheets",
            "Cars SUVs Sailboats"
        ],
        correct: 1
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hypertext Markup Language",
            "Hypertext Markdown Language",
            "Hyperloop Machine Language",
            "Helicopters Terminals Motorboats Lamborginis"
        ],
        correct: 0
    },
    {
        question: "Which year was JavaScript launched?",
        options: ["1996", "1995", "1994", "All of the above"],
        correct: 1
    },
    {
        question: "What is the main purpose of media queries in CSS?",
        options: [
            "To fetch data from APIs",
            "To create responsive designs",
            "To add animations to elements",
            "To validate form inputs"
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
const totalQuestions = quizData.length;

document.getElementById('total-questions').textContent = totalQuestions;

function loadQuestion() {
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const progressElement = document.getElementById('current-question');
    
    // Update progress
    progressElement.textContent = currentQuestion + 1;
    
    // Clear previous options
    optionsElement.innerHTML = '';
    
    // Load current question
    const currentQuizData = quizData[currentQuestion];
    questionElement.textContent = currentQuizData.question;
    
    // Create options
    currentQuizData.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('quiz-option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(optionElement);
    });
    
    // Update button states
    document.getElementById('prev-btn').disabled = currentQuestion === 0;
    document.getElementById('next-btn').textContent = 
        currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next';
    
    // Hide result if showing
    document.getElementById('quiz-result').style.display = 'none';
}

function selectOption(index) {
    const options = document.querySelectorAll('.quiz-option');
    const currentQuizData = quizData[currentQuestion];
    
    // Remove any existing selections
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark selected option
    options[index].classList.add('selected');
    
    // Check if correct
    if (index === currentQuizData.correct) {
        options[index].classList.add('correct');
    } else {
        options[index].classList.add('incorrect');
        options[currentQuizData.correct].classList.add('correct');
    }
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const selectedOption = document.querySelector('.quiz-option.selected');
    
    if (!selectedOption) {
        showResult('Please select an answer before proceeding.', false);
        return;
    }
    
    // Check if answer is correct
    const currentQuizData = quizData[currentQuestion];
    if (selectedOption.textContent === currentQuizData.options[currentQuizData.correct]) {
        score++;
    }
    
    if (currentQuestion < totalQuestions - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showQuizResult();
    }
});

function showQuizResult() {
    const resultElement = document.getElementById('quiz-result');
    resultElement.textContent = `You scored ${score} out of ${totalQuestions}!`;
    resultElement.className = 'quiz-result success';
    resultElement.style.display = 'block';
    
    // Reset quiz
    setTimeout(() => {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    }, 3000);
}

function showResult(message, isSuccess) {
    const resultElement = document.getElementById('quiz-result');
    resultElement.textContent = message;
    resultElement.className = isSuccess ? 'quiz-result success' : 'quiz-result error';
    resultElement.style.display = 'block';
}

// Image Carousel Functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-image');
const totalSlides = slides.length;

// Create indicators
const indicatorsContainer = document.querySelector('.carousel-indicators');
for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
}

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

document.getElementById('next-carousel').addEventListener('click', nextSlide);
document.getElementById('prev-carousel').addEventListener('click', prevSlide);

// Auto-rotate carousel
let carouselInterval = setInterval(nextSlide, 5000);

// Pause on hover
const carousel = document.querySelector('.carousel-container');
carousel.addEventListener('mouseenter', () => {
    clearInterval(carouselInterval);
});

carousel.addEventListener('mouseleave', () => {
    carouselInterval = setInterval(nextSlide, 5000);
});

// API Data Fetching
const apiEndpoints = {
    jokes: 'https://official-joke-api.appspot.com/random_joke',
    quotes: 'https://api.quotable.io/random',
    weather: 'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true'
};

document.getElementById('fetch-btn').addEventListener('click', fetchApiData);

async function fetchApiData() {
    const apiSelect = document.getElementById('api-select');
    const selectedApi = apiSelect.value;
    const apiResult = document.getElementById('api-result');
    
    apiResult.innerHTML = '<p>Loading data...</p>';
    
    try {
        const response = await fetch(apiEndpoints[selectedApi]);
        const data = await response.json();
        
        apiResult.innerHTML = '';
        
        if (selectedApi === 'jokes') {
            apiResult.innerHTML = `
                <div class="api-item">
                    <p><strong>Joke:</strong> ${data.setup}</p>
                    <p><strong>Punchline:</strong> ${data.punchline}</p>
                </div>
            `;
        } else if (selectedApi === 'quotes') {
            apiResult.innerHTML = `
                <div class="api-item">
                    <p><strong>Quote:</strong> "${data.content}"</p>
                    <p><strong>Author:</strong> ${data.author}</p>
                </div>
            `;
        } else if (selectedApi === 'weather') {
            apiResult.innerHTML = `
                <div class="api-item">
                    <p><strong>Temperature:</strong> ${data.current_weather.temperature}°C</p>
                    <p><strong>Wind Speed:</strong> ${data.current_weather.windspeed} km/h</p>
                    <p><strong>Weather Code:</strong> ${getWeatherDescription(data.current_weather.weathercode)}</p>
                </div>
            `;
        }
    } catch (error) {
        apiResult.innerHTML = `
            <div class="api-item error">
                <p>Error fetching data. Please try again later.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown weather condition';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
    updateCarousel();
});