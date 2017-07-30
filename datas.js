const widthMap = 5;
const heightMap = 5;
const frequencyDisplay = 3000;

const $toolsList = document.getElementById('toolsList');
const $informationsTool = document.getElementById('informationsTool');
const $map = document.getElementById('map');
const $informationsCityBar = document.getElementById('informationsCity');

class Building {
    constructor(id, name, description, image, people, resourcesProd, resourcesUse, resourcesConstruction, resourcesStorageMax) {
        this.id = id;
        this.class = 'building',
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

const buildingsArray = [farmer, hunter, woodcutter, stonecutter, warehouse, townHall, circus];

const toolsArray = [
    {id: 'removeTool', class: 'tool', name: 'Remove', descr: 'Remove clicked building', image: 'tool_broom.svg'}
].concat(buildingsArray);

var constructedBuildingsArray = Array(widthMap * heightMap).fill(null);
var initialDatas = {people: 0, food: 2, log: 4, stone: 0, happiness: 0};
var actualDatas = initialDatas;


// ----------------------------  Display ----------------------------
function createToolsList() {
    $toolsList.innerHTML += toolsArray
        .map( tool => `<div id ="${tool.id}" class="selectable tool">
            <img src="images/${tool.image}" alt="${tool.name}" title="${tool.descr}">
            </div>`)
            .join('');
}

function createMap() {
    $map.innerHTML = Array(widthMap * heightMap).fill(1)
        .map((n, i) => `<div id="tile_${i}" class="tile"></div>`)
        .join('');
}

function createInformationsCityBar() {
    $informationsCityBar.innerHTML = `<p id="people">People : ${Math.trunc(initialDatas.people)}</p>
    <p id="totalFood">Food : ${Math.trunc(initialDatas.food)}</p>
    <p id="totalFood">Log : ${Math.trunc(initialDatas.log)}</p>
    <p id="totalFood">Stone : ${Math.trunc(initialDatas.stone)}</p>
    <p id="totalFood">Happiness : ${Math.trunc(initialDatas.happiness)}</p>`;
}

function displayInformationsTool(idChosenTool) {
    let chosenTool = toolsArray.find( tool => (tool.id == idChosenTool));
    if (!chosenTool) return;

    if (chosenTool.id === 'removeTool') {
        $informationsTool.innerHTML = `<p class="infosToolTitle">${chosenTool.name}</p>
        <p class="infosToolText">${chosenTool.descr}</p>`;
    } else {
        $informationsTool.innerHTML = `<p class="infosToolTitle">${chosenTool.name}</p>
        <p class="infosToolText">${chosenTool.descr}</p>
        <p class="infosToolSubTitle">Construction needs :</p>
        <p class="infosToolText"><img src="images/logo_food.svg" alt="food">${chosenTool.resourcesConstruction.food} <img src="images/logo_log.svg" alt="log">${chosenTool.resourcesConstruction.log} <img src="images/logo_stone.svg" alt="stone">${chosenTool.resourcesConstruction.stone} <img src="images/logo_happiness.png" alt="happiness">${chosenTool.resourcesConstruction.happiness}</p>
        <p class="infosToolSubTitle">Construction products :</p>
        <p class="infosToolText"><img src="images/logo_food.svg" alt="food">${chosenTool.resourcesProd.food} <img src="images/logo_log.svg" alt="log">${chosenTool.resourcesProd.log} <img src="images/logo_stone.svg" alt="stone">${chosenTool.resourcesProd.stone} <img src="images/logo_happiness.png" alt="happiness">${chosenTool.resourcesProd.happiness}</p>`;
    }
}

function deleteInformationsTool(idChosenTool) {
    $informationsTool.innerHTML = '';
}

// ----------------------------  Datas ----------------------------

function datasCalculate(actualDatas, delta){
    // production
    const actualDatasProd = constructedBuildingsArray.filter(building => building != null)
        .reduce((actualDatasProd, building) => {
            Object.keys(building.resourcesProd).forEach(key => actualDatasProd[key] += building.resourcesProd[key]);
            return actualDatasProd;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    // use
    const actualDatasUse = constructedBuildingsArray.filter(building => building != null)
        .reduce((actualDatasUse, building) => {
            Object.keys(building.resourcesUse).forEach(key => actualDatasUse[key] += building.resourcesUse[key]);
            return actualDatasUse;
        }, {food: 0, log: 0, stone: 0, happiness: 0});

    console.log(actualDatas, actualDatasUse, actualDatasProd);

    // calculation
    Object.keys(actualDatasProd).forEach( key => {
        actualDatas[key] += delta * (actualDatasProd[key] - actualDatasUse[key])
    });

    return actualDatas;
}

function updateInformationsBar(actualDatas) {
    $informationsCityBar.innerHTML = `<p id="people">People : ${Math.trunc(actualDatas.people)}</p>
    <p id="totalFood">Food : ${Math.trunc(actualDatas.food)}</p>
    <p id="totalFood">Log : ${Math.trunc(actualDatas.log)}</p>
    <p id="totalFood">Stone : ${Math.trunc(actualDatas.stone)}</p>
    <p id="totalFood">Happiness : ${Math.trunc(actualDatas.happiness)}</p>`;
}

let lastTime = 0;

function displayInformationsPerFrequency(time){
    const delta = (time - lastTime) / frequencyDisplay;

    actualDatas = datasCalculate(actualDatas, delta);
    updateInformationsBar(actualDatas);

    lastTime = time;

    setTimeout( () => 
        requestAnimationFrame((time) => 
            displayInformationsPerFrequency(time)
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

function constructBuilding(tile, idChosenTile, idChosenTool){
    let chosenBuilding = buildingsArray.find( building => (building.id == idChosenTool)); 
    if (!chosenBuilding) return;

    // empty tile ?
    if(constructedBuildingsArray[idChosenTile] != null) {
        alert('This case is not empty. Remove actual building.');
        return;
    }
    
    // unique Townhall ?
    if (idChosenTool === townHall.id && constructedBuildingsArray.find( building => building && (building.id == townHall.id))){
        alert(`The ${townHall.name} is already built.`);
        return;
    }

    // available resources ?
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
        tile.innerHTML = `<img src="images/${chosenBuilding.image}" alt="${chosenBuilding.name}" title="${chosenBuilding.name}">`;
        
        // update datas
        Object.keys(chosenBuilding.resourcesConstruction).forEach( key =>
            actualDatas[key] -= chosenBuilding.resourcesConstruction[key]
        );
        actualDatas.people += chosenBuilding.people;

        updateInformationsBar(actualDatas);
    }
}