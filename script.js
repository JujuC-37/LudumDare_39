const widthMap = 5;
const heightMap = 5;

class Building {
    constructor(id, name, description, image, people, resourcesProd, resourcesUse, resourcesConstruction, resourcesStorageMax) {
        this.id = id;
        this.name = name;
        this.descr = description;
        this.image = image;
        this.people = people;
        this.resourcesProd = resourcesProd;
        this.resourcesUse = resourcesUse;
        this.resourcesStorageMax = resourcesStorageMax;
    }
}

const farmer = new Building('farmer', 'Farmer', 'Products food', 'building_farmer.svg', 4, 
    {food: 2, log: 0, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 8, log: 0, stone: 0, happiness: 8} // storage
);

const hunter = new Building('hunter', 'Hunter', 'Products food', 'building_hunter.svg', 4, 
    {food: 2, log: 0, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 8, log: 0, stone: 0, happiness: 8} // storage
);

const woodcutter = new Building('woodcutter', 'Woodcutter', 'Products logs', 'building_woodcutter.svg', 4, 
    {food: 0, log: 3, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 4, log: 6, stone: 0, happiness: 8} // storage
);

const stonecutter = new Building('stonecutter', 'Stonecutter', 'Products stones', 'building_stonecutter.svg', 4, 
    {food: 0, log: 0, stone: 3, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 4, log: 0, stone: 6, happiness: 8} // storage
);

const warehouse = new Building('warehouse', 'Warehouse', 'Storage local', 'building_warehouse.svg', 0, 
    {food: 0, log: 0, stone: 0, happiness: 0}, // prod
    {food: 0, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 2, stone: 2, happiness: 0}, // constr
    {food: 20, log: 20, stone: 20, happiness: 8} // storage
);

const townHall = {
    id: 'townHall',
    name: 'TownHall',
    descr: 'Displays city datas and allows trade',
    image: 'building_townhall.svg',
    resourcesProd: {food: 0, log: 10, stone: 10, happiness: 0}
}

const buildingsArray = [farmer, hunter, woodcutter, stonecutter, warehouse, townHall];

const toolsArray = [
    {id: 'removeTool', class: 'tool', name: 'Remove', image: 'tool_broom.svg'}
]

var constructedBuildingsArray = Array(widthMap * heightMap).fill(null);

/* ----------------------------------- Initial Display ----------------------------------- */

/* Tool Bar */
const $buildingList = document.getElementById('buildingsList');
$buildingList.innerHTML = buildingsArray
    .map( building => `<div id="${building.id}" class="selectable building">
        <img src="images/${building.image}" alt="${building.name}" title="${building.descr}">
        </div>`)
    .join('');

const $toolsList = document.getElementById('toolsList');
$toolsList.innerHTML = toolsArray
    .map( tool => `<div id ="${tool.id}" class="selectable toll">
        <img src="images/${tool.image}" alt="${tool.name}" title="${tool.descr}">
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

        if(!idConstructedBuilding) return;

        // Demolition
        if (idConstructedBuilding === "removeTool") {
            if(tile.innerHTML != "" && window.confirm('Remove this building?')) {
                tile.innerHTML = '';
                constructedBuildingsArray[idChosenTile] = null;
            }
        }
        
        // Construction
        else {
            chosenBuilding = buildingsArray.find( building => (building.id == idConstructedBuilding));
            
            if (!chosenBuilding) return;
            if(constructedBuildingsArray[idChosenTile] != null) {
                alert('This case is not empty. Remove actual building.');
                return;
            }
            constructedBuildingsArray[idChosenTile] = chosenBuilding;
            tile.innerHTML = `<img src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
            
        }

        console.log(constructedBuildingsArray);
    })
}


/* ----------------------------------------------------------------------------------------- */
document.addEventListener('click', function(event){
    idConstructedBuilding = null;
});

