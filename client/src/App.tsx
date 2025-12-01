import React from 'react';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import { EmailStep } from './components/EmailStep';
import { QuestionStep } from './components/QuestionStep';
import { PersonalInfoStep } from './components/PersonalInfoStep';
import { HealthConcernsStep } from './components/HealthConcernsStep';
import { ServicePreferencesStep } from './components/ServicePreferencesStep';
import { ResultsStep } from './components/ResultsStep';
import { AnimatePresence } from 'framer-motion';

const AssessmentFlow: React.FC = () => {
  const { currentStep } = useAssessment();

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        {currentStep === 0 && <EmailStep key="email" />}
        {currentStep === 1 && <QuestionStep key="questions" />}
        {currentStep === 2 && <PersonalInfoStep key="personal-info" />}
        {currentStep === 3 && <HealthConcernsStep key="concerns" />}
        {currentStep === 4 && <ServicePreferencesStep key="preferences" />}
        {currentStep === 5 && <ResultsStep key="results" />}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <AssessmentProvider>
      <AssessmentFlow />
    </AssessmentProvider>
  );
}

export default App;
