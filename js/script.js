document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev'; 
    const patientName = 'Jessica Taylor';

    
    const authHeader = 'Basic ' + btoa('coalition:skills-test');

    // Fetch Patient Data
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': authHeader  
        }
    })
    .then(response => response.json())
    .then(data => {
        const patient = data.find(p => p.name === patientName);

        if (patient) {
            document.getElementById('name').textContent = patient.name;
            document.getElementById('age').textContent = patient.age;

            const latestBloodPressure = patient.diagnosis_history[0]?.blood_pressure;

            if (latestBloodPressure) {
                document.getElementById('bp').textContent = `${latestBloodPressure.systolic.value}/${latestBloodPressure.diastolic.value} mmHg`;

               
                if (patient.diagnosis_history.length > 0) {
                    const ctx = document.getElementById('bpChart').getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: patient.diagnosis_history.map(h => `${h.month} ${h.year}`), 
                            datasets: [
                                {
                                    label: 'Blood Pressure (Systolic)',
                                    data: patient.diagnosis_history.map(h => h.blood_pressure.systolic.value),
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 2,
                                    fill: false
                                },
                                {
                                    label: 'Blood Pressure (Diastolic)',
                                    data: patient.diagnosis_history.map(h => h.blood_pressure.diastolic.value),
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 2,
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Blood Pressure Over Time'
                                }
                            }
                        }
                    });
                }
            } else {
                document.getElementById('bp').textContent = 'Blood Pressure data unavailable';
            }
        } else {
            alert('Patient not found');
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});

