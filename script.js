/*
FOTBOLLSGOLF
 
6 - super lång par
5 - lång par
4 - medel par
3 - kort par
 
1 - hole in one
birdie = par - 1
eagle = par - 2
albatros = par - 3
boogie = par + 1
double boogie = par + 2
triple boogie = par +3 
sopa = > par + 3
 
1. fyll i antal spelare och visa sedan rätt antal rutor för att fylla i namn
2. hål 1-18 eller 10-18 + 1-9 
3. Startknapp
 
kunna ta bort spelare - code brown
 
*/


/* const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate(); */

let course = {};
let players = [];
let indexes = {current: 0, played: []};

let holeForm = document.getElementById("hole_form");
let previousButton = document.getElementById("previous");
let nextButton = document.getElementById("next");
let currentHole = document.getElementById("current_hole");
let holeInputs = document.getElementById("hole_inputs");
let holeInfo = document.getElementById("hole_info");
let holePar = document.getElementById("hole_par");
let holeNumber = document.getElementById("hole_number");
let scoreHeader = document.getElementById("score_header");

(async ()=>{
    if(!(await fetch("https://fpgscore.fredricpersson2.repl.co/info.json").then(async(res)=>{
        if(!res.ok){
            throw "Not ok!!";
        }
        course = await res.json();
        return true;
    }).catch((e)=>{
        error(e)
        return false
    }).finally(()=>{
        document.getElementById("loading").style.display = "none";
    })))
    {
        return;
    }
    //main
    confetti();
    console.log(course)
    document.getElementsByTagName("main")[0].style.display = "inherit";
    document.getElementById("course_title").innerText = course.name;
    if(!(await showPlayerForm().then((d) => {
        if(d.length == 0) return true;
        players = d.map((p)=>{
            return {
                name: p,
                holes: Array.from({length: course.court.length}, ()=>null)
            }
        })
        return true;
    }).catch((e)=>{
        error(e)
        return false;
    })))
    {
        return;
    }
    holeForm.style.display = "inherit";
    addPlayersToForm();
    updateForm();
    addFormEventListeners();

})();

const showPlayerForm = () => {
    return new Promise((resolve, reject) => {
        let f = document.getElementById("player_form");
        f.addEventListener("submit", (e)=>{
            e.preventDefault();
            new FormData(f)
        });
        f.addEventListener("formdata", (e)=>{
            let data = e.formData

            let entries = [...data.entries()];
            entries = entries.filter((el)=>{
                return (new RegExp(/player\_[0-9]/)).test(el[0]) && el[1].length > 0
            })
            entries = entries.map((el)=>{
                return el[1].trim()
            })
            if(entries.length < 1)
            {
                reject("Minst en spelare måste vara med")
            }
            resolve(entries)
            f.style.display = "none";
            

        })
        f.addEventListener("input", (e)=>{
            if(e.target.name != "player_count") return;
            e.target.value = e.target.value.replace(/[^0-9.]/g, '')
            try {
                parseInt(e.target.value)
            }
            catch {
                return;
            }
            if(e.target.value < 1 || e.target.value > 8) return;
            ps = document.getElementById("form_players");
            ps.innerHTML = ""
            for (let i = 0; i < parseInt(e.target.value); i++)
            {
                let pp = document.createElement("input")
                pp.setAttribute("name",`player_${i}`)
                pp.setAttribute("placeholder", `Spelare ${i+1} namn`)
                ps.appendChild(pp)
            }
        })
        document.getElementById("load_previous").addEventListener("click",()=>{
            try{
                let p = window.localStorage.getItem("players");
                if (p == null || p == "")
                {
                    throw "balls"
                }
                players = JSON.parse(p);
                let c = window.localStorage.getItem("course");
                if (c == null || c == "")
                {
                    throw "balls"
                }
                course = JSON.parse(c);
                let ch = window.localStorage.getItem("currentHole");
                if (ch == null || ch == "")
                {
                    throw "balls"
                }
                indexes = JSON.parse(ch);
            }
            catch(e)
            {
                reject("Kunde inte hitta sparat spel");
                return;
            }
            resolve([]);
            f.style.display = "none";
        })
    })
};

const showHole = (data,players) => {
    console.log("showHole called")
    return new Promise((resolve,reject) => {
        
        
    })
}
const error = (e) => {
    console.error(e)
    err = document.getElementById("error");
    err.style.display = "inherit"
    err.appendChild(document.createTextNode(e));
}
const addFormEventListeners = () => {
    holeForm.addEventListener("formdata", (e)=>{
        console.log("formdata event")
        console.log(e)
        let fd = e.formData
        let entries = [...fd.entries()];
        entries.forEach((le) => {
            le[0] = le[0].split("score_player")[1]
            players[parseInt(le[0])].holes[parseInt(data.id)-1] = parseInt(le[1])
        })
        indexes.played.push(indexes.current)
        //save game
        localStorage.setItem("course",JSON.stringify(course));
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("currentHole",JSON.stringify(indexes));
        
    });
    holeForm.addEventListener("input", (e)=>{
        console.log("input event")
        if(!e.target.name.includes("score_player")) return;
        e.target.value = e.target.value.replace(/[^0-9.]/g, '')
        if(parseInt(e.target.value) < 1)
        {
            e.target.value = 1
        }
        new FormData(holeForm) //auto submit on change
    });
    function previousButtonClick(){
        if (indexes.current >= 1)indexes.current--;
        updateForm();
        //updateScoreHeader();
    }
    function nextButtonClick(){
        indexes.current++;
        updateForm();
        //updateScoreHeader();
    }
    previousButton.addEventListener("click", previousButtonClick)
    nextButton.addEventListener("click", nextButtonClick)
}

