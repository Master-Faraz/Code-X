// components/SimpleStepIndicator.jsx

import React from 'react'

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
    <div className="flex items-center justify-center mb-2.5 ">
        {/* Step 1 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
            {currentStep > 1 ? '✓' : '1'}
        </div>

        {/* Connector 1→2 */}
        <div className={`w-16 h-1 mx-3 rounded ${currentStep > 1 ? 'bg-primary' : 'bg-gray-200'
            }`} />

        {/* Step 2 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
            {currentStep > 2 ? '✓' : '2'}
        </div>

        {/* Connector 2→3 */}
        <div className={`w-16 h-1 mx-3 rounded ${currentStep > 2 ? 'bg-primary' : 'bg-gray-200'
            }`} />

        {/* Step 3 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
            }`}>
            3
        </div>
    </div>
)

export default StepIndicator
