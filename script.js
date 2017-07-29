const widthMap = 5;
const heightMap = 5;

const buildingsArray = [
    {id: 'farm', name: 'Farm', image: 'building_farm.svg'},
    {id: 'hunter', name: 'Hunter', image: 'building_hunter.svg'},
    {id: 'fishery', name: 'Fishery', image: 'building_fishery.svg'},
    {id: 'windmill', name: 'Windmill', image: 'building_windmill.svg'},
    {id: 'warehouse', name: 'Warehouse', image: 'building_warehouse.svg'},
];

/* ----------------------------------- Initial Display ----------------------------------- */

/* Buildings list */
const $buildingList = document.getElementById('buildingsList');
$buildingList.innerHTML = buildingsArray
    .map( building => `<div id="${building.id}" class="building">
        <img src="images/${building.image}" alt="${building.name}" title="${building.name}">
        </div>`)
    .join('');

/* Map tiles */
const $map = document.getElementById('map');
const totalTiles = widthMap * heightMap;
$map.innerHTML = Array(totalTiles).fill(1)
    .map((n, i) => `<div id="tile_${i}" class="tile"></div>`)
    .join('');

/* ----------------------------------- Construction ----------------------------------- */

let displayedBuildingsList = document.getElementsByClassName('building');
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
        chosenBuilding = buildingsArray.find( building => (building.id == idConstructedBuilding));
        
        if (!chosenBuilding) return; 
        tile.innerHTML = `<img src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
        
    })
}

document.addEventListener('click', function(event){
    idConstructedBuilding = null;
})