const updateForm = () => {
    if(indexes.current == course.court.length)
    {
        showScoreBoard();
        return;
    }
    data = course.court[indexes.current];
    console.log(data);
    currentHole.style.display = "inherit";
    holeInfo.innerText = data.info;
    holePar.innerText = data.par;
    holeNumber.innerText = data.id;
    document.querySelectorAll("#current_hole input").forEach((e)=>{
        let existingScore = players[parseInt(e.getAttribute("data-player_id"))].holes[indexes.current]
        e.value = existingScore > 0 ? existingScore : 0;
    })
}
const addPlayersToForm = () => {
    players.forEach((pl,idx)=>{
        let playerLabel = document.createElement("label");
        let playerInput = document.createElement("input");
        let playerInputDec = document.createElement("button");
        let playerInputInc = document.createElement("button");
        let inputRow = document.createElement("div");
        inputRow.className = "input_row"
        playerInputDec.type = "button";
        playerInputInc.type = "button";
        playerInputInc.addEventListener("click",()=>{
            playerInput.value = parseInt(playerInput.value)+1
            playerInput.dispatchEvent(new Event('input', { bubbles: true }));
        })
        playerInputDec.addEventListener("click",()=>{
            if(parseInt(playerInput.value) <= 1) return;
            playerInput.value = parseInt(playerInput.value)-1
            playerInput.dispatchEvent(new Event('input', { bubbles: true }));
        })
        playerInputDec.innerText = "➖"
        playerInputInc.innerText = "➕"
        playerInput.setAttribute("type", "number");
        playerInput.setAttribute("data-player_id",idx)
        playerInput.setAttribute("name", `score_player${idx}`);
        playerInput.id = `score_player${idx}`;
        playerInput.value = 1;
        playerLabel.setAttribute("for", `score_player${idx}`);
        playerLabel.innerText = `${pl.name}:`
        holeInputs.appendChild(playerLabel);
        inputRow.appendChild(playerInputDec)
        inputRow.appendChild(playerInput);
        inputRow.appendChild(playerInputInc);
        holeInputs.appendChild(inputRow);
    });
}
const getParText = (strokes, par) => {
    if (strokes == 1) return "hole in one";
    switch(strokes-par)
    {
        case 0:
            return "par";
        case -1:
            return "birdie";
        case -2:
            return "eagle";
        case -3:
            return "albatros";
        case 1:
            return "bogey";
        case 2:
            return "dubble bogey";
        case 3:
            return "trippel bogey";
    }
    return "";
}
const updateScoreHeader = () => {
    scoreHeader.innerText = "";
    let courtPar = 0;
    course.court.slice(0,indexes.current).forEach((hole)=>{
        courtPar +=hole.par;
    })
    players.forEach((player) => {
        let playerScore = 0;
        player.holes.forEach((hole)=>{
            playerScore+=hole;
        })
        let parText = getParText(playerScore,courtPar);
        let div = document.createElement("div");
        div.innerText = `${player.name}: ${parText}`;
        scoreHeader.appendChild(div);
    })
}
const showScoreBoard = () => {
    currentHole.style.display = "none";
    let scoreBoard = document.getElementById("score_board");
    let totalPar = 0;
    scoreBoard.style.display = "inherit"
    let tr = document.createElement("tr")
    let a = document.createElement("th");
    let from = Math.min(...indexes.played);
    let to = Math.max(...indexes.played);
    let b = document.createElement("th");
    b.innerText = "Par";
    a.innerText = "Hål";
    tr.appendChild(a);
    tr.appendChild(b);
    players.forEach((player)=> {
        let p = document.createElement("th");
        p.innerText = player.name;
        tr.appendChild(p);
    })
    scoreBoard.appendChild(tr);
    course.court.slice(from,to+1).forEach((hole,index)=>{
        let row = document.createElement("tr");
        let id = document.createElement("td");
        let hp = document.createElement("td");
        hp.innerText = hole.par;
        hp.style.fontWeight = "bold"
        id.innerText = hole.id;
        id.className = "table_header"
        totalPar += hole.par;
        row.appendChild(id);
        row.appendChild(hp);
        players.forEach((player)=>{
            let p = document.createElement("td");
            p.innerText = player.holes[from+index] || '-'
            row.appendChild(p)
        })
        scoreBoard.appendChild(row)
    })
    let sumRow = document.createElement("tr");
    let parRow = document.createElement("tr");

    let totalParElement = document.createElement("td");
    totalParElement.innerText = totalPar;
    totalParElement.style.fontWeight = "bold";
    let placeholder = document.createElement("td");
    placeholder.innerText='-';
    let parHeader = document.createElement("td");
    parHeader.innerText = "Par";
    let sumHeader = document.createElement("td");
    sumHeader.innerText = "Summa";
    parRow.appendChild(parHeader);
    parRow.appendChild(totalParElement);
    sumRow.appendChild(sumHeader);
    sumRow.appendChild(placeholder);
    

    players.forEach((player)=> {
        let pl = document.createElement("td");
        let par = document.createElement("td");
        let total = player.holes.reduce((a,b)=>a+b)
        par.innerText = total-totalPar;
        pl.innerText = total;
        sumRow.appendChild(pl);
        parRow.appendChild(par);
    })
    scoreBoard.appendChild(parRow);
    scoreBoard.appendChild(sumRow);
}