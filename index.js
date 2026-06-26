const result = document.getElementById("result");
const content = document.querySelector(".content");
const card=document.querySelector(".content");

document.addEventListener("click",(e)=>{

    const ripple=document.createElement("span");

    ripple.className="ripple";

    ripple.style.left=e.pageX+"px";

    ripple.style.top=e.pageY+"px";

    ripple.style.width="20px";

    ripple.style.height="20px";

    document.body.appendChild(ripple);

    setTimeout(()=>{
        ripple.remove();
    },600);

});
const words = [
    ".....Spotify Track Finder",
    ".....Find Any Song",
    ".....Search song with correct name"
];
const typing = document.getElementById("typing");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {

    const current = words[wordIndex];

    if (!deleting) {
        typing.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
            deleting = true;
            setTimeout(type, 1000);
            return;
        }
    } else {
        typing.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            charIndex = 0;
        }
    }

    setTimeout(type, deleting ? 50 : 100);
}

type();
async function getTrack() {

    const song = document.getElementById("trackUrl").value.trim();

    if(song === ""){
        alert("Please Enter Song Name");
        return;
    }

    result.innerHTML = "<h2>Loading...</h2>";

    try{

        const response = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(song)}&entity=song&limit=1`
        );

        if(!response.ok){
            throw new Error("Unable to fetch song");
        }

        const data = await response.json();

        console.log(data);

        if(data.resultCount === 0){
            throw new Error("Song Not Found");
        }

        const track = data.results[0];

        result.innerHTML = `
            <div class="track-card">

                <img
                src="${track.artworkUrl100.replace("100x100","600x600")}"
                width="220"
                style="border-radius:15px;">

                <h2>${track.trackName}</h2>

                <p><b>Artist:</b> ${track.artistName}</p>

                <p><b>Album:</b> ${track.collectionName}</p>

                <p><b>Genre:</b> ${track.primaryGenreName}</p>

                <p><b>Release:</b>
                ${track.releaseDate.substring(0,10)}
                </p>

                <br><br>

                <a href="${track.trackViewUrl}" target="_blank">
                    Open in Apple Music
                </a>

                <br><br>

                <button onclick="goBack()">
                    Search Again
                </button>

            </div>
        `;

        content.classList.add("flip");

    }

    catch(error){

        console.log(error);

        result.innerHTML = `
            <h2>${error.message}</h2>

            <button onclick="goBack()">
                Search Again
            </button>
        `;

        content.classList.add("flip");

    }

}

function goBack(){

    content.classList.remove("flip");

    result.innerHTML = "";

    document.getElementById("trackUrl").value = "";

}