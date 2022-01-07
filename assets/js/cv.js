const cv = document.getElementById('cv');
const cvDarkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

if (cv){
    // Check if user preference is set, if not check value of cv class for light or dark else it means that colorscheme = auto
    if (localStorage.getItem("colorscheme")) {
        setCVTheme(localStorage.getItem("colorscheme"));
    } else if (cv.classList.contains('colorscheme-light') || cv.classList.contains('colorscheme-dark')) {
        setCVTheme(cv.classList.contains("colorscheme-dark") ? "dark" : "light");
    } else {
        setCVTheme(cvDarkModeMediaQuery.matches ? "dark" : "light");
    }
}

function setCVTheme(theme) {
    cv.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    cv.classList.remove('colorscheme-' + inverse);
    cv.classList.add('colorscheme-' + theme);
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        let theme = cv.classList.contains("colorscheme-dark") ? "light" : "dark";
        setCVTheme(theme);
    });
}