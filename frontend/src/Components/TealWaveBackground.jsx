import React from 'react'

const TealWaveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="170 0 400 120"
        >
          <path
            d="M50 350 C0 30, 500 10, 80 400"
            stroke="#0A8F70"
            strokeWidth="0.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="150 30 280 250"
        >
          <path
            d="M0 100 C0 30, 500 10, 80 400"
            stroke="#0A8F70"
            strokeWidth="0.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 100 300 120"
        >
          <path
            d="M0 0 C150 100, 210 200, 300 120"
            stroke="#0A8F70"
            strokeWidth="0.2"
            fill="none"
            strokeLinecap="round"
            transform="rotate(80) translate(0, -265)"
          />
        </svg>

        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 110 230 120"
        >
          <path
            d="M200 0 C10 90, 150 200, 300 10"
            stroke="#0A8F70"
            strokeWidth="0.2"
            fill="none"
            strokeLinecap="round"
            transform="rotate(85) translate(0, -280)"
          />
        </svg>
      </div>
  )
}

export default TealWaveBackground