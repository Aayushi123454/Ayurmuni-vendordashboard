module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
    animation: {
        shimmer: "shimmer 2s infinite",
    },
    keyframes: {
        shimmer: {
            "100%": {
                transform: "translateX(100%)",
            },
        },
    },
};