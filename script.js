const widthMap = 5;
const heightMap = 5;

const buildingsArray = [
    {id: 'farm', class: 'building', name: 'Farm', image: 'building_farm.svg'},
    {id: 'hunter', class: 'building', name: 'Hunter', image: 'building_hunter.svg'},
    {id: 'fishery', class: 'building', name: 'Fishery', image: 'building_fishery.svg'},
    {id: 'windmill', class: 'building', name: 'Windmill', image: 'building_windmill.svg'},
    {id: 'warehouse', class: 'building', name: 'Warehouse', image: 'building_warehouse.svg'},
    {id: 'removeTool', class: 'tool', name: 'Remove', image: 'tool_broom.svg'}
];

/* ----------------------------------- Initial Display ----------------------------------- */

/* Buildings list */
const $buildingList = document.getElementById('buildingsList');
$buildingList.innerHTML = buildingsArray
    .map( building => `<div id="${building.id}" class="selectable ${building.class}">
        <img src="images/${building.image}" alt="${building.name}" title="${building.name}">
        </div>`)
    .join('');

/* Map tiles */
const $map = document.getElementById('map');
const totalTiles = widthMap * heightMap;
$map.innerHTML = Array(totalTiles).fill(1)
    .map((n, i) => `<div id="tile_${i}" class="tile"></div>`)
    .join('');

/* ----------------------------------- Buildings --- -------------------------------- */

let displayedBuildingsList = document.getElementsByClassName('selectable');
let displayedTiles = document.getElementsByClassName('tile');
let idConstructedBuilding;

for(let building of displayedBuildingsList) {
    building.addEventListener('click', function(event) {
        event.stopPropagation(); 
        idConstructedBuilding = building.id;
    });
}

for(let tile of displayedTiles) {
    tile.addEventListener('click', function(event){
        event.stopPropagation();
        if(!idConstructedBuilding) return;
        if (idConstructedBuilding === "removeTool") {
            if(window.confirm('Remove this building?')) tile.innerHTML = "";
        } else {
            chosenBuilding = buildingsArray.find( building => (building.id == idConstructedBuilding));
            
            if (!chosenBuilding) return;
            if(tile.innerHTML != "") {
                alert('This case is not empty. Remove');
                return;
            } 
            tile.innerHTML = `<img src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
        }
    })
}


/* ----------------------------------------------------------------------------------------- */
document.addEventListener('click', function(event){
    idConstructedBuilding = null;
});

