const widthMap = 5;
const heightMap = 5;
const frequencyDisplay = 3000;

class Building {
    constructor(id, name, description, image, people, resourcesProd, resourcesUse, resourcesConstruction, resourcesStorageMax) {
        this.id = id;
        this.name = name;
        this.descr = description;
        this.image = image;
        this.people = people;
        this.resourcesProd = resourcesProd;
        this.resourcesUse = resourcesUse;
        this.resourcesConstruction = resourcesConstruction;
        this.resourcesStorageMax = resourcesStorageMax;
    }
}

const farmer = new Building('farmer', 'Farmer', 'Products food', 'building_farmer.svg', 4, 
    {food: 5, log: 0, stone: 0, happiness: 0}, // prod
    {food: 2, log: 0, stone: 0, happiness: 1}, // use
    {food: 0, log: 2, stone: 0, happiness: 0}, // constr
    {food: 8, log: 0, stone: 0, happiness: 8} // storage
);

const hunter = new Building('hunter', 'Hunter', 'Products food', 'building_hunter.svg', 4, 
    {food: 3, log: 0, stone: 0, happiness: 0}, // prod
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
    resourcesConstruction: {food: 0, log: 10, stone: 10, happiness: 0}
}

const buildingsArray = [farmer, hunter, woodcutter, stonecutter, warehouse, townHall];

const toolsArray = [
    {id: 'removeTool', class: 'tool', name: 'Remove', descr: 'Remove clicked building', image: 'tool_broom.svg'}
]

var constructedBuildingsArray = Array(widthMap * heightMap).fill(null);
var actualResources = {people: 0, food: 2, log: 0, stone: 0, happiness: 0};

// ----------------------------  Resources ----------------------------


function resourcesCalculate(actualResources, delta){
    const actualResourcesProd = constructedBuildingsArray.filter(building => (building != null && building.id != townHall.id))
        .reduce((actualResourcesProd, building) => {
            Object.keys(actualResourcesProd).forEach(key => actualResourcesProd[key] += building.resourcesProd[key]);
            return actualResourcesProd;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    const actualResourcesUse = constructedBuildingsArray.filter(building => (building != null && building.id != townHall.id))
        .reduce((actualResourcesUse, building) => {
            Object.keys(actualResourcesUse).forEach(key => actualResourcesUse[key] += building.resourcesUse[key]);
            return actualResourcesUse;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    actualResources.food += delta * (actualResourcesProd.food - actualResourcesUse.food);
    actualResources.log += delta * (actualResourcesProd.log - actualResourcesUse.log);
    actualResources.stone += delta * (actualResourcesProd.stone - actualResourcesUse.stone);
    actualResources.happiness += delta * (actualResourcesProd.happiness - actualResourcesUse.happiness);

    return actualResources;
}

// ----------------------------  Display ----------------------------
function createBuildingList(){
    return buildingsArray
        .map( building => `<div id="${building.id}" class="selectable building">
            <img src="images/${building.image}" alt="${building.name}" title="${building.name} : ${building.descr}">
            </div>`)
        .join('');
}

function createToolBar(){
    return toolsArray
        .map( tool => `<div id ="${tool.id}" class="selectable tool">
            <img src="images/${tool.image}" alt="${tool.name}" title="${tool.descr}">
            </div>`)
            .join('');
}

function createMap(){
    return Array(widthMap * heightMap).fill(1)
        .map((n, i) => `<div id="tile_${i}" class="tile"></div>`)
        .join('');
}

let lastTime = 0;

function displayInformations(time, $informationsBar){
    const delta = (time - lastTime) / frequencyDisplay;
    actualResources = resourcesCalculate(actualResources, delta);

    $informationsBar.innerHTML = `<p id="people">People : ${0}</p>
    <p id="totalFood">Food : ${Math.trunc(actualResources.food)}</p>
    <p id="totalFood">Log : ${Math.trunc(actualResources.log)}</p>
    <p id="totalFood">Stone : ${Math.trunc(actualResources.stone)}</p>
    <p id="totalFood">Happiness : ${Math.trunc(actualResources.happiness)}</p>`;

    lastTime = time;
    
    setTimeout( () => 
        requestAnimationFrame((time) => 
            displayInformations(time, $informationsBar)
        )
    , frequencyDisplay);
}

// ---------------------------- Buildings ----------------------------
function removeBuilding(tile, idChosenTile){
    if(tile.innerHTML != "" && window.confirm('Remove this building?')) {
        tile.innerHTML = '';
        constructedBuildingsArray[idChosenTile] = null;
    }
}

function constructBuilding(tile, idChosenTile, idConstructedBuilding){
    let chosenBuilding = buildingsArray.find( building => (building.id == idConstructedBuilding)); 
    if (!chosenBuilding) return;

    if(constructedBuildingsArray[idChosenTile] != null) {
        alert('This case is not empty. Remove actual building.');
        return;
    }
    
    if(idConstructedBuilding === townHall.id && constructedBuildingsArray.find( building => building && (building.id == townHall.id))){
        alert(`The ${townHall.name} is already built.`);
        return;
    }

    constructedBuildingsArray[idChosenTile] = chosenBuilding;
    tile.innerHTML = `<img src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;

    actualResources.people += chosenBuilding.people;
    
    actualResources.food -= chosenBuilding.resourcesConstruction.food;
    actualResources.log -= chosenBuilding.resourcesConstruction.log;
    actualResources.stone -= chosenBuilding.resourcesConstruction.stone;
    actualResources.happiness -= chosenBuilding.resourcesConstruction.happiness;
}