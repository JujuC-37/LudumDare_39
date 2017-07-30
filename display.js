
// ----------------------------  Display ----------------------------

const $buildingList = document.getElementById('buildingsList');
$buildingList.innerHTML = createBuildingList();

const $toolsList = document.getElementById('toolsList');
$toolsList.innerHTML = createToolBar();

const $map = document.getElementById('map');
$map.innerHTML = createMap();

const $informationsBar = document.getElementById('informations');
displayInformations(performance.now(), $informationsBar);
// ----------------------------  Events ----------------------------

let displayedBuildingsList = document.getElementsByClassName('selectable');
let displayedTiles = document.getElementsByClassName('tile');
let idConstructedBuilding;
let idChosenTile;

for(let building of displayedBuildingsList) {
    building.addEventListener('click', function(event) {
        event.stopPropagation(); 
        idConstructedBuilding = building.id;
    });
}

for(let tile of displayedTiles) {
    tile.addEventListener('click', function(event){
        event.stopPropagation();
        idChosenTile = tile.id.split('_')[1];

        if(idConstructedBuilding) {
            if (idConstructedBuilding === "removeTool") removeBuilding(tile, idChosenTile);
            else constructBuilding(tile, idChosenTile, idConstructedBuilding);
        }
        else{
            alert("In development");
        }
    })
}

document.addEventListener('click', function(event){
    idConstructedBuilding = null;
});