export async function changeCurrentImage() {
    const response = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=ap9MW6-kwkmLkjbbJDgCXO4OHqPQtVpFP_dha2cT8io`);
    const data = await response.json();
    document.querySelector('.body-background').style.background = `url('${data.urls.full}') fixed no-repeat`;
    
}