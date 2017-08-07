const widthMap = 6; // data in .css too
const heightMap = 6; // data in .css too
const frequencyDisplay = 3000;
const nbBackgroundTiles = 4;

const $toolsList = document.getElementById('toolsList');
const $informationsSection = document.getElementById('informationsSection');
const $map = document.getElementById('map');
const $informationsCityBar = document.getElementById('informationsCity');


// -----------------------------------------------------------------------------
// -------------------------------- Game datas ---------------------------------
// -----------------------------------------------------------------------------

class Building {
    constructor(id, name, description, image, people, resourcesProd, resourcesUse, resourcesConstruction, resourcesStorageMax) {
        this.id = id;
        this.type = 'building',
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

class Tools {
    constructor(id, name, description, image) {
        this.id = id;
        this.type = 'tool';
        this.name = name;
        this.descr = description;
        this.image = image;
    }
}

// ----- Buildings -----
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

const circus = new Building('circus', 'Circus', 'Products happiness', 'building_circus.svg', 2,
    {food: 0, log: 0, stone: 0, happiness: 10}, // prod
    {food: 1, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 10, stone: 0, happiness: 0}, // constr
    {food: 0, log: 0, stone: 0, happiness: 0} // storage
);

const townHall = new Building('townHall', 'TownHall', 'Displays city datas and allows trade', 'building_townhall.svg', 0,
    {food: 0, log: 0, stone: 0, happiness: 0}, // prod
    {food: 0, log: 0, stone: 0, happiness: 0}, // use
    {food: 0, log: 10, stone: 10, happiness: 0}, // constr
    {food: 0, log: 0, stone: 0, happiness: 0} // storage
);

// ----- Tools -----
const broomRemove = new Tools('removeTool', 'Remove', 'Remove clicked building', 'tool_broom.svg');

// ----- General -----
const buildingsArray = [farmer, hunter, woodcutter, stonecutter, warehouse, townHall, circus];
const toolsArray = [broomRemove];
var constructedBuildingsArray = Array(widthMap * heightMap).fill(null);

var initialDatas = {people: 0, food: 2, log: 4, stone: 0, happiness: 0};
var actualDatas = {};

// ----- Functions -----
function upDateDatas(datas, delta){    
    if(Object.keys(datas).length === 0)
        datas = initialDatas;

    // ----- production -----
    const production = constructedBuildingsArray.filter(building => building != null)
        .reduce((resourcesProducted, building) => {
            Object.keys(building.resourcesProd).forEach(key => resourcesProducted[key] += building.resourcesProd[key]);
            return resourcesProducted;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    // ----- use -----
    const use = constructedBuildingsArray.filter(building => building != null)
        .reduce((resourcesUsed, building) => {
            Object.keys(building.resourcesUse).forEach(key => resourcesUsed[key] += building.resourcesUse[key]);
            return resourcesUsed;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    // ----- calculation -----
    Object.keys(production).forEach( key => {
        datas[key] += delta * (production[key] - use[key])
    });

    return datas;
}

// -----------------------------------------------------------------------------
// --------------------------------- Buildings ---------------------------------
// -----------------------------------------------------------------------------

function constructBuilding(tile, idChosenTile, idChosenTool){
    let chosenBuilding = buildingsArray.find( building => (building.id == idChosenTool));
    if (!chosenBuilding) return;

    // ----- empty tile ? -----
    if(constructedBuildingsArray[idChosenTile] != null) {
        alert('This case is not empty. Remove actual building.');
        return;
    }
    
    // ----- unique Townhall ? -----
    if (idChosenTool === townHall.id && constructedBuildingsArray.find( building => building && (building.id == townHall.id))){
        alert(`The ${townHall.name} is already built.`);
        return;
    }

    // ----- available resources ? -----
    let possibleConstruction = true;
    Object.keys(chosenBuilding.resourcesConstruction).forEach ( key => {
        if(chosenBuilding.resourcesConstruction[key] > 0 && chosenBuilding.resourcesConstruction[key] > actualDatas[key]) {
            alert('More resources are needed...');
            possibleConstruction = false;
        }}
    );

    // construction
    if(possibleConstruction) {
        constructedBuildingsArray[idChosenTile] = chosenBuilding;
        tile.innerHTML = `<img class="buildingOnTileMap" src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
        
        // update datas
        Object.keys(chosenBuilding.resourcesConstruction).forEach( key =>
            actualDatas[key] -= chosenBuilding.resourcesConstruction[key]
        );
        actualDatas.people += chosenBuilding.people;

        displayInformationsCity(actualDatas);
    }
}

function removeBuilding(tile, idChosenTile){
    if(tile.innerHTML != "" && window.confirm('Remove this building?')) {
        tile.innerHTML = '';
        constructedBuildingsArray[idChosenTile] = null;
        console.log(constructedBuildingsArray[idChosenTile]);
    }
}


// -----------------------------------------------------------------------------
// ---------------------------------  Display ----------------------------------
// -----------------------------------------------------------------------------

function displayToolsList() {
    // ----- tools -----
    $toolsList.innerHTML += toolsArray
        .map( tool => `<div id ="${tool.id}" class="selectableTool ${tool.type}">
            <img src="images/${tool.image}" alt="${tool.name}" title="${tool.descr}">
            </div>`)
            .join('');

    // ----- buildings -----
    $toolsList.innerHTML += buildingsArray
        .map( building => `<div id ="${building.id}" class="selectableTool ${building.type}">
            <img src="images/${building.image}" alt="${building.name}" title="${building.descr}">
            </div>`)
            .join('');
}

function displayMap() {
    // random backgrounds
    $map.innerHTML = Array(widthMap * heightMap).fill(1)
        .map((n, i) => `<div id="tile_${i}" class="tileMap tileBackground_${Math.trunc((Math.random()*100) % nbBackgroundTiles)}"></div>`)
        .join('');
}

<<<<<<< HEAD
function displayInformationsCity(cityDatas) {
    console.log(cityDatas);
    $informationsCityBar.innerHTML = `<p id="totalPeople"><img src="images/logo_population.svg" alt="population" title="Population"> ${Math.trunc(cityDatas.people)}</p>
    <p id="totalFood"><img src="images/logo_food.svg" alt="food" title="Food"> ${Math.trunc(cityDatas.food)}</p>
    <p id="totalLog"><img src="images/logo_log.svg" alt="log" title="Log"> ${Math.trunc(cityDatas.log)}</p>
    <p id="totalStone"><img src="images/logo_stone.svg" alt="stone" title="Stone"> ${Math.trunc(cityDatas.stone)}</p>
    <p id="totalHappiness"><img src="images/logo_happiness.png" alt="happiness" title="Happiness">${Math.trunc(cityDatas.happiness)}</p>`;
}

function displayInitialInformationsCity(){
    displayInformationsCity(initialDatas);
}

function addContentInformationsSection(chosenObject) {
    $informationsSection.innerHTML = 
        `<p class="infosToolTitle">${chosenObject.name}</p>
        <p class="infosToolText">${chosenObject.descr}</p>
        <p class="infosToolSubTitle">Construction needs :</p>
        <p class="infosToolText"><img src="images/logo_food.svg" alt="food">${chosenObject.resourcesConstruction.food} <img src="images/logo_log.svg" alt="log">${chosenObject.resourcesConstruction.log} <img src="images/logo_stone.svg" alt="stone">${chosenObject.resourcesConstruction.stone} <img src="images/logo_happiness.png" alt="happiness">${chosenObject.resourcesConstruction.happiness}</p>
        <p class="infosToolSubTitle">Construction products :</p>
        <p class="infosToolText"><img src="images/logo_food.svg" alt="food">${chosenObject.resourcesProd.food} <img src="images/logo_log.svg" alt="log">${chosenObject.resourcesProd.log} <img src="images/logo_stone.svg" alt="stone">${chosenObject.resourcesProd.stone} <img src="images/logo_happiness.png" alt="happiness">${chosenObject.resourcesProd.happiness}</p>`;
=======
function createInformationsCityBar() {
    $informationsCityBar.innerHTML = `<p id="totalPeople"><img src="images/logo_population.svg" alt="population" title="Population"> ${Math.trunc(initialDatas.people)}</p>
    <p id="totalFood"><img src="images/logo_food.svg" alt="food" title="Food"> ${Math.trunc(initialDatas.food)}</p>
    <p id="totalLog"><img src="images/logo_log.svg" alt="log" title="Log"> ${Math.trunc(initialDatas.log)}</p>
    <p id="totalStone"><img src="images/logo_stone.svg" alt="stone" title="Stone"> ${Math.trunc(initialDatas.stone)}</p>
    <p id="totalHappiness"><img src="images/logo_happiness.png" alt="happiness" title="Happiness">${Math.trunc(initialDatas.happiness)}</p>`;
>>>>>>> 77e1ad896ac931e3d010d50caf9654698a314944
}

function displayInformationsTool(idReadTool) {
    var chosenObject = toolsArray.find( tool => (tool.id == idReadTool));
    if(!chosenObject)
        var chosenObject = buildingsArray.find( building => (building.id == idReadTool));
    if (!chosenObject)
        return;

    if (chosenObject.type === 'tool') {
        $informationsSection.innerHTML = `<p class="infosToolTitle">${chosenObject.name}</p>
        <p class="infosToolText">${chosenObject.descr}</p>`;
    }
    else if (chosenObject.type === 'building'){
        addContentInformationsSection(chosenObject);
    }
}

function displayInformationsTile(idTile) {
    // building on the tile ?
    let selectedBuilding = constructedBuildingsArray[idTile];
    if(!selectedBuilding) return;

    // what building ?
    let displayedBuilding = buildingsArray.find( building => (building.id == selectedBuilding.id));
    if(!displayedBuilding) return;

    // display informations
    addContentInformationsSection(displayedBuilding);
}

<<<<<<< HEAD
function deleteInformationsTool() {
    $informationsSection.innerHTML = '';
=======
function updateInformationsBar(actualDatas) {
    $informationsCityBar.innerHTML = `<p id="totalPeople"><img src="images/logo_population.svg" alt="population" title="Population"> ${Math.trunc(actualDatas.people)}</p>
    <p id="totalFood"><img src="images/logo_food.svg" alt="food" title="Food"> ${Math.trunc(actualDatas.food)}</p>
    <p id="totalLog"><img src="images/logo_log.svg" alt="log" title="Log"> ${Math.trunc(actualDatas.log)}</p>
    <p id="totalStone"><img src="images/logo_stone.svg" alt="stone" title="Stone"> ${Math.trunc(actualDatas.stone)}</p>
    <p id="totalHappiness"><img src="images/logo_happiness.png" alt="happiness" title="Happiness"> ${Math.trunc(actualDatas.happiness)}</p>`;
>>>>>>> 77e1ad896ac931e3d010d50caf9654698a314944
}

// ----- update display -----
let lastTime = 0;

function updateDisplayPerFrequency(time){
    const delta = (time - lastTime) / frequencyDisplay;

    actualDatas = upDateDatas(actualDatas, delta);
    displayInformationsCity(actualDatas);

    lastTime = time;
    setTimeout( () => 
        requestAnimationFrame((time) => updateDisplayPerFrequency(time))
    , frequencyDisplay);
}
