// tailwind.config.js
module.exports = {
    important: true,
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            height: {
                '120': '34rem',
            },
            minWidth: {
                '300': '1000px'
            },
            borderRadius: {
                '25': '25px'
            }
        },
        
    },
    variants: {
        extend: {},
    },
    plugins: [],
}