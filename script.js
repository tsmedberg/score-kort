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

(async ()=>{
    let holes = {};
    if(!(await fetch("https://fpgscore.fredricpersson2.repl.co/info.json").then(async(res)=>{
        if(!res.ok){
            throw "Not ok!!";
        }
        holes = await res.json();
        return true;
    }).catch((e)=>{
        console.error(e)
        err = document.getElementById("error");
        err.appendChild(document.createTextNode("Vi kunde inte hämta hålen"));
        return false
    }).finally(()=>{
        document.getElementById("loading").style.display = "none";
    })))
    {
        return;
    }
    //main
    confetti();
    document.getElementsByTagName("main")[0].style.display = "inherit";
    console.log(await showPlayerForm());
})();


const createCard = () => {
    let c = document.createElement("div");/*  */
    c.className = "card"
    let f = document.createElement("form")
    c.appendChild(f)
    document.getElementsByTagName("main")[0].appendChild(c)
};
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
                return el[1]
            })
            resolve(entries)

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
            console.log(e)
            ps = document.getElementById("form_players");
            console.log(ps)
            ps.innerHTML = ""
            for (let i = 0; i < parseInt(e.target.value); i++)
            {
                let pp = document.createElement("input")
                pp.setAttribute("name",`player_${i}`)
                pp.setAttribute("placeholder", `Spelare ${i+1} namn`)
                ps.appendChild(pp)
            }
        })
    })
};