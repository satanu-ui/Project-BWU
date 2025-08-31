
    
    let currentStep = 1;
        const totalSteps = 4;
        const formData = {};

        function updateProgress() {
            // Update step circles
            for (let i = 1; i <= totalSteps; i++) {
                const stepCircle = document.getElementById(`step-${i}`);
                const stepLabel = stepCircle.nextElementSibling;
                
                if (i < currentStep) {
                    stepCircle.className = 'step-circle completed';
                    stepLabel.className = 'step-label';
                } else if (i === currentStep) {
                    stepCircle.className = 'step-circle active';
                    stepLabel.className = 'step-label active';
                } else {
                    stepCircle.className = 'step-circle';
                    stepLabel.className = 'step-label';
                }
            }
            
            // Update progress bar
            const progressFill = document.getElementById('progress-fill');
            const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }

        function showStep(stepNumber) {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.classList.remove('active');
            });
            
            // Show current step
            document.getElementById(`step${stepNumber}`).classList.add('active');
            
            currentStep = stepNumber;
            updateProgress();
        }

        function nextStep(next) {
            // Validate current step before proceeding
            if (currentStep === 1 && !validateStep1()) {
                return;
            }
            if (currentStep === 2 && !validateStep2()) {
                return;
            }
            
            saveStepData(currentStep);
            showStep(next);
            
            if (next === 4) {
                generateSummary();
            }
        }

        function prevStep(prev) {
            showStep(prev);
        }

        function validateStep1() {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!name) {
                alert('Please enter your name');
                return false;
            }
            
            if (!email || !emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return false;
            }
            
            return true;
        }

        function validateStep2() {
            if (!formData.frequency || !formData.experience) {
                alert('Please select your usage frequency and experience rating');
                return false;
            }
            
            return true;
        }

        function saveStepData(step) {
            switch(step) {
                case 1:
                    formData.name = document.getElementById('name').value.trim();
                    formData.email = document.getElementById('email').value.trim();
                    formData.age = document.getElementById('age').value;
                    break;
                case 2:
                    formData.recommend = document.getElementById('recommend').value;
                    break;
                case 3:
                    formData.strengths = document.getElementById('strengths').value.trim();
                    formData.improvements = document.getElementById('improvements').value.trim();
                    formData.suggestions = document.getElementById('suggestions').value.trim();
                    break;
            }
        }

        function selectRating(type, value) {
            formData[type] = value;
            
            // Update UI to show selected rating
            const container = event.target.parentElement;
            container.querySelectorAll('.rating-option').forEach(option => {
                option.classList.remove('selected');
            });
            event.target.classList.add('selected');
        }

        function generateSummary() {
            const summaryContent = document.getElementById('summary-content');
            let html = '';
            
            const summaryItems = [
                { label: 'Name', value: formData.name },
                { label: 'Email', value: formData.email },
                { label: 'Age Group', value: formData.age || 'Not specified' },
                { label: 'Usage Frequency', value: formData.frequency },
                { label: 'Experience Rating', value: formData.experience },
                { label: 'Recommendation', value: formData.recommend || 'Not specified' },
                { label: 'Liked Most', value: formData.strengths || 'Not specified' },
                { label: 'Areas to Improve', value: formData.improvements || 'Not specified' },
                { label: 'Additional Comments', value: formData.suggestions || 'Not specified' }
            ];
            
            summaryItems.forEach(item => {
                if (item.value) {
                    html += `
                        <div class="summary-item">
                            <span class="summary-label">${item.label}:</span>
                            <span class="summary-value">${item.value}</span>
                        </div>
                    `;
                }
            });
            
            summaryContent.innerHTML = html || '<p>No data to display</p>';
        }

        function submitSurvey() {
            // Save final step data
            saveStepData(4);
            
            // Here you would typically send the data to a server
            console.log('Survey submitted:', formData);
            
            // Show success message
            showStep('success');
            
            // Reset form after 3 seconds (optional)
            setTimeout(() => {
                // Reset form logic would go here
            }, 3000);
        }

        // Initialize progress
        updateProgress();