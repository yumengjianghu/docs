

<template>
    <label class="container">
        <input type="checkbox">
        <div class="checkmark">
            <svg viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon">
                <path
                    d="M 24.10 6.29 Q 28.34 7.56 28.00 12.00 Q 27.56 15.10 27.13 18.19 A 0.45 0.45 4.5 0 0 27.57 18.70 Q 33.16 18.79 38.75 18.75 Q 42.13 18.97 43.23 21.45 Q 43.91 22.98 43.27 26.05 Q 40.33 40.08 40.19 40.44 Q 38.85 43.75 35.50 43.75 Q 21.75 43.75 7.29 43.75 A 1.03 1.02 0.0 0 1 6.26 42.73 L 6.42 19.43 A 0.54 0.51 -89.4 0 1 6.93 18.90 L 14.74 18.79 A 2.52 2.31 11.6 0 0 16.91 17.49 L 22.04 7.17 A 1.74 1.73 21.6 0 1 24.10 6.29 Z M 21.92 14.42 Q 20.76 16.58 19.74 18.79 Q 18.74 20.93 18.72 23.43 Q 18.65 31.75 18.92 40.06 A 0.52 0.52 88.9 0 0 19.44 40.56 L 35.51 40.50 A 1.87 1.83 5.9 0 0 37.33 39.05 L 40.51 23.94 Q 40.92 22.03 38.96 21.97 L 23.95 21.57 A 0.49 0.47 2.8 0 1 23.47 21.06 Q 23.76 17.64 25.00 12.00 Q 25.58 9.36 24.28 10.12 Q 23.80 10.40 23.50 11.09 Q 22.79 12.80 21.92 14.42 Z M 15.57 22.41 A 0.62 0.62 0 0 0 14.95 21.79 L 10.01 21.79 A 0.62 0.62 0 0 0 9.39 22.41 L 9.39 40.07 A 0.62 0.62 0 0 0 10.01 40.69 L 14.95 40.69 A 0.62 0.62 0 0 0 15.57 40.07 L 15.57 22.41 Z"
                    fill-opacity="1.000"></path>
                <circle r="1.51" cy="37.50" cx="12.49" fill-opacity="1.000"></circle>
            </svg>
        </div>

    </label>
</template>
<style scoped>
/* @media (min-width: 960px) {
    .VPDoc:not(.has-sidebar) .container {
        display: inline;
        max-width: 1562px;
    }
} */

/* Hide the default checkbox */
.container input {
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.container {
    display: inline;
    position: relative;
    cursor: pointer;
    font-size: 20px;
    user-select: none;
}

/* Create a custom checkbox */
.checkmark {
    cursor: pointer;
    position: relative;
    top: 0;
    left: 0;
    height: 3em;
    width: 3em;
    background-color: transparent;
    border: 2px solid var(--vp-c-divider);
    border-radius: 50%;
    transition: .2s ease-in-out;
    z-index: 2;
}


.icon {
    margin: 5px;
    fill: var(--vp-c-text-1);
    transition: .4s ease-in-out;
    position: relative;
    top: -3px;
    left: 2px;
}

.checkmark:hover {
    /* background-color: #0185d6; */
}

.checkmark:hover .icon {
    fill: #e47542;
    transform: rotate(-8deg);
    transform-origin: bottom left;
}

.checkmark:active .icon {
    transition: all 0.3s;
    transform: rotate(8deg);
}

/* When the checkbox is checked, add a blue background */
.container input:checked~.checkmark {
    background-color: #e44242;

}


.container input:checked~.checkmark .icon {
    fill: white;
    transform: none;
    animation: 0.5s jump_3951;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.container input:checked~.checkmark:after {
    display: block;
}

@keyframes jump_3951 {
    50% {
        transform-origin: center;
        transform: translateY(-0.5em) rotate(-8deg);
    }

    100% {
        transform-origin: center;
        transform: translateY(0em);
    }
}
</style>